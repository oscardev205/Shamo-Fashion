// src/lib/format.ts
// Petites fonctions de formatage réutilisées partout dans l'interface.

// Affiche un prix en FCFA avec séparateur de milliers : 3500 -> "3 500 FCFA"
export function formatPrix(prix: number): string {
  return new Intl.NumberFormat("fr-FR").format(prix) + " FCFA";
}

// Affiche le prix d'un produit à partir de ses variantes : un prix unique si
// toutes les variantes ont le même prix, sinon une fourchette "min – max FCFA".
export function formatPrixVariantes(variantes: { prix: number }[]): string {
  if (variantes.length === 0) return "—";
  const prixMin = Math.min(...variantes.map((v) => v.prix));
  const prixMax = Math.max(...variantes.map((v) => v.prix));
  if (prixMin === prixMax) return formatPrix(prixMin);
  return `${formatPrix(prixMin)} – ${formatPrix(prixMax)}`;
}

// Affiche le nom d'une ligne de commande avec sa taille/couleur entre parenthèses
// si présentes (ex: "Costume (42 · Bleu marine)").
export function libelleVarianteCommande(nom: string, taille: string | null, couleur: string | null): string {
  const attributs = [taille, couleur].filter(Boolean).join(" · ");
  return attributs ? `${nom} (${attributs})` : nom;
}