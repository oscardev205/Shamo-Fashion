// prisma/seed.ts
// Fichier complet : remplace le seed de Vivre Bio (huiles essentielles, prix
// fixe) par les catégories du catalogue Shamo Fashion. Les produits eux-mêmes
// se créent ensuite via l'admin (/admin/produits/nouveau), avec leurs variantes.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { slug: "costumes", nom: "Costumes" },
  { slug: "chemises", nom: "Chemises" },
  { slug: "chaussures", nom: "Chaussures" },
  { slug: "montres", nom: "Montres" },
  { slug: "pulls", nom: "Pulls" },
  { slug: "jeans", nom: "Jeans" },
  { slug: "pantalons", nom: "Pantalons" },
  { slug: "ceintures", nom: "Ceintures" },
  { slug: "manchettes", nom: "Manchettes" },
  { slug: "cravates", nom: "Cravates" },
  { slug: "debardeurs", nom: "Débardeurs" },
];

async function main() {
  console.log("Insertion des catégories Shamo Fashion...");

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { slug: cat.slug, nom: cat.nom },
    });
    console.log(`  - ${cat.nom}`);
  }

  console.log("Seed terminé avec succès.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });