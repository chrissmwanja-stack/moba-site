// MOBA lockup: shield + wordmark. Built from live text so it stays sharp at any size.
// Fonts: Playfair Display (loaded in index.html), falls back to Georgia.
export default function Logo({ className = '' }) {
  return (
    <span className={`flex items-center gap-3.5 text-white ${className}`}>
      <img src="/moba-shield.webp" alt="" className="h-12 w-auto" />
      <span className="flex flex-col items-center gap-0.5">
        <span className="font-display font-bold text-[34px] leading-none tracking-[0.01em]">MOBA</span>
        <span className="text-[9px] font-semibold tracking-[0.14em] whitespace-nowrap">MWIRI OLD BOYS ASSOCIATION</span>
        <span className="flex items-center gap-2 w-full" aria-hidden="true">
          <span className="flex-1 h-px bg-gold" />
          <span className="font-display text-xs">1911</span>
          <span className="flex-1 h-px bg-gold" />
        </span>
      </span>
    </span>
  )
}
