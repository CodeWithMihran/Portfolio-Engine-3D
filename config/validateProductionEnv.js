const cloudinaryKeys = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

export function validateProductionEnv(env = process.env) {
  if (env.NODE_ENV !== "production") {
    return { errors: [], warnings: [] };
  }

  const errors = [];
  const warnings = [];
  const mongoUri = env.MONGO_URI?.trim();
  const jwtSecret = env.JWT_SECRET?.trim();
  const origins = [env.CLIENT_URL, ...(env.CLIENT_URLS || "").split(",")]
    .map((origin) => origin?.trim())
    .filter(Boolean);

  if (!mongoUri) {
    errors.push("MONGO_URI is required.");
  } else {
    try {
      const parsedUri = new URL(mongoUri);
      if (!["mongodb:", "mongodb+srv:"].includes(parsedUri.protocol)) {
        errors.push("MONGO_URI must use mongodb:// or mongodb+srv://.");
      }
      if (["localhost", "127.0.0.1", "::1"].includes(parsedUri.hostname)) {
        errors.push("MONGO_URI must point to the remote production database, not localhost.");
      }
      if (parsedUri.pathname.replace(/^\/+|\/+$/g, "") !== "portfolio") {
        errors.push("MONGO_URI must target the portfolio database using the /portfolio path.");
      }
    } catch {
      errors.push("MONGO_URI is not a valid MongoDB connection URL.");
    }
  }

  const jwtLooksLikePlaceholder = /^(replace|change[-_ ]?me|your|example|placeholder)/i.test(jwtSecret || "");
  if (!jwtSecret || jwtSecret.length < 32 || jwtLooksLikePlaceholder) {
    errors.push("JWT_SECRET must be a non-placeholder secret of at least 32 characters in production.");
  }

  if (!origins.length) {
    errors.push("Set CLIENT_URL or CLIENT_URLS to the deployed frontend origin.");
  } else {
    for (const origin of origins) {
      try {
        const parsedOrigin = new URL(origin);
        if (parsedOrigin.protocol !== "https:" || parsedOrigin.pathname !== "/") {
          errors.push("Production client origins must be HTTPS origins without a path.");
          break;
        }
      } catch {
        errors.push("A configured client origin is not a valid URL.");
        break;
      }
    }
  }

  const configuredCloudinaryKeys = cloudinaryKeys.filter((key) => env[key]?.trim()).length;
  if (configuredCloudinaryKeys !== cloudinaryKeys.length) {
    warnings.push("Cloudinary credentials are incomplete; production uploads will not be available.");
  }

  return { errors, warnings };
}
