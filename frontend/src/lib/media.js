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

export function createMonogramFallback(
  label = 'Portfolio',
  {
    subtitle = '',
    background = ['#0b1220', '#15324d'],
    accent = '#67e8f9',
    text = '#f8fafc',
    size = 640,
  } = {}
) {
  const initials =
    label
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() || '')
      .join('') || label.slice(0, 2).toUpperCase();
  const safeSubtitle = subtitle.toUpperCase().slice(0, 26);

  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${background[0]}"/>
          <stop offset="100%" stop-color="${background[1]}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" rx="${Math.round(size * 0.1)}" fill="url(#bg)"/>
      <circle cx="${size * 0.82}" cy="${size * 0.2}" r="${size * 0.12}" fill="${accent}" opacity="0.14"/>
      <circle cx="${size * 0.14}" cy="${size * 0.84}" r="${size * 0.17}" fill="${accent}" opacity="0.1"/>
      <rect x="${size * 0.08}" y="${size * 0.08}" width="${size * 0.84}" height="${size * 0.84}" rx="${Math.round(size * 0.08)}" fill="none" stroke="${accent}" stroke-width="${Math.max(5, size * 0.01)}" opacity="0.65"/>
      <text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" fill="${text}" font-family="Arial, sans-serif" font-size="${Math.round(size * 0.22)}" font-weight="700">${initials}</text>
      <text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle" fill="${accent}" font-family="Arial, sans-serif" font-size="${Math.round(size * 0.05)}" font-weight="700" letter-spacing="${Math.round(size * 0.008)}">${safeSubtitle}</text>
    </svg>`
  )}`;
}

export function createSkillIconFallback(label = 'Skill') {
  return createMonogramFallback(label, {
    subtitle: 'Skill',
    background: ['#0f172a', '#172554'],
    accent: '#8b5cf6',
    text: '#e2e8f0',
    size: 256,
  });
}

export function createProjectImageFallback(label = 'Project') {
  return createMonogramFallback(label, {
    subtitle: 'Case Study',
    background: ['#0b1220', '#12314a'],
    accent: '#22d3ee',
    text: '#f8fafc',
    size: 1200,
  });
}

export function createLogoFallback(label = 'Brand', tone = 'cyan') {
  const palette = {
    cyan: { background: ['#0b1220', '#15324d'], accent: '#67e8f9' },
    sky: { background: ['#0c1425', '#1d4063'], accent: '#7dd3fc' },
    orange: { background: ['#1a1320', '#4d2918'], accent: '#fdba74' },
    emerald: { background: ['#0c1b1c', '#17403d'], accent: '#6ee7b7' },
  };
  const choice = palette[tone] || palette.cyan;

  return createMonogramFallback(label, {
    subtitle: 'Identity',
    background: choice.background,
    accent: choice.accent,
    text: '#f8fafc',
    size: 512,
  });
}
