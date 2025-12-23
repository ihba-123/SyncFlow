import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

/* Provider — use ONCE at app or layout level */
function TooltipProvider({ delayDuration = 300, ...props }) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />
  )
}

function Tooltip(props) {
  return <TooltipPrimitive.Root {...props} />
}

function TooltipTrigger(props) {
  return <TooltipPrimitive.Trigger {...props} />
}

function TooltipContent({ sideOffset = 6, className, ...props }) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={`
          z-50 rounded-md px-3 py-1.5 text-xs
          bg-black text-white
          shadow-lg
          data-[state=open]:animate-in
          data-[state=closed]:animate-out
          data-[state=closed]:fade-out-0
          data-[state=open]:fade-in-0
          ${className || ""}
        `}
        {...props}
      >
        {props.children}
        <TooltipPrimitive.Arrow className="fill-black" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
}
