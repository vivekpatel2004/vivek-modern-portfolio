# Vivek Chaudhary — Modern Portfolio

React 19, TypeScript and Vite frontend with an authenticated visual CMS backed by Supabase. Public pages include a theme toggle, responsive navigation, portfolio sections, skill filters and project detail modals.

## Architecture

- **Frontend:** React/Vite static SPA, built to `dist/`; Vercel or Nginx serves the assets.
- **Backend:** Supabase. No custom Node.js/Express app or database container is needed.
- **Supabase responsibilities:** Postgres stores the published JSON portfolio; Supabase Auth authenticates CMS users; Storage serves resume and image files; the `send-contact` Edge Function validates contact form fields and calls Resend.
- **External dependencies:** Supabase (database, auth, storage, Edge Functions), Resend (email delivery), Google Fonts (web fonts), plus external project/demo links.
- **Server-side code:** `supabase/functions/send-contact/index.ts` executes on Supabase Edge Runtime. Static HTML/JS is served by Vercel or Nginx; Vite's dev server is local development only.

## Local development

Requirements: Node.js 20.19+ or 22.12+ and npm.

```bash
npm ci
```

Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (the Supabase publishable/anon key). These are browser-visible configuration values, not secrets. Never use a service-role key or Resend key in a `VITE_` variable. Without Supabase, the app uses local fallback portfolio content and the contact form opens the visitor's email application.

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

`npm run build` runs the TypeScript project build before Vite. The admin screen is at `/admin`; configure Supabase before expecting sign-in, publishing, or uploads to work.

## Supabase setup and production requirements

1. Create a Supabase project and configure the two frontend variables above in the deployment platform.
2. Review and apply `supabase/schema.sql` in the Supabase SQL Editor only after reviewing its policies.
3. Disable public sign-ups and create the intended admin user in Supabase Auth.
4. **Before production, restrict portfolio insert/update RLS policies to the approved admin user UUID.** The current SQL permits every authenticated user to write the portfolio row. Disabling public sign-ups does not restrict existing or otherwise authenticated users. This repository does not alter live policies.
5. Configure the `portfolio-assets` public bucket and admin-only insert policies for the folders used by the CMS. The app uses `resumes/`, `projects/`, and `profile/`; visitors need public read access for published files, but uploads must not be public. The profile folder policy is not automatically applied.
6. Deploy the contact function and set its server-side secrets:

   ```bash
   supabase functions deploy send-contact
   supabase secrets set RESEND_API_KEY=...
   supabase secrets set CONTACT_TO_EMAIL=...
   supabase secrets set CONTACT_FROM_EMAIL="Portfolio Contact <verified-sender@yourdomain.com>"
   supabase secrets set PORTFOLIO_ORIGIN=https://your-domain.example
   ```

   Set `PORTFOLIO_ORIGIN` to the exact production origin (scheme and hostname, no path); the function currently falls back to `*` when unset, so do not leave it unset in production. Verify the sender domain with Resend. Do not commit or expose function secrets. Contact delivery is external and should be tested once with a designated test inbox, not repeatedly against a personal/production inbox.
7. Sign in at `/admin`, review the existing content and explicitly publish changes. Uploads update the draft; publishing is a separate action. The app does not apply database or Storage policies.

The initial fallback data is in `src/content.ts`. The database content takes precedence when a published row exists. A résumé PDF is not bundled; add one via the CMS or use an HTTPS/site-relative URL.

The CMS manages profile, about paragraphs, skills, projects, experience, education, certifications, and stats. It supports repeatable entry edits and reordering; uploads and browser drafts remain unpublished until the admin explicitly publishes.

### Storage setup (manual)

The `portfolio-assets` bucket should be public for visitor downloads and image display, allow `application/pdf`, `image/jpeg`, `image/png`, and `image/webp`, and have a 6 MB maximum object size. Public reads do not mean public uploads: create admin-only insert policies for the intended Auth UUID. The app creates unique object paths and does not overwrite or delete old files. The following examples are documentation only; replace the placeholder UUID and review/apply them through an approved Supabase change. This repository does not apply or modify Storage policies.

```sql
create policy "Portfolio admin can upload resume"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'portfolio-assets'
  and (storage.foldername(name))[1] = 'resumes'
  and (select auth.uid()) = 'ADMIN_USER_UUID'::uuid
);
```

```sql
create policy "Portfolio admin can upload project images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'portfolio-assets'
  and (storage.foldername(name))[1] = 'projects'
  and (select auth.uid()) = 'ADMIN_USER_UUID'::uuid
);
```

```sql
create policy "Portfolio admin can upload profile images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'portfolio-assets'
  and (storage.foldername(name))[1] = 'profile'
  and (select auth.uid()) = 'ADMIN_USER_UUID'::uuid
);
```

## Vercel deployment

1. Import the repository into Vercel. The Vite framework preset uses `npm run build` and `dist`.
2. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for **Production**, and for Preview/Development if those environments should use Supabase. These values are included in browser code; never configure private keys here.
3. Deploy. `vercel.json` provides SPA fallback for direct paths such as `/admin` and baseline security response headers.
4. Set the exact production domain in the Supabase Edge Function `PORTFOLIO_ORIGIN` secret. The function currently accepts one configured origin; change it deliberately for preview testing rather than using `*` in production.
5. Confirm the production portfolio, `/admin` login, RLS restrictions, Storage upload policies and contact function from the deployed site. No deployment or production Supabase changes are performed by this repository setup.

## Optional Docker + VPS deployment

Docker is optional for this static frontend; Vercel is the simpler recommended host. The Docker image only builds the SPA and serves `dist/` with unprivileged Nginx; it does not run an app server or database. SPA fallback, hashed-asset caching and `/healthz` are configured.

Build with the public Supabase configuration for the target deployment (or omit it to use fallback content):

```bash
docker build \
  --build-arg VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY \
  -t vivek-portfolio .
docker run --rm -p 8080:8080 vivek-portfolio
```

Open `http://localhost:8080`; `/healthz` returns `ok`. The image build excludes `.env` files and local Supabase CLI state. Build arguments must contain only the browser-safe URL and anon/publishable key—never service-role or Resend secrets. For VPS use, terminate TLS at a trusted reverse proxy, expose only the required web port, keep the host and base images patched, and pin the selected Nginx image to a reviewed version/digest.

## Quality checks and known limits

```bash
npm run build
npm run lint
```

There is currently no automated unit/integration test runner. Authenticated CMS, Storage uploads, and email delivery require a configured Supabase project and manual/credentialed verification. Do not test publishing against production content; use a staging project and reversible test records.

- Skill percentages are editable self-assessments, not verified test scores.
- No genuine project screenshots or résumé PDF are bundled; image placeholders are shown until content is configured.
- `supabase/.temp/` is generated local CLI state and should not be committed.

## Troubleshooting

- **Published content does not load:** confirm the frontend URL and anon/publishable key are configured in the environment used for the build, check the browser's network panel, and verify the table's public read policy.
- **CMS sign-in or publishing fails:** confirm the Auth user exists, the site is using the intended Supabase project, and the authenticated account is the approved admin allowed by the deployed RLS policies. Never work around RLS by exposing a service-role key.
- **Storage upload is denied:** confirm the bucket name, MIME type and size limits, then verify the matching admin-only insert policy for the `resumes/`, `projects/`, or `profile/` folder. A public bucket should not have a public upload policy.
- **Contact message fails:** verify the function is deployed, its server-side secrets are configured, `PORTFOLIO_ORIGIN` exactly matches the deployed site origin, and the sender domain is verified with Resend. Use a designated test inbox and avoid repeated live sends.
- **A direct route returns 404:** confirm the SPA rewrite configuration is deployed (`vercel.json` on Vercel; `try_files` fallback in the Nginx image).
- **Docker health check fails:** check the container logs and confirm the image is reachable on port `8080`; the health endpoint is `/healthz`.
