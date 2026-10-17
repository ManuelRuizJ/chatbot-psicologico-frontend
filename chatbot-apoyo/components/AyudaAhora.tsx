"use client";

import { useRef } from "react";
import type { Areas, AreaCode } from "@/lib/types";
import { AREA_NAMES } from "@/lib/types";

const ORDEN: AreaCode[] = ["CAII", "OPTA", "FOE"];

export default function AyudaAhora({ areas }: { areas: Areas | null }) {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="w-full border-b border-borde bg-apoyo-suave px-4 py-2 text-sm font-medium text-apoyo focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-apoyo"
      >
        ¿Necesitas ayuda ahora?
      </button>

      <dialog
        ref={ref}
        aria-labelledby="ayuda-titulo"
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
        className="m-auto w-[min(92vw,28rem)] rounded-xl border border-borde bg-superficie p-0 text-texto backdrop:bg-black/40"
      >
        <div className="p-5">
          <h2 id="ayuda-titulo" className="text-lg font-semibold">
            Personas que pueden ayudarte
          </h2>
          <p className="mt-1 text-sm text-texto-suave">
            Si estás en peligro o piensas en hacerte daño, busca ayuda de
            inmediato con la primera opción o con alguien cercano.
          </p>

          <div className="mt-4 space-y-3">
            {ORDEN.map((code) => {
              const a = areas?.[code];
              const datos = (
                [["Teléfono", a?.telefono], ["Horario", a?.horario], ["Ubicación", a?.ubicacion]] as const
              ).filter(([, v]) => v);
              return (
                <section key={code} className="rounded-lg border border-borde p-3">
                  <h3 className="font-medium">{AREA_NAMES[code]}</h3>
                  {datos.length > 0 ? (
                    <dl className="mt-1 space-y-0.5 text-sm">
                      {datos.map(([et, v]) => (
                        <div key={et} className="flex gap-2">
                          <dt className="text-texto-suave">{et}:</dt>
                          <dd>{v}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="mt-1 text-sm text-texto-suave">
                      Datos de contacto por confirmar.
                    </p>
                  )}
                </section>
              );
            })}
          </div>

          <form method="dialog" className="mt-5 text-right">
            <button className="rounded-lg bg-acento px-4 py-2 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento">
              Cerrar
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}