import * as React from "react"

import { cn } from "@/lib/utils"

const ImageCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-lg ml-4",
        className
      )}
      style={{ width: '300px', height: '300px' }} // Adjust the max-width and max-height as needed
      {...props}
    />
  )
);
ImageCard.displayName = "Card"

const ImageCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
ImageCardHeader.displayName = "CardHeader"

const ImageCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
ImageCardTitle.displayName = "CardTitle"

const ImageCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
ImageCardDescription.displayName = "CardDescription"

const ImageCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
ImageCardContent.displayName = "CardContent"

const ImageCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-between p-6 pt-0", className)}
      {...props}
    />
  )
);
ImageCardFooter.displayName = "CardFooter"

export { ImageCard, ImageCardHeader, ImageCardFooter, ImageCardTitle, ImageCardDescription, ImageCardContent }
