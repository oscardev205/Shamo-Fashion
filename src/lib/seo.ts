// src/lib/seo.ts
// Petit utilitaire pour construire les URLs absolues de façon cohérente partout,
// + les infos du commerce réutilisées dans les metadata et les données structurées.

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const SITE_NAME = "Shamo Fashion";

// TODO: remplacer par le vrai numéro de la boutique (déjà utilisé en placeholder
// sur la page Contact — à mettre à jour aux deux endroits en même temps).
export const SITE_TELEPHONE = "+229 00 00 00 00";

export const SITE_EMAIL = "contact@shamofashion.com";

// Adresse de la boutique physique, utilisée pour le référencement local (LocalBusiness).
export const SITE_ADRESSE = {
  ville: "Godomey",
  region: "Atlantique",
  pays: "BJ",
};

// Image utilisée par défaut pour l'aperçu des liens partagés (Facebook/WhatsApp/Twitter)
// sur les pages qui n'ont pas leur propre photo (accueil, à-propos, contact...).
// TODO: idéalement remplacer par une bannière dédiée 1200x630 plutôt que le logo.
export const IMAGE_PARTAGE_DEFAUT = "/logoV.png";

export function urlAbsolue(chemin: string): string {
  return `${SITE_URL}${chemin.startsWith("/") ? chemin : `/${chemin}`}`;
}