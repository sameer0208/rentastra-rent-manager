import { X } from "lucide-react";

export default function DocumentViewModal({ doc, onClose }) {
  if (!doc) return null;

  const isPdf = doc.url?.toLowerCase?.().endsWith(".pdf") ?? false;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in border border-slate-200 dark:border-slate-600"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate pr-2">
            {doc.name || doc.documentType || "Document"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-auto max-h-[calc(90vh-56px)] bg-slate-100 dark:bg-slate-900/50">
          {isPdf ? (
            <iframe
              src={doc.url}
              title={doc.name || "Document"}
              className="w-full h-[75vh] rounded-lg border border-slate-200 dark:border-slate-600 bg-white"
            />
          ) : (
            <img
              src={doc.url}
              alt={doc.name || "Document"}
              className="max-w-full max-h-[75vh] mx-auto rounded-lg shadow-lg object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}
