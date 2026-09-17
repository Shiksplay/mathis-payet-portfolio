/**
 * CHAMP DE DEGRADE ANIME
 * ======================
 *
 * Remplace la librairie ShaderGradient citee dans le guide d'effets.
 *
 * POURQUOI NE PAS UTILISER ShaderGradient
 * ---------------------------------------
 * Elle monte son propre <Canvas> react-three-fiber. La page possede deja un
 * canvas WebGL persistant : en ajouter un second, c'est deux contextes WebGL,
 * deux boucles de rendu et deux fois le cout GPU, sur une page dont tout le
 * budget perf a justement ete construit autour d'un seul contexte. Le shader
 * ci-dessous produit le meme resultat visuel dans le canvas existant, avec la
 * palette exacte du site, pour UN draw call.
 *
 * TECHNIQUE — "domain warping"
 * ----------------------------
 * Un simple bruit fractal donne des taches. Le domain warping consiste a
 * utiliser un premier bruit pour DEPLACER les coordonnees d'echantillonnage
 * d'un second : les formes s'etirent alors en volutes, ce qui lit comme un
 * fluide et non comme du grain. C'est la meme idee que les degrades animes de
 * ShaderGradient, en une trentaine de lignes.
 *
 * Le quad est dessine directement en espace ecran (voir le vertex shader) : il
 * couvre donc toujours exactement le viewport, quelle que soit la position de
 * la camera pilotee par le scroll.
 */

export const gradientFieldVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;

    // On IGNORE volontairement les matrices de vue et de projection : la
    // position est ecrite directement en coordonnees d'horloge (clip space).
    // Le plan de 2x2 unites recouvre donc tout l'ecran en permanence, et la
    // camera ne peut jamais "sortir" du fond.
    // z = 1.0 (moins epsilon) place le quad sur le plan le plus lointain.
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`

export const gradientFieldFragmentShader = /* glsl */ `
  precision mediump float;

  uniform float uTime;
  uniform vec2  uPointer;    // souris normalisee [-1, 1]
  uniform float uAspect;
  uniform float uIntensity;
  uniform vec3  uAbyss;
  uniform vec3  uDeep;
  uniform vec3  uAccent;
  uniform vec3  uIris;

  varying vec2 vUv;

  // --- Bruit de valeur 2D -------------------------------------------------
  // Hash sans texture : suffisant pour des degrades doux et bien moins couteux
  // qu'un simplex noise complet a cette echelle.
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    // Interpolation lissee (courbe de Hermite) : evite les aretes du bruit.
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // Bruit fractal : 3 octaves suffisent pour un fond, chaque octave
  // supplementaire coute une passe de bruit par pixel.
  float fbm(vec2 p) {
    float sum = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 3; i++) {
      sum += amp * valueNoise(p);
      p *= 2.02;      // legerement different de 2.0 pour casser l'alignement
      amp *= 0.5;
    }
    return sum;
  }

  void main() {
    // Correction d'aspect : les volutes restent circulaires, pas etirees.
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0) * 2.2;

    // Derive lente vers le haut + influence tres douce de la souris.
    p += uPointer * 0.12;
    float t = uTime * 0.035;

    // DOMAIN WARPING : deux champs de bruit deplacent les coordonnees du
    // troisieme. C'est l'etape qui transforme des taches en volutes fluides.
    vec2 warp = vec2(
      fbm(p + vec2(0.0, t)),
      fbm(p + vec2(5.2, 1.3) - vec2(t, 0.0))
    );
    float field = fbm(p + warp * 2.4 + vec2(t * 0.6, -t * 0.4));

    // Composition des couleurs : on part du fond quasi noir, on monte vers le
    // bleu profond, puis on n'introduit les accents que dans les hautes
    // valeurs du champ. Resultat : un seul accent domine a la fois, la page ne
    // devient jamais un sapin de Noel.
    vec3 color = mix(uAbyss, uDeep, smoothstep(0.25, 0.75, field));
    color = mix(color, uIris, smoothstep(0.58, 0.92, field) * 0.35);
    color = mix(color, uAccent, smoothstep(0.78, 1.0, field) * 0.18);

    // Vignettage radial : concentre la lumiere au centre, ou vit le contenu.
    float vignette = 1.0 - smoothstep(0.35, 1.15, length(vUv - 0.5) * 1.9);

    gl_FragColor = vec4(color * mix(0.55, 1.0, vignette) * uIntensity, 1.0);
  }
`
