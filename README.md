<div align="left">
  <picture>
    <source media="(prefers-color-scheme: dark)"
            srcset="https://github.com/wattnet/.github/raw/main/images/wattnet-logo-full-dark-transparent-cropped.png" />
    <source media="(prefers-color-scheme: light)"
            srcset="https://github.com/wattnet/.github/raw/main/images/wattnet-logo-full-light-transparent-cropped.png" />
    <img src="https://github.com/wattnet/.github/raw/main/images/wattnet-logo-full-light-transparent-cropped.png"
         alt="Wattnet Logo"
         width="300" />
  </picture>
</div>

# Product Website

Official product website for wattnet, providing an overview of its features, services, use cases and contact information.

## From Astro Sassify Template

A modern, responsive Astro template with Tailwind CSS and Alpine.js integration. This template provides a solid foundation for building fast, SEO-friendly websites with a clean design system.

## 🚀 Features

-   [Astro](https://astro.build/) - The web framework for content-driven websites
-   [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
-   [Alpine.js](https://alpinejs.dev/) - Lightweight JavaScript framework for interactivity
-   Responsive design system with custom color palette
-   Dark mode support
-   Smooth page transitions
-   Performance optimized
-   SEO-friendly

## 📦 Project Structure

```text
/
├── public/             # Static assets
│   └── favicon.svg
├── src/
│   ├── assets/         # Images and other assets
│   ├── components/     # Reusable UI components
│   ├── layouts/        # Page layouts
│   ├── pages/          # Page routes
│   ├── scripts/        # JavaScript utilities
│   └── styles/         # Global styles
│       ├── global.css
│       └── transitions.css
├── astro.config.mjs    # Astro configuration
└── package.json        # Project dependencies
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🎨 Customization

### Colors

The template includes a custom color palette defined in `src/styles/global.css`:

-   Primary: Purple-based color scheme
-   Secondary: Slate-based color scheme
-   Accent: Lime-based color scheme
-   Warning: Yellow-based color scheme

You can customize these colors by editing the `src/styles/global.css` file.

### Typography

The template uses the following font families:

-   Sans: Inter (with system fallbacks)
-   Display: Lexend (with system fallbacks)

### Animations

Custom animations are included:

-   Fade In
-   Slide Up
-   Slide Down

## 🚀 Getting Started

There are two ways to use this template:

### Option 1: Using Astro CLI (Recommended)

Create a project directly with Astro's official CLI tool:

```bash
npm create astro@latest -- --template larry-xue/astro-sassify-template
```

### Option 2: Manual Clone

1. Clone this repository

    ```bash
    git clone https://github.com/larry-xue/astro-sassify-template.git my-project
    cd my-project
    ```

2. Install dependencies

    ```bash
    npm install
    ```

3. Start the development server

    ```bash
    npm run dev
    ```

4. Visit `http://localhost:4321` in your browser to see your site

## 📝 License

MIT

## 👀 Learn More

-   [Astro Documentation](https://docs.astro.build)
-   [Tailwind CSS Documentation](https://tailwindcss.com/docs)
-   [Alpine.js Documentation](https://alpinejs.dev/start-here)

## Funding and acknowledgments

This work is funded by the European Union’s Horizon Europe research and innovation programme through the **[GreenDIGIT](https://greendigit-project.eu/)** project, under grant agreement **[101131207](https://cordis.europa.eu/project/id/101131207)**.

<div align="left">
  <img src="https://github.com/wattnet/.github/raw/main/images/EN_FundedbytheEU_RGB_POS.png" alt="EU Funded Logo" width="260"/>
  <img src="https://github.com/wattnet/.github/raw/main/images/GreenDIGIT%20logo%20color%20horizontal2.png" alt="GreenDIGIT Logo" width="230"/>
</div>

##### © 2025 Spanish National Research Council (CSIC). All rights reserved.
