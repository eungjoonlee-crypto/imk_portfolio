-- 페이지 및 작품 조회수 기록용 테이블

-- 개별 페이지 뷰 로그
CREATE TABLE IF NOT EXISTS public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL, -- 예: 'home', 'gallery'
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.page_views IS '프론트엔드 페이지 단위 조회 로그 (한 번 조회마다 한 행).';

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- 누구나 조회 기록만 남길 수 있음 (anon)
CREATE POLICY "Allow anonymous insert page_views"
  ON public.page_views
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 인증된 사용자만 조회 (관리자용)
CREATE POLICY "Allow authenticated select page_views"
  ON public.page_views
  FOR SELECT
  TO authenticated
  USING (true);


-- 작품 뷰어 조회 로그
CREATE TABLE IF NOT EXISTS public.artwork_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id uuid NOT NULL REFERENCES public.artworks(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.artwork_views IS '작품 뷰어가 열릴 때마다 기록되는 작품별 조회 로그.';

ALTER TABLE public.artwork_views ENABLE ROW LEVEL SECURITY;

-- 누구나 조회 기록만 남길 수 있음 (anon)
CREATE POLICY "Allow anonymous insert artwork_views"
  ON public.artwork_views
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 인증된 사용자만 조회 (관리자용)
CREATE POLICY "Allow authenticated select artwork_views"
  ON public.artwork_views
  FOR SELECT
  TO authenticated
  USING (true);

