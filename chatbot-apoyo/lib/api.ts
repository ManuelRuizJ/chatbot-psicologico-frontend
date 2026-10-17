import type { Areas, ChatResponse, ErrorCode, Referral, RiskLevel, StartParams } from "./types";
import { AREA_NAMES } from "./types";
import { isValidEmail } from "./validation";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const CONSENT_VERSION = "v2";

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
    throw new ApiError(data?.code ?? "UNKNOWN", data?.error ?? "Error inesperado");
  }
  return data as T;
}

/* ---------- Mock (imita al backend, solo para pruebas) ---------- */

const wait = (ms = 600) => new Promise((r) => setTimeout(r, ms));

const MOCK_ACCESS_CODE = "piloto-123"; // solo existe en el mock
const mockSessions = new Set<string>(); // se vacía al recargar el servidor de Next, como un reinicio

// Esta tabla vive SOLO en el mock. El frontend real nunca la usa.
const MOCK_REFERRAL: Record<RiskLevel, Referral> = {
  none: null,
  low: "FOE",
  medium: "OPTA",
  high: "CAII",
};

const mock = {
  async startSession(p: StartParams) {
    await wait(300);
    if (!p.consentAccepted) throw new ApiError("NO_CONSENT", "Consentimiento requerido");
    if (p.accessCode.trim() !== MOCK_ACCESS_CODE) {
      throw new ApiError("INVALID_ACCESS_CODE", "Código de acceso inválido");
    }
    if (!p.name.trim() || !isValidEmail(p.email)) {
      throw new ApiError("INVALID_PARTICIPANT", "Nombre o correo inválido");
    }
    const session_id = crypto.randomUUID();
    mockSessions.add(session_id);
    return { session_id };
  },

  async sendMessage(sessionId: string, message: string): Promise<ChatResponse> {
    await wait();
    if (!mockSessions.has(sessionId)) {
      throw new ApiError("SESSION_NOT_FOUND", "Sesión no encontrada o expirada");
    }
    if (!message.trim()) throw new ApiError("EMPTY_MESSAGE", "Mensaje vacío");
    if (message.includes("#expirar")) {
      mockSessions.delete(sessionId);
      throw new ApiError("SESSION_NOT_FOUND", "Sesión no encontrada o expirada");
    }
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
      CAII: { nombre: AREA_NAMES.CAII, telefono: "222 000 0000", horario: "24 h", ubicacion: null },
      OPTA: { nombre: AREA_NAMES.OPTA, ...base },
    };
  },
};

/* ---------- API pública (lo único que importan los componentes) ---------- */

// Nombre y correo solo pasan por aquí hacia el backend: no se guardan en ningún lado.
export function startSession(p: StartParams) {
  return USE_MOCK
    ? mock.startSession(p)
    : request<{ session_id: string }>("/session/start", {
        consent_accepted: p.consentAccepted,
        consent_version: CONSENT_VERSION,
        participant_name: p.name.trim(),
        participant_email: p.email.trim(),
        access_code: p.accessCode.trim(),
      });
}

export function sendMessage(sessionId: string, message: string) {
  return USE_MOCK
    ? mock.sendMessage(sessionId, message)
    : request<ChatResponse>("/chat", { session_id: sessionId, message });
}

export function getAreas() {
  return USE_MOCK ? mock.getAreas() : request<Areas>("/areas");
}