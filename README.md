# Personal Dashboard + Blog Template (Next.js)

Static one-page template for a future app that combines:
- graphical visualization blocks
- dashboard widgets
- personal blog-style content

No functionality is implemented yet—this is a deployable starter shell.

## Local development

```bash
npm install
npm run dev
```

## Static build

```bash
npm run build
```

This project is configured with `output: "export"` and is ready for GitHub Pages static deployment.
When built in GitHub Actions, `basePath` and `assetPrefix` are automatically set from `GITHUB_REPOSITORY`.
