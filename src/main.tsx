import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Recover from stale chunk errors after a new deploy by reloading once.
const RELOAD_KEY = "__chunk_reload__";
const handleChunkError = (msg: string) => {
  if (
    /Importing a module script failed|Failed to fetch dynamically imported module|ChunkLoadError/i.test(
      msg
    ) &&
    !sessionStorage.getItem(RELOAD_KEY)
  ) {
    sessionStorage.setItem(RELOAD_KEY, "1");
    window.location.reload();
  }
};
window.addEventListener("error", (e) => handleChunkError(e.message || ""));
window.addEventListener("unhandledrejection", (e) =>
  handleChunkError(String((e.reason as Error)?.message || e.reason || ""))
);

createRoot(document.getElementById("root")!).render(<App />);
