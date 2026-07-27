import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, ListTree, Star, BookOpen, Crown } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import toast from 'react-hot-toast';
import CategoryTable, { type Column } from '../../../components/admin/categories/CategoryTable';
import CategoryFormModal from '../../../components/admin/categories/CategoryFormModal';
import CategoryDetailsModal from '../../../components/admin/categories/CategoryDetailsModal';
import CustomDropdown from '../../../components/common/CustomDropdown';
import SuccessModal from '../../../components/common/SuccessModal';
import ConfirmModal from '../../../components/common/ConfirmModal';

const AdminCategories = () => {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<any>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('All');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewingCategory, setViewingCategory] = useState<any>(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [actionConfirm, setActionConfirm] = useState<{isOpen: boolean, category: any | null, type: 'delete' | 'feature' | null}>({isOpen: false, category: null, type: null});

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/categories?page=${page}&limit=10&search=${searchTerm}&featured=${featuredFilter}`);
      setData(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setStats(res.data.stats);
    } catch (err) {
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, searchTerm, featuredFilter]);

  const handleAction = async (action: string, row: any) => {
    try {
      if (action === 'delete') {
        setActionConfirm({ isOpen: true, category: row, type: 'delete' });
      } else if (action === 'toggleFeatured') {
        setActionConfirm({ isOpen: true, category: row, type: 'feature' });
      } else if (action === 'edit') {
        setEditingCategory(row);
        setIsFormOpen(true);
      } else if (action === 'view') {
        setViewingCategory(row);
        setIsDetailsOpen(true);
      }
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingCategory) {
        await axios.put(`http://localhost:5000/api/admin/categories/${editingCategory.id}`, formData);
        setSuccessMessage('Category has been successfully updated.');
      } else {
        await axios.post(`http://localhost:5000/api/admin/categories`, formData);
        setSuccessMessage('New category has been successfully created.');
      }
      fetchCategories();
      setIsFormOpen(false);
      setShowSuccess(true);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Operation failed');
      throw err;
    }
  };

  const handleConfirmAction = async () => {
    if (!actionConfirm.category || !actionConfirm.type) return;
    try {
      if (actionConfirm.type === 'delete') {
        await axios.delete(`http://localhost:5000/api/admin/categories/${actionConfirm.category.id}`);
        toast.success('Category deleted successfully');
      } else if (actionConfirm.type === 'feature') {
        await axios.patch(`http://localhost:5000/api/admin/categories/${actionConfirm.category.id}/featured`, {
          featured: !actionConfirm.category.featured
        });
        toast.success(`Category ${!actionConfirm.category.featured ? 'featured' : 'unfeatured'} successfully`);
      }
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Action failed');
    } finally {
      setActionConfirm({ isOpen: false, category: null, type: null });
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  // Helper to render dynamic icon
  const renderIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.Folder;
    return <Icon className="w-5 h-5 text-primary" />;
  };

  const columns: Column[] = [
    { 
      key: 'name', 
      label: 'Category Name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            {renderIcon(row.icon)}
          </div>
          <div className="font-bold text-heading">{val}</div>
        </div>
      )
    },
    { 
      key: 'description', 
      label: 'Description',
      render: (val) => (
        <div className="text-caption truncate max-w-[250px]" title={val}>
          {val || '-'}
        </div>
      )
    },
    { 
      key: 'totalCourses', 
      label: 'Total Courses', 
      render: (val) => <span className="font-bold">{val}</span> 
    },
    {
      key: 'featured',
      label: 'Featured',
      render: (val) => (
        val ? (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-purple-50 text-purple-600 border-purple-200 inline-flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" /> Yes
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-gray-100 text-gray-500 border-gray-200">
            No
          </span>
        )
      )
    },
    { 
      key: 'createdAt', 
      label: 'Created Date',
      render: (val) => (
        <span className="text-caption font-medium text-sm">{new Date(val).toLocaleDateString()}</span>
      )
    }
  ];

  const statCards = stats ? [
    { label: 'Total Categories', value: stats.totalCategories, icon: ListTree, color: 'bg-blue-50 text-blue-600' },
    { label: 'Featured Categories', value: stats.featuredCategories, icon: Star, color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Courses', value: stats.totalCourses, icon: BookOpen, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Most Popular', value: stats.mostPopularCategory, icon: Crown, color: 'bg-yellow-50 text-yellow-600' }
  ] : [];

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-heading mb-2">Categories</h1>
          <p className="text-body">Organize and manage course categories across the platform.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm">
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        </div>
      </div>

      {statCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className="relative overflow-hidden bg-white p-4 rounded-xl border border-border group hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-500 pointer-events-none text-gray-900">
                  <Icon className="w-24 h-24" />
                </div>

                <div className="flex justify-between items-start mb-3 relative z-10">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="relative z-10">
                  <div className="text-2xl font-heading font-black text-heading tracking-tight leading-tight">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </div>
                  <div className="text-[10px] font-bold text-caption uppercase tracking-wider mt-0.5">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CategoryTable 
        entityName="Categories"
        columns={columns}
        data={data}
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onSearch={setSearchTerm}
        onAction={handleAction}
        searchPlaceholder="Search categories by name..."
        filters={
          <CustomDropdown 
            value={featuredFilter} 
            onChange={(val) => setFeaturedFilter(val)}
            options={[
              { label: 'All Categories', value: 'All' },
              { label: 'Featured Only', value: 'Featured' },
              { label: 'Regular Only', value: 'Regular' }
            ]}
          />
        }
      />

      <CategoryFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit}
        initialData={editingCategory}
      />

      <CategoryDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        category={viewingCategory}
      />

      <SuccessModal
        isOpen={showSuccess}
        title={editingCategory ? "Category Updated!" : "Category Created!"}
        message={successMessage}
        onContinue={() => setShowSuccess(false)}
      />

      <ConfirmModal
        isOpen={actionConfirm.isOpen}
        title={actionConfirm.type === 'delete' ? "Delete Category" : actionConfirm.category?.featured ? "Unfeature Category" : "Feature Category"}
        message={
          actionConfirm.type === 'delete' 
            ? `Are you sure you want to delete the "${actionConfirm.category?.name}" category? This action cannot be undone.`
            : `Are you sure you want to ${actionConfirm.category?.featured ? 'unfeature' : 'feature'} the "${actionConfirm.category?.name}" category?`
        }
        onConfirm={handleConfirmAction}
        onCancel={() => setActionConfirm({ isOpen: false, category: null, type: null })}
        confirmText={actionConfirm.type === 'delete' ? "Yes, Delete" : "Yes, Confirm"}
        cancelText="Cancel"
        isDestructive={actionConfirm.type === 'delete'}
      />
    </div>
  );
};

export default AdminCategories;
