import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
}

const AVAILABLE_ICONS = [
  'Cpu', 'BrainCircuit', 'Wifi', 'Microchip', 'Layout', 'Server', 
  'Code', 'Layers', 'Box', 'PenTool', 'Folder', 'BookOpen', 'Monitor'
];

const CategoryFormModal = ({ isOpen, onClose, onSubmit, initialData }: CategoryFormModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Folder',
    featured: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          description: initialData.description,
          icon: initialData.icon,
          featured: initialData.featured
        });
      } else {
        setFormData({
          name: '',
          description: '',
          icon: 'Folder',
          featured: false
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Category Name is required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-heading font-bold text-heading">
            {initialData ? 'Edit Category' : 'Add Category'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-caption">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="categoryForm" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-heading mb-2">Category Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Artificial Intelligence"
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-heading mb-2">Short Description</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Briefly describe this category..."
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all h-24 resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-heading mb-2">Category Icon Name</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white"
              >
                {AVAILABLE_ICONS.map(iconName => (
                  <option key={iconName} value={iconName}>{iconName}</option>
                ))}
              </select>
              <p className="text-xs text-caption mt-1">Select an icon name from the Lucide library.</p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => setFormData({...formData, featured: !formData.featured})}
                className={`w-12 h-6 rounded-full relative transition-colors ${formData.featured ? 'bg-primary' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${formData.featured ? 'left-7' : 'left-1'}`}></div>
              </button>
              <label className="text-sm font-bold text-heading">Featured Category</label>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-3 bg-gray-50/50">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-heading hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="categoryForm"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Check className="w-5 h-5" />
            )}
            {initialData ? 'Save Changes' : 'Create Category'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryFormModal;
