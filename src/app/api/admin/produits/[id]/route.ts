// src/app/api/admin/produits/[id]/route.ts
// Fichier complet : la modification synchronise la liste des variantes
// (mise à jour de celles qui ont un id, création des nouvelles, suppression
// de celles retirées — sauf si une variante retirée est déjà utilisée dans
// une commande, auquel cas on bloque plutôt que de casser l'historique).

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

type VarianteEntree = { id?: string; taille?: string | null; couleur?: string | null; prix: number; imageUrl?: string | null };

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ erreur: "Non autorisé" }, { status: 403 });

  const { id } = await params;
  const body = await request.json();

  const donnees: Record<string, unknown> = {};
  if (typeof body.nom === "string") donnees.nom = body.nom;
  if (typeof body.description === "string") donnees.description = body.description;
  if (typeof body.categoryId === "string") donnees.categoryId = body.categoryId;
  if (typeof body.actif === "boolean") donnees.actif = body.actif;
  if (body.imageUrl === null || typeof body.imageUrl === "string") donnees.imageUrl = body.imageUrl;

  if (Array.isArray(body.variants)) {
    const variants: VarianteEntree[] = body.variants;
    const variantsValides = variants.every((v) => typeof v.prix === "number" && !Number.isNaN(v.prix));
    if (variants.length === 0 || !variantsValides) {
      return NextResponse.json({ erreur: "Chaque variante doit avoir un prix" }, { status: 400 });
    }

    const variantesExistantes = await prisma.productVariant.findMany({
      where: { productId: id },
      include: { _count: { select: { orderItems: true } } },
    });

    const idsGardes = new Set(variants.filter((v) => v.id).map((v) => v.id));
    const aSupprimer = variantesExistantes.filter((v) => !idsGardes.has(v.id));
    const aSupprimerDejaCommandees = aSupprimer.filter((v) => v._count.orderItems > 0);

    if (aSupprimerDejaCommandees.length > 0) {
      return NextResponse.json(
        { erreur: "Une variante déjà présente dans des commandes ne peut pas être supprimée. Modifie plutôt son prix, ou laisse-la en place." },
        { status: 409 }
      );
    }

    await prisma.$transaction([
      ...aSupprimer.map((v) => prisma.productVariant.delete({ where: { id: v.id } })),
      ...variants
        .filter((v) => v.id)
        .map((v) =>
          prisma.productVariant.update({
            where: { id: v.id },
            data: { taille: v.taille || null, couleur: v.couleur || null, prix: v.prix, imageUrl: v.imageUrl || null },
          })
        ),
      ...variants
        .filter((v) => !v.id)
        .map((v) =>
          prisma.productVariant.create({
            data: { productId: id, taille: v.taille || null, couleur: v.couleur || null, prix: v.prix, imageUrl: v.imageUrl || null },
          })
        ),
    ]);
  }

  const produit = await prisma.product.update({ where: { id }, data: donnees, include: { variants: true } });
  return NextResponse.json(produit);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ erreur: "Non autorisé" }, { status: 403 });

  const { id } = await params;

  const nombreCommandes = await prisma.orderItem.count({ where: { productVariant: { productId: id } } });
  if (nombreCommandes > 0) {
    return NextResponse.json(
      { erreur: "Ce produit apparaît dans des commandes existantes — désactive-le plutôt que de le supprimer." },
      { status: 409 }
    );
  }

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}