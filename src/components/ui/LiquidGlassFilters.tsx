/**
 * FILTRES SVG DE REFRACTION — "liquid glass"
 * ==========================================
 *
 * Monte une seule fois (dans <App />) un bloc <svg> invisible contenant les
 * definitions de filtres, referencees ensuite depuis le CSS par
 * `backdrop-filter: url(#liquid-glass)`.
 *
 * COMMENT CA MARCHE
 * -----------------
 * L'effet verre liquide d'Apple n'est pas un simple flou : c'est une
 * REFRACTION, la lumiere du fond est deviee comme a travers une vraie surface
 * de verre. La chaine reproduit exactement ca :
 *
 *   1. feTurbulence      genere un champ de bruit fractal
 *   2. feGaussianBlur    le lisse en larges lobes organiques (sans ce flou, on
 *                        obtient du grain, pas du verre)
 *   3. feDisplacementMap deplace chaque pixel du FOND selon ce champ : les
 *                        canaux R et G du bruit donnent les decalages X et Y
 *
 * POURQUOI PAS "Liquid Glass JS" (la lib du guide)
 * ------------------------------------------------
 * Elle rasterise la page entiere avec html2canvas a chaque frame pour simuler
 * la refraction. C'est un cout de plusieurs dizaines de millisecondes par
 * frame, incompatible avec les 60 fps et avec une scene WebGL qui tourne en
 * parallele. `feDisplacementMap` fait le meme travail dans le compositeur du
 * navigateur, sur le GPU, pour un cout marginal.
 *
 * POURQUOI LE BRUIT N'EST PAS ANIME
 * ---------------------------------
 * Animer `baseFrequency` ou `seed` force le navigateur a recalculer toute la
 * chaine de filtres a chaque frame — c'est la seule facon de faire chuter le
 * framerate avec cette technique. Le caractere "liquide" vient donc de la
 * DEFORMATION (statique) ; le mouvement est porte par le reflet speculaire en
 * CSS, qui suit la souris et ne coute qu'une composition GPU.
 */
export function LiquidGlassFilters() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      // Hors flux, invisible, mais pas `display:none` : Chromium n'applique
      // pas un filtre dont le noeud SVG est retire du rendu.
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        {/* Panneaux de contenu : deformation discrete, le texte derriere reste
            parfaitement lisible. */}
        <filter
          id="liquid-glass"
          x="-15%"
          y="-15%"
          width="130%"
          height="130%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.005 0.011"
            numOctaves={2}
            seed={17}
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation={7} result="soft" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="soft"
            scale={16}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Nav et cartes de projet : refraction plus franche, il n'y a pas de
            texte de contenu derriere ces surfaces. */}
        <filter
          id="liquid-glass-strong"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.016"
            numOctaves={2}
            seed={41}
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation={9} result="soft" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="soft"
            scale={30}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  )
}
