export function resolveMediaUrl(value, fallback = '') {
  if (!value) {
    return fallback;
  }

  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:')) {
    return value;
  }

  if (value.startsWith('/')) {
    return value;
  }

  return `/${value.replace(/^\/+/, '')}`;
}

export function createSkillIconFallback(label = 'Skill') {
  const safe = label.slice(0, 12).toUpperCase();
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
      <rect width="100%" height="100%" rx="42" fill="#0f172a"/>
      <rect x="10" y="10" width="236" height="236" rx="36" fill="none" stroke="#8b5cf6" stroke-width="8"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#e2e8f0" font-family="Arial, sans-serif" font-size="34" font-weight="700">${safe}</text>
    </svg>`
  )}`;
}
