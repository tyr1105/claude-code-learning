"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { chapters } from "@/data/chapters";
import {
  Layout, Wrench, Terminal, Shield, MessageSquare, Anchor,
  Plug, Users, Database, Monitor, Sparkles, Star, FileText,
  ChevronLeft, ChevronRight, Home, Check, Menu, X, ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";

const iconMap: Record<string, React.ElementType> = {
  Layout, Wrench, Terminal, Shield, MessageSquare, Anchor,
  Plug, Users, Database, Monitor, Sparkles, Star, FileText,
};

const PROMPT_CATEGORIES = [
  { id: "sec-prompt-index", label: "提示词索引", color: "#D97757" },
  { id: "sec-code", label: "▸ 系统提示", color: "#D97757" },
  { id: "sec-code", label: "▸ 文件操作工具 (3)", color: "#C2785C" },
  { id: "sec-code", label: "▸ 搜索工具 (2)", color: "#B8860B" },
  { id: "sec-code", label: "▸ 执行工具 (5)", color: "#8B7355" },
  { id: "sec-code", label: "▸ 代理与计划 (5)", color: "#A0522D" },
  { id: "sec-code", label: "▸ 任务管理 (7)", color: "#EDA100" },
  { id: "sec-code", label: "▸ 网络工具 (3)", color: "#D97757" },
  { id: "sec-code", label: "▸ Swarm 多代理 (4)", color: "#C2785C" },
  { id: "sec-code", label: "▸ MCP 工具 (3)", color: "#B8860B" },
  { id: "sec-code", label: "▸ 服务层提示 (5)", color: "#8B7355" },
  { id: "sec-code", label: "▸ 特殊功能 (3)", color: "#A0522D" },
  { id: "sec-code", label: "▸ 技能提示 (13)", color: "#EDA100" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [promptExpanded, setPromptExpanded] = useState(false);

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
    if (pathname === "/chapters/prompts") setPromptExpanded(true);
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

      {/* Chapters */}
      <nav className="flex-1 overflow-y-auto mt-2 px-2 pb-4">
        <div className="space-y-0.5">
          {chapters.map((ch, i) => {
            const Icon = iconMap[ch.icon] || Layout;
            const isActive = pathname === `/chapters/${ch.slug}`;
            const isVisited = visited.has(ch.slug);
            const isPrompts = ch.slug === "prompts";
            return (
              <div key={ch.slug}>
                <div className="flex items-center">
                  <Link
                    href={`/chapters/${ch.slug}`}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 flex-1 min-w-0 ${
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
                  {/* Expand toggle for prompts chapter */}
                  {isPrompts && !collapsed && (
                    <button
                      onClick={() => setPromptExpanded((v) => !v)}
                      className="p-1.5 rounded opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
                      title={promptExpanded ? "收起" : "展开目录"}
                    >
                      <ChevronDown
                        size={13}
                        style={{
                          transform: promptExpanded ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s ease",
                        }}
                      />
                    </button>
                  )}
                </div>

                {/* Prompt sub-navigation */}
                {isPrompts && !collapsed && promptExpanded && (
                  <div
                    className="ml-4 mt-0.5 mb-1 space-y-0.5 pl-3"
                    style={{ borderLeft: `1px solid ${ch.color}30` }}
                  >
                    {PROMPT_CATEGORIES.map((cat, ci) => (
                      <a
                        key={ci}
                        href={`/chapters/prompts#${cat.id}`}
                        className="block px-2 py-1 rounded text-xs transition-colors opacity-70 hover:opacity-100 truncate"
                        style={{ color: cat.color }}
                      >
                        {cat.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
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
