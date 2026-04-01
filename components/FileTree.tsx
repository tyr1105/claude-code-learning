import { FileText } from "lucide-react";
import type { FileInfo } from "@/data/chapters";

interface FileTreeProps {
  files: FileInfo[];
}

export default function FileTree({ files }: FileTreeProps) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
    >
      <div
        className="px-4 py-3 text-sm font-semibold"
        style={{ borderBottom: "1px solid var(--card-border)" }}
      >
        核心文件
      </div>
      <div className="divide-y" style={{ borderColor: "var(--card-border)" }}>
        {files.map((f) => (
          <div
            key={f.path}
            className="flex items-start gap-3 px-4 py-3 hover:opacity-80 transition-opacity"
          >
            <FileText size={16} className="mt-0.5 flex-shrink-0" style={{ color: "var(--accent)" }} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono font-semibold truncate">
                  {f.path}
                </code>
                <span
                  className="text-xs px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{ background: "var(--accent)" + "20", color: "var(--accent)" }}
                >
                  {f.lines.toLocaleString()} LOC
                </span>
              </div>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                {f.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
