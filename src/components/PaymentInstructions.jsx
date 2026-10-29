import { ugx } from '../lib/format.js'

/** Shared MOBA manual payment information shown wherever the site asks for a contribution. */
export default function PaymentInstructions({ amount, amountPrompt = 'The scheme contribution amount is confirmed on enrolment. Please confirm the current amount with the scheme secretary before paying.' }) {
  return (
    <section className="rounded-md border border-gold/70 bg-gold/10 p-4 text-sm text-ink" aria-label="MOBA payment options">
      <h3 className="font-semibold text-brand">Pay MOBA directly</h3>
      {amount != null ? (
        <p className="mt-1">Pay {ugx(amount)} using one of these options, then enter your transaction reference below.</p>
      ) : (
        <p className="mt-1">{amountPrompt}</p>
      )}
      <ul className="mt-3 space-y-2">
        <li><strong>MTN MoMoPay:</strong> dial *165# · merchant code <strong>777888</strong></li>
        <li><strong>Airtel Pay:</strong> dial *185# · merchant code <strong>4365142</strong></li>
        <li><strong>Bank transfer:</strong> Standard Chartered Bank · account name <strong>Mwiri Old Boys Association</strong> · account number <strong>0102886324900</strong></li>
      </ul>
      <p className="mt-3 text-ink/70">Payments are verified manually by MOBA. Submitting your details does not automatically confirm a membership, donation, or insurance cover.</p>
    </section>
  )
}
