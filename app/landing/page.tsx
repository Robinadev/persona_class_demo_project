import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Globe, Zap, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SITE_NAME } from "@/lib/constants"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32">
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent rounded-full opacity-20 blur-xl" />
              <div className="relative bg-white rounded-full flex items-center justify-center border-4 border-primary/20 shadow-lg">
                {/* Use standard img for preview compatibility */}
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Talarite%20new%20logo-02-LqLwTaQj77YS1jGv22EJZL2OuBuXAB.png"
                  alt={SITE_NAME}
                  width={100}
                  height={100}
                  className="object-contain p-2"
                  style={{ display: 'block' }}
                />
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
              Talaritel
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium">
              Connect Globally, Root in Ethiopia
            </p>
          </div>

          {/* Description */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience seamless international communication with Ethiopian pride. Fast, reliable, and culturally connected telecom services for modern Africa.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 text-white shadow-lg font-semibold"
            >
              <Link href="/create-account" className="inline-flex items-center gap-2">
                Create Account
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-green-600 text-green-700 hover:bg-green-50 font-semibold"
            >
              <Link href="/login">Log In</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Global Reach</h3>
              <p className="text-muted-foreground">
                Connect with anyone, anywhere in the world with affordable rates
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Zap className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Crystal clear calls and instant messaging powered by latest technology
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Secure & Trusted</h3>
              <p className="text-muted-foreground">
                Bank-grade encryption keeping your conversations private and safe
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto text-center space-y-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-8 sm:p-12 rounded-2xl border border-primary/20">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to Connect?</h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of Ethiopians and Africans worldwide enjoying premium communication
          </p>
          <Button
            asChild
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Link href="/signup">Start Free Today</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 sm:px-6 lg:px-8 py-8 mt-auto">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {SITE_NAME}. Connecting Africa to the World.</p>
        </div>
      </footer>
    </div>
  )
}
