import {
  ArrowLeft
} from "lucide-react";

export const icons = {
  back: ArrowLeft
} as const;

export type IconType = keyof typeof icons;
