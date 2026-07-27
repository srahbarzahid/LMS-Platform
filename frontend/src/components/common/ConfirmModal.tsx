import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

const ConfirmModal = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  isDestructive = true 
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-xl border border-border">
        <div className="flex items-start justify-between mb-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${isDestructive ? 'bg-red-50 text-red-600' : 'bg-primary/10 text-primary'}`}>
            <AlertTriangle className="w-7 h-7" />
          </div>
          <button onClick={onCancel} className="text-caption hover:text-heading transition-colors bg-gray-50 hover:bg-gray-100 p-2 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <h3 className="text-2xl font-heading font-bold text-heading mb-2">{title}</h3>
        <p className="text-body mb-8 leading-relaxed">{message}</p>
        
        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 px-4 py-3 font-bold text-heading bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 font-bold text-white rounded-xl transition-colors ${
              isDestructive ? 'bg-red-600 hover:bg-red-700 shadow-sm' : 'bg-primary hover:bg-primary/90 shadow-sm'
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
