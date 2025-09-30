"use client"

import { ThemeToggle } from "./ThemeToggle"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, ShoppingCart, Search } from "lucide-react"
import { Button } from "./ui/button"

export default function NavBar() {
  return (
    <nav className="mx-40 mt-4 p-4 flex justify-between items-center bg-transparent">
      {/* Left side: Logo + Divider + Nav */}
      <div className="flex items-center space-x-6">
        <Link href="/" className="text-lg font-bold">
          <h1>Hotcue Sounds</h1>
        </Link>
        {/* Divider */}
        <div className="h-6 w-px bg-foreground/30" />
        {/* Sounds dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center text-sm font-medium hover:text-primary transition-colors">
            Sounds
            <ChevronDown className="ml-1 h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href="/sounds/lofi">Lo-Fi</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/sounds/synths">Synths</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/sounds/fx">FX</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/sounds/midi">MIDI Packs</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <NavItem href="/about" label="About" />
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <button className="p-2 hover:text-primary transition-colors">
          <Search className="h-5 w-5" />
        </button>
        {/* Cart */}
        <button className="p-2 hover:text-primary transition-colors">
          <ShoppingCart className="h-5 w-5" />
        </button>
        <Button className="bg-transparent text-foreground border">Sign Up</Button>
        <ThemeToggle />
      </div>
    </nav>
  )
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium hover:text-primary transition-colors"
    >
      {label}
    </Link>
  )
}
