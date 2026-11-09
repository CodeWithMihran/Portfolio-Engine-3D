import test from "node:test";
import assert from "node:assert/strict";
import { validateProductionEnv } from "../config/validateProductionEnv.js";

const validProductionEnv = {
  NODE_ENV: "production",
  MONGO_URI: "mongodb+srv://portfolio-user:encoded-password@cluster.example.mongodb.net/portfolio?retryWrites=true&w=majority",
  JWT_SECRET: "a-production-secret-with-more-than-32-characters",
  CLIENT_URL: "https://portfolio.example.com",
  CLOUDINARY_CLOUD_NAME: "portfolio-cloud",
  CLOUDINARY_API_KEY: "1234567890",
  CLOUDINARY_API_SECRET: "cloudinary-secret-value",
};

test("accepts complete production configuration", () => {
  assert.deepEqual(validateProductionEnv(validProductionEnv), { errors: [], warnings: [] });
});

test("does not impose production requirements during local development", () => {
  assert.deepEqual(validateProductionEnv({ NODE_ENV: "development" }), { errors: [], warnings: [] });
});

test("rejects localhost and the wrong MongoDB database", () => {
  const result = validateProductionEnv({
    ...validProductionEnv,
    MONGO_URI: "mongodb://127.0.0.1:27017/test",
  });

  assert.match(result.errors.join(" "), /localhost/);
  assert.match(result.errors.join(" "), /portfolio database/);
});

test("rejects weak JWT secrets and missing frontend origins", () => {
  const result = validateProductionEnv({
    ...validProductionEnv,
    JWT_SECRET: "too-short",
    CLIENT_URL: "",
  });

  assert.match(result.errors.join(" "), /non-placeholder secret of at least 32 characters/);
  assert.match(result.errors.join(" "), /CLIENT_URL/);
});

test("rejects a long placeholder JWT value", () => {
  const result = validateProductionEnv({
    ...validProductionEnv,
    JWT_SECRET: "replace-with-a-long-random-secret-value",
  });

  assert.match(result.errors.join(" "), /non-placeholder secret/);
});

test("warns when persistent media storage credentials are incomplete", () => {
  const env = { ...validProductionEnv };
  delete env.CLOUDINARY_API_SECRET;

  const result = validateProductionEnv(env);

  assert.deepEqual(result.errors, []);
  assert.match(result.warnings.join(" "), /Cloudinary credentials are incomplete/);
});
