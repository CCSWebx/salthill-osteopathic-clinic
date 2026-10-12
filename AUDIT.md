# Technical audit and handoff

Date: 9 October 2026.
Input: `Salthill_Final_Three_Refinements.zip`.
Output: `Salthill_Osteopathic_Production_Ready`.

## Complete initial audit

All seven supplied files were inspected: HTML, CSS, JS, assessment JPEG, README, structural checker and interaction harness. Architecture: plain static HTML/CSS/JS, maintained in `dist/`; no framework, dependencies, build, package.json, Vercel configuration, gitignore or local fonts were supplied. The photograph is 1200 × 1800, with correct intrinsic dimensions, hero priority and licence/disclosure. Google Maps is lazy-loaded. The tab selector changes text only; there was no tab-specific image system to preserve. FAQ accordions use native details/summary. Timeline and consultation steps are informational, with optional reveal animation.

Business facts, all nine FAQs, chronology, €75/€70 pricing, appointment hours, destination address, telephone/email, noindex and demo wording were retained. No clinical claims, policies or structured business data were added.

## Files changed and technical corrections

| File | Change |
| --- | --- |
| `dist/index.html` | Replaced Google Fonts network links with local font preload; added matching text-only Open Graph metadata; described the form with its existing demo note; initially disabled the demo submit button until JS enables it; made live confirmation atomic. Formatting only elsewhere. |
| `dist/styles.css` | Local font faces; readable formatting; removed selectors for deleted journey, previous imagery and other absent components; reserved mobile safe-area space for focused content and footer; contrasting focus outline in existing dark sections. Preserved remaining cascade rather than a risky global rewrite. |
| `dist/app.js` | Closing a mobile navigation link moves focus to its destination rather than leaving focus in hidden navigation; breakpoint change closes stale menu state; enables the demo control only under JavaScript. Formatting improved. Existing tab/copy/form behaviour retained. |
| `scripts/check.py` | Preserved original assertions; added local font/licence, no-JS demo protection, exact contact/directions, lazy map, noindex and Vercel-output checks. All text reads use UTF-8. |
| `scripts/interactions.test.cjs` | Extended the harness to represent the newly disabled button and actual navigation targets; tests focus/Escape/resize, arrow/Home/End keys, mobile ARIA and clipboard rejection. Original behaviours continue to be asserted. |
| `README.md` | Replaced iteration history with local use, maintenance, validation and GitHub/Vercel handoff instructions. |

## Files added

- `.gitignore`: dependency, environment/secrets, cache, OS, temporary and generated-test exclusions.
- `vercel.json`: static `dist/` output, no framework/build/install requirement, noindex and nosniff response headers.
- `dist/assets/fonts/manrope-400.woff`, `manrope-500.woff`, `manrope-600.woff`, `manrope-700.woff`, `manrope-800.woff`, `OFL.txt`: local fonts and licence.
- `scripts/http-check.py`: temporary local HTTP validation with automatic shutdown.
- `AUDIT.md`: this report.

No image recompression, redesign, colour-system change, section change or approved text rewrite occurred. A parser comparison confirmed every non-whitespace visible text segment equals the approved input. The assessment JPEG is byte-identical to the approved archive. Local font files retain the same Manrope outlines/metrics. No source-control directory or credentials are included.

## Commands executed and observed results

`python3 scripts/check.py` — exit 0:

```text
PASS: HTML structure, anchors, local assets, 9 FAQs, contact links, demo privacy and reduced motion
PASS: 5 local Manrope fonts/licence, demo fail-closed markup, exact contact/map destinations and static Vercel configuration
```

`node --check dist/app.js` — exit 0, no stdout.

`node scripts/interactions.test.cjs` — exit 0:

```text
PASS: menu, Escape/focus, resize, 7 tabs, arrow/Home/End keys, mobile ARIA, demo form, credits, copy success/failure
```

`python3 scripts/http-check.py` — exit 0:

```text
PASS: static HTTP root, 10 files (byte-exact), MIME and 404; server stopped
```

Additional one-off checks passed: approved visible text equality; image byte equality; balanced HTML nesting/CSS blocks; retained map heights 500/460/340px; configuration keys and value types inspected against https://openapi.vercel.sh/vercel.json. This was not a Vercel deployment or full remote build validation.

The browser prerequisite command `node <installed-playwright>/cli.js install chromium` failed with exit 1: downloaded browser archive was empty/truncated (`End of central directory record signature not found`). No browser launch, screenshots, rendered visual inspection, native HTML validation exercise or real clipboard permission test could therefore be completed. An initial interaction-harness run also failed because its mock did not yet include the newly disabled submit button; the mock was extended, not assertions weakened. The final run above passes. A WOFF2 conversion attempt lacked the optional Brotli encoder; final local fonts use valid WOFF instead. These intermediate tooling failures are not shipped dependencies.

## Interaction coverage and limits

Verified through the real JS in a minimal DOM harness: menu toggle, Escape and focus return, link destination focus, breakpoint closure, all seven area choices, single active tab, aria-labelledby updates, arrows/Home/End with wraparound, mobile tab orientation, demo handler prevents submission and clears fields, honest confirmation, credits open/close, exact clipboard address on success, and full manual-copy fallback on permission failure. Duplicate listener registration is checked for mocked elements.

Native details/summary and required/type=email constraints are present, but browser-native activation and invalid-input popovers were not exercised. Static checks establish labels, unique IDs, headings, landmarks, lazy loading, focus CSS and reduced-motion rules; they are not a WCAG conformance certification. Real phone/email handlers depend on the user's device.

## External links checked

All 11 distinct external anchor destinations returned HTTP 200 during bounded HTTP checks: clinic home, about, conditions, location, hours, prices, what-to-expect; OCI practitioner directory; Google Maps directions; Pexels licence; Pexels photo 4506111. HTTP success does not establish visual map rendering or validate each external site's contents. The embed query and directions destination contain the approved clinic name/address/Eircode; the live pin has not been inspected in a browser. The lazily embedded map remains dependent on Google/network policy.

## Remaining production QA

- Open the actual served/deployed website in Chrome/Edge and Safari, and on a real mobile device.
- Inspect widths 320, 360, 375, 390, 414, 768, 1024, 1280, 1440 and 1920px, plus 200% text enlargement: overflow, readable text, image crop, map heights, navigation and sticky bar clearance.
- Exercise native required/email validation, all FAQ accordions, tabs and focus visibility, including dark backgrounds and a reduced-motion preference.
- Inspect the actual Maps pin and directions, clipboard allow/deny states on HTTPS, and telephone/email handoff.
- Confirm local font loading, no form network submission/storage, noindex HTML and X-Robots-Tag on Vercel. The Python server does not emulate Vercel headers.
- Inspect computed contrast/rendered accessibility. CSS colour pairs were reviewed; full rendered automated/manual accessibility audit remains pending.

## Readiness

Ready to open in VS Code and transfer to GitHub/Vercel for production QA. No package installation or build is required to deploy the static files. No git init, commits, push, deployment, business contact or domain change was performed. It remains an honest noindex demo; it is not represented as having passed browser or live Vercel QA.
