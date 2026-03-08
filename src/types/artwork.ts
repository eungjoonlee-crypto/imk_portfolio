export interface Artwork {
  id: string;
  title: string;
  /** 규격·소재 (갤러리 카드 한 줄, 뷰어 부제목) */
  description: string | null;
  /** 본문 설명 (뷰어에서만 표시) */
  body: string | null;
  /** 가격 표시 (문의 모달에서만 공개) */
  price_display?: string | null;
  year: string | null;
  tags: string[] | null;
  image_bucket: string;
  image_path: string;
  image_url: string | null;
  is_published: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface ArtworkFormData {
  title: string;
  description?: string;
  body?: string;
  year?: string;
  tags?: string;
  is_published: boolean;
  image?: FileList;
}
