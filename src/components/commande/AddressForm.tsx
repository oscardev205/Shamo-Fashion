// src/components/commande/AddressForm.tsx
// Formulaire d'adresse de livraison. Les frais de livraison ne sont plus
// calculés/affichés ici : ils sont réglés directement au livreur en espèces,
// à la livraison — donc plus de vérification de "zone couverte" ni de
// possibilité de "demander" une zone.
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { AddressMapPicker } from "@/components/commande/AddressMapPicker";

export type AdresseData = {
  nomComplet: string;
  telephone: string;
  ville: string;
  quartier: string;
  adresseDetail: string;
  instructions?: string;
  latitude?: number;
  longitude?: number;
};

type Props = {
  onSubmit: (adresse: AdresseData) => void;
  chargement?: boolean;
  valeursInitiales?: Partial<AdresseData>;
  libelleBouton?: string;
  emailInitial?: string;
};

export function AddressForm({
  onSubmit,
  chargement,
  valeursInitiales,
  libelleBouton = "Continuer vers le paiement",
}: Props) {
  const [erreur, setErreur] = useState("");
  const [adresseDetail, setAdresseDetail] = useState(valeursInitiales?.adresseDetail ?? "");
  const [ville, setVille] = useState(valeursInitiales?.ville ?? "");
  const [quartier, setQuartier] = useState(valeursInitiales?.quartier ?? "");
  const [nomComplet, setNomComplet] = useState(valeursInitiales?.nomComplet ?? "");
  const [telephone, setTelephone] = useState(valeursInitiales?.telephone ?? "");
  const [coordonnees, setCoordonnees] = useState<{ latitude?: number; longitude?: number }>({
    latitude: valeursInitiales?.latitude,
    longitude: valeursInitiales?.longitude,
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!nomComplet || !telephone || !ville || !adresseDetail) {
      setErreur("Merci de remplir tous les champs obligatoires, y compris l'adresse via la carte.");
      return;
    }
    setErreur("");
    onSubmit({
      nomComplet,
      telephone,
      ville,
      quartier,
      adresseDetail,
      instructions: undefined,
      latitude: coordonnees.latitude,
      longitude: coordonnees.longitude,
    });
  }

  return (
    <div className="carte-3d p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={nomComplet} onChange={(e) => setNomComplet(e.target.value)} placeholder="Nom complet" required className="rounded-lg border border-sable px-3 py-2.5 text-sm" />
          <input value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="Téléphone" required className="rounded-lg border border-sable px-3 py-2.5 text-sm" />
        </div>

        <p className="rounded-lg bg-vert-pale px-3 py-2 text-xs text-encre/70">
          💡 Choisissez votre position sur la carte ci-dessous : la ville et le quartier se
          remplissent automatiquement. Vous pouvez ensuite les corriger si besoin.
        </p>

        <div className="rounded-xl border border-sable bg-papier/60 p-3">
          <p className="mb-2 text-xs font-medium text-encre">Position exacte de livraison</p>
          <AddressMapPicker
            onSelect={({ adresseCourte, lat, lng, ville: villeDetectee, quartier: quartierDetecte }) => {
              setAdresseDetail(adresseCourte);
              setCoordonnees({ latitude: lat, longitude: lng });
              if (villeDetectee) setVille(villeDetectee);
              if (quartierDetecte) setQuartier(quartierDetecte);
            }}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <input value={ville} onChange={(e) => setVille(e.target.value)} placeholder="Ville" required className="w-full rounded-lg border border-sable px-3 py-2.5 text-sm" />
            <p className="mt-1 text-[11px] text-encre/40">Pré-rempli via la carte — modifiable</p>
          </div>
          <div>
            <input value={quartier} onChange={(e) => setQuartier(e.target.value)} placeholder="Quartier" className="w-full rounded-lg border border-sable px-3 py-2.5 text-sm" />
            <p className="mt-1 text-[11px] text-encre/40">Pré-rempli via la carte — modifiable</p>
          </div>
        </div>

        <div>
          <input value={adresseDetail} onChange={(e) => setAdresseDetail(e.target.value)} placeholder="Adresse détaillée (rue, repère...)" required className="w-full rounded-lg border border-sable px-3 py-2.5 text-sm" />
          <p className="mt-1 text-[11px] text-encre/40">Pré-rempli via la carte — modifiable</p>
        </div>

        <p className="rounded-lg bg-vert-pale px-3 py-2.5 text-xs text-encre/70">
          🚚 Les frais de livraison sont à régler directement au livreur, selon la distance.
        </p>

        {erreur && <p className="text-xs text-vivrebio-rouge">{erreur}</p>}

        <Button type="submit" disabled={chargement}>
          {chargement ? "Enregistrement..." : libelleBouton}
        </Button>
      </form>
    </div>
  );
}