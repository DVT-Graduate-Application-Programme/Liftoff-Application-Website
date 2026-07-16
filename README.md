# Lift-Off Application Website

The public applicant-facing site for DVT's Graduate Developer Programme. Candidates fill in the **Graduate Enquiries** form and submit their CV (and optional academic transcript), which is forwarded to the Lift-Off backend for processing.

This is the public counterpart to the internal recruiter dashboard — applicants apply here; recruiters review applications there.

## Tech stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS v4**
- **Three.js** — animated 3D cloud of DVT tech-stack logos on the hero
- **Zod** — shared form validation
- **TypeScript**

## Getting started

```bash
npm install
npm run dev
```

The app runs at **http://localhost:4000**.

### Environment

Create a `.env.local` (git-ignored) pointing at the backend:

```bash
# Base URL of the C# Lift-Off backend. Server-only — never exposed to the browser.
BACKEND_URL=http://localhost:5000
```

If unset, it defaults to `http://localhost:5000`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server on port 4000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build on port 4000 |

## Architecture

A static **Server Component shell** with two interactive **client islands**, and submissions routed through a **server action (Backend-for-Frontend)** so the browser never talks to the backend directly.

```
src/
  app/
    page.tsx                   # Server Component shell (header, hero, layout)
    apply/
      actions.ts               # 'use server' — submitApplication (BFF)
  components/
    layout/
      site-header.tsx          # Static nav (Server Component)
    apply/
      application-form.tsx     # Client island — form (useActionState)
      file-input.tsx           # Client — styled native file input
      success-message.tsx      # Submission confirmation
    tech-stack-background.tsx  # Client wrapper (dynamic, ssr:false)
    tech-stack-scene.tsx       # Client — Three.js scene
  lib/
    application-schema.ts      # Zod schema + shared constants/types
    backend-client.ts          # Server-only fetch wrapper to the backend
    env.ts                     # Server-only env (BACKEND_URL)
public/
  tech-stack/                  # DVT tech-stack logo SVGs used by the 3D scene
```

### Submission flow

1. The form posts its `FormData` to the `submitApplication` server action.
2. The action validates with the shared Zod schema, generates an `Idempotency-Key`, and calls the backend via `backend-client.ts` using the server-only `BACKEND_URL`.
3. `POST /api/applications/ingest` receives the multipart payload (`CandidateName`, `CandidateEmail`, `CvFile`, optional `TranscriptFile`).

Server actions have a `bodySizeLimit` of `10mb` (see `next.config.ts`) to allow CV/transcript uploads.

## Notes

- The Three.js scene respects `prefers-reduced-motion` (renders a single static frame).
- Tech-stack logo SVGs in `public/tech-stack/` are bundled assets and are committed to the repo.
