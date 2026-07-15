import Image from "next/image";
import { cn } from "@/lib/utils";

const sizes = {
  sm: 36,
  md: 48,
  lg: 64,
} as const;

interface LogoProps {
  size?: keyof typeof sizes;
  className?: string;
  showBackground?: boolean;
}

export function Logo({ size = "sm", className, showBackground = false }: LogoProps) {
  const px = sizes[size];

  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 overflow-hidden",
        showBackground && "rounded-xl bg-gradient-primary",
        size === "sm" && "w-9 h-9 rounded-xl",
        size === "md" && "w-12 h-12 rounded-2xl",
        size === "lg" && "w-16 h-16 rounded-2xl",
        className,
      )}
    >
      <Image
        src="/logo.svg"
        alt="PromptOptim"
        width={px}
        height={px}
        className={cn(
          "object-contain",
          size === "sm" && "w-7 h-7",
          size === "md" && "w-9 h-9",
          size === "lg" && "w-12 h-12",
        )}
        priority
      />
    </div>
  );
}
