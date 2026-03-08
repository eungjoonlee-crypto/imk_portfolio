import { useEffect, useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InquiryModal } from "@/components/InquiryModal";

export interface GalleryArtwork {
  id: string;
  image: string;
  title: string;
  year: string;
  /** 규격·소재 (카드 한 줄, 뷰어 부제목) */
  medium: string;
  /** 본문 설명 (뷰어에서만 표시) */
  body: string | null;
  /** 가격 표시 (문의 모달에서 공개, 예: "1,200,000원" 또는 "가격 문의") */
  price_display?: string | null;
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
  const [inquiryOpen, setInquiryOpen] = useState(false);

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
    <div className="absolute inset-0 flex flex-col min-h-[100dvh] md:min-h-0">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/35 backdrop-blur-[6px] md:backdrop-blur-[6px]"
        onClick={onClose}
      />

      {/* Content container: 모바일 풀스크린 시트, 데스크톱 중앙 패널 */}
      <div
        className="relative z-0 flex flex-1 min-h-0 items-center justify-center px-2 pt-14 pb-4 md:p-8 md:pt-16 md:pb-28"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          key={artwork.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col md:flex-row md:max-w-5xl w-full h-full max-h-[96dvh] md:max-h-[80vh] bg-card/95 backdrop-blur-sm rounded-t-2xl md:rounded-lg overflow-hidden border border-border shadow-2xl"
        >
          {/* Image: 모바일에서 비중 축소(텍스트 영역 확보), 데스크톱 55% */}
          <div className="relative flex-shrink-0 md:w-[55%] min-h-[20vh] max-h-[28vh] md:max-h-none md:min-h-0 bg-muted">
            <img
              src={artwork.image}
              alt={artwork.title}
              className="w-full h-full object-contain object-center select-none"
              draggable={false}
            />
          </div>

          {/* Text + CTA: 모바일에서 텍스트만 스크롤, 버튼은 항상 하단 고정 */}
          <div className="flex flex-col flex-1 min-h-0 min-w-0">
            {/* 스크롤 영역: 제목·설명만, 버튼과 겹치지 않음 */}
            <div
              className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain [touch-action:pan-y] [-webkit-overflow-scrolling:touch] p-5 md:p-8 pb-4 md:pb-8"
            >
              <div className="space-y-3 md:space-y-4">
                <h2
                  className="font-serif text-xl md:text-3xl text-foreground leading-tight"
                  style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                >
                  {artwork.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {artwork.medium}
                  {artwork.year ? ` · ${artwork.year}` : ""}
                </p>
                {artwork.body && (
                  <p className="text-base md:text-[15px] text-foreground/90 leading-relaxed whitespace-pre-line">
                    {artwork.body}
                  </p>
                )}
              </div>
            </div>

            {/* CTA: 항상 하단 고정, 텍스트와 겹치지 않음 */}
            <div className="flex-shrink-0 border-t border-border bg-card/95 p-4 md:p-8 md:pt-6">
              <Button
                variant="outline"
                className="w-full md:w-auto min-h-[44px] px-6 py-3 text-base border-primary/40 text-primary hover:bg-primary/10 hover:text-primary font-medium [touch-action:manipulation]"
                onClick={() => setInquiryOpen(true)}
              >
                작품 문의하기
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Prev / Next: 모바일에서 터치 타깃 44px, 이미지 영역 옆에 배치 */}
        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="이전 작품"
              onClick={goPrev}
              className="absolute left-2 md:left-4 top-[40%] md:top-1/2 -translate-y-1/2 z-10 rounded-full min-w-[44px] min-h-[44px] h-11 w-11 md:h-11 md:w-11 flex items-center justify-center bg-background/90 backdrop-blur-sm text-muted-foreground hover:text-foreground active:bg-background border border-border/50 [touch-action:manipulation]"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              aria-label="다음 작품"
              onClick={goNext}
              className="absolute right-2 md:right-4 top-[40%] md:top-1/2 -translate-y-1/2 z-10 rounded-full min-w-[44px] min-h-[44px] h-11 w-11 md:h-11 md:w-11 flex items-center justify-center bg-background/90 backdrop-blur-sm text-muted-foreground hover:text-foreground active:bg-background border border-border/50 [touch-action:manipulation]"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Position indicator: 모바일 하단 근처, 데스크톱 뷰어 하단 */}
        {total > 1 && (
          <div className="absolute bottom-4 md:bottom-4 left-1/2 -translate-x-1/2 z-10 text-sm text-muted-foreground/90 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
            {currentIndex + 1} / {total}
          </div>
        )}
      </div>

      {/* 닫기 버튼: 모바일 44px 터치 타깃, safe area */}
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="absolute top-4 right-4 z-[100] flex min-w-[44px] min-h-[44px] h-12 w-12 md:h-10 md:w-10 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm text-muted-foreground hover:text-foreground active:bg-background border border-border/50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring [touch-action:manipulation]"
        style={{ top: "max(1rem, env(safe-area-inset-top))" }}
      >
        <X className="h-5 w-5" />
      </button>

      {artwork && (
        <InquiryModal
          open={inquiryOpen}
          onOpenChange={setInquiryOpen}
          artwork={artwork}
        />
      )}
    </div>
  );
};
