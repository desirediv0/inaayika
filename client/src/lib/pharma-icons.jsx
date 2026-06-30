// Shared jewellery category icon mapping
// Used by CategoriesCarousel, CategoryGrid, and page layouts

import {
  Sparkles,
  Scissors,
  Crown,
  Heart,
  Gift,
  Gem,
  Award,
  Wrench,
  Package,
} from "lucide-react";

// Map: keyword → { icon component, color }
export const PHARMA_ICON_MAP = [
  { keys: ["hair", "accessories", "headband", "clip"], Icon: Crown, color: "#D4AF37" },
  { keys: ["diy", "kit", "craft"], Icon: Wrench, color: "#003E29" },
  { keys: ["necklace", "pendant", "chain"], Icon: Gem, color: "#D4AF37" },
  { keys: ["earrings", "jhumka", "studs"], Icon: Sparkles, color: "#003E29" },
  { keys: ["ring", "bands"], Icon: Heart, color: "#D4AF37" },
  { keys: ["bracelets", "bangles"], Icon: Gift, color: "#003E29" },
  { keys: ["custom", "bespoke", "founder"], Icon: Award, color: "#D4AF37" },
  { keys: ["box", "gift", "packaging"], Icon: Package, color: "#003E29" },
];

export function getPharmaIcon(name = "", slug = "") {
  const n = name.toLowerCase();
  const s = slug.toLowerCase();
  for (const entry of PHARMA_ICON_MAP) {
    if (entry.keys.some((k) => n.includes(k) || s.includes(k))) {
      return entry;
    }
  }
  // Default fallback icon for jewellery
  return { Icon: Sparkles, color: "#003E29" };
}
