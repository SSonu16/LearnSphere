import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-border",
        // Status badges
        success:
          "border-transparent bg-success/10 text-success hover:bg-success/20",
        warning:
          "border-transparent bg-warning/10 text-warning hover:bg-warning/20",
        info:
          "border-transparent bg-info/10 text-info hover:bg-info/20",
        // LearnSphere custom
        accent:
          "border-transparent bg-accent/10 text-accent hover:bg-accent/20",
        published:
          "border-transparent bg-success/10 text-success",
        draft:
          "border-transparent bg-muted text-muted-foreground",
        // Badge levels
        newbie:
          "border-transparent bg-badge-newbie/10 text-badge-newbie",
        explorer:
          "border-transparent bg-badge-explorer/10 text-badge-explorer",
        achiever:
          "border-transparent bg-badge-achiever/10 text-badge-achiever",
        specialist:
          "border-transparent bg-badge-specialist/10 text-badge-specialist",
        expert:
          "border-transparent bg-badge-expert/10 text-badge-expert",
        master:
          "border-transparent bg-badge-master/10 text-badge-master",
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
