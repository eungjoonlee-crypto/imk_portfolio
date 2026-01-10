export interface Artwork {
  id: string;
  title: string;
  description: string | null;
  year: string | null;
  tags: string[] | null;
  image_bucket: string;
  image_path: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ArtworkFormData {
  title: string;
  description?: string;
  year?: string;
  tags?: string;
  is_published: boolean;
  image?: FileList;
}
