import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import apiClient from "../api/client";
import {
  Code,
  PenTool,
  Briefcase,
  Megaphone,
  Database,
  Star,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Clock,
  Award,
  Users,
  Mail,
  Phone,
  MapPin,
  Send,
  Heart,
  HelpCircle,
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";

const Home = () => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [openFaqId, setOpenFaqId] = useState(null);

  // Website Content State (Fetched dynamically from API)
  const [siteContent, setSiteContent] = useState({
    hero: {
      badgeText: "Save Time On Your Studies",
      headlineLine1: "Learn New Skills.",
      headlineLine2: "Achieve Your Dreams.",
      headline: "Learn New Skills.\nAchieve Your Dreams.",
      subtitle: "Explore thousands of online courses from expert instructors. Level up your skills, discover new hobbies, and take your career to the next level.",
      ctaText: "View Courses",
      ctaLink: "/courses",
    },
    popularCategories: {
      sectionTitle: "Our Popular Categories",
      sectionSubtitle: "Explore courses across various high-demand industries.",
      items: [
        { id: "1", name: "Development", count: "120+ Courses", icon: "Code", slug: "development" },
        { id: "2", name: "Design", count: "80+ Courses", icon: "Palette", slug: "design" },
        { id: "3", name: "Business", count: "60+ Courses", icon: "Briefcase", slug: "business" },
        { id: "4", name: "Marketing", count: "40+ Courses", icon: "Megaphone", slug: "marketing" },
      ],
    },
    successStories: {
      sectionTitle: "Success Stories",
      sectionSubtitle: "See how Pi Tech has helped thousands of students transform their careers.",
      testimonials: [
        {
          id: "1",
          name: "Jessica Miller",
          role: "Frontend Developer",
          stars: 5,
          quote: "The curriculum is incredibly structured and easy to follow. I went from zero coding knowledge to landing my first junior dev job in just 6 months!",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
        },
        {
          id: "2",
          name: "David Thompson",
          role: "Marketing Manager",
          stars: 5,
          quote: "Being able to access the course content on my phone during my commute made a huge difference. High quality production and expert teachers.",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
        },
        {
          id: "3",
          name: "Elena Rodriguez",
          role: "UX Designer",
          stars: 5,
          quote: "The community forums are so active! Whenever I got stuck, either a mentor or a fellow student helped me out within hours. Highly recommended.",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
        },
      ],
    },
    contactInfo: {
      email: "pibotsacademy@gmail.com",
      phone: "+91 91884 11223",
      timing: "Mon-Sat, 9am-6pm IST",
      office: "Pi BOTS Makerhub, Mampad, Kerala 676542, India",
    },
    faqs: [
      {
        id: "1",
        question: "How do I access my purchased courses?",
        answer: "Once you purchase a course, you can access it anytime from your Student Dashboard under the 'My Courses' section.",
      },
      {
        id: "2",
        question: "Do I get a certificate upon completion?",
        answer: "Yes! All of our paid courses come with a verifiable digital certificate upon successful completion of the curriculum.",
      },
      {
        id: "3",
        question: "What payment methods are accepted?",
        answer: "We accept all major credit cards, PayPal, and regional payment gateways depending on your location.",
      },
    ],
  });

  useEffect(() => {
    // 1. Fetch Dynamic Website Content
    apiClient
      .get("/public/content")
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setSiteContent((prev) => ({
            ...prev,
            ...res.data.data,
          }));
        }
      })
      .catch((err) => console.log("Using default site content"));

    // 2. Fetch Featured Courses
    apiClient
      .get("/courses?limit=12")
      .then((res) => {
        const allCourses = Array.isArray(res.data.data) ? res.data.data : res.data.courses || [];
        const featured = allCourses.filter((c) => c.featured);
        setFeaturedCourses((featured.length > 0 ? featured : allCourses).slice(0, 4));
      })
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  const toggleFaq = (id) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  // Helper for dynamic icon mapping
  const renderCategoryIcon = (iconName) => {
    switch (iconName?.toLowerCase()) {
      case "code":
      case "development":
        return <Code className="w-6 h-6 text-primary" />;
      case "palette":
      case "pentool":
      case "design":
        return <PenTool className="w-6 h-6 text-primary" />;
      case "briefcase":
      case "business":
        return <Briefcase className="w-6 h-6 text-primary" />;
      case "megaphone":
      case "marketing":
        return <Megaphone className="w-6 h-6 text-primary" />;
      case "database":
      case "data science":
        return <Database className="w-6 h-6 text-primary" />;
      default:
        return <Code className="w-6 h-6 text-primary" />;
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-b from-orange-200 via-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-white/40 text-heading font-medium text-sm rounded-full mb-8 shadow-sm">
            <span className="flex -space-x-2">
              <img src="https://i.pravatar.cc/100?img=1" alt="Avatar" className="w-6 h-6 rounded-full border border-white" />
              <img src="https://i.pravatar.cc/100?img=2" alt="Avatar" className="w-6 h-6 rounded-full border border-white" />
              <img src="https://i.pravatar.cc/100?img=3" alt="Avatar" className="w-6 h-6 rounded-full border border-white" />
            </span>
            {siteContent.hero?.badgeText || "Save Time On Your Studies"}
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-bold text-heading leading-tight mb-6 max-w-4xl mx-auto">
            {siteContent.hero?.headlineLine1 || (siteContent.hero?.headline ? siteContent.hero.headline.split("\n")[0] : "Learn New Skills.")}
            <br />
            {siteContent.hero?.headlineLine2 || (siteContent.hero?.headline ? siteContent.hero.headline.split("\n")[1] : "Achieve Your Dreams.")}
          </h1>

          <p className="text-lg md:text-xl text-body mb-10 max-w-3xl mx-auto leading-relaxed">
            {siteContent.hero?.subtitle || "Explore thousands of online courses from expert instructors. Level up your skills and take your career to the next level."}
          </p>

          <div className="flex justify-center mb-10">
            <Link
              to={siteContent.hero?.ctaLink || "/courses"}
              className="px-10 py-4 bg-gradient-to-r from-[#d95c00] to-[#ff9933] text-white font-bold rounded-full hover:shadow-xl hover:shadow-orange-500/30 transition-all hover:-translate-y-1"
            >
              {siteContent.hero?.ctaText || "View Courses"}
            </Link>
          </div>

          {/* Floating Images Container */}
          <div className="relative max-w-4xl mx-auto h-[220px] sm:h-[280px] md:h-[350px] mt-6 flex justify-center items-end">
            <div className="absolute left-0 bottom-8 w-1/3 md:w-1/4 h-[60%] rounded-2xl overflow-hidden shadow-2xl transform -rotate-6 hover:-translate-y-4 transition-transform duration-500 z-10">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" alt="Students" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="absolute right-0 bottom-8 w-1/3 md:w-1/4 h-[65%] rounded-2xl overflow-hidden shadow-2xl transform rotate-6 hover:-translate-y-4 transition-transform duration-500 z-10">
              <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80" alt="Learning" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="absolute w-[65%] md:w-[55%] h-[85%] rounded-2xl overflow-hidden shadow-2xl z-20 hover:-translate-y-2 transition-transform duration-500 border-4 border-white">
              <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80" alt="Video Presentation" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/50 transition-colors">
                  <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-white ml-1" />
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
            <h2 className="text-3xl font-heading font-bold text-heading mb-3">
              {siteContent.popularCategories?.sectionTitle || "Our Popular Categories"}
            </h2>
            <p className="text-body">
              {siteContent.popularCategories?.sectionSubtitle || "Explore courses across various high-demand industries."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {siteContent.popularCategories?.items?.map((cat, i) => (
              <Link
                key={cat.id || i}
                to={`/courses?category=${cat.slug || cat.name.toLowerCase()}`}
                className="relative p-8 rounded-3xl border border-white/60 bg-gradient-to-br from-orange-50/90 to-white/50 backdrop-blur-xl shadow-xl shadow-orange-500/5 hover:shadow-orange-500/15 hover:-translate-y-2 transition-all duration-500 group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full blur-2xl -mr-10 -mt-10 group-hover:from-orange-500/30 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/80 to-transparent rounded-full blur-xl -ml-8 -mb-8" />

                <div className="relative z-10 w-16 h-16 bg-white/90 backdrop-blur-md shadow-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/50">
                  {renderCategoryIcon(cat.icon || cat.name)}
                </div>
                <h3 className="relative z-10 font-heading font-bold text-heading text-xl mb-1">{cat.name}</h3>
                <p className="relative z-10 text-sm text-caption font-medium">{cat.count || "10+ Courses"}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (Success Stories) */}
      <section className="py-24 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-heading mb-4">
              {siteContent.successStories?.sectionTitle || "Hear From Our Success Stories"}
            </h2>
            <p className="text-body max-w-2xl mx-auto">
              {siteContent.successStories?.sectionSubtitle || "Join thousands of students who have leveled up their careers."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {siteContent.successStories?.testimonials?.map((test, i) => (
              <div key={test.id || i} className="bg-white p-8 rounded-2xl border border-border shadow-sm flex flex-col h-full">
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: test.stars || 5 }).map((_, starIndex) => (
                    <Star key={starIndex} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-body italic mb-8 flex-grow">"{test.quote}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={test.avatar || `https://i.pravatar.cc/150?img=${i + 5}`}
                    alt={test.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-heading text-sm">{test.name}</h4>
                    <p className="text-xs text-caption">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic FAQs Accordion Section */}
      <section id="faqs" className="py-24 bg-white border-t border-border/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
              <HelpCircle className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-heading mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-body max-w-2xl mx-auto">
              Find quick answers to common questions about course access, certificates, and learning policies.
            </p>
          </div>

          <div className="space-y-4">
            {siteContent.faqs?.map((faq, index) => {
              const isOpen = openFaqId === (faq.id || index);
              return (
                <div
                  key={faq.id || index}
                  className="border border-border rounded-2xl overflow-hidden transition-all bg-white shadow-sm hover:shadow-md"
                >
                  <button
                    onClick={() => toggleFaq(faq.id || index)}
                    className="w-full flex items-center justify-between p-6 text-left font-bold text-heading text-lg cursor-pointer hover:text-primary transition-colors gap-4"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-body text-base border-t border-border/40 pt-4 leading-relaxed bg-gray-50/50 animate-in fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
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
                      <p className="text-body text-sm">{siteContent.contactInfo?.email || "pibotsacademy@gmail.com"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-heading mb-1">Phone</h4>
                      <p className="text-body text-sm">{siteContent.contactInfo?.phone || "+91 91884 11223"}</p>
                      <p className="text-body text-sm">{siteContent.contactInfo?.timing || "Mon-Sat, 9am-6pm IST"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-heading mb-1">Office</h4>
                      <p className="text-body text-sm">{siteContent.contactInfo?.office || "Pi BOTS Makerhub, Mampad, Kerala 676542, India"}</p>
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
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-primary text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-secondary transition-colors shadow-md shadow-primary/20 flex items-center justify-center gap-2 w-full md:w-auto"
                  >
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
