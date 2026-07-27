import { useState, useEffect } from 'react';
import { 
  Megaphone, Search, Filter, PlusCircle, 
  Edit2, Trash2, Send, X, Users
} from 'lucide-react';

const InstructorAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('All Courses');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  
  const [modalCourse, setModalCourse] = useState('Select a course...');
  const [modalDropdownOpen, setModalDropdownOpen] = useState(false);

  useEffect(() => {
    // Mock API Call
    setTimeout(() => {
      setAnnouncements([
        {
          id: '1',
          title: 'Welcome to the New React Architecture Module!',
          course: 'React Architecture',
          date: 'Oct 25, 2023',
          audience: 'All Enrolled Students',
          views: 145,
          text: 'I just uploaded the new module covering advanced React hooks and performance optimization. Make sure to check it out!'
        },
        {
          id: '2',
          title: 'Live Q&A Session Tomorrow',
          course: 'UI/UX Masterclass',
          date: 'Oct 20, 2023',
          audience: 'All Enrolled Students',
          views: 312,
          text: 'Join me tomorrow at 5 PM EST for a live Q&A session where we will review your design portfolios.'
        }
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const filteredAnnouncements = announcements.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-heading">Announcements</h1>
          <p className="text-body mt-1">Communicate with your students across all courses.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-secondary transition-colors shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          Create Announcement
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search announcements..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
          />
          <Search className="w-4 h-4 text-caption absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto relative">
          <div className="relative w-full md:w-auto">
            <button 
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className="flex items-center gap-2 bg-gray-50 border border-border rounded-xl px-4 py-2.5 hover:bg-gray-100 transition-colors w-full md:w-48 justify-between"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-heading">
                <Filter className="w-4 h-4 text-caption" />
                {selectedCourseFilter}
              </div>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {filterDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setFilterDropdownOpen(false)}></div>
                <div className="absolute right-0 top-full mt-2 w-full md:w-48 bg-white border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                  {['All Courses', 'UI/UX Masterclass', 'React Architecture'].map(opt => (
                    <div 
                      key={opt}
                      onClick={() => { setSelectedCourseFilter(opt); setFilterDropdownOpen(false); }}
                      className={`px-4 py-3 text-sm cursor-pointer hover:bg-orange-50 hover:text-orange-500 transition-colors ${selectedCourseFilter === opt ? 'bg-orange-50 text-orange-500 font-bold' : 'text-gray-600 font-medium'}`}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="flex py-20 items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.length > 0 ? filteredAnnouncements.map((announcement) => (
            <div key={announcement.id} className="bg-white rounded-2xl border border-border shadow-sm p-6 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Megaphone className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-2">
                  <div>
                    <h3 className="text-lg font-heading font-bold text-heading">{announcement.title}</h3>
                    <div className="text-xs text-caption flex items-center gap-2 mt-1">
                      <span className="font-semibold text-primary">{announcement.course}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span>{announcement.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button title="Edit" className="p-2 text-caption hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button title="Delete" className="p-2 text-caption hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button title="Resend Notification" className="p-2 text-caption hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-body leading-relaxed mt-3">{announcement.text}</p>
                
                <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-4 text-xs font-bold text-caption">
                  <div className="flex items-center gap-1"><Users className="w-4 h-4" /> {announcement.audience}</div>
                  <div className="flex items-center gap-1">👁 {announcement.views} Views</div>
                </div>
              </div>
            </div>
          )) : (
            <div className="bg-white rounded-2xl border border-border shadow-sm p-12 text-center text-caption">
              No announcements found.
            </div>
          )}
        </div>
      )}

      {/* Add Announcement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative custom-scrollbar">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-heading font-bold text-heading">Create Announcement</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-caption hover:text-heading hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-heading mb-2">Announcement Title <span className="text-red-500">*</span></label>
                <input type="text" placeholder="e.g. New module uploaded!" className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" />
              </div>

              <div className="relative">
                <label className="block text-sm font-bold text-heading mb-2">Target Course <span className="text-red-500">*</span></label>
                <div className="relative">
                  <button 
                    onClick={() => setModalDropdownOpen(!modalDropdownOpen)}
                    className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-left flex justify-between items-center"
                  >
                    <span className={modalCourse === 'Select a course...' ? 'text-gray-400' : 'text-heading font-medium'}>{modalCourse}</span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  {modalDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setModalDropdownOpen(false)}></div>
                      <div className="absolute left-0 top-full mt-2 w-full bg-white border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                        {['All Courses', 'UI/UX Masterclass', 'React Architecture'].map(opt => (
                          <div 
                            key={opt}
                            onClick={() => { setModalCourse(opt); setModalDropdownOpen(false); }}
                            className={`px-4 py-3 text-sm cursor-pointer hover:bg-orange-50 hover:text-orange-500 transition-colors ${modalCourse === opt ? 'bg-orange-50 text-orange-500 font-bold' : 'text-gray-600 font-medium'}`}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-heading mb-2">Message <span className="text-red-500">*</span></label>
                {/* Mock Rich Text Editor */}
                <div className="border border-border rounded-xl overflow-hidden bg-white">
                  <div className="bg-gray-50 border-b border-border p-2 flex gap-2">
                    <button className="px-3 py-1 text-sm font-bold hover:bg-gray-200 rounded">B</button>
                    <button className="px-3 py-1 text-sm italic hover:bg-gray-200 rounded">I</button>
                    <button className="px-3 py-1 text-sm underline hover:bg-gray-200 rounded">U</button>
                    <div className="w-px h-6 bg-border mx-1"></div>
                    <button className="px-3 py-1 text-sm hover:bg-gray-200 rounded">🔗</button>
                  </div>
                  <textarea 
                    rows={6} 
                    placeholder="Write your announcement here..." 
                    className="w-full px-4 py-3 outline-none resize-none text-sm"
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20" defaultChecked />
                  <span className="text-sm font-bold text-heading">Send Email Notification</span>
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-border p-6 flex justify-end gap-3 z-10">
              <button onClick={() => setShowAddModal(false)} className="px-6 py-2.5 border border-border rounded-xl font-bold text-heading hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => setShowAddModal(false)} className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-secondary transition-colors shadow-md">
                <Send className="w-4 h-4" /> Post Announcement
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default InstructorAnnouncements;
