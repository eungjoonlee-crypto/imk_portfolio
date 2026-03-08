import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Artwork } from "@/types/artwork";
import { getArtworkImageSrc } from "@/hooks/useArtworks";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const artworkSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(100, "제목은 100자 이하로 입력해주세요"),
  description: z.string().max(500, "규격·소재는 500자 이하로 입력해주세요").optional(),
  body: z.string().max(2000, "본문 설명은 2000자 이하로 입력해주세요").optional(),
  price_display: z.string().max(100, "가격 표시는 100자 이하로 입력해주세요").optional(),
  year: z.string().max(10, "연도는 10자 이하로 입력해주세요").optional(),
  tags: z.string().optional(),
  is_published: z.boolean(),
});

type FormData = z.infer<typeof artworkSchema>;

interface ArtworkFormProps {
  artwork?: Artwork;
  onSubmit: (data: FormData, imageFile?: File) => Promise<void>;
  isSubmitting: boolean;
}

const ArtworkForm = ({ artwork, onSubmit, isSubmitting }: ArtworkFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(artworkSchema),
    defaultValues: {
      title: artwork?.title || "",
      description: artwork?.description || "",
      body: artwork?.body ?? "",
      price_display: artwork?.price_display ?? "",
      year: artwork?.year || "",
      tags: artwork?.tags?.join(", ") || "",
      is_published: artwork?.is_published ?? true,
    },
  });

  const isPublished = watch("is_published");

  useEffect(() => {
    if (artwork) {
      setImagePreview(getArtworkImageSrc(artwork));
    }
  }, [artwork]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);

    if (!file) return;

    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageError("PNG, JPG, WEBP 이미지만 업로드 가능합니다");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setImageError("파일 크기는 10MB 이하여야 합니다");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(artwork ? getArtworkImageSrc(artwork) : null);
  };

  const handleFormSubmit = async (data: FormData) => {
    // Require image for new artwork
    if (!artwork && !imageFile) {
      setImageError("이미지를 선택해주세요");
      return;
    }

    await onSubmit(data, imageFile || undefined);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Image Upload */}
      <div className="space-y-2">
        <Label>작품 이미지 {!artwork && <span className="text-destructive">*</span>}</Label>
        
        {imagePreview ? (
          <div className="relative w-full max-w-md">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full aspect-[4/5] object-cover rounded-lg border border-border"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full max-w-md aspect-[4/5] border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
            <ImagePlus className="h-12 w-12 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">이미지 업로드</span>
            <span className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP (최대 10MB)</span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        )}
        
        {imageFile && (
          <p className="text-sm text-muted-foreground">
            새 파일: {imageFile.name}
          </p>
        )}
        
        {imageError && (
          <p className="text-sm text-destructive">{imageError}</p>
        )}
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">
          제목 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="작품 제목"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* 규격·소재 (description) */}
      <div className="space-y-2">
        <Label htmlFor="description">규격·소재</Label>
        <Input
          id="description"
          placeholder="예: 캔버스에 유채, 90×70cm"
          {...register("description")}
        />
        <p className="text-xs text-muted-foreground">갤러리 카드와 뷰어 부제목에 표시됩니다</p>
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* 본문 설명 (body) */}
      <div className="space-y-2">
        <Label htmlFor="body">본문 설명</Label>
        <Textarea
          id="body"
          placeholder="작품에 대한 본문 설명을 입력하세요 (뷰어에서만 표시)"
          rows={5}
          {...register("body")}
        />
        <p className="text-xs text-muted-foreground">갤러리에서 작품 클릭 시 뷰어에만 표시됩니다. 줄바꿈 가능</p>
        {errors.body && (
          <p className="text-sm text-destructive">{errors.body.message}</p>
        )}
      </div>

      {/* 가격 표시 (price_display) - 문의 모달에서만 공개 */}
      <div className="space-y-2">
        <Label htmlFor="price_display">가격 표시</Label>
        <Input
          id="price_display"
          placeholder="예: 1,200,000원 또는 가격 문의"
          {...register("price_display")}
        />
        <p className="text-xs text-muted-foreground">작품 문의하기 클릭 시 문의 모달에서만 표시됩니다. 비우면 &quot;가격 문의&quot;로 표시</p>
        {errors.price_display && (
          <p className="text-sm text-destructive">{errors.price_display.message}</p>
        )}
      </div>

      {/* Year */}
      <div className="space-y-2">
        <Label htmlFor="year">제작 연도</Label>
        <Input
          id="year"
          placeholder="예: 2024"
          {...register("year")}
        />
        {errors.year && (
          <p className="text-sm text-destructive">{errors.year.message}</p>
        )}
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags">태그</Label>
        <Input
          id="tags"
          placeholder="쉼표로 구분 (예: abstract, acrylic, canvas)"
          {...register("tags")}
        />
        <p className="text-xs text-muted-foreground">쉼표(,)로 태그를 구분해주세요</p>
      </div>

      {/* Published Toggle */}
      <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
        <div>
          <Label htmlFor="is_published" className="text-base">공개 상태</Label>
          <p className="text-sm text-muted-foreground">
            {isPublished ? "갤러리에 공개됩니다" : "갤러리에 표시되지 않습니다"}
          </p>
        </div>
        <Switch
          id="is_published"
          checked={isPublished}
          onCheckedChange={(checked) => setValue("is_published", checked)}
        />
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
              저장 중...
            </span>
          ) : artwork ? (
            "수정하기"
          ) : (
            "등록하기"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ArtworkForm;
