import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

/**
 * Dizayndagi pill tugmalar. To'rt ko'rinish:
 * - `primary`     — yorug' fonda navy to'ldirilgan (header CTA)
 * - `outline`     — yorug' fonda konturli
 * - `onNavy`      — quyuq blok ustida yorug' to'ldirilgan
 * - `outlineNavy` — quyuq blok ustida konturli
 */
type Variant = "primary" | "outline" | "onNavy" | "outlineNavy";
type Size = "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-navy text-bg hover:bg-navy-hover",
  outline: "border-[1.5px] border-navy/20 text-navy hover:border-navy/45",
  onNavy: "bg-bg text-navy hover:bg-white",
  outlineNavy: "border-[1.5px] border-bg/30 text-bg hover:border-bg",
};

const SIZES: Record<Size, string> = {
  md: "px-5 py-[11px] text-sm",
  lg: "px-[26px] py-[15px] text-[15.5px]",
};

function classes(variant: Variant, size: Size, className: string) {
  return [
    "inline-flex items-center justify-center gap-2 rounded-pill font-bold",
    "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
    variant === "onNavy" || variant === "outlineNavy"
      ? "focus-visible:outline-bg"
      : "focus-visible:outline-navy",
    VARIANTS[variant],
    SIZES[size],
    className,
  ].join(" ");
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: Omit<ComponentProps<typeof Link>, "href" | "className"> & {
  href: ComponentProps<typeof Link>["href"];
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link {...props} href={href} className={classes(variant, size, className)}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      {...props}
      className={`${classes(variant, size, className)} cursor-pointer disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {children}
    </button>
  );
}
