/**
 * PAQUETS DE DONNEES
 * ==================
 *
 * Points lumineux qui parcourent les aretes du graphe, comme du trafic routé
 * dans un reseau. C'est l'effet le plus "parlant" de la scene pour un
 * portfolio de reseaux et cybersecurite : le noyau n'est pas qu'une jolie
 * constellation, il TRANSPORTE quelque chose.
 *
 * Tout est calcule dans le vertex shader : chaque paquet connait ses deux
 * extremites (attributs), et sa position n'est qu'un `mix()` pilote par
 * `uTime`. Le CPU n'envoie donc qu'un seul float par frame, et l'ensemble du
 * trafic tient en un draw call.
 */

export const packetsVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uMaxSize;

  attribute vec3  aEnd;      // l'attribut position porte le point de depart
  attribute float aOffset;   // dephasage
  attribute float aSpeed;    // trajets par seconde

  varying float vGlow;
  varying float vProgress;

  void main() {
    // fract() reboucle le trajet indefiniment : arrive au bout, le paquet
    // repart du depart sans qu'aucun etat n'ait besoin d'etre conserve.
    float t = fract(uTime * aSpeed + aOffset);
    vProgress = t;

    vec3 pos = mix(position, aEnd, t);
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Enveloppe en sinus : le paquet emerge du noeud de depart, brille au
    // milieu de l'arete, puis s'eteint en arrivant. Sans ca, les paquets
    // apparaissent et disparaissent d'un coup sur les noeuds.
    vGlow = sin(t * 3.14159265);

    gl_Position = projectionMatrix * mvPosition;

    float dist = max(0.1, -mvPosition.z);
    gl_PointSize = min(uSize * vGlow * uPixelRatio / dist, uMaxSize * uPixelRatio);
  }
`

export const packetsFragmentShader = /* glsl */ `
  uniform vec3 uColorCore;   // blanc chaud : le coeur du paquet
  uniform vec3 uColorEdge;   // cyan : son halo
  uniform float uOpacity;

  varying float vGlow;
  varying float vProgress;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;

    // Deux profils superposes : un coeur tres serre (exposant eleve) qui donne
    // le point net, et un halo large qui accroche le bloom.
    float core = pow(smoothstep(0.30, 0.0, d), 2.0);
    float halo = pow(smoothstep(0.5, 0.0, d), 1.6);

    vec3 color = mix(uColorEdge, uColorCore, core);
    float alpha = (halo * 0.55 + core) * vGlow * uOpacity;

    // Leger fondu supplementaire tout au debut du trajet : evite un pop net
    // sur le noeud de depart quand la vitesse est elevee.
    alpha *= smoothstep(0.0, 0.06, vProgress);

    gl_FragColor = vec4(color, alpha);
  }
`
