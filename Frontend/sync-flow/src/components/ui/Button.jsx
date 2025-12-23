import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'

// Define simple button classes for variants and sizes
const buttonClasses = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  destructive: 'bg-destructive text-white hover:bg-destructive/90',
  outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
}

const buttonSizes = {
  default: 'h-9 px-4 py-2',
  sm: 'h-8 px-3 py-1.5 text-sm',
  lg: 'h-10 px-6 py-3 text-lg',
  icon: 'w-9 h-9 p-0',
  'icon-sm': 'w-8 h-8 p-0',
  'icon-lg': 'w-10 h-10 p-0',
}

function Button({ variant = 'default', size = 'default', asChild = false, className = '', ...props }) {
  const Comp = asChild ? Slot : 'button'
  const classes = `${buttonClasses[variant]} ${buttonSizes[size]} inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 ${className}`
  
  return <Comp data-slot="button" className={classes} {...props} />
}

export { Button }
