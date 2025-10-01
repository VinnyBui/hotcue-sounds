"use client"

import { ThemeToggle } from "./ThemeToggle"
import Link from "next/link"
import {
  Sheet,
  SheetTitle,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { ChevronDown, ShoppingCart, Search, Menu } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="mx-4 md:mx-20 lg:mx-40 mt-4 p-4 flex justify-between items-center bg-transparent">
      {/* Left side: Logo + Desktop Nav */}
      <div className="flex items-center space-x-6">
        <Link href="/" className="text-lg font-bold">
          <h1>Hotcue Sounds</h1>
        </Link>
        
        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Divider */}
          <div className="h-6 w-px bg-foreground/30" />
          
          {/* Navigation Menu */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem >
                <NavigationMenuTrigger>Sounds</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <ListItem href="/sounds/lofi" title="Lo-Fi">
                      Chill beats and atmospheric sounds for laid-back productions
                    </ListItem>
                    <ListItem href="/sounds/synths" title="Synths">
                      Analog and digital synth presets for any genre
                    </ListItem>
                    <ListItem href="/sounds/fx" title="FX">
                      Sound effects, transitions, and audio embellishments
                    </ListItem>
                    <ListItem href="/sounds/midi" title="MIDI Packs">
                      Ready-to-use MIDI patterns and chord progressions
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    href="/about"
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-primary"
                    )}
                  >
                    About
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Search - Hidden on small mobile */}
        <button className="hidden sm:block p-2 hover:text-primary transition-colors">
          <Search className="h-5 w-5" />
        </button>
        
        {/* Cart */}
        <button className="p-2 hover:text-primary transition-colors">
          <ShoppingCart className="h-5 w-5" />
        </button>
        
        {/* Sign Up - Hidden on mobile */}
        <Button className="hidden md:block bg-transparent text-foreground border">
          Sign Up
        </Button>
        
        {/* Theme Toggle - Hidden on small mobile */}
        <div className="hidden sm:block sm:flex">
          <ThemeToggle />
        </div>

        {/* Mobile Menu - Only visible on mobile */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <button className="md:hidden p-2 hover:text-primary transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] sm:w-[350px]">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col space-y-8 mt-8 px-4">
              {/* Mobile Navigation Links */}
              <div className="flex flex-col space-y-3">
                <h2 className="text-lg font-bold">Navigation</h2>
                
              </div>

              {/* Centered Divider - 50% width */}
              <div className="flex justify-center">
                <div className="h-px w-1/2 bg-foreground/20" />
              </div>

              {/* Mobile Actions */}
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-start gap-4">
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}

// ListItem component for navigation menu items
const ListItem = ({ 
  className, 
  title, 
  children, 
  href,
  ...props 
}: {
  className?: string
  title: string
  children: React.ReactNode
  href: string
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/50 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}