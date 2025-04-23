function canParse(url: string) {
  try {
    return Boolean(URL.canParse?.(url) ?? new URL(url));
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string) {
  url = url.trim();
  if (url.length === 0) return url;

  const hasScheme = url.match(/^https?:\/\//);
  if (!hasScheme) {
    const dotIdx = url.indexOf('.');
    if (dotIdx > 0 && dotIdx < url.length - 1) {
      const tempUrl = `https://${url}`;
      if (canParse(tempUrl)) return tempUrl;
    }
  }

  return url;
}

/**
 * Assume user will input a url, we just need to check if it is valid.
 *
 * For more detail see https://www.ietf.org/rfc/rfc1738.txt
 */
export function isValidUrl(url: string) {
  const hasScheme = url.match(/^https?:\/\//);
  if (!hasScheme) {
    const dotIdx = url.indexOf('.');
    if (dotIdx > 0 && dotIdx < url.length - 1) {
      url = `https://${url}`;
    }
  }

  return canParse(url);
}

// https://en.wikipedia.org/wiki/Top-level_domain
const COMMON_TLDS = new Set([
  'com',
  'org',
  'net',
  'edu',
  'gov',
  'co',
  'io',
  'me',
  'moe',
  'mil',
  'top',
  'dev',
  'xyz',
  'info',
  'cat',
  'ru',
  'de',
  'jp',
  'uk',
  'pro',
]);

function isCommonTLD(url: URL) {
  const tld = url.hostname.split('.').pop();
  if (!tld) {
    return false;
  }
  return COMMON_TLDS.has(tld);
}

/**
 * Assuming the user will input anything, we need to check rigorously.
 */
export function isStrictUrl(str: string) {
  try {
    if (!isValidUrl(str)) {
      return false;
    }

    const url = new URL(normalizeUrl(str));

    return isCommonTLD(url);
  } catch {
    return false;
  }
}

export function isUrlInClipboard(clipboardData: DataTransfer) {
  const url = clipboardData.getData('text/plain');
  return isValidUrl(url);
}

export function getHostName(link: string) {
  try {
    const url = new URL(link);
    return url.hostname || url.pathname;
  } catch {
    return link;
  }
}
