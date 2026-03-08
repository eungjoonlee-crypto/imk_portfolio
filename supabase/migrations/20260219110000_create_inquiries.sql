-- 작품 문의 저장 테이블 (메일 발송 없이 Supabase에만 저장)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id text,
  artwork_title text NOT NULL,
  price_display text,
  name text,
  phone text,
  email text,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.inquiries IS '작품 문의하기 폼에서 제출된 문의 (갤러리 방문자가 작성)';

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- 누구나 문의 제출 가능 (anon)
CREATE POLICY "Allow anonymous insert"
  ON public.inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 인증된 사용자만 조회 가능 (관리자용)
CREATE POLICY "Allow authenticated select"
  ON public.inquiries
  FOR SELECT
  TO authenticated
  USING (true);
