import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '#/lib/utils'
import IconButton from '#/components/ui/IconButton'

const BaseModal = DialogPrimitive.Root

function BaseModalOverlay({ className, ...props }: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-black/45',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 motion-reduce:animate-none',
        className,
      )}
      {...props}
    />
  )
}

interface BaseModalContentProps extends ComponentProps<typeof DialogPrimitive.Content> {
  showCloseButton?: boolean
  scrollable?: boolean
}

function BaseModalContent({
  className,
  children,
  showCloseButton = true,
  scrollable = true,
  ...props
}: BaseModalContentProps) {
  return (
    <DialogPrimitive.Portal>
      <BaseModalOverlay />
      <DialogPrimitive.Content
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] min-h-0 w-full flex-col rounded-t-xl bg-background shadow-[0_24px_80px_rgb(0_0_0/0.25)] outline-none',
          scrollable ? 'overflow-y-auto' : 'overflow-hidden',
          'sm:inset-0 sm:m-auto sm:h-fit sm:max-w-130 sm:rounded-lg',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 motion-reduce:animate-none',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close asChild>
            <IconButton className="absolute right-4 top-4" aria-label="Close dialog">
              <X size={17} />
            </IconButton>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

function BaseModalHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('shrink-0 border-b px-5 py-4 sm:px-6', className)} {...props} />
}

function BaseModalBody({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'min-h-0 flex-1 overflow-y-auto px-5 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-6',
        className,
      )}
      {...props}
    />
  )
}

function BaseModalFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('shrink-0 border-t px-5 py-4 sm:px-6', className)} {...props} />
}

const BaseModalTrigger = DialogPrimitive.Trigger
const BaseModalClose = DialogPrimitive.Close
const BaseModalTitle = DialogPrimitive.Title
const BaseModalDescription = DialogPrimitive.Description

export default BaseModal
export {
  BaseModalClose,
  BaseModalBody,
  BaseModalContent,
  BaseModalDescription,
  BaseModalFooter,
  BaseModalHeader,
  BaseModalOverlay,
  BaseModalTitle,
  BaseModalTrigger,
}
