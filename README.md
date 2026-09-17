# Mathis Payet — CV / portfolio immersif 3D

Landing page one-page présentant mon CV, avec une scène 3D persistante en
arrière-plan (« Network Core ») et un switch de langue FR / EN. Site 100 %
statique, sans backend.

**Réseaux & Télécommunications — Cybersécurité** · Recherche d'alternance
2026-2027 en administration et sécurité des réseaux.

---

## Démarrage

Prérequis : **Node.js ≥ 20.19** (testé sur 24.19) et npm.

```bash
npm install
npm run dev      # serveur de dev sur http://localhost:5173
```

## Scripts

| Commande          | Effet                                                          |
| ----------------- | -------------------------------------------------------------- |
| `npm run dev`     | Serveur de développement avec HMR                              |
| `npm run build`   | Vérification TypeScript (`tsc -b`) puis build de production    |
| `npm run preview` | Sert le contenu de `dist/` localement                          |
| `npm run lint`    | oxlint                                                         |
| `npm run og`      | Régénère `public/og.png` (image Open Graph) — voir plus bas    |

Le build échoue à la moindre erreur de type : `tsc` tourne avant Vite.

---

## Stack

| Rôle              | Paquet                                                  |
| ----------------- | ------------------------------------------------------- |
| Build             | Vite 8 + `@vitejs/plugin-react` 6                       |
| UI                | React 19.2 + TypeScript 6 (`strict`)                    |
| 3D                | three 0.186 · `@react-three/fiber` 9 · `drei` 10         |
| Post-processing   | `@react-three/postprocessing` 3 + `postprocessing` 6    |
| Animations 2D     | `motion` 13 (via `motion/react-m` + `LazyMotion`)       |
| Styles            | Tailwind CSS 4 (`@tailwindcss/vite`)                    |
| État global       | zustand 5                                               |
| Icônes            | `lucide-react` 1                                        |

> ⚠️ **React est épinglé en `~19.2.8`, pas `^19.2.8`.**
> `@react-three/fiber@9.7` déclare le peer `react >=19 <19.3`. Un caret ferait
> remonter React en 19.3 et casserait l'installation. Ne pas « moderniser »
> cette ligne de `package.json` sans vérifier d'abord le peer de R3F.

---

## Structure

```
src/
├─ data/
│  ├─ cv.ts          # SOURCE DE VÉRITÉ du contenu FR/EN — ne rien écrire ailleurs
│  │                 #   (CV + projets repris du portfolio Lovable)
│  ├─ ui.ts          # libellés d'interface (nav, boutons, séquence de boot)
│  └─ sections.ts    # ordre des sections, ancres, libellés de nav
├─ store/
│  └─ useAppStore.ts # langue, section active, reduced-motion, tier graphique
├─ hooks/            # useCv, useTrackers, useScrollSpy, useTextScramble, …
├─ lib/
│  ├─ signals.ts       # scroll/pointeur hors React (aucun re-render par frame)
│  └─ cameraKeyframes.ts # un cadrage de caméra par section
├─ three/
│  ├─ SceneCanvas.tsx  # racine du canvas (chargée en lazy)
│  ├─ networkGraph.ts  # génération du noyau (points + arêtes), déterministe
│  ├─ NetworkCore.tsx  # rendu : 2 draw calls
│  ├─ ScrollCamera.tsx # caméra pilotée par le scroll
│  ├─ PointerParallax.tsx
│  ├─ Effects.tsx      # bloom / aberration chromatique / vignette
│  └─ shaders/
└─ components/
   ├─ boot/           # séquence de boot façon terminal
   ├─ layout/         # nav, curseur, barre de progression, fallbacks
   ├─ sections/       # les 8 sections du CV
   └─ ui/             # SectionShell, TiltCard, Reveal, ScrambleHeading, …
```

---

## Comment modifier le site

### Le contenu du CV

Tout est dans **`src/data/cv.ts`**, avec la même forme pour `fr` et `en`
(l'interface `CvContent` garantit qu'aucune clé ne peut manquer d'un côté).
Les libellés d'interface (boutons, titres de sections, lignes du terminal)
sont dans `src/data/ui.ts`.

Aucun texte n'est écrit en dur dans les composants : tout passe par `useCv()`.

### Les cadrages de la caméra

**`src/lib/cameraKeyframes.ts`** contient une entrée par section :

```ts
profil: { position: [2.9, 1.1, 4.6], target: [0, 0, 0], fov: 46 },
```

Le noyau a un rayon d'environ 2.45 unités et est centré sur l'origine : une
caméra à `z = 7.4` le cadre en entier, à `z = 1.5` elle est à l'intérieur.
Modifier une ligne suffit, il n'y a rien d'autre à synchroniser.

La caméra atteint exactement la keyframe d'une section quand cette section est
centrée à l'écran — le mapping est calculé depuis les positions réelles des
sections dans le document (`useTrackers`), pas depuis un pourcentage de scroll.

### Les effets visuels

La scène empile quatre couches, toutes dans **un seul contexte WebGL** :

| Couche | Fichier | Draw calls | Rôle |
| ------ | ------- | ---------- | ---- |
| Dégradé fluide | `three/GradientField.tsx` | 1 | Fond animé en *domain warping* |
| Particules de flux | `three/FlowParticles.tsx` | 1 | Volutes autour du noyau (tier `high` seul) |
| Noyau réseau | `three/NetworkCore.tsx` | 2 | Nœuds + maillage |
| Paquets de données | `three/DataPackets.tsx` | 1 | Trafic circulant sur les arêtes |

**Écarts assumés par rapport au guide d'effets visuels** — les deux librairies
proposées ont été remplacées, pour des raisons de performance :

- **ShaderGradient → shader maison** (`three/shaders/gradientField.ts`).
  ShaderGradient monte son propre `<Canvas>`. La page en a déjà un, persistant :
  un second signifierait deux contextes WebGL, deux boucles de rendu et le
  double du coût GPU. Le shader écrit à la main fait la même chose dans le
  canvas existant, avec la palette exacte du site, pour un draw call.
- **Liquid Glass JS → filtres SVG** (`components/ui/LiquidGlassFilters.tsx`).
  Cette lib rasterise la page entière avec `html2canvas` à chaque frame pour
  simuler la réfraction : plusieurs dizaines de ms par frame, incompatible avec
  60 fps et une scène WebGL en parallèle. `feTurbulence` + `feDisplacementMap`
  produisent la même déviation de la lumière dans le compositeur du navigateur.

Le bruit de réfraction n'est **pas animé**, volontairement : animer
`baseFrequency` ou `seed` force le navigateur à recalculer toute la chaîne de
filtres à chaque frame, et c'est le seul moyen de faire chuter le framerate avec
cette technique. Le caractère « liquide » vient de la déformation (statique) ;
le mouvement est porté par le reflet spéculaire CSS qui suit la souris
(`components/ui/TiltCard.tsx`), lequel ne coûte qu'une composition GPU.

### Le verre liquide (CSS)

Le panneau en verre est composé de quatre couches, documentées dans
`src/index.css` (`.glass-panel`). Deux pièges à connaître avant d'y toucher :

- **`backdrop-filter` imbriqué ne fonctionne pas** : un élément qui en porte un
  crée un *backdrop root*, donc un enfant qui en porte un autre ne voit plus la
  page derrière, seulement son parent. Flou et réfraction doivent vivre sur la
  **même** couche.
- **`isolation: isolate`** limite lui aussi le backdrop au conteneur : ne pas
  l'ajouter sur un panneau en verre.

La réfraction est déclarée en **seconde valeur** de `backdrop-filter`
(*progressive enhancement*). Si un navigateur ne sait pas appliquer `url()` à
cette propriété, la teinte de fond est déjà assez dense pour que le texte reste
lisible sans aucun flou : la réfraction est un bonus, jamais une dépendance de
lisibilité. `.glass-panel--thick` pousse la déformation pour les surfaces sans
texte derrière (nav, cartes de projet).

### La densité et l'apparence du noyau

- Nombre de nœuds, rayon, nombre de voisins : `DEFAULT_GRAPH_OPTIONS` dans
  `src/three/networkGraph.ts`. La `seed` du PRNG rend la forme reproductible —
  la changer donne un autre noyau, tout aussi stable.
- Vitesse de pulsation, taille des points, opacité des arêtes : uniforms dans
  `src/three/NetworkCore.tsx`.
- Lumière et couleurs : shaders dans `src/three/shaders/`.

### La palette et les typographies

Design tokens en CSS-first dans **`src/index.css`**, bloc `@theme`.
Tailwind v4 n'utilise **pas** de `tailwind.config.js` : modifier
`--color-accent` suffit à répercuter le changement sur `text-accent`,
`bg-accent/10`, `border-accent`, etc.

### L'image Open Graph

```bash
npm run og
```

Dessine l'image en SVG (`scripts/generate-og.mjs`, palette identique au site)
puis la rasterise en `public/og.png` 1200×630 avec resvg. Les polices sont
téléchargées à la demande dans `scripts/.fonts` (ignoré par git), donc la
commande a besoin du réseau à son premier lancement.

---

## Performance et accessibilité

### Dégradation graphique

`useDeviceTier` classe l'appareil en trois niveaux :

| Tier     | Condition                                    | Rendu                                              |
| -------- | -------------------------------------------- | -------------------------------------------------- |
| `high`   | desktop, WebGL, > 4 cœurs                    | 420 nœuds, 260 paquets, particules de flux, post-processing complet, parallax souris |
| `low`    | mobile / pointeur grossier / peu de cœurs    | 140 nœuds, 70 paquets, pas de particules de flux, aucun post-processing, DPR plafonné 1.5 |
| `none`   | pas de WebGL, ou `prefers-reduced-motion`    | fallback SVG statique — **three.js n'est pas téléchargé** |

### Choix de performance

- Le canvas est chargé en `React.lazy` : three.js part dans un chunk séparé
  (≈ 264 kB gzip), après le premier rendu HTML. Charge initiale : **≈ 102 kB
  gzip** de JS. Le LCP n'attend jamais la 3D.
- **Pas de `manualChunks` dans `vite.config.ts`, et c'est volontaire.** Un
  `manualChunks` qui regroupait three/R3F créait une arête statique entre le
  chunk d'entrée et le chunk three : Vite émettait alors un
  `<link rel="modulepreload" href="…three….js">` dans `index.html`, et les
  264 kB partaient sur le réseau à *chaque* chargement — y compris pour les
  visiteurs en `prefers-reduced-motion` qui n'affichent jamais la 3D. La
  frontière d'import dynamique suffit à elle seule. Vérifier après tout
  changement de config : `dist/index.html` ne doit contenir **aucun**
  `modulepreload` vers le chunk de la scène.
- Le scroll et la souris sont écrits dans des objets mutables
  (`src/lib/signals.ts`) lus par `useFrame`, pas dans un store React : **aucun
  re-render par frame**.
- La barre de progression est pilotée par la variable CSS `--scroll-progress`
  et un `transform: scaleX()` — compositable sur le GPU, zéro JS par frame.
- La topologie du graphe est calculée une seule fois ; toute l'animation vit
  dans les shaders via `uTime`. Aucun buffer n'est ré-uploadé au GPU.
- La scène tient en **2 draw calls** (`points` + `lineSegments`).
- `motion` est importé via `motion/react-m` + `LazyMotion` : ≈ 30 kB gzip au
  lieu de ≈ 43. Le mode `strict` fait échouer tout usage d'un `motion.*`
  complet, pour éviter une régression de taille de bundle.
  (`motion/react-m` v13 exporte les éléments directement, d'où le
  `import * as m from 'motion/react-m'` et non `import { m }`.)

### Accessibilité

- `prefers-reduced-motion` : 3D remplacée par le fallback statique, séquence de
  boot ignorée, effet « decrypt » désactivé, transitions CSS neutralisées.
- L'effet de brouillage des titres est `aria-hidden` ; le texte final est exposé
  via `aria-label` — un lecteur d'écran n'entend jamais les glyphes aléatoires.
- Le canvas est `aria-hidden` et `pointer-events: none` : purement décoratif, il
  ne capte ni le focus ni les clics.
- Un seul `<h1>` (le nom), puis un `<h2>` par section, `aria-labelledby` sur
  chaque `<section>`.
- Lien d'évitement, focus visible partout, navigation clavier complète, menu
  mobile fermable à Échap.
- Le curseur personnalisé ne remplace le curseur système que sur pointeur fin et
  hors reduced-motion. Il est composé d'un point qui suit la souris **au pixel
  près** et d'un anneau amorti : la précision de pointage est préservée.

### Mesurer Lighthouse

Les scores doivent être mesurés sur le build de production, pas en dev :

```bash
npm run build
npm run preview
```

Puis Chrome DevTools → onglet **Lighthouse** → *Mobile* → Analyser, sur
`http://localhost:4173`. En mode dev, le HMR et les sourcemaps faussent
complètement le score de performance.

---

## Déploiement

Site statique : `npm run build` produit `dist/`, déployable en l'état.

**Vercel / Netlify** — build command `npm run build`, output directory `dist`.
Aucune variable d'environnement, aucune fonction serverless.

Après déploiement, remplacer l'URL `https://mathis-payet.vercel.app/` par le
domaine réel dans :

- `index.html` — `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image`
  et le bloc JSON-LD ;
- `public/robots.txt` et `public/sitemap.xml`.

Les URL absolues sont obligatoires pour `og:image` : les réseaux sociaux ne
résolvent pas les chemins relatifs.

---

## Fichiers utiles

- `public/cv/CV_Mathis_Payet.pdf` — cible du bouton « Télécharger mon CV »
- `public/favicon.svg` — monogramme « MP », SVG pur
- `public/og.png` — aperçu Open Graph (généré par `npm run og`)
- `scripts/og.svg` — source SVG de l'image OG, écrite à chaque génération
