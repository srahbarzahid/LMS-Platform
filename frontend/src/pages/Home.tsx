import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Code, PenTool, Briefcase, Megaphone, Star, CheckCircle2, ChevronRight, Clock, Award, Users, Mail, Phone, MapPin, Send, Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

const Home = () => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);

  useEffect(() => {
    // Fetch courses from the public endpoint
    axios.get('http://localhost:5000/api/courses')
      .then(res => {
        const allCourses = res.data.data;
        const featured = allCourses.filter((c: any) => c.featured).slice(0, 4);
        setFeaturedCourses(featured);
      })
      .catch(err => console.error('Error fetching courses:', err));
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-b from-orange-200 via-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="max-w-3xl mx-auto">
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-white/40 text-heading font-medium text-sm rounded-full mb-8 shadow-sm">
             <span className="flex -space-x-2">
               <img src="https://i.pravatar.cc/100?img=1" alt="Avatar" className="w-6 h-6 rounded-full border border-white" />
               <img src="https://i.pravatar.cc/100?img=2" alt="Avatar" className="w-6 h-6 rounded-full border border-white" />
               <img src="https://i.pravatar.cc/100?img=3" alt="Avatar" className="w-6 h-6 rounded-full border border-white" />
             </span>
             Save Time On Your Studies
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-heading leading-tight mb-6 max-w-4xl mx-auto">
             Learn New Skills. <br />
             Achieve Your Dreams.
          </h1>
          
          <p className="text-lg md:text-xl text-body mb-10 max-w-3xl mx-auto leading-relaxed">
             Explore thousands of online courses from expert instructors. Level up your skills, discover new hobbies, and take your career to the next level.
          </p>
          
          <div className="flex justify-center mb-10">
             <Link to="/courses" className="px-10 py-4 bg-gradient-to-r from-[#d95c00] to-[#ff9933] text-white font-bold rounded-full hover:shadow-xl hover:shadow-orange-500/30 transition-all hover:-translate-y-1">
                View Course
             </Link>
          </div>

          {/* Floating Images Container */}
          <div className="relative max-w-4xl mx-auto h-[220px] sm:h-[280px] md:h-[350px] mt-6 flex justify-center items-end">
             {/* Left Card */}
             <div className="absolute left-0 bottom-8 w-1/3 md:w-1/4 h-[60%] rounded-2xl overflow-hidden shadow-2xl transform -rotate-6 hover:-translate-y-4 transition-transform duration-500 z-10">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" alt="Students" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20"></div>
             </div>

             {/* Right Card */}
             <div className="absolute right-0 bottom-8 w-1/3 md:w-1/4 h-[65%] rounded-2xl overflow-hidden shadow-2xl transform rotate-6 hover:-translate-y-4 transition-transform duration-500 z-10">
                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80" alt="Learning" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20"></div>
             </div>

             {/* Center Card (Main Video) */}
             <div className="absolute w-[65%] md:w-[55%] h-[85%] rounded-2xl overflow-hidden shadow-2xl z-20 hover:-translate-y-2 transition-transform duration-500 border-4 border-white">
                <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80" alt="Video Presentation" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/50 transition-colors">
                    <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-white ml-1"></div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-heading font-bold text-heading mb-3">Our Popular Categories</h2>
            <p className="text-body">Explore courses across various high-demand industries.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Development', icon: <Code className="w-6 h-6 text-primary" />, courses: '120+ Courses' },
              { name: 'Design', icon: <PenTool className="w-6 h-6 text-primary" />, courses: '80+ Courses' },
              { name: 'Business', icon: <Briefcase className="w-6 h-6 text-primary" />, courses: '60+ Courses' },
              { name: 'Marketing', icon: <Megaphone className="w-6 h-6 text-primary" />, courses: '40+ Courses' },
            ].map((cat, i) => (
              <Link key={i} to={`/categories/${cat.name.toLowerCase()}`} className="relative p-8 rounded-3xl border border-white/60 bg-gradient-to-br from-orange-50/90 to-white/50 backdrop-blur-xl shadow-xl shadow-orange-500/5 hover:shadow-orange-500/15 hover:-translate-y-2 transition-all duration-500 group overflow-hidden">
                {/* Decorative background flares */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full blur-2xl -mr-10 -mt-10 group-hover:from-orange-500/30 transition-colors duration-500"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/80 to-transparent rounded-full blur-xl -ml-8 -mb-8"></div>
                
                <div className="relative z-10 w-16 h-16 bg-white/90 backdrop-blur-md shadow-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/50">
                  {cat.icon}
                </div>
                <h3 className="relative z-10 font-heading font-bold text-heading text-xl mb-1">{cat.name}</h3>
                <p className="relative z-10 text-sm text-caption font-medium">{cat.courses}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section id="courses" className="py-24 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-heading mb-4">Featured Courses</h2>
            <p className="text-body max-w-2xl mx-auto">Learn from the industry's best with our handpicked selection of top-performing educational programs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {featuredCourses.map((course, i) => (
              <div key={course.id || i} className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-shadow flex flex-col group cursor-pointer relative">
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img src={`https://picsum.photos/seed/${course.id}/500/300`} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Heart button */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(course);
                    }}
                    className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist(course.id) ? 'fill-red-500 text-red-500' : 'text-caption hover:text-red-500 hover:fill-red-500/20'} transition-colors`} />
                  </button>

                  <span className="absolute top-3 left-3 bg-yellow-400 text-heading px-2 py-1 text-xs font-bold rounded flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 fill-current" /> Featured
                  </span>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-sm font-bold text-heading">{course.rating || '4.5'}</span>
                    <span className="text-xs text-caption">({course.students || '1k+'} students)</span>
                  </div>
                  <h3 className="font-heading font-bold text-heading mb-2 line-clamp-2 leading-tight">{course.title}</h3>
                  <p className="text-xs text-body mb-4">By {course.instructor?.name || 'Instructor'}</p>
                  <div className="mt-auto flex justify-between items-center mt-4">
                    <div className="text-xl font-extrabold text-heading">₹{course.price}</div>
                    <Link to="/courses/1" className="px-5 py-2 bg-gradient-to-r from-orange-600 to-orange-400 text-white font-medium rounded-full hover:shadow-md hover:from-orange-700 hover:to-orange-500 transition-all text-sm">
                      View Course
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
             <Link to="/courses" className="px-8 py-3.5 bg-gradient-to-r from-orange-600 to-orange-400 text-white font-medium rounded-full hover:shadow-lg hover:from-orange-700 hover:to-orange-500 transition-all text-sm">
                View All Courses
             </Link>
          </div>
        </div>
      </section>

      {/* Transform Your Life */}
      <section id="about" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-heading font-bold text-heading mb-6 leading-tight">
                Transform Your Life Through <br/>Quality Education
              </h2>
              <p className="text-body mb-8 text-lg">
                We provide the tools, community, and expert knowledge to help you reach your professional goals and personal milestones.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  "Learn from the experts",
                  "Self-paced learning",
                  "Career-focused curriculum",
                  "Global student community"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-heading font-medium text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative h-[500px]">
              <div className="absolute right-0 top-0 w-3/4 bg-white p-6 rounded-2xl shadow-xl border border-border z-10">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-bold text-heading mb-2">Expert Mentors</h4>
                <p className="text-sm text-body">Get guidance from professionals currently working in their respective fields.</p>
              </div>
              
              <div className="absolute right-10 bottom-0 w-3/4 bg-white p-6 rounded-2xl shadow-xl border border-border z-20">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-bold text-heading mb-2">Lifetime Access</h4>
                <p className="text-sm text-body">Once you buy a course, it's yours forever. Learn at your own pace with no deadlines.</p>
              </div>
              
              <div className="absolute left-0 top-1/3 w-2/3 bg-white p-6 rounded-2xl shadow-xl border border-border z-30">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-bold text-heading mb-2">Flexible Learning</h4>
                <p className="text-sm text-body">Seamlessly switch between phone, tablet, and desktop. Learn anywhere, anytime.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-heading mb-4">Hear From Our Success Stories</h2>
            <p className="text-body max-w-2xl mx-auto">Join thousands of students who have leveled up their careers through Pibots Robotics.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "The curriculum is incredibly structured and easy to follow. I went from zero coding knowledge to landing my first junior dev job in just 6 months!", author: "Jessica Miller", role: "Frontend Developer", img: "https://i.pravatar.cc/150?img=5" },
              { text: "Being able to access the course content on my phone during my commute made a huge difference. High quality production and expert teachers.", author: "David Thompson", role: "Marketing Manager", img: "https://i.pravatar.cc/150?img=11" },
              { text: "The community forums are so active! Whenever I got stuck, either a mentor or a fellow student helped me out within hours. Highly recommended.", author: "Elena Rodriguez", role: "UX Designer", img: "https://i.pravatar.cc/150?img=9" },
            ].map((test, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-border shadow-sm flex flex-col h-full">
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(star => <Star key={star} className="w-5 h-5 fill-primary text-primary" />)}
                </div>
                <p className="text-body italic mb-8 flex-grow">"{test.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={test.img} alt={test.author} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-heading text-sm">{test.author}</h4>
                    <p className="text-xs text-caption">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-12">
             <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-body hover:bg-gray-50"><ChevronRight className="w-5 h-5 rotate-180" /></button>
             <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-body hover:bg-gray-50"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-x-1/3 translate-y-1/3"></div>
            
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl font-heading font-bold text-white mb-4">Join 10,000+ Students</h2>
              <p className="text-white/90 text-lg">
                Start your journey today and get 20% off your first course. Become the version of yourself you've always dreamed of.
              </p>
            </div>
            <div className="relative z-10 w-full md:w-auto">
              <Link to="/register" className="block text-center px-10 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap">
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-heading mb-4">Get in Touch</h2>
            <p className="text-xl text-body max-w-2xl mx-auto">
              Have questions about our courses or need support? We're here to help. Reach out to us using the form below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white p-8 rounded-2xl border border-border shadow-sm">
                <h3 className="text-2xl font-heading font-bold text-heading mb-6">Contact Info</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-heading mb-1">Email</h4>
                      <p className="text-body text-sm">pibotsacademy@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-heading mb-1">Phone</h4>
                      <p className="text-body text-sm">+91 91884 11223</p>
                      <p className="text-body text-sm">Mon-Sat, 9am-6pm IST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-heading mb-1">Office</h4>
                      <p className="text-body text-sm">Pi BOTS Makerhub, Mampad</p>
                      <p className="text-body text-sm">Kerala 676542, India</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 md:p-10 rounded-2xl border border-border shadow-sm">
                <h3 className="text-2xl font-heading font-bold text-heading mb-8">Send us a Message</h3>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-heading mb-2">First Name</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body bg-[#f8f9fa]"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-heading mb-2">Last Name</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body bg-[#f8f9fa]"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-heading mb-2">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body bg-[#f8f9fa]"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-heading mb-2">Subject</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body bg-[#f8f9fa]"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-heading mb-2">Message</label>
                    <textarea 
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body bg-[#f8f9fa] resize-none"
                      placeholder="Write your message here..."
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="bg-primary text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-secondary transition-colors shadow-md shadow-primary/20 flex items-center justify-center gap-2 w-full md:w-auto">
                    <Send className="w-5 h-5" /> Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
