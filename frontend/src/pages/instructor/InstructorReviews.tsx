import { useState, useEffect } from 'react';
import { 
  Star, Search, Filter, MessageCircle, 
  Flag, CornerDownRight, Check
} from 'lucide-react';

const InstructorReviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [showReplyForm, setShowReplyForm] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Mock API Call
    setTimeout(() => {
      setReviews([
        {
          id: '1',
          student: 'Alice Smith',
          course: 'UI/UX Masterclass',
          rating: 5,
          text: 'This course is absolutely fantastic! The instructor explains complex concepts in a very easy-to-understand way. I particularly loved the section on Design Systems.',
          date: 'Oct 24, 2023',
          reply: null
        },
        {
          id: '2',
          student: 'Bob Johnson',
          course: 'React Architecture',
          rating: 4,
          text: 'Great content and deep dives into hooks. However, some of the videos were a bit too fast-paced for me. Still learned a lot!',
          date: 'Oct 22, 2023',
          reply: 'Thank you for the feedback, Bob! I will keep the pacing in mind for future updates.'
        },
        {
          id: '3',
          student: 'Charlie Brown',
          course: 'UI/UX Masterclass',
          rating: 2,
          text: 'The content is too basic. I was expecting more advanced prototyping techniques.',
          date: 'Oct 15, 2023',
          reply: null
        }
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const handleReplySubmit = (id: string) => {
    if (!replyText[id]) return;
    
    // Optimistic update
    setReviews(prev => prev.map(r => 
      r.id === id ? { ...r, reply: replyText[id] } : r
    ));
    
    setShowReplyForm(prev => ({ ...prev, [id]: false }));
  };

  const filteredReviews = reviews.filter(r => 
    r.course.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.student.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-heading">Course Reviews</h1>
          <p className="text-body mt-1">Read and respond to feedback from your students.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-2 px-4">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <div className="text-xl font-heading font-bold text-heading">4.8</div>
            <div className="text-xs text-caption">Overall Rating</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search reviews..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
          />
          <Search className="w-4 h-4 text-caption absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-gray-50 border border-border rounded-xl px-3 py-2">
            <Filter className="w-4 h-4 text-caption" />
            <select className="bg-transparent text-sm font-medium text-heading outline-none border-none focus:ring-0 cursor-pointer">
              <option>All Ratings</option>
              <option>5 Stars</option>
              <option>4 Stars</option>
              <option>3 Stars</option>
              <option>2 Stars & Below</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex py-20 items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.length > 0 ? filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl border border-border shadow-sm p-6 flex flex-col gap-4">
              
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                    {review.student.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-heading text-sm">{review.student}</h3>
                    <div className="text-xs text-caption flex items-center gap-2">
                      <span className="font-semibold">{review.course}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span>{review.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
              </div>

              <p className="text-body text-sm leading-relaxed">{review.text}</p>

              <div className="flex items-center gap-4 pt-2">
                {!review.reply && !showReplyForm[review.id] && (
                  <button 
                    onClick={() => setShowReplyForm(prev => ({ ...prev, [review.id]: true }))}
                    className="flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> Reply
                  </button>
                )}
                <button className="flex items-center gap-2 text-sm font-bold text-caption hover:text-red-500 transition-colors">
                  <Flag className="w-4 h-4" /> Flag
                </button>
              </div>

              {/* Reply Form */}
              {showReplyForm[review.id] && !review.reply && (
                <div className="bg-gray-50 border border-border rounded-xl p-4 mt-2 animate-fade-in flex gap-4 items-start">
                  <CornerDownRight className="w-5 h-5 text-gray-400 mt-2 shrink-0" />
                  <div className="flex-1 space-y-3">
                    <textarea 
                      placeholder="Write your response..." 
                      rows={3}
                      value={replyText[review.id] || ''}
                      onChange={(e) => setReplyText(prev => ({ ...prev, [review.id]: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
                    ></textarea>
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setShowReplyForm(prev => ({ ...prev, [review.id]: false }))}
                        className="px-4 py-2 text-sm font-bold text-caption hover:text-heading transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleReplySubmit(review.id)}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-secondary transition-colors"
                      >
                        Post Reply
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Existing Reply */}
              {review.reply && (
                <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 mt-2 flex gap-4 items-start">
                  <CornerDownRight className="w-5 h-5 text-orange-400 mt-1 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Instructor Reply
                      </span>
                    </div>
                    <p className="text-body text-sm leading-relaxed">{review.reply}</p>
                  </div>
                </div>
              )}

            </div>
          )) : (
            <div className="bg-white rounded-2xl border border-border shadow-sm p-12 text-center text-caption">
              No reviews found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InstructorReviews;
