// src/components/ui/scroll-area.jsx
import * as React from "react"
import { cn } from "../../lib/utils"
 
const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("overflow-auto", className)} {...props}>
      {children}
    </div>
  )
})
ScrollArea.displayName = "ScrollArea"
 
export { ScrollArea }