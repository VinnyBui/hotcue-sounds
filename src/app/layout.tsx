import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import "@/styles/globals.css"

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
        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

