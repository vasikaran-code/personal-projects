import { IconType } from "react-icons";
import { LuBaby, LuCake, LuGem, LuHeart, LuSparkles, LuWine } from "react-icons/lu";

export interface EventTypeOption {
  value: string;
  label: string;
  icon: IconType;
}

export interface PackageOption {
  value: string;
  label: string;
  range: string;
}

// Values match what the booking API already stores for `event_type`.
export const EVENT_TYPES: EventTypeOption[] = [
  { value: "Marriage", label: "Marriage", icon: LuHeart },
  { value: "Reception", label: "Reception", icon: LuWine },
  { value: "Engagement", label: "Engagement", icon: LuGem },
  { value: "Birthday", label: "Birthday", icon: LuCake },
  { value: "Babyshower", label: "Baby shower", icon: LuBaby },
  { value: "others", label: "Other rituals", icon: LuSparkles },
];

// Values match what the booking API already stores for `level`.
export const PACKAGES: PackageOption[] = [
  { value: "SILVER", label: "Silver", range: "₹50k – 80k" },
  { value: "GOLD", label: "Gold", range: "₹80k – 120k" },
  { value: "PLATINUM", label: "Platinum", range: "₹120k – 200k" },
  { value: "DIAMOND", label: "Diamond", range: "₹200k & above" },
];

// Occasions whose banner can use the venue ceremony photograph.
export const CEREMONY_TYPES = ["Marriage", "Reception", "Engagement"];

export const findEventType = (value?: string): EventTypeOption => {
  const match = EVENT_TYPES.find((t) => t.value.toLowerCase() === (value ?? "").toLowerCase());
  return match ?? { value: value ?? "", label: value || "Event", icon: LuSparkles };
};

export const findPackage = (value?: string): PackageOption | undefined =>
  PACKAGES.find((p) => p.value === (value ?? "").toUpperCase());
