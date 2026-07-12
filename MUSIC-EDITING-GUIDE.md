# Music Editing Guide

The Music page is a static GitHub Pages page. You do not need a build command for normal text or link changes.

## The one content file

Edit `music-content.json`. It contains all page copy, video links, release credits, captions status, transcripts, testimonial transcription, contact details, image paths, alt text, and image dimensions.

JSON has a few strict rules:

- Keep double quotes around field names and text.
- Keep commas between items, but do not add a comma after the final item in an object or list.
- Use `TBC` for anything not yet supplied.
- Do not paste HTML into copy fields; the page displays content as plain text.

After editing, run:

```powershell
.\tools\test-music.ps1
```

## Update text

Open `music-content.json`, find the relevant section under `sections`, and replace the text between the double quotes. Each section also has a short `navLabel` used in the top index. The page sections are `introduction`, `showreel`, `releases`, `recognition`, `montage`, and `workingTogether`.

Long technical copy is stored in `workingTogether.paragraphs`. Each quoted item is one paragraph. The short checklist is `workingTogether.tldr`.

## Update video links

Each video has a `url` field. Paste a full YouTube link in either of these forms:

```text
https://youtu.be/VIDEO_ID
https://www.youtube.com/watch?v=VIDEO_ID
```

The page derives the poster automatically. It does not create the YouTube player until the visitor presses Play.

For every video, also update:

- `title`: accessible player title and visible caption.
- `captions`: use a factual status such as `Available on YouTube`, or leave `TBC`.
- `transcript`: paste the complete transcript, or leave `TBC`.

## Update release credits

In `sections.releases.items`, each release has `title`, `year`, `url`, `credit`, `captions`, and `transcript`. Keep the three objects in the order you want them displayed.

## Update testimonials

The current grouped testimonial image is referenced by `media.testimonials.source`. Replace `sections.recognition.testimonialsTranscription` with a plain-text transcription so screen-reader users receive the same information as the image.

Do not add quotation text, names, roles, or credentials unless you have verified the wording.

## Update images

Keep original source files in `assets/musicassets`. The page uses smaller files from `assets/musicassets/optimized`.

To create or replace one optimized JPEG, run:

```powershell
.\tools\optimize-music-image.ps1 -Source "assets\musicassets\images_me\new-photo.jpg" -Name "new-photo" -MaxWidth 1800 -Force
```

Then update the matching media entry in `music-content.json`:

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

## Change the viewing word

The presentational entry word is `musicmakers`. To change it, open `js/music.js`, search for `musicmakers`, and replace it with the new lowercase word.

This is not secure access control. The word and all page content are visible in the public repository and can be bypassed by requesting `music-content.json` or asset URLs directly. The gate is only a personalised introduction.

## Preview locally

Start the included local server:

```powershell
.\tools\serve-local.ps1
```

Then open `http://localhost:4173/music.html`. Press `Ctrl+C` in PowerShell to stop the server.

A local server is required because the page fetches `music-content.json`; opening `music.html` directly as a file may be blocked by browser security rules.

## Publish

Before committing, check the changed files:

```powershell
git status --short
git diff --stat
.\tools\test-music.ps1
```

Then commit and push:

```powershell
git add music.html music-content.json css/music.css js/music.js assets/musicassets tools MUSIC-EDITING-GUIDE.md docs/music-redesign-plan.md
git commit -m "Redesign music portfolio"
git push origin main
```

GitHub Pages should publish the `main` branch automatically. Do not edit or remove `CNAME`.