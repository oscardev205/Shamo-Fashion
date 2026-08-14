// src/app/api/commandes/route.ts
// Fichier complet : le panier référence des variantes (variantId) et non plus
// des produits à prix unique. Plus de gestion de stock : la décrémentation du
// stock et l'email d'alerte stock bas ont été retirés (Grace Débordée ne suit
// pas de stock). Les frais de livraison ne sont plus calculés/vérifiés ici :
// ils sont réglés directement au livreur, en espèces.

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { genererNumeroCommande } from "@/lib/order";
import { estFideliteActive } from "@/lib/parametres";
import { getValeurPointFcfa } from "@/lib/fidelite";

type PanierEntree = { variantId: string; quantite: number };

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const body = await request.json();

  const {
    items,
    adresse,
    addressId,
    invite,
    modePaiement,
    codePromo,
    modeLivraison = "LIVRAISON",
    contactNom,
    contactTelephone,
    pointsUtilises,
  } = body as {
    items: PanierEntree[];
    adresse?: {
      nomComplet: string;
      telephone: string;
      ville: string;
      quartier: string;
      adresseDetail: string;
      instructions?: string;
      latitude?: number;
      longitude?: number;
    };
    addressId?: string;
    invite?: { nom: string; email: string; telephone: string };
    modePaiement: string;
    codePromo?: string;
    modeLivraison?: "LIVRAISON" | "RETRAIT";
    contactNom?: string;
    contactTelephone?: string;
    pointsUtilises?: number;
  };

  if (!items || items.length === 0) {
    return NextResponse.json({ erreur: "Le panier est vide" }, { status: 400 });
  }

  const userId = session?.user ? (session.user as { id: string }).id : null;
  if (!userId && !invite) {
    return NextResponse.json({ erreur: "Informations invité manquantes" }, { status: 400 });
  }

  let adresseId: string | undefined;
  // Les frais de livraison ne sont plus calculés/facturés sur le site : ils
  // sont réglés directement au livreur, en espèces, à la livraison. On garde
  // le champ fraisLivraison en base (toujours à 0) pour ne pas casser tout ce
  // qui l'affiche déjà (facture, récap commande...), mais on ne le calcule
  // plus et on n'empêche plus une commande selon la ville.
  const fraisLivraison = 0;

  if (modeLivraison === "RETRAIT") {
    if (!contactNom || !contactTelephone) {
      return NextResponse.json({ erreur: "Nom et téléphone requis pour le retrait" }, { status: 400 });
    }
  } else {
    if (addressId) {
      if (!userId) return NextResponse.json({ erreur: "Non autorisé" }, { status: 403 });
      const adresseExistante = await prisma.address.findUnique({ where: { id: addressId } });
      if (!adresseExistante || adresseExistante.userId !== userId) {
        return NextResponse.json({ erreur: "Adresse introuvable" }, { status: 404 });
      }
      adresseId = adresseExistante.id;
    } else if (adresse) {
      const nouvelleAdresse = await prisma.address.create({
        data: { ...adresse, userId: userId ?? undefined },
      });
      adresseId = nouvelleAdresse.id;
    } else {
      return NextResponse.json({ erreur: "Adresse manquante" }, { status: 400 });
    }
  }

  const variantsIds = items.map((i) => i.variantId);
  const variantes = await prisma.productVariant.findMany({
    where: { id: { in: variantsIds } },
    include: { product: true },
  });

  let sousTotal = 0;
  const lignesACreer: { productVariantId: string; quantite: number; prixUnitaire: number }[] = [];

  for (const item of items) {
    const variante = variantes.find((v) => v.id === item.variantId);
    if (!variante || !variante.product.actif) {
      return NextResponse.json({ erreur: `Article indisponible : ${item.variantId}` }, { status: 400 });
    }
    sousTotal += variante.prix * item.quantite;
    lignesACreer.push({ productVariantId: variante.id, quantite: item.quantite, prixUnitaire: variante.prix });
  }

  let promoValide = null;
  let montantReduction = 0;
  if (codePromo) {
    const promo = await prisma.promoCode.findUnique({ where: { code: codePromo.toUpperCase().trim() } });
    const valide =
      promo &&
      promo.actif &&
      (!promo.dateExpiration || promo.dateExpiration >= new Date()) &&
      (promo.utilisationMax === null || promo.nombreUtilisations < promo.utilisationMax) &&
      (!promo.montantMinimum || sousTotal >= promo.montantMinimum);

    if (valide && promo) {
      promoValide = promo;
      montantReduction =
        promo.type === "POURCENTAGE" ? Math.round((sousTotal * promo.valeur) / 100) : Math.min(promo.valeur, sousTotal);
    }
  }

  // Points de fidélité : ignorés entièrement si le programme est désactivé,
  // même si le client en avait sélectionné avant la désactivation.
  let pointsReellementUtilises = 0;
  let reductionPoints = 0;
  const fideliteActive = await estFideliteActive();
  if (fideliteActive && pointsUtilises && pointsUtilises > 0 && userId) {
    const utilisateur = await prisma.user.findUnique({ where: { id: userId } });
    const soldeReel = utilisateur?.pointsFidelite ?? 0;
    pointsReellementUtilises = Math.min(pointsUtilises, soldeReel);
    const valeurPoint = await getValeurPointFcfa();
    reductionPoints = pointsReellementUtilises * valeurPoint;
  }
  const total = Math.max(0, sousTotal - montantReduction - reductionPoints) + fraisLivraison;

  const commande = await prisma.$transaction(async (tx) => {
    const nouvelleCommande = await tx.order.create({
      data: {
        numero: genererNumeroCommande(),
        total,
        fraisLivraison,
        modeLivraison,
        modePaiement,
        userId: userId ?? undefined,
        nomInvite: invite?.nom,
        emailInvite: invite?.email,
        telephoneInvite: invite?.telephone,
        addressId,
        contactNom: modeLivraison === "RETRAIT" ? contactNom : undefined,
        contactTelephone: modeLivraison === "RETRAIT" ? contactTelephone : undefined,
        items: { create: lignesACreer },
        promoCodeId: promoValide?.id,
        montantReduction,
        pointsUtilises: pointsReellementUtilises,
        reductionPoints,
      },
    });

    if (promoValide) {
      await tx.promoCode.update({ where: { id: promoValide.id }, data: { nombreUtilisations: { increment: 1 } } });
    }

    if (pointsReellementUtilises > 0 && userId) {
      await tx.user.update({
        where: { id: userId },
        data: { pointsFidelite: { decrement: pointsReellementUtilises } },
      });
      await tx.pointsTransaction.create({
        data: {
          userId,
          montant: -pointsReellementUtilises,
          motif: `Utilisés sur commande ${nouvelleCommande.numero}`,
        },
      });
    }

    return nouvelleCommande;
  });

  return NextResponse.json({ id: commande.id, numero: commande.numero, total: commande.total });
}