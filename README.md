# Portfolio-Engine-3D

> A full-stack portfolio project with dynamic, admin-controlled content.

## Overview

Portfolio Engine 3D combines a React frontend with an Express and MongoDB backend. The project is structured so the backend API and the frontend app can be deployed separately.

## Stack

- Frontend: React, Vite, Tailwind CSS, Three.js
- Backend: Node.js, Express
- Database: MongoDB Atlas
- Authentication: JWT

## Deployment Notes

### Backend on Render

Set these environment variables on the Render backend service:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority&appName=<appName>
JWT_SECRET=your-secret
CLIENT_URL=https://your-frontend-domain.onrender.com
```

Optional:

```env
CLIENT_URLS=https://your-frontend-domain.onrender.com,https://your-preview-domain.onrender.com
```

Notes:

- Do not use `mongodb://127.0.0.1:27017/portfolio` on Render.
- `PORT` is provided automatically by Render for the backend service.

### Frontend on Render

If you deploy the frontend separately, set:

```env
VITE_API_BASE_URL=https://your-backend-domain.onrender.com/api
```

The frontend code uses `VITE_API_BASE_URL`, not `VITE_API_URL`.
