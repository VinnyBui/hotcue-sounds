import ProductCard from "@/components/ProductCard"

export default function HeroSection() {
  return (
    <section className="h-[90vh]">
      <div className="flex h-full justify-center items-center gap-25 products-row">
        <ProductCard image="/images/soundpacks.png" title="Lo-Fi Pack" />
        <ProductCard image="/images/soundpacks.png" title="Samples" />
        <ProductCard image="/images/soundpacks.png" title="Synths" />
        <ProductCard image="/images/soundpacks.png" title="FX" />
        <ProductCard image="/images/soundpacks.png" title="MIDI Packs" />
      </div>
    </section>
  )
}
