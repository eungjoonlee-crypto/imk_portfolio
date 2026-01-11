import { motion } from "framer-motion";
import ArtworkCard from "./ArtworkCard";
import { usePublishedArtworks, getImageUrl } from "@/hooks/useArtworks";

// Fallback images for when database is empty
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import artwork4 from "@/assets/artwork-4.jpg";
import artwork5 from "@/assets/artwork-5.jpg";
import artwork6 from "@/assets/artwork-6.jpg";

const fallbackArtworks = [
  { id: "1", image: artwork1, title: "Phoenix Rising", year: "2024", medium: "Acrylic on canvas" },
  { id: "2", image: artwork2, title: "Ocean Depths", year: "2024", medium: "Acrylic on canvas" },
  { id: "3", image: artwork3, title: "Sunset Boulevard", year: "2023", medium: "Acrylic on canvas" },
  { id: "4", image: artwork4, title: "Midnight Gold", year: "2023", medium: "Acrylic on canvas" },
  { id: "5", image: artwork5, title: "Earth & Light", year: "2023", medium: "Acrylic on canvas" },
  { id: "6", image: artwork6, title: "Verdant Spiral", year: "2024", medium: "Acrylic on canvas" },
];

const GallerySection = () => {
  const { data: artworks, isLoading, error } = usePublishedArtworks();

  // Use database artworks if available, otherwise use fallback
  const displayArtworks = artworks && artworks.length > 0
    ? artworks.map((artwork) => ({
        id: artwork.id,
        image: getImageUrl(artwork.image_path),
        title: artwork.title,
        year: artwork.year || "",
        medium: artwork.description || "Acrylic on canvas",
      }))
    : fallbackArtworks;

  return (
    <section id="gallery" className="py-32 px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-primary" />
            <span className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
              The Collection
            </span>
          </div>
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground">
            Featured Works
          </h2>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">갤러리를 불러오는 중 오류가 발생했습니다.</p>
          </div>
        )}

        {/* Artwork masonry grid */}
        {!isLoading && !error && (
          <div className="columns-1 md:columns-2 lg:columns-3" style={{ columnGap: '2rem' }}>
            {displayArtworks.map((artwork, index) => (
              <ArtworkCard key={artwork.id} {...artwork} index={index} />
            ))}
          </div>
        )}

        {/* View more button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-20"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 rounded-full border border-border text-foreground font-medium hover:bg-secondary/50 transition-colors"
          >
            View Full Collection
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;
