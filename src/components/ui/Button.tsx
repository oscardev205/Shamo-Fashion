// src/components/ui/Button.tsx
// Bouton réutilisable avec 2 variantes : plein (or) et contour (bordeaux).
// On centralise le style ici pour ne jamais réécrire les classes Tailwind à la main.
// Texte foncé sur le bouton plein doré (meilleur contraste que du blanc sur or).

import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline";
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded-lg px-5 py-2.5 text-sm font-medium transition",
        variant === "primary" && "bg-vivrebio-vert text-encre hover:brightness-95 bouton-brillance",
        variant === "outline" && "border-2 border-vivrebio-rouge text-vivrebio-rouge hover:bg-vivrebio-rouge/10",
        className
      )}
      {...props}
    />
  );
}