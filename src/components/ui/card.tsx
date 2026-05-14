import * as React from "react";
import { cn } from "@/src/lib/utils"; // ← add this

type CardVariant = "default" | "cause" | "campaign";

export function Card({   // ← add export
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  size?: "default" | "sm";
  variant?: CardVariant;
}) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-variant={variant}
      className={cn(
        "group/card flex flex-col overflow-hidden rounded-xl bg-card text-sm text-card-foreground ring-1 ring-foreground/10",
        variant === "campaign" && "p-0 gap-0 rounded-2xl shadow-sm",
        variant === "cause" && " rounded-2xl shadow-sm ",
        className
      )}
      {...props}
    />
  );
}