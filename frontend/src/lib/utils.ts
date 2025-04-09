import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, isBefore } from "date-fns";
import { Link } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


type ExpiryStatus = "active" | "expiring" | "expired";

export const getExpiryStatus = (link: Link): { status: ExpiryStatus; text: string } => {
  if (!link.expiresAt) {
    return {
      status: "active",
      text: ""
    };
  }

  const expiryDate = new Date(link.expiresAt);
  const now = new Date();

  if (expiryDate < now) {
    return {
      status: "expired",
      text: `Expired ${formatDistanceToNow(expiryDate, { addSuffix: true })}`
    };
  }

  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(now.getDate() + 3);

  if (isBefore(expiryDate, threeDaysFromNow)) {
    return {
      status: "expiring",
      text: `Expires ${formatDistanceToNow(expiryDate, { addSuffix: true })}`
    };
  }

  return {
    status: "active",
    text: `Expires ${format(expiryDate, "MMM d, yyyy")}`
  };
};
