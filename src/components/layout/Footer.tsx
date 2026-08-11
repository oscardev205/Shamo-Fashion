// src/components/layout/Footer.tsx
// Fichier complet : logo remplacé par un texte de marque temporaire (en attendant
// le vrai logo), liens Boutique/réseaux sociaux adaptés à Shamo Fashion.
// TODO: remplacer les liens Facebook/Instagram/TikTok et le lien du portfolio
// (marqués ci-dessous) par les vraies URLs.

import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa6";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

const LIEN_MAPS_BOUTIQUE = "https://www.google.com/maps/search/?api=1&query=Godomey%2C+B%C3%A9nin";

export function Footer() {
  return (
    <footer className="mt-20 bg-footer-bg text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            {/* Fond marine ici : dépose une variante claire/blanche du logo dans
                /public/logo-shamo-blanc.png (celle du header peut être colorée,
                elle est sur fond clair). */}
            <Image src="/logo-shamo-blanc.png" alt="Grace Débordée — Shamo Fashion" width={150} height={46} className="h-9 w-auto" />
            <p className="mt-2 font-accent text-2xl text-white/80">Votre élégance, notre priorité</p>
            <div className="mt-4 flex gap-3">
              {/* TODO: remplacer par les vrais liens Facebook / Instagram / TikTok de Shamo Fashion */}
              
              <a  href="https://www.facebook.com/share/194XuUG34H/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Shamo Fashion sur Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-vivrebio-vert hover:text-encre"
              >
                <FaFacebook size={16} />
              </a>
              
              <a  href="https://instagram.com/REMPLACE_MOI"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Shamo Fashion sur Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-vivrebio-vert hover:text-encre"
              >
                <FaInstagram size={16} />
              </a>
              
              <a  href="https://tiktok.com/@graceduplexeakoho"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Shamo Fashion sur TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-vivrebio-vert hover:text-encre"
              >
                <FaTiktok size={16} />
              </a>

               <a  href="https://chat.whatsapp.com/DS3fjSI6dpc78nu4rXc0Fb?s=cl&p=a&mlu=0&amv=0"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Shamo Fashion sur WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-vivrebio-vert hover:text-encre"
              >
                <FaWhatsapp size={16} />
              </a>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">
              Boutique
            </p>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/boutique" className="hover:text-white">Tous les articles</Link></li>
              <li><Link href="/boutique?categorie=costumes" className="hover:text-white">Costumes</Link></li>
              <li><Link href="/boutique?categorie=chemises" className="hover:text-white">Chemises</Link></li>
              <li><Link href="/boutique?categorie=chaussures" className="hover:text-white">Chaussures</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">
              Informations
            </p>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/livraison" className="hover:text-white">Livraison</Link></li>
              <li><Link href="/cgv" className="hover:text-white">Conditions générales de vente</Link></li>
              <li><Link href="/politique-de-confidentialite" className="hover:text-white">Politique de confidentialité</Link></li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">
              Contact
            </p>
            <ul className="space-y-1.5 text-sm text-white/70">
              <li><a href="tel:+2290165116925" className="hover:text-white">+229 01 65 11 69 25</a></li>
              <li><a href="tel:+22996565322" className="hover:text-white">01 96 56 53 22</a></li>
            </ul>
            <p className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">
              Restons en contact
            </p>
            <NewsletterForm />
            <p className="mt-2 text-[11px] text-white/40">
              <a href="/desabonnement" className="hover:underline">Se désabonner</a>
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row">
          <span>© {new Date().getFullYear()} Grace Débordée — Shamo Fashion. Tous droits réservés.</span>
          {/* TODO: remplacer # par le vrai lien du portfolio */}
          <a href="#" target="_blank" rel="noopener noreferrer" className="hover:underline">
            <span>By Oscar dev</span>
          </a>
          <a href={LIEN_MAPS_BOUTIQUE} target="_blank" rel="noopener noreferrer" className="hover:underline">
            <span>Godomey, Bénin</span>
          </a>
        </div>
      </div>
    </footer>
  );
}