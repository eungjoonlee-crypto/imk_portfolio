import { useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const INSTAGRAM_DM_URL = "https://www.instagram.com/direct/t/imk_atelier";

export interface GalleryArtwork {
  id: string;
  image: string;
  title: string;
  year: string;
  /** 규격·소재 (카드 한 줄, 뷰어 부제목) */
  medium: string;
  /** 본문 설명 (뷰어에서만 표시) */
  body: string | null;
}

interface ArtworkViewerProps {
  artworks: GalleryArtwork[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const ArtworkViewer = ({
  artworks,
  currentIndex,
  onClose,
  onNavigate,
}: ArtworkViewerProps) => {
  const total = artworks.length;
  const artwork = artworks[currentIndex];
  const touchStartX = useRef<number | null>(null);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    onNavigate(currentIndex === 0 ? total - 1 : currentIndex - 1);
  }, [currentIndex, total, onNavigate]);

  const goNext = useCallback(() => {
    if (total <= 1) return;
    onNavigate(currentIndex === total - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, total, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goPrev, goNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) < 50) return;
    if (delta > 0) goPrev();
    else goNext();
    touchStartX.current = null;
  };

  // Lock body scroll while viewer is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!artwork) return null;

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Backdrop: dimmed + blurred gallery */}
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/35 backdrop-blur-[6px]"
        onClick={onClose}
      />

      {/* Content container: centered panel (z-0 so 닫기 버튼이 위에 보이도록) */}
      <div
        className="relative z-0 flex flex-1 min-h-0 items-center justify-center p-4 pt-14 pb-24 md:p-8 md:pt-16 md:pb-28"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          key={artwork.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col md:flex-row md:max-w-5xl w-full h-full max-h-[85vh] md:max-h-[80vh] bg-card/95 backdrop-blur-sm rounded-lg overflow-hidden border border-border shadow-2xl"
        >
          {/* Image area */}
          <div className="relative flex-shrink-0 md:w-[55%] min-h-[40vh] md:min-h-0 bg-muted">
            <img
              src={artwork.image}
              alt={artwork.title}
              className="w-full h-full object-contain object-center"
              draggable={false}
            />
          </div>

          {/* Text + CTA area */}
          <div className="flex flex-col flex-1 min-h-0 p-6 md:p-8 overflow-y-auto">
            <div className="flex-1 space-y-4">
              <h2
                className="font-serif text-2xl md:text-3xl text-foreground leading-tight"
                style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
              >
                {artwork.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {artwork.medium}
                {artwork.year ? ` · ${artwork.year}` : ""}
              </p>
              {artwork.body && (
                <p className="text-[15px] text-foreground/90 leading-relaxed whitespace-pre-line">
                  {artwork.body}
                </p>
              )}
            </div>

            {/* Sticky CTA on mobile, natural on desktop */}
            <div className="mt-6 pt-6 border-t border-border flex-shrink-0">
              <Button
                variant="outline"
                className="w-full md:w-auto border-primary/40 text-primary hover:bg-primary/10 hover:text-primary font-medium"
                onClick={() => window.open(INSTAGRAM_DM_URL, "_blank", "noopener,noreferrer")}
              >
                구매 문의하기
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Prev / Next arrows */}
        {total > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              aria-label="이전 작품"
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 rounded-full h-11 w-11 bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-background/90 border border-border/50"
              onClick={goPrev}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="다음 작품"
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 rounded-full h-11 w-11 bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-background/90 border border-border/50"
              onClick={goNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Position indicator */}
        {total > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-muted-foreground/90">
            {currentIndex + 1} / {total}
          </div>
        )}
      </div>

      {/* 닫기 버튼: 최상단 레이어로 클릭 보장 */}
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="absolute top-4 right-4 z-[100] flex h-10 w-10 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-background border border-border/50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};
