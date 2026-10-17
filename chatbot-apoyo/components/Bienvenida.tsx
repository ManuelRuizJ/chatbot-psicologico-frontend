import Marca from "./Marca";

// Cambia el nombre cuando el equipo lo decida.
const NOMBRE_PROYECTO = "Apoyo inicial";

export default function Bienvenida({ onStart }: { onStart: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-6 py-12">
      {/* Espacio para el logo de la Ibero: agregar aquí cuando haya archivo oficial y permiso de uso */}
      <Marca className="h-14 w-14" />
      <h1 className="mt-6 text-3xl font-semibold">{NOMBRE_PROYECTO}</h1>
      <p className="mt-3 text-lg leading-relaxed text-texto-suave">
        Un espacio para platicar sobre el estrés y la ansiedad de la vida
        universitaria, a tu ritmo y sin juicios.
      </p>

      <ul className="mt-8 space-y-3">
        {[
          "Es una orientación inicial, no sustituye la atención de un profesional.",
          "Si lo necesitas, te sugeriremos un área de la universidad que puede apoyarte.",
          "Tu participación es voluntaria y puedes terminar cuando quieras.",
        ].map((t) => (
          <li key={t} className="flex gap-3 rounded-lg bg-apoyo-suave px-4 py-3 leading-relaxed">
            <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-apoyo" />
            {t}
          </li>
        ))}
      </ul>

      <button
        onClick={onStart}
        className="mt-10 self-start rounded-lg bg-acento px-6 py-3 font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento"
      >
        Comenzar
      </button>
    </main>
  );
}