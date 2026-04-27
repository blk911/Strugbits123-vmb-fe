const DEFAULT_BACKEND_ROOT = "http://localhost:5000/";

function ensureTrailingSlash(value) {
  return value.endsWith("/") ? value : `${value}/`;
}

export function buildApiBaseUrl(segment = "") {
  const backendRoot = ensureTrailingSlash(
    import.meta.env.VITE_BACKEND_URL || DEFAULT_BACKEND_ROOT,
  );

  const cleanSegment = segment.replace(/^\/+|\/+$/g, "");
  return cleanSegment ? `${backendRoot}${cleanSegment}` : backendRoot;
}
