import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

// -----------------------------------------------------------------------------
// VARIANTS
// -----------------------------------------------------------------------------
const inputVariants = cva(
  "w-full min-w-0 rounded-sm border bg-transparent transition-colors outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 focus-visible:ring-2",
  {
    variants: {
      variant: {
        default:
          "border-input focus-visible:border-ring/50  focus-visible:ring-ring/50",

        outline:
          "border-gray-400 focus-visible:border-ring/50 focus-visible:ring-ring/50",

        ghost: "border-transparent bg-transparent ",

        filled: "bg-input border-transparent ",

        error: "border-destructive focus-visible:ring-destructive/40",
      },

      size: {
        sm: "h-9 px-3 text-sm",
        default: "h-11 px-4 text-base",
        lg: "h-13 px-5 text-base",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------
export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;
  oppositeLabel?: React.ReactNode;
  error?: string;
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------
function Input({
  className,
  type = "text",
  variant,
  size,
  label,
  oppositeLabel,
  error,
  id,
  leftElement,
  rightElement,
  ...props
}: InputProps) {
  const inputId = id || React.useId();

  return (
    <div className="space-y-1 w-full">
      <div className="flex items-center justify-between">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold uppercase">
          {label}
        </label>
      )}
      {oppositeLabel && oppositeLabel}
      </div>
      <div className="relative"> 
        {leftElement && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftElement}
          </div>
        )}

        <input
          id={inputId}
          type={type}
          data-slot="input"
          aria-invalid={!!error}
          className={cn(
            inputVariants({
              variant: error ? "error" : variant,
              size,
            }),
            leftElement && "pl-10",
            rightElement && "pr-10",
            className,
          )}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export { Input, inputVariants };
