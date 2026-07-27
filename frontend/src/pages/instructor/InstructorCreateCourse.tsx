import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { 
  Save, Send, CheckCircle, Upload, 
  Image as ImageIcon, Video, AlertCircle, ChevronLeft,
  Check, FileText, DollarSign, List
} from 'lucide-react';

const InstructorCreateCourse = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // basic, media, pricing, details, curriculum

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    shortDescription: '',
    fullDescription: '',
    category: '',
    level: 'Beginner',
    language: 'English',
    price: '',
    discountPrice: '',
    tags: '',
    certificateEnabled: true,
    requirements: '',
    learningOutcomes: '',
    targetAudience: '',
    promoVideoUrl: '',
  });

  useEffect(() => {
    if (id) {
      // Mock fetch data for edit mode
      setFormData(prev => ({
        ...prev,
        title: 'Complete UI/UX Design Masterclass',
        subtitle: 'Learn design from scratch',
        price: '89.99',
        category: 'Design'
      }));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (action: 'draft' | 'review' | 'publish') => {
    setLoading(true);
    try {
      // Mock API call
      // await instructorApi.createCourse({ ...formData, status: action });
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Course successfully saved as ${action}!`);
      navigate('/instructor/courses');
    } catch (error) {
      console.error(error);
      alert('Failed to save course.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <Link to="/instructor/courses" className="text-sm font-bold text-primary flex items-center gap-1 mb-2 hover:underline">
            <ChevronLeft className="w-4 h-4" /> Back to Courses
          </Link>
          <h1 className="text-3xl font-heading font-bold text-heading">{id ? 'Edit Course' : 'Create New Course'}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => handleSubmit('draft')}
            disabled={loading}
            className="flex items-center gap-2 bg-white border border-border text-heading px-4 py-2.5 rounded-xl font-bold shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Save className="w-4 h-4 text-gray-500" /> Save as Draft
          </button>
          <button 
            onClick={() => handleSubmit('review')}
            disabled={loading}
            className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2.5 rounded-xl font-bold shadow-sm hover:bg-primary/20 transition-colors"
          >
            <Send className="w-4 h-4" /> Submit for Review
          </button>
        </div>
      </div>

      {/* Stepper */}
      <div className="relative flex items-center justify-between w-full mb-12 mt-8 px-0 sm:px-4">
        {/* Lines Container */}
        <div className="absolute left-6 right-6 sm:left-10 sm:right-10 top-6 -translate-y-1/2 h-1 bg-gray-200 z-0 rounded-full">
          <div 
            className="absolute left-0 top-0 h-full bg-primary transition-all duration-500 rounded-full" 
            style={{ width: `${(['basic', 'media', 'pricing', 'details'].indexOf(activeTab) / 3) * 100}%` }}
          ></div>
        </div>

        {[
          { id: 'basic', label: 'Basic Info', icon: <FileText className="w-5 h-5" /> },
          { id: 'media', label: 'Media', icon: <ImageIcon className="w-5 h-5" /> },
          { id: 'pricing', label: 'Pricing', icon: <DollarSign className="w-5 h-5" /> },
          { id: 'details', label: 'Details', icon: <List className="w-5 h-5" /> }
        ].map((step, index) => {
          const currentIndex = ['basic', 'media', 'pricing', 'details'].indexOf(activeTab);
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <button
                onClick={() => setActiveTab(step.id)}
                className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                  isActive ? 'bg-primary border-primary/30 text-white shadow-lg scale-110' :
                  isCompleted ? 'bg-primary border-primary text-white hover:bg-secondary' :
                  'bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500'
                }`}
              >
                {isCompleted ? <Check className="w-6 h-6" /> : step.icon}
              </button>
              <span className={`text-xs sm:text-sm font-bold absolute -bottom-8 whitespace-nowrap transition-colors duration-300 ${isActive || isCompleted ? 'text-primary' : 'text-caption'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8">
        
        {/* BASIC INFO TAB */}
        {activeTab === 'basic' && (
          <div className="space-y-6 animate-fade-in">
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
              ></textarea>
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
              ></textarea>
            </div>
            
            <div className="flex justify-end pt-4">
              <button onClick={() => setActiveTab('media')} className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-secondary transition-colors">
                Next: Media
              </button>
            </div>
          </div>
        )}

        {/* MEDIA TAB */}
        {activeTab === 'media' && (
          <div className="space-y-8 animate-fade-in">
            
            <div>
              <h3 className="text-lg font-heading font-bold text-heading mb-4">Course Thumbnail</h3>
              <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-orange-50/50 hover:border-primary/50 transition-colors cursor-pointer group">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-8 h-8 text-caption group-hover:text-primary transition-colors" />
                </div>
                <h4 className="font-bold text-heading text-sm mb-1">Upload Thumbnail</h4>
                <p className="text-xs text-caption mb-4">PNG, JPG, or WebP (1280x720 recommended)</p>
                <button className="px-4 py-2 bg-white border border-border rounded-lg text-sm font-bold text-heading hover:bg-gray-50 shadow-sm flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Select File
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-heading font-bold text-heading mb-4">Promotional Video</h3>
              <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-blue-50/50 hover:border-blue-500/50 transition-colors cursor-pointer group mb-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <Video className="w-8 h-8 text-caption group-hover:text-blue-500 transition-colors" />
                </div>
                <h4 className="font-bold text-heading text-sm mb-1">Upload Video</h4>
                <p className="text-xs text-caption mb-4">MP4, WebM (Max 500MB)</p>
                <button className="px-4 py-2 bg-white border border-border rounded-lg text-sm font-bold text-heading hover:bg-gray-50 shadow-sm flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Select Video File
                </button>
              </div>
              
              <div className="flex items-center gap-4 text-sm font-bold text-caption my-4">
                <hr className="flex-1 border-border" /> OR <hr className="flex-1 border-border" />
              </div>

              <div>
                <label className="block text-sm font-bold text-heading mb-2">Video URL (YouTube / Vimeo)</label>
                <input 
                  type="text" 
                  name="promoVideoUrl"
                  value={formData.promoVideoUrl}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => setActiveTab('basic')} className="px-6 py-3 border border-border rounded-xl font-bold text-heading hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button onClick={() => setActiveTab('pricing')} className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-secondary transition-colors">
                Next: Pricing
              </button>
            </div>
          </div>
        )}

        {/* PRICING TAB */}
        {activeTab === 'pricing' && (
          <div className="space-y-8 animate-fade-in">
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
              <button onClick={() => setActiveTab('media')} className="px-6 py-3 border border-border rounded-xl font-bold text-heading hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button onClick={() => setActiveTab('details')} className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-secondary transition-colors">
                Next: Details
              </button>
            </div>
          </div>
        )}

        {/* DETAILS TAB */}
        {activeTab === 'details' && (
          <div className="space-y-6 animate-fade-in">
            
            <div>
              <label className="block text-sm font-bold text-heading mb-2">What will students learn? (Learning Outcomes)</label>
              <textarea 
                name="learningOutcomes"
                value={formData.learningOutcomes}
                onChange={handleChange}
                rows={4}
                placeholder="Enter one outcome per line..."
                className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
              ></textarea>
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
              ></textarea>
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
              ></textarea>
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
              <button onClick={() => setActiveTab('pricing')} className="px-6 py-3 border border-border rounded-xl font-bold text-heading hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button 
                onClick={() => handleSubmit('review')} 
                disabled={loading}
                className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center gap-2 shadow-md shadow-green-500/20"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CheckCircle className="w-5 h-5" />}
                Submit for Review
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default InstructorCreateCourse;
