// src/app/a-propos/page.tsx
// Fichier complet : contenu adapté à Shamo Fashion (mode masculine haut de
// gamme), + nouvelle section "Notre boutique" avec carte Google Maps (Godomey)
// et un emplacement photo à remplacer par une vraie photo de la boutique.
// TODO: remplacer l'encart "Photo de la boutique à venir" par une vraie photo,
// et le lien Maps par un pin précis si tu en as un.

import Link from "next/link";
import { FaGem, FaAward, FaCrown, FaShirt, FaScissors, FaMagnifyingGlass, FaBoxOpen, FaTruckFast, FaStar, FaLocationDot } from "react-icons/fa6";
import { TraitFeuille } from "@/components/ui/TraitFeuille";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";

const LIEN_MAPS_EMBED = "https://www.google.com/maps?q=Godomey,B%C3%A9nin&output=embed";
const LIEN_MAPS = "https://www.google.com/maps/search/?api=1&query=Godomey%2C+B%C3%A9nin";

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
          <FadeIn className="carte-3d overflow-hidden">
            {/* TODO: remplacer cette image par une vraie photo de la boutique (vitrine/intérieur) */}
            <div className="flex aspect-[4/3] w-full items-center justify-center bg-vert-pale">
              <span className="px-6 text-center text-xs text-encre/40">
                Photo de la boutique à venir
              </span>
            </div>
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