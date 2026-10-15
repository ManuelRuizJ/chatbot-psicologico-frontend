"use client";

import { useState } from "react";

interface Props {
  onAccept: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export default function Consentimiento({ onAccept, loading, error }: Props) {
  const [checked, setChecked] = useState(false);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-12">
      <h1 className="text-2xl font-semibold">Antes de comenzar</h1>
      <p className="mt-4 leading-relaxed">
        Este asistente ofrece apoyo inicial para el estrés y la ansiedad a
        estudiantes de la Ibero Puebla. No sustituye la atención de un
        profesional.
      </p>
      <p className="mt-3 leading-relaxed text-texto-suave">
        Según lo que escribas, podríamos sugerirte acercarte a un área de la
        universidad. Los mensajes no se guardan; solo se registran datos
        generales de uso.
      </p>

      <label className="mt-8 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-1 h-5 w-5 accent-acento"
        />
        <span className="leading-relaxed">
          He leído lo anterior y acepto participar en este piloto.
        </span>
      </label>

      {error && (
        <p role="alert" className="mt-4 text-sm text-acento">
          {error}
        </p>
      )}

      <button
        onClick={onAccept}
        disabled={!checked || loading}
        className="mt-8 rounded-lg bg-acento px-5 py-3 font-medium text-white transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Iniciando…" : "Continuar"}
      </button>
    </main>
  );
}