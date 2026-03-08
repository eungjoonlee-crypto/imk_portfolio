import { useState, useEffect } from "react";

const BREAKPOINTS = { md: 768, lg: 1024 } as const;

function getColumnCount(): 1 | 2 | 3 {
  if (typeof window === "undefined") return 1;
  const w = window.innerWidth;
  if (w < BREAKPOINTS.md) return 1;
  if (w < BREAKPOINTS.lg) return 2;
  return 3;
}

/**
 * Tailwind 기준 반응형 컬럼 수 (모바일 1, 태블릿 2, 데스크톱 3)
 * 초기값을 현재 너비로 설정해 데스크톱에서 1열로 몰리는 현상 방지
 */
export function useColumnCount(): 1 | 2 | 3 {
  const [columnCount, setColumnCount] = useState<1 | 2 | 3>(getColumnCount);

  useEffect(() => {
    const update = () => setColumnCount(getColumnCount());
    const mqlLg = window.matchMedia(`(min-width: ${BREAKPOINTS.lg}px)`);
    const mqlMd = window.matchMedia(`(min-width: ${BREAKPOINTS.md}px)`);
    mqlLg.addEventListener("change", update);
    mqlMd.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      mqlLg.removeEventListener("change", update);
      mqlMd.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return columnCount;
}
