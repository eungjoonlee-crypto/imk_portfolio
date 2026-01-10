import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import ArtworkForm from "@/components/admin/ArtworkForm";
import { useCreateArtwork, uploadArtworkImage } from "@/hooks/useArtworks";
import { toast } from "sonner";

const NewArtwork = () => {
  const navigate = useNavigate();
  const createArtwork = useCreateArtwork();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    data: { title: string; description?: string; year?: string; tags?: string; is_published: boolean },
    imageFile?: File
  ) => {
    if (!imageFile) {
      toast.error("이미지를 선택해주세요");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image first
      const imagePath = await uploadArtworkImage(imageFile);

      // Parse tags
      const tags = data.tags
        ? data.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : null;

      // Create artwork record
      await createArtwork.mutateAsync({
        title: data.title,
        description: data.description || null,
        year: data.year || null,
        tags,
        image_bucket: "artworks",
        image_path: imagePath,
        is_published: data.is_published,
      });

      navigate("/admin");
    } catch (error) {
      console.error("Error creating artwork:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="작품 등록"
      breadcrumbs={[
        { label: "작품 관리", href: "/admin" },
        { label: "작품 등록" },
      ]}
    >
      <div className="max-w-2xl">
        <ArtworkForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </AdminLayout>
  );
};

export default NewArtwork;
