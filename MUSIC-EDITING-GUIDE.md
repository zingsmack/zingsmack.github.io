# Music Editing Guide

The Music page is a static GitHub Pages page. You do not need a build command for normal text or link changes.

## The two content files

Each viewing word has one self-contained content file:

- `music-content.json` controls the existing portfolio opened with `musicmakers`.
- `moviemakers-content.json` controls the film portfolio opened with `moviemakers`.

Each file contains that version's page copy, video links, release or clip credits, captions status, transcripts, testimonial transcription, contact details, image paths, alt text, and image dimensions. Edit only the file for the version you want to change.

JSON has a few strict rules:

- Keep double quotes around field names and text.
- Keep commas between items, but do not add a comma after the final item in an object or list.
- Use `TBC` for unsupplied `musicmakers` content. The current `moviemakers` design uses a single dot (`.`) for intentionally minimal placeholders.
- Do not paste HTML into copy fields; the page displays content as plain text.

After editing, run:

```powershell
.\tools\test-music.ps1
```

## Update text

Open the relevant content file, find the section under `sections`, and replace the text between the double quotes. Each section also has a short `navLabel` used in the top index.

The `musicmakers` sections are `introduction`, `showreel`, `releases`, `recognition`, `montage`, `studioVideo`, and `workingTogether`. The `moviemakers` sections are `introduction`, `showreel`, `releases`, `recognition`, `montage`, `filmClips`, and `workingTogether`.

Long technical copy is stored in `workingTogether.paragraphs`. Each quoted item is one paragraph. The short checklist is `workingTogether.tldr`.

## Update video links

Each video has a `url` field. Paste a full YouTube link in either of these forms:

```text
https://youtu.be/VIDEO_ID
https://www.youtube.com/watch?v=VIDEO_ID
```

The page derives the poster automatically. It does not create the YouTube player until the visitor presses Play.

To override a YouTube thumbnail, add a `poster` field to that video in the relevant content file. Film poster originals use the section numbering convention in `assets/musicassetsextrafilm`, such as `02.PNG` or `03_02.PNG`; optimized page versions live in `assets/musicassetsextrafilm/optimized`:

```json
"poster": "assets/musicassetsextrafilm/optimized/03_02.jpg"
```

If `poster` is omitted or set to `TBC`, the page keeps the automatic YouTube thumbnail fallback.

For every video, also update:

- `title`: accessible player title and visible caption.
- `captions`: use a factual status such as `Available on YouTube`, or leave `TBC`.
- `transcript`: paste the complete transcript, or leave `TBC`.

## Update release credits

In `sections.releases.items`, each release has `title`, `year`, `url`, `credit`, `captions`, and `transcript`. Keep the three objects in the order you want them displayed. Use `TBC` for any film release year or credit that has not been supplied.

## Update the film clips

In `moviemakers-content.json`, section 06 is `sections.filmClips`. Each clip has `title`, `url`, `description`, `captions`, and `transcript`. Keep its three objects in the order you want them displayed; the page labels them C / 01 through C / 03 automatically.

The `description` field is a list of quoted paragraphs. Add, remove, or reorder those quoted items to change the compact text shown in the left-hand column beside each clip.

## Update social links

The `moviemakers` footer icons are controlled by `page.socialLinks`. Update a profile's `url`, but keep its `label` and `icon` values so the link remains understandable to screen readers and retains the correct icon.

## Update testimonials

The current grouped testimonial image is referenced by `media.testimonials.source`. Replace `sections.recognition.testimonialsTranscription` with a plain-text transcription so screen-reader users receive the same information as the image.

Do not add quotation text, names, roles, or credentials unless you have verified the wording.

## Update images

Keep original source files in `assets/musicassets`. The page uses smaller files from `assets/musicassets/optimized`.

To create or replace one optimized JPEG, run:

```powershell
.\tools\optimize-music-image.ps1 -Source "assets\musicassets\images_me\new-photo.jpg" -Name "new-photo" -MaxWidth 1800 -Force
```

Then update the matching media entry in the relevant content file:

```json
"new-photo": {
  "source": "assets/musicassets/optimized/new-photo.jpg",
  "alt": "TBC",
  "width": 1800,
  "height": 1200
}
```

The optimizer reports the exact width and height to enter. Write useful alt text describing the image's purpose. Use an empty alt value only when an image is genuinely decorative.

To add an image to the studio montage, add its media key to `sections.montage.items`:

```json
{ "image": "new-photo", "overlay": "TBC" }
```

## Change a viewing word

The presentational entry words are `musicmakers` and `moviemakers`. They are mapped to their content files near the top of `js/music.js` in `CONTENT_PATHS_BY_WORD`.

This is not secure access control. Both words and both content files are visible in the public repository, and the gate can be bypassed by requesting a JSON file or asset URL directly. The gate is only a personalised introduction.

## Preview locally

Start the included local server:

```powershell
.\tools\serve-local.ps1
```

Then open `http://localhost:4173/music.html`. Test `musicmakers` and `moviemakers` separately. Press `Ctrl+C` in PowerShell to stop the server.

A local server is required because the page fetches the selected content JSON file; opening `music.html` directly as a file may be blocked by browser security rules.

## Publish

Before committing, check the changed files:

```powershell
git status --short
git diff --stat
.\tools\test-music.ps1
```

Then commit and push:

```powershell
git add music.html music-content.json moviemakers-content.json css/music.css js/music.js assets/musicassets assets/musicassetsextrafilm tools MUSIC-EDITING-GUIDE.md docs/music-redesign-plan.md
git commit -m "Update music portfolios"
git push origin main
```

GitHub Pages should publish the `main` branch automatically. Do not edit or remove `CNAME`.