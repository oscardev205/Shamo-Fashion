// src/types/index.ts
// Types partagés dans toute l'application.
// On réutilise les types générés par Prisma plutôt que de tout redéfinir à la main.

import { Product, Category, ProductImage, ProductVariant } from "@prisma/client";

// Un produit tel qu'on l'affiche dans l'app, avec sa catégorie, ses images et ses variantes incluses
export type ProductWithRelations = Product & {
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
};

// Une catégorie avec le nombre de produits qu'elle contient (utile pour le menu de filtres)
export type CategoryWithCount = Category & {
  _count: { produits: number };
};

// Format des filtres de la page boutique, lus depuis l'URL (?categorie=...&tri=...)
export type BoutiqueSearchParams = {
  categorie?: string;
  tri?: "recent" | "prix-asc" | "prix-desc";
  recherche?: string;
};