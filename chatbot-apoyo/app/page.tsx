"use client";

import { useState } from "react";
import Consentimiento from "@/components/Consentimiento";
import Chat from "@/components/Chat";
import { startSession, ApiError } from "@/lib/api";
import type { StartParams } from "@/lib/types";
import Bienvenida from "@/components/Bienvenida";
import { guardarRecordado, borrarRecordado } from "@/lib/recordar";

function mensajeDeInicio(e: unknown): string {
  if (e instanceof ApiError) {
    switch (e.code) {
      case "INVALID_ACCESS_CODE":
        return "El código de acceso no es válido. Revísalo e inténtalo de nuevo.";
      case "INVALID_PARTICIPANT":
        return "Revisa tu nombre y correo.";
      case "NETWORK":
        return "No se pudo conectar con el servidor. Intenta de nuevo.";
    }
  }
  return "No se pudo iniciar la sesión. Intenta de nuevo.";
}

export default function Home() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [vioBienvenida, setVioBienvenida] = useState(false);

  async function handleAccept(p: StartParams, recordar: boolean) {
    setLoading(true);
    setError(null);
    setAviso(null);
    try {
      const { session_id } = await startSession(p);
      if (recordar) {
        guardarRecordado({ name: p.name.trim(), email: p.email.trim(), code: p.accessCode.trim() });
      } else {
        borrarRecordado();
      }
      setSessionId(session_id);
    } catch (e) {
      setError(mensajeDeInicio(e));
    } finally {
      setLoading(false);
    }
  }

  function salir(motivo?: string) {
    setSessionId(null);
    setAviso(motivo ?? null);
  }

  if (!sessionId && !vioBienvenida) {
    return <Bienvenida onStart={() => setVioBienvenida(true)} />;
  }

  if (!sessionId) {
    return (
      <Consentimiento onAccept={handleAccept} loading={loading} error={error} aviso={aviso} />
    );
  }

  return (
    <Chat
      sessionId={sessionId}
      onSessionLost={() =>
        salir("Tu sesión terminó o expiró. Para continuar, vuelve a aceptar el consentimiento.")
      }
      onEnd={() => salir("Sesión terminada. Tu conversación se borró de esta pantalla.")}
    />
  );
}