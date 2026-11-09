const parseUrl = (value, name) => {
  if (!value) throw new Error(`${name} is required.`);
  return new URL(value);
};

const request = async (fetchImpl, url, options = {}) => {
  const response = await fetchImpl(url, {
    ...options,
    signal: AbortSignal.timeout(45000),
  });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}.`);
  return response;
};

export const runDeploymentSmokeChecks = async ({
  backendUrl,
  frontendUrl,
  fetchImpl = fetch,
  log = console.log,
}) => {
  const backend = parseUrl(backendUrl, "BACKEND_URL");
  const frontend = parseUrl(frontendUrl, "FRONTEND_URL");

  const healthResponse = await request(fetchImpl, new URL("/health", backend));
  const health = await healthResponse.json();
  if (health.status !== "ready" || health.database !== "connected") {
    throw new Error(`Backend health is not ready (status=${health.status}, database=${health.database}).`);
  }
  log("PASS backend health and MongoDB connection");

  if (health.mediaStorage !== "cloudinary-configured") {
    throw new Error(`Persistent media storage is not configured (mediaStorage=${health.mediaStorage}).`);
  }
  log("PASS persistent media storage configuration");

  const frontendResponse = await request(fetchImpl, frontend);
  const contentType = frontendResponse.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    throw new Error("The frontend URL did not return an HTML page.");
  }
  log("PASS frontend page response");

  const portfolioResponse = await request(fetchImpl, new URL("/api/portfolio", backend), {
    headers: { Origin: frontend.origin },
  });
  const allowedOrigin = portfolioResponse.headers.get("access-control-allow-origin");
  if (allowedOrigin !== frontend.origin) {
    throw new Error(`CORS did not allow the configured frontend origin (${frontend.origin}).`);
  }

  const portfolio = await portfolioResponse.json();
  const collections = ["projects", "skills", "experience", "education", "certificates", "achievements"];
  const invalidCollections = collections.filter((key) => !Array.isArray(portfolio[key]));
  if (invalidCollections.length) {
    throw new Error(`Portfolio response is missing valid collections: ${invalidCollections.join(", ")}.`);
  }

  log("PASS portfolio API and frontend CORS");
  log(`Content counts: ${collections.map((key) => `${key}=${portfolio[key].length}`).join(", ")}; profile=${portfolio.profile ? "present" : "missing"}`);
  log("Read-only deployment checks passed. Upload and contact flows still require the manual steps in DEPLOYMENT.md.");
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runDeploymentSmokeChecks({
    backendUrl: process.env.BACKEND_URL,
    frontendUrl: process.env.FRONTEND_URL,
  }).catch((error) => {
    console.error(`Deployment smoke check failed: ${error.message}`);
    process.exitCode = 1;
  });
}
import { pathToFileURL } from "node:url";

