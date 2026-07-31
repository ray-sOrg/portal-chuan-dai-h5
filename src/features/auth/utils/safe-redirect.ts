const REDIRECT_ORIGIN = "https://local.invalid";

export function getSafeRedirectPath(
  value: unknown,
  fallback = "/profile"
): string {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return fallback;
  }

  try {
    const url = new URL(value, REDIRECT_ORIGIN);
    if (url.origin !== REDIRECT_ORIGIN) {
      return fallback;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
