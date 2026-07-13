import type { ReactNode } from 'react'
import ProductStory from '#/components/ProductStory'

interface AuthPageLayoutProps {
  children: ReactNode
}

const AuthPageLayout = ({ children }: AuthPageLayoutProps) => {
  return (
    <main className="grid min-h-dvh bg-background lg:h-dvh lg:grid-cols-[minmax(0,1.08fr)_minmax(440px,0.92fr)] lg:overflow-hidden">
      <div className="hidden lg:block lg:h-dvh">
        <ProductStory />
      </div>
      {children}
    </main>
  )
}

export default AuthPageLayout
