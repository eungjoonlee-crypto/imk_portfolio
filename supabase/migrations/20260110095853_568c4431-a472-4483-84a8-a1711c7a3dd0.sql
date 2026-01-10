-- Create artworks table for gallery
CREATE TABLE public.artworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    year TEXT,
    tags TEXT[],
    image_bucket TEXT NOT NULL DEFAULT 'artworks',
    image_path TEXT NOT NULL UNIQUE,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;

-- Public read policy for published artworks (gallery view)
CREATE POLICY "Anyone can view published artworks"
ON public.artworks
FOR SELECT
USING (is_published = true);

-- Authenticated users can view all artworks (admin)
CREATE POLICY "Authenticated users can view all artworks"
ON public.artworks
FOR SELECT
TO authenticated
USING (true);

-- Authenticated users can insert artworks
CREATE POLICY "Authenticated users can insert artworks"
ON public.artworks
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated users can update artworks
CREATE POLICY "Authenticated users can update artworks"
ON public.artworks
FOR UPDATE
TO authenticated
USING (true);

-- Authenticated users can delete artworks
CREATE POLICY "Authenticated users can delete artworks"
ON public.artworks
FOR DELETE
TO authenticated
USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for artworks
CREATE TRIGGER update_artworks_updated_at
BEFORE UPDATE ON public.artworks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for artworks
INSERT INTO storage.buckets (id, name, public) 
VALUES ('artworks', 'artworks', true);

-- Storage policies: Anyone can view
CREATE POLICY "Anyone can view artwork images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'artworks');

-- Authenticated users can upload
CREATE POLICY "Authenticated users can upload artwork images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'artworks');

-- Authenticated users can update
CREATE POLICY "Authenticated users can update artwork images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'artworks');

-- Authenticated users can delete
CREATE POLICY "Authenticated users can delete artwork images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'artworks');