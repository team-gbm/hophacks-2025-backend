# hophacks-2025-backend

## Inspiration

Recovering from illness or surgery can feel isolating and confusing. LifeLine was inspired by loved ones who struggled to find trustworthy guidance, affordable care options, and a supportive community outside the clinic. We wanted to build a warm, patient‑first space that:

- Connects people with similar journeys so they can learn, motivate, and heal together.
- Surfaces practical, trustworthy health information in plain language—no diagnosis, just guidance.
- Highlights low‑cost care pathways, community resources, and philanthropic support.
- Makes complex medical devices and rehab concepts approachable with visuals, short videos, and an AI assistant.

This project aims to blend empathy with technology—turning scattered information into simple, actionable support when it matters most.

## What it does

- Patient social app with:
  - Onboarding (multi‑step, validated contact with country code + phone number) and a friendly post‑submit animation.
  - Home feed: create posts with multiple media (images/videos), like, comment toggle, and share.
  - Connect: discover peers with similar conditions and suggested connections.
  - Medical Education: bite‑size learning for common rehab topics and devices.
  - Games/Heal tab: light, recovery‑oriented activities to keep users engaged.
- AI Health Assistant in the header:
  - Short, conversational answers (not diagnosis) with care pathways, self‑care & safety, community/financial support, and “learn more.”
  - Continuous chat with history and media input (images of equipment for guidance). Markdown rendering for readable tips.
- Visuals-first: inline media in feed (SVG demos and sample mp4), simple and accessible UI.

## How we built it

- Frontend: React 18 (TypeScript) + Vite, TailwindCSS (including Typography), lucide-react icons, react-markdown + remark-gfm.
- Backend: Flask (CORS, dotenv), MongoDB via PyMongo, structured routes under `/api`.
- AI: Google Gemini (google-generativeai) via backend proxies:
  - `POST /api/ai/search` for quick Q&A.
  - `POST /api/ai/chat` for multi‑turn, media‑aware chat (JSON or multipart form with images).
- UX details: AI modal with suggestions, markdown rendering, and concise follow‑ups; onboarding GIF then redirect; feed media grid; multi‑file composer with local previews.
- Dev setup: Vite proxy to Flask, environment vars for `GEMINI_API_KEY`/`GOOGLE_API_KEY` (kept server‑side), and safety filters in AI calls.

## Challenges we ran into

- AI output control: keeping answers short and on‑topic (tuned system prompts, temperature, and token limits).
- Safety and formatting: balancing safety settings with helpful content; using text/plain while still rendering Markdown client‑side.
- Environment and imports: resolving `ModuleNotFoundError: google`, dotenv loading, and avoiding hardcoded keys.
- Dev plumbing: Vite → Flask proxy alignment, CORS, and fixing a duplicate Flask route causing endpoint collisions.
- Media: supporting multi‑file uploads in the composer with safe previews and sensible size/type limits.

## Accomplishments that we're proud of

- End‑to‑end AI assistant that’s empathetic, concise, and health/philanthropy‑aware.
- Multimodal chat that accepts images of medical equipment and responds with safety/usage guidance.
- Clean, approachable UX: onboarding validation + animation, media‑rich feed, and readable AI Markdown.
- Solid fundamentals: server‑side key handling, safety settings, and simple but effective content structures.

## What we learned

- Prompt and safety design matter: small changes to instructions and limits greatly affect usefulness.
- Keep keys server‑side and proxy calls; never ship API keys to the browser.
- Practical UI patterns (previews, remove actions, concise toasts) reduce friction and errors.
- TypeScript ergonomics for chat history and media types help prevent edge‑case bugs.

## What's next for LifeLine

- Insurance plugin (header)
  - Quick coverage check and plan summary; surface in‑network providers, estimated out‑of‑pocket costs, and pre‑auth status.
  - Inline suggestions in AI answers and Connect: show lower‑cost options compatible with the user’s plan.
- AI
  - Streaming responses for faster perceived latency; citations and curated “learn more” links.
  - RAG with trusted, health‑literacy‑friendly sources; lightweight grounding.
  - Video assistance: extract key frames for image guidance on short clips.
- Social & data
  - Persist chat sessions and posts in MongoDB with auth; private groups and clinician‑verified tips.
  - Media storage (S3/Azure Blob) and CDN delivery; server‑side virus scanning for uploads.
- Product polish
  - Accessibility (keyboard navigation, reduced motion), internationalization, and mobile optimizations.
  - More recovery games and structured rehab plans with progress tracking.
