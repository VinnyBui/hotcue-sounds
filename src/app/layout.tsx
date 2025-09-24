import type { Metadata } from "next"
import "./globals.css"

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
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen flex flex-col">
          {/* Header placeholder */}
          <main className="flex-grow">{children}</main>
          {/* Footer placeholder */}
          <footer className="p-4 border-t text-sm">
            © {new Date().getFullYear()} HotCue Sounds
          </footer>
        </div>
      </body>
    </html>
  )
}
