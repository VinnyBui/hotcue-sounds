import type { Metadata } from "next"
import { NavBar, Footer } from "@/components/layout"
import "@/styles/globals.css"
import { ThemeProviderWrapper } from "@/components/providers"

export const metadata: Metadata = {
  title: "HotCue Sounds",
  description: "Discover and shop custom DJ sounds, samples, and tools.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground transition-all duration-300">
        <ThemeProviderWrapper>
          <NavBar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProviderWrapper>
      </body>
    </html>
  )
}

