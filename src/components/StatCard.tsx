import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const statCardVariants = cva(
  "w-full flex flex-col rounded-xl text-primaryText items-start justify-center gap-3.5",
  {
    variants: {
      variant: {
        sm: "h-33 text-sm p-4",
        md: "h-52.5 text-sm p-6",
        lg: "h-60 text-base p-6",
      },
      intent: {
        default: "bg-white",
        subtle: "bg-background-secondary",
      },
    },
    defaultVariants: {
      variant: "md",
      intent: "default",
    },
  }
)

type StatCardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof statCardVariants> & {
    label: string
    value: string | number
    icon?: React.ReactNode
  }

export function StatCard({
  className,
  variant,
  intent,
  label,
  value,
  icon,
  ...props
}: StatCardProps) {
  return (
    <div className={cn(statCardVariants({ variant, intent }), className)} {...props}>
     {icon}
      <div className="flex flex-col gap-1">
        <p className="text-lg font-semibold text-secondaryText">{value}</p>
        <p >{label}</p>
      </div>
    </div>
  )
}
