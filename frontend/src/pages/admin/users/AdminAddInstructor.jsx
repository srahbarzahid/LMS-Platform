import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import CustomDropdown from "../../../components/common/CustomDropdown";
import SuccessModal from "../../../components/common/SuccessModal";
const AdminAddInstructor = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("Active");
  const [showSuccess, setShowSuccess] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/admin/users/instructors", {
        name,
        email,
        phone,
        status
      });
      setShowSuccess(true);
    } catch (err) {
      toast.error("Failed to create instructor");
    }
  };
  const handleContinue = () => {
    navigate("/admin/instructors");
  };
  return <div className="p-8">
      {
    /* Header */
  }
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/admin/instructors" className="flex items-center gap-2 text-caption hover:text-primary transition-colors mb-2 font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Instructors
          </Link>
          <h1 className="text-3xl font-heading font-bold text-heading">Add New Instructor</h1>
        </div>
      </div>

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-border shadow-sm p-8 space-y-6">
          <div className="border-b border-border pb-6">
            <h2 className="text-lg font-bold text-heading mb-1">Account Information</h2>
            <p className="text-sm text-caption">Create a new instructor account. They will be asked to complete their professional profile (Bio, Qualification, Experience) upon first login.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-heading">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Jane Smith" className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-heading">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="jane@example.com" className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-heading">Phone Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-heading">Temporary Password</label>
              <input type="text" required placeholder="e.g. TempPass123!" className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
              <p className="text-xs text-caption mt-1">Instructor will be required to change this upon login.</p>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-bold text-heading">Initial Status</label>
              <CustomDropdown
    value={status}
    onChange={setStatus}
    options={[
      { label: "Active", value: "Active" },
      { label: "Inactive", value: "Inactive" }
    ]}
  />
            </div>
          </div>

          <div className="pt-6 border-t border-border flex justify-end gap-3">
            <Link to="/admin/instructors" className="px-6 py-2.5 font-bold text-heading hover:bg-gray-50 border border-transparent rounded-xl transition-colors">
              Cancel
            </Link>
            <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm">
              <Save className="w-4 h-4" />
              Create Instructor
            </button>
          </div>
        </form>
      </div>

      <SuccessModal
    isOpen={showSuccess}
    title="Instructor Created Successfully!"
    message="The new instructor account has been created. They can now log in and complete their professional profile."
    onContinue={handleContinue}
  />
    </div>;
};
var stdin_default = AdminAddInstructor;
export {
  stdin_default as default
};
