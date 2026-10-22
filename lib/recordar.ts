const KEY = "apoyo:recordar";

export interface Recordado {
  name: string;
  email: string;
  code: string;
}

export function leerRecordado(): Recordado | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (
      typeof d?.name === "string" &&
      typeof d?.email === "string" &&
      typeof d?.code === "string"
    ) {
      return { name: d.name, email: d.email, code: d.code };
    }
  } catch {
    // el navegador puede bloquear el almacenamiento: se ignora
  }
  return null;
}

export function guardarRecordado(d: Recordado) {
  try {
    localStorage.setItem(KEY, JSON.stringify(d));
  } catch {}
}

export function borrarRecordado() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}