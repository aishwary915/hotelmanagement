"use client";

import { useEffect } from "react";
import { useDemoStore } from "@/stores/demo-store";
import { Button } from "@/components/demo/ui/Button";

export function ToastHost() {
  const toast = useDemoStore((s) => s.toast);
  const setToast = useDemoStore((s) => s.setToast);
  const undoStack = useDemoStore((s) => s.undoStack);
  const undo = useDemoStore((s) => s.undo);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(t);
  }, [toast, setToast]);

  if (!toast) return null;

  return (
    <div
      role="status"
      className="fixed bottom-5 left-1/2 z-50 flex max-w-[92vw] -translate-x-1/2 items-center gap-3 rounded-xl bg-ink px-4 py-3 text-center text-sm font-semibold text-bg shadow-lg"
    >
      <span>{toast}</span>
      {undoStack ? (
        <Button variant="ghost" className="!border-white/30 !py-1 !text-bg" onClick={undo}>
          Undo
        </Button>
      ) : null}
    </div>
  );
}
