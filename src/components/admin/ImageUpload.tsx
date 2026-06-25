import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Crop as CropIcon, ZoomIn, ZoomOut, RotateCcw, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

interface Props {
  value: string | null | undefined;
  onChange: (dataUrl: string | null) => void;
  label?: string;
  maxSize?: number; // max width/height in px
}

async function fileToWebpDataUrl(file: File, maxSize = 900): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error("Read failed"));
    r.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("Decode failed"));
    i.src = dataUrl;
  });
  const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));
  const w = Math.round(img.width * ratio);
  const h = Math.round(img.height * ratio);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/webp", 0.85);
}

async function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error("Read failed"));
    r.readAsDataURL(file);
  });
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("Decode failed"));
    i.src = src;
  });
}

export const ImageUpload = ({ value, onChange, label = "Image", maxSize = 900 }: Props) => {
  const ref = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorSrc, setEditorSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [imgDims, setImgDims] = useState({ w: 0, h: 0 });
  const [previewOpen, setPreviewOpen] = useState(false);
  const dragging = useRef<{ x: number; y: number } | null>(null);
  const stageSize = 320; // px (square crop area)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    setLoading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const img = await loadImage(dataUrl);
      setImgDims({ w: img.width, h: img.height });
      setEditorSrc(dataUrl);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setEditorOpen(true);
    } catch (e: any) {
      toast.error(e?.message ?? "Could not load image");
    } finally {
      setLoading(false);
    }
  };

  const openEditorForExisting = async () => {
    if (!value) return;
    try {
      const img = await loadImage(value);
      setImgDims({ w: img.width, h: img.height });
      setEditorSrc(value);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setEditorOpen(true);
    } catch {
      toast.error("Could not open image for editing");
    }
  };

  // Base scale: cover the stage with the image at zoom=1
  const baseScale = imgDims.w && imgDims.h ? stageSize / Math.min(imgDims.w, imgDims.h) : 1;
  const renderedW = imgDims.w * baseScale * zoom;
  const renderedH = imgDims.h * baseScale * zoom;

  const clampOffset = (o: { x: number; y: number }) => {
    const maxX = Math.max(0, (renderedW - stageSize) / 2);
    const maxY = Math.max(0, (renderedH - stageSize) / 2);
    return {
      x: Math.max(-maxX, Math.min(maxX, o.x)),
      y: Math.max(-maxY, Math.min(maxY, o.y)),
    };
  };

  useEffect(() => {
    setOffset((o) => clampOffset(o));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, imgDims.w, imgDims.h]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragging.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setOffset(clampOffset({ x: e.clientX - dragging.current.x, y: e.clientY - dragging.current.y }));
  };
  const onPointerUp = () => { dragging.current = null; };

  const applyCrop = async () => {
    if (!editorSrc) return;
    setLoading(true);
    try {
      const img = await loadImage(editorSrc);
      // The visible crop is a stageSize x stageSize square centered on the stage.
      // Convert stage coords back to source-image coords.
      const scale = baseScale * zoom; // source px -> stage px
      // Source center inside the visible stage = image center - offset (in source coords)
      const sCenterX = img.width / 2 - offset.x / scale;
      const sCenterY = img.height / 2 - offset.y / scale;
      const sSize = stageSize / scale;
      const sx = sCenterX - sSize / 2;
      const sy = sCenterY - sSize / 2;

      const out = Math.min(maxSize, Math.round(sSize));
      const canvas = document.createElement("canvas");
      canvas.width = out;
      canvas.height = out;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, out, out);
      const url = canvas.toDataURL("image/webp", 0.85);
      if (url.length > 800_000) {
        toast.warning("Image is large — consider a smaller source for faster loads");
      }
      onChange(url);
      setEditorOpen(false);
      setEditorSrc(null);
    } catch (e: any) {
      toast.error(e?.message ?? "Could not crop image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium">{label}</label>
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => value && setPreviewOpen(true)}
          className="h-24 w-24 rounded-xl border border-border/60 bg-secondary/30 flex items-center justify-center overflow-hidden shrink-0 group relative"
          aria-label={value ? "Preview image" : "No image"}
        >
          {value ? (
            <>
              <img src={value} alt="" className="h-full w-full object-cover" />
              <span className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 text-white text-[10px] font-medium">
                <ZoomIn className="h-4 w-4" />
              </span>
            </>
          ) : (
            <span className="text-[10px] text-muted-foreground">No image</span>
          )}
        </button>
        <div className="flex flex-col gap-2">
          <input
            ref={ref}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full gap-2"
              disabled={loading}
              onClick={() => ref.current?.click()}
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              {value ? "Replace" : "Upload"}
            </Button>
            {value && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full gap-2"
                onClick={openEditorForExisting}
              >
                <CropIcon className="h-3.5 w-3.5" /> Crop / Zoom
              </Button>
            )}
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-full gap-2 text-destructive"
                onClick={() => onChange(null)}
              >
                <X className="h-3.5 w-3.5" /> Remove
              </Button>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground max-w-[18rem]">
            Crop to a square, drag to position, and pinch/scroll to zoom. Saved as webp up to {maxSize}px.
          </p>
        </div>
      </div>

      {/* Preview lightbox */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{label} preview</DialogTitle>
          </DialogHeader>
          {value && (
            <div className="flex items-center justify-center bg-secondary/30 rounded-xl p-4">
              <img src={value} alt="" className="max-h-[70vh] w-auto rounded-lg" />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Crop / zoom editor */}
      <Dialog
        open={editorOpen}
        onOpenChange={(o) => {
          setEditorOpen(o);
          if (!o) setEditorSrc(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CropIcon className="h-4 w-4" /> Adjust {label.toLowerCase()}
            </DialogTitle>
          </DialogHeader>
          {editorSrc && (
            <div className="space-y-4">
              <div
                className="relative mx-auto rounded-xl overflow-hidden bg-muted/40 border border-border/60 touch-none select-none"
                style={{ width: stageSize, height: stageSize, cursor: dragging.current ? "grabbing" : "grab" }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onWheel={(e) => {
                  e.preventDefault();
                  const next = Math.max(1, Math.min(4, zoom + (e.deltaY < 0 ? 0.1 : -0.1)));
                  setZoom(next);
                }}
              >
                <img
                  src={editorSrc}
                  alt=""
                  draggable={false}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: renderedW,
                    height: renderedH,
                    transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
                    maxWidth: "none",
                    pointerEvents: "none",
                  }}
                />
                {/* Crop overlay grid */}
                <div className="pointer-events-none absolute inset-0 ring-1 ring-white/60 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)] rounded-xl" />
              </div>

              <div className="flex items-center gap-3">
                <Button type="button" variant="ghost" size="icon" onClick={() => setZoom((z) => Math.max(1, +(z - 0.1).toFixed(2)))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Slider
                  value={[zoom]}
                  min={1}
                  max={4}
                  step={0.05}
                  onValueChange={(v) => setZoom(v[0])}
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => setZoom((z) => Math.min(4, +(z + 0.1).toFixed(2)))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}
                  title="Reset"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="ghost" className="rounded-full" onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button type="button" className="rounded-full gap-2" disabled={loading} onClick={applyCrop}>
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageUpload;