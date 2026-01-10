import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import ArtworkForm from "@/components/admin/ArtworkForm";
import { useArtwork, useUpdateArtwork, uploadArtworkImage, deleteArtworkImage } from "@/hooks/useArtworks";
import { toast } from "sonner";

const EditArtwork = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: artwork, isLoading, error } = useArtwork(id || "");
  const updateArtwork = useUpdateArtwork();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    data: { title: string; description?: string; year?: string; tags?: string; is_published: boolean },
    imageFile?: File
  ) => {
    if (!artwork || !id) return;

    setIsSubmitting(true);

    try {
      let imagePath = artwork.image_path;

      // If new image is uploaded, upload it and delete the old one
      if (imageFile) {
        // Upload new image
        imagePath = await uploadArtworkImage(imageFile);

        // Delete old image
        try {
          await deleteArtworkImage(artwork.image_path);
        } catch (error) {
          console.warn("Failed to delete old image:", error);
        }
      }

      // Parse tags
      const tags = data.tags
        ? data.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : null;

      // Update artwork record
      await updateArtwork.mutateAsync({
        id,
        title: data.title,
        description: data.description || null,
        year: data.year || null,
        tags,
        image_path: imagePath,
        is_published: data.is_published,
      });

      navigate("/admin");
    } catch (error) {
      console.error("Error updating artwork:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="작품 수정">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !artwork) {
    return (
      <AdminLayout title="작품 수정">
        <div className="text-center py-12">
          <p className="text-destructive">작품을 찾을 수 없습니다.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="작품 수정"
      breadcrumbs={[
        { label: "작품 관리", href: "/admin" },
        { label: artwork.title },
      ]}
    >
      <div className="max-w-2xl">
        <ArtworkForm
          artwork={artwork}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </AdminLayout>
  );
};

export default EditArtwork;
