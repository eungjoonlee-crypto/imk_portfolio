import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import ArtworkCard from "./ArtworkCard";
import { ArtworkViewer, type GalleryArtwork } from "./ArtworkViewer";
import { usePublishedArtworks, getArtworkImageSrc } from "@/hooks/useArtworks";
import { useColumnCount } from "@/hooks/use-column-count";

// Fallback images for when database is empty
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import artwork4 from "@/assets/artwork-4.jpg";
import artwork5 from "@/assets/artwork-5.jpg";
import artwork6 from "@/assets/artwork-6.jpg";

const fallbackArtworks: GalleryArtwork[] = [
  { id: "1", image: artwork1, title: "Phoenix Rising", year: "2024", medium: "Acrylic on canvas", body: null },
  { id: "2", image: artwork2, title: "Ocean Depths", year: "2024", medium: "Acrylic on canvas", body: null },
  { id: "3", image: artwork3, title: "Sunset Boulevard", year: "2023", medium: "Acrylic on canvas", body: null },
  { id: "4", image: artwork4, title: "Midnight Gold", year: "2023", medium: "Acrylic on canvas", body: null },
  { id: "5", image: artwork5, title: "Earth & Light", year: "2023", medium: "Acrylic on canvas", body: null },
  { id: "6", image: artwork6, title: "Verdant Spiral", year: "2024", medium: "Acrylic on canvas", body: null },
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

/** 레이아웃 균형을 위해 항상 마지막에 노출할 작품 제목 (쉼표 구분 또는 배열) */
const PIN_TO_END_TITLES: string[] = ["해바라기"];

/** Masonry: 컬럼 수에 따라 (작품, 원본인덱스)를 열 단위로 나눔 */
function splitIntoColumnsWithIndices<T>(
  items: T[],
  columnCount: number
): { artwork: T; originalIndex: number }[][] {
  const columns: { artwork: T; originalIndex: number }[][] = Array.from(
    { length: columnCount },
    () => []
  );
  items.forEach((item, i) => columns[i % columnCount].push({ artwork: item, originalIndex: i }));
  return columns;
}

const GallerySection = () => {
  const { data: artworks, isLoading, error } = usePublishedArtworks();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const columnCount = useColumnCount();

  // Use database artworks if available, otherwise use fallback
  // useMemo: 랜덤 셔플 후, PIN_TO_END_TITLES에 해당하는 작품은 항상 마지막에 배치
  const displayArtworks = useMemo((): GalleryArtwork[] => {
    const baseArtworks: GalleryArtwork[] =
      artworks && artworks.length > 0
        ? artworks.map((artwork) => ({
            id: artwork.id,
            image: getArtworkImageSrc(artwork),
            title: artwork.title,
            year: artwork.year || "",
            medium: artwork.description || "",
            body: artwork.body ?? null,
            price_display: artwork.price_display ?? null,
          }))
        : fallbackArtworks;

    const shuffled = shuffleArray(baseArtworks);
    const pinSet = new Set(PIN_TO_END_TITLES.map((t) => t.trim()).filter(Boolean));
    const pinned = shuffled.filter((a) => pinSet.has(a.title));
    const rest = shuffled.filter((a) => !pinSet.has(a.title));
    return [...rest, ...pinned];
  }, [artworks]);

  const openViewer = (index: number) => setViewerIndex(index);
  const closeViewer = () => setViewerIndex(null);

  // Masonry: 컬럼별로 나눈 배열 (각 컬럼은 { artwork, originalIndex }[])
  const columnsWithIndices = useMemo(
    () => splitIntoColumnsWithIndices(displayArtworks, columnCount),
    [displayArtworks, columnCount]
  );

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

        {/* Masonry: 컬럼별 flex, 그리드 열 수를 columnCount와 맞춰 빈 열 방지 */}
        {!isLoading && !error && (
          <div
            className={`grid gap-8 lg:gap-10 pointer-events-auto ${
              columnCount === 1 ? "grid-cols-1" : columnCount === 2 ? "grid-cols-2" : "grid-cols-3"
            }`}
          >
            {columnsWithIndices.map((column, colIndex) => (
              <div
                key={colIndex}
                className="flex flex-col gap-8 lg:gap-10"
              >
                {column.map(({ artwork, originalIndex }) => (
                  <ArtworkCard
                    key={artwork.id}
                    id={artwork.id}
                    image={artwork.image}
                    title={artwork.title}
                    year={artwork.year}
                    medium={artwork.medium}
                    index={originalIndex}
                    onClick={() => openViewer(originalIndex)}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Lightbox viewer - body로 포탈, AnimatePresence 제거해 마운트 안정화 */}
        {createPortal(
          viewerIndex !== null ? (
            <motion.div
              key="artwork-viewer"
              className="fixed inset-0 z-[9999] flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <ArtworkViewer
                artworks={displayArtworks}
                currentIndex={viewerIndex}
                onClose={closeViewer}
                onNavigate={setViewerIndex}
              />
            </motion.div>
          ) : null,
          document.body
        )}
      </div>
    </section>
  );
};

export default GallerySection;
