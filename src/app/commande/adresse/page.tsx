// src/app/commande/adresse/page.tsx
// Fichier complet : plus de vérification de "zone couverte" ni de calcul de
// frais de livraison sur le site — les frais sont réglés directement au
// livreur, en espèces, à la livraison.
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { AddressForm, AdresseData } from "@/components/commande/AddressForm";
import { ModeLivraisonChoix } from "@/components/commande/ModeLivraisonChoix";
import { RetraitForm } from "@/components/commande/RetraitForm";
import { Star } from "lucide-react";

type AdresseEnregistree = AdresseData & { id: string; parDefaut: boolean };

export default function CommandeAdressePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, viderPanier, promo, pointsUtilises } = useCart();
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");
  const [mode, setMode] = useState<"LIVRAISON" | "RETRAIT">("LIVRAISON");

  const [adressesEnregistrees, setAdressesEnregistrees] = useState<AdresseEnregistree[]>([]);
  const [chargementAdresses, setChargementAdresses] = useState(true);
  const [adresseSelectionnee, setAdresseSelectionnee] = useState<string | null>(null);
  const [nouvelleAdresse, setNouvelleAdresse] = useState(false);

  useEffect(() => {
    fetch("/api/adresses")
      .then((res) => res.json())
      .then((data: AdresseEnregistree[]) => {
        setAdressesEnregistrees(data);
        const parDefaut = data.find((a) => a.parDefaut);
        if (parDefaut) setAdresseSelectionnee(parDefaut.id);
        else if (data.length === 0) setNouvelleAdresse(true);
      })
      .finally(() => setChargementAdresses(false));
  }, []);

  async function envoyerCommande(body: object) {
    setChargement(true);
    setErreur("");
    const res = await fetch("/api/commandes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, modePaiement: "mobile_money", codePromo: promo?.code, pointsUtilises }),
    });
    let data: { erreur?: string; numero?: string } = {};
    try {
      data = await res.json();
    } catch {}
    setChargement(false);
    if (!res.ok) {
      setErreur(data.erreur || "Une erreur est survenue, réessaie dans un instant.");
      return;
    }
    viderPanier();
    router.push(`/commande/paiement/${data.numero}`);
  }

  function handleUtiliserAdresseExistante() {
    if (!adresseSelectionnee) return;
    envoyerCommande({
      items: items.map((i) => ({ variantId: i.variantId, quantite: i.quantite })),
      addressId: adresseSelectionnee,
      modeLivraison: "LIVRAISON",
    });
  }

  function handleNouvelleAdresse(adresse: AdresseData) {
    envoyerCommande({
      items: items.map((i) => ({ variantId: i.variantId, quantite: i.quantite })),
      adresse,
      modeLivraison: "LIVRAISON",
    });
  }

  function handleRetraitValide(contact: { nomComplet: string; telephone: string }) {
    envoyerCommande({
      items: items.map((i) => ({ variantId: i.variantId, quantite: i.quantite })),
      modeLivraison: "RETRAIT",
      contactNom: contact.nomComplet,
      contactTelephone: contact.telephone,
    });
  }

  if (!session) {
    return <p className="mx-auto max-w-md px-4 py-16 text-center text-encre/50">Veuillez vous connecter.</p>;
  }
  if (items.length === 0) {
    return <p className="mx-auto max-w-md px-4 py-16 text-center text-encre/50">Votre panier est vide.</p>;
  }

  const telephoneSession = (session.user as { telephone?: string | null })?.telephone ?? "";

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <p className="mb-6 text-xs text-encre/40">1. Panier → 2. Identification → 3. Livraison → 4. Paiement</p>
      <h1 className="mb-6 text-lg font-semibold text-vivrebio-vert">Livraison</h1>

      <ModeLivraisonChoix mode={mode} onChange={setMode} />

      {mode === "RETRAIT" ? (
        <RetraitForm
          onSubmit={handleRetraitValide}
          chargement={chargement}
          valeurNomInitiale={session.user?.name ?? ""}
          valeurTelephoneInitiale={telephoneSession}
        />
      ) : chargementAdresses ? (
        <p className="text-sm text-encre/40">Chargement de vos adresses...</p>
      ) : adressesEnregistrees.length > 0 && !nouvelleAdresse ? (
        <div className="carte-3d p-5">
          <p className="mb-3 text-sm font-medium text-encre">Choisissez une adresse enregistrée</p>
          <div className="flex flex-col gap-2">
            {adressesEnregistrees.map((adresse) => (
              <label
                key={adresse.id}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${
                  adresseSelectionnee === adresse.id ? "border-vivrebio-vert bg-vert-pale" : "border-sable"
                }`}
              >
                <input
                  type="radio"
                  name="adresse"
                  checked={adresseSelectionnee === adresse.id}
                  onChange={() => setAdresseSelectionnee(adresse.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-encre">{adresse.nomComplet}</p>
                    {adresse.parDefaut && (
                      <span className="flex items-center gap-1 text-xs text-vivrebio-vert">
                        <Star size={11} fill="currentColor" /> Par défaut
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-encre/50">{adresse.adresseDetail}, {adresse.quartier}</p>
                  <p className="text-xs text-encre/50">{adresse.ville} · {adresse.telephone}</p>
                </div>
              </label>
            ))}
          </div>

          <p className="mt-3 rounded-lg bg-vert-pale px-3 py-2.5 text-xs text-encre/70">
            🚚 Les frais de livraison sont à régler directement au livreur, selon la distance.
          </p>

          {erreur && <p className="mt-3 text-xs text-vivrebio-rouge">{erreur}</p>}

          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={handleUtiliserAdresseExistante}
              disabled={!adresseSelectionnee || chargement}
              className="rounded-lg bg-vivrebio-vert px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {chargement ? "Enregistrement..." : "Continuer vers le paiement"}
            </button>
            <button onClick={() => setNouvelleAdresse(true)} className="text-xs text-vivrebio-vert hover:underline">
              Utiliser une nouvelle adresse
            </button>
          </div>
        </div>
      ) : (
        <>
          {adressesEnregistrees.length > 0 && (
            <button onClick={() => setNouvelleAdresse(false)} className="mb-3 text-xs text-vivrebio-vert hover:underline">
              ← Revenir à mes adresses enregistrées
            </button>
          )}
          <AddressForm
            onSubmit={handleNouvelleAdresse}
            chargement={chargement}
            valeursInitiales={{ nomComplet: session.user?.name ?? "", telephone: telephoneSession }}
            emailInitial={session.user?.email ?? ""}
          />
          {erreur && <p className="mt-3 text-xs text-vivrebio-rouge">{erreur}</p>}
        </>
      )}
    </main>
  );
}