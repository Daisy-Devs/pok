import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/src/lib/utils"
import { Field, FieldLabel } from "./field"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="size-full flex-1 bg-primary transition-all bg-linear-to-r from-primary-progress to-primary"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

interface ProgressWithLabelProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  label:React.ReactNode
}
function ProgressWithLabel({
  className,
  value,
  label,
  ...props
}: ProgressWithLabelProps) {
   return (
    <Field className="w-full gap-3">
      <FieldLabel htmlFor="progress-upload">
        {label}
        <span className="ml-auto text-primary font-semibold text-lg">{value}%</span>
      </FieldLabel>
      <Progress value={value} id="progress-upload" className={className} {...props} />
    </Field>
  )
}
export { Progress, ProgressWithLabel }
