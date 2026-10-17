"use client";

import { useEffect, useRef, useState } from "react";
import { ApiError, getAreas, sendMessage } from "@/lib/api";
import type { Areas, Referral } from "@/lib/types";
import TarjetaDerivacion from "./TarjetaDerivacion";

interface Msg {
  id: number;
  role: "user" | "bot" | "error";
  text: string;
  referral?: Referral;
}

function mensajeDeError(e: unknown): string {
  if (e instanceof ApiError) {
    switch (e.code) {
      case "EMPTY_MESSAGE":
        return "Escribe un mensaje antes de enviar.";
      case "LLM_UNAVAILABLE":
        return "El asistente no está disponible en este momento. Intenta de nuevo en unos minutos.";
      case "SESSION_NOT_FOUND":
      case "NO_CONSENT":
        return "Tu sesión expiró. Recarga la página para comenzar de nuevo.";
      case "NETWORK":
        return "No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.";
    }
  }
  return "Ocurrió un error inesperado. Intenta de nuevo.";
}

export default function Chat({ sessionId, onSessionLost, }: { sessionId: string; onSessionLost: () => void; }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [areas, setAreas] = useState<Areas | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    getAreas().then(setAreas).catch(() => setAreas(null));
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
  const el = textareaRef.current;
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
}, [input]);

  function add(msg: Omit<Msg, "id">) {
    setMessages((prev) => [...prev, { ...msg, id: nextId.current++ }]);
  }

  async function submit() {
    const text = input.trim();
    if (!text || sending) return;
    add({ role: "user", text });
    setInput("");
    setSending(true);
    try {
      const res = await sendMessage(sessionId, text);
      add({ role: "bot", text: res.reply, referral: res.referral });
    } catch (e) {
      if (e instanceof ApiError && (e.code === "SESSION_NOT_FOUND" || e.code === "NO_CONSENT")) {
        onSessionLost();
        return;
      }
      add({ role: "error", text: mensajeDeError(e) });
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  }

  return (
    <div className="mx-auto flex h-dvh max-w-2xl flex-col">
      <header className="border-b border-borde px-4 py-3">
        <p className="text-sm text-texto-suave">
          Este asistente ofrece apoyo inicial y no sustituye la atención de un
          profesional.
        </p>
      </header>

      <div
        role="log"
        aria-live="polite"
        aria-label="Conversación"
        className="flex-1 space-y-4 overflow-y-auto px-4 py-6"
      >
        {messages.length === 0 && (
          <p className="text-texto-suave">
            Puedes escribir cómo te sientes. Estoy aquí para escucharte.
          </p>
        )}

        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="flex justify-end">
              <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-acento px-4 py-2.5 text-white">
                {m.text}
              </p>
            </div>
          ) : m.role === "error" ? (
            <p key={m.id} role="alert" className="max-w-[85%] rounded-lg border border-error-borde bg-error-fondo px-4 py-2.5 text-sm text-error-texto">
              {m.text}
            </p>
          ) : (
            <div key={m.id} className="max-w-[85%]">
              <p className="whitespace-pre-wrap rounded-2xl border border-borde bg-superficie px-4 py-2.5">
                {m.text}
              </p>
              {m.referral && (
                <TarjetaDerivacion
                  code={m.referral}
                  area={areas?.[m.referral] ?? null}
                />
              )}
            </div>
          )
        )}

        {sending && <p className="text-sm text-texto-suave">Escribiendo…</p>}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex items-end gap-2 border-t border-borde px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      >
        <label htmlFor="mensaje" className="sr-only">
          Escribe tu mensaje
        </label>
        <textarea
          ref = {textareaRef}
          id="mensaje"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder="Escribe aquí…"
          className="max-h-40 flex-1 resize-none overflow-y-auto rounded-lg border border-borde bg-superficie px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-acento"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="rounded-lg bg-acento px-4 py-2.5 font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento disabled:cursor-not-allowed disabled:opacity-40"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}