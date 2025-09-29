import type { Metadata } from "next"
import NavBar from "@/components/NavBar"
import "@/styles/globals.css"
import { ThemeProviderWrapper } from "@/components/ThemeProviderWrapper"

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
          {children}
        </ThemeProviderWrapper>
      </body>
    </html>
  )
}

