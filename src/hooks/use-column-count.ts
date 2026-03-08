import { useState, useEffect } from "react";

const BREAKPOINTS = { sm: 640, md: 768, lg: 1024 } as const;

/**
 * Tailwind 기준 반응형 컬럼 수 (모바일 1, 태블릿 2, 데스크톱 3)
 */
export function useColumnCount(): 1 | 2 | 3 {
  const [columnCount, setColumnCount] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < BREAKPOINTS.md) setColumnCount(1);
      else if (w < BREAKPOINTS.lg) setColumnCount(2);
      else setColumnCount(3);
    };
    const mqlMd = window.matchMedia(`(max-width: ${BREAKPOINTS.lg - 1}px)`);
    const mqlLg = window.matchMedia(`(min-width: ${BREAKPOINTS.lg}px)`);
    const onChange = () => update();
    update();
    mqlMd.addEventListener("change", onChange);
    mqlLg.addEventListener("change", onChange);
    return () => {
      mqlMd.removeEventListener("change", onChange);
      mqlLg.removeEventListener("change", onChange);
    };
  }, []);

  return columnCount;
}
