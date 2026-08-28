import { useState, useEffect } from "react";
import apiClient from "../../../api/client";
import toast from "react-hot-toast";
import {
  Save,
  Plus,
  Trash2,
  Layout,
  MessageSquare,
  PanelBottom,
  ChevronRight,
  Grid,
  Star,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  User,
  Quote,
  Sparkles,
} from "lucide-react";

const AdminWebsiteContent = () => {
  const [activeTab, setActiveTab] = useState("hero");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [content, setContent] = useState({
    hero: {
      badgeText: "Save Time On Your Studies",
      headlineLine1: "Learn New Skills.",
      headlineLine2: "Achieve Your Dreams.",
      headline: "Learn New Skills.\nAchieve Your Dreams.",
      subtitle: "",
      ctaText: "",
      ctaLink: "",
    },
    popularCategories: {
      sectionTitle: "Our Popular Categories",
      sectionSubtitle: "Explore courses across various high-demand industries.",
      items: [],
    },
    successStories: {
      sectionTitle: "Success Stories",
      sectionSubtitle: "See how Pi Tech has helped thousands of students transform their careers.",
      testimonials: [],
    },
    contactInfo: {
      email: "pibotsacademy@gmail.com",
      phone: "+91 91884 11223",
      timing: "Mon-Sat, 9am-6pm IST",
      office: "Pi BOTS Makerhub, Mampad, Kerala 676542, India",
    },
    footer: {
      facebook: "",
      twitter: "",
      linkedin: "",
      instagram: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
      copyright: "",
    },
    faqs: [],
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get("/admin/content");
      if (res.data.success) {
        setContent((prev) => ({
          ...prev,
          ...res.data.data,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch website content", error);
      toast.error("Failed to load website content");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await apiClient.put("/admin/content", content);
      if (res.data.success) {
        toast.success("Website content updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update content", error);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  // Field Handlers
  const handleHeroChange = (field, value) => {
    setContent({ ...content, hero: { ...content.hero, [field]: value } });
  };

  const handleContactInfoChange = (field, value) => {
    setContent({ ...content, contactInfo: { ...content.contactInfo, [field]: value } });
  };

  const handleFooterChange = (field, value) => {
    setContent({ ...content, footer: { ...content.footer, [field]: value } });
  };

  // Popular Categories Handlers
  const handleCategoryHeaderChange = (field, value) => {
    setContent({
      ...content,
      popularCategories: { ...content.popularCategories, [field]: value },
    });
  };

  const handleCategoryItemChange = (id, field, value) => {
    const updatedItems = content.popularCategories.items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setContent({
      ...content,
      popularCategories: { ...content.popularCategories, items: updatedItems },
    });
  };

  const addCategoryItem = () => {
    const newItem = {
      id: Date.now().toString(),
      name: "New Category",
      count: "10+ Courses",
      icon: "Code",
      slug: "new-category",
    };
    setContent({
      ...content,
      popularCategories: {
        ...content.popularCategories,
        items: [...content.popularCategories.items, newItem],
      },
    });
    toast.success("Category card added successfully!");
  };

  const removeCategoryItem = (id) => {
    const catToRemove = content.popularCategories.items.find((item) => item.id === id);
    setContent({
      ...content,
      popularCategories: {
        ...content.popularCategories,
        items: content.popularCategories.items.filter((item) => item.id !== id),
      },
    });
    toast.success(`Category "${catToRemove?.name || "Card"}" deleted successfully!`);
  };

  // Success Stories / Testimonial Handlers
  const handleStoryHeaderChange = (field, value) => {
    setContent({
      ...content,
      successStories: { ...content.successStories, [field]: value },
    });
  };

  const handleTestimonialChange = (id, field, value) => {
    const updatedTestimonials = content.successStories.testimonials.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setContent({
      ...content,
      successStories: { ...content.successStories, testimonials: updatedTestimonials },
    });
  };

  const addTestimonial = () => {
    const newTestimonial = {
      id: Date.now().toString(),
      name: "Student Name",
      role: "Software Developer",
      stars: 5,
      quote: "Great learning experience! Helped me achieve my career goals.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    };
    setContent({
      ...content,
      successStories: {
        ...content.successStories,
        testimonials: [...content.successStories.testimonials, newTestimonial],
      },
    });
    toast.success("Testimonial card added successfully!");
  };

  const removeTestimonial = (id) => {
    setContent({
      ...content,
      successStories: {
        ...content.successStories,
        testimonials: content.successStories.testimonials.filter((item) => item.id !== id),
      },
    });
    toast.success("Testimonial card deleted successfully!");
  };

  // FAQ Handlers
  const handleFaqChange = (id, field, value) => {
    const updatedFaqs = content.faqs.map((faq) =>
      faq.id === id ? { ...faq, [field]: value } : faq
    );
    setContent({ ...content, faqs: updatedFaqs });
  };

  const addFaq = () => {
    const newFaq = { id: Date.now().toString(), question: "", answer: "" };
    setContent({ ...content, faqs: [...content.faqs, newFaq] });
    toast.success("FAQ item added successfully!");
  };

  const removeFaq = (id) => {
    setContent({ ...content, faqs: content.faqs.filter((faq) => faq.id !== id) });
    toast.success("FAQ item deleted successfully!");
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 text-body">Loading website content manager...</div>;
  }

  const tabs = [
    { id: "hero", label: "Hero Section", icon: Layout },
    { id: "categories", label: "Popular Categories", icon: Grid },
    { id: "successStories", label: "Success Stories", icon: Star },
    { id: "contactInfo", label: "Contact Info", icon: PhoneCall },
    { id: "faqs", label: "FAQs", icon: MessageSquare },
    { id: "footer", label: "Footer & Social", icon: PanelBottom },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">Website Content</h1>
          <p className="text-body mt-1">Manage public-facing pages, categories, success stories, and contact details.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-secondary transition-all shadow-md shadow-primary/20 disabled:opacity-70 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between p-4 text-left font-medium transition-colors border-b border-border last:border-0 ${
                    isActive
                      ? "bg-primary/5 text-primary border-l-4 border-l-primary font-bold"
                      : "text-heading hover:bg-gray-50 border-l-4 border-l-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-primary" /> {tab.label}
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-sm min-h-[550px]">
            {/* 1. HERO SECTION SETTINGS */}
            {activeTab === "hero" && (
              <div className="space-y-6 animate-in fade-in">
                <h2 className="text-lg font-bold text-heading border-b border-border pb-3 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-primary" /> Hero Section (Homepage)
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-heading mb-2">Top Badge Tagline Text</label>
                    <input
                      type="text"
                      value={content.hero?.badgeText || ""}
                      onChange={(e) => handleHeroChange("badgeText", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body bg-gray-50/50"
                      placeholder="e.g. Save Time On Your Studies"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-heading mb-2">Main Heading (Line 1)</label>
                      <input
                        type="text"
                        value={content.hero?.headlineLine1 || (content.hero?.headline ? content.hero.headline.split("\n")[0] : "")}
                        onChange={(e) => {
                          const l1 = e.target.value;
                          const l2 = content.hero?.headlineLine2 || (content.hero?.headline ? content.hero.headline.split("\n")[1] || "" : "");
                          setContent({
                            ...content,
                            hero: {
                              ...content.hero,
                              headlineLine1: l1,
                              headline: `${l1}\n${l2}`,
                            },
                          });
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body bg-gray-50/50 font-bold"
                        placeholder="e.g. Learn New Skills."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-heading mb-2">Main Heading Line 2 (Subheading)</label>
                      <input
                        type="text"
                        value={content.hero?.headlineLine2 || (content.hero?.headline ? content.hero.headline.split("\n")[1] || "" : "")}
                        onChange={(e) => {
                          const l2 = e.target.value;
                          const l1 = content.hero?.headlineLine1 || (content.hero?.headline ? content.hero.headline.split("\n")[0] || "" : "");
                          setContent({
                            ...content,
                            hero: {
                              ...content.hero,
                              headlineLine2: l2,
                              headline: `${l1}\n${l2}`,
                            },
                          });
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body bg-gray-50/50 font-bold"
                        placeholder="e.g. Achieve Your Dreams."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-heading mb-2">Subtitle</label>
                    <textarea
                      value={content.hero?.subtitle || ""}
                      onChange={(e) => handleHeroChange("subtitle", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body resize-none bg-gray-50/50"
                      placeholder="Short description under the headline"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-heading mb-2">CTA Button Text</label>
                      <input
                        type="text"
                        value={content.hero?.ctaText || ""}
                        onChange={(e) => handleHeroChange("ctaText", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body bg-gray-50/50"
                        placeholder="e.g. Browse Courses"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-heading mb-2">CTA Link</label>
                      <input
                        type="text"
                        value={content.hero?.ctaLink || ""}
                        onChange={(e) => handleHeroChange("ctaLink", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body bg-gray-50/50"
                        placeholder="e.g. /courses"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. POPULAR CATEGORIES SETTINGS */}
            {activeTab === "categories" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <h2 className="text-lg font-bold text-heading flex items-center gap-2">
                    <Grid className="w-5 h-5 text-primary" /> Popular Categories
                  </h2>
                  <button
                    onClick={addCategoryItem}
                    className="flex items-center gap-2 text-sm text-primary font-bold hover:bg-primary/10 px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Category Card
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-heading mb-2">Section Title</label>
                    <input
                      type="text"
                      value={content.popularCategories?.sectionTitle || ""}
                      onChange={(e) => handleCategoryHeaderChange("sectionTitle", e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary outline-none text-body bg-gray-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-heading mb-2">Section Subtitle</label>
                    <input
                      type="text"
                      value={content.popularCategories?.sectionSubtitle || ""}
                      onChange={(e) => handleCategoryHeaderChange("sectionSubtitle", e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary outline-none text-body bg-gray-50/50"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  {content.popularCategories?.items?.map((cat, index) => (
                    <div key={cat.id} className="p-4 border border-border rounded-2xl bg-gray-50/50 relative group space-y-3">
                      <button
                        onClick={() => removeCategoryItem(cat.id)}
                        className="absolute top-4 right-4 text-red-500 p-1.5 bg-white rounded-lg shadow-sm hover:bg-red-50 transition-colors"
                        title="Delete Category Card"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-10">
                        <div>
                          <label className="block text-xs font-bold text-caption uppercase mb-1">Category Name</label>
                          <input
                            type="text"
                            value={cat.name}
                            onChange={(e) => handleCategoryItemChange(cat.id, "name", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-white outline-none text-sm font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-caption uppercase mb-1">Course Count Text</label>
                          <input
                            type="text"
                            value={cat.count}
                            onChange={(e) => handleCategoryItemChange(cat.id, "count", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-white outline-none text-sm"
                            placeholder="120+ Courses"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-caption uppercase mb-1">Icon Name</label>
                          <input
                            type="text"
                            value={cat.icon}
                            onChange={(e) => handleCategoryItemChange(cat.id, "icon", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-white outline-none text-sm"
                            placeholder="Code, Palette, etc."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. SUCCESS STORIES (TESTIMONIALS) SETTINGS */}
            {activeTab === "successStories" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <h2 className="text-lg font-bold text-heading flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-current" /> Success Stories (Testimonials)
                  </h2>
                  <button
                    onClick={addTestimonial}
                    className="flex items-center gap-2 text-sm text-primary font-bold hover:bg-primary/10 px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Testimonial
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-heading mb-2">Section Title</label>
                    <input
                      type="text"
                      value={content.successStories?.sectionTitle || ""}
                      onChange={(e) => handleStoryHeaderChange("sectionTitle", e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary outline-none text-body bg-gray-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-heading mb-2">Section Subtitle</label>
                    <input
                      type="text"
                      value={content.successStories?.sectionSubtitle || ""}
                      onChange={(e) => handleStoryHeaderChange("sectionSubtitle", e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary outline-none text-body bg-gray-50/50"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  {content.successStories?.testimonials?.map((t, index) => (
                    <div key={t.id} className="p-4 border border-border rounded-2xl bg-gray-50/50 relative group space-y-3">
                      <button
                        onClick={() => removeTestimonial(t.id)}
                        className="absolute top-4 right-4 text-red-500 p-1.5 bg-white rounded-lg shadow-sm hover:bg-red-50 transition-colors"
                        title="Delete Testimonial"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-10">
                        <div>
                          <label className="block text-xs font-bold text-caption uppercase mb-1">Student Name</label>
                          <input
                            type="text"
                            value={t.name}
                            onChange={(e) => handleTestimonialChange(t.id, "name", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-white outline-none text-sm font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-caption uppercase mb-1">Role / Job Title</label>
                          <input
                            type="text"
                            value={t.role}
                            onChange={(e) => handleTestimonialChange(t.id, "role", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-white outline-none text-sm"
                            placeholder="e.g. Frontend Developer"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-caption uppercase mb-1">Rating Stars (1-5)</label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={t.stars}
                            onChange={(e) => handleTestimonialChange(t.id, "stars", parseInt(e.target.value) || 5)}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-white outline-none text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-caption uppercase mb-1">Testimonial Quote</label>
                        <textarea
                          rows={2}
                          value={t.quote}
                          onChange={(e) => handleTestimonialChange(t.id, "quote", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-white outline-none text-sm resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. CONTACT INFO & OFFICE SETTINGS */}
            {activeTab === "contactInfo" && (
              <div className="space-y-6 animate-in fade-in">
                <h2 className="text-lg font-bold text-heading border-b border-border pb-3 flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-primary" /> Contact Details & Office Info
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-heading mb-2 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-primary" /> Contact Email
                    </label>
                    <input
                      type="email"
                      value={content.contactInfo?.email || ""}
                      onChange={(e) => handleContactInfoChange("email", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary outline-none text-body bg-gray-50/50"
                      placeholder="pibotsacademy@gmail.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-heading mb-2 flex items-center gap-1.5">
                      <PhoneCall className="w-4 h-4 text-primary" /> Phone Number
                    </label>
                    <input
                      type="text"
                      value={content.contactInfo?.phone || ""}
                      onChange={(e) => handleContactInfoChange("phone", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary outline-none text-body bg-gray-50/50"
                      placeholder="+91 91884 11223"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-heading mb-2 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-primary" /> Support Working Hours
                    </label>
                    <input
                      type="text"
                      value={content.contactInfo?.timing || ""}
                      onChange={(e) => handleContactInfoChange("timing", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary outline-none text-body bg-gray-50/50"
                      placeholder="Mon-Sat, 9am-6pm IST"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-heading mb-2 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" /> Office Address
                    </label>
                    <input
                      type="text"
                      value={content.contactInfo?.office || ""}
                      onChange={(e) => handleContactInfoChange("office", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary outline-none text-body bg-gray-50/50"
                      placeholder="Pi BOTS Makerhub, Mampad, Kerala 676542, India"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. FAQS SETTINGS */}
            {activeTab === "faqs" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <h2 className="text-lg font-bold text-heading flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" /> Frequently Asked Questions
                  </h2>
                  <button
                    onClick={addFaq}
                    className="flex items-center gap-2 text-sm text-primary font-bold hover:bg-primary/10 px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add FAQ
                  </button>
                </div>

                <div className="space-y-4">
                  {content.faqs?.map((faq, index) => (
                    <div key={faq.id} className="p-4 border border-border rounded-2xl bg-gray-50/50 relative group">
                      <button
                        onClick={() => removeFaq(faq.id)}
                        className="absolute top-4 right-4 text-red-500 p-1.5 bg-white rounded-lg shadow-sm hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="space-y-3 pr-10">
                        <div>
                          <label className="block text-xs font-bold text-caption mb-1 uppercase">Question {index + 1}</label>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => handleFaqChange(faq.id, "question", e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:border-primary outline-none transition-all text-body font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-caption mb-1 uppercase">Answer</label>
                          <textarea
                            value={faq.answer}
                            onChange={(e) => handleFaqChange(faq.id, "answer", e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:border-primary outline-none transition-all text-body resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. FOOTER & SOCIAL LINKS */}
            {activeTab === "footer" && (
              <div className="space-y-6 animate-in fade-in">
                <h2 className="text-lg font-bold text-heading border-b border-border pb-3 flex items-center gap-2">
                  <PanelBottom className="w-5 h-5 text-primary" /> Footer & Social Links
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold text-caption mb-3 uppercase tracking-wider">Social Media Links</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {["facebook", "twitter", "linkedin", "instagram"].map((social) => (
                        <div key={social}>
                          <label className="block text-sm font-bold text-heading mb-1.5 capitalize">{social}</label>
                          <input
                            type="text"
                            value={content.footer?.[social] || ""}
                            onChange={(e) => handleFooterChange(social, e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary outline-none text-body bg-gray-50/50"
                            placeholder={`https://${social}.com/...`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-sm font-bold text-heading mb-2">Copyright Footer Text</label>
                    <input
                      type="text"
                      value={content.footer?.copyright || ""}
                      onChange={(e) => handleFooterChange("copyright", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary outline-none text-body bg-gray-50/50"
                      placeholder="© 2026 Pi Tech LMS Platform. All Rights Reserved."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWebsiteContent;
