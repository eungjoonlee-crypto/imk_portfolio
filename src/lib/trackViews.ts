import { supabase } from "@/lib/supabaseClient";

// 단순 조회 로그용 helper (실패해도 UI에는 영향 주지 않도록 fire-and-forget 스타일)

export async function trackPageView(path: string) {
  try {
    await supabase.from("page_views").insert({ path });
  } catch {
    // 로깅 실패는 무시
  }
}

export async function trackArtworkView(artworkId: string) {
  try {
    await supabase.from("artwork_views").insert({ artwork_id: artworkId });
  } catch {
    // 로깅 실패는 무시
  }
}

