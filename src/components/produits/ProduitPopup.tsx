// src/components/produits/ProduitPopup.tsx
// Fichier complet : la pop-up correspond maintenant à UNE variante précise
// (déjà choisie en cliquant sa photo dans la galerie de l'article) — plus de
// sélecteur à l'intérieur, juste la photo, le prix, la quantité et le panier.
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { formatPrix } from "@/lib/format";
import { ProductImage } from "@/components/ui/ProductImage";
import { useCart } from "@/context/CartContext";
import type { ProductVariant } from "@prisma/client";

type ProduitInfo = { id: string; nom: string; slug: string };

export function ProduitPopup({
  produit,
  variante,
  onClose,
}: {
  produit: ProduitInfo;
  variante: ProductVariant;
  onClose: () => void;
}) {
  const { ajouterAuPanier } = useCart();
  const [quantite, setQuantite] = useState(1);
  const [ajoute, setAjoute] = useState(false);

  function handleAjouter() {
    ajouterAuPanier(
      {
        variantId: variante.id,
        productId: produit.id,
        nom: produit.nom,
        slug: produit.slug,
        taille: variante.taille,
        couleur: variante.couleur,
        prix: variante.prix,
        imageUrl: variante.imageUrl,
      },
      quantite
    );
    setAjoute(true);
    setTimeout(() => setAjoute(false), 1500);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-encre/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-4 dark:bg-[#1c2921]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-encre">
            {produit.nom}
            {(variante.taille || variante.couleur) && (
              <span className="ml-1.5 font-normal text-encre/50">
                — {[variante.taille, variante.couleur].filter(Boolean).join(" · ")}
              </span>
            )}
          </p>
          <button onClick={onClose} aria-label="Fermer" className="shrink-0 rounded-full p-1 text-encre/50 hover:bg-vert-pale">
            <X size={18} />
          </button>
        </div>

        <div className="relative mt-3 aspect-square w-full overflow-hidden rounded-xl">
          <ProductImage slug={produit.slug} nom={produit.nom} imageUrl={variante.imageUrl} />
        </div>

        <p className="mt-3 text-lg font-bold text-vivrebio-vert">{formatPrix(variante.prix)}</p>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-sable">
            <button type="button" onClick={() => setQuantite((q) => Math.max(1, q - 1))} className="px-3 py-1.5 text-sm">
              −
            </button>
            <span className="px-2 text-sm">{quantite}</span>
            <button type="button" onClick={() => setQuantite((q) => q + 1)} className="px-3 py-1.5 text-sm">
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleAjouter}
            className="flex-1 rounded-lg bg-vivrebio-vert px-4 py-2 text-sm font-medium text-white"
          >
            {ajoute ? "Ajouté ✓" : "Ajouter au panier"}
          </button>
        </div>
      </div>
    </div>
  );
}