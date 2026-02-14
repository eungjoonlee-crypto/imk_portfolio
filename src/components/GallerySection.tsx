import { motion } from "framer-motion";
import { useMemo } from "react";
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

// Fisher-Yates 셔플 알고리즘을 사용한 랜덤 정렬 함수
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]; // 원본 배열을 변경하지 않기 위해 복사
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const GallerySection = () => {
  const { data: artworks, isLoading, error } = usePublishedArtworks();

  // Use database artworks if available, otherwise use fallback
  // useMemo를 사용하여 컴포넌트가 마운트될 때마다 랜덤하게 섞음
  const displayArtworks = useMemo(() => {
    const baseArtworks = artworks && artworks.length > 0
      ? artworks.map((artwork) => ({
          id: artwork.id,
          image: getImageUrl(artwork.image_path),
          title: artwork.title,
          year: artwork.year || "",
          medium: artwork.description || "Acrylic on canvas",
        }))
      : fallbackArtworks;
    
    // 새로고침할 때마다 다른 순서로 보이도록 랜덤하게 섞기
    return shuffleArray(baseArtworks);
  }, [artworks]); // artworks가 변경될 때만 재계산

  return (
    <section id="gallery" className="py-[126px] px-8 md:px-16 lg:px-24">
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
      </div>
    </section>
  );
};

export default GallerySection;
