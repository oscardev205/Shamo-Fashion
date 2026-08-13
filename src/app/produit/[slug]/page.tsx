// src/app/produit/[slug]/page.tsx
// Fichier complet : la page d'un article affiche maintenant la galerie de
// toutes ses photos/variantes (GalerieVariantes) au lieu d'une photo unique
// avec un sélecteur de variante textuel.

import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { BoutonLikeProduit } from "@/components/produits/BoutonLikeProduit";
import { SectionAvis } from "@/components/produits/SectionAvis";
import { ProductCard } from "@/components/produits/ProductCard";
import { DonneesStructurees } from "@/components/produits/DonneesStructurees";
import { GalerieVariantes } from "@/components/produits/GalerieVariantes";
import { TraitFeuille } from "@/components/ui/TraitFeuille";
import { prisma } from "@/lib/prisma";
import { getProduitBySlug, getProduitsSimilaires } from "@/lib/produits";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const produit = await getProduitBySlug(slug);

  if (!produit) return { title: "Produit introuvable" };

  const description = produit.description.length > 155
    ? produit.description.slice(0, 155) + "..."
    : produit.description;

  return {
    title: produit.nom,
    description,
    openGraph: {
      title: produit.nom,
      description,
      type: "website",
      images: produit.images[0] ? [{ url: produit.images[0].url }] : undefined,
    },
    alternates: {
      canonical: `/produit/${produit.slug}`,
    },
  };
}

export default async function ProduitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const produit = await getProduitBySlug(slug);

  if (!produit) notFound();

  const [similaires, statsAvis] = await Promise.all([
    getProduitsSimilaires(produit.id, produit.categoryId),
    prisma.review.aggregate({ where: { productId: produit.id }, _avg: { note: true }, _count: true }),
  ]);

  const prixMin = produit.variants.length > 0 ? Math.min(...produit.variants.map((v) => v.prix)) : 0;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <DonneesStructurees
        nom={produit.nom}
        slug={produit.slug}
        description={produit.description}
        prixMin={prixMin}
        categorieNom={produit.category.nom}
        categorieSlug={produit.category.slug}
        imageUrl={produit.images[0]?.url}
        noteMoyenne={statsAvis._avg.note ?? undefined}
        nombreAvis={statsAvis._count || undefined}
      />

      <p className="mb-4 text-xs text-encre/40">
        Boutique / {produit.category.nom} / {produit.nom}
      </p>

      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-encre">{produit.nom}</h1>
          {produit.category.unite && (
            <p className="mt-1 text-xs text-encre/40">Format : {produit.category.unite}</p>
          )}
        </div>
        <BoutonLikeProduit productId={produit.id} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-encre/70">{produit.description}</p>

      <p className="mb-2 mt-6 text-xs font-medium text-encre/60">
        Choisissez une photo pour voir le prix et l&apos;ajouter au panier :
      </p>
      <GalerieVariantes produit={produit} />

      {similaires.length > 0 && (
        <div className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-wide text-vivrebio-rouge">Complétez votre panier</p>
          <h2 className="mt-1 text-lg font-bold text-encre">Vous aimerez aussi</h2>
          <TraitFeuille className="mt-2" />
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {similaires.map((p) => (
              <ProductCard key={p.id} produit={p} />
            ))}
          </div>
        </div>
      )}

      <SectionAvis productId={produit.id} />
    </main>
  );
}