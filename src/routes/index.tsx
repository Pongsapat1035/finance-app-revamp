import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/')({
     component: RouteComponent,
})

function RouteComponent() {
     return <>
          <Link
               to="/auth"
               className="ds-focus-ring ds-interactive inline-flex h-9 items-center gap-2 rounded-sm text-xs font-medium text-muted-foreground no-underline hover:text-foreground"
          >
               <ArrowLeft size={15} strokeWidth={1.75} />
               to sign in
          </Link>
          <Link
               to="/design-system"
               className="ds-focus-ring text-xs text-white/55 underline decoration-white/25 underline-offset-4 hover:text-white"
          >
               Design system
          </Link>
     </>
}
