// src/components/produits/ProductCard.tsx
// Fichier complet : redevient un simple lien vers la page de l'article (qui
// affiche la galerie de ses photos/variantes) — plus de pop-up directe ici.

import Link from "next/link";
import { formatPrixVariantes } from "@/lib/format";
import { ProductImage } from "@/components/ui/ProductImage";
import type { ProductWithRelations } from "@/types";

export function ProductCard({ produit }: { produit: ProductWithRelations }) {
  return (
    <Link
      href={`/produit/${produit.slug}`}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-sable bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-encre/5 dark:bg-[#1c2921]"
    >
      <div className="relative aspect-square w-full shrink-0 overflow-hidden">
        <ProductImage slug={produit.slug} nom={produit.nom} imageUrl={produit.imageUrl} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-3.5">
        <p className="line-clamp-2 text-sm font-medium text-encre">{produit.nom}</p>
        <p className="mt-1 line-clamp-1 text-xs text-encre/50">{produit.description}</p>
        <p className="mt-2 text-sm font-semibold text-vivrebio-vert">{formatPrixVariantes(produit.variants)}</p>
      </div>
    </Link>
  );
}