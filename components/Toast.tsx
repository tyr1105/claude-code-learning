"use client";

import { useEffect, useState, useCallback } from "react";
import { Check } from "lucide-react";

interface ToastMessage {
  id: number;
  text: string;
  exiting?: boolean;
}

let toastId = 0;
const listeners: Set<(msg: ToastMessage) => void> = new Set();

export function showToast(text: string) {
  const msg: ToastMessage = { id: ++toastId, text };
  listeners.forEach((fn) => fn(msg));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((msg: ToastMessage) => {
    setToasts((prev) => [...prev, msg]);
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === msg.id ? { ...t, exiting: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== msg.id));
      }, 300);
    }, 2000);
  }, []);

  useEffect(() => {
    listeners.add(addToast);
    return () => { listeners.delete(addToast); };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${t.exiting ? "toast-exit" : "toast"} flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm mb-2`}
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          <Check size={14} className="text-green-500" />
          {t.text}
        </div>
      ))}
    </div>
  );
}
