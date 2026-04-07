import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/helpers";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-accent-500 text-white hover:bg-accent-600 shadow-md hover:shadow-lg active:scale-[0.98]",
        secondary: "bg-primary-800 text-white hover:bg-primary-700 active:scale-[0.98]",
        outline: "border-2 border-accent-500 text-accent-500 hover:bg-accent-500 hover:text-white",
        ghost: "text-primary-800 hover:bg-neutral-100",
        link: "text-accent-500 underline-offset-4 hover:underline",
        destructive: "bg-error text-white hover:bg-red-600 active:scale-[0.98]",
        glass: "glass text-white hover:bg-white/20 backdrop-blur-md",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
