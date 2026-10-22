import { site } from "../data/content";

// DRAFT. Replace the TODO items and have the MOBA executive (or a lawyer) review it
// before the site goes public.
const UPDATED = "22 October 2026";

const sections = [
  {
    title: "Who we are",
    body: [
      "The Mwiri Old Boys Association (MOBA) is the association of former students of Mwiri, founded in 1911. This site is run on behalf of the association. TODO: confirm the registered name and address.",
    ],
  },
  {
    title: "What we collect",
    body: [
      "When you use the Update your details form: your name, email, phone or WhatsApp number, the years you joined and left Mwiri, your city and country, your profession or business, and the ways you are happy to help.",
      "When you use the contact form or place a store order: your name, contact details, and the message or order you send us (including a delivery location for orders).",
    ],
  },
  {
    title: "Why we collect it",
    body: [
      "To keep the member register current, invite you to reunions and events, share news about association projects, process memorabilia orders, and answer your messages. We do not sell your details or use them for advertising.",
    ],
  },
  {
    title: "Who can see it",
    body: [
      "Only the association officers who manage the register and orders. We do not publish your details on this site. Forms are delivered to the association's email through Web3Forms, a form service, so your submission passes through their servers on the way to us.",
    ],
  },
  {
    title: "How long we keep it",
    body: [
      "For as long as you remain on the register or until you ask us to remove you. Order records are kept as long as the association needs them for its accounts. TODO: confirm the retention period with the executive.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "You can ask to see the details we hold about you, correct them, or have them deleted, and you can ask us to stop contacting you. Email us at the address below and we will respond within a reasonable time. We aim to handle personal data in line with the Data Protection and Privacy Act, 2019 of Uganda.",
    ],
  },
  {
    title: "Contact",
    body: [`${site?.email || "TODO: add the association email in content.js"}`],
  },
  {
    title: "Changes to this notice",
    body: ["If we change how we use your details, we will update this page and the date below."],
  },
];

export default function Privacy() {
  return (
    <div>
      <section className="bg-[#0a2a5e] px-4 py-14 text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold sm:text-4xl">Privacy notice</h1>
          <p className="mt-4 text-lg text-white/85">
            What the Mwiri Old Boys Association collects through this site, why, and how you can
            change it.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-xl font-bold text-[#0a2a5e]">{s.title}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-2 leading-relaxed text-[#061f47]/85">
                {p}
              </p>
            ))}
          </section>
        ))}
        <p className="border-t border-[#0a2a5e]/15 pt-4 text-sm text-[#061f47]/70">
          Last updated {UPDATED}.
        </p>
      </div>
    </div>
  );
}
