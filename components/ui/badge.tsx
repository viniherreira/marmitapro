import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-md border px-2 py-0.5",
    "text-[0.6875rem] font-medium uppercase leading-4 tracking-[0.08em]",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3",
  ].join(" "),
  {
    variants: {
      variant: {
        neutral: "border-border bg-surface-sunken text-muted-strong",
        primary: "border-transparent bg-primary-soft text-primary",
        accent: "border-transparent bg-accent-soft text-accent-foreground dark:text-accent",
        success: "border-transparent bg-success-soft text-success",
        warning: "border-transparent bg-warning-soft text-warning",
        destructive:
          "border-transparent bg-destructive-soft text-destructive",
        outline: "border-border-strong bg-transparent text-muted-strong",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
