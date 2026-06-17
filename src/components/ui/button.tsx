import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import {cva, type VariantProps} from "class-variance-authority"
import { cn } from "@/lib/utils"

// Haptic feedback helper
interface NavigatorWithVibrate extends Navigator {
  vibrate?: (pattern: number | number[]) => boolean
}

const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') => {
  if (typeof window !== 'undefined') {
    const nav = navigator as NavigatorWithVibrate
    if (nav.vibrate) {
      switch (type) {
        case 'light':
          nav.vibrate(10)
          break
        case 'medium':
          nav.vibrate(20)
          break
        case 'heavy':
          nav.vibrate(30)
          break
        case 'success':
          nav.vibrate([10, 50, 10])
          break
        case 'warning':
          nav.vibrate([10, 50, 10, 50, 10])
          break
        case 'error':
          nav.vibrate([10, 50, 10, 50, 10, 50, 10])
          break
      }
    }
  }
}

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-brand-700 active:bg-brand-800",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:bg-destructive",
        outline:
          "border border-input bg-white shadow-sm hover:bg-accent hover:text-accent-foreground active:bg-neutral-200",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:bg-secondary/90",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-neutral-200",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-4 py-2.5",
        sm: "min-h-10 rounded-lg px-3 text-xs",
        lg: "min-h-12 rounded-lg px-6 text-base",
        icon: "h-11 w-11 min-h-11 min-w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  haptic?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | false
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, haptic = 'light', onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (haptic !== false && !props.disabled) {
        triggerHaptic(haptic)
      }
      onClick?.(e)
    }
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
