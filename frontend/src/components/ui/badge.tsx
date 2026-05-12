import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        pending:
          "border-transparent text-secondary bg-gray-400 hover:bg-gray-400/80",
        "for pick up":
          "border-transparent text-secondary bg-yellow-600 hover:bg-yellow-600/80",
        completed:
          "border-transparent text-secondary bg-green-500 hover:bg-green-500/80",
        rejected:
          "border-transparent text-secondary bg-red-500 hover:bg-red-500/80",
        cancelled:
          "border-transparent text-secondary bg-orange-500 hover:bg-orange-500/80",
        resolved:
          "border-transparent text-secondary bg-green-500 hover:bg-green-500/80",
        responded:
          "border-transparent text-secondary bg-yellow-600 hover:bg-yellow-600/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
