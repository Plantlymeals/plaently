import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { clearChunkReloadGuard, reloadOnceForChunkError } from "@/lib/chunkReload";

// Recover from stale chunk errors after a new deploy by reloading once.
window.addEventListener("error", (e) => reloadOnceForChunkError(e.error || e.message));
window.addEventListener("unhandledrejection", (e) =>
  reloadOnceForChunkError(e.reason)
);

// Clear the reload guard once the app has successfully mounted, so a future
// stale-chunk error (after the next deploy) can also trigger a one-shot reload.
window.addEventListener("load", () => {
  setTimeout(clearChunkReloadGuard, 2000);
});

createRoot(document.getElementById("root")!).render(<App />);
