import {
  ArrowLeft,
  Search,
  Plus,
  ChevronRight,
  X,
  Pin,
} from "lucide-react";

export const icons = {
  back: ArrowLeft,
  search: Search,
  newThread: Plus,
  collapse: ChevronRight,
  delete: X,
  pin: Pin,
} as const;

export type IconType = keyof typeof icons;
