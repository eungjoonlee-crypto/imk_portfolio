import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";
import type { GalleryArtwork } from "./ArtworkViewer";

interface InquiryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artwork: GalleryArtwork;
}

export const InquiryModal = ({ open, onOpenChange, artwork }: InquiryModalProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const priceText = artwork.price_display?.trim() || "가격 문의";

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setMessage("");
    setStatus("idle");
    setErrorMessage("");
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) resetForm();
    onOpenChange(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() && !email.trim()) {
      setErrorMessage("전화번호 또는 이메일을 입력해 주세요.");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const { error } = await supabase.from("inquiries").insert({
        artwork_id: artwork.id,
        artwork_title: artwork.title,
        price_display: priceText,
        name: name.trim() || null,
        phone: phone.trim() || null,
        email: email.trim() || null,
        message: message.trim() || null,
      });
      if (error) throw error;
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">작품 문의</DialogTitle>
        </DialogHeader>

        {status === "success" ? (
          <div className="py-6 text-center text-muted-foreground">
            <p className="font-medium text-foreground">문의내용이 확인되면 연락드리겠습니다.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 작품 정보·가격 공개 */}
            <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-1">
              <p className="text-sm font-medium text-foreground">{artwork.title}</p>
              <p className="text-sm text-muted-foreground">가격: {priceText}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inq-name">이름</Label>
              <Input
                id="inq-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름 (선택)"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inq-phone">전화번호</Label>
              <Input
                id="inq-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inq-email">이메일</Label>
              <Input
                id="inq-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="bg-background"
              />
            </div>

            <p className="text-xs text-muted-foreground">전화번호 또는 이메일 중 하나는 꼭 입력해 주세요.</p>

            <div className="space-y-2">
              <Label htmlFor="inq-message">문의 내용 (선택)</Label>
              <Textarea
                id="inq-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="문의하실 내용을 적어 주세요"
                rows={3}
                className="bg-background resize-none"
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={status === "sending"}
            >
              {status === "sending" ? "전송 중..." : "문의 보내기"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
