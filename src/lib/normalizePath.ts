/** Strips query/hash and trailing slashes so canonical URLs stay unique. */
export const normalizePath = (path: string): string => {
  if (!path) return "/";
  const [clean] = path.split(/[?#]/);
  const trimmed = (clean ?? "").replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
};
