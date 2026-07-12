# Music Page Redesign Plan

## 1. Existing repository and deployment

The repository is a flat, framework-free static website. Pages are individual HTML files at the repository root, with page-specific CSS in `css/`, JavaScript in `js/`, and media in `assets/` or `images/`. There is no package manifest, site generator, bundler, or existing build, lint, or test command.

The root `index.html`, `main` branch, repository name, and root `CNAME` indicate a GitHub Pages deployment. `CNAME` maps the site to `leonliii.com`. This redesign preserves that arrangement and does not change the domain, `CNAME`, or unrelated pages.

## 2. Exact route

Change only `music.html`, served at `https://leonliii.com/music.html` and `https://zingsmack.github.io/music.html`.

The old under-construction CSS and JavaScript remain untouched. The redesigned route uses `css/music.css`, `js/music.js`, and `music-content.json`.

## 3. Visual concepts

### Concept A: Studio Contact Sheet (recommended)

A near-black editorial treatment combining film contact-sheet framing, restrained gold registration marks, warm paper-white typography, large serif titles, and documentary studio imagery. Videos appear as deliberately framed screening windows rather than a streaming-service grid. Releases read like pieces in an exhibition catalogue.

This direction is recommended because the supplied gold-and-charcoal logo, studio photography, award material, and tree pattern already support it.

### Concept B: End-Credit Ledger

A more austere direction inspired by independent-film credits and recording logs: narrow columns, timecode-like labels, dense technical typography, and full-bleed image interruptions. Gold appears only on rules and focus states. It is distinctive but gives less prominence to the supplied imagery.

## 4. Responsive wireframe

### Desktop, approximately 1440px

1. Word gate: centred title, viewing-word field, enter button, and home link inside a fine framed layout.
2. Unlocked masthead: compact logo, home link, and section index above an editorial rule.
3. Introduction: oversized title, short copy, decorative pattern, and 16:9 click-to-load video.
4. Femme-Focused Productions: split layout with heading/copy on the left and showreel on the right.
5. Selected Releases: three horizontal cards with index/year, title/credit, poster/play control, captions status, and transcript disclosure.
6. Native Instruments recognition: award image and copy in an asymmetrical composition; testimonial image spans below with a transcription placeholder.
7. Artist studio montage: staggered two-column contact sheet with varied image ratios and restrained lower-edge overlays.
8. Mobile Studio Montage: full editorial video treatment with a click-to-load poster, captions status, and transcript disclosure.
9. Working Together: sticky heading/CTA on the left and technical details on the right, followed by a closing footer.

### Tablet, approximately 768px

1. Keep the masthead section index horizontally scrollable without hiding keyboard focus.
2. Collapse split sections to one reading column while retaining editorial offsets.
3. Keep release metadata in a narrow rail and media in a wider column.
4. Use two montage columns and explicit image aspect ratios.
5. Move the Working Together CTA above the full technical copy and remove sticky positioning.

### Mobile, approximately 375px

1. Use a compact gate with a full-width field and button.
2. Stack content in document order with 20px gutters.
3. Let display headings wrap with `clamp()` sizing.
4. Stack every release card into metadata, title, poster, captions status, and transcript.
5. Use a single-column montage with intrinsic aspect ratios.
6. Keep controls at least 44px high and remove offsets that could cause horizontal overflow.

## 5. Typography, spacing, colour, and motion

- Typography: Georgia as the editorial serif; Montserrat, already used by the existing site, with clean sans-serif fallbacks for navigation, labels, body copy, and controls.
- Spacing: a 4px base rhythm with section gaps controlled by `clamp()`, approximately 88-176px on desktop and 78-88px on smaller screens.
- Colour: charcoal `#09090b`, warm off-white `#f7f3e8`, muted warm grey `#aaa49a`, and logo-derived amber `#ffc843`.
- Detail: 1px warm-grey rules, folio labels, corner marks, and a low-opacity CSS grain layer.
- Motion: short heading and image fades triggered by intersection. No scroll hijacking, parallax, continuous motion, or autoplay.
- Reduced motion: `prefers-reduced-motion: reduce` removes transforms, transitions, and smooth scrolling while keeping content visible.

## 6. Content structure

All editable copy, YouTube links, captions status, transcripts, credits, contact details, alt text, overlays, and image paths live in one file: `music-content.json`.

The file is deliberately plain JSON and uses `TBC` wherever material has not been supplied. `MUSIC-EDITING-GUIDE.md` documents each field. The file is public because GitHub Pages is public and the requested word gate is presentational only.

## 7. Interaction and component behaviour

- The initial screen asks for the shared word `musicmakers` and reveals the portfolio after a matching entry.
- Section navigation uses ordinary anchors and native scrolling.
- YouTube components display poster buttons and create `youtube-nocookie.com` iframes only after activation.
- Transcript disclosures use native `details` and `summary` elements.
- Images use native lazy loading, explicit dimensions, and optimized derivatives.
- Editable copy is inserted as text rather than interpreted as HTML.

## 8. Media-performance plan

- Use the supplied originals as the editing source and optimized JPEG derivatives for page display.
- Keep width, height, and `aspect-ratio` metadata in `music-content.json` to prevent layout shift.
- Lazy-load images with `loading="lazy"` and decode asynchronously.
- Use YouTube poster images before playback and create no iframe until Play is pressed.
- Use `youtube-nocookie.com` for players and never autoplay before user activation.
- Any future first-party video must use a poster and `preload="metadata"`, with captions and a transcript entry.

## 9. Accessibility plan

- Use semantic header, nav, main, section, article, figure, details, and footer elements.
- Provide a skip link and visible `:focus-visible` states in the logo-derived accent.
- Use native controls and maintain at least 44px targets.
- Give every image useful alt text; missing descriptions remain `TBC`.
- Give every video a captions-status field and transcript. Current supplied videos use `TBC` until those materials are provided.
- Announce gate errors with an ARIA live region and focus the page title after entry.
- Disable non-essential transforms and transitions under reduced motion.

## 10. Word-gate plan and limitation

GitHub Pages is static, so this lightweight word gate is not security. The word `musicmakers`, page copy, JSON, links, credits, and image URLs can be discovered by anyone who views the public source or requests the files directly. `noindex, nofollow` asks search engines not to index the route but is not an access-control mechanism.

That limitation is accepted for this version because the goal is a personalised viewing moment, not confidentiality. If the material later needs real protection, the site must move behind authenticated hosting or use an encrypted/private delivery architecture.

## 11. Files to create or modify

- `music.html`
- `music-content.json`
- `css/music.css`
- `js/music.js`
- `assets/musicassets/optimized/*.jpg`
- `tools/optimize-music-image.ps1`
- `tools/test-music.ps1`
- `MUSIC-EDITING-GUIDE.md`
- `docs/music-redesign-plan.md`

Do not modify `CNAME`, unrelated HTML pages, existing analytics or metadata on unrelated pages, `css/underconstruction.css`, or `js/underconstruction.js`.

## 12. Acceptance criteria

- The title is exactly “Music — Production, Releases & Collaboration”.
- Sections appear in the requested order and use supplied media/content where available; missing copy is `TBC`.
- The Studio Contact Sheet design works without overflow at 375px, 768px, and 1440px.
- The three release cards stack cleanly on narrow screens.
- Entering `musicmakers` reveals the page; a wrong word leaves the gate visible and announces an error.
- `music.html` includes `noindex, nofollow` metadata.
- No audio autoplays, no YouTube iframe loads before activation, and no scroll hijacking occurs.
- Every video exposes captions status and a transcript placeholder.
- Keyboard users can enter the word, skip to content, navigate, play videos, open transcripts, and activate the contact link with visible focus.
- Reduced-motion mode displays all content without reveal transforms.
- Images are optimized, lazy-loaded, dimensioned, and do not cause avoidable layout shift.
- No frontend framework or large animation dependency is added.
- Tests pass and the final diff contains no unrelated page or `CNAME` changes.