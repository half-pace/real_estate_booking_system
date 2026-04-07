import * as React from "react";
import { cn } from "@/utils/helpers";

const Input = React.forwardRef(({ className, type, label, error, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm text-primary-900 placeholder:text-neutral-400 transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500",
          "hover:border-neutral-400",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-error focus:ring-error/30 focus:border-error",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-error">{error}</p>
      )}
    </div>
  );
});
Input.displayName = "Input";

export { Input };
