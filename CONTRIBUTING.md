# Contributing to wattnet.eu

Thank you for your interest in contributing. This document covers how to set up your environment, the standards we follow, and the process for submitting changes.

## Prerequisites

- Node.js 22 or later
- npm
- Git

## Getting Started

1. Fork the repository and clone your fork:

   ```bash
   git clone https://github.com/<your-username>/wattnet.eu.git
   cd wattnet.eu
   ```

2. Install the dependencies from the lockfile:

   ```bash
   npm ci
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

The site is served at `http://localhost:4321`.

## Checks

Every pull request must pass the format check, the type check, and the production build. Run all three before pushing:

```bash
npm run format
npm run format:check
npm run check
npm run build
```

`npm run format` rewrites the source with Prettier, `npm run format:check` verifies it without writing, and `npm run check` runs `astro check` to validate the TypeScript in `.astro` and `.ts` files. To inspect the generated site locally, run `npm run preview`. The output goes to `dist/`, which is generated and must not be committed, together with `node_modules/`.

## Code Style

Formatting is enforced with Prettier and `prettier-plugin-astro`. Run `npm run format` before pushing instead of adjusting whitespace by hand.

- Prettier formats `.astro`, TypeScript, JavaScript, and CSS with a print width of 100, single quotes, and two-space indentation.
- Pages live in `src/pages/`, reusable components in `src/components/`, layouts in `src/layouts/`, and shared styles in `src/styles/global.css`.
- Style with Tailwind utilities in the markup and keep custom CSS in `global.css`.
- User-facing copy is in English.
- Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`).

## Submitting a Pull Request

1. Create a branch from `dev` with a descriptive name:

   ```bash
   git checkout dev
   git pull
   git checkout -b feat/my-new-feature
   ```

2. Make your changes and check that `npm run build` succeeds.

3. Push your branch and open a PR against `dev`. Fill in the PR template.

4. A maintainer will review your PR. Please address any requested changes promptly.

`dev` is the integration branch. `main` is the branch that gets deployed, so changes reach production when a maintainer merges `dev` into `main`.

## Reporting Issues

Please use the GitHub issue templates for bug reports and feature requests. For security vulnerabilities, see [SECURITY.md](SECURITY.md).

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
