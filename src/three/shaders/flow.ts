/**
 * PARTICULES DE FLUX
 * ==================
 *
 * Nuee de fines particules qui derivent en volutes autour du noyau, pour la
 * sensation de fluide demandee.
 *
 * CHOIX TECHNIQUE — mouvement ANALYTIQUE, pas de simulation
 * ---------------------------------------------------------
 * Un vrai champ de curl-noise advecte les particules : il faut conserver leur
 * position d'une frame a la suivante, donc faire du ping-pong entre deux
 * framebuffers (GPGPU). C'est lourd a mettre en place et a maintenir, et cela
 * ajoute deux passes de rendu par frame.
 *
 * Ici la position est une FONCTION FERMEE du temps : chaque particule sait ou
 * elle se trouve a l'instant t sans rien connaitre de son passe. Aucun etat,
 * aucun framebuffer, un seul draw call — et a l'oeil le resultat est le meme,
 * parce que ce qu'on percoit d'un fluide, c'est le cisaillement, pas la
 * trajectoire exacte d'une particule.
 *
 * Le cisaillement vient de la ROTATION DIFFERENTIELLE : la vitesse angulaire
 * decroit avec la distance a l'axe. Les particules proches tournent plus vite
 * que les lointaines, les alignements se tordent, et des volutes apparaissent.
 * C'est le meme mecanisme qui dessine les bras d'une galaxie.
 */

export const flowVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uMaxSize;
  uniform float uSwirl;

  attribute float aSeed;
  attribute float aScale;

  varying float vFade;

  mat3 rotateY(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
  }

  void main() {
    vec3 p = position;

    // --- Rotation differentielle -----------------------------------------
    // La vitesse ne depend QUE du rayon (et pas de la graine de la particule) :
    // c'est indispensable pour que le cisaillement soit coherent et lise comme
    // un ecoulement, et non comme du bruit.
    float radius = length(p.xz);
    float speed = 0.30 / (0.40 + radius * 0.75);
    p = rotateY(uTime * speed * uSwirl) * p;

    // --- Derive verticale --------------------------------------------------
    // Desynchronisee par particule : la nuee ondule au lieu de monter d'un bloc.
    p.y += sin(uTime * 0.24 + aSeed * 11.0) * 0.30;

    // --- Respiration radiale ----------------------------------------------
    p.xz *= 1.0 + sin(uTime * 0.17 + aSeed * 6.0) * 0.06;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);

    // Les particules du fond s'effacent : elles donnent de la profondeur sans
    // encombrer le premier plan ni saturer le bloom.
    float dist = max(0.1, -mvPosition.z);
    vFade = (1.0 - smoothstep(3.0, 11.0, dist)) * (0.35 + 0.65 * sin(uTime * 0.5 + aSeed * 9.0) * 0.5 + 0.325);

    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = min(uSize * aScale * uPixelRatio / dist, uMaxSize * uPixelRatio);
  }
`

export const flowFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;

  varying float vFade;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;

    // Profil tres doux : ces particules sont une TEXTURE d'ambiance, elles ne
    // doivent jamais concurrencer les noeuds du graphe, qui portent le propos.
    float falloff = pow(smoothstep(0.5, 0.0, d), 1.8);

    gl_FragColor = vec4(uColor, falloff * vFade * uOpacity);
  }
`
