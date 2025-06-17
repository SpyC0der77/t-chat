import {
  ArrowLeft,
  Search,
  Plus,
  ChevronRight,
  X,
  Pin,
  Moon,
  Sun,
  Settings2,
  ArrowUp,
  ChevronDown,
  Globe,
  Paperclip,
  LogIn
} from "lucide-react";

export const icons = {
  back: ArrowLeft,
  search: Search,
  newThread: Plus,
  collapse: ChevronRight,
  delete: X,
  pin: Pin,
  moon: Moon,
  sun: Sun,
  settings: Settings2,
  send: ArrowUp,
  models: ChevronDown,
  web: Globe,
  media: Paperclip,
  logIn: LogIn
} as const;

export type IconType = keyof typeof icons;
