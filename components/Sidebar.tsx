"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { chapters } from "@/data/chapters";
import {
  Layout, Wrench, Terminal, Shield, MessageSquare, Anchor,
  Plug, Users, Database, Monitor, Sparkles, Star,
  ChevronLeft, ChevronRight, Home, Check, Menu, X,
} from "lucide-react";
import { useState, useEffect } from "react";

const iconMap: Record<string, React.ElementType> = {
  Layout, Wrench, Terminal, Shield, MessageSquare, Anchor,
  Plug, Users, Database, Monitor, Sparkles, Star,
};

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visited, setVisited] = useState<Set<string>>(new Set());

  // Track visited chapters
  useEffect(() => {
    const stored = localStorage.getItem("visited-chapters");
    if (stored) setVisited(new Set(JSON.parse(stored)));
  }, []);

  useEffect(() => {
    const slug = pathname.replace("/chapters/", "");
    if (chapters.some((c) => c.slug === slug)) {
      setVisited((prev) => {
        const next = new Set(prev);
        next.add(slug);
        localStorage.setItem("visited-chapters", JSON.stringify([...next]));
        return next;
      });
    }
    setMobileOpen(false);
  }, [pathname]);

  const sidebarContent = (
    <>
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
        className={`flex items-center gap-3 mx-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
          pathname === "/" ? "font-semibold" : "opacity-70 hover:opacity-100"
        }`}
        style={pathname === "/" ? { background: "var(--accent)", color: "#fff" } : {}}
      >
        <Home size={18} />
        {!collapsed && <span>架构总览</span>}
      </Link>

      {/* Progress summary */}
      {!collapsed && (
        <div className="mx-4 mt-3 mb-1">
          <div className="flex items-center justify-between text-xs" style={{ color: "var(--muted)" }}>
            <span>学习进度</span>
            <span>{visited.size}/{chapters.length}</span>
          </div>
          <div
            className="mt-1 h-1 rounded-full overflow-hidden"
            style={{ background: "var(--card-border)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(visited.size / chapters.length) * 100}%`,
                background: "var(--accent)",
              }}
            />
          </div>
        </div>
      )}

      {/* Chapters */}
      <nav className="flex-1 overflow-y-auto mt-2 px-2 pb-4">
        <div className="space-y-0.5">
          {chapters.map((ch, i) => {
            const Icon = iconMap[ch.icon] || Layout;
            const isActive = pathname === `/chapters/${ch.slug}`;
            const isVisited = visited.has(ch.slug);
            return (
              <Link
                key={ch.slug}
                href={`/chapters/${ch.slug}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  isActive ? "font-semibold" : "opacity-70 hover:opacity-100"
                }`}
                style={{
                  ...(isActive
                    ? {
                        background: ch.color + "15",
                        color: ch.color,
                        borderLeft: `3px solid ${ch.color}`,
                        paddingLeft: 9,
                      }
                    : {}),
                }}
                title={collapsed ? ch.title : undefined}
              >
                <Icon size={18} style={{ color: ch.color, flexShrink: 0 }} />
                {!collapsed && (
                  <>
                    <span className="truncate flex-1">
                      {i + 1}. {ch.title}
                    </span>
                    {isVisited && !isActive && (
                      <Check size={12} style={{ color: "var(--muted)", flexShrink: 0 }} />
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Collapse button - desktop only */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 opacity-50 hover:opacity-100 transition-opacity hidden md:block"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg md:hidden hamburger-btn"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          display: "none",
        }}
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${mobileOpen ? "sidebar-open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full z-50 flex flex-col sidebar-desktop ${
          collapsed ? "w-16" : "w-64"
        } ${mobileOpen ? "sidebar-open" : ""}`}
        style={{
          background: "var(--sidebar-bg)",
          borderRight: "1px solid var(--sidebar-border)",
          transition: "width 0.3s ease, transform 0.3s ease",
        }}
      >
        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1 md:hidden"
          style={{ color: "var(--muted)" }}
        >
          <X size={18} />
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}
