"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";

interface TocItem {
  id: string;
  label: string;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);

      for (let i = items.length - 1; i >= 0; i--) {
        const el = document.getElementById(items[i].id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveId(items[i].id);
          return;
        }
      }
      setActiveId("");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  if (!visible || items.length === 0) return null;

  return (
    <div
      className="fixed right-6 top-1/3 hidden xl:block animate-fade"
      style={{ width: 180, zIndex: 30 }}
    >
      <div
        className="rounded-xl p-3"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold" style={{ color: "var(--muted)" }}>
          <List size={12} />
          目录
        </div>
        <nav className="space-y-0.5">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="block px-2 py-1 rounded text-xs transition-all"
              style={{
                color: activeId === item.id ? "var(--accent)" : "var(--muted)",
                background: activeId === item.id ? "var(--accent)" + "10" : "transparent",
                fontWeight: activeId === item.id ? 600 : 400,
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
