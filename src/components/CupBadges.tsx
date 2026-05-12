import { Flame, Dumbbell, Leaf } from "lucide-react";
import type { CupMeta } from "@/lib/productImages";

interface Props {
  meta: CupMeta;
  size?: "sm" | "md";
}

export const CupBadges = ({ meta, size = "sm" }: Props) => {
  const px = size === "md" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[10px]";
  const icon = size === "md" ? "h-3.5 w-3.5" : "h-3 w-3";
  return (
    <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1.5 z-10 pointer-events-none">
      <span className={`inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur text-foreground font-semibold shadow-sm ${px}`}>
        <Dumbbell className={icon} /> {meta.protein}g
      </span>
      <span className={`inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur text-foreground font-semibold shadow-sm ${px}`}>
        <Flame className={icon} /> {meta.kcal} kcal
      </span>
      {meta.vegan && (
        <span className={`inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground font-semibold shadow-sm ${px}`}>
          <Leaf className={icon} /> Vegan
        </span>
      )}
    </div>
  );
};

export default CupBadges;
