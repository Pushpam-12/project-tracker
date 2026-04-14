import { useState } from "react";

export const useVirtualScroll = (
  itemCount: number,
  rowHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = itemCount * rowHeight;

  const startIndex = Math.floor(scrollTop / rowHeight);
  const visibleCount = Math.ceil(containerHeight / rowHeight);

  const endIndex = startIndex + visibleCount + 5; // buffer

  return {
    startIndex,
    endIndex,
    totalHeight,
    setScrollTop,
  };
};