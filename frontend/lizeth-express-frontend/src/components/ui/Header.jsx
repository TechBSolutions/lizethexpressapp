import React from "react";
import logo from "@/assets/logo.png";

export default function Header() {
  return (
    <header className="w-full bg-white shadow px-6 py-3 flex items-center justify-between">
      {/* Logo a la izquierda */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="Lizeth Express" className="h-10 w-auto" />
        <span className="text-lg font-semibold text-darkText">Lizeth Express</span>
      </div>

      {/* Aquí podrías colocar botones, nombre del usuario o menú más adelante */}
    </header>
  );
}
