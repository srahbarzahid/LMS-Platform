import { useState } from "react";
import { Star, FileText, Award, CheckCircle2, PlayCircle, Monitor, Users, ChevronRight, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
const StudentCourseDetails = () => {
  const { addToCart } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const courseData = {
    id: "esp32-mastering",
    title: "Mastering ESP32 for Advanced IoT Projects",
    author: "Pibots Robotics",
    price: "\u20B91,999",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
  };
  const handleAddToCart = () => {
    addToCart(courseData);
  };
  return <div className="bg-[#f8f9fa] min-h-screen pb-20 relative">

      {
    /* Back Button & Header */
  }
      <div className="max-w-7xl mx-auto px-6 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2.5 text-heading hover:text-primary transition-colors text-sm font-bold cursor-pointer group w-max">
          <div className="w-8 h-8 rounded-full bg-white border border-border shadow-sm flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to courses
        </button>
      </div>

      {
    /* Course Hero Section (Dark & Professional) */
  }
      <section className="bg-heading text-white py-12 relative overflow-hidden mx-6 rounded-3xl shadow-xl">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-primary skew-x-12 translate-x-32" />
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6 text-sm font-medium">
                <span className="text-primary hover:text-white transition-colors cursor-pointer tracking-wider uppercase text-xs font-bold bg-primary/10 px-3 py-1 rounded-full">IoT & Robotics</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400">Intermediate</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 leading-tight text-white">
                Mastering ESP32 for Advanced IoT Projects
              </h1>
              <p className="text-lg text-gray-300 mb-8 line-clamp-2 leading-relaxed">
                Learn to build real-world IoT applications using ESP32, advanced sensors, and secure cloud integration. From blinking an LED to building a smart home system.
              </p>
              
              <div className="flex flex-wrap items-center gap-8 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-500 overflow-hidden border-2 border-primary/50">
                    <img src="https://ui-avatars.com/api/?name=John+Doe&background=2563EB&color=fff" alt="Instructor" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-0.5">Instructor</div>
                    <div className="font-bold text-white text-sm">John Doe</div>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <div className="text-gray-400 text-xs mb-1">Rating</div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="font-bold text-sm text-white">4.9</span>
                    <span className="text-gray-400 ml-1 text-xs">(850)</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="text-gray-400 text-xs mb-1">Students</div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-300" />
                    <span className="font-bold text-sm text-white">12,450 enrolled</span>
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
      <section className="max-w-7xl mx-auto px-6 mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {
    /* Left Column - Details */
  }
          <div className="lg:col-span-2 space-y-8">
            
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm">
              <h2 className="text-xl font-heading font-bold text-heading mb-6">What you'll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {[
    "Program ESP32 using Arduino IDE",
    "Interface multiple sensors and actuators",
    "Send and receive data to IoT Cloud platforms",
    "Build a complete Smart Weather Station",
    "Understand MQTT protocols for IoT",
    "Develop a real-world home automation system"
  ].map((item, i) => <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                       <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-body text-sm leading-relaxed">{item}</span>
                  </div>)}
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm">
              <h2 className="text-xl font-heading font-bold text-heading mb-2">Course Curriculum</h2>
              <div className="text-sm text-caption mb-8">
                <span>12 Modules • 45 Lessons • 18h 30m total length</span>
              </div>
              
              <div className="space-y-4">
                {
    /* Module 1 */
  }
                <div className="border border-border rounded-xl overflow-hidden transition-all hover:border-primary/30">
                  <div className="bg-[#f8f9fa] px-6 py-4 flex justify-between items-center cursor-pointer border-b border-border font-heading font-bold text-heading">
                    <span className="text-base">Module 1: Introduction to ESP32</span>
                    <span className="text-xs font-normal text-caption">4 lectures • 45 min</span>
                  </div>
                  <div className="bg-white px-6 py-2 divide-y divide-border">
                    <div className="py-3 flex justify-between items-center text-body hover:bg-gray-50 -mx-6 px-6 transition-colors group cursor-pointer text-sm">
                      <div className="flex items-center gap-3">
                        <PlayCircle className="w-4 h-4 text-primary" />
                        <span className="group-hover:text-primary font-medium transition-colors">What is ESP32?</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded">Preview</span>
                        <span className="text-caption font-mono">10:20</span>
                      </div>
                    </div>
                    <div className="py-3 flex justify-between items-center text-body hover:bg-gray-50 -mx-6 px-6 transition-colors cursor-pointer group text-sm">
                      <div className="flex items-center gap-3">
                        <PlayCircle className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
                        <span className="group-hover:text-heading">Setting up the Arduino IDE</span>
                      </div>
                      <span className="text-caption font-mono">15:45</span>
                    </div>
                  </div>
                </div>

                {
    /* Module 2 */
  }
                <div className="border border-border rounded-xl overflow-hidden transition-all hover:border-primary/30 cursor-pointer">
                  <div className="bg-[#f8f9fa] px-6 py-4 flex justify-between items-center font-heading font-bold text-heading hover:bg-gray-50 transition-colors">
                    <span className="text-base">Module 2: Sensors and Actuators</span>
                    <span className="text-xs font-normal text-caption">8 lectures • 2h 15m</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm">
              <h2 className="text-xl font-heading font-bold text-heading mb-4">Requirements</h2>
              <ul className="list-disc list-inside text-body space-y-2 text-sm">
                <li>Basic understanding of C/C++ programming is helpful but not required.</li>
                <li>An ESP32 development board and basic electronics components (LEDs, resistors, sensors).</li>
                <li>A laptop or PC with Windows, Mac, or Linux.</li>
              </ul>
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
                 <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-300">
                    <PlayCircle className="w-8 h-8 text-white drop-shadow-lg" />
                 </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-heading font-extrabold text-heading">₹1,999</span>
                  <span className="text-lg text-caption line-through">₹4,999</span>
                </div>
                <div className="inline-block bg-success/10 text-success font-bold px-3 py-1 rounded-md text-xs mb-6">
                  60% off for a limited time
                </div>

                <div className="space-y-3 mb-6">
                  <button
    onClick={handleAddToCart}
    className="w-full bg-primary text-white hover:bg-secondary shadow-primary/20 py-3 rounded-xl font-bold text-base transition-colors shadow-md cursor-pointer"
  >
                    Add to Cart
                  </button>
                </div>

                <div className="text-center text-caption text-xs mb-6 pb-6 border-b border-border">
                  30-Day Money-Back Guarantee
                </div>

                <div className="space-y-3 text-body text-sm">
                  <div className="font-heading font-bold text-heading mb-3 text-sm">This course includes:</div>
                  <div className="flex items-center gap-3">
                    <Monitor className="w-4 h-4 text-primary" />
                    <span className="text-xs">18.5 hours on-demand video</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-xs">24 downloadable resources</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-xs">Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Monitor className="w-4 h-4 text-primary" />
                    <span className="text-xs">Access on mobile and TV</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>;
};
var stdin_default = StudentCourseDetails;
export {
  stdin_default as default
};
