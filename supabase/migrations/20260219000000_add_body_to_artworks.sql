-- 본문 설명용 컬럼 추가 (description은 규격·소재, body는 본문)
ALTER TABLE public.artworks
ADD COLUMN IF NOT EXISTS body text;
