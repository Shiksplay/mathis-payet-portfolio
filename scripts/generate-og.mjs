/**
 * Generation de l'image Open Graph (public/og.png, 1200x630).
 *
 * POURQUOI UN SCRIPT : les plateformes (LinkedIn, Slack, X...) ne rasterisent
 * pas le SVG pour les apercus de lien, il faut un bitmap. L'image est donc
 * dessinee en SVG — meme palette et meme geometrie que le site — puis
 * rasterisee avec resvg.
 *
 * Usage :  npm run og
 *
 * Les polices sont telechargees a la demande dans scripts/.fonts (ignore par
 * git) : le depot reste leger, et l'image est regenerable a tout moment.
 */
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const fontDir = join(here, '.fonts')

const FONTS = [
  {
    file: 'SpaceGrotesk.ttf',
    url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/spacegrotesk/SpaceGrotesk%5Bwght%5D.ttf',
  },
  {
    file: 'JetBrainsMono.ttf',
    url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf',
  },
]

async function ensureFonts() {
  await mkdir(fontDir, { recursive: true })
  const paths = []
  for (const font of FONTS) {
    const target = join(fontDir, font.file)
    if (!existsSync(target)) {
      process.stdout.write(`telechargement de ${font.file}...\n`)
      const res = await fetch(font.url)
      if (!res.ok) throw new Error(`${font.url} -> HTTP ${res.status}`)
      await writeFile(target, Buffer.from(await res.arrayBuffer()))
    }
    paths.push(target)
  }
  return paths
}

/** Echappe le texte insere dans le SVG. */
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const CONTENT = {
  name: 'Mathis Payet',
  title: 'RÉSEAUX & TÉLÉCOMMUNICATIONS — CYBERSÉCURITÉ',
  availability: 'Alternance 2026-2027 — administration & sécurité des réseaux',
  contact: 'mathis.payet@rt-iut.re',
}

function buildSvg() {
  // Motif reseau a droite : memes orbites que le fallback SVG du site.
  const cx = 930
  const cy = 315
  const orbits = [0, 60, 120]
    .map(
      (angle) =>
        `<ellipse cx="0" cy="0" rx="250" ry="96" transform="rotate(${angle})" stroke="url(#edge)" stroke-width="1.4" fill="none"/>`,
    )
    .join('')

  const ringNodes = [0, 45, 90, 135, 180, 225, 270, 315]
    .map((a) => `<circle r="4.5" fill="#00E5FF" fill-opacity="0.75" transform="rotate(${a}) translate(166 0)"/>`)
    .join('')

  const outerNodes = [20, 75, 130, 200, 255, 310]
    .map((a) => `<circle r="3.4" fill="#7C5CFC" fill-opacity="0.65" transform="rotate(${a}) translate(250 0)"/>`)
    .join('')

  // Cordes courtes entre noeuds voisins de l'anneau : c'est ce qui fait lire
  // un GRAPHE plutot qu'un modele atomique (orbites seules).
  const chords = [0, 45, 90, 135, 180, 225, 270, 315]
    .map((a) => {
      const r = 166
      const a1 = (a * Math.PI) / 180
      const a2 = ((a + 45) * Math.PI) / 180
      const x1 = (Math.cos(a1) * r).toFixed(1)
      const y1 = (Math.sin(a1) * r).toFixed(1)
      const x2 = (Math.cos(a2) * r).toFixed(1)
      const y2 = (Math.sin(a2) * r).toFixed(1)
      return `<path d="M${x1} ${y1}L${x2} ${y2}M${x1} ${y1}L0 0" stroke="#00E5FF" stroke-opacity="0.22" stroke-width="1"/>`
    })
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glowA" cx="0.78" cy="0.28" r="0.75">
      <stop offset="0" stop-color="#7C5CFC" stop-opacity="0.30"/>
      <stop offset="1" stop-color="#7C5CFC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0.1" cy="0.9" r="0.8">
      <stop offset="0" stop-color="#00E5FF" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#00E5FF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="core" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#00E5FF" stop-opacity="0.28"/>
      <stop offset="0.6" stop-color="#7C5CFC" stop-opacity="0.10"/>
      <stop offset="1" stop-color="#7C5CFC" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="edge" x1="-250" y1="-250" x2="250" y2="250" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#00E5FF" stop-opacity="0.65"/>
      <stop offset="1" stop-color="#7C5CFC" stop-opacity="0.40"/>
    </linearGradient>
    <linearGradient id="mp" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#00E5FF"/>
      <stop offset="1" stop-color="#7C5CFC"/>
    </linearGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#00E5FF"/>
      <stop offset="1" stop-color="#00E5FF" stop-opacity="0"/>
    </linearGradient>
    <!-- Voile de contraste degrade : un rectangle opaque laisserait une
         couture verticale nette au milieu de l'image. -->
    <linearGradient id="veil" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#05070A" stop-opacity="0.94"/>
      <stop offset="0.5" stop-color="#05070A" stop-opacity="0.9"/>
      <stop offset="0.78" stop-color="#05070A" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#05070A" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="#05070A"/>
  <rect width="1200" height="630" fill="url(#glowA)"/>
  <rect width="1200" height="630" fill="url(#glowB)"/>

  <!-- Noyau reseau -->
  <g transform="translate(${cx} ${cy})">
    <circle r="300" fill="url(#core)"/>
    ${orbits}
    <circle r="166" stroke="url(#edge)" stroke-width="1" stroke-opacity="0.45" fill="none"/>
    <circle r="84" stroke="url(#edge)" stroke-width="1" stroke-opacity="0.3" fill="none"/>
    <path d="M-250 0H250M0-250V250M-177-177L177 177M-177 177L177-177" stroke="url(#edge)" stroke-width="0.9" stroke-opacity="0.18"/>
    ${chords}
    ${ringNodes}
    ${outerNodes}
    <circle r="8" fill="#00E5FF"/>
  </g>

  <!-- Voile qui garantit le contraste du texte par-dessus le motif -->
  <rect width="860" height="630" fill="url(#veil)"/>

  <!-- Monogramme -->
  <g transform="translate(80 70) scale(0.85)" fill="none" stroke="url(#mp)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M13 45V20l9.5 13L32 20v25"/>
    <path d="M41 45V20h7a8 8 0 0 1 0 16h-7"/>
  </g>

  <!-- Nom.
       resvg ne selectionne pas les instances d'une police VARIABLE : il rend
       l'axe wght a sa valeur par defaut et ignore font-weight. On epaissit
       donc les glyphes avec un contour de la meme couleur (paint-order place
       le contour sous le remplissage), ce qui reproduit fidelement le
       semi-bold utilise sur le site. -->
  <text x="80" y="326" font-family="Space Grotesk" font-size="92" fill="#E6EDF3"
        stroke="#E6EDF3" stroke-width="2.6" paint-order="stroke" stroke-linejoin="round"
        letter-spacing="-2">${esc(CONTENT.name)}</text>

  <!-- Filet d'accent -->
  <rect x="80" y="372" width="180" height="2" fill="url(#rule)"/>

  <!-- Intitule -->
  <text x="80" y="424" font-family="JetBrains Mono" font-size="19" font-weight="500" fill="#00E5FF" letter-spacing="1.6">${esc(CONTENT.title)}</text>

  <!-- Disponibilite -->
  <text x="80" y="470" font-family="JetBrains Mono" font-size="18" fill="#94A3B8" letter-spacing="0.4">${esc(CONTENT.availability)}</text>

  <!-- Contact -->
  <text x="80" y="556" font-family="JetBrains Mono" font-size="17" fill="#94A3B8" fill-opacity="0.75" letter-spacing="0.4">${esc(CONTENT.contact)}</text>
</svg>`
}

const fontFiles = await ensureFonts()
const svg = buildSvg()

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  background: '#05070A',
  font: {
    fontFiles,
    loadSystemFonts: false,
    defaultFontFamily: 'Space Grotesk',
  },
})

const png = resvg.render().asPng()
const out = join(root, 'public', 'og.png')
await writeFile(out, png)

const svgOut = join(here, 'og.svg')
await writeFile(svgOut, svg, 'utf8')

process.stdout.write(
  `og.png ecrit (${(png.length / 1024).toFixed(0)} Ko) -> ${out}\nsource SVG -> ${svgOut}\n`,
)
