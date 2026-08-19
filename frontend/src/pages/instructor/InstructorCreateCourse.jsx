import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Save,
  Send,
  CheckCircle,
  Image as ImageIcon,
  Video,
  AlertCircle,
  ChevronLeft,
  Check,
  FileText,
  DollarSign,
  List,
  UploadCloud
} from "lucide-react";
import { instructorApi } from "../../api/instructorApi";
import { getApiErrorMessage } from "../../api/client";

const COURSE_FORM_STEPS = [
  { id: "basic", label: "Basic Info", icon: FileText },
  { id: "media", label: "Media", icon: ImageIcon },
  { id: "pricing", label: "Pricing", icon: DollarSign },
  { id: "details", label: "Details", icon: List }
];

const listToTextarea = (value) => (Array.isArray(value) ? value.join("\n") : value || "");
const listToTags = (value) => (Array.isArray(value) ? value.join(", ") : value || "");

const courseToFormData = (course) => {
  if (!course) return {};
  return {
    title: course.title || "",
    subtitle: course.subtitle || "",
    shortDescription: course.shortDescription || "",
    fullDescription: course.fullDescription || course.description || "",
    category: typeof course.category === "string" ? course.category : course.category?.name || "",
    categoryId: course.categoryId || "",
    level: course.level || "Beginner",
    language: course.language || "English",
    price: course.price ?? "",
    discountPrice: course.discountPrice ?? "",
    tags: listToTags(course.tags),
    certificateEnabled: course.certificateEnabled ?? course.certificateAvail ?? true,
    requirements: listToTextarea(course.requirements),
    learningOutcomes: listToTextarea(course.learningOutcomes),
    targetAudience: course.targetAudience || "",
    thumbnail: course.thumbnail || "",
    promoVideoUrl: course.promoVideoUrl || ""
  };
};

const InstructorCreateCourse = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(Boolean(id));
  const [activeTab, setActiveTab] = useState("basic");

  // Media Upload States & Modes
  const [thumbnailMode, setThumbnailMode] = useState("upload");
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const thumbnailInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    shortDescription: "",
    fullDescription: "",
    category: "",
    level: "Beginner",
    language: "English",
    price: "",
    discountPrice: "",
    tags: "",
    certificateEnabled: true,
    requirements: "",
    learningOutcomes: "",
    targetAudience: "",
    thumbnail: "",
    promoVideoUrl: ""
  });

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    setIsUploadingThumbnail(true);

    try {
      const res = await instructorApi.uploadThumbnail(data);
      if (res?.success && res?.url) {
        setFormData((prev) => ({
          ...prev,
          thumbnail: res.url
        }));
        toast.success("Thumbnail image uploaded successfully!");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(getApiErrorMessage(err, "Failed to upload image"));
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const fetchCourse = async () => {
      setInitialLoading(true);
      try {
        const response = await instructorApi.getCourseDetails(id);
        const courseData = response?.data || response?.course || response;
        if (isMounted && courseData) {
          setFormData((prev) => ({
            ...prev,
            ...courseToFormData(courseData)
          }));
        }
      } catch (error) {
        console.error("Fetch course details error:", error);
        toast.error(getApiErrorMessage(error, "Failed to load course details"));
        navigate("/instructor/courses");
      } finally {
        if (isMounted) setInitialLoading(false);
      }
    };

    fetchCourse();
    return () => {
      isMounted = false;
    };
  }, [id]);
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : value
    }));
  };
  const handleSubmit = async (action = "draft") => {
    if (!formData.title.trim()) {
      toast.error("Course title is required");
      setActiveTab("basic");
      return;
    }

    if (!formData.category.trim()) {
      toast.error("Course category is required");
      setActiveTab("basic");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        description: formData.fullDescription,
        action: "draft"
      };
      const response = id
        ? await instructorApi.updateCourse(id, payload)
        : await instructorApi.createCourse(payload);
      const courseId = response.data?.id || id;
      toast.success("Course details saved successfully!");
      navigate(`/instructor/curriculum?courseId=${courseId}`);
    } catch (error) {
      console.error(error);
      toast.error(getApiErrorMessage(error, "Failed to save course details"));
    } finally {
      setLoading(false);
    }
  };
  if (initialLoading) {
    return <div className="max-w-5xl mx-auto py-24 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>;
  }
  return <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {
    /* Header */
  }
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <Link to="/instructor/courses" className="text-sm font-bold text-primary flex items-center gap-1 mb-2 hover:underline">
            <ChevronLeft className="w-4 h-4" /> Back to Courses
          </Link>
          <h1 className="text-3xl font-heading font-bold text-heading">{id ? "Edit Course" : "Create New Course"}</h1>
        </div>
      </div>

      {
    /* Stepper */
  }
      <div className="relative flex items-center justify-between w-full mb-12 mt-8 px-0 sm:px-4">
        {
    /* Lines Container */
  }
        <div className="absolute left-6 right-6 sm:left-10 sm:right-10 top-6 -translate-y-1/2 h-1 bg-gray-200 z-0 rounded-full">
          <div
    className="absolute left-0 top-0 h-full bg-primary transition-all duration-500 rounded-full"
    style={{ width: `${["basic", "media", "pricing", "details"].indexOf(activeTab) / 3 * 100}%` }}
  />
        </div>

        {COURSE_FORM_STEPS.map((step, index) => {
    const currentIndex = ["basic", "media", "pricing", "details"].indexOf(activeTab);
    const isCompleted = index < currentIndex;
    const isActive = index === currentIndex;
    const StepIcon = step.icon;
    return <div key={step.id} className="relative z-10 flex flex-col items-center">
              <button
      onClick={() => setActiveTab(step.id)}
      className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${isActive ? "bg-primary border-primary/30 text-white shadow-lg scale-110" : isCompleted ? "bg-primary border-primary text-white hover:bg-secondary" : "bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500"}`}
    >
                {isCompleted ? <Check className="w-6 h-6" /> : <StepIcon className="w-5 h-5" />}
              </button>
              <span className={`text-xs sm:text-sm font-bold absolute -bottom-8 whitespace-nowrap transition-colors duration-300 ${isActive || isCompleted ? "text-primary" : "text-caption"}`}>
                {step.label}
              </span>
            </div>;
  })}
      </div>

      {
    /* Form Content */
  }
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8">
        
        {
    /* BASIC INFO TAB */
  }
        {activeTab === "basic" && <div className="space-y-6 animate-fade-in">
            <div>
              <label className="block text-sm font-bold text-heading mb-2">Course Title <span className="text-red-500">*</span></label>
              <input
    type="text"
    name="title"
    value={formData.title}
    onChange={handleChange}
    placeholder="e.g. The Complete 2024 Web Development Bootcamp"
    className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
  />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-heading mb-2">Course Subtitle</label>
              <input
    type="text"
    name="subtitle"
    value={formData.subtitle}
    onChange={handleChange}
    placeholder="A brief summary of your course"
    className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
  />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-heading mb-2">Category <span className="text-red-500">*</span></label>
                <select
    name="category"
    value={formData.category}
    onChange={handleChange}
    className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
  >
                  <option value="">Select a category</option>
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                  <option value="Marketing">Marketing</option>
                  <option value="IT & Software">IT & Software</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-heading mb-2">Level</label>
                <select
    name="level"
    value={formData.level}
    onChange={handleChange}
    className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
  >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-heading mb-2">Language</label>
                <select
    name="language"
    value={formData.language}
    onChange={handleChange}
    className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
  >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-heading mb-2">Short Description</label>
              <textarea
    name="shortDescription"
    value={formData.shortDescription}
    onChange={handleChange}
    rows={3}
    placeholder="Will be shown on course cards and search results..."
    className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
  />
            </div>

            <div>
              <label className="block text-sm font-bold text-heading mb-2">Full Description</label>
              <textarea
    name="fullDescription"
    value={formData.fullDescription}
    onChange={handleChange}
    rows={6}
    placeholder="Detailed explanation of what the course covers..."
    className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
  />
            </div>
            
            <div className="flex justify-end pt-4">
              <button onClick={() => setActiveTab("media")} className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-secondary transition-colors">
                Next: Media
              </button>
            </div>
          </div>}

        {/* MEDIA TAB */}
        {activeTab === "media" && (
          <div className="space-y-8 animate-fade-in">
            {/* Course Thumbnail Upload / URL */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-lg font-heading font-bold text-heading">Course Thumbnail</h3>
                  <p className="text-xs text-caption">Upload a high quality image for your course card thumbnail.</p>
                </div>
                <div className="flex items-center bg-gray-100 dark:bg-neutral-800 p-1 rounded-xl text-xs font-bold shrink-0">
                  <button
                    type="button"
                    onClick={() => setThumbnailMode("upload")}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      thumbnailMode === "upload" ? "bg-white dark:bg-neutral-900 text-primary shadow-xs" : "text-caption hover:text-heading"
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setThumbnailMode("url")}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      thumbnailMode === "url" ? "bg-white dark:bg-neutral-900 text-primary shadow-xs" : "text-caption hover:text-heading"
                    }`}
                  >
                    Image URL
                  </button>
                </div>
              </div>

              {thumbnailMode === "upload" ? (
                <div>
                  <input
                    type="file"
                    ref={thumbnailInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {formData.thumbnail ? (
                    <div className="relative rounded-2xl overflow-hidden border border-border bg-gray-50 dark:bg-neutral-800 p-4 flex flex-col sm:flex-row items-center gap-6">
                      <img
                        src={formData.thumbnail}
                        alt="Course Thumbnail"
                        className="w-full sm:w-48 h-32 object-cover rounded-xl shadow-sm shrink-0"
                      />
                      <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-950/40 px-2.5 py-1 rounded-full w-fit mx-auto sm:mx-0">
                          <CheckCircle className="w-3.5 h-3.5" /> Thumbnail Attached
                        </div>
                        <p className="text-xs text-caption truncate max-w-sm">{formData.thumbnail}</p>
                        <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => thumbnailInputRef.current?.click()}
                            className="px-3 py-1.5 bg-white dark:bg-neutral-900 border border-border rounded-lg text-xs font-bold text-heading hover:border-primary transition-colors cursor-pointer"
                          >
                            Change Image
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, thumbnail: "" }))}
                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => thumbnailInputRef.current?.click()}
                      className="border-2 border-dashed border-border hover:border-primary/50 bg-gray-50/50 dark:bg-neutral-800/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-primary/5 group"
                    >
                      {isUploadingThumbnail ? (
                        <div className="flex flex-col items-center py-4">
                          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                          <p className="text-sm font-bold text-primary">Uploading thumbnail image...</p>
                        </div>
                      ) : (
                        <>
                          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                            <UploadCloud className="w-7 h-7" />
                          </div>
                          <h4 className="text-sm font-bold text-heading mb-1">Click to Upload Course Thumbnail Image</h4>
                          <p className="text-xs text-caption max-w-sm mb-4">
                            Supported: PNG, JPG, WEBP, GIF (Recommended size: 1280x720)
                          </p>
                          <span className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-xs hover:bg-secondary transition-colors">
                            Browse Image File
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-4">
                  <div>
                    <label className="block text-sm font-bold text-heading mb-2">Thumbnail Image URL</label>
                    <input
                      type="url"
                      name="thumbnail"
                      value={formData.thumbnail}
                      onChange={handleChange}
                      placeholder="https://example.com/course-thumbnail.jpg"
                      className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-heading"
                    />
                  </div>
                  <div className="h-32 rounded-2xl overflow-hidden bg-gray-100 border border-border flex items-center justify-center">
                    {formData.thumbnail ? (
                      <img src={formData.thumbnail} alt="Course thumbnail preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-caption" />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Promotional Video URL */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-lg font-heading font-bold text-heading">Promotional Video</h3>
                  <p className="text-xs text-caption">Add a hosted YouTube, Vimeo, or direct video link.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-heading mb-2">Video URL (YouTube / Vimeo / Direct Link)</label>
                <div className="relative">
                  <Video className="w-5 h-5 text-caption absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    name="promoVideoUrl"
                    value={formData.promoVideoUrl}
                    onChange={handleChange}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-heading"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => setActiveTab("basic")} className="px-6 py-3 border border-border rounded-xl font-bold text-heading hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button onClick={() => setActiveTab("pricing")} className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-secondary transition-colors">
                Next: Pricing
              </button>
            </div>
          </div>
        )}

        {
    /* PRICING TAB */
  }
        {activeTab === "pricing" && <div className="space-y-8 animate-fade-in">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-bold mb-1">Pricing Guidelines</p>
                <p>Set a competitive price for your course. Leave the price field at 0 to make it a free course.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-heading mb-2">Regular Price ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-caption font-bold">$</span>
                  <input
    type="number"
    name="price"
    value={formData.price}
    onChange={handleChange}
    placeholder="89.99"
    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-heading mb-2">Discounted Price ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-caption font-bold">$</span>
                  <input
    type="number"
    name="discountPrice"
    value={formData.discountPrice}
    onChange={handleChange}
    placeholder="49.99 (Optional)"
    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
  />
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <h3 className="text-lg font-heading font-bold text-heading mb-4">Certifications</h3>
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative flex items-start">
                  <input
    type="checkbox"
    name="certificateEnabled"
    checked={formData.certificateEnabled}
    onChange={handleChange}
    className="peer sr-only"
  />
                  <div className="w-5 h-5 border-2 border-border rounded bg-white peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold text-heading">Enable Certificate of Completion</div>
                  <div className="text-xs text-caption mt-1">Students will automatically receive a downloadable certificate upon finishing all lessons, quizzes, and assignments.</div>
                </div>
              </label>
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => setActiveTab("media")} className="px-6 py-3 border border-border rounded-xl font-bold text-heading hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button onClick={() => setActiveTab("details")} className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-secondary transition-colors">
                Next: Details
              </button>
            </div>
          </div>}

        {
    /* DETAILS TAB */
  }
        {activeTab === "details" && <div className="space-y-6 animate-fade-in">
            
            <div>
              <label className="block text-sm font-bold text-heading mb-2">What will students learn? (Learning Outcomes)</label>
              <textarea
    name="learningOutcomes"
    value={formData.learningOutcomes}
    onChange={handleChange}
    rows={4}
    placeholder="Enter one outcome per line..."
    className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
  />
            </div>

            <div>
              <label className="block text-sm font-bold text-heading mb-2">Requirements / Prerequisites</label>
              <textarea
    name="requirements"
    value={formData.requirements}
    onChange={handleChange}
    rows={3}
    placeholder="Enter one requirement per line..."
    className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
  />
            </div>

            <div>
              <label className="block text-sm font-bold text-heading mb-2">Target Audience</label>
              <textarea
    name="targetAudience"
    value={formData.targetAudience}
    onChange={handleChange}
    rows={3}
    placeholder="Who is this course for?"
    className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
  />
            </div>

            <div>
              <label className="block text-sm font-bold text-heading mb-2">Tags (Keywords)</label>
              <input
    type="text"
    name="tags"
    value={formData.tags}
    onChange={handleChange}
    placeholder="e.g. React, JavaScript, Frontend (comma separated)"
    className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
  />
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => setActiveTab("pricing")} className="px-6 py-3 border border-border rounded-xl font-bold text-heading hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button
                onClick={() => handleSubmit("save")}
                disabled={loading}
                className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-secondary transition-colors flex items-center gap-2 shadow-md cursor-pointer"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                Save Changes & Continue to Curriculum
              </button>
            </div>
          </div>}

      </div>
    </div>;
};
var stdin_default = InstructorCreateCourse;
export {
  stdin_default as default
};
