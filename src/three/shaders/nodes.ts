/**
 * MATERIAU DES NOEUDS
 * ===================
 *
 * Rendu en `THREE.Points` : un seul draw call pour l'ensemble du nuage.
 *
 * Toute l'animation vit dans le vertex shader, pilotee par `uTime`. Le CPU
 * n'envoie donc qu'un float par frame — aucun tampon de position n'est
 * re-uploade, ce qui est la difference entre 60 fps et 20 fps sur un nuage de
 * plusieurs centaines de points.
 */

export const nodesVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uMaxSize;

  attribute float aSeed;   // phase de pulsation, propre a chaque noeud
  attribute float aScale;  // taille de base, propre a chaque noeud

  varying float vPulse;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    // Pulsation lente et desynchronisee : chaque noeud a sa propre phase, donc
    // le noyau "respire" sans jamais clignoter a l'unisson.
    float pulse = 0.55 + 0.45 * sin(uTime * 0.8 + aSeed * 6.2831853);
    vPulse = pulse;

    gl_Position = projectionMatrix * mvPosition;

    // Attenuation perspective : -mvPosition.z est la distance a la camera.
    // Le plafond uMaxSize evite des disques enormes quand la camera traverse
    // le noyau (section Competences), ce qui saturerait le bloom.
    float dist = max(0.1, -mvPosition.z);
    gl_PointSize = min(uSize * aScale * pulse * uPixelRatio / dist, uMaxSize * uPixelRatio);
  }
`

export const nodesFragmentShader = /* glsl */ `
  uniform vec3 uColorA;  // cyan  — accent principal
  uniform vec3 uColorB;  // violet — accent secondaire
  uniform float uOpacity;

  varying float vPulse;

  void main() {
    // gl_PointCoord va de (0,0) a (1,1) sur le quad du point.
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;

    // Profil lumineux : coeur net + halo qui s'eteint en douceur.
    // L'exposant 2.4 resserre le coeur et evite l'aspect "boule de coton".
    float falloff = pow(smoothstep(0.5, 0.0, d), 2.4);

    // Les noeuds au sommet de leur pulsation tirent vers le violet : cela
    // introduit de la variation chromatique sans jamais melanger les deux
    // accents a parts egales (on garde un accent dominant).
    vec3 color = mix(uColorA, uColorB, vPulse * 0.45);

    gl_FragColor = vec4(color, falloff * vPulse * uOpacity);
  }
`
