"use client";
// src/components/apropos/GaleriePhotosBoutique.tsx
// Galerie de 3 photos de la boutique (1 grande + 2 petites). Cliquer sur une
// photo l'ouvre en grand par-dessus TOUTE la page (sans changer de page).
// "use client" est nécessaire ici car c'est le seul moyen d'avoir du clic/
// interactivité — la page "à propos" elle-même reste un composant serveur
// (elle va chercher des données dans la base).
//
// Détail technique important : l'aperçu plein écran est envoyé directement
// dans <body> via createPortal, au lieu d'être affiché à l'endroit où ce
// composant est utilisé. Sans ça, l'animation FadeIn qui entoure la galerie
// (elle utilise "transform" en CSS) "piège" l'aperçu à l'intérieur de sa
// propre zone au lieu de le laisser recouvrir tout l'écran.

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

type Photo = {
  src: string;
  alt: string;
};

type Props = {
  photoPrincipale: Photo;
  photosSecondaires: [Photo, Photo];
};

export function GaleriePhotosBoutique({ photoPrincipale, photosSecondaires }: Props) {
  const [photoOuverte, setPhotoOuverte] = useState<Photo | null>(null);
  const [monte, setMonte] = useState(false);

  // Le portail a besoin de "document.body", qui n'existe que côté navigateur
  // (pas pendant le rendu initial côté serveur) — d'où cette petite étape.
  useEffect(() => {
    setMonte(true);
  }, []);

  const toutesLesPhotos = [photoPrincipale, ...photosSecondaires];

  const apercu = photoOuverte && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={() => setPhotoOuverte(null)}
    >
      <button
        type="button"
        onClick={() => setPhotoOuverte(null)}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl text-white hover:bg-white/20"
        aria-label="Fermer"
      >
        ✕
      </button>

      <div
        className="relative h-[85vh] w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photoOuverte.src}
          alt={photoOuverte.alt}
          fill
          sizes="100vw"
          className="object-contain"
        />
      </div>

      <p className="absolute bottom-4 text-xs text-white/60">
        Photo {toutesLesPhotos.findIndex((p) => p.src === photoOuverte.src) + 1} / {toutesLesPhotos.length}
      </p>
    </div>
  );

 return (
    <>
      <div className="carte-3d overflow-hidden p-1">
        <button
          type="button"
          onClick={() => setPhotoOuverte(photoPrincipale)}
          className="relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden rounded-2xl"
        >
          <Image
            src={photoPrincipale.src}
            alt={photoPrincipale.alt}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition hover:scale-105"
          />
        </button>

        <div className="mt-1 grid grid-cols-2 gap-1">
          {photosSecondaires.map((photo) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setPhotoOuverte(photo)}
              className="relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 640px) 25vw, 50vw"
                className="object-cover transition hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>

      {monte && photoOuverte ? createPortal(apercu, document.body) : null}
    </>
  );
}