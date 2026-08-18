import { useState } from "react";
import { User, Mail, Phone, BookOpen, Clock, FileText, Award, CheckCircle, Download, Eye, EyeOff, ArrowLeft, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
const AdminStudentDetails = () => {
  const { id: _id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [selectedCourseProgress, setSelectedCourseProgress] = useState(null);
  const [student, setStudent] = useState({
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    phone: "+1 555-0199",
    address: "123 Learning St, Tech City, TC 12345",
    joinedDate: "2025-01-15",
    status: "Active",
    enrolledCourses: 4,
    completedCourses: 2,
    certificates: 2
  });
  const [editFormData, setEditFormData] = useState(student);
  const payments = [
    { id: "INV-2025-001", date: "2025-01-20", amount: "$89.99", status: "Completed", method: "Credit Card (**** 4242)", course: "Complete 2024 Web Development Bootcamp" },
    { id: "INV-2025-002", date: "2025-02-15", amount: "$45.00", status: "Completed", method: "PayPal", course: "Advanced UI/UX Design" }
  ];
  const activities = [
    { id: 1, type: "course_completed", title: "Completed Course", description: 'Finished "Advanced UI/UX Design"', date: "Today at 2:30 PM", icon: Award, color: "bg-emerald-100 text-emerald-600", dot: "bg-emerald-500" },
    { id: 2, type: "lesson_completed", title: "Completed Lesson", description: 'Watched "Introduction to React Hooks"', date: "Yesterday at 4:15 PM", icon: BookOpen, color: "bg-blue-100 text-blue-600", dot: "bg-blue-500" },
    { id: 3, type: "login", title: "Logged In", description: "Successful login from Web browser", date: "2 days ago", icon: Clock, color: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
    { id: 4, type: "enrolled", title: "Enrolled in Course", description: 'Purchased "Complete 2024 Web Development Bootcamp"', date: "Jan 20, 2025", icon: CheckCircle, color: "bg-purple-100 text-purple-600", dot: "bg-purple-500" }
  ];
  const enrolledCoursesList = [
    {
      id: 1,
      title: "Complete 2024 Web Development Bootcamp",
      progress: 85,
      lastAccessed: "2 hours ago",
      status: "In Progress",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300&q=80",
      modules: [
        { title: "HTML5 Basics", status: "Completed", date: "Jan 15, 2025" },
        { title: "CSS3 and Flexbox", status: "Completed", date: "Jan 18, 2025" },
        { title: "JavaScript Fundamentals", status: "In Progress", date: "Currently Active" },
        { title: "React.js Introduction", status: "Pending", date: "-" }
      ]
    },
    {
      id: 2,
      title: "Advanced UI/UX Design Masterclass",
      progress: 100,
      lastAccessed: "2 days ago",
      status: "Completed",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=300&q=80",
      modules: [
        { title: "UI Fundamentals", status: "Completed", date: "Jan 1, 2025" },
        { title: "Figma Prototyping", status: "Completed", date: "Jan 5, 2025" },
        { title: "UX Research", status: "Completed", date: "Jan 10, 2025" }
      ]
    },
    {
      id: 3,
      title: "Python for Data Science and Machine Learning",
      progress: 32,
      lastAccessed: "1 week ago",
      status: "In Progress",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=80",
      modules: [
        { title: "Python Basics", status: "Completed", date: "Dec 20, 2024" },
        { title: "Numpy and Pandas", status: "In Progress", date: "Currently Active" },
        { title: "Machine Learning Models", status: "Pending", date: "-" }
      ]
    },
    {
      id: 4,
      title: "Digital Marketing Fundamentals",
      progress: 0,
      lastAccessed: "Never",
      status: "Not Started",
      image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=300&q=80",
      modules: [
        { title: "SEO Basics", status: "Pending", date: "-" },
        { title: "Social Media Strategy", status: "Pending", date: "-" },
        { title: "Email Marketing", status: "Pending", date: "-" }
      ]
    }
  ];
  const tabs = [
    { id: "personal", label: "Personal Information", icon: User },
    { id: "learning", label: "Learning Info", icon: BookOpen },
    { id: "payments", label: "Payments", icon: FileText },
    { id: "activity", label: "Activity Timeline", icon: Clock }
  ];
  const handleDownloadInvoice = (payment) => {
    const doc = new jsPDF();
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235);
    doc.text("LMS Platform", 20, 30);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("123 Education St.", 20, 40);
    doc.text("Tech City, TC 12345", 20, 46);
    doc.text("contact@lmsplatform.com", 20, 52);
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55);
    doc.text("INVOICE", 140, 30);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Invoice Number:`, 140, 40);
    doc.setTextColor(31, 41, 55);
    doc.text(`${payment.id}`, 170, 40);
    doc.setTextColor(100);
    doc.text(`Date of Issue:`, 140, 46);
    doc.setTextColor(31, 41, 55);
    doc.text(`${payment.date}`, 170, 46);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Bill To:", 20, 70);
    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55);
    doc.text(student.name, 20, 78);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(student.email, 20, 84);
    doc.text(student.phone, 20, 90);
    doc.setFillColor(249, 250, 251);
    doc.rect(20, 105, 170, 10, "F");
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(31, 41, 55);
    doc.text("Description", 25, 112);
    doc.text("Method", 130, 112);
    doc.text("Amount", 170, 112);
    doc.setFont("helvetica", "normal");
    doc.text(payment.course, 25, 125);
    doc.text(payment.method || "Credit Card", 130, 125);
    doc.text(payment.amount, 170, 125);
    doc.setDrawColor(229, 231, 235);
    doc.line(130, 135, 190, 135);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total:", 130, 145);
    doc.setTextColor(37, 99, 235);
    doc.text(payment.amount, 170, 145);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(156, 163, 175);
    doc.text("Thank you for your business!", 105, 280, { align: "center" });
    doc.save(`${payment.id}.pdf`);
  };
  return <div className="p-8">
      {
    /* Back Button */
  }
      <button
    onClick={() => navigate("/admin/students")}
    className="flex items-center gap-2 text-caption hover:text-primary transition-colors mb-6 font-bold"
  >
        <ArrowLeft className="w-5 h-5" /> Back to Students
      </button>

      {
    /* Header */
  }
      <div className="flex items-center gap-6 mb-8 bg-white p-6 rounded-3xl border border-border shadow-sm">
        <div className="w-24 h-24 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
          {student.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-heading mb-2">{student.name}</h1>
          <div className="flex items-center gap-4 text-sm text-body">
            <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {student.email}</span>
            <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {student.phone}</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">{student.status}</span>
          </div>
        </div>
        <div className="ml-auto flex gap-3">
          <button onClick={() => setResetPasswordModalOpen(true)} className="px-4 py-2 bg-white border border-border text-heading font-bold rounded-xl hover:bg-gray-50 transition-colors">Reset Password</button>
          <button onClick={() => {
    setEditFormData(student);
    setEditProfileModalOpen(true);
  }} className="px-4 py-2 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary/20 transition-colors">Edit Profile</button>
        </div>
      </div>

      {
    /* Tabs */
  }
      <div className="flex gap-2 border-b border-border mb-8 overflow-x-auto">
        {tabs.map((tab) => {
    const Icon = tab.icon;
    return <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`flex items-center gap-2 px-6 py-3 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-caption hover:text-heading hover:border-gray-300"}`}
    >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>;
  })}
      </div>

      {
    /* Content */
  }
      <div className="bg-white rounded-3xl border border-border shadow-sm p-8 min-h-[400px]">
        {activeTab === "personal" && <div className="max-w-2xl">
            <h3 className="text-lg font-bold text-heading mb-6">Personal Details</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs font-bold text-caption uppercase mb-1">Full Name</div>
                  <div className="text-heading font-medium">{student.name}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-caption uppercase mb-1">Email Address</div>
                  <div className="text-heading font-medium">{student.email}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-caption uppercase mb-1">Phone Number</div>
                  <div className="text-heading font-medium">{student.phone}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-caption uppercase mb-1">Joined Date</div>
                  <div className="text-heading font-medium">{student.joinedDate}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs font-bold text-caption uppercase mb-1">Address</div>
                  <div className="text-heading font-medium">{student.address}</div>
                </div>
              </div>
            </div>
          </div>}

        {activeTab === "learning" && <div>
            <h3 className="text-lg font-bold text-heading mb-6">Learning Overview</h3>
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-gray-50 rounded-2xl border border-border">
                <div className="text-3xl font-black text-primary mb-1">{student.enrolledCourses}</div>
                <div className="text-sm font-bold text-caption">Enrolled Courses</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-border">
                <div className="text-3xl font-black text-emerald-500 mb-1">{student.completedCourses}</div>
                <div className="text-sm font-bold text-caption">Completed Courses</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-border">
                <div className="text-3xl font-black text-purple-500 mb-1">{student.certificates}</div>
                <div className="text-sm font-bold text-caption">Certificates Earned</div>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <h4 className="text-md font-bold text-heading mb-4">Detailed Course Progress</h4>
              {enrolledCoursesList.map((course) => <div key={course.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-border rounded-xl hover:bg-gray-50 transition-colors">
                  <img src={course.image} alt={course.title} className="w-full sm:w-24 h-24 sm:h-16 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h5 className="font-bold text-heading text-sm mb-1">{course.title}</h5>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-body mb-3 sm:mb-2">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Last accessed: {course.lastAccessed}</span>
                      <span className={`px-2 py-0.5 rounded-full font-medium ${course.status === "Completed" ? "bg-emerald-100 text-emerald-700" : course.status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>{course.status}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
    className={`h-full rounded-full transition-all duration-500 ${course.progress === 100 ? "bg-emerald-500" : "bg-primary"}`}
    style={{ width: `${course.progress}%` }}
  />
                      </div>
                      <span className="text-xs font-bold text-heading w-8 text-right">{course.progress}%</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedCourseProgress(course)} className="hidden sm:flex p-2 text-body hover:text-primary transition-colors hover:bg-orange-50 rounded-lg" title="View Course Details">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>)}
            </div>
          </div>}

        {activeTab === "payments" && <div>
            <h3 className="text-lg font-bold text-heading mb-6">Payment History</h3>
            <div className="bg-white border border-border rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-border">
                  <tr>
                    <th className="text-left py-4 px-6 font-bold text-sm text-heading">Invoice ID</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-heading">Date</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-heading">Course</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-heading">Amount</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-heading">Status</th>
                    <th className="text-right py-4 px-6 font-bold text-sm text-heading">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {payments.map((payment) => <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-sm font-bold text-heading">{payment.id}</td>
                      <td className="py-4 px-6 text-sm text-body">{payment.date}</td>
                      <td className="py-4 px-6 text-sm text-heading">{payment.course}</td>
                      <td className="py-4 px-6 text-sm font-bold text-heading">{payment.amount}</td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
    onClick={() => handleDownloadInvoice(payment)}
    className="p-2 text-caption hover:text-primary transition-colors rounded-xl hover:bg-blue-50"
  >
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>}

        {activeTab === "activity" && <div>
            <h3 className="text-lg font-bold text-heading mb-6">Activity Timeline</h3>
            <div className="relative border-l-2 border-gray-100 ml-4 md:ml-6 space-y-8 pb-4">
              {activities.map((activity) => {
    const Icon = activity.icon;
    return <div key={activity.id} className="relative pl-8 md:pl-10">
                    {
      /* Timeline Dot */
    }
                    <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-white ${activity.dot}`} />
                    
                    {
      /* Content */
    }
                    <div className="bg-white p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activity.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-heading text-sm md:text-base">{activity.title}</h4>
                            <p className="text-xs text-caption font-medium">{activity.date}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-body ml-13">{activity.description}</p>
                    </div>
                  </div>;
  })}
            </div>
          </div>}
      </div>

      {
    /* Edit Profile Modal */
  }
      {editProfileModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-xl my-8">
            <h3 className="text-xl font-bold text-heading mb-6">Edit Profile</h3>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-bold text-heading mb-1">Full Name</label>
                <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-heading mb-1">Email</label>
                  <input type="email" value={editFormData.email} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-heading mb-1">Phone Number</label>
                  <input type="text" value={editFormData.phone} onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-heading mb-1">Address</label>
                <input type="text" value={editFormData.address} onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditProfileModalOpen(false)} className="px-4 py-2 font-bold text-caption hover:text-heading transition-colors">Cancel</button>
              <button onClick={() => {
    setStudent(editFormData);
    setEditProfileModalOpen(false);
    toast.success("Profile updated successfully!", {
      style: { background: "#10B981", color: "#fff" },
      iconTheme: { primary: "#fff", secondary: "#10B981" }
    });
  }} className="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">Save Changes</button>
            </div>
          </div>
        </div>}

      {
    /* Reset Password Modal */
  }
      {resetPasswordModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-xl font-bold text-heading mb-2">Reset Password</h3>
            <p className="text-sm text-caption mb-6">Set a new password for this student.</p>
            <div className="relative mb-6">
              <input
    type={showPassword ? "text" : "password"}
    placeholder="Enter new password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    className="w-full pl-4 pr-12 py-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none font-medium"
  />
              <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-caption hover:text-primary transition-colors"
  >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => {
    setResetPasswordModalOpen(false);
    setNewPassword("");
    setShowPassword(false);
  }} className="px-4 py-2 font-bold text-caption hover:text-heading transition-colors">Cancel</button>
              <button onClick={() => {
    setResetPasswordModalOpen(false);
    setNewPassword("");
    toast.success("Password reset successfully!", {
      style: { background: "#10B981", color: "#fff" },
      iconTheme: { primary: "#fff", secondary: "#10B981" }
    });
  }} className="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">Reset Password</button>
            </div>
          </div>
        </div>}

      {
    /* Course Progress Modal */
  }
      {selectedCourseProgress && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl mt-10 md:mt-0 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4 items-center">
                <img src={selectedCourseProgress.image} alt={selectedCourseProgress.title} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                <div>
                  <h3 className="text-xl font-bold text-heading leading-tight">{selectedCourseProgress.title}</h3>
                  <p className="text-sm font-medium text-caption">Detailed learning analytics</p>
                </div>
              </div>
              <button onClick={() => setSelectedCourseProgress(null)} className="p-2 text-caption hover:text-heading transition-colors bg-gray-50 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative w-28 h-28 mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-100" strokeWidth="4" />
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-primary drop-shadow-md" strokeWidth="4" strokeDasharray="100" strokeDashoffset={100 - selectedCourseProgress.progress} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="font-black text-3xl text-heading">{selectedCourseProgress.progress}%</span>
                  </div>
                </div>
                <div className="text-xs font-bold text-caption uppercase tracking-wider">Overall Progress</div>
              </div>
              <div className="md:col-span-2 flex flex-col justify-center gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-sm font-bold text-caption">Current Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${selectedCourseProgress.status === "Completed" ? "bg-emerald-100 text-emerald-700" : selectedCourseProgress.status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>{selectedCourseProgress.status}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-sm font-bold text-caption">Last Accessed</span>
                  <span className="text-sm font-medium text-heading">{selectedCourseProgress.lastAccessed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-caption">Modules Completed</span>
                  <span className="text-sm font-black text-primary">
                    {selectedCourseProgress.modules.filter((m) => m.status === "Completed").length} <span className="text-caption font-medium">/ {selectedCourseProgress.modules.length}</span>
                  </span>
                </div>
              </div>
            </div>

            <h4 className="text-lg font-black text-heading mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Module Breakdown
            </h4>
            <div className="space-y-3">
              {selectedCourseProgress.modules.map((mod, idx) => <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${mod.status === "Completed" ? "bg-emerald-500 text-white" : mod.status === "In Progress" ? "bg-blue-500 text-white" : "bg-white text-caption border border-gray-200"}`}>
                      {mod.status === "Completed" ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-heading">{mod.title}</h5>
                      <span className="text-xs font-medium text-caption flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" /> {mod.date}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm ${mod.status === "Completed" ? "text-emerald-700 bg-emerald-100" : mod.status === "In Progress" ? "text-blue-700 bg-blue-100" : "text-gray-500 bg-gray-100 border border-gray-200"}`}>{mod.status}</span>
                </div>)}
            </div>
          </div>
        </div>}
    </div>;
};
var stdin_default = AdminStudentDetails;
export {
  stdin_default as default
};
