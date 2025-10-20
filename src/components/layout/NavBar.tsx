"use client"

import { ThemeToggle } from "./ThemeToggle"
import Link from "next/link"
import {
  Sheet,
  SheetTitle,
  SheetDescription,
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
import { ChevronDown, ShoppingCart, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/store/cartStore"
import { CartDrawer } from "@/components/cart"

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const cart = useCartStore(state => state.cart)

  useEffect(() => {
    // Check auth state on mount and when storage changes
    const checkAuthState = () => {
      const token = localStorage.getItem("shopify_access_token")
      setIsLoggedIn(!!token)
    }

    // Check on mount
    checkAuthState()

    // Listen for storage changes (works across tabs/windows)
    window.addEventListener("storage", checkAuthState)

    // Listen for custom auth events (for same-page updates)
    window.addEventListener("authStateChanged", checkAuthState)

    return () => {
      window.removeEventListener("storage", checkAuthState)
      window.removeEventListener("authStateChanged", checkAuthState)
    }
  }, [])

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
                    <ListItem href="/products" title="All Sounds">
                      Browse all sound packs and samples
                    </ListItem>
                    <ListItem href="/collections/house" title="House">
                      House music samples and loops
                    </ListItem>
                    <ListItem href="/collections/techno" title="Techno">
                      Techno drums, loops, and FX
                    </ListItem>
                    <ListItem href="/collections/bass" title="Bass">
                      Bass House and Drum & Bass sounds
                    </ListItem>
                    <ListItem href="/collections/breaks" title="Breaks">
                      Breakbeat, drum breaks, and percussion
                    </ListItem>
                    <ListItem href="/collections/fx" title="FX">
                      Sound effects, risers, impacts, and transitions
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    href="/about"
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium hover:bg-primary"
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
        {/* Cart */}
        <button
          className="p-2 hover:text-primary transition-colors relative"
          onClick={() => setIsCartOpen(true)}
          aria-label="Open shopping cart"
        >
          <ShoppingCart className="h-5 w-5" />
          {cart && cart.totalQuantity > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cart.totalQuantity}
            </span>
          )}
        </button>
        
        {/* Auth Button - Hidden on mobile */}
        {isLoggedIn ? (
          <Link href="/account">
            <Button className="hidden md:block bg-transparent text-foreground border">
              Account
            </Button>
          </Link>
        ) : (
          <Link href="/login">
            <Button className="hidden md:block bg-transparent text-foreground border">
              Login
            </Button>
          </Link>
        )}
        
        {/* Theme Toggle - Hidden on small mobile */}
        <div className="hidden sm:flex">
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
            <SheetDescription className="sr-only">
              Access navigation links and theme settings
            </SheetDescription>
            <div className="flex flex-col space-y-8 mt-8 px-4">
              {/* Mobile Navigation Links */}
              <div className="flex flex-col space-y-3">
                <h2 className="text-lg font-bold">Navigation</h2>

                {/* Sounds Submenu */}
                <div className="flex flex-col space-y-2">
                  <button
                    className="text-sm font-medium flex items-center justify-between hover:text-primary transition-colors"
                    onClick={() => {
                      const submenu = document.getElementById('mobile-sounds-submenu')
                      const chevron = document.getElementById('mobile-sounds-chevron')
                      if (submenu && chevron) {
                        submenu.classList.toggle('hidden')
                        chevron.classList.toggle('rotate-180')
                      }
                    }}
                  >
                    Sounds
                    <ChevronDown id="mobile-sounds-chevron" className="h-4 w-4 transition-transform" />
                  </button>
                  <div id="mobile-sounds-submenu" className="hidden [&:not(.hidden)]:grid grid-cols-1 gap-2 pl-4">
                    <Link
                      href="/products"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      All Sounds
                    </Link>
                    <Link
                      href="/collections/house"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      House
                    </Link>
                    <Link
                      href="/collections/techno"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Techno
                    </Link>
                    <Link
                      href="/collections/bass"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Bass
                    </Link>
                    <Link
                      href="/collections/breaks"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Breaks
                    </Link>
                    <Link
                      href="/collections/fx"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      FX
                    </Link>
                  </div>
                </div>

                <Link
                  href="/about"
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
              </div>

              {/* Centered Divider - 50% width */}
              <div className="flex justify-center">
                <div className="h-px w-1/2 bg-foreground/20" />
              </div>

              {/* Mobile Actions */}
              <div className="flex flex-col space-y-3">
                {/* Auth Button */}
                {isLoggedIn ? (
                  <Link
                    href="/account"
                    className="flex items-center justify-start gap-4 text-sm hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-sm font-medium">Account</span>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center justify-start gap-4 text-sm hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-sm font-medium">Login</span>
                  </Link>
                )}

                {/* Theme Toggle */}
                <div className="flex items-center justify-start gap-4">
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Cart Drawer */}
      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
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