import Image from "next/image";
import Link from "next/link";

type Props = {
  href?: string | null;
  variant?: "header" | "full";
  className?: string;
};

function BrandText({ light = true }: { light?: boolean }) {
  return (
    <div className="leading-tight">
      <div
        className={`text-sm font-semibold tracking-tight ${
          light ? "text-white" : "text-slate-800"
        }`}
      >
        MarsaTrade
      </div>
      <div
        className={`text-[9px] tracking-wide ${
          light ? "text-slate-400" : "text-slate-500"
        }`}
      >
        Global Seafood Intelligence
      </div>
    </div>
  );
}

function BrandIcon({ size = 36, circle = false }: { size?: number; circle?: boolean }) {
  const img = (
    <Image
      src="/logo.png"
      alt=""
      width={size}
      height={size}
      className="object-cover object-top"
      style={{ width: size, height: size }}
      priority
    />
  );

  if (circle) {
    return (
      <div
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy-600 ring-2 ring-navy-700"
        style={{ width: size, height: size }}
      >
        {img}
      </div>
    );
  }

  return (
    <div className="shrink-0 overflow-hidden rounded-sm" style={{ width: size, height: size }}>
      {img}
    </div>
  );
}

export function MarsaTradeLogo({
  href = "/",
  variant = "header",
  className = "",
}: Props) {
  const content =
    variant === "full" ? (
      <Image
        src="/logo.png"
        alt="MarsaTrade — Global Seafood Intelligence"
        width={160}
        height={56}
        className={`h-14 w-auto object-contain ${className}`}
        priority
      />
    ) : (
      <span className={`inline-flex items-center gap-2.5 ${className}`}>
        <BrandIcon size={34} />
        <BrandText light />
      </span>
    );

  if (href === null) return content;

  return (
    <Link href={href ?? "/"} className="inline-flex shrink-0 items-center">
      {content}
    </Link>
  );
}

export function MarsaTradeMark({ href = "/dashboard" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 px-1">
      <BrandIcon size={36} circle />
      <BrandText light />
    </Link>
  );
}
