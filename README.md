# Salthill Osteopathic Clinic — Production Ready

Approved static demonstration for Karl Prendergast. The design, visible copy, photograph, prices, opening hours and map destination are preserved. This is **not** the clinic's connected live website. Indexing remains disabled and the enquiry form never submits or stores data.

## Open in VS Code

Open this complete folder. No frontend framework, package manager, node_modules or build step is required. `dist/` is both the maintained site source and the complete deployable output.

- `dist/index.html`: content, metadata and accessible markup.
- `dist/styles.css`: approved responsive design and local Manrope declarations.
- `dist/app.js`: menu, area tabs, clipboard, demo form and disclosure.
- `dist/assets/assessment.jpg`: approved illustrative photograph.
- `dist/assets/fonts/`: five Manrope WOFF weights and their SIL Open Font License.
- `scripts/`: validation scripts; Python 3 and Node.js are needed only for validation/local serving.
- `vercel.json`: static output and noindex response header.
- `AUDIT.md`: changes, exact test results and remaining production QA.

## Run locally

From this folder:

```sh
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000. Stop the server with Ctrl+C. On Windows use `py -3` instead of `python3` if necessary. Avoid testing with file://: clipboard behaviour differs outside an HTTP secure context.

## Validate

```sh
python3 scripts/check.py
node --check dist/app.js
node scripts/interactions.test.cjs
python3 scripts/http-check.py
```

The interaction harness executes the real app script against a minimal DOM. It is not a browser renderer and does not prove visual layout or native browser validity handling. The HTTP test starts its own temporary loopback server on an available port and shuts it down.

## GitHub and Vercel handoff

No Git repository was initialised, no commits were made, and nothing was pushed or deployed during productionisation.

1. Complete the browser checklist in `AUDIT.md`.
2. Create your GitHub repository and upload this folder, including `dist/`, `.gitignore` and `vercel.json`.
3. Import the repository into Vercel. Framework: **Other**. Output directory: **dist**. No install/build command, environment variables or backend are required.
4. Run production QA at the deployed HTTPS URL, especially the map, clipboard and mobile viewport checks.

The manifest selects the existing `dist/` convention. Keep `noindex,nofollow`, the `X-Robots-Tag` header and demo disclosure. Do not connect the form or enable indexing as part of this handoff. No domain change or canonical URL pointing to the clinic has been added.

## Fonts, imagery and external services

Manrope weights 400/500/600/700/800 are served locally in WOFF format. The original Google Fonts font files were converted losslessly (outlines and metrics retained); see `dist/assets/fonts/OFL.txt`. Original source CSS: https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap. Licence source: https://github.com/google/fonts/blob/main/ofl/manrope/OFL.txt.

The unchanged assessment image is Pexels photo 4506111: https://www.pexels.com/photo/crop-osteopath-checking-up-back-of-anonymous-patient-in-hospital-4506111/. Licence: https://www.pexels.com/license/. Credit and illustrative-photo disclosure remain in the footer. It does not depict Karl or his patients.

Google Maps is the only embedded external service. It loads lazily and depends on Google's availability/network behaviour. Directions, phone, email, source and licence links open external services only when followed. No analytics, trackers, form API or database have been added.

## Maintenance

Edit files directly in `dist/`, keep all text UTF-8, then run the checks. Do not remove `dist/` from Git: it is the source and deployment output. The CSS cascade retains historical overrides where consolidation might change specificity or media-query behaviour. Only clearly absent components' styles were removed. See the audit before any further cleanup.
