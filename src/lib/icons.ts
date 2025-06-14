import {
  ArrowLeft,
  Search
} from "lucide-react";

export const icons = {
  back: ArrowLeft,
  search: Search
} as const;

export type IconType = keyof typeof icons;
