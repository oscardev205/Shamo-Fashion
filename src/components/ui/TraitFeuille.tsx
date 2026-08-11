// src/components/ui/TraitFeuille.tsx
// L'élément signature du site : un petit trait courbe sous les titres de section.
// À utiliser une fois par section-titre maximum — jamais en décoration systématique.

export function TraitFeuille({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 10" className={`trait-feuille ${className}`} aria-hidden="true">
      <path
        d="M2 8 C 16 2, 40 2, 54 8"
        stroke="var(--color-vivrebio-rouge)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}