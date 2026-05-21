"use client";

import { useEffect, useState } from "react";

type NavItem = {
  href: string;
  label: string;
};

export function ArticleNav({ items }: { items: NavItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.href.replace("#", "") ?? "");
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.href === `#${activeId}`),
  );
  const progress = items.length > 1 ? ((activeIndex + 1) / items.length) * 100 : 100;

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.href.replace("#", "")))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveId(visible.target.id);
        }
      },
      {
        rootMargin: "-18% 0px -58% 0px",
        threshold: [0.12, 0.25, 0.45, 0.65],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <div className="border border-[#DDD] bg-[#FFFBF5]/80 p-5 shadow-2xl shadow-[#FF6B6B]/15 backdrop-blur">
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="font-sans text-xs uppercase tracking-[0.24em] text-[#FF6B6B]">Article</p>
        <p className="font-sans text-xs text-[#999]">
          {activeIndex + 1}/{items.length}
        </p>
      </div>
      <div className="mb-5 h-1 overflow-hidden bg-[#DDD]/30">
        <div
          className="h-full bg-[#FF6B6B] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="grid gap-1 border-l border-[#DDD] pl-4">
        {items.map((item, index) => {
          const id = item.href.replace("#", "");
          const isActive = id === activeId;
          const isRead = index < activeIndex;

          return (
            <a
              key={item.href}
              href={item.href}
              className={[
                "relative -ml-4 border-l-2 px-4 py-2 font-sans text-sm leading-5 transition",
                isActive
                  ? "border-[#FF6B6B] bg-[#FF6B6B]/10 text-[#2D2D2D]"
                  : isRead
                    ? "border-emerald-300/40 text-[#999] hover:text-[#2D2D2D]"
                    : "border-transparent text-[#777] hover:text-[#2D2D2D]",
              ].join(" ")}
            >
              <span className="mr-2 text-xs text-[#BBB]">{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
