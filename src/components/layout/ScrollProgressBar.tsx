/**
 * Barre de progression du scroll.
 *
 * Aucune logique JS ici : la largeur est pilotee par la variable CSS
 * `--scroll-progress` posee sur <html> par `useTrackers()`. Le navigateur
 * n'a donc qu'un `transform: scaleX()` a appliquer, compositable sur le GPU.
 */
export function ScrollProgressBar() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-90 h-px bg-hairline/60"
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-accent to-iris"
        style={{
          transform: 'scaleX(var(--scroll-progress, 0))',
          boxShadow: '0 0 12px var(--color-accent)',
        }}
      />
    </div>
  )
}
