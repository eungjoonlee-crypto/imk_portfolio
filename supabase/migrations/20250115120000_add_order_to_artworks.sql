-- Add order field to artworks table for custom display ordering
ALTER TABLE public.artworks 
ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- Create index on order field for better query performance
CREATE INDEX IF NOT EXISTS idx_artworks_order ON public.artworks("order");

-- Set initial order values based on created_at (existing artworks)
-- This assigns sequential order values: 100, 200, 300, etc. (using step=100 for flexibility)
UPDATE public.artworks
SET "order" = (
  SELECT (ROW_NUMBER() OVER (ORDER BY created_at DESC) * 100)
  FROM public.artworks AS a2
  WHERE a2.id = artworks.id
);

-- Add comment to explain the field
COMMENT ON COLUMN public.artworks."order" IS 'Display order for artworks. Lower values appear first. Default step is 100 for flexibility.';


