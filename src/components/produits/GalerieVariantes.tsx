// src/components/produits/GalerieVariantes.tsx
// Nouveau fichier : affichée sur la page d'un article, montre toutes ses
// photos/variantes en grille. Cliquer sur une photo ouvre la fiche (photo +
// prix + bouton panier) pour cette variante précise.
"use client";

import { useState } from "react";
import { ProductImage } from "@/components/ui/ProductImage";
import { formatPrix } from "@/lib/format";
import { ProduitPopup } from "@/components/produits/ProduitPopup";
import type { ProductWithRelations } from "@/types";

export function GalerieVariantes({ produit }: { produit: ProductWithRelations }) {
  const [varianteOuverteId, setVarianteOuverteId] = useState<string | null>(null);
  const varianteOuverte = produit.variants.find((v) => v.id === varianteOuverteId);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {produit.variants.map((variante) => (
          <button
            key={variante.id}
            type="button"
            onClick={() => setVarianteOuverteId(variante.id)}
            className="group overflow-hidden rounded-xl border border-sable text-left transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative aspect-square w-full overflow-hidden">
              <ProductImage slug={produit.slug} nom={produit.nom} imageUrl={variante.imageUrl} />
            </div>
            <div className="p-2">
              {(variante.taille || variante.couleur) && (
                <p className="text-xs text-encre/60">{[variante.taille, variante.couleur].filter(Boolean).join(" · ")}</p>
              )}
              <p className="text-sm font-semibold text-vivrebio-vert">{formatPrix(variante.prix)}</p>
            </div>
          </button>
        ))}
      </div>

      {varianteOuverte && (
        <ProduitPopup
          produit={{ id: produit.id, nom: produit.nom, slug: produit.slug }}
          variante={varianteOuverte}
          onClose={() => setVarianteOuverteId(null)}
        />
      )}
    </>
  );
}