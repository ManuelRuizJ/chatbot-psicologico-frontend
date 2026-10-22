import type { Area, AreaCode } from "./types";

const DIRECTORIO: Record<AreaCode, { telefono: string; horario: string; ubicacion: string }> = {
  CAII: { telefono: "14002", horario: "8:00 am a 5:00 pm", ubicacion: "E-202" },
  OPTA: { telefono: "12318", horario: "8:00 am a 7:00 pm", ubicacion: "C-102" },
  FOE: { telefono: "14115", horario: "8:00 am a 5:00 pm", ubicacion: "H-201" },
};

export const LINEAS_EXTERNAS = [
  { nombre: "Emergencias", texto: "911", tel: "911", nota: null },
  {
    nombre: "Línea de la Vida (CONASAMA, Secretaría de Salud)",
    texto: "800 911 2000",
    tel: "8009112000",
    nota: "Gratuita, las 24 horas",
  },
];

export function contactoDe(code: AreaCode, area: Area | null | undefined) {
  const d = DIRECTORIO[code];
  return {
    telefono: area?.telefono ?? d.telefono,
    horario: area?.horario ?? d.horario,
    ubicacion: area?.ubicacion ?? d.ubicacion,
  };
}