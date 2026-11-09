import test from "node:test";
import assert from "node:assert/strict";
import { runDeploymentSmokeChecks } from "../scripts/smoke-deploy.js";

const urls = {
  backendUrl: "https://backend.example.com",
  frontendUrl: "https://portfolio.example.com",
};

const fakeFetch = ({ health = {}, corsOrigin = "https://portfolio.example.com", portfolio = {} } = {}) =>
  async (input, options = {}) => {
    const url = new URL(input);

    if (url.pathname === "/health") {
      return new Response(JSON.stringify(health), {
        status: health.status === "ready" ? 200 : 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.pathname === "/api/portfolio") {
      return new Response(JSON.stringify(portfolio), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": corsOrigin,
        },
      });
    }

    return new Response("<!doctype html><html></html>", {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  };

const readyHealth = {
  status: "ready",
  database: "connected",
  mediaStorage: "cloudinary-configured",
};
const emptyPortfolio = {
  profile: null,
  projects: [],
  skills: [],
  experience: [],
  education: [],
  certificates: [],
  achievements: [],
};

test("passes all read-only deployment checks when services are healthy", async () => {
  const messages = [];

  await runDeploymentSmokeChecks({
    ...urls,
    fetchImpl: fakeFetch({ health: readyHealth, portfolio: emptyPortfolio }),
    log: (message) => messages.push(message),
  });

  assert.equal(messages.filter((message) => message.startsWith("PASS")).length, 4);
  assert.match(messages.join("\n"), /projects=0/);
});

test("fails when persistent media storage is not configured", async () => {
  await assert.rejects(
    runDeploymentSmokeChecks({
      ...urls,
      fetchImpl: fakeFetch({
        health: { ...readyHealth, mediaStorage: "not-configured" },
        portfolio: emptyPortfolio,
      }),
      log: () => {},
    }),
    /Persistent media storage is not configured/
  );
});

test("fails when the deployed API does not allow the frontend origin", async () => {
  await assert.rejects(
    runDeploymentSmokeChecks({
      ...urls,
      fetchImpl: fakeFetch({ health: readyHealth, corsOrigin: "https://other.example.com", portfolio: emptyPortfolio }),
      log: () => {},
    }),
    /CORS did not allow the configured frontend origin/
  );
});
