import { Link } from '@tanstack/react-router'
import { CircleDollarSign, ShieldCheck, TrendingDown, TrendingUp } from 'lucide-react'
import GridOverlay from '#/components/GridOverlay'

const ProductStory = () => {
  return (
    <section className="relative flex min-h-168 flex-col overflow-hidden bg-[#171717] p-6 text-white sm:p-8 lg:min-h-dvh lg:p-12 xl:p-16">
      <GridOverlay />

      <div className="relative flex items-center justify-between">
        <Link to="/" className="ds-focus-ring inline-flex items-center gap-3 text-white no-underline">
          <span className="grid size-9 place-items-center rounded-sm bg-accent text-sm font-bold tracking-[-0.08em] text-accent-foreground">
            F/
          </span>
          <span className="text-sm font-medium">My finance</span>
        </Link>
        <Link
          to="/design-system"
          className="ds-focus-ring text-xs text-white/55 underline decoration-white/25 underline-offset-4 hover:text-white"
        >
          Design system
        </Link>
      </div>

      <div className="relative my-auto max-w-xl py-16 lg:py-12">
        <p className="text-xs font-medium text-accent">Personal money, clearly organized</p>
        <h1 className="mt-5 text-[44px] font-medium leading-[0.98] tracking-[-0.055em] sm:text-[56px] xl:text-[66px]">
          Know where your money goes.
        </h1>
        <p className="mt-6 max-w-md text-[16px] leading-7 text-white/65">
          Collect expenses and income, understand your habits, and see the full picture in one dashboard.
        </p>

        <div className="mt-10 max-w-lg overflow-hidden rounded-lg border border-white/15 bg-[#202020] shadow-[0_24px_70px_rgb(0_0_0/0.22)]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <p className="text-[11px] font-medium text-white/45">EXAMPLE MONTH</p>
              <p className="mt-1 text-sm font-medium">July overview</p>
            </div>
            <span className="rounded-full bg-accent px-2 py-1 text-[10px] font-semibold text-accent-foreground">
              On track
            </span>
          </div>
          <div className="grid grid-cols-2 gap-px bg-white/10">
            <div className="bg-[#202020] p-5">
              <div className="flex items-center gap-2 text-white/45">
                <TrendingUp size={14} strokeWidth={1.75} />
                <span className="text-[11px]">Income</span>
              </div>
              <p className="mt-4 font-mono text-[22px] font-medium tracking-[-0.04em]">$4,840</p>
            </div>
            <div className="bg-[#202020] p-5">
              <div className="flex items-center gap-2 text-white/45">
                <TrendingDown size={14} strokeWidth={1.75} />
                <span className="text-[11px]">Expenses</span>
              </div>
              <p className="mt-4 font-mono text-[22px] font-medium tracking-[-0.04em]">$2,965</p>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-[11px] text-white/45">Available after expenses</p>
                <p className="mt-2 font-mono text-[28px] font-medium tracking-tighter">$1,875</p>
              </div>
              <div className="flex h-14 w-36 items-end gap-1" aria-label="Example spending trend">
                {[42, 56, 38, 66, 48, 74, 62, 86, 72, 100].map((height, index) => (
                  <span
                    key={`${height}-${index}`}
                    className="min-w-1 flex-1 rounded-[1px] bg-accent"
                    style={{ height: `${height}%`, opacity: 0.35 + index * 0.06 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-5 text-[11px] text-white/45">
        <span className="inline-flex items-center gap-2">
          <ShieldCheck size={14} strokeWidth={1.75} /> Private by design
        </span>
        <span className="inline-flex items-center gap-2">
          <CircleDollarSign size={14} strokeWidth={1.75} /> Built for daily tracking
        </span>
      </div>
    </section>
  )
}

export default ProductStory
