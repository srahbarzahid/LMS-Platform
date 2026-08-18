import { useState } from "react";
import { User, Mail, Phone, BookOpen, Clock, TrendingUp, Download, Eye, EyeOff, Award, ArrowLeft, X, Star, Users, CheckCircle, BarChart, DollarSign } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
const AdminInstructorDetails = () => {
  const { id: _id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [selectedCoursePerformance, setSelectedCoursePerformance] = useState(null);
  const [instructor, setInstructor] = useState({
    name: "Dr. Emily Carter",
    email: "emily.c@example.com",
    phone: "+1 555-0200",
    qualification: "Ph.D. in Computer Science",
    experience: "10 Years",
    skills: "React, Node.js, Python, AWS",
    joinedDate: "2024-03-10",
    status: "Active",
    courses: 8,
    students: 12500,
    revenue: 45e4,
    totalStudents: 1250,
    rating: 4.8
  });
  const [editFormData, setEditFormData] = useState(instructor);
  const payouts = [
    { id: "PAY-2025-001", date: "2025-03-01", amount: "\u20B945,000", status: "Processed", period: "Feb 2025" },
    { id: "PAY-2025-002", date: "2025-02-01", amount: "\u20B942,500", status: "Processed", period: "Jan 2025" }
  ];
  const activities = [
    { id: 1, type: "course_published", title: "Published New Course", description: "Advanced UI/UX Design Masterclass", date: "Today at 10:30 AM", icon: Award, color: "bg-emerald-100 text-emerald-600", dot: "bg-emerald-500" },
    { id: 2, type: "course_updated", title: "Updated Course Material", description: 'Added new lectures to "React Fundamentals"', date: "Yesterday at 3:15 PM", icon: BookOpen, color: "bg-blue-100 text-blue-600", dot: "bg-blue-500" },
    { id: 3, type: "login", title: "Logged In", description: "Successful login from Web browser", date: "2 days ago", icon: Clock, color: "bg-gray-100 text-gray-600", dot: "bg-gray-400" }
  ];
  const publishedCoursesList = [
    {
      id: 1,
      title: "Advanced UI/UX Design Masterclass",
      students: 4500,
      rating: 4.9,
      revenue: "\u20B91,25,000",
      status: "Published",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=300&q=80",
      metrics: {
        completionRate: 92,
        activeStudents: 1200,
        fiveStarReviews: 340,
        refundRate: 1.2
      },
      topReviews: [
        { user: "Alex M.", rating: 5, comment: "Incredible course, changed my career! The instructor is brilliant.", date: "2 days ago" },
        { user: "Sarah T.", rating: 5, comment: "Very detailed and practical. Best UI course ever.", date: "1 week ago" }
      ]
    },
    {
      id: 2,
      title: "React Fundamentals",
      students: 3200,
      rating: 4.8,
      revenue: "\u20B995,000",
      status: "Published",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=300&q=80",
      metrics: {
        completionRate: 78,
        activeStudents: 850,
        fiveStarReviews: 210,
        refundRate: 2.1
      },
      topReviews: [
        { user: "John D.", rating: 5, comment: "Finally understand hooks perfectly!", date: "3 days ago" },
        { user: "Emily R.", rating: 4, comment: "Great pace, but could use more projects.", date: "2 weeks ago" }
      ]
    },
    {
      id: 3,
      title: "JavaScript for Beginners",
      students: 4800,
      rating: 4.7,
      revenue: "\u20B92,30,000",
      status: "Published",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=300&q=80",
      metrics: {
        completionRate: 65,
        activeStudents: 2100,
        fiveStarReviews: 450,
        refundRate: 3.5
      },
      topReviews: [
        { user: "Michael K.", rating: 5, comment: "Best intro to JS out there.", date: "1 month ago" },
        { user: "Lisa W.", rating: 4, comment: "A bit slow at the start, but gets really good.", date: "1 month ago" }
      ]
    }
  ];
  const tabs = [
    { id: "personal", label: "Personal Information", icon: User },
    { id: "teaching", label: "Teaching Profile", icon: BookOpen },
    { id: "analytics", label: "Analytics & Revenue", icon: TrendingUp },
    { id: "activity", label: "Activity Timeline", icon: Clock }
  ];
  const handleDownloadInvoice = (payout) => {
    const doc = new jsPDF();
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235);
    doc.text("LMS Platform", 20, 30);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("123 Education St.", 20, 40);
    doc.text("Tech City, TC 12345", 20, 46);
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55);
    doc.text("PAYOUT INVOICE", 130, 30);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Payout ID:", 140, 40);
    doc.setTextColor(31, 41, 55);
    doc.text(payout.id, 170, 40);
    doc.setTextColor(100);
    doc.text("Date:", 140, 46);
    doc.setTextColor(31, 41, 55);
    doc.text(payout.date, 170, 46);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Pay To:", 20, 70);
    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55);
    doc.text(instructor.name, 20, 78);
    doc.setFillColor(249, 250, 251);
    doc.rect(20, 105, 170, 10, "F");
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Description", 25, 112);
    doc.text("Period", 130, 112);
    doc.text("Amount", 170, 112);
    doc.setFont("helvetica", "normal");
    doc.text("Instructor Earnings Payout", 25, 125);
    doc.text(payout.period, 130, 125);
    doc.text(payout.amount, 170, 125);
    doc.setDrawColor(229, 231, 235);
    doc.line(130, 135, 190, 135);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total:", 130, 145);
    doc.setTextColor(37, 99, 235);
    doc.text(payout.amount, 170, 145);
    doc.save(`${payout.id}.pdf`);
  };
  return <div className="p-8">
      {
    /* Back Button */
  }
      <button
    onClick={() => navigate("/admin/instructors")}
    className="flex items-center gap-2 text-caption hover:text-primary transition-colors mb-6 font-bold"
  >
        <ArrowLeft className="w-5 h-5" /> Back to Instructors
      </button>

      {
    /* Header */
  }
      <div className="flex items-center gap-6 mb-8 bg-white p-6 rounded-3xl border border-border shadow-sm">
        <div className="w-24 h-24 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 text-3xl font-bold">
          {instructor.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-heading mb-2">{instructor.name}</h1>
          <div className="flex items-center gap-4 text-sm text-body">
            <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {instructor.email}</span>
            <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {instructor.phone}</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">{instructor.status}</span>
          </div>
        </div>
        <div className="ml-auto flex gap-3">
          <button onClick={() => setResetPasswordModalOpen(true)} className="px-4 py-2 bg-white border border-border text-heading font-bold rounded-xl hover:bg-gray-50 transition-colors">Reset Password</button>
          <button onClick={() => {
    setEditFormData(instructor);
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
            <h3 className="text-lg font-bold text-heading mb-6">Personal & Professional Details</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs font-bold text-caption uppercase mb-1">Full Name</div>
                  <div className="text-heading font-medium">{instructor.name}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-caption uppercase mb-1">Email Address</div>
                  <div className="text-heading font-medium">{instructor.email}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-caption uppercase mb-1">Phone Number</div>
                  <div className="text-heading font-medium">{instructor.phone}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-caption uppercase mb-1">Joined Date</div>
                  <div className="text-heading font-medium">{instructor.joinedDate}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-caption uppercase mb-1">Qualification</div>
                  <div className="text-heading font-medium">{instructor.qualification}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-caption uppercase mb-1">Experience</div>
                  <div className="text-heading font-medium">{instructor.experience}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs font-bold text-caption uppercase mb-1">Skills</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {instructor.skills.split(", ").map((skill) => <span key={skill} className="px-3 py-1 bg-gray-100 text-caption rounded-lg text-sm font-medium">{skill}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>}

        {activeTab === "teaching" && <div>
            <h3 className="text-lg font-bold text-heading mb-6">Teaching Overview</h3>
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="p-4 bg-gray-50 rounded-2xl border border-border">
                <div className="text-3xl font-black text-primary mb-1">{instructor.courses}</div>
                <div className="text-sm font-bold text-caption">Published Courses</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-border">
                <div className="text-3xl font-black text-emerald-500 mb-1">{instructor.students.toLocaleString()}</div>
                <div className="text-sm font-bold text-caption">Total Students</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-border">
                <div className="text-3xl font-black text-orange-500 mb-1">⭐ {instructor.rating}</div>
                <div className="text-sm font-bold text-caption">Average Rating</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-border">
                <div className="text-3xl font-black text-purple-500 mb-1">94%</div>
                <div className="text-sm font-bold text-caption">Completion Rate</div>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <h4 className="text-md font-bold text-heading mb-4">Course Performance</h4>
              {publishedCoursesList.map((course) => <div key={course.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-border rounded-xl hover:bg-gray-50 transition-colors">
                  <img src={course.image} alt={course.title} className="w-full sm:w-24 h-24 sm:h-16 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h5 className="font-bold text-heading text-sm mb-1">{course.title}</h5>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-body mb-2 sm:mb-0">
                      <span className="flex items-center gap-1 font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{course.status}</span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {course.students.toLocaleString()} Students</span>
                      <span className="flex items-center gap-1 text-orange-500 font-bold"><Award className="w-3 h-3" /> {course.rating} Rating</span>
                      <span className="flex items-center gap-1 font-bold text-heading ml-auto">Revenue: {course.revenue}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedCoursePerformance(course)} className="hidden sm:flex p-2 text-body hover:text-primary transition-colors hover:bg-orange-50 rounded-lg" title="View Course Details">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>)}
            </div>
          </div>}

        {activeTab === "analytics" && <div>
            <h3 className="text-lg font-bold text-heading mb-6">Revenue & Analytics</h3>
            <div className="p-6 bg-orange-50/50 border border-orange-100 rounded-2xl mb-8 max-w-sm">
              <div className="text-sm font-bold text-orange-600 uppercase mb-2">Lifetime Revenue</div>
              <div className="text-4xl font-black text-heading">₹{instructor.revenue.toLocaleString()}</div>
            </div>
            
            <h3 className="text-lg font-bold text-heading mb-6">Payout History</h3>
            <div className="bg-white border border-border rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-border">
                  <tr>
                    <th className="text-left py-4 px-6 font-bold text-sm text-heading">Payout ID</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-heading">Date</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-heading">Period</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-heading">Amount</th>
                    <th className="text-left py-4 px-6 font-bold text-sm text-heading">Status</th>
                    <th className="text-right py-4 px-6 font-bold text-sm text-heading">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {payouts.map((payout) => <tr key={payout.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-sm font-bold text-heading">{payout.id}</td>
                      <td className="py-4 px-6 text-sm text-body">{payout.date}</td>
                      <td className="py-4 px-6 text-sm text-heading">{payout.period}</td>
                      <td className="py-4 px-6 text-sm font-bold text-heading">{payout.amount}</td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                          {payout.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
    onClick={() => handleDownloadInvoice(payout)}
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
                    <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-white ${activity.dot}`} />
                    
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-heading mb-1">Qualification</label>
                  <input type="text" value={editFormData.qualification} onChange={(e) => setEditFormData({ ...editFormData, qualification: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-heading mb-1">Experience</label>
                  <input type="text" value={editFormData.experience} onChange={(e) => setEditFormData({ ...editFormData, experience: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-heading mb-1">Skills</label>
                <input type="text" value={editFormData.skills} onChange={(e) => setEditFormData({ ...editFormData, skills: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditProfileModalOpen(false)} className="px-4 py-2 font-bold text-caption hover:text-heading transition-colors">Cancel</button>
              <button onClick={() => {
    setInstructor(editFormData);
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
            <p className="text-sm text-caption mb-6">Set a new password for this instructor.</p>
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
    /* Course Performance Modal */
  }
      {selectedCoursePerformance && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl mt-10 md:mt-0 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4 items-center">
                <img src={selectedCoursePerformance.image} alt={selectedCoursePerformance.title} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                <div>
                  <h3 className="text-xl font-bold text-heading leading-tight">{selectedCoursePerformance.title}</h3>
                  <p className="text-sm font-medium text-caption">Course Performance Analytics</p>
                </div>
              </div>
              <button onClick={() => setSelectedCoursePerformance(null)} className="p-2 text-caption hover:text-heading transition-colors bg-gray-50 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                <Users className="w-6 h-6 text-blue-500 mb-2" />
                <div className="text-xl font-black text-heading">{selectedCoursePerformance.metrics.activeStudents.toLocaleString()}</div>
                <div className="text-xs font-bold text-caption">Active Students</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                <CheckCircle className="w-6 h-6 text-emerald-500 mb-2" />
                <div className="text-xl font-black text-heading">{selectedCoursePerformance.metrics.completionRate}%</div>
                <div className="text-xs font-bold text-caption">Completion Rate</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                <DollarSign className="w-6 h-6 text-purple-500 mb-2" />
                <div className="text-xl font-black text-heading">{selectedCoursePerformance.revenue}</div>
                <div className="text-xs font-bold text-caption">Total Revenue</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                <BarChart className="w-6 h-6 text-orange-500 mb-2" />
                <div className="text-xl font-black text-heading">{selectedCoursePerformance.metrics.refundRate}%</div>
                <div className="text-xs font-bold text-caption">Refund Rate</div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
              <h4 className="text-lg font-black text-heading flex items-center gap-2">
                <Star className="w-5 h-5 text-orange-500 fill-orange-500" /> Recent 5-Star Reviews
              </h4>
              <span className="text-sm font-bold text-caption">{selectedCoursePerformance.metrics.fiveStarReviews} Total</span>
            </div>
            
            <div className="space-y-4">
              {selectedCoursePerformance.topReviews.map((review, idx) => <div key={idx} className="p-4 border border-gray-100 rounded-xl bg-white hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-sm text-heading">{review.user}</h5>
                    <span className="text-xs font-medium text-caption">{review.date}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3 h-3 text-orange-500 fill-orange-500" />)}
                  </div>
                  <p className="text-sm text-body italic">"{review.comment}"</p>
                </div>)}
            </div>
          </div>
        </div>}
    </div>;
};
var stdin_default = AdminInstructorDetails;
export {
  stdin_default as default
};
