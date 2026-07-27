import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import CustomDropdown from '../../../components/common/CustomDropdown';
import SuccessModal from '../../../components/common/SuccessModal';

const AdminAddStudent = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Active');

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
  };

  const handleContinue = () => {
    navigate('/admin/students');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/admin/students" className="flex items-center gap-2 text-caption hover:text-primary transition-colors mb-2 font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Students
          </Link>
          <h1 className="text-3xl font-heading font-bold text-heading">Add New Student</h1>
        </div>
      </div>

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-border shadow-sm p-8 space-y-6">
          <div className="border-b border-border pb-6">
            <h2 className="text-lg font-bold text-heading mb-1">Account Information</h2>
            <p className="text-sm text-caption">Create a new student account. They will be asked to complete their profile upon first login.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-heading">Full Name</label>
              <input type="text" required placeholder="John Doe" className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-heading">Email Address</label>
              <input type="email" required placeholder="john@example.com" className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-heading">Phone Number</label>
              <input type="tel" placeholder="+1 (555) 000-0000" className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-heading">Temporary Password</label>
              <input type="text" required placeholder="e.g. TempPass123!" className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
              <p className="text-xs text-caption mt-1">Student will be required to change this upon login.</p>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-bold text-heading">Initial Status</label>
              <CustomDropdown 
                value={status}
                onChange={setStatus}
                options={[
                  { label: 'Active', value: 'Active' },
                  { label: 'Inactive', value: 'Inactive' }
                ]}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-border flex justify-end gap-3">
            <Link to="/admin/students" className="px-6 py-2.5 font-bold text-heading hover:bg-gray-50 border border-transparent rounded-xl transition-colors">
              Cancel
            </Link>
            <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm">
              <Save className="w-4 h-4" />
              Create Student
            </button>
          </div>
        </form>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        title="Student Created Successfully!"
        message="The new student account has been set up successfully. They can now log in using the temporary password."
        onContinue={handleContinue}
      />
    </div>
  );
};

export default AdminAddStudent;
