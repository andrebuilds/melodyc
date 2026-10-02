# Changelog

All notable changes to Melodyc will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- My Music library with all of a user's songs, Public and Private badges, search, and infinite scrolling.
- Publish or unpublish, rename, and delete songs from My Music.
- Song downloads in WAV, MP3 (320 kbps), and FLAC, plus cover image download.
- MP3 and FLAC export next to the original WAV on the Modal backend.
- AI-generated song titles in the language of the song, applied only if the user has not renamed the song.
- Removal of failed and insufficient-credit tracks from the Create library.
- Close button for the player.

### Changed

- Cover art generated with FLUX.1-schnell at 1024 × 1024 (JPEG), guided by Qwen-written art direction prompts.
- Each Create request generates a single song and uses one credit.
- Covers, titles, and credits refresh automatically when a generation finishes or a payment completes.
- Billing moved from the sidebar to the account menu.
- Model references updated in the Privacy Policy, llms.txt, README, and backend documentation.

### Deprecated

### Removed

- SDXL-Turbo cover generation, replaced by FLUX.1-schnell.

### Fixed

- Song card titles, listens, and likes readable in dark mode.
- Promise-returning callbacks in polling timers flagged by `@typescript-eslint/no-misused-promises`.

### Security

- Pinned Next.js to 15.4.10 to patch the React Server Components vulnerability.
