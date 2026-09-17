/**
 * MATERIAU DES ARETES
 * ===================
 *
 * Rendu en `THREE.LineSegments` : la totalite du maillage tient dans un second
 * et dernier draw call.
 *
 * Les aretes sont volontairement tres peu opaques. C'est ce qui distingue un
 * "graphe lumineux" d'un "grillage" : l'accumulation de centaines de traits
 * faibles en melange additif produit une densite lumineuse au centre du noyau,
 * la ou les aretes se superposent.
 */

export const edgesVertexShader = /* glsl */ `
  uniform float uTime;

  attribute float aSeed;   // phase de scintillement, partagee par l'arete

  varying float vFlicker;
  varying float vDistance;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    // Distance a la camera, transmise au fragment shader pour l'estompage.
    vDistance = -mvPosition.z;

    // Scintillement lent, plus calme que celui des noeuds (0.5 vs 0.8) : le
    // maillage sert de fond, les noeuds portent le rythme.
    vFlicker = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * 0.5 + aSeed * 6.2831853));

    gl_Position = projectionMatrix * mvPosition;
  }
`

export const edgesFragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  uniform float uFadeNear;
  uniform float uFadeFar;

  varying float vFlicker;
  varying float vDistance;

  void main() {
    // Estompage par la profondeur : sans lui, les aretes du fond et du premier
    // plan ont la meme intensite et le noyau parait plat. Avec, l'oeil lit
    // immediatement le volume.
    float depthFade = 1.0 - smoothstep(uFadeNear, uFadeFar, vDistance);

    vec3 color = mix(uColorA, uColorB, vFlicker * 0.5);

    gl_FragColor = vec4(color, vFlicker * depthFade * uOpacity);
  }
`
