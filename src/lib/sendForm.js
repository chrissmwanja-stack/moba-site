// Sends a form to the admin through Web3Forms.
// Falls back to opening the visitor's email app when no key is set.
const ENDPOINT = "https://api.web3forms.com/submit";

export async function sendForm({ subject, fromName, fields, fallbackEmail }) {
  const key = import.meta.env.VITE_WEB3FORMS_KEY;

  if (!key) {
    const body = Object.entries(fields)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    window.location.href = `mailto:${fallbackEmail || ""}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    return { ok: true, fallback: true };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: key, subject, from_name: fromName, ...fields }),
    });
    const data = await res.json();
    return { ok: Boolean(data.success), fallback: false };
  } catch {
    return { ok: false, fallback: false };
  }
}
