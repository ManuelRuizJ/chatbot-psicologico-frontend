"use client";

import { useRef } from "react";
import type { Areas, AreaCode } from "@/lib/types";
import { AREA_NAMES } from "@/lib/types";
import { contactoDe, LINEAS_EXTERNAS } from "@/lib/contactos";

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
        className="m-auto max-h-[90dvh] w-[min(92vw,28rem)] overflow-y-auto rounded-xl border border-borde bg-superficie p-0 text-texto backdrop:bg-black/40"
      >
        <div className="p-5">
          <h2 id="ayuda-titulo" className="text-lg font-semibold">
            Personas que pueden ayudarte
          </h2>
          <p className="mt-1 text-sm text-texto-suave">
            Este asistente no avisa a nadie por ti: si necesitas ayuda, comunícate tú
            con alguien. Si estás en peligro o piensas en hacerte daño, hazlo de
            inmediato.
          </p>

          <h3 className="mt-4 text-sm font-semibold">En una emergencia o fuera de horario</h3>
          <div className="mt-2 space-y-3">
            {LINEAS_EXTERNAS.map((l) => (
              <section key={l.tel} className="rounded-lg border border-borde bg-apoyo-suave p-3">
                <p className="font-medium">{l.nombre}</p>
                <p className="mt-1 text-sm">
                  <a href={`tel:${l.tel}`} className="font-semibold text-apoyo underline">
                    {l.texto}
                  </a>
                  {l.nota && <span className="text-texto-suave"> · {l.nota}</span>}
                </p>
              </section>
            ))}
          </div>

          <h3 className="mt-5 text-sm font-semibold">En la universidad</h3>
          <div className="mt-2 space-y-3">
            {ORDEN.map((code) => {
              const c = contactoDe(code, areas?.[code]);
              return (
                <section key={code} className="rounded-lg border border-borde p-3">
                  <h4 className="font-medium">{AREA_NAMES[code]}</h4>
                  <dl className="mt-1 space-y-0.5 text-sm">
                    <div className="flex gap-2">
                      <dt className="text-texto-suave">Teléfono:</dt>
                      <dd>{c.telefono}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-texto-suave">Horario:</dt>
                      <dd>{c.horario}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-texto-suave">Ubicación:</dt>
                      <dd>{c.ubicacion}</dd>
                    </div>
                  </dl>
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