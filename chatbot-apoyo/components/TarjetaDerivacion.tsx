import type { Area, AreaCode } from "@/lib/types";
import { AREA_NAMES } from "@/lib/types";

interface Props {
  code: AreaCode;
  area: Area | null; // null si /areas aún no cargó o falló
}

export default function TarjetaDerivacion({ code, area }: Props) {
  const datos = [
    ["Teléfono", area?.telefono],
    ["Horario", area?.horario],
    ["Ubicación", area?.ubicacion],
  ].filter(([, valor]) => valor) as [string, string][];

  return (
    <aside
      aria-label="Área de apoyo sugerida"
      className="mt-3 rounded-lg border border-borde bg-acento-suave p-4"
    >
      <p className="text-sm text-texto-suave">Te sugerimos acercarte a:</p>
      <p className="mt-1 font-semibold">{AREA_NAMES[code]}</p>
      {datos.length > 0 && (
        <dl className="mt-3 space-y-1 text-sm">
          {datos.map(([etiqueta, valor]) => (
            <div key={etiqueta} className="flex gap-2">
              <dt className="text-texto-suave">{etiqueta}:</dt>
              <dd>{valor}</dd>
            </div>
          ))}
        </dl>
      )}
    </aside>
  );
}