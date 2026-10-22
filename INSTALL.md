# moba-details-privacy-news.zip

New files (nothing existing is overwritten):
- src/lib/sendForm.js           Web3Forms sender with email-app fallback
- src/pages/UpdateDetails.jsx   "Update your details" form
- src/pages/Privacy.jsx         Privacy notice (DRAFT, fill the TODO items)
- src/components/NewsCard.jsx   News card: date, reading time, image, category, series

## 1. Routes (App.jsx)
import UpdateDetails from "./pages/UpdateDetails";
import Privacy from "./pages/Privacy";

<Route path="/update-details" element={<UpdateDetails />} />
<Route path="/privacy" element={<Privacy />} />

## 2. Links
- Header or "Get involved": /update-details
- Footer: /privacy

## 3. News page
import NewsCard from "../components/NewsCard";
{news.map((item) => <NewsCard key={item.title} item={item} />)}

Item shape in content.js:
{ title, date: "2026-10-01", excerpt, image: "/news/x.jpg", category: "Reunion",
  series: "Throwback", body: "full text, used for reading time" }

## 4. Check
- content.js must export `site` with `email` (used for the fallback and the privacy contact).
  If your export is named differently, change the import at the top of UpdateDetails.jsx and Privacy.jsx.
- Details and contact emails arrive via Web3Forms once VITE_WEB3FORMS_KEY is set.
