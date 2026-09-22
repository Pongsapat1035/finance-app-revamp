import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import type { ComponentProps } from 'react'

import { cn } from '#/lib/utils'

function Checkbox({ className, ...props }: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        'ds-focus-ring ds-interactive flex size-5 shrink-0 items-center justify-center rounded-sm border border-input bg-background text-background',
        'hover:border-[#a9a9a5] disabled:pointer-events-none disabled:opacity-45',
        'data-[state=checked]:border-foreground data-[state=checked]:bg-foreground',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center">
        <Check size={14} strokeWidth={2} aria-hidden="true" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export default Checkbox
