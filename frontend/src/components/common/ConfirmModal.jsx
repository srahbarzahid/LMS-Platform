import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  title,
  message,
  expectedTitle,
  onConfirm,
  onCancel,
  confirmText = "Confirm Delete",
  cancelText = "Cancel",
  isDestructive = true
}) => {
  const [typedTitle, setTypedTitle] = useState("");

  useEffect(() => {
    if (isOpen) setTypedTitle("");
  }, [isOpen]);

  if (!isOpen) return null;

  const isMatch = expectedTitle
    ? typedTitle.trim().toLowerCase() === String(expectedTitle).trim().toLowerCase()
    : true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-border">
        <div className="flex items-start justify-between mb-5">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              isDestructive ? "bg-red-50 text-red-600" : "bg-primary/10 text-primary"
            }`}
          >
            <AlertTriangle className="w-7 h-7" />
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-caption hover:text-heading transition-colors bg-gray-50 hover:bg-gray-100 p-2 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-xl font-heading font-bold text-heading mb-2">{title}</h3>
        <p className="text-sm text-caption mb-4 leading-relaxed">{message}</p>

        {expectedTitle && (
          <div className="mb-6 space-y-2 bg-red-50/50 p-4 rounded-2xl border border-red-100">
            <p className="text-xs font-bold text-red-800">
              To confirm deletion, please type <span className="font-extrabold select-all underline">"{expectedTitle}"</span> below:
            </p>
            <input
              type="text"
              value={typedTitle}
              onChange={(e) => setTypedTitle(e.target.value)}
              placeholder={`Type "${expectedTitle}" to confirm`}
              autoFocus
              className="w-full bg-white border border-red-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-500 font-bold text-heading shadow-xs"
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 font-bold text-heading bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!isMatch}
            className={`flex-1 px-4 py-3 font-bold text-white rounded-xl transition-all cursor-pointer ${
              !isMatch
                ? "bg-gray-300 opacity-50 cursor-not-allowed"
                : isDestructive
                ? "bg-red-600 hover:bg-red-700 shadow-md"
                : "bg-primary hover:bg-primary/90 shadow-md"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
