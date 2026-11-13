"use client";

import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Branded Yes / No confirmation, used instead of the browser's plain confirm() box.
 * Cancel is the default action (focus), so a stray Enter never destroys anything.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Are you sure?",
  description,
  confirmLabel = "Yes",
  cancelLabel = "No",
  destructive = true,
  loading = false,
  onConfirm,
}) {
  const Icon = destructive ? Trash2 : AlertTriangle;
  return (
    <Dialog open={open} onOpenChange={(next) => !loading && onOpenChange(next)}>
      <DialogContent className="max-w-[calc(100vw-2rem)] rounded-2xl border border-[#E9E2D5] bg-[#FDFBF7] p-6 sm:max-w-md">
        <DialogHeader className="items-center text-center sm:text-center">
          <span
            className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${
              destructive ? "bg-red-50 text-red-600" : "bg-[#F7F3EB] text-[#B08D57]"
            }`}
          >
            <Icon className="h-5 w-5" />
          </span>
          <DialogTitle className="font-display text-xl text-[#002216]">{title}</DialogTitle>
          {description && (
            <DialogDescription className="mt-1 text-sm leading-relaxed text-neutral-500">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <DialogFooter className="mt-4 flex-col-reverse gap-2 sm:flex-row sm:justify-center sm:gap-3">
          <button
            type="button"
            autoFocus
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="h-11 flex-1 rounded-lg border border-neutral-300 bg-white text-xs font-semibold uppercase tracking-widest text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50 sm:flex-none sm:px-8"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-lg text-xs font-semibold uppercase tracking-widest text-white transition disabled:opacity-60 sm:flex-none sm:px-8 ${
              destructive ? "bg-red-600 hover:bg-red-700" : "bg-[#003E29] hover:bg-[#002216]"
            }`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDialog;
