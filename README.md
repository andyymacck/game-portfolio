# Game Portfolio

[![Deploy](https://github.com/andyymacck/game-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/andyymacck/game-portfolio/actions/workflows/deploy.yml)

Live: https://andyymacck.github.io/game-portfolio

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Contact Form Configuration

The contact form uses Web3Forms. To enable it:

1. Create an account / form at https://web3forms.com/ and copy your Access Key.
2. Copy `.env.example` to a new file named `.env` in the project root.
3. Replace `YOUR_REAL_WEB3FORMS_ACCESS_KEY` with the actual key:

```
REACT_APP_WEB3FORMS_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

4. Save the file, then restart the dev server (`npm start`) or rebuild (`npm run build`).
5. Submit the form locally to confirm you see `Message sent successfully!`.

If you see `Invalid access key` in the form error detail:
- Make sure the key matches exactly (no spaces, no quotes).
- Regenerate the key in Web3Forms if you think it was exposed, then update `.env` and rebuild.

Security Notes:
- `.env` is git‑ignored; do not commit your real key.
- Anyone inspecting the deployed bundle can still see the key (client-side apps cannot fully hide it). If abuse occurs, rotate the key.

Optional Hardening:
- Add a honeypot field or enable spam protection features in Web3Forms dashboard.
- Add rate limiting / captcha using a different backend if you later introduce a server.

### Spam Protection / Key Rotation

Implemented:
- Honeypot field `botcheck` (hidden). Bots that fill it are treated as silent success and discarded.

To rotate your Web3Forms key (e.g., if exposed):
1. Generate a new key in Web3Forms dashboard.
2. Update `.env` with the new value.
3. Rebuild (`npm run build`) and redeploy.
4. Invalidate the old key in the dashboard (if supported) to prevent abuse.

If spam increases:
- Add simple client-side rate limiting (e.g., block multiple submits inside 30s).
- Add a challenge (math question) stored in component state.
- Move to server-side proxy to hide key.

---

## Video / Media Optimization & Deployment

Large raw gameplay recordings can exceed GitHub's 100MB per-file limit. This project includes a helper script to compress videos before deploying.

### 1. Batch Compress Videos

The script `scripts/compress-videos.ps1` will:
- Scan `public/unreal`, `public/unity`, and `public` for `.mp4` files over a size threshold (default 40MB).
- Use `ffmpeg` (must be installed & in PATH) to create an H.264 web version.
- Replace the original only if the compressed version is smaller.

Run (PowerShell):
```powershell
./scripts/compress-videos.ps1
```

Preview (dry run only):
```powershell
./scripts/compress-videos.ps1 -DryRun
```

More aggressive compression:
```powershell
./scripts/compress-videos.ps1 -CRF 30 -Preset veryslow
```

Adjustable parameters:
| Param | Default | Notes |
|-------|---------|-------|
| `-ThresholdMB` | 40 | Only compress files >= this size |
| `-MaxWidth` | 1280 | Scales down wider videos, preserves aspect |
| `-CRF` | 27 | 24 higher quality / 30 smaller size |
| `-Preset` | slow | veryslow=smaller; fast=larger |
| `-Force` | (off) | Rebuild even if a `_web` file exists |
| `-DryRun` | (off) | Show candidates without modifying |

### 2. Commit & Deploy

After compression:
```powershell
git add .
git commit -m "Compress videos"
git push origin master
npm run deploy
```

### 3. Verify Deployment
Visit: `https://andyymacck.github.io/game-portfolio/`

Open DevTools > Network to confirm video file sizes drop (hard refresh / Ctrl+F5 to bypass cache).

### 4. Optional External Hosting
If a clip still needs to stay >40MB, consider:
- Unlisted YouTube (embed or link)
- Vimeo / Cloudflare Stream
- Separate download link (ZIP) in Releases

### Recommended Targets
| Asset | Target Size |
|-------|-------------|
| Slice showcase video | 12–25 MB |
| Longer trailer | ≤30 MB |
| Featured long reel | ≤40 MB (only if essential) |
| Single PDF | <4 MB |
| Thumbnails | <150 KB |

---

## Deployment (GitHub Pages)

Already configured via `homepage` + `gh-pages` script.

Deploy manually:
```powershell
npm run deploy
```

If 404 after deploy:
1. Ensure `gh-pages` branch was created.
2. Settings > Pages points to `gh-pages` (root).
3. Wait 1–3 minutes, then hard refresh.
4. Verify that large assets are <100MB.

Troubleshooting:
- Build missing? Run `npm run build` locally to catch errors.
- Stale cache? Add a query parameter like `?v=2` to URL.
- Service worker caching? Open DevTools > Application > Clear site data.

---

## Quick Maintenance Checklist

- [ ] Compress new gameplay clips before committing
- [ ] Keep PDFs optimized (export for web / screen)
- [ ] Run `npm run deploy` after meaningful content updates
- [ ] Test on mobile (≤600px) for layout integrity
- [ ] Hard refresh after deploy to validate fresh assets

---

Feel free to extend this README with a changelog or feature roadmap.
