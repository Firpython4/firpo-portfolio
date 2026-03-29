"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import type PropsWithClassName from "~/types/propsWithClassName";

interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  estimateSize?: number;
  overscan?: number;
  className?: string;
}

export function VirtualList<T>(props: PropsWithClassName<VirtualListProps<T>>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: props.items.length,
    getScrollElement: () => document.documentElement,
    estimateSize: () => props.estimateSize ?? 400,
    overscan: props.overscan ?? 3,
    getItemKey: (index) => index,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className={`relative ${props.className ?? ""}`}
      style={{
        height: `${virtualizer.getTotalSize()}px`,
        width: "100%",
      }}
    >
      {virtualItems.map((virtualItem) => {
        const item = props.items[virtualItem.index]!;
        return (
          <div
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={(el) => {
              if (el) {
                virtualizer.measureElement(el);
              }
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {props.renderItem(item, virtualItem.index)}
          </div>
        );
      })}
    </div>
  );
}
