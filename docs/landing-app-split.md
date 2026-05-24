# DUT-863 Landing/App Split Baseline

## Decision

- `apps/landing` is a dedicated Astro app for `dutying.net`.
- `apps/app` remains the product app that will be served from `app.dutying.net`.
- This ticket establishes the split-ready baseline, not the final landing content or the full authentication migration.

## Responsibility Boundary

### `dutying.net` landing

- product positioning, marketing copy, SEO, OG metadata
- feature overview and trust-building content
- CTA links that send users into the product app

### `app.dutying.net` app

- login and OAuth callback flow
- authenticated product routes
- scheduling, member management, and all product interactions

## Landing Entry Flow

- Primary CTA: `https://app.dutying.net/login`
- Secondary CTA: `https://app.dutying.net/make`
- Additional path: `https://app.dutying.net/register`

These URLs are exposed in `apps/landing/src/config/site.ts` and can be overridden with:

- `PUBLIC_MARKETING_SITE_URL`
- `PUBLIC_APP_SITE_URL`
- `PUBLIC_DOCS_SITE_URL`
- `PUBLIC_TERMS_URL`

The app itself uses matching Vite env keys:

- `VITE_APP_SITE_URL`
- `VITE_MARKETING_SITE_URL`
- `VITE_DOCS_SITE_URL`
- `VITE_TERMS_URL`

## App Audit Points For Follow-up

### 1. Root route responsibility is still mixed

- `apps/app/src/app/Router.tsx` still serves `LandingPage` on `/`.
- Once `app.dutying.net` becomes the product-only domain, `/` should stop acting as the public marketing landing.
- Follow-up options:
    - redirect `/` to `/login` or `/make`
    - or keep `/` as a signed-in gateway page explicitly designed for the app domain

### 2. Product metadata still assumed the marketing domain

- `apps/app/index.html`
- `apps/app/public/robots.txt`
- `apps/app/public/sitemap.xml`

These are now updated toward `app.dutying.net`, but the real deployment sitemap strategy still needs a final decision once both domains ship.

### 3. OAuth redirect should stay app-domain only

- `apps/app/src/pages/login/index.tsx`
- `apps/app/src/features/auth/index.ts`
- `apps/app/src/pages/login/redirect-page.tsx`
- `apps/app/src/shared/api/client.ts`
- `apps/app/src/pages/refresh/index.tsx`

The app should build OAuth entry URLs from an explicit app-site setting and normalize callback targets back into app-relative paths. That keeps login, refresh, and callback flows inside `app.dutying.net` even after domain separation.

Checkpoints:

- backend OAuth allow-list must include `https://app.dutying.net/oauth2/redirect`
- refresh redirect flow must never bounce users back to `dutying.net`
- post-login default route should remain product-focused

### 4. Auth state is not purely cookie-based

- `apps/app/src/features/auth/model/store.ts` persists auth state with Zustand `persist`
- several features also use `localStorage`

Implications:

- `localStorage` is origin-scoped, so landing and app cannot share client state directly
- cross-subdomain continuity must rely on backend cookies/session plus explicit navigation into the app
- if shared auth UX is needed on the landing side, it should query server-side session state or use an app redirect handshake, not local storage

### 5. Local development host split needs environment support

- `apps/landing` now uses `local.dutying.net:4321`
- `apps/app` is configured for `local.app.dutying.net:3000`

Developers need local host mapping and certificates that cover both hosts.
