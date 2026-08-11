// src/lib/produits.ts
// Fonctions d'accès aux données produits/catégories.
// Centraliser ces requêtes ici évite de dupliquer la logique Prisma dans chaque page.
// Le tri par prix se fait maintenant en mémoire (sur le prix minimum des variantes),
// car le prix n'est plus un champ direct du produit.

import { prisma } from "@/lib/prisma";
import type { BoutiqueSearchParams } from "@/types";

// Récupère toutes les catégories avec leur nombre de produits actifs
export async function getCategories() {
  return prisma.category.findMany({
    include: {
      _count: { select: { produits: { where: { actif: true } } } },
    },
    orderBy: { nom: "asc" },
  });
}

function prixMin(produit: { variants: { prix: number }[] }): number {
  return produit.variants.length > 0 ? Math.min(...produit.variants.map((v) => v.prix)) : 0;
}

// Récupère les produits du catalogue, avec filtres optionnels (catégorie, recherche, tri)
export async function getProduits(params: BoutiqueSearchParams = {}) {
  const { categorie, tri = "recent", recherche } = params;

  const produits = await prisma.product.findMany({
    where: {
      actif: true,
      ...(categorie ? { category: { slug: categorie } } : {}),
      ...(recherche ? { nom: { contains: recherche, mode: "insensitive" as const } } : {}),
    },
    include: { category: true, images: true, variants: true },
    orderBy: { createdAt: "desc" },
  });

  if (tri === "prix-asc") return produits.sort((a, b) => prixMin(a) - prixMin(b));
  if (tri === "prix-desc") return produits.sort((a, b) => prixMin(b) - prixMin(a));
  return produits;
}

// Récupère un seul produit par son slug, pour la fiche produit
export async function getProduitBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true, images: true, variants: true },
  });
}

// Récupère quelques produits phares pour la page d'accueil
export async function getProduitsPhares(limite = 3) {
  return prisma.product.findMany({
    where: { actif: true },
    include: { category: true, images: true, variants: true },
    orderBy: { createdAt: "desc" },
    take: limite,
  });
}

// Ajout : récupère les avis les mieux notés récents, tous produits confondus,
// pour la section témoignages de l'accueil.

export async function getAvisRecents(limite = 4) {
  return prisma.review.findMany({
    where: { note: { gte: 4 } },
    include: {
      user: { select: { nom: true } },
      product: { select: { nom: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limite,
  });
}

// src/lib/produits.ts
// Ajout : produits de la même catégorie, hors le produit courant.

export async function getProduitsSimilaires(productId: string, categoryId: string, limite = 4) {
  return prisma.product.findMany({
    where: { categoryId, id: { not: productId }, actif: true },
    include: { category: true, images: true, variants: true },
    take: limite,
  });
}