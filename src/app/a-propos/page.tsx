// src/app/a-propos/page.tsx
// Fichier complet : contenu adapté à Shamo Fashion (mode masculine haut de
// gamme), + nouvelle section "Notre boutique" avec carte Google Maps (Godomey)
// et un emplacement photo à remplacer par une vraie photo de la boutique.
// TODO: remplacer l'encart "Photo de la boutique à venir" par une vraie photo,
// et le lien Maps par un pin précis si tu en as un.

import type { Metadata } from "next";
import { GaleriePhotosBoutique } from "@/components/apropos/GaleriePhotosBoutique";
import Link from "next/link";
import { FaGem, FaAward, FaCrown, FaShirt, FaScissors, FaMagnifyingGlass, FaBoxOpen, FaTruckFast, FaStar, FaLocationDot } from "react-icons/fa6";
import { TraitFeuille } from "@/components/ui/TraitFeuille";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";

// TODO: remplacer ces deux liens par ceux de la position EXACTE de la boutique
// (actuellement ils pointent juste sur "Godomey" en général, pas sur l'adresse précise).
// Comment récupérer les bons liens sur Google Maps :
// 1. Ouvre Google Maps, cherche/place le point exact de ta boutique.
// 2. Clique sur "Partager" > onglet "Intégrer une carte" > copie l'URL qui est dans
//    src="..." de la balise <iframe> proposée -> colle-la dans LIEN_MAPS_EMBED.
// 3. Toujours dans "Partager", mais l'onglet "Envoyer le lien" -> copie ce lien-là
//    -> colle-le dans LIEN_MAPS (c'est celui utilisé par le bouton "Ouvrir dans Google Maps").
const LIEN_MAPS_EMBED = "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3965.0893225551795!2d2.3342989749916905!3d6.382471693607886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwMjInNTYuOSJOIDLCsDIwJzEyLjgiRQ!5e0!3m2!1sen!2sbj!4v1786622491202!5m2!1sen!2sbj";
const LIEN_MAPS = "https://maps.app.goo.gl/FndjxVqocSWZ28QP8";
// TODO: remplace ces 3 fichiers par tes vraies photos de la boutique, en gardant
// exactement les mêmes noms (ou alors change les noms ici ET dans /public).
// PHOTO_PRINCIPALE : vitrine ou intérieur, format large (paysage).
// PHOTO_SECONDAIRE_1 / 2 : deux autres angles (rayons, présentoirs, façade...), format carré.
const PHOTO_PRINCIPALE = "/boutique-1.jpg";
const PHOTO_SECONDAIRE_1 = "/boutique-2.jpg";
const PHOTO_SECONDAIRE_2 = "/boutique-3.jpg";

export const metadata: Metadata = {
  title: "À propos",
  description: "Shamo Fashion, boutique de mode masculine haut de gamme à Godomey : costumes, chemises, chaussures et accessoires sélectionnés avec exigence.",
  alternates: {
    canonical: "/a-propos",
  },
};

export default async function AProposPage() {
  const [nombreProduits, nombreCategories, statsAvis] = await Promise.all([
    prisma.product.count({ where: { actif: true } }),
    prisma.category.count(),
    prisma.review.aggregate({ _avg: { note: true }, _count: true }),
  ]);

  const noteMoyenne = statsAvis._avg.note ? statsAvis._avg.note.toFixed(1) : null;

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      {/* Hero */}
      <FadeIn>
        <p className="text-xs font-semibold uppercase tracking-wide text-vivrebio-rouge">
          Notre histoire
        </p>
        <h1 className="mt-1 text-2xl font-bold text-encre sm:text-3xl">À propos de Grace Débordée</h1>
        <TraitFeuille className="mt-2" />
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-encre/70">
          Shamo Fashion est née d&apos;une conviction simple : chaque homme mérite une
          allure soignée, sans compromis sur la qualité. Basée à Godomey, notre
          boutique sélectionne et propose costumes, chemises, chaussures, montres et
          accessoires haut de gamme, pensés pour accompagner votre élégance au
          quotidien comme dans vos grandes occasions.
        </p>
      </FadeIn>

      {/* Chiffres clés (données réelles) */}
      <FadeIn delai={100} className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="carte-3d p-4 text-center">
          <p className="text-2xl font-bold text-vivrebio-vert">{nombreProduits}+</p>
          <p className="mt-1 text-xs text-encre/50">Articles</p>
        </div>
        <div className="carte-3d p-4 text-center">
          <p className="text-2xl font-bold text-vivrebio-vert">{nombreCategories}</p>
          <p className="mt-1 text-xs text-encre/50">Catégories</p>
        </div>
        <div className="carte-3d col-span-2 p-4 text-center sm:col-span-1">
          {noteMoyenne ? (
            <>
              <p className="flex items-center justify-center gap-1 text-2xl font-bold text-vivrebio-vert">
                <FaStar className="text-vivrebio-vert" size={18} /> {noteMoyenne}
              </p>
              <p className="mt-1 text-xs text-encre/50">Note moyenne clients</p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-vivrebio-vert">100%</p>
              <p className="mt-1 text-xs text-encre/50">Satisfaction visée</p>
            </>
          )}
        </div>
      </FadeIn>

      {/* Notre histoire, en détail */}
      <FadeIn delai={150} className="mt-12">
        <div className="carte-3d p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-vivrebio-rouge">Depuis nos débuts</p>
          <h2 className="mt-1 text-lg font-bold text-encre">Une aventure au service de l&apos;élégance</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-encre/70">
            <p>
              Tout a commencé par un constat : trouver des vêtements et accessoires
              masculins véritablement soignés, à la coupe et à la qualité irréprochables,
              restait souvent compliqué. Shamo Fashion est née pour simplifier cette
              recherche, en réunissant en un seul endroit costumes, chemises, chaussures
              et accessoires choisis avec la même exigence que celle qu&apos;on attendrait
              pour soi-même.
            </p>
            <p>
              Chaque article de notre catalogue est sélectionné en privilégiant la
              qualité des matières, la finition et la coupe, pour vous garantir une
              allure à la hauteur de chaque occasion — du quotidien aux événements les
              plus marquants.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Mission & Vision */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <FadeIn className="carte-3d p-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-vert-pale">
            <FaGem className="text-vivrebio-vert" />
          </div>
          <p className="text-sm font-semibold text-encre">Notre mission</p>
          <p className="mt-2 text-sm leading-relaxed text-encre/60">
            Rendre accessible une élégance masculine de qualité, sélectionnée avec
            exigence, pour accompagner chaque homme dans son style au quotidien.
          </p>
        </FadeIn>
        <FadeIn delai={100} className="carte-3d p-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-vert-pale">
            <FaCrown className="text-vivrebio-vert" />
          </div>
          <p className="text-sm font-semibold text-encre">Notre vision</p>
          <p className="mt-2 text-sm leading-relaxed text-encre/60">
            Devenir la référence de la mode masculine haut de gamme au Bénin, reconnue
            pour la qualité de sa sélection et la confiance de sa communauté de clients.
          </p>
        </FadeIn>
      </div>

      {/* Valeurs de marque */}
      <div className="mt-12">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-wide text-vivrebio-rouge">Nos engagements</p>
          <h2 className="mt-1 text-lg font-bold text-encre">Ce qui nous guide</h2>
          <TraitFeuille className="mt-2" />
        </FadeIn>

        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { icon: FaGem, label: "Élégance", texte: "Des coupes soignées, pensées pour sublimer votre style." },
            { icon: FaAward, label: "Qualité", texte: "Des matières et une confection choisies avec exigence." },
            { icon: FaCrown, label: "Authenticité", texte: "Des articles vrais, à la hauteur de votre confiance." },
            { icon: FaShirt, label: "Style", texte: "Une allure affirmée, jour après jour." },
          ].map(({ icon: Icon, label, texte }, i) => (
            <FadeIn key={label} delai={i * 100} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-vert-pale">
                <Icon className="text-xl text-vivrebio-vert" />
              </div>
              <p className="mt-3 text-sm font-semibold text-encre">{label}</p>
              <p className="mt-1 text-xs text-encre/50">{texte}</p>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Notre engagement qualité, en 4 étapes */}
      <div className="mt-14">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-wide text-vivrebio-rouge">De la sélection à votre porte</p>
          <h2 className="mt-1 text-lg font-bold text-encre">Notre engagement qualité</h2>
          <TraitFeuille className="mt-2" />
        </FadeIn>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: FaScissors, titre: "Sélection", texte: "Nous choisissons chaque article avec exigence, en privilégiant la coupe et la matière." },
            { icon: FaMagnifyingGlass, titre: "Contrôle", texte: "Chaque référence est vérifiée avant d'intégrer notre catalogue." },
            { icon: FaBoxOpen, titre: "Préparation", texte: "Vos commandes sont préparées avec soin, dans le respect des articles." },
            { icon: FaTruckFast, titre: "Livraison", texte: "Livraison suivie, jusqu'à la position exacte que vous choisissez." },
          ].map(({ icon: Icon, titre, texte }, i) => (
            <FadeIn key={titre} delai={i * 80} className="carte-3d p-5 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-vert-pale">
                <Icon className="text-vivrebio-vert" />
              </div>
              <p className="mt-3 text-sm font-semibold text-encre">{titre}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-encre/50">{texte}</p>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Notre boutique : localisation + photo */}
      <div className="mt-14">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-wide text-vivrebio-rouge">Venez nous voir</p>
          <h2 className="mt-1 text-lg font-bold text-encre">Notre boutique</h2>
          <TraitFeuille className="mt-2" />
        </FadeIn>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
         <FadeIn>
            <GaleriePhotosBoutique
              photoPrincipale={{ src: PHOTO_PRINCIPALE, alt: "Vitrine de la boutique Shamo Fashion à Godomey" }}
              photosSecondaires={[
                { src: PHOTO_SECONDAIRE_1, alt: "Intérieur de la boutique Shamo Fashion, présentation des articles" },
                { src: PHOTO_SECONDAIRE_2, alt: "Sélection de vêtements et accessoires en boutique chez Shamo Fashion" },
              ]}
            />
          </FadeIn>

          <FadeIn delai={100} className="carte-3d flex flex-col p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-vert-pale">
              <FaLocationDot className="text-vivrebio-vert" />
            </div>
            <p className="text-sm font-semibold text-encre">Godomey, Bénin</p>
            <p className="mt-1.5 text-sm leading-relaxed text-encre/60">
              Retrouvez-nous à Godomey pour découvrir notre sélection en boutique,
              essayer et vous laisser conseiller.
            </p>
            <div className="mt-4 flex-1 overflow-hidden rounded-xl border border-sable">
              <iframe
                src={LIEN_MAPS_EMBED}
                className="h-full min-h-[160px] w-full"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation de la boutique Shamo Fashion à Godomey"
              />
            </div>
            
            <a href={LIEN_MAPS}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-xs font-medium text-vivrebio-vert hover:underline"
            >
              📍 Ouvrir dans Google Maps →
            </a>
          </FadeIn>
        </div>
      </div>

      {/* CTA final */}
      <FadeIn className="mt-14 rounded-3xl bg-vert-pale p-8 text-center sm:p-10">
        <p className="text-lg font-bold text-encre">Prêt à découvrir nos articles ?</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-encre/60">
          Explorez notre catalogue et trouvez les pièces qui correspondent à votre style.
        </p>
        <Link href="/boutique">
          <Button className="mt-5">Découvrir la boutique</Button>
        </Link>
      </FadeIn>
    </main>
  );
}