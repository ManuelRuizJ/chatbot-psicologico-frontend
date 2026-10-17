export type RiskLevel = "none" | "low" | "medium" | "high";
export type AreaCode = "FOE" | "CAII" | "OPTA";
export type Referral = AreaCode | null;

export type ErrorCode =
  | "NO_CONSENT"
  | "INVALID_ACCESS_CODE"
  | "INVALID_PARTICIPANT"
  | "SESSION_NOT_FOUND"
  | "EMPTY_MESSAGE"
  | "LLM_UNAVAILABLE"
  | "NETWORK" // solo del frontend: no hubo respuesta del servidor
  | "UNKNOWN"; // solo del frontend: respuesta con formato inesperado (ej. 422)

export interface StartParams {
  consentAccepted: boolean;
  name: string;
  email: string;
  accessCode: string;
}

export interface ChatResponse {
  reply: string;
  risk_level: RiskLevel;
  referral: Referral;
}

export interface Area {
  nombre: string;
  telefono: string | null;
  horario: string | null;
  ubicacion: string | null;
}
export type Areas = Record<AreaCode, Area>;

// Nombres completos fijos (sección 2 del contrato)
export const AREA_NAMES: Record<AreaCode, string> = {
  FOE: "Formación y Orientación Educativa",
  CAII: "Coordinación de Atención de Incidentes Inmediata",
  OPTA: "Clínica OPTA",
};