const CHUNK_RELOAD_KEY = "__chunk_reload__";
const CHUNK_ERROR_PATTERN =
  /Importing a module script failed|Failed to fetch dynamically imported module|ChunkLoadError|Loading chunk \d+ failed/i;

export const getChunkErrorMessage = (value: unknown): string => {
  if (value instanceof Error) {
    return `${value.name}: ${value.message}`;
  }

  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    const record = value as { name?: unknown; message?: unknown; reason?: unknown };
    return [record.name, record.message, getChunkErrorMessage(record.reason)]
      .filter(Boolean)
      .join(": ");
  }

  return String(value ?? "");
};

export const isChunkLoadError = (value: unknown): boolean =>
  CHUNK_ERROR_PATTERN.test(getChunkErrorMessage(value));

export const reloadOnceForChunkError = (value: unknown): boolean => {
  if (!isChunkLoadError(value) || sessionStorage.getItem(CHUNK_RELOAD_KEY)) {
    return false;
  }

  sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
  window.location.reload();
  return true;
};

export const clearChunkReloadGuard = () => {
  sessionStorage.removeItem(CHUNK_RELOAD_KEY);
};