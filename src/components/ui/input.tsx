import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/src/lib/utils"

// -----------------------------------------------------------------------------
// VARIANTS
// -----------------------------------------------------------------------------
const inputVariants = cva(
  "w-full min-w-0 rounded-lg border bg-transparent transition-colors outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
  {
    variants: {
      variant: {
        default:
          "border-input focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",

        outline:
          "border-gray-400 focus-visible:border-black focus-visible:ring-2",

        ghost:
          "border-transparent bg-transparent focus-visible:ring-2",

        filled:
          "bg-input border-transparent focus-visible:ring-2",

        error:
          "border-destructive focus-visible:ring-destructive/40",
      },

      size: {
        sm: "h-7 px-2 text-sm",
        default: "h-8 px-2.5 text-sm",
        lg: "h-10 px-3 text-base",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------
export interface InputProps
  extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
  >,
    VariantProps<typeof inputVariants> {
      label?: string;
      error?: string;
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
  error,
  id,
  ...props
}: InputProps) {

  const inputId = id || React.useId();

  return (
    <div className="space-y-1 w-full">
      {label && (
        <label htmlFor={inputId} className="text-md font-medium">
          {label}
        </label>
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
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}

export { Input, inputVariants }