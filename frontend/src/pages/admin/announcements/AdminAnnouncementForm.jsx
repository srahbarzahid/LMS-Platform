import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  Clock,
  Calendar,
  CheckCircle,
  Upload
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import CustomDropdown from "../../../components/common/CustomDropdown";
const AdminAnnouncementForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);
  const [formData, setFormData] = useState({
    title: "",
    type: "General Announcement",
    audience: "All Users",
    targetId: "",
    // For Specific Course/Student/Instructor
    message: "",
    priority: "Medium",
    publishOption: "Publish Now",
    publishDate: "",
    expiryDate: "",
    sendDashboardNotification: true,
    sendEmailNotification: false
  });
  useEffect(() => {
    if (isEditMode) {
      fetchAnnouncement();
    }
  }, [id]);
  const fetchAnnouncement = async () => {
    try {
      setIsFetching(true);
      const res = await axios.get(`http://localhost:5000/api/admin/announcements/${id}`, { withCredentials: true });
      if (res.data.success) {
        const data = res.data.data;
        setFormData({
          title: data.title || "",
          type: data.type || "General Announcement",
          audience: data.audience || "All Users",
          targetId: data.targetId || "",
          message: data.message || "",
          priority: data.priority || "Medium",
          publishOption: data.publishOption || "Publish Now",
          publishDate: data.publishDate ? new Date(data.publishDate).toISOString().slice(0, 16) : "",
          expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString().slice(0, 16) : "",
          sendDashboardNotification: data.sendDashboardNotification ?? true,
          sendEmailNotification: data.sendEmailNotification ?? false
        });
      }
    } catch (error) {
      console.error("Failed to fetch announcement", error);
      toast.error("Failed to load announcement details");
      navigate("/admin/announcements");
    } finally {
      setIsFetching(false);
    }
  };
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = e.target.checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleActionClick = (publishOption) => {
    setFormData((prev) => ({ ...prev, publishOption }));
    handleSubmit(publishOption);
  };
  const handleSubmit = async (publishOption = formData.publishOption) => {
    if (!formData.title || !formData.message) {
      toast.error("Title and message are required");
      return;
    }
    if (formData.audience.startsWith("Specific") && !formData.targetId) {
      toast.error("Please specify the target ID (Course/User) for the specific audience");
      return;
    }
    try {
      setIsLoading(true);
      const payload = { ...formData, publishOption };
      let res;
      if (isEditMode) {
        res = await axios.put(`http://localhost:5000/api/admin/announcements/${id}`, payload, { withCredentials: true });
      } else {
        res = await axios.post("http://localhost:5000/api/admin/announcements", payload, { withCredentials: true });
      }
      if (res.data.success) {
        toast.success(`Announcement ${isEditMode ? "updated" : "created"} successfully`);
        navigate("/admin/announcements");
      }
    } catch (error) {
      console.error("Failed to save announcement", error);
      toast.error("Failed to save announcement");
    } finally {
      setIsLoading(false);
    }
  };
  if (isFetching) {
    return <div className="p-8 text-center text-body">Loading...</div>;
  }
  return <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {
    /* Header */
  }
      <div className="flex items-center gap-4">
        <button
    onClick={() => navigate("/admin/announcements")}
    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-body"
  >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-heading">
            {isEditMode ? "Edit Announcement" : "Create Announcement"}
          </h1>
          <p className="text-body mt-1">Configure and publish an official notice.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          
          {
    /* Section: Basic Info */
  }
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-heading border-b border-border pb-2">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-bold text-heading mb-1">Announcement Title *</label>
              <input
    type="text"
    name="title"
    value={formData.title}
    onChange={handleChange}
    placeholder="e.g., Platform Maintenance on Sunday"
    className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
    required
  />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-heading mb-1">Announcement Type *</label>
                <CustomDropdown
    value={formData.type}
    onChange={(val) => setFormData((prev) => ({ ...prev, type: val }))}
    options={[
      { label: "General Announcement", value: "General Announcement" },
      { label: "Course Update", value: "Course Update" },
      { label: "Maintenance Notice", value: "Maintenance Notice" },
      { label: "New Course Launch", value: "New Course Launch" },
      { label: "Offer / Discount", value: "Offer / Discount" },
      { label: "System Update", value: "System Update" },
      { label: "Event Announcement", value: "Event Announcement" },
      { label: "Important Notice", value: "Important Notice" }
    ]}
    className="w-full"
  />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-heading mb-1">Priority</label>
                <CustomDropdown
    value={formData.priority}
    onChange={(val) => setFormData((prev) => ({ ...prev, priority: val }))}
    options={[
      { label: "Low", value: "Low" },
      { label: "Medium", value: "Medium" },
      { label: "High", value: "High" }
    ]}
    className="w-full"
  />
              </div>
            </div>
          </div>

          {
    /* Section: Audience */
  }
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-heading border-b border-border pb-2">Target Audience</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-heading mb-1">Send to *</label>
                <CustomDropdown
    value={formData.audience}
    onChange={(val) => setFormData((prev) => ({ ...prev, audience: val }))}
    options={[
      { label: "All Users", value: "All Users" },
      { label: "All Students", value: "All Students" },
      { label: "All Instructors", value: "All Instructors" },
      { label: "Specific Course Students", value: "Specific Course Students" },
      { label: "Specific Instructor", value: "Specific Instructor" },
      { label: "Specific Student", value: "Specific Student" }
    ]}
    className="w-full z-10"
  />
              </div>

              {formData.audience.startsWith("Specific") && <div>
                  <label className="block text-sm font-bold text-heading mb-1">
                    {formData.audience === "Specific Course Students" ? "Course ID" : "User ID"} *
                  </label>
                  <input
    type="text"
    name="targetId"
    value={formData.targetId}
    onChange={handleChange}
    placeholder={`Enter ${formData.audience === "Specific Course Students" ? "course" : "user"} ID`}
    className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
    required
  />
                  <p className="text-xs text-caption mt-1">In a real app, this would be a searchable dropdown.</p>
                </div>}
            </div>
          </div>

          {
    /* Section: Content */
  }
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-heading border-b border-border pb-2">Message Content</h3>
            
            <div>
              <label className="block text-sm font-bold text-heading mb-1">Message *</label>
              <textarea
    name="message"
    value={formData.message}
    onChange={handleChange}
    placeholder="Write your announcement here..."
    rows={6}
    className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all resize-y"
    required
  />
            </div>

            <div>
              <label className="block text-sm font-bold text-heading mb-1">Banner Image (Optional)</label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mx-auto text-caption mb-2" />
                <p className="text-sm font-bold text-heading">Click to upload an image</p>
                <p className="text-xs text-caption mt-1">SVG, PNG, JPG or GIF (max. 2MB)</p>
              </div>
            </div>
          </div>

          {
    /* Section: Publishing & Notifications */
  }
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-heading border-b border-border pb-2">Publishing & Notifications</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-heading mb-1">Publish Date (Optional)</label>
                <div className="relative">
                  <Calendar className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-caption" />
                  <input
    type="datetime-local"
    name="publishDate"
    value={formData.publishDate}
    onChange={handleChange}
    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all bg-white"
  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-heading mb-1">Expiry Date (Optional)</label>
                <div className="relative">
                  <Clock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-caption" />
                  <input
    type="datetime-local"
    name="expiryDate"
    value={formData.expiryDate}
    onChange={handleChange}
    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all bg-white"
  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
    type="checkbox"
    name="sendDashboardNotification"
    checked={formData.sendDashboardNotification}
    onChange={handleChange}
    className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
  />
                <span className="text-sm text-heading font-medium">Send Dashboard Notification to Target Audience</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
    type="checkbox"
    name="sendEmailNotification"
    checked={formData.sendEmailNotification}
    onChange={handleChange}
    className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
  />
                <span className="text-sm text-heading font-medium">Send Email Notification to Target Audience</span>
              </label>
            </div>
          </div>

        </div>

        {
    /* Footer Actions */
  }
        <div className="p-6 bg-gray-50 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <button
    type="button"
    onClick={() => navigate("/admin/announcements")}
    className="px-6 py-2.5 rounded-lg font-bold text-body hover:bg-gray-200 transition-colors"
  >
            Cancel
          </button>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
    type="button"
    onClick={() => handleActionClick("Save Draft")}
    disabled={isLoading}
    className="px-6 py-2.5 rounded-lg font-bold bg-white border border-border text-heading hover:bg-gray-50 transition-colors flex items-center gap-2"
  >
              <Save className="w-4 h-4" />
              Save as Draft
            </button>
            <button
    type="button"
    onClick={() => handleActionClick("Schedule")}
    disabled={isLoading}
    className="px-6 py-2.5 rounded-lg font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors flex items-center gap-2"
  >
              <Calendar className="w-4 h-4" />
              Schedule
            </button>
            <button
    type="button"
    onClick={() => handleActionClick("Publish Now")}
    disabled={isLoading}
    className="px-6 py-2.5 rounded-lg font-bold bg-primary hover:bg-primary-hover text-white transition-colors flex items-center gap-2"
  >
              <CheckCircle className="w-4 h-4" />
              Publish Now
            </button>
          </div>
        </div>
      </div>
    </div>;
};
var stdin_default = AdminAnnouncementForm;
export {
  stdin_default as default
};
