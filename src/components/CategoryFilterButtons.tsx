"use client"

import { Button } from "@/components/ui/button"

export interface Category {
  label: string
  handle: string | null // null = "All" category
}

interface CategoryFilterButtonsProps {
  categories: Category[]
  activeCategory: string | null
  onCategoryChange: (handle: string | null) => void
}

export default function CategoryFilterButtons({
  categories,
  activeCategory,
  onCategoryChange
}: CategoryFilterButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start mb-8">
      {categories.map((category) => (
        <Button
          key={category.handle || 'all'}
          variant={activeCategory === category.handle ? "default" : "outline"}
          onClick={() => onCategoryChange(category.handle)}
          className="px-4 py-2 text-sm md:text-base"
        >
          {category.label}
        </Button>
      ))}
    </div>
  )
}
