import { Home, Phone, Wallet, SendHorizontal, User, HelpCircle, Settings, Gift, FileText } from "lucide-react"
import { NineDotsIcon } from "@/components/icons/nine-dots-icon"

export const SITE_NAME = "TalariTel"

export const NAVIGATION_ITEMS = [
  { name: "Home", href: "/", icon: Home },
  { name: "Plans", href: "/plans", icon: Phone },
  { name: "Dial Pad", href: "/call", icon: NineDotsIcon },
  { name: "Send Money", href: "/send-money", icon: SendHorizontal },
  { name: "Top-Up", href: "/top-up", icon: Wallet },
] as const

export const DROPDOWN_ITEMS = [
  { name: "Rewards", href: "/rewards", icon: Gift },
  { name: "Billing", href: "/billing", icon: FileText },
  { name: "Help & Support", href: "/support", icon: HelpCircle },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Legal & Terms", href: "/legal", icon: FileText },
] as const

export const LANGUAGES = [
  { name: "English", code: "en" },
  { name: "አማርኛ", code: "am" },
] as const
