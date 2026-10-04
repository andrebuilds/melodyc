# Changelog

All notable changes to Melodyc will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Removed

- Polar payments: subscriptions, checkout, customer portal, payment webhook, payment confirmation emails, and the related notification preference. Melodyc is now free; `/billing` and `/customer-portal` redirect to the new `/credits` page.

### Changed

- New accounts receive 100 free credits instead of 20.
- The homepage Pricing section and navbar link were replaced by a Gamification "Coming soon" section.
- Terms, Privacy Policy, Cookie Policy, Help Center, FAQ, structured data, and `llms.txt` now describe the free model.

### Added

- Credits page with the current balance, manual top-up contact, and a gamification preview.
- My Music library with all of a user's songs, Public and Private badges, search, and infinite scrolling.
- Publish or unpublish, rename, and delete songs from My Music.
- Song downloads in WAV, MP3 (320 kbps), and FLAC, plus cover image download.
- MP3 and FLAC export next to the original WAV on the Modal backend.
- AI-generated song titles in the language of the song, applied only if the user has not renamed the song.
- Removal of failed and insufficient-credit tracks from the Create library.
- Close button for the player.
- Email verification, welcome email, and password reset with Resend, including password confirmation and show/hide toggles.
- Email notifications (song ready, generation failed, payment confirmed, new follower) with a dedicated Notifications settings panel and signed one-click unsubscribe links.
- Self-service account deletion that removes songs, audio files, covers, profile picture, and the Polar customer.
- Profile picture upload stored in S3 and served through `/api/avatar/[userId]`.
- My profile link in the account menu.
- Follow system with follower and following counts and lists, and a "From creators you follow" section in Discover.
- In-app notifications bell for likes, new followers, listen milestones, generation results, and added credits.
- Melodyc mascot picker in Account settings, shown in the sidebar and on the public profile.
- Italian versions of the Privacy Policy, Cookie Policy, and Terms, with a language switcher based on the `legal_lang` cookie and `Accept-Language`.
- Mandatory acceptance of the Terms, Privacy Policy, and specific clauses at sign-up, stored with the accepted Terms version.
- Vercel Web Analytics and Speed Insights, loaded through `ConsentedAnalytics` only after Analytics consent in the cookie banner.

### Changed

- Cover art generated with FLUX.1-schnell at 1024 × 1024 (JPEG), guided by Qwen-written art direction prompts.
- Each Create request generates a single song and uses one credit.
- Covers, titles, and credits refresh automatically when a generation finishes or a payment completes.
- Billing moved from the sidebar to the account menu.
- Model references updated in the Privacy Policy, llms.txt, README, and backend documentation.
- Public username and notification cards restyled to match the other settings cards.
- Homepage demo result redesigned with a My Music style cover card and a custom player.
- Privacy Policy, Terms, and Help Center updated for emails, profiles, follows, notifications, and account deletion.
- Cookie Policy and Privacy Policy updated for Vercel Web Analytics and Speed Insights; cookie policy version bumped so visitors confirm their choices again.
- Analytics consent now honors the cookie policy version and the consent expiry.

### Deprecated

### Removed

- SDXL-Turbo cover generation, replaced by FLUX.1-schnell.

### Fixed

- Song card titles, listens, and likes readable in dark mode.
- Promise-returning callbacks in polling timers flagged by `@typescript-eslint/no-misused-promises`.

### Security

- Pinned Next.js to 15.4.10 to patch the React Server Components vulnerability.
- Security headers on every route: `X-Frame-Options`, CSP `frame-ancestors 'none'`, `X-Content-Type-Options`, `Referrer-Policy`, HSTS, and `Permissions-Policy`; `X-Powered-By` removed.
- Server-side Zod validation for song generation requests (500 characters per field, matching the Modal backend) and a 100-character limit on song titles.
