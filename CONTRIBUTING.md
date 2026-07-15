# Contributing to Melodyc

Thank you for your interest in contributing to Melodyc. Contributions of code, documentation, bug reports, and feature ideas are welcome.

Please read this guide before opening an issue or pull request.

## Code of Conduct

By participating in this project, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Before You Start

- Search existing issues and pull requests to avoid duplicate work.
- Open an issue before starting a significant feature, architectural change, or behavior change so the approach can be discussed.
- Report security vulnerabilities privately as described in the [Security Policy](SECURITY.md). Do not report them in public issues.

## Development Setup

Follow the setup guides for the part of the project you are changing:

- [Frontend setup guide](frontend/getting-started.md)
- [Backend setup guide](backend/getting-started.md)

The project requires Node.js 18+, Python 3.12, and the third-party services described in the [README](README.md).

## Creating a Branch

1. Fork the repository and clone your fork with submodules:

   ```bash
   git clone --recurse-submodules https://github.com/andrebuilds/melodyc.git
   cd melodyc
   ```

2. Create a branch from `main` with a descriptive name:

   ```bash
   git checkout -b feature/short-description
   ```

   Use the `fix/short-description` prefix for bug fixes and `docs/short-description` for documentation changes.

## Making Changes

- Keep changes focused on one concern per pull request.
- Follow the existing code style, naming conventions, and project structure.
- Do not commit credentials, API keys, tokens, `.env` files, generated build artifacts, or large model files.
- Update relevant documentation when a change affects setup, behavior, configuration, or public APIs.
- Add or update tests when the project has a relevant test surface for the change.

## Validating Your Changes

Before opening a pull request, run the relevant checks for the area you changed.

For frontend changes:

```bash
cd frontend
npm run dev
```

For backend changes:

```bash
cd backend
modal run main.py
```

Confirm that the relevant workflow works and that your changes do not introduce new errors or warnings.

## Commit Messages

Write concise, imperative commit messages that describe the change:

```text
Add playback queue controls
Fix expired S3 URL handling
Update frontend setup guide
```

## Pull Requests

When opening a pull request:

- Use a clear title that describes the change.
- Explain the problem, the solution, and any relevant trade-offs.
- Link related issues using `Fixes #123` or `Closes #123` when applicable.
- Include screenshots or recordings for user-facing UI changes.
- State how you validated the change.
- Keep the pull request focused; submit unrelated changes separately.

Maintainers may request changes before merging. Please respond to review feedback constructively and keep the branch up to date with `main` when needed.

## Licensing Contributions

By submitting a contribution to Melodyc, you agree that your contribution is licensed under the project's [MIT License](LICENSE.MD).
