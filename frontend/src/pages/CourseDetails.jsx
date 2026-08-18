import { useState, useEffect } from "react";
import { Star, FileText, Award, CheckCircle2, PlayCircle, Monitor, Users, ChevronRight, MessageSquare, ChevronDown, ChevronUp, ChevronLeft } from "lucide-react";
import axios from "axios";
import { useCart } from "../context/CartContext";
const CourseDetails = () => {
  const { addToCart } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [expandedModule, setExpandedModule] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 2;
  const courseModules = [
    {
      id: 1,
      title: "Core Concepts",
      lessons: [
        { title: "What is UI/UX?", duration: "8:20" },
        { title: "Design Thinking", duration: "15:10" },
        { title: "Wireframing Basics", duration: "20:00" },
        { title: "Typography", duration: "11:15" },
        { title: "Color Theory", duration: "14:30" }
      ]
    },
    {
      id: 2,
      title: "Advanced Prototyping",
      lessons: [
        { title: "Figma Fundamentals", duration: "22:15" },
        { title: "Interactive Components", duration: "18:40" },
        { title: "Prototyping with Variables", duration: "14:50" }
      ]
    },
    {
      id: 3,
      title: "Usability Testing",
      lessons: [
        { title: "Planning the Test", duration: "12:00" },
        { title: "Conducting User Interviews", duration: "25:30" },
        { title: "Analyzing Feedback", duration: "18:20" }
      ]
    }
  ];
  const courseData = {
    id: "esp32-mastering",
    title: "Mastering ESP32 for Advanced IoT Projects",
    author: "Pibots Robotics",
    price: "\u20B91,999",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
  };
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/admin/reviews?courseId=${courseData.id}`, { withCredentials: true });
        if (res.data.success) {
          const publishedCourseReviews = res.data.data.filter((r) => r.status === "Published");
          setReviews(publishedCourseReviews);
        }
      } catch (error) {
        console.error("Failed to load reviews", error);
      }
    };
    fetchReviews();
  }, [courseData.id]);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const handleAddToCart = () => {
    addToCart(courseData);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3e3);
  };
  return <div className="bg-[#f8f9fa] min-h-screen pb-20 relative">
      {
    /* Toast Notification */
  }
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 z-50 ${showPopup ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}`}>
        <CheckCircle2 className="w-5 h-5 text-green-400" />
        <span className="font-medium text-sm">Course added to cart successfully</span>
      </div>

      {
    /* Course Hero Section */
  }
      <section className="bg-heading text-white pt-32 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-primary skew-x-12 translate-x-32" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6 text-sm font-medium">
                <span className="text-primary hover:text-white transition-colors cursor-pointer tracking-wider uppercase text-xs font-bold bg-primary/10 px-3 py-1 rounded-full">IoT & Robotics</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400">Intermediate</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 leading-tight text-white">Mastering ESP32 for Advanced IoT Projects</h1>
              <p className="text-xl text-gray-300 mb-8 line-clamp-2 leading-relaxed">
                Learn to build real-world IoT applications using ESP32, advanced sensors, and secure cloud integration. From blinking an LED to building a smart home system.
              </p>
              
              <div className="flex flex-wrap items-center gap-8 text-sm mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-500 overflow-hidden border-2 border-primary/50">
                    <img src="https://ui-avatars.com/api/?name=John+Doe&background=2563EB&color=fff" alt="Instructor" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-0.5">Instructor</div>
                    <div className="font-bold text-white text-base">John Doe</div>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <div className="text-gray-400 text-xs mb-1.5">Rating</div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-5 h-5 fill-primary text-primary" />
                    <span className="font-bold text-base text-white">4.9</span>
                    <span className="text-gray-400 ml-1">(850 ratings)</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="text-gray-400 text-xs mb-1.5">Students</div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-300" />
                    <span className="font-bold text-base text-white">12,450 enrolled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {
    /* Main Content Area */
  }
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {
    /* Left Column - Details */
  }
          <div className="lg:col-span-2 space-y-8">
            
            <div className="bg-white p-8 md:p-10 rounded-2xl border border-border shadow-sm">
              <h2 className="text-2xl font-heading font-bold text-heading mb-6">What you'll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {[
    "Program ESP32 using Arduino IDE",
    "Interface multiple sensors and actuators",
    "Send and receive data to IoT Cloud platforms",
    "Build a complete Smart Weather Station",
    "Understand MQTT protocols for IoT",
    "Develop a real-world home automation system"
  ].map((item, i) => <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                       <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-body text-sm leading-relaxed">{item}</span>
                  </div>)}
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-2xl border border-border shadow-sm">
              <h2 className="text-2xl font-heading font-bold text-heading mb-2">Course Curriculum</h2>
              <div className="text-sm text-caption mb-8">
                <span>{courseModules.length} Modules • {courseModules.reduce((acc, m) => acc + m.lessons.length, 0)} Lessons • 18h 30m total length</span>
              </div>
              
              <div className="space-y-4">
                {courseModules.map((module) => <div key={module.id} className="border border-border rounded-xl overflow-hidden transition-all bg-white">
                    <div
    className="px-6 py-4 flex justify-between items-center cursor-pointer select-none"
    onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
  >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                          {module.id}
                        </div>
                        <h3 className={`font-bold text-lg transition-colors ${expandedModule === module.id ? "text-primary" : "text-heading"}`}>
                          {module.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">
                          {module.lessons.length} Items
                        </span>
                        {expandedModule === module.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                      </div>
                    </div>

                    {expandedModule === module.id && <div className="bg-[#f8f9fa] px-6 py-6 border-t border-border space-y-3">
                        {module.lessons.map((lesson, idx) => <div
    key={idx}
    className="bg-white border border-border rounded-lg p-4 flex items-center justify-between shadow-sm hover:border-primary/30 transition-colors"
  >
                            <div className="flex items-center gap-4">
                              <PlayCircle className="w-5 h-5 text-primary" />
                              <span className="font-medium text-heading text-sm">{lesson.title}</span>
                            </div>
                            <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs font-mono font-medium">
                              {lesson.duration}
                            </span>
                          </div>)}
                      </div>}
                  </div>)}
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-2xl border border-border shadow-sm">
              <h2 className="text-2xl font-heading font-bold text-heading mb-6">Requirements</h2>
              <ul className="list-disc list-inside text-body space-y-3">
                <li>Basic understanding of C/C++ programming is helpful but not required.</li>
                <li>An ESP32 development board and basic electronics components (LEDs, resistors, sensors).</li>
                <li>A laptop or PC with Windows, Mac, or Linux.</li>
              </ul>
            </div>

            {
    /* Reviews Section */
  }
            <div className="bg-white p-8 md:p-10 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-heading font-bold text-heading">Student Reviews</h2>
              </div>
              
              <div className="flex items-center gap-6 mb-8 border-b border-border pb-8">
                <div className="text-center">
                  <div className="text-5xl font-heading font-black text-heading mb-2">4.9</div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`w-5 h-5 ${star <= 5 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />)}
                  </div>
                  <div className="text-sm font-bold text-caption tracking-wider uppercase">Course Rating</div>
                </div>
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => <div key={star} className="flex items-center gap-3 text-sm">
                      <div className="w-12 text-body flex items-center gap-1">{star} <Star className="w-3 h-3 fill-gray-400 text-gray-400" /></div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
    className="h-full bg-yellow-400 rounded-full"
    style={{ width: star === 5 ? "80%" : star === 4 ? "15%" : "0%" }}
  />
                      </div>
                      <div className="w-8 text-right text-caption font-mono">{star === 5 ? "80%" : star === 4 ? "15%" : "0%"}</div>
                    </div>)}
                </div>
              </div>

              <div className="space-y-6">
                {currentReviews.length > 0 ? currentReviews.map((review) => <div key={review.reviewId} className="border-b border-border last:border-0 pb-6 last:pb-0">
                      <div className="flex items-start gap-4">
                        <img src={review.studentPhoto} alt={review.studentName} className="w-12 h-12 rounded-full object-cover border border-border" />
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                            <h4 className="font-bold text-heading">{review.studentName}</h4>
                            <span className="text-xs text-caption font-medium">
                              {new Date(review.reviewDate).toLocaleDateString(void 0, { year: "numeric", month: "long", day: "numeric" })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />)}
                          </div>
                          {review.reviewTitle && <h5 className="font-bold text-heading text-sm mb-2">{review.reviewTitle}</h5>}
                          <p className="text-body text-sm leading-relaxed">{review.reviewDescription}</p>
                        </div>
                      </div>
                    </div>) : <div className="text-center py-8 text-body bg-gray-50 rounded-xl border border-border">
                    No reviews yet for this course. Be the first to review!
                  </div>}
              </div>

              {
    /* Pagination Controls */
  }
              {totalPages > 1 && <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-border">
                  <button
    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
    disabled={currentPage === 1}
    className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-border text-heading hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => <button
    key={page}
    onClick={() => setCurrentPage(page)}
    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors ${currentPage === page ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-white border border-border text-heading hover:bg-gray-50"}`}
  >
                      {page}
                    </button>)}
                  
                  <button
    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
    disabled={currentPage === totalPages}
    className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-border text-heading hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>}
            </div>

          </div>

          {
    /* Right Column - Purchase Card */
  }
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-border shadow-xl sticky top-24 overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-2xl">
              <div className="aspect-video bg-gray-200 relative flex items-center justify-center cursor-pointer group overflow-hidden">
                 {
    /* Video Thumbnail Placeholder */
  }
                 <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800" alt="Course" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                 <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-300">
                    <PlayCircle className="w-10 h-10 text-white drop-shadow-lg" />
                 </div>
                 <div className="absolute bottom-4 text-center w-full font-bold text-white relative z-10 drop-shadow-md text-sm tracking-wide">Preview this course</div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl font-heading font-extrabold text-heading">₹1,999</span>
                  <span className="text-xl text-caption line-through">₹4,999</span>
                </div>
                <div className="inline-block bg-success/10 text-success font-bold px-3 py-1 rounded-md text-sm mb-6">
                  60% off for a limited time
                </div>

                <div className="space-y-4 mb-8">
                  <button
    onClick={handleAddToCart}
    className="w-full bg-primary text-white hover:bg-secondary shadow-primary/20 py-4 rounded-xl font-bold text-lg transition-colors shadow-md cursor-pointer"
  >
                    Add to Cart
                  </button>
                </div>

                <div className="text-center text-caption text-sm mb-8 pb-8 border-b border-border">
                  30-Day Money-Back Guarantee
                </div>

                <div className="space-y-4 text-body text-sm">
                  <div className="font-heading font-bold text-heading mb-4 text-base">This course includes:</div>
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5 text-primary" />
                    <span>18.5 hours on-demand video</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <span>24 downloadable resources</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-primary" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5 text-primary" />
                    <span>Access on mobile and TV</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>;
};
var stdin_default = CourseDetails;
export {
  stdin_default as default
};
