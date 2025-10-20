"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

export function ThemeProviderWrapper({ children }: { children: ReactNode }) {
  const initializeCart = useCartStore(state => state.initializeCart);

  useEffect(() => {
    // Initialize cart on app load (restore from localStorage)
    initializeCart();
  }, [initializeCart]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
