import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import StudentDashboard from "./pages/StudentDashboard";
import StudentDashboardOverview from "./pages/StudentDashboardOverview";
import StudentCourseDetails from "./pages/StudentCourseDetails";
import StudentBrowseCourses from "./pages/StudentBrowseCourses";
import StudentMyCourses from "./pages/StudentMyCourses";
import StudentWishlist from "./pages/StudentWishlist";
import StudentCart from "./pages/StudentCart";
import StudentQuizzes from "./pages/StudentQuizzes";
import QuizPlayer from "./pages/QuizPlayer";
import QuizResult from "./pages/QuizResult";
import StudentAssignments from "./pages/StudentAssignments";
import CoursePlayer from "./pages/CoursePlayer";
import StudentProjects from "./pages/StudentProjects";
import StudentProjectDetails from "./pages/StudentProjectDetails";
import StudentCertificates from "./pages/StudentCertificates";
import VerifyCertificate from "./pages/VerifyCertificate";
import StudentNotifications from "./pages/StudentNotifications";
import StudentProfile from "./pages/StudentProfile";
import StudentSettings from "./pages/StudentSettings";
import InstructorProjectCreate from "./pages/InstructorProjectCreate";
import InstructorReviewSubmission from "./pages/InstructorReviewSubmission";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InstructorLayout from "./pages/instructor/InstructorLayout";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import InstructorCourses from "./pages/instructor/InstructorCourses";
import InstructorCreateCourse from "./pages/instructor/InstructorCreateCourse";
import InstructorCurriculum from "./pages/instructor/InstructorCurriculum";
import InstructorLessons from "./pages/instructor/InstructorLessons";
import InstructorQuizzes from "./pages/instructor/InstructorQuizzes";
import InstructorAssignments from "./pages/instructor/InstructorAssignments";
import InstructorProjects from "./pages/instructor/InstructorProjects";
import InstructorStudents from "./pages/instructor/InstructorStudents";
import InstructorReviews from "./pages/instructor/InstructorReviews";
import InstructorCertificates from "./pages/instructor/InstructorCertificates";
import InstructorCertificateDetails from "./pages/instructor/InstructorCertificateDetails";
import InstructorAnalytics from "./pages/instructor/InstructorAnalytics";
import InstructorAnnouncements from "./pages/instructor/InstructorAnnouncements";
import InstructorSettings from "./pages/instructor/InstructorSettings";
import StudentDetailsLayout from "./pages/instructor/student-details/StudentDetailsLayout";
import InstructorStudentProfile from "./pages/instructor/student-details/InstructorStudentProfile";
import InstructorStudentProgress from "./pages/instructor/student-details/InstructorStudentProgress";
import InstructorStudentSubmissions from "./pages/instructor/student-details/InstructorStudentSubmissions";
import InstructorStudentActivity from "./pages/instructor/student-details/InstructorStudentActivity";
import InstructorAssignmentDetails from "./pages/instructor/submissions/InstructorAssignmentDetails";
import InstructorProjectDetails from "./pages/instructor/submissions/InstructorProjectDetails";
import InstructorQuizResultDetails from "./pages/instructor/submissions/InstructorQuizResultDetails";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCategories from "./pages/admin/categories/AdminCategories";
import AdminCourses from "./pages/admin/courses/AdminCourses";
import AdminCourseApprovals from "./pages/admin/courses/AdminCourseApprovals";
import AdminCourseCertificates from "./pages/admin/courses/AdminCourseCertificates";
import AdminOffers from "./pages/admin/offers/AdminOffers";
import AdminOfferDetails from "./pages/admin/offers/AdminOfferDetails";
import AdminCertificateTemplates from "./pages/admin/certificates/AdminCertificateTemplates";
import AdminIssuedCertificates from "./pages/admin/certificates/AdminIssuedCertificates";
import AdminCourseDetails from "./pages/admin/courses/AdminCourseDetails";
import AdminEnrollments from "./pages/admin/enrollments/AdminEnrollments";
import AdminEnrollmentDetails from "./pages/admin/enrollments/AdminEnrollmentDetails";
import AdminPayments from "./pages/admin/payments/AdminPayments";
import AdminPaymentDetails from "./pages/admin/payments/AdminPaymentDetails";
import AdminStudents from "./pages/admin/users/AdminStudents";
import AdminStudentDetails from "./pages/admin/users/AdminStudentDetails";
import AdminAddStudent from "./pages/admin/users/AdminAddStudent";
import AdminInstructors from "./pages/admin/users/AdminInstructors";
import AdminInstructorDetails from "./pages/admin/users/AdminInstructorDetails";
import AdminAddInstructor from "./pages/admin/users/AdminAddInstructor";
import AdminWebsiteContent from "./pages/admin/content/AdminWebsiteContent";
import AdminReviews from "./pages/admin/reviews/AdminReviews";
import AdminReviewDetails from "./pages/admin/reviews/AdminReviewDetails";
import AdminAnnouncements from "./pages/admin/announcements/AdminAnnouncements";
import AdminAnnouncementForm from "./pages/admin/announcements/AdminAnnouncementForm";
import AdminAnnouncementDetails from "./pages/admin/announcements/AdminAnnouncementDetails";
import AdminAnalytics from "./pages/admin/analytics/AdminAnalytics";
import AdminSettings from "./pages/admin/settings/AdminSettings";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute, { PublicRouteGuard } from "./components/common/ProtectedRoute";
import RouteTracker from "./components/common/RouteTracker";
const Categories = () => <div className="min-h-[80vh] flex items-center justify-center"><h1 className="text-4xl font-heading font-bold text-primary">Categories (Coming Soon)</h1></div>;
const AppContent = () => {
  const location = useLocation();
  const hideNavAndFooter = location.pathname.startsWith("/student") || location.pathname.startsWith("/admin") || location.pathname.startsWith("/instructor");
  return <div className="flex flex-col min-h-screen">
      <RouteTracker />
      {!hideNavAndFooter && <Navbar />}
      <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/login"
              element={
                <PublicRouteGuard>
                  <Login />
                </PublicRouteGuard>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRouteGuard>
                  <Register />
                </PublicRouteGuard>
              }
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/verify-certificate/:certificateId" element={<VerifyCertificate />} />
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={["STUDENT"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<StudentDashboardOverview />} />
              <Route path="browse-courses" element={<StudentBrowseCourses />} />
              <Route path="courses/:id" element={<StudentCourseDetails />} />
              <Route path="my-courses" element={<StudentMyCourses />} />
              <Route path="wishlist" element={<StudentWishlist />} />
              <Route path="cart" element={<StudentCart />} />
              <Route path="quizzes" element={<StudentQuizzes />} />
              <Route path="quiz-player/:id" element={<QuizPlayer />} />
              <Route path="quiz-result/:id" element={<QuizResult />} />
              <Route path="assignments" element={<StudentAssignments />} />
              <Route path="projects" element={<StudentProjects />} />
              <Route path="project/:id" element={<StudentProjectDetails />} />
              <Route path="certificates" element={<StudentCertificates />} />
              <Route path="notifications" element={<StudentNotifications />} />
              <Route path="profile" element={<StudentProfile />} />
              <Route path="settings" element={<StudentSettings />} />
              <Route path="course-player/:id" element={<CoursePlayer />} />
              <Route path="*" element={<div className="flex items-center justify-center h-full"><h1 className="text-2xl text-caption">Page under construction</h1></div>} />
            </Route>

            <Route
              path="/instructor"
              element={
                <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
                  <InstructorLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<InstructorDashboard />} />
              <Route path="courses" element={<InstructorCourses />} />
              <Route path="courses/create" element={<InstructorCreateCourse />} />
              <Route path="courses/:id/edit" element={<InstructorCreateCourse />} />
              <Route path="curriculum" element={<InstructorCurriculum />} />
              <Route path="lessons" element={<InstructorLessons />} />
              <Route path="quizzes" element={<InstructorQuizzes />} />
              <Route path="assignments" element={<InstructorAssignments />} />
              <Route path="students" element={<InstructorStudents />} />
              <Route path="students/:studentId" element={<StudentDetailsLayout />}>
                <Route index element={<InstructorStudentProfile />} />
                <Route path="progress" element={<InstructorStudentProgress />} />
                <Route path="submissions" element={<InstructorStudentSubmissions />} />
                <Route path="activity" element={<InstructorStudentActivity />} />
              </Route>
              <Route path="submissions/assignments/:submissionId" element={<InstructorAssignmentDetails />} />
              <Route path="submissions/projects/:submissionId" element={<InstructorProjectDetails />} />
              <Route path="quiz-results/:resultId" element={<InstructorQuizResultDetails />} />
              <Route path="reviews" element={<InstructorReviews />} />
              <Route path="certificates" element={<InstructorCertificates />} />
              <Route path="certificates/:certificateId" element={<InstructorCertificateDetails />} />
              <Route path="analytics" element={<InstructorAnalytics />} />
              <Route path="announcements" element={<InstructorAnnouncements />} />
              <Route path="profile" element={<Navigate to="/instructor/settings?tab=profile" replace />} />
              <Route path="settings" element={<InstructorSettings />} />
              <Route path="projects" element={<InstructorProjects />} />
              <Route path="projects/create" element={<InstructorProjectCreate />} />
              <Route path="projects/:submissionId/submissions" element={<InstructorReviewSubmission />} />
              <Route path="*" element={<div className="flex items-center justify-center h-full"><h1 className="text-2xl text-caption">Page under construction</h1></div>} />
            </Route>

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="enrollments" element={<AdminEnrollments />} />
              <Route path="enrollments/:id" element={<AdminEnrollmentDetails />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="payments/:id" element={<AdminPaymentDetails />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="students/add" element={<AdminAddStudent />} />
              <Route path="students/:id" element={<AdminStudentDetails />} />
              
              <Route path="instructors" element={<AdminInstructors />} />
              <Route path="instructors/add" element={<AdminAddInstructor />} />
              <Route path="instructors/:id" element={<AdminInstructorDetails />} />
              
              <Route path="courses" element={<AdminCourses />} />
              <Route path="course-approvals" element={<AdminCourseApprovals />} />
              <Route path="courses/certificates" element={<AdminCourseCertificates />} />
              <Route path="courses/:id" element={<AdminCourseDetails />} />

              <Route path="offers" element={<AdminOffers />} />
              <Route path="offers/:id" element={<AdminOfferDetails />} />
              <Route path="content" element={<AdminWebsiteContent />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="reviews/:id" element={<AdminReviewDetails />} />
              
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="announcements/create" element={<AdminAnnouncementForm />} />
              <Route path="announcements/:id" element={<AdminAnnouncementDetails />} />
              <Route path="announcements/:id/edit" element={<AdminAnnouncementForm />} />
              
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="certificate-templates" element={<AdminCertificateTemplates />} />
              <Route path="certificates" element={<AdminIssuedCertificates />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="profile" element={<Navigate to="/admin/settings?tab=profile" replace />} />
              
              <Route path="*" element={<div className="flex items-center justify-center h-full"><h1 className="text-2xl text-caption font-medium">Page under construction</h1></div>} />
            </Route>
          </Routes>
      </main>
      {!hideNavAndFooter && <Footer />}
    </div>;
};
function App() {
  return <CartProvider>
      <WishlistProvider>
        <Router>
          <Toaster />
          <AppContent />
        </Router>
      </WishlistProvider>
    </CartProvider>;
}
var stdin_default = App;
export {
  stdin_default as default
};
