"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useState, useEffect } from "react";
import type PropsWithClassName from "~/types/propsWithClassName";

interface VirtualGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  minItemWidth: number;
  maxItemWidth: number;
  gap: number;
  className?: string;
}

export function VirtualGrid<T>(props: PropsWithClassName<VirtualGridProps<T>>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(1);

  useEffect(() => {
    if (!parentRef.current) return;

    const updateColumns = () => {
      const containerWidth = parentRef.current?.clientWidth ?? 0;
      const availableWidth = containerWidth - props.gap;
      const itemWidth = Math.min(
        Math.max(
          availableWidth / Math.floor(availableWidth / props.minItemWidth),
          props.minItemWidth,
        ),
        props.maxItemWidth,
      );
      const cols = Math.max(
        1,
        Math.floor((containerWidth + props.gap) / (itemWidth + props.gap)),
      );
      setColumnCount(cols);
    };

    updateColumns();

    const resizeObserver = new ResizeObserver(() => {
      updateColumns();
    });

    if (parentRef.current) {
      resizeObserver.observe(parentRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [props.gap, props.minItemWidth, props.maxItemWidth]);

  const rowCount = Math.ceil(props.items.length / columnCount);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => document.documentElement,
    estimateSize: () => 440,
    overscan: 3,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className={`relative ${props.className ?? ""}`}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        gap: `${props.gap}px`,
      }}
    >
      {virtualItems.map((virtualRow) => {
        const rowStartIndex = virtualRow.index * columnCount;
        const rowItems = props.items.slice(
          rowStartIndex,
          rowStartIndex + columnCount,
        );

        return rowItems.map((item, colIndex) => {
          const itemIndex = rowStartIndex + colIndex;
          return (
            <div
              key={itemIndex}
              data-index={itemIndex}
              ref={(el) => {
                if (el && virtualRow.index === 0) {
                  virtualizer.measureElement(el);
                }
              }}
            >
              {props.renderItem(item, itemIndex)}
            </div>
          );
        });
      })}
    </div>
  );
}
