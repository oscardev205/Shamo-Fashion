// src/components/seo/DonneesStructureesOrganisation.tsx
// Injecte le JSON-LD Schema.org de type LocalBusiness — donne à Google le nom,
// l'adresse et les coordonnées de la boutique physique. C'est ce qui permet au
// site d'apparaître sur les recherches locales ("boutique homme Godomey",
// "près de moi") et sur Google Maps. Affiché sur toutes les pages via le layout.
// TODO: si tu obtiens un pin Google Maps précis (rue, coordonnées GPS exactes),
// remplacer "addressLocality" par l'adresse complète pour un meilleur référencement.

import { SITE_URL, SITE_NAME, SITE_TELEPHONE, SITE_ADRESSE, IMAGE_PARTAGE_DEFAUT } from "@/lib/seo";

export function DonneesStructureesOrganisation() {
  const donnees = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}${IMAGE_PARTAGE_DEFAUT}`,
    telephone: SITE_TELEPHONE,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_ADRESSE.ville,
      addressRegion: SITE_ADRESSE.region,
      addressCountry: SITE_ADRESSE.pays,
    },
    sameAs: [
      "https://www.facebook.com/share/194XuUG34H/",
      "https://chat.whatsapp.com/DS3fjSI6dpc78nu4rXc0Fb?s=cl&p=a&mlu=0&amv=0",
      "https://tiktok.com/@graceduplexeakoho",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(donnees) }}
    />
  );
}