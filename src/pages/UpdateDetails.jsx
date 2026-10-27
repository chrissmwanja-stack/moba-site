import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { site } from "../data/content";
import { sendForm } from "../lib/forms";
import { toYear, orNull } from "../lib/db";

const HELP_OPTIONS = [
  "Mentoring current students",
  "Association projects",
  "Reunions and events",
  "Professional networking",
];

const field =
  "w-full rounded-md border border-brand/60 bg-white px-3 py-2.5 text-brand-dark " +
  "placeholder:text-brand-dark/65 focus:border-brand focus:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-brand";

function Field({ label, hint, required, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-brand-dark">
        {label}
        {required && <span className="text-gold-dark"> (required)</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-sm text-brand-dark/70">{hint}</span>}
    </label>
  );
}

export default function UpdateDetails() {
  const [params] = useSearchParams();
  const prefillCohort = (params.get("cohort") || params.get("joined") || "").replace(/\D/g, "").slice(0, 4); // "joined" = old links
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [errors, setErrors] = useState({});
  const [help, setHelp] = useState([]);

  const toggleHelp = (opt) =>
    setHelp((h) => (h.includes(opt) ? h.filter((x) => x !== opt) : [...h, opt]));

  async function onSubmit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get("website")) return setStatus("done"); // honeypot: bots fill this

    const v = Object.fromEntries(f.entries());
    const next = {};
    if (!v.name?.trim()) next.name = "Enter your full name.";
    if (!v.email?.trim() || !/^\S+@\S+\.\S+$/.test(v.email))
      next.email = "Enter an email address we can reach you on.";
    if (!v.consent) next.consent = "Please confirm you agree before sending.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    const res = await sendForm({
      subject: `MOBA member details: ${v.name}`,
      fromName: v.name,
      fallbackEmail: site?.email,
      save: {
        table: "member_updates",
        row: {
          name: v.name.trim(),
          email: v.email.trim(),
          phone: orNull(v.phone),
          cohort: toYear(v.cohort),
          year_left: toYear(v.left),
          location: orNull(v.location),
          profession: orNull(v.work),
          help_with: help,
          consent: true,
        },
      },
      fields: {
        "Full name": v.name,
        Email: v.email,
        "Phone / WhatsApp": v.phone || "-",
        "Cohort (year class started S1)": v.cohort || "-",
        "Year left Mwiri": v.left || "-",
        "Country and city": v.location || "-",
        "Profession or business": v.work || "-",
        "Happy to help with": help.length ? help.join(", ") : "-",
        "Agreed to privacy notice": "Yes",
      },
    });
    setStatus(res.ok ? "done" : "error");
  }

  if (status === "done") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <h1 className="text-3xl font-bold text-brand">Thank you. We have your details.</h1>
        <p className="mt-4 text-lg text-brand-dark/80">
          The association secretary will add you to the member register and may contact you to
          confirm. You can send an update at any time by filling in this form again.
        </p>
        <Link to="/" className="mt-8 inline-block font-semibold text-gold-dark underline">
          Back to the home page
        </Link>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-brand px-4 py-14 text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold sm:text-4xl">Update your details</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">
            Old Boys move cities, change numbers and change jobs. A current register lets us invite
            you to reunions, share news about the association's projects, and reach every cohort
            when it matters. It takes about two minutes.
          </p>
        </div>
      </section>

      <form onSubmit={onSubmit} noValidate className="mx-auto max-w-3xl space-y-6 px-4 py-12">
        {/* Honeypot */}
        <div className="hidden" aria-hidden="true">
          <label>
            Leave this empty
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <Field label="Full name" required>
          <input name="name" autoComplete="name" className={field} />
          {errors.name && <p role="alert" className="mt-1 text-sm text-red-700">{errors.name}</p>}
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Email" required>
            <input name="email" type="email" autoComplete="email" className={field} />
            {errors.email && <p role="alert" className="mt-1 text-sm text-red-700">{errors.email}</p>}
          </Field>
          <Field label="Phone or WhatsApp" hint="Include the country code, for example +256.">
            <input name="phone" type="tel" autoComplete="tel" className={field} />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Your cohort (year your class started S1)" hint="Your cohort is the class you finished with. If your class started S1 in 2001 and finished S6 in 2006, your cohort is 2001, even if you joined later, for example in S5.">
            <input name="cohort" inputMode="numeric" maxLength={4} defaultValue={prefillCohort} placeholder="e.g. 2001" className={field} />
          </Field>
          <Field label="Year you left Mwiri (finished S6)">
            <input name="left" inputMode="numeric" maxLength={4} placeholder="e.g. 2003" className={field} />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Country and city">
            <input name="location" autoComplete="address-level2" placeholder="Kampala, Uganda" className={field} />
          </Field>
          <Field label="Profession or business">
            <input name="work" autoComplete="organization-title" className={field} />
          </Field>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-brand-dark">
            I would be happy to help with
          </legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {HELP_OPTIONS.map((opt) => (
              <label key={opt} className="flex items-center gap-3 rounded-md border border-brand/20 bg-white px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={help.includes(opt)}
                  onChange={() => toggleHelp(opt)}
                  className="h-4 w-4 accent-brand"
                />
                <span className="text-brand-dark">{opt}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className="flex items-start gap-3">
            <input type="checkbox" name="consent" className="mt-1 h-4 w-4 accent-brand" />
            <span className="text-brand-dark">
              I agree that MOBA may keep these details to contact me about association business, as
              described in the{" "}
              <Link to="/privacy" className="font-semibold text-gold-dark underline">
                privacy notice
              </Link>
              .
            </span>
          </label>
          {errors.consent && <p role="alert" className="mt-1 text-sm text-red-700">{errors.consent}</p>}
        </div>

        {status === "error" && (
          <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-800">
            We could not send your details. Check your connection and try again, or email{" "}
            {site?.email || "the association"} directly.
          </p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-md bg-gold px-6 py-3 font-bold text-brand-dark hover:bg-[#f0c653] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Send my details"}
        </button>
      </form>
    </div>
  );
}
