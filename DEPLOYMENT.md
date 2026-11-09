# Render deployment settings

Keep the backend and frontend as separate Render services.

## Backend web service

- Root directory: repository root
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/health`
- Required environment variables:
  - `NODE_ENV=production`
  - `MONGO_URI=mongodb+srv://<database-user>:<url-encoded-password>@<cluster-host>/portfolio?retryWrites=true&w=majority`
  - `JWT_SECRET=<long-random-secret>`
  - `CLIENT_URL=https://portfolio-engine3d.onrender.com`
  - `CLOUDINARY_CLOUD_NAME=<cloud-name>`
  - `CLOUDINARY_API_KEY=<api-key>`
  - `CLOUDINARY_API_SECRET=<api-secret>`

Use the exact database name in the MongoDB URI path (`/portfolio`) so the app reads the same `admins` collection where the admin document was created. Add any other frontend origins to `CLIENT_URLS`, separated by commas. Do not commit real credentials.

At startup, production now rejects a missing or local MongoDB URI, a URI targeting a database other than `portfolio`, a JWT secret shorter than 32 characters, or a missing/invalid HTTPS frontend origin. Cloudinary configuration is reported as a warning because the API can serve portfolio content without it, but uploads will remain unavailable until all three Cloudinary values are set.

Configure the three Cloudinary values in the backend service's Render environment. Local development can continue to store uploads in `uploads/`; production uploads are sent to Cloudinary so deploys and restarts do not remove them. Production upload requests return a clear setup error if persistent media storage is not configured. Keep the Cloudinary API secret only in the backend environment, never in the frontend.

The admin profile editor accepts a resume PDF upload. Cloudinary Free environments block PDF delivery by default, so enable PDF delivery in the Cloudinary product environment's Security settings before expecting the preview and download links to work. The resume download action uses Cloudinary's attachment delivery flag.

## Frontend static site

- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://portfolio-engine-3d.onrender.com/api`

Vite environment values are embedded during the build. Redeploy the static site after changing its API URL.

## Post-deploy smoke test

Run the read-only checks from PowerShell after setting the public service URLs:

```powershell
$env:BACKEND_URL = "https://portfolio-engine-3d.onrender.com"
$env:FRONTEND_URL = "https://portfolio-engine3d.onrender.com"
npm run smoke:deploy
```

The command checks backend health, MongoDB readiness, Cloudinary configuration, frontend response, portfolio API shape, and CORS. It does not log in, upload files, or create messages.

1. Open the backend `/health` URL. Confirm `status` is `ready` and `database` is `connected`.
2. Sign in to Admin and check the Launch Readiness panel for content gaps and media-storage configuration.
3. Upload a small project image and your CV PDF, save the records, and open the public project and resume sections. If PDF delivery is blocked, update the Cloudinary Security setting described above.
4. Submit a brief test message from the public Contact section and confirm it appears in Admin > Messages; remove it afterward if you do not want to keep it.
5. Check the site at phone width, then after a backend redeploy confirm the uploaded image and CV still open.
