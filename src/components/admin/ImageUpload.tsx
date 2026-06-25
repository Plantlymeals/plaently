import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

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

export const ImageUpload = ({ value, onChange, label = "Image", maxSize = 900 }: Props) => {
  const ref = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    setLoading(true);
    try {
      const url = await fileToWebpDataUrl(file, maxSize);
      // Warn if very large (>800KB)
      if (url.length > 800_000) {
        toast.warning("Image is large — consider a smaller source for faster loads");
      }
      onChange(url);
    } catch (e: any) {
      toast.error(e?.message ?? "Could not process image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium">{label}</label>
      <div className="flex items-start gap-3">
        <div className="h-24 w-24 rounded-xl border border-border/60 bg-secondary/30 flex items-center justify-center overflow-hidden shrink-0">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[10px] text-muted-foreground">No image</span>
          )}
        </div>
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full gap-2"
            disabled={loading}
            onClick={() => ref.current?.click()}
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {value ? "Replace image" : "Upload image"}
          </Button>
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
          <p className="text-[10px] text-muted-foreground max-w-[18rem]">
            Auto-resized to {maxSize}px webp. Square images work best.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;