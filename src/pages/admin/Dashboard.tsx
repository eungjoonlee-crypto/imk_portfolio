import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Search, ArrowUpDown, Eye, EyeOff, GripVertical, Save } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useArtworks, useDeleteArtwork, useUpdateArtwork, useUpdateArtworkOrder, getImageUrl } from "@/hooks/useArtworks";
import { Artwork } from "@/types/artwork";

type SortOrder = "order" | "newest" | "oldest" | "title";

// Sortable Artwork Card Component
interface SortableArtworkCardProps {
  artwork: Artwork;
  onTogglePublished: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string, imagePath: string) => void;
  updateArtwork: ReturnType<typeof useUpdateArtwork>;
}

const SortableArtworkCard = ({ artwork, onTogglePublished, onDelete, updateArtwork }: SortableArtworkCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: artwork.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-card border border-border overflow-hidden group relative"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 z-10 p-2 bg-background/80 backdrop-blur-sm rounded cursor-grab active:cursor-grabbing hover:bg-background/90 transition-colors"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={getImageUrl(artwork.image_path)}
          alt={artwork.title}
          className="w-full h-full object-cover"
        />
        
        {/* Published Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
              artwork.is_published
                ? "bg-green-500/20 text-green-700"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {artwork.is_published ? (
              <>
                <Eye className="h-3 w-3" />
                공개
              </>
            ) : (
              <>
                <EyeOff className="h-3 w-3" />
                비공개
              </>
            )}
          </span>
        </div>

        {/* Order Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-background/80 backdrop-blur-sm text-foreground">
            순서: {artwork.order}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-serif text-lg text-foreground mb-1 truncate">
          {artwork.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {artwork.year || "연도 미지정"}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">공개</span>
            <Switch
              checked={artwork.is_published}
              onCheckedChange={() =>
                onTogglePublished(artwork.id, artwork.is_published)
              }
              disabled={updateArtwork.isPending}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/admin/edit/${artwork.id}`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(artwork.id, artwork.image_path)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { data: artworks, isLoading, error } = useArtworks();
  const deleteArtwork = useDeleteArtwork();
  const updateArtwork = useUpdateArtwork();
  const updateArtworkOrder = useUpdateArtworkOrder();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("order");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; imagePath: string } | null>(null);
  const [localArtworks, setLocalArtworks] = useState<Artwork[]>([]);
  const [hasOrderChanges, setHasOrderChanges] = useState(false);

  // Initialize local artworks when artworks data changes
  useEffect(() => {
    if (artworks) {
      setLocalArtworks(artworks);
      setHasOrderChanges(false);
    }
  }, [artworks]);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter and sort artworks
  const filteredArtworks = useMemo(() => {
    const artworksToFilter = sortOrder === "order" ? localArtworks : (artworks || []);

    if (!artworksToFilter.length) return [];

    let filtered = artworksToFilter.filter((artwork) =>
      artwork.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortOrder === "order") {
      // Already sorted by order in the query, just return as is
      return filtered;
    }

    switch (sortOrder) {
      case "oldest":
        filtered = [...filtered].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "title":
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "newest":
      default:
        filtered = [...filtered].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    return filtered;
  }, [artworks, localArtworks, searchQuery, sortOrder]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLocalArtworks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        setHasOrderChanges(true);
        return newItems;
      });
    }
  };

  const handleSaveOrder = async () => {
    // Recalculate order values with step=100 for flexibility
    const updates = localArtworks.map((artwork, index) => ({
      id: artwork.id,
      order: (index + 1) * 100,
    }));

    await updateArtworkOrder.mutateAsync(updates);
    setHasOrderChanges(false);
  };

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    await updateArtwork.mutateAsync({ id, is_published: !currentStatus });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteArtwork.mutateAsync(deleteTarget);
    setDeleteTarget(null);
  };

  if (error) {
    return (
      <AdminLayout title="작품 관리">
        <div className="text-center py-12">
          <p className="text-destructive">데이터를 불러오는데 실패했습니다.</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="작품 관리">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="작품 제목으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value as SortOrder);
              // Reset local artworks when switching away from order mode
              if (e.target.value !== "order" && artworks) {
                setLocalArtworks(artworks);
                setHasOrderChanges(false);
              }
            }}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="order">표시 순서</option>
            <option value="newest">최신순</option>
            <option value="oldest">오래된순</option>
            <option value="title">제목순</option>
          </select>
        </div>

        {/* Save Order Button (only show in order mode with changes) */}
        {sortOrder === "order" && hasOrderChanges && (
          <Button
            onClick={handleSaveOrder}
            disabled={updateArtworkOrder.isPending}
            className="bg-primary text-primary-foreground"
          >
            <Save className="h-4 w-4 mr-2" />
            {updateArtworkOrder.isPending ? "저장 중..." : "순서 저장"}
          </Button>
        )}

        {/* Add New */}
        <Button asChild>
          <Link to="/admin/new">
            <Plus className="h-4 w-4 mr-2" />
            작품 등록
          </Link>
        </Button>
      </div>

      {/* Info Message for Order Mode */}
      {sortOrder === "order" && (
        <div className="mb-4 p-3 bg-muted/50 rounded-md text-sm text-muted-foreground">
          💡 드래그하여 작품 순서를 변경할 수 있습니다. 변경 후 "순서 저장" 버튼을 눌러주세요.
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : filteredArtworks.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "검색 결과가 없습니다" : "등록된 작품이 없습니다"}
          </p>
          {!searchQuery && (
            <Button asChild>
              <Link to="/admin/new">
                <Plus className="h-4 w-4 mr-2" />
                첫 작품 등록하기
              </Link>
            </Button>
          )}
        </div>
      ) : sortOrder === "order" ? (
        /* Draggable Artwork Grid */
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredArtworks.map((artwork) => artwork.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredArtworks.map((artwork) => (
                  <SortableArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    onTogglePublished={handleTogglePublished}
                    onDelete={(id, imagePath) => setDeleteTarget({ id, imagePath })}
                    updateArtwork={updateArtwork}
                  />
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        /* Regular Artwork Grid (non-draggable) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredArtworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border overflow-hidden group"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={getImageUrl(artwork.image_path)}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Published Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                        artwork.is_published
                          ? "bg-green-500/20 text-green-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {artwork.is_published ? (
                        <>
                          <Eye className="h-3 w-3" />
                          공개
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          비공개
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-serif text-lg text-foreground mb-1 truncate">
                    {artwork.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {artwork.year || "연도 미지정"}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">공개</span>
                      <Switch
                        checked={artwork.is_published}
                        onCheckedChange={() =>
                          handleTogglePublished(artwork.id, artwork.is_published)
                        }
                        disabled={updateArtwork.isPending}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/edit/${artwork.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() =>
                          setDeleteTarget({ id: artwork.id, imagePath: artwork.image_path })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>작품을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 작품 정보와 이미지가 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Dashboard;
