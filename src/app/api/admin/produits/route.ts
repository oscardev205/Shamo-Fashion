// src/app/api/admin/produits/route.ts
// Fichier complet : création d'un produit avec sa liste de variantes
// (taille / couleur / prix) au lieu d'un prix et d'un stock uniques.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { genererSlug } from "@/lib/slug";
import { requireAdmin } from "@/lib/admin";

type VarianteEntree = { taille?: string | null; couleur?: string | null; prix: number; imageUrl?: string | null };

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ erreur: "Non autorisé" }, { status: 403 });

  const body = await request.json();
  const { nom, description, categoryId, actif, imageUrl } = body;
  const variants: VarianteEntree[] = Array.isArray(body.variants) ? body.variants : [];

  const variantsValides = variants.every((v) => typeof v.prix === "number" && !Number.isNaN(v.prix));

  if (!nom || !description || !categoryId || variants.length === 0 || !variantsValides) {
    return NextResponse.json({ erreur: "Champs invalides" }, { status: 400 });
  }

  const slug = genererSlug(nom);
  const slugExistant = await prisma.product.findUnique({ where: { slug } });
  if (slugExistant) {
    return NextResponse.json({ erreur: "Un produit avec un nom très proche existe déjà" }, { status: 409 });
  }

  const produit = await prisma.product.create({
    data: {
      nom, slug, description, categoryId, actif,
      imageUrl: imageUrl || null,
      variants: {
        create: variants.map((v) => ({
          taille: v.taille || null,
          couleur: v.couleur || null,
          prix: v.prix,
          imageUrl: v.imageUrl || null,
        })),
      },
    },
    include: { variants: true },
  });

  return NextResponse.json(produit);
}