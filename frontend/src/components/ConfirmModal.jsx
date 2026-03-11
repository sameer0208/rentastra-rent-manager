import React from "react";

export default function ConfirmModal({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  danger = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm"
        onClick={() => !loading && onCancel()}
      />

      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm p-6 animate-scaleIn border border-slate-200 dark:border-slate-600">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
          {title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            disabled={loading}
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 disabled:opacity-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            disabled={loading}
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2 disabled:opacity-80 transition-all ${
              danger
                ? "bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
                : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            }`}
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
