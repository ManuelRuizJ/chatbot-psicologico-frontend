import type { Areas, ChatResponse, ErrorCode, Referral, RiskLevel } from "./types";
import { AREA_NAMES } from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(public code: ErrorCode, message: string) {
    super(message);
  }
}

/* ---------- Backend real ---------- */

async function request<T>(path: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: body ? "POST" : "GET",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("NETWORK", "No se pudo conectar con el servidor");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(data?.code ?? "NETWORK", data?.error ?? "Error inesperado");
  }
  return data as T;
}

/* ---------- Mock (imita al backend, solo para pruebas) ---------- */

const wait = (ms = 600) => new Promise((r) => setTimeout(r, ms));

// Esta tabla vive SOLO en el mock. El frontend real nunca la usa.
const MOCK_REFERRAL: Record<RiskLevel, Referral> = {
  none: null,
  low: "FOE",
  medium: "OPTA",
  high: "CAII",
};

const mock = {
  async startSession(consent: boolean) {
    await wait(300);
    if (!consent) throw new ApiError("NO_CONSENT", "Consentimiento requerido");
    return { session_id: crypto.randomUUID() };
  },

  async sendMessage(message: string): Promise<ChatResponse> {
    await wait();
    if (!message.trim()) throw new ApiError("EMPTY_MESSAGE", "Mensaje vacío");
    if (message.includes("#error")) {
      throw new ApiError("LLM_UNAVAILABLE", "Servicio no disponible");
    }
    const tag = message.match(/#(none|low|medium|high)/)?.[1] as RiskLevel | undefined;
    const risk_level = tag ?? "none";
    return {
      reply: `Respuesta de prueba (riesgo: ${risk_level}).`,
      risk_level,
      referral: MOCK_REFERRAL[risk_level],
    };
  },

  async getAreas(): Promise<Areas> {
    await wait(200);
    const base = { telefono: null, horario: null, ubicacion: null };
    return {
      FOE: { nombre: AREA_NAMES.FOE, ...base },
      // Uno con datos y otros vacíos, para probar que solo se muestran los no-null
      CAII: { nombre: AREA_NAMES.CAII, telefono: "222 000 0000", horario: "24 h", ubicacion: null },
      OPTA: { nombre: AREA_NAMES.OPTA, ...base },
    };
  },
};

/* ---------- API pública (lo único que importan los componentes) ---------- */

export function startSession(consentAccepted: boolean) {
  return USE_MOCK
    ? mock.startSession(consentAccepted)
    : request<{ session_id: string }>("/session/start", {
        consent_accepted: consentAccepted,
        consent_version: "v1",
      });
}

export function sendMessage(sessionId: string, message: string) {
  return USE_MOCK
    ? mock.sendMessage(message)
    : request<ChatResponse>("/chat", { session_id: sessionId, message });
}

export function getAreas() {
  return USE_MOCK ? mock.getAreas() : request<Areas>("/areas");
}