import * as React from 'react';

/** Detailing spray-bottle mark sized to match lucide header icons. */
export function SprayBottleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M8 8h8l-.6 11.2A2 2 0 0 1 13.4 21h-2.8a2 2 0 0 1-2-1.8L8 8Z" />
      <path d="M12 3V2" />
      <path d="M15.5 4.5 17 3" />
      <path d="M8.5 4.5 7 3" />
      <path d="M10 12h4" />
      <path d="M10.5 15.5h3" />
    </svg>
  );
}

export default SprayBottleIcon;
