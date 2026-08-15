import type { ReactNode } from "react";

/** Dizayndagi 1240px / 32px o'lchamli sahifa konteyneri. */
export default function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`container-page ${className}`}>{children}</div>;
}
