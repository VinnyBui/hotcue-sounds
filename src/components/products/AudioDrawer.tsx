"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import AudioPlayer from "./AudioPlayer"
import { cn } from "@/lib/utils"

interface AudioDrawerProps {
  audioUrl: string
  productTitle: string
  variant?: "detail" | "grid"
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function AudioDrawer({
  audioUrl,
  productTitle,
  variant = "detail",
  size = "lg",
  className
}: AudioDrawerProps) {
  const [open, setOpen] = useState(false)

  const sizeClasses = {
    sm: "size-8",
    md: "size-10",
    lg: "size-12"
  }

  // Grid variant - shows on hover overlay
  if (variant === "grid") {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              sizeClasses[size],
              "rounded-full bg-background/80 hover:bg-background/90 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 transition-all",
              className
            )}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <Play className="size-4 md:size-5 fill-current" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{productTitle}</DrawerTitle>
            <DrawerDescription>Audio Preview</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6">
            <AudioPlayer audioUrl={audioUrl} variant="inline" />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  // Detail variant - white button below the spinning record
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            sizeClasses[size],
            "rounded-full bg-background border-2 border-border hover:border-primary/40 transition-all",
            className
          )}
        >
          <Play className="size-5 md:size-6 fill-current" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{productTitle}</DrawerTitle>
          <DrawerDescription>Audio Preview</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-6">
          <AudioPlayer audioUrl={audioUrl} variant="inline" />
        </div>
        {/* <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter> */}
      </DrawerContent>
    </Drawer>
  )
}
