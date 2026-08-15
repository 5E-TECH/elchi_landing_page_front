import type { ReactNode } from "react";

/** Dizayndagi oq karta: 1px konturli, to'ldirilmagan soya. */
export default function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-card border border-navy/10 bg-white p-6 md:p-7 ${className}`}
    >
      {children}
    </div>
  );
}
