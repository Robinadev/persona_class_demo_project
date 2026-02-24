import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SITE_NAME } from "@/lib/constants"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#038E7D] to-[#025E52] text-white">
      <main className="text-center px-4 sm:px-6 lg:px-8">
        <div className="mb-8 relative w-[300px] h-[300px] mx-auto bg-white rounded-full flex items-center justify-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Talarite%20new%20logo-02-LqLwTaQj77YS1jGv22EJZL2OuBuXAB.png"
            alt={SITE_NAME}
            width={200}
            height={200}
            className="object-contain"
          />
        </div>
        <h1 className="mb-4 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">Talaritel</h1>
        <p className="mb-8 text-xl sm:text-2xl text-green-100">Connect with Ethiopia seamlessly</p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="w-full sm:w-auto bg-[#038E7D] hover:bg-[#025E52] text-white"
          >
            <Link href="/signup" className="inline-flex items-center">
              Create Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-[#04C3AA] text-[#04C3AA] hover:bg-[#04C3AA] hover:text-white"
          >
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </main>
      <footer className="absolute bottom-4 text-sm text-green-100">
        &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
      </footer>
    </div>
  )
}
