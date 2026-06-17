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

# wattnet.eu — Product Website

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fwattnet.eu&label=wattnet.eu)](https://wattnet.eu)
[![Astro](https://img.shields.io/badge/Astro-6.x-FF5D01?logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Official product website for **[Wattnet](https://wattnet.eu)**, a service for tracking the environmental footprint of electricity across Europe. The site provides an overview of features, interactive demos, open resources (datasets, publications, software), and contact information.

## Tech Stack

- [Astro](https://astro.build/) — web framework
- [Tailwind CSS v4](https://tailwindcss.com/) — utility-first styling
- [Alpine.js](https://alpinejs.dev/) — lightweight interactivity
- [Preact](https://preactjs.com/) — interactive island components (publications, software)
- [Lottie](https://lottiefiles.com/) — animated hero background

## Project Structure

```text
/
├── public/                 # Static assets (favicon, etc.)
├── src/
│   ├── assets/             # Images, logos, team photos
│   │   └── logos/
│   │       ├── external/   # Partner and funder logos
│   │       └── wattnet/    # Wattnet brand assets
│   ├── components/         # UI components
│   │   ├── Hero.astro
│   │   ├── Features.astro
│   │   ├── Demo.astro
│   │   ├── Publications.astro
│   │   ├── Datasets.astro
│   │   ├── Software.astro
│   │   ├── Team.astro
│   │   ├── Contact.astro
│   │   ├── Header.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── features.astro
│   │   ├── resources.astro
│   │   ├── services.astro
│   │   ├── contact.astro
│   │   └── api/repos.ts    # GitHub repos endpoint
│   └── styles/
│       └── global.css
├── astro.config.mjs
└── package.json
```

## Commands

All commands are run from the root of the project:

| Command           | Action                                     |
| :---------------- | :----------------------------------------- |
| `npm install`     | Install dependencies                       |
| `npm run dev`     | Start local dev server at `localhost:4321` |
| `npm run build`   | Build production site to `./dist/`         |
| `npm run preview` | Build and preview locally before deploying |

## License

The website source code is licensed under the [MIT License](LICENSE).

Based on the [astro-sassify-template](https://github.com/larry-xue/astro-sassify-template) by [larry-xue](https://github.com/larry-xue), also MIT-licensed.

## Funding and acknowledgments

This work is funded by the European Union's Horizon Europe research and innovation programme through the **[GreenDIGIT](https://greendigit-project.eu/)** project, under grant agreement **[101131207](https://cordis.europa.eu/project/id/101131207)**, as well as the Swiss State Secretariat for Education, Research and Innovation (SERI).

<img src="src/assets/logos/external/GreenDIGIT logo color horizontal2.png" alt="GreenDIGIT Logo" width="230" align="right"/>
<img src="src/assets/logos/external/EN_FundedbytheEU_RGB_POS.png" alt="EU Funded Logo" width="260" align="left"/>
<img src="src/assets/logos/external/Flag_of_Switzerland.svg" alt="Swiss State Secretariat for Education, Research and Innovation (SERI)" height="50" align="left"/>
<br clear="all"/>

##### © 2026 Spanish National Research Council (CSIC). All rights reserved.
