"use client";

import { useState } from "react";
import { isValidEmail, isValidName, MAX_NAME, MAX_EMAIL } from "@/lib/validation";
import { leerRecordado, borrarRecordado } from "@/lib/recordar";
import type { StartParams } from "@/lib/types";

interface Props {
  onAccept: (p: StartParams, recordar: boolean) => Promise<void>;
  loading: boolean;
  error: string | null;
  aviso: string | null; // aviso amable, p. ej. cuando la sesión expiró
}

const campo =
  "mt-1 w-full rounded-lg border border-borde bg-superficie px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-acento";

export default function Consentimiento({ onAccept, loading, error, aviso }: Props) {
  // Si hay datos recordados se precargan; "Acepto participar" nunca se precarga.
  // Se lee en el estado inicial porque este componente solo se monta en el
  // navegador (viene después de la bienvenida), así que no hay desajuste de hidratación.
  const [inicial] = useState(leerRecordado);
  const [name, setName] = useState(inicial?.name ?? "");
  const [email, setEmail] = useState(inicial?.email ?? "");
  const [code, setCode] = useState(inicial?.code ?? "");
  const [recordar, setRecordar] = useState(inicial !== null);
  const [hayGuardado, setHayGuardado] = useState(inicial !== null);
  const [checked, setChecked] = useState(false);
  const [tocado, setTocado] = useState(false);

  const nombreOk = isValidName(name);
  const correoOk = isValidEmail(email);
  const codigoOk = code.trim().length > 0;
  const listo = nombreOk && correoOk && codigoOk && checked;

  function olvidar() {
    borrarRecordado();
    setName("");
    setEmail("");
    setCode("");
    setRecordar(false);
    setHayGuardado(false);
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setTocado(true);
    if (!listo || loading) return;
    await onAccept({ consentAccepted: true, name, email, accessCode: code }, recordar);
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Consentimiento informado</h1>
      <p className="mt-2 text-sm text-texto-suave">
        Lee con calma antes de continuar. Tu participación es voluntaria.
      </p>

      {aviso && (
        <p role="status" className="mt-6 rounded-lg border border-borde bg-acento-suave px-4 py-3 text-sm">
          {aviso}
        </p>
      )}

      <div className="mt-6 space-y-5 leading-relaxed">
        <p>
          Estás por participar en la prueba piloto de un chatbot desarrollado
          como proyecto de tesis (ASE III), diseñado para ofrecer orientación
          preliminar sobre manejo de estrés y ansiedad.
        </p>

        <section>
          <h2 className="font-semibold">Qué es y qué no es esta herramienta</h2>
          <p className="mt-1">
            Este chatbot no es un servicio de terapia ni de atención psicológica
            profesional. Es una herramienta de apoyo inicial y con fines
            educativos, desarrollada por estudiantes de Ingeniería en Sistemas
            Computacionales e Ingeniería Biomédica. No realiza diagnósticos ni
            sustituye la atención de un profesional de salud mental.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">Qué hacer en caso de emergencia</h2>
          <p className="mt-1">
            Este chatbot no está diseñado para atender emergencias de salud
            mental. Si en algún momento tienes pensamientos de hacerte daño o
            estás en una situación de crisis, contacta de inmediato a la
            Coordinación de Atención de Incidentes Inmediata de la universidad
            o a alguien de confianza que esté cerca de ti. Dentro del chat
            tendrás siempre a la mano un botón con los contactos.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">Qué se hace con la información</h2>
          <p className="mt-1">
            <strong>El contenido de tus conversaciones no se guarda.</strong>{" "}
            Mientras chateas, el sistema conserva temporalmente tus mensajes
            solo para dar continuidad a la conversación, y los descarta poco
            después de que termina tu sesión. No se almacenan en ninguna base
            de datos y el equipo no los consulta.
          </p>
          <p className="mt-2">
            Lo que sí se registra, sin ligarlo a tu nombre ni a tu correo, es el
            nivel de alerta que detectó el sistema en cada mensaje (ninguno,
            bajo, medio o alto), el área de apoyo sugerida y la fecha y hora
            aproximada de uso. Estos datos se usan únicamente para evaluar el
            funcionamiento técnico de este proyecto de tesis; los resultados se
            presentan de forma anónima y agregada.
          </p>
          <p className="mt-2">
            Tus mensajes pasan por un proveedor externo de inteligencia
            artificial para generar las respuestas. Evita escribir datos que te
            identifiquen, como tu nombre completo, matrícula o teléfono.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">Aviso de privacidad</h2>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>
              <strong>Datos personales que se recaban:</strong> tu nombre y tu
              correo electrónico, únicamente como constancia de que aceptaste
              participar. No se ligan a tus conversaciones ni a los niveles de
              alerta.
            </li>
            <li>
              <strong>Para qué se usan:</strong> para comprobar que cada
              participante aceptó este consentimiento y para llevar el control
              de los 50 participantes del piloto.
            </li>
            <li>
              <strong>Con quién se comparten:</strong> no se comparten con
              terceros. Los mensajes que escribes en el chat sí se envían al
              proveedor de inteligencia artificial, como se explicó arriba.
            </li>
            <li>
              <strong>Tus derechos:</strong> puedes pedir en cualquier momento
              que se consulte, corrija o elimine tu constancia, y retirarte del
              piloto.
            </li>
            <li>
              Si lo eliges, tu nombre, correo y código de acceso se guardan solo en tu
              propio navegador, no en nuestros servidores. Puedes borrarlos cuando quieras.
            </li>
            {/* PENDIENTE (texto v2 con [CORCHETES]): responsable de los datos,
                tiempo de conservación y correo de contacto. Agregar aquí cuando
                la coordinadora los confirme. No mostrar corchetes al estudiante. */}
          </ul>
        </section>

        <section>
          <h2 className="font-semibold">Participación voluntaria</h2>
          <p className="mt-1">
            Puedes dejar de usar el chatbot y retirarte en cualquier momento,
            sin ninguna consecuencia académica ni personal.
          </p>
        </section>
      </div>

      <form onSubmit={enviar} noValidate className="mt-10 space-y-5 border-t border-borde pt-8">
        <h2 className="font-semibold">Confirmación</h2>

        <div>
          <label htmlFor="nombre" className="text-sm font-medium">Nombre</label>
          <input
            id="nombre"
            type="text"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={tocado && !nombreOk}
            className={campo}
          />
          {tocado && !nombreOk && (
            <p className="mt-1 text-sm text-error-texto">Escribe tu nombre (mínimo 2 caracteres, con letras).</p>
          )}
        </div>

        <div>
          <label htmlFor="correo" className="text-sm font-medium">Correo</label>
          <input
            id="correo"
            type="email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={tocado && !correoOk}
            className={campo}
          />
          {tocado && !correoOk && (
            <p className="mt-1 text-sm text-error-texto">Escribe un correo válido.</p>
          )}
        </div>

        <div>
          <label htmlFor="codigo" className="text-sm font-medium">Código de acceso</label>
          <input
            id="codigo"
            type="text"
            autoComplete="off"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            aria-invalid={tocado && !codigoOk}
            className={campo}
          />
          {tocado && !codigoOk && (
            <p className="mt-1 text-sm text-error-texto">Escribe el código que te dio el equipo.</p>
          )}
        </div>
        
        <div>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={recordar}
              onChange={(e) => setRecordar(e.target.checked)}
              className="mt-1 h-5 w-5 accent-acento"
            />
            <span>Recordarme en este dispositivo (se guarda solo en tu navegador)</span>
          </label>
          {hayGuardado && (
            <button
              type="button"
              onClick={olvidar}
              className="mt-2 text-sm text-texto-suave underline focus-visible:outline-2 focus-visible:outline-acento"
            >
              Olvidar mis datos en este dispositivo
            </button>
          )}
        </div>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-1 h-5 w-5 accent-acento"
          />
          <span>
            Acepto participar en esta prueba piloto, bajo las condiciones
            descritas arriba.
          </span>
        </label>
        {tocado && !checked && (
          <p className="text-sm text-error-texto">Debes aceptar para continuar.</p>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-error-borde bg-error-fondo px-4 py-3 text-sm text-error-texto"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-acento px-5 py-3 font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Iniciando…" : "Continuar"}
        </button>
      </form>
    </main>
  );
}