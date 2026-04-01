"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { chapters } from "@/data/chapters";
import {
  Layout,
  Wrench,
  Terminal,
  Shield,
  MessageSquare,
  Anchor,
  Plug,
  Users,
  Database,
  Monitor,
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";
import { useState } from "react";

const iconMap: Record<string, React.ElementType> = {
  Layout,
  Wrench,
  Terminal,
  Shield,
  MessageSquare,
  Anchor,
  Plug,
  Users,
  Database,
  Monitor,
  Sparkles,
  Star,
};

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 flex flex-col ${
        collapsed ? "w-16" : "w-64"
      }`}
      style={{
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-border)",
      }}
    >
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--accent)" }}
          >
            <span className="text-white text-sm font-bold">CC</span>
          </div>
          {!collapsed && (
            <span className="font-semibold text-sm truncate">
              Claude Code 源码解析
            </span>
          )}
        </Link>
      </div>

      {/* Home link */}
      <Link
        href="/"
        className={`flex items-center gap-3 mx-2 px-3 py-2 rounded-lg text-sm transition-colors ${
          pathname === "/"
            ? "font-semibold"
            : "opacity-70 hover:opacity-100"
        }`}
        style={pathname === "/" ? { background: "var(--accent)", color: "#fff" } : {}}
      >
        <Home size={18} />
        {!collapsed && <span>架构总览</span>}
      </Link>

      {/* Chapters */}
      <nav className="flex-1 overflow-y-auto mt-2 px-2 pb-4">
        <div className="space-y-0.5">
          {chapters.map((ch, i) => {
            const Icon = iconMap[ch.icon] || Layout;
            const isActive = pathname === `/chapters/${ch.slug}`;
            return (
              <Link
                key={ch.slug}
                href={`/chapters/${ch.slug}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "font-semibold"
                    : "opacity-70 hover:opacity-100"
                }`}
                style={
                  isActive
                    ? { background: ch.color + "20", color: ch.color }
                    : {}
                }
                title={collapsed ? ch.title : undefined}
              >
                <Icon size={18} style={{ color: ch.color, flexShrink: 0 }} />
                {!collapsed && (
                  <span className="truncate">
                    {i + 1}. {ch.title}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 opacity-50 hover:opacity-100 transition-opacity"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
