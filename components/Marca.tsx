export default function Marca({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <circle cx="19" cy="24" r="13" className="fill-acento" opacity="0.85" />
      <circle cx="29" cy="24" r="13" className="fill-apoyo" opacity="0.75" />
    </svg>
  );
}