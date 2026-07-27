import { useState, useEffect } from 'react';
import { 
  FileText, Plus, Search, Edit, Copy, 
  Trash2, CheckCircle, Layout, Eye, ChevronRight, Save, X, UploadCloud
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ConfirmModal from '../../../components/common/ConfirmModal';
import CertificateTemplateEditor from '../../../components/admin/certificates/CertificateTemplateEditor';
import type { FieldPosition } from '../../../components/admin/certificates/CertificateTemplateEditor';

const AdminCertificateTemplates = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [editId, setEditId] = useState<string | null>(null);
  const [modalStep, setModalStep] = useState(1);
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, id: string | null}>({ isOpen: false, id: null });
  
  const initialFormData = {
    name: '',
    orientation: 'landscape',
    description: '',
    background: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2874&auto=format&fit=crop',
    status: 'Active',
    fieldPositions: {
      studentName: { x: 20, y: 40, width: 60, height: 10, fontSize: 32, alignment: 'center', visible: true, color: '#000000' },
      courseName: { x: 10, y: 55, width: 80, height: 10, fontSize: 24, alignment: 'center', visible: true, color: '#333333' },
      instructorName: { x: 10, y: 75, width: 30, height: 5, fontSize: 16, alignment: 'left', visible: true, color: '#000000' },
      completionDate: { x: 60, y: 75, width: 30, height: 5, fontSize: 16, alignment: 'right', visible: true, color: '#000000' },
      issueDate: { x: 60, y: 80, width: 30, height: 5, fontSize: 16, alignment: 'right', visible: true, color: '#000000' },
      certificateId: { x: 30, y: 90, width: 40, height: 5, fontSize: 12, alignment: 'center', visible: true, color: '#666666' },
      qrCode: { x: 5, y: 80, width: 10, height: 15, fontSize: 12, alignment: 'center', visible: true, color: '#000000' }
    } as Record<string, FieldPosition>
  };

  const [formData, setFormData] = useState(initialFormData);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('http://localhost:5000/api/admin/certificate/templates', { withCredentials: true });
      if (res.data.success) {
        setTemplates(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch templates', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSetDefault = async (id: string) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/certificate/templates/${id}/default`, {}, { withCredentials: true });
      fetchTemplates();
    } catch (error) {
      console.error('Failed to set default', error);
    }
  };

  const confirmDelete = (id: string, isDefault: boolean) => {
    if (isDefault) {
      toast.error('Cannot delete the default template.');
      return;
    }
    setDeleteModal({ isOpen: true, id });
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/certificate/templates/${deleteModal.id}`, { withCredentials: true });
      toast.success('Template deleted successfully');
      fetchTemplates();
    } catch (error) {
      toast.error('Failed to delete template');
      console.error('Failed to delete', error);
    } finally {
      setDeleteModal({ isOpen: false, id: null });
    }
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditId(null);
    setFormData({ ...initialFormData });
    setIsModalOpen(true);
    setModalStep(1);
  };

  const handleEdit = (template: any) => {
    setModalMode('edit');
    setEditId(template.id || template._id);
    setFormData({
      name: template.name,
      orientation: template.orientation,
      description: template.description || '',
      background: template.background,
      status: template.status,
      fieldPositions: template.fieldPositions
    });
    setIsModalOpen(true);
    setModalStep(1);
  };

  const handleDuplicate = (template: any) => {
    setModalMode('create');
    setEditId(null);
    setFormData({
      name: `${template.name} (Copy)`,
      orientation: template.orientation,
      description: template.description || '',
      background: template.background,
      status: 'Draft',
      fieldPositions: template.fieldPositions
    });
    setIsModalOpen(true);
    setModalStep(1);
  };

  const handleView = (template: any) => {
    setModalMode('view');
    setEditId(null);
    setFormData({
      name: template.name,
      orientation: template.orientation,
      description: template.description || '',
      background: template.background,
      status: template.status,
      fieldPositions: template.fieldPositions
    });
    setIsModalOpen(true);
    setModalStep(2); // Jump to preview step
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'view') {
      setIsModalOpen(false);
      return;
    }
    
    try {
      if (modalMode === 'edit' && editId) {
        await axios.put(`http://localhost:5000/api/admin/certificate/templates/${editId}`, formData, { withCredentials: true });
        toast.success('Updated Successfully', {
          position: 'bottom-right',
          style: { background: '#10B981', color: '#ffffff', fontWeight: '600' },
          iconTheme: { primary: '#ffffff', secondary: '#10B981' },
        });
      } else {
        await axios.post('http://localhost:5000/api/admin/certificate/templates', formData, { withCredentials: true });
        toast.success('Created Successfully', {
          position: 'bottom-right',
          style: { background: '#10B981', color: '#ffffff', fontWeight: '600' },
          iconTheme: { primary: '#ffffff', secondary: '#10B981' },
        });
      }
      
      setIsModalOpen(false);
      setModalStep(1);
      setFormData({ ...initialFormData });
      fetchTemplates();
    } catch (error) {
      toast.error(`Failed to ${modalMode} template`);
      console.error(`Failed to ${modalMode}`, error);
    }
  };

  const filteredTemplates = templates.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const activeTemplates = templates.filter(t => t.status === 'Active').length;
  const draftTemplates = templates.filter(t => t.status === 'Draft').length;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 1MB = 1048576 bytes)
    if (file.size > 1048576) {
      toast.error('File size must be less than 1MB');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, background: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const isStep1Valid = formData.name.trim() !== '' && formData.description.trim() !== '' && formData.background !== '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">Certificate Templates</h1>
          <p className="text-body mt-1">Create and manage certificate templates for course completion.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2 hover:-translate-y-0.5 border border-orange-400/50"
        >
          <Plus className="w-4 h-4" />
          Create Template
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-caption font-medium">Total Templates</p>
            <h3 className="text-2xl font-bold text-heading">{templates.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-caption font-medium">Active Templates</p>
            <h3 className="text-2xl font-bold text-heading">{activeTemplates}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center">
            <Edit className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-caption font-medium">Draft Templates</p>
            <h3 className="text-2xl font-bold text-heading">{draftTemplates}</h3>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-border flex justify-between items-center bg-gray-50/50">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-caption" />
            <input 
              type="text" 
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-gray-50 text-xs font-semibold text-caption uppercase tracking-wider">
                <th className="px-6 py-4">Template Name</th>
                <th className="px-6 py-4">Orientation</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-heading divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-caption">Loading templates...</td>
                </tr>
              ) : filteredTemplates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-caption">No templates found.</td>
                </tr>
              ) : (
                filteredTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-8 rounded border border-border overflow-hidden bg-gray-100 flex-shrink-0">
                           <img src={template.background} alt="bg" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium">{template.name}</p>
                          {template.isDefault && <span className="inline-block mt-1 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Default</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize text-body flex items-center gap-2">
                      <Layout className="w-4 h-4 text-caption" />
                      {template.orientation}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        template.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {template.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-body">
                      {new Date(template.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleView(template)}
                          className="p-2 text-caption hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(template)}
                          className="p-2 text-caption hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        {!template.isDefault && (
                          <button 
                            onClick={() => handleSetDefault(template.id || template._id)}
                            className="p-2 text-caption hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Set as Default">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDuplicate(template)}
                          className="p-2 text-caption hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Duplicate">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => confirmDelete(template.id || template._id, template.isDefault)}
                          disabled={template.isDefault}
                          className={`p-2 rounded-lg transition-colors ${template.isDefault ? 'text-gray-300 cursor-not-allowed' : 'text-caption hover:text-red-600 hover:bg-red-50'}`} 
                          title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-[95vw] h-[95vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-heading capitalize">
                  {modalMode === 'view' ? 'View Template' : modalMode === 'edit' ? 'Edit Template' : 'Create Template'}: {modalStep === 1 ? 'Details' : 'Visual Editor'}
                </h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className={`px-2.5 py-1 rounded-full ${modalStep === 1 ? 'bg-primary text-white font-medium' : 'bg-gray-200 text-gray-500'}`}>1. Details</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <span className={`px-2.5 py-1 rounded-full ${modalStep === 2 ? 'bg-primary text-white font-medium' : 'bg-gray-200 text-gray-500'}`}>2. Visual Editor</span>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
              {modalStep === 1 ? (
                <div className="p-8 max-w-2xl mx-auto w-full space-y-6 overflow-y-auto">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 text-sm">
                    <strong>Note:</strong> Upload a professionally designed certificate background (without text). You will configure where dynamic text like Student Name and Course Name appear in the next step.
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1">Template Name</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} disabled={modalMode === 'view'} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-1 focus:ring-primary outline-none disabled:bg-gray-100" placeholder="e.g. Standard 2026" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1">Description</label>
                    <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} disabled={modalMode === 'view'} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-1 focus:ring-primary outline-none disabled:bg-gray-100" placeholder="Optional description"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1">Background Image/PDF</label>
                    <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-colors bg-white relative ${modalMode === 'view' ? 'border-gray-200' : 'border-gray-300 hover:border-primary'}`}>
                      <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label
                            htmlFor="file-upload"
                            className={`relative cursor-pointer bg-white rounded-md font-medium focus-within:outline-none ${modalMode === 'view' ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:text-primary/80'}`}
                          >
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileUpload} disabled={modalMode === 'view'} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, PDF up to 1MB
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1">Orientation</label>
                    <select value={formData.orientation} onChange={e => setFormData({...formData, orientation: e.target.value})} disabled={modalMode === 'view'} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-1 focus:ring-primary outline-none disabled:bg-gray-100">
                      <option value="landscape">Landscape</option>
                      <option value="portrait">Portrait</option>
                    </select>
                  </div>
                  
                  {formData.background && (
                    <div className="mt-4 border border-border rounded-lg p-2 bg-gray-50">
                      <p className="text-xs text-caption mb-2 font-medium">Background Preview:</p>
                      {formData.background.startsWith('data:application/pdf') ? (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-500 bg-white border border-gray-200 rounded">
                           <FileText className="w-12 h-12 mb-2 text-primary/50" />
                           <p className="text-sm font-medium">PDF File Uploaded</p>
                        </div>
                      ) : (
                        <img src={formData.background} alt="Preview" className="w-full max-h-64 object-contain rounded" />
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className={`flex-1 overflow-hidden p-4 ${modalMode === 'view' ? 'pointer-events-none' : ''}`}>
                  <CertificateTemplateEditor 
                    backgroundUrl={formData.background}
                    fieldPositions={formData.fieldPositions}
                    onChange={(positions) => setFormData({ ...formData, fieldPositions: positions })}
                  />
                </div>
              )}
            </div>

            <div className="p-5 border-t border-border bg-white flex justify-between items-center relative z-10 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)]">
              {modalStep === 2 ? (
                <button type="button" onClick={() => setModalStep(1)} className="px-6 py-2.5 border border-border text-heading rounded-xl hover:bg-gray-50 transition-all font-medium flex items-center gap-2 hover:-translate-y-0.5">Back</button>
              ) : (
                <div></div>
              )}
              
              <div className="flex gap-3 items-center">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-caption hover:text-heading hover:bg-gray-100 rounded-xl transition-colors font-medium">
                  {modalMode === 'view' ? 'Close' : 'Cancel'}
                </button>
                {modalMode !== 'view' && (
                  modalStep === 1 ? (
                    <button 
                      type="button" 
                      onClick={() => setModalStep(2)} 
                      disabled={!isStep1Valid}
                      className="px-8 py-2.5 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
                    >
                      Next Step <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button type="button" onClick={handleSave} className="px-8 py-2.5 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all font-medium flex items-center gap-2">
                      <Save className="w-5 h-5" /> {modalMode === 'edit' ? 'Update' : 'Save'} Template
                    </button>
                  )
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Template"
        message="Are you sure you want to delete this certificate template? This action cannot be undone."
        confirmText="Delete Template"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: null })}
      />
    </div>
  );
};

export default AdminCertificateTemplates;
