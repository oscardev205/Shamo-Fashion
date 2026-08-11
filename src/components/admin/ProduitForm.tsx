// src/components/admin/ProduitForm.tsx
// Fichier complet : chaque variante a maintenant sa propre photo (uploadée
// individuellement), en plus de taille/couleur/prix.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Categorie = { id: string; nom: string };

type Variante = {
  id?: string;
  taille: string;
  couleur: string;
  prix: number | "";
  imageUrl: string;
  chargement?: boolean;
};

type ProduitValeurs = {
  id?: string;
  nom: string;
  description: string;
  categoryId: string;
  actif: boolean;
  imageUrl?: string | null;
  variants?: { id: string; taille: string | null; couleur: string | null; prix: number; imageUrl: string | null }[];
};

function varianteVide(): Variante {
  return { taille: "", couleur: "", prix: "", imageUrl: "" };
}

export function ProduitForm({ categories, valeursInitiales }: { categories: Categorie[]; valeursInitiales?: ProduitValeurs }) {
  const router = useRouter();
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");
  const [variantes, setVariantes] = useState<Variante[]>(
    valeursInitiales?.variants && valeursInitiales.variants.length > 0
      ? valeursInitiales.variants.map((v) => ({
          id: v.id,
          taille: v.taille ?? "",
          couleur: v.couleur ?? "",
          prix: v.prix,
          imageUrl: v.imageUrl ?? "",
        }))
      : [varianteVide()]
  );

  function ajouterVariante() {
    setVariantes((prev) => [...prev, varianteVide()]);
  }

  function retirerVariante(index: number) {
    setVariantes((prev) => prev.filter((_, i) => i !== index));
  }

  function modifierVariante(index: number, champ: "taille" | "couleur" | "prix", valeur: string) {
    setVariantes((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [champ]: champ === "prix" ? (valeur === "" ? "" : Number(valeur)) : valeur } : v))
    );
  }

  async function handleUploadVariante(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0];
    if (!fichier) return;

    setVariantes((prev) => prev.map((v, i) => (i === index ? { ...v, chargement: true } : v)));
    setErreur("");

    const formData = new FormData();
    formData.append("fichier", fichier);

    const res = await fetch("/api/admin/produits/upload-image", { method: "POST", body: formData });

    let data: { erreur?: string; url?: string } = {};
    try {
      data = await res.json();
    } catch {}

    if (!res.ok) {
      setErreur(data.erreur || "Échec de l'upload de la photo.");
      setVariantes((prev) => prev.map((v, i) => (i === index ? { ...v, chargement: false } : v)));
      return;
    }

    setVariantes((prev) => prev.map((v, i) => (i === index ? { ...v, imageUrl: data.url ?? "", chargement: false } : v)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur("");

    if (variantes.length === 0) {
      setErreur("Ajoute au moins une variante.");
      return;
    }
    if (variantes.some((v) => v.prix === "" || Number.isNaN(v.prix))) {
      setErreur("Chaque variante doit avoir un prix.");
      return;
    }
    if (variantes.some((v) => !v.imageUrl)) {
      setErreur("Chaque variante doit avoir une photo.");
      return;
    }

    setChargement(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      nom: formData.get("nom"),
      description: formData.get("description"),
      categoryId: formData.get("categoryId"),
      actif: formData.get("actif") === "on",
      imageUrl: variantes[0]?.imageUrl || null,
      variants: variantes.map((v) => ({
        id: v.id,
        taille: v.taille || null,
        couleur: v.couleur || null,
        prix: Number(v.prix),
        imageUrl: v.imageUrl || null,
      })),
    };

    const url = valeursInitiales?.id ? `/api/admin/produits/${valeursInitiales.id}` : "/api/admin/produits";
    const method = valeursInitiales?.id ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setChargement(false);

    if (!res.ok) {
      const data = await res.json();
      setErreur(data.erreur || "Une erreur est survenue.");
      return;
    }

    router.push("/admin/produits");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="carte-3d flex flex-col gap-3 p-4 sm:p-6">
      <input name="nom" placeholder="Nom de l'article" defaultValue={valeursInitiales?.nom} required className="rounded-lg border border-sable px-3 py-2.5 text-sm" />
      <textarea name="description" placeholder="Description" defaultValue={valeursInitiales?.description} required rows={3} className="rounded-lg border border-sable px-3 py-2.5 text-sm" />

      <select name="categoryId" defaultValue={valeursInitiales?.categoryId} required className="rounded-lg border border-sable px-3 py-2.5 text-sm">
        <option value="">Catégorie...</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.nom}</option>
        ))}
      </select>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-encre">
          Variantes — chacune a sa propre photo, sa taille/couleur et son prix
        </label>

        <div className="flex flex-col gap-2">
          {variantes.map((variante, index) => (
            <div key={index} className="flex items-start gap-3 rounded-lg border border-sable p-3">
              <div className="shrink-0 text-center">
                <label htmlFor={`variante-photo-${index}`} className="block cursor-pointer">
                  {variante.imageUrl ? (
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-sable bg-vert-pale">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={variante.imageUrl} alt="" className="h-full w-full object-contain p-1" />
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-sable text-encre/30">
                      <ImagePlus size={18} />
                    </div>
                  )}
                  <span className="mt-1 block text-[10px] text-vivrebio-vert">
                    {variante.chargement ? "..." : variante.imageUrl ? "Changer" : "Photo"}
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id={`variante-photo-${index}`}
                  className="hidden"
                  onChange={(e) => handleUploadVariante(index, e)}
                />
              </div>

              <div className="flex flex-1 flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    placeholder="Taille (ex: 42)"
                    value={variante.taille}
                    onChange={(e) => modifierVariante(index, "taille", e.target.value)}
                    className="min-w-0 flex-1 rounded-lg border border-sable px-2.5 py-1.5 text-xs"
                  />
                  <input
                    placeholder="Couleur (ex: Gris)"
                    value={variante.couleur}
                    onChange={(e) => modifierVariante(index, "couleur", e.target.value)}
                    className="min-w-0 flex-1 rounded-lg border border-sable px-2.5 py-1.5 text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Prix (FCFA)"
                    value={variante.prix}
                    onChange={(e) => modifierVariante(index, "prix", e.target.value)}
                    required
                    className="w-28 shrink-0 rounded-lg border border-sable px-2.5 py-1.5 text-xs"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => retirerVariante(index)}
                disabled={variantes.length === 1}
                aria-label="Retirer cette variante"
                className="shrink-0 rounded-lg border border-sable p-2 text-encre/50 disabled:opacity-30"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={ajouterVariante}
          className="mt-2 rounded-lg border border-dashed border-sable px-3 py-1.5 text-xs text-vivrebio-vert"
        >
          + Ajouter une variante
        </button>
        <p className="mt-1.5 text-[11px] text-encre/40">
          Laisse taille ou couleur vide si le produit n'a pas cet attribut. La photo est obligatoire pour chaque variante.
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm text-encre">
        <input type="checkbox" name="actif" defaultChecked={valeursInitiales?.actif ?? true} />
        Article actif (visible sur la boutique)
      </label>

      {erreur && <p className="text-xs text-vivrebio-rouge">{erreur}</p>}

      <Button type="submit" disabled={chargement}>
        {chargement ? "Enregistrement..." : valeursInitiales?.id ? "Enregistrer les modifications" : "Créer l'article"}
      </Button>
    </form>
  );
}