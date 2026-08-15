import type { ReactNode } from "react";

/**
 * Bo'lim ustidagi kichik katta-harfli yozuv.
 * `tone="light"` — quyuq (navy) fon ustida turganda.
 */
export default function Kicker({
  children,
  tone = "dark",
}: {
  children: ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <p
      className={`text-[12.5px] font-extrabold tracking-[0.1em] uppercase ${
        tone === "light" ? "text-bg/60" : "text-navy"
      }`}
    >
      {children}
    </p>
  );
}
