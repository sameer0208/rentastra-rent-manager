export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-600 animate-scaleIn">
        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200 dark:border-slate-600">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
