-- 작품 문의 모달에서 표시할 가격 정보 (예: "1,200,000원", "가격 문의" 등)
ALTER TABLE public.artworks
ADD COLUMN IF NOT EXISTS price_display text;

COMMENT ON COLUMN public.artworks.price_display IS '문의 모달에서만 공개되는 가격 표시 문자열 (예: 1,200,000원)';
