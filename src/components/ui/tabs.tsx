"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/src/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

// THIS WAS THE MISSING PIECE CAUSING YOUR ERROR
const tabsListVariants = cva(
  "inline-flex h-12 items-center justify-center rounded-xl bg-[#F0F2F5] p-1 text-muted-foreground",
  {
    variants: {
      variant: {
        default: "",
        line: "bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2 text-sm font-bold transition-all outline-none disabled:pointer-events-none disabled:opacity-50",
        "text-foreground bg-transparent",
        "data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm",
        "aria-selected:bg-white aria-selected:text-primary",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn("mt-2 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }