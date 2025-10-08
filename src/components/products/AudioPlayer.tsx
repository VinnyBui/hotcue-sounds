"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AudioPlayerProps {
  audioUrl: string
  variant?: "overlay" | "inline"
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function AudioPlayer({
  audioUrl,
  variant = "overlay",
  size = "md",
  className
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handleLoadStart = () => {
      setIsLoading(true)
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("loadstart", handleLoadStart)

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("loadstart", handleLoadStart)
    }
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const sizeClasses = {
    sm: "size-8",
    md: "size-10",
    lg: "size-12"
  }

  // Overlay variant - just a play/pause button
  if (variant === "overlay") {
    return (
      <>
        <Button
          onClick={togglePlay}
          variant="ghost"
          size="icon"
          className={cn(
            sizeClasses[size],
            "rounded-full bg-background/80 hover:bg-background/90 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 transition-all",
            className
          )}
          disabled={isLoading}
        >
          {isPlaying ? (
            <Pause className="size-4 md:size-5 fill-current" />
          ) : (
            <Play className="size-4 md:size-5 fill-current" />
          )}
        </Button>
        <audio ref={audioRef} src={audioUrl} />
      </>
    )
  }

  // Inline variant - full controls with progress bar
  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      <div className="flex items-center gap-3">
        <Button
          onClick={togglePlay}
          variant="outline"
          size="icon"
          className="size-10 rounded-full"
          disabled={isLoading}
        >
          {isPlaying ? (
            <Pause className="size-4 fill-current" />
          ) : (
            <Play className="size-4 fill-current" />
          )}
        </Button>

        {/* Progress bar */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="relative h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-primary transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <Button
          onClick={toggleMute}
          variant="ghost"
          size="icon"
          className="size-9"
        >
          {isMuted ? (
            <VolumeX className="size-4" />
          ) : (
            <Volume2 className="size-4" />
          )}
        </Button>
      </div>

      <audio ref={audioRef} src={audioUrl} />
    </div>
  )
}
