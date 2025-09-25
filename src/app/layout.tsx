import type { Metadata } from "next"
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
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col">
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  )
}

