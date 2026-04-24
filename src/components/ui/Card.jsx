import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Card({ className, children, hover3d = true, ...props }) {
  return (
    <div className={cn(
      "bg-card text-card-foreground rounded-xl border border-border/60 shadow-md",
      hover3d && "card-3d",
      "relative overflow-hidden",
      className
    )} {...props}>
      {/* Subtle shimmer overlay */}
      <div className="absolute inset-0 shimmer-effect pointer-events-none opacity-30 rounded-xl" />
      <div className="relative z-[1]">
        {children}
      </div>
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("flex flex-col space-y-2 p-6 border-b border-border/50", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn("font-semibold text-lg leading-relaxed tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
}
