import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",
    "rounded-lg font-medium tracking-[-0.005em]",
    "transition-[background-color,border-color,color,opacity,transform] duration-150 ease-out",
    "active:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-45",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        // Ação principal — verde-floresta, cor de marca
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
        // Ação secundária — superfície com borda de 1px
        secondary:
          "bg-surface text-foreground border border-border hover:bg-surface-hover hover:border-border-strong",
        // Terciária — só contorno
        outline:
          "border border-border-strong text-foreground hover:bg-surface-hover",
        // Discreta — dentro de listas e cabeçalhos
        ghost: "text-muted-strong hover:bg-surface-hover hover:text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:opacity-90",
        link: "text-primary underline decoration-border-strong decoration-1 underline-offset-4 hover:decoration-primary",
      },
      size: {
        sm: "h-9 px-3 text-[0.8125rem]",
        default: "h-10 px-4 text-[0.9375rem]",
        lg: "h-11 px-5 text-[0.9375rem]",
        xl: "h-12 px-6 text-base",
        icon: "size-10",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
