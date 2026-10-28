import { isSubscribed, longDate, showNumber } from '../lib/members.js'

// The digital membership card. Pass a register row (from public.members), or `sample` for a
// labelled example on public pages.
export default function MemberCard({ member, sample = false }) {
  const m = sample
    ? { name: '[Member Name]', cohort: 1995, house: 'Hannington', moba_number: 'MWI-1995-HAN-023', paid_until: '2999-01-01' }
    : member
  const subscribed = isSubscribed(m)
  const line = [m.cohort && `Class Cohort Year ${m.cohort}`, m.house, subscribed ? 'Subscribed Member' : 'Member'].filter(Boolean).join(' · ')

  return (
    <div
      role="img"
      aria-label={sample
        ? 'Example digital membership card'
        : `MOBA membership card for ${m.name}, number ${showNumber(m.moba_number)}. ${line}.`}
      className="relative w-full max-w-md aspect-[1.6] overflow-hidden rounded-2xl bg-brand p-5 sm:p-7 text-white shadow-xl shadow-brand/30 flex flex-col justify-between"
    >
      <div
        aria-hidden="true"
        className="absolute -right-8 -bottom-8 h-44 w-44"
        style={{
          background: 'repeating-linear-gradient(45deg, transparent 0 18px, #e8b838 18px 26px, transparent 26px 40px)',
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
        }}
      />
      <div className="flex items-center gap-3">
        <img src="/moba-shield.webp" alt="" className="h-10 w-auto" />
        <span className="font-display font-bold text-2xl sm:text-[26px] leading-none">MOBA</span>
        {sample && <span className="ml-auto text-[10px] font-semibold tracking-widest text-gold">EXAMPLE</span>}
      </div>
      <div className="relative flex flex-col gap-1.5">
        <span className="font-display text-xl sm:text-[22px] leading-tight break-words">{m.name}</span>
        <span className="font-bold text-lg sm:text-xl text-gold tracking-wide">{showNumber(m.moba_number)}</span>
        <span className="text-xs text-white/85">{line}</span>
        {subscribed && !sample && <span className="text-[11px] text-white/70">Subscription valid to {longDate(m.paid_until)}</span>}
      </div>
    </div>
  )
}
