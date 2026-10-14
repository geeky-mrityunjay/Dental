# Happi Smiles — standalone website

## Files
- `index.html`: page structure and accessible dialogs.
- `styles.css`: complete stylesheet, including phone and tablet layouts.
- `script.js`: navigation, treatment details, FAQs and appointment requests.
- `content.json`: clinic phone number and treatment content used by dialogs.
- `assets/`: included smile image and original doctor photograph.
- `vercel.json`: static hosting settings; no build step needed.

## GitHub and Vercel
1. Unzip this download.
2. Create a GitHub repository, then upload all files and the assets folder together. Keep index.html at the repository root.
3. In Vercel, choose Add New → Project and import that repository.
4. Select Other for the framework, leave the build command empty, and use `.` for the output directory. Click Deploy.

## Local preview
Serve the folder using a local web server (for example `python3 -m http.server 8000`) and open http://localhost:8000. Do not double-click index.html: browsers block content.json reads from local file URLs.

## Editing
Main page copy is in index.html; dialog treatment details and the WhatsApp number are in content.json. If renaming treatments, update the matching cards in index.html too.

Appointments open WhatsApp with the selected treatment; the clinic must reply to confirm an appointment. No credentials, database or paid service required. Google Fonts needs an internet connection; local fallback fonts are provided. The smile image is illustrative generated imagery, not an actual patient photograph.
