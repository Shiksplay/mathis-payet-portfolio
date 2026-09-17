/**
 * GENERATION DU NOYAU RESEAU
 * ==========================
 *
 * Produit, UNE SEULE FOIS au montage, les tampons (Float32Array) decrivant :
 *  - un nuage de points repartis autour de l'origine (les "noeuds") ;
 *  - un ensemble d'aretes reliant chaque noeud a ses plus proches voisins.
 *
 * Deux principes de performance guident ce fichier :
 *
 * 1. LA TOPOLOGIE EST STATIQUE. Les aretes sont calculees ici, a l'init, et ne
 *    sont plus jamais recalculees. L'animation (pulsation, scintillement) est
 *    entierement faite dans les shaders a partir d'un `uTime`, donc aucun
 *    tampon n'est re-uploade au GPU pendant le rendu.
 *
 * 2. LE RESULTAT EST DETERMINISTE. On utilise un PRNG a graine fixe plutot que
 *    Math.random : le noyau a exactement la meme forme a chaque chargement.
 *    C'est un choix de design (la composition est maitrisee) autant que de
 *    debug (un rendu reproductible).
 */

/** PRNG mulberry32 : rapide, suffisant ici, et surtout reproductible. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface NetworkGraph {
  /** xyz par noeud. */
  positions: Float32Array
  /** Phase de pulsation par noeud, dans [0, 1). */
  seeds: Float32Array
  /** Facteur de taille par noeud, dans [0.55, 1.5]. */
  scales: Float32Array
  /** xyz des deux extremites de chaque arete (2 sommets par arete). */
  linePositions: Float32Array
  /** Phase de scintillement, un scalaire par sommet d'arete. */
  lineSeeds: Float32Array
  nodeCount: number
  edgeCount: number
}

export interface NetworkGraphOptions {
  /** Nombre de noeuds. ~420 sur desktop, ~140 sur mobile. */
  nodeCount: number
  /** Rayon exterieur du noyau, en unites monde. */
  radius: number
  /** Nombre de voisins auxquels chaque noeud tente de se relier. */
  neighbors: number
  /** Graine du PRNG. */
  seed: number
}

export const DEFAULT_GRAPH_OPTIONS: NetworkGraphOptions = {
  nodeCount: 420,
  radius: 2.45,
  neighbors: 3,
  seed: 1337,
}

/**
 * Repartition des noeuds.
 *
 * La DIRECTION suit une spirale de Fibonacci : c'est la maniere la moins
 * couteuse d'obtenir une couverture angulaire reguliere d'une sphere, sans les
 * paquets de points aux poles qu'on obtiendrait en tirant (theta, phi) au sort.
 *
 * Le RAYON est tire aleatoirement mais biaise vers l'exterieur
 * (`0.45 + 0.55 * u^0.75`) : on obtient une coque dense — qui lit bien comme un
 * maillage — tout en gardant assez de noeuds internes pour que la traversee du
 * noyau a la camera reste interessante.
 */
function buildNodes(
  opts: NetworkGraphOptions,
  rand: () => number,
): { positions: Float32Array; seeds: Float32Array; scales: Float32Array } {
  const { nodeCount, radius } = opts
  const positions = new Float32Array(nodeCount * 3)
  const seeds = new Float32Array(nodeCount)
  const scales = new Float32Array(nodeCount)

  // Angle d'or : 2π / φ²
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))

  for (let i = 0; i < nodeCount; i += 1) {
    // y decroit lineairement de +1 a -1 -> anneaux d'aire egale
    const y = 1 - (i / Math.max(1, nodeCount - 1)) * 2
    const ringRadius = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = goldenAngle * i

    const r = radius * (0.45 + 0.55 * Math.pow(rand(), 0.75))

    positions[i * 3] = Math.cos(theta) * ringRadius * r
    positions[i * 3 + 1] = y * r
    positions[i * 3 + 2] = Math.sin(theta) * ringRadius * r

    seeds[i] = rand()
    scales[i] = 0.55 + rand() * 0.95
  }

  return { positions, seeds, scales }
}

/**
 * Construction des aretes.
 *
 * Pour chaque noeud on relie ses `neighbors` plus proches voisins, en ecartant
 * les liens plus longs que `maxLength` (sinon on obtient de grandes cordes qui
 * traversent le noyau et brouillent la lecture) et en dedupliquant les paires.
 *
 * COUT : O(n²) en distances, soit ~176 000 comparaisons pour 420 noeuds — de
 * l'ordre de la milliseconde, execute une seule fois. Inutile de sortir un
 * k-d tree pour ces volumes.
 */
function buildEdges(
  positions: Float32Array,
  opts: NetworkGraphOptions,
  rand: () => number,
): { linePositions: Float32Array; lineSeeds: Float32Array; edgeCount: number } {
  const { nodeCount, neighbors, radius } = opts
  const maxLength = radius * 0.5
  const maxLengthSq = maxLength * maxLength

  const seen = new Set<number>()
  const pairs: number[] = []

  // Tableaux de travail reutilises a chaque iteration : evite d'allouer
  // nodeCount petits tableaux.
  const bestIdx = new Int32Array(neighbors)
  const bestDist = new Float32Array(neighbors)

  for (let i = 0; i < nodeCount; i += 1) {
    bestIdx.fill(-1)
    bestDist.fill(Number.POSITIVE_INFINITY)

    const ax = positions[i * 3] ?? 0
    const ay = positions[i * 3 + 1] ?? 0
    const az = positions[i * 3 + 2] ?? 0

    for (let j = 0; j < nodeCount; j += 1) {
      if (j === i) continue
      const dx = (positions[j * 3] ?? 0) - ax
      const dy = (positions[j * 3 + 1] ?? 0) - ay
      const dz = (positions[j * 3 + 2] ?? 0) - az
      const distSq = dx * dx + dy * dy + dz * dz
      if (distSq > maxLengthSq) continue

      // Insertion triee dans le petit tableau des k meilleurs.
      for (let k = 0; k < neighbors; k += 1) {
        if (distSq < (bestDist[k] ?? Number.POSITIVE_INFINITY)) {
          for (let m = neighbors - 1; m > k; m -= 1) {
            bestDist[m] = bestDist[m - 1] ?? Number.POSITIVE_INFINITY
            bestIdx[m] = bestIdx[m - 1] ?? -1
          }
          bestDist[k] = distSq
          bestIdx[k] = j
          break
        }
      }
    }

    for (let k = 0; k < neighbors; k += 1) {
      const j = bestIdx[k] ?? -1
      if (j < 0) continue
      // Cle canonique (min, max) pour ne compter chaque arete qu'une fois.
      const lo = Math.min(i, j)
      const hi = Math.max(i, j)
      const key = lo * nodeCount + hi
      if (seen.has(key)) continue
      seen.add(key)
      pairs.push(lo, hi)
    }
  }

  const edgeCount = pairs.length / 2
  const linePositions = new Float32Array(edgeCount * 6)
  const lineSeeds = new Float32Array(edgeCount * 2)

  for (let e = 0; e < edgeCount; e += 1) {
    const a = pairs[e * 2] ?? 0
    const b = pairs[e * 2 + 1] ?? 0
    // Les deux sommets d'une arete partagent la meme phase : l'arete
    // scintille d'un seul tenant plutot que de degrader d'un bout a l'autre.
    const phase = rand()

    linePositions[e * 6] = positions[a * 3] ?? 0
    linePositions[e * 6 + 1] = positions[a * 3 + 1] ?? 0
    linePositions[e * 6 + 2] = positions[a * 3 + 2] ?? 0
    linePositions[e * 6 + 3] = positions[b * 3] ?? 0
    linePositions[e * 6 + 4] = positions[b * 3 + 1] ?? 0
    linePositions[e * 6 + 5] = positions[b * 3 + 2] ?? 0

    lineSeeds[e * 2] = phase
    lineSeeds[e * 2 + 1] = phase
  }

  return { linePositions, lineSeeds, edgeCount }
}

/**
 * Attributs des "paquets" qui circulent sur les aretes.
 *
 * Chaque paquet est fige sur UNE arete : il n'a besoin que de ses deux
 * extremites, d'un dephasage et d'une vitesse. Sa position est ensuite
 * entierement calculee dans le vertex shader par interpolation entre les deux
 * bouts — donc aucun tampon n'est remis a jour depuis le CPU.
 */
export interface PacketAttributes {
  /** Extremite de depart, reutilisee comme attribut `position`. */
  starts: Float32Array
  /** Extremite d'arrivee. */
  ends: Float32Array
  /** Dephasage dans [0, 1) : les paquets ne partent pas tous ensemble. */
  offsets: Float32Array
  /** Vitesse, en trajets par seconde. */
  speeds: Float32Array
  count: number
}

/**
 * Repartit `count` paquets sur les aretes du graphe.
 *
 * Les aretes sont tirees au sort (avec remise : plusieurs paquets peuvent
 * partager une arete, ce qui est justement ce qu'on veut voir sur un lien
 * charge). Le PRNG est graine pour que la composition soit reproductible.
 */
export function createPackets(
  graph: NetworkGraph,
  count: number,
  seed = 90210,
): PacketAttributes {
  const rand = mulberry32(seed)
  const starts = new Float32Array(count * 3)
  const ends = new Float32Array(count * 3)
  const offsets = new Float32Array(count)
  const speeds = new Float32Array(count)

  for (let i = 0; i < count; i += 1) {
    const edge = Math.min(graph.edgeCount - 1, Math.floor(rand() * graph.edgeCount))
    const base = edge * 6

    // Une arete sur deux est parcourue a l'envers : le trafic circule dans les
    // deux sens, comme sur un vrai lien.
    const flip = rand() < 0.5
    const aOff = flip ? 3 : 0
    const bOff = flip ? 0 : 3

    starts[i * 3] = graph.linePositions[base + aOff] ?? 0
    starts[i * 3 + 1] = graph.linePositions[base + aOff + 1] ?? 0
    starts[i * 3 + 2] = graph.linePositions[base + aOff + 2] ?? 0
    ends[i * 3] = graph.linePositions[base + bOff] ?? 0
    ends[i * 3 + 1] = graph.linePositions[base + bOff + 1] ?? 0
    ends[i * 3 + 2] = graph.linePositions[base + bOff + 2] ?? 0

    offsets[i] = rand()
    // Plage de vitesses large : le trafic parait irregulier, pas metronomique.
    speeds[i] = 0.12 + rand() * 0.38
  }

  return { starts, ends, offsets, speeds, count }
}

/** Genere le graphe complet. A appeler une fois, sous `useMemo`. */
export function createNetworkGraph(
  overrides: Partial<NetworkGraphOptions> = {},
): NetworkGraph {
  const opts: NetworkGraphOptions = { ...DEFAULT_GRAPH_OPTIONS, ...overrides }
  const rand = mulberry32(opts.seed)

  const { positions, seeds, scales } = buildNodes(opts, rand)
  const { linePositions, lineSeeds, edgeCount } = buildEdges(positions, opts, rand)

  return {
    positions,
    seeds,
    scales,
    linePositions,
    lineSeeds,
    nodeCount: opts.nodeCount,
    edgeCount,
  }
}
