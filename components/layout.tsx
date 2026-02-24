"use client"

import { type ReactNode, useState } from "react"
import React from "react"
import { MessageCircle, ChevronDown, Menu, LogOut, Link2, User, Package, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { NAVIGATION_ITEMS, DROPDOWN_ITEMS, SITE_NAME } from "@/lib/constants"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Chat } from "@/components/chat"
import { logout } from "@/app/actions/auth"

export function Layout({ children, userId, userName }: { children: ReactNode; userId: string; userName: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/landing")
  }

  const handleNavigation = (href: string) => {
    router.push(href)
    setIsOpen(false)
  }

  const toggleChat = () => setIsChatOpen(!isChatOpen)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-[#038E7D]/20 bg-[#F0FFF9] shadow-sm">
        <div className="container flex h-20 items-center justify-between px-1 sm:px-2">
          <span className="text-2xl font-normal text-[#038E7D] pl-4">Talaritel</span>
          <Link href="/" className="absolute left-[51%] transform -translate-x-1/2">
            <div className="relative w-[55px] h-[55px]">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Talarite%20new%20logo-02-LqLwTaQj77YS1jGv22EJZL2OuBuXAB.png"
                alt={SITE_NAME}
                fill
                sizes="(max-width: 768px) 55px, 55px"
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-1 text-[#038E7D] hover:text-[#025E52] bg-white"
                  >
                    Menu
                    <ChevronDown className="h-4 w-4 text-[#038E7D]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background border-primary/10">
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="flex items-center gap-2 text-foreground hover:text-accent">
                      <User className="h-4 w-4 text-primary" />
                      <div className="flex flex-col">
                        <span>{userName}</span>
                        <span className="text-xs text-muted-foreground">ID: {userId}</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-primary/10" />
                  {DROPDOWN_ITEMS.map((item, index) => (
                    <React.Fragment key={item.name}>
                      <DropdownMenuItem asChild>
                        <Link href={item.href} className="flex items-center gap-2 text-foreground hover:text-accent">
                          <item.icon className="h-4 w-4 text-primary" />
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    </React.Fragment>
                  ))}
                  <DropdownMenuSeparator className="bg-primary/10" />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#038E7D] hover:text-[#025E52] hover:bg-[#E0FFF5] transition-colors duration-200 md:hidden"
                    onClick={() => setIsOpen(true)}
                  >
                    <Menu className="h-5 w-5 text-[#038E7D]" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="text-left text-primary">{SITE_NAME}</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 mt-4">
                    <Button
                      variant="ghost"
                      className="flex items-center justify-start gap-2 text-lg text-foreground hover:text-primary"
                      onClick={() => handleNavigation("/account")}
                    >
                      <User className="h-5 w-5 text-primary" />
                      <div className="flex flex-col items-start">
                        <span>{userName}</span>
                        <span className="text-xs text-muted-foreground">ID: {userId}</span>
                      </div>
                    </Button>
                    <Separator className="my-2" />
                    {DROPDOWN_ITEMS.map((item) => (
                      <Button
                        key={item.name}
                        variant="ghost"
                        className="flex items-center justify-start gap-2 text-lg text-foreground hover:text-primary"
                        onClick={() => handleNavigation(item.href)}
                      >
                        <item.icon className="h-5 w-5 text-primary" />
                        {item.name}
                      </Button>
                    ))}
                    <Separator className="my-2" />
                    <Button variant="ghost" onClick={handleLogout} className="justify-start px-0">
                      <LogOut className="mr-2 h-5 w-5 text-primary" />
                      <span>Log out</span>
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-background px-1 sm:px-2">
        <div className="max-w-full mx-auto">{children}</div>
      </main>

      <div className="fixed bottom-0 left-0 z-50 w-full border-t border-[#038E7D]/20 bg-[#F0FFF9] pt-4">
        <nav className="container flex h-16 px-1 sm:px-2">
          {NAVIGATION_ITEMS.map((item) => {
            const IconComponent = item.icon
            const isActive = pathname === item.href
            return (
              <Button
                key={item.href}
                variant="ghost"
                className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${
                  isActive ? "text-[#038E7D]" : "text-[#025E52]/70 hover:text-[#038E7D]"
                } ${item.name === "Dial Pad" ? "order-0 md:order-none" : ""}`}
                onClick={() => handleNavigation(item.href)}
              >
                <div
                  className={`p-2 rounded-full transition-colors ${
                    isActive ? "bg-[#038E7D]/10" : "hover:bg-[#038E7D]/5"
                  }`}
                >
                  {item.name === "Dial Pad" ? (
                    <Phone
                      className={`h-5 w-5 ${
                        isActive ? "text-[#038E7D]" : "text-[#025E52]/70 group-hover:text-[#038E7D]"
                      }`}
                    />
                  ) : item.name === "Plans" ? (
                    <Package
                      className={`h-5 w-5 ${
                        isActive ? "text-[#038E7D]" : "text-[#025E52]/70 group-hover:text-[#038E7D]"
                      }`}
                    />
                  ) : (
                    <IconComponent
                      className={`h-5 w-5 ${
                        isActive ? "text-[#038E7D]" : "text-[#025E52]/70 group-hover:text-[#038E7D]"
                      }`}
                    />
                  )}
                </div>
                <span className="text-xs">{item.name === "Dial Pad" ? "Call" : item.name}</span>
              </Button>
            )
          })}
        </nav>
      </div>

      <Button
        size="icon"
        className="fixed bottom-20 right-4 h-12 w-12 rounded-full shadow-lg bg-[#038E7D] hover:bg-[#025E52] text-white"
        onClick={toggleChat}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Customer support</span>
      </Button>
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[#038E7D]">Chat with Customer Support</DialogTitle>
          </DialogHeader>
          <Chat />
        </DialogContent>
      </Dialog>
      <footer className="mt-auto py-4 bg-[#F0FFF9] border-t border-[#038E7D]/20">
        <div className="container flex justify-between items-center px-1 sm:px-2">
          <p className="text-sm text-[#025E52]">© 2023 TalariTel. All rights reserved.</p>
          <Link href="/legal" className="text-sm text-[#038E7D] hover:text-[#025E52] flex items-center">
            <Link2 className="h-4 w-4 mr-1" />
            Legal & Terms
          </Link>
        </div>
      </footer>
    </div>
  )
}
