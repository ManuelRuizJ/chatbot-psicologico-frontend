"use client";

import { useState } from "react";
import Consentimiento from "@/components/Consentimiento";
import { startSession, ApiError } from "@/lib/api";

export default function Home() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAccept() {
    setLoading(true);
    setError(null);
    try {
      const { session_id } = await startSession(true);
      setSessionId(session_id);
    } catch (e) {
      setError(
        e instanceof ApiError && e.code === "NETWORK"
          ? "No se pudo conectar con el servidor. Intenta de nuevo."
          : "No se pudo iniciar la sesión. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!sessionId) {
    return <Consentimiento onAccept={handleAccept} loading={loading} error={error} />;
  }

  // Placeholder: aquí irá el chat (siguiente paso)
  return <p className="p-8">Sesión iniciada: {sessionId}</p>;
}