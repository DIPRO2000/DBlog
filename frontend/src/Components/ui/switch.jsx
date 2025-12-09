import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

function Switch({ className, ...props }) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        `peer inline-flex h-[1.2rem] w-10 items-center rounded-full transition-all
        data-[state=checked]:bg-green-600
        data-[state=unchecked]:bg-red-600`,
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          `block size-5 rounded-full bg-white shadow transition-transform
          data-[state=checked]:translate-x-[calc(100%-2px)]
          data-[state=unchecked]:translate-x-0`
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
