// Reglas idénticas a las del backend (Contrato v0.2, sección 3, /session/start).
// El backend vuelve a validar siempre; esto solo da el aviso al instante.
 
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;
// Se construye con RegExp para no depender del "target" de TypeScript (\p{L} pide ES2018).
const HAS_LETTER = new RegExp("\\p{L}", "u");
 
export const MAX_NAME = 100;
export const MAX_EMAIL = 254;
 
export function isValidEmail(v: string): boolean {
  const email = v.trim();
  const local = email.split("@")[0];
  return (
    email.length <= MAX_EMAIL &&
    !email.includes("..") &&
    !local.startsWith(".") &&
    !local.endsWith(".") &&
    EMAIL_RE.test(email)
  );
}
 
export function isValidName(v: string): boolean {
  const name = v.trim().replace(/\s+/g, " ");
  return name.length >= 2 && name.length <= MAX_NAME && HAS_LETTER.test(name);
}