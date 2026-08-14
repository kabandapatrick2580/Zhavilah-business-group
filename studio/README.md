# ZHAVILAH Studio

The content editing interface for the website. **This is a separate npm project
from the website** — it has its own `package.json` and `node_modules`, and it
deploys to Sanity's hosting rather than to Vercel.

Keeping it separate means the Studio's dependencies (which track a newer React
than the site) can never conflict with the website's, and the Studio cannot
break the site's build.

## Setup

```bash
cd studio
npm install
cp .env.example .env     # fill in from https://www.sanity.io/manage
```

## Commands

```bash
npm run dev      # Studio at http://localhost:3333
npm run deploy   # publish to https://<name>.sanity.studio
npm run export   # download a full content backup
```

## Notes

- The schemas in `schemaTypes/` are the source of truth for §2.2 of the
  development agreement. See `../docs/CMS-IMPLEMENTATION.md`.
- `service.ts` carries a copy of the icon key list from
  `../components/services/serviceIcons.tsx`. Keep the two in step when adding an
  icon.
