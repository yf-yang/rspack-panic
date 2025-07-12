import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@udecode/cn"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3.5 gap-1.5 [&>svg]:pointer-events-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring/50 aria-invalid:ring-destructive/30 transition-all duration-200 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blue-600 text-white [a&]:hover:bg-blue-700 dark:bg-blue-500 dark:text-white dark:[a&]:hover:bg-blue-600",
        secondary:
          "border-transparent bg-gray-200 text-gray-800 [a&]:hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:[a&]:hover:bg-gray-600",
        destructive:
          "border-transparent bg-red-500 text-white [a&]:hover:bg-red-600 dark:bg-red-600/80 dark:text-white dark:[a&]:hover:bg-red-600",
        outline:
          "text-gray-700 border-gray-300 [a&]:hover:bg-gray-100 [a&]:hover:text-gray-900 dark:text-gray-300 dark:border-gray-600 dark:[a&]:hover:bg-gray-800 dark:[a&]:hover:text-gray-200",
        success:
          "border-transparent bg-green-500 text-white [a&]:hover:bg-green-600 dark:bg-green-600/80 dark:text-white dark:[a&]:hover:bg-green-600",
        warning:
          "border-transparent bg-yellow-500 text-white [a&]:hover:bg-yellow-600 dark:bg-yellow-600/80 dark:text-white dark:[a&]:hover:bg-yellow-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
