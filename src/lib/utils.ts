import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export function formatDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
