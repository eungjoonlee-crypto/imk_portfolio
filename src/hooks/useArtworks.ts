import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Artwork } from "@/types/artwork";
import { toast } from "sonner";

// Fetch all artworks (admin view)
export const useArtworks = () => {
  return useQuery({
    queryKey: ["artworks"],
    queryFn: async (): Promise<Artwork[]> => {
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .order("order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map((item) => ({
        ...item,
        order: item.order ?? 0,
      }));
    },
  });
};

// Fetch only published artworks (public gallery)
export const usePublishedArtworks = () => {
  return useQuery({
    queryKey: ["artworks", "published"],
    queryFn: async (): Promise<Artwork[]> => {
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .eq("is_published", true)
        .order("order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map((item) => ({
        ...item,
        order: item.order ?? 0,
      }));
    },
  });
};

// Fetch single artwork
export const useArtwork = (id: string) => {
  return useQuery({
    queryKey: ["artworks", id],
    queryFn: async (): Promise<Artwork | null> => {
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

// Upload image to storage
export const uploadArtworkImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `artworks/${fileName}`;

  const { error } = await supabase.storage
    .from("artworks")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (error) throw error;
  return filePath;
};

// Get public URL for image
export const getImageUrl = (imagePath: string): string => {
  const { data } = supabase.storage
    .from("artworks")
    .getPublicUrl(imagePath);
  return data.publicUrl;
};

// Delete image from storage
export const deleteArtworkImage = async (imagePath: string) => {
  const { error } = await supabase.storage
    .from("artworks")
    .remove([imagePath]);

  if (error) throw error;
};

// Create artwork mutation
export const useCreateArtwork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (artwork: Omit<Artwork, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("artworks")
        .insert(artwork)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artworks"] });
      toast.success("작품이 등록되었습니다");
    },
    onError: (error: Error) => {
      toast.error(`작품 등록 실패: ${error.message}`);
    },
  });
};

// Update artwork mutation
export const useUpdateArtwork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...artwork }: Partial<Artwork> & { id: string }) => {
      const { data, error } = await supabase
        .from("artworks")
        .update(artwork)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artworks"] });
      toast.success("작품이 수정되었습니다");
    },
    onError: (error: Error) => {
      toast.error(`작품 수정 실패: ${error.message}`);
    },
  });
};

// Delete artwork mutation
export const useDeleteArtwork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, imagePath }: { id: string; imagePath: string }) => {
      // Delete from storage first
      try {
        await deleteArtworkImage(imagePath);
      } catch (error) {
        console.warn("Storage delete failed:", error);
      }

      // Then delete from database
      const { error } = await supabase
        .from("artworks")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artworks"] });
      toast.success("작품이 삭제되었습니다");
    },
    onError: (error: Error) => {
      toast.error(`작품 삭제 실패: ${error.message}`);
    },
  });
};

// Bulk update artwork order
export const useUpdateArtworkOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Array<{ id: string; order: number }>) => {
      // Use Promise.all to update all artworks in parallel
      const updatePromises = updates.map(({ id, order }) =>
        supabase
          .from("artworks")
          .update({ order })
          .eq("id", id)
      );

      const results = await Promise.all(updatePromises);
      
      // Check for any errors
      const errors = results.filter((result) => result.error);
      if (errors.length > 0) {
        throw new Error(errors[0].error?.message || "순서 업데이트 실패");
      }

      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artworks"] });
      toast.success("작품 순서가 저장되었습니다");
    },
    onError: (error: Error) => {
      toast.error(`순서 저장 실패: ${error.message}`);
    },
  });
};
