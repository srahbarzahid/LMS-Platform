import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

const Courses = () => {
  const [search, setSearch] = useState('');
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch courses from the admin mock endpoint
    axios.get('http://localhost:5000/api/admin/courses?limit=100')
      .then(res => {
        setCourses(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching courses:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-[#f8f9fa] min-h-screen pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-heading font-bold text-heading">All Courses</h1>
            <p className="text-body mt-2 text-lg">Browse our extensive library of technology courses.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-caption w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all text-body"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl border border-border sticky top-24 shadow-sm">
              <div className="flex items-center gap-2 font-heading font-bold text-lg mb-6 text-heading border-b border-border pb-4">
                <Filter className="w-5 h-5 text-primary" /> Filters
              </div>
              
              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="font-bold text-heading mb-4 text-sm uppercase tracking-wider">Category</h3>
                <div className="space-y-3">
                  {['Robotics', 'IoT', 'AI', 'Web Development', 'Hardware'].map(cat => (
                    <label key={cat} className="flex items-center gap-3 text-body hover:text-primary cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer" />
                      <span className="group-hover:font-medium transition-all">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Level Filter */}
              <div className="mb-8">
                <h3 className="font-bold text-heading mb-4 text-sm uppercase tracking-wider">Level</h3>
                <div className="space-y-3">
                  {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                    <label key={lvl} className="flex items-center gap-3 text-body hover:text-primary cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer" />
                      <span className="group-hover:font-medium transition-all">{lvl}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="font-bold text-heading mb-4 text-sm uppercase tracking-wider">Price</h3>
                <div className="space-y-3">
                  {['Paid', 'Free'].map(price => (
                    <label key={price} className="flex items-center gap-3 text-body hover:text-primary cursor-pointer group">
                      <input type="radio" name="price" className="w-4 h-4 border-border text-primary focus:ring-primary/20 cursor-pointer" />
                      <span className="group-hover:font-medium transition-all">{price}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Course Grid */}
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-border shadow-sm">
              <span className="text-body font-medium">Showing <strong className="text-heading">12</strong> of 150 results</span>
              <select className="border-none bg-gray-50 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-body font-medium cursor-pointer">
                <option>Most Relevant</option>
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Highest Rated</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full py-12 text-center text-body">Loading courses...</div>
              ) : (
                courses.filter((c: any) => search === '' || c.title.toLowerCase().includes(search.toLowerCase())).map((course, i) => (
                  <div key={course.id || i} className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-shadow flex flex-col group cursor-pointer relative">
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img src={`https://picsum.photos/seed/${course.id}/500/300`} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(course);
                        }}
                        className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
                      >
                        <Heart className={`w-5 h-5 ${isInWishlist(course.id) ? 'fill-red-500 text-red-500' : 'text-caption hover:text-red-500 hover:fill-red-500/20'} transition-colors`} />
                      </button>

                      {course.featured && (
                        <span className="absolute top-3 left-3 bg-yellow-400 text-heading px-2 py-1 text-xs font-bold rounded flex items-center gap-1 shadow-sm">
                          <Star className="w-3 h-3 fill-current" /> Featured
                        </span>
                      )}
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                          {course.category || 'Technology'}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-primary text-primary" />
                          <span className="text-sm font-bold text-heading">{course.rating || '4.5'}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-heading font-bold text-heading text-lg mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{course.title}</h3>
                      <p className="text-sm text-body mb-4 line-clamp-2">{course.subtitle || 'Learn everything you need to know.'}</p>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor?.name || 'Instructor')}&background=random`} alt="Instructor" className="w-6 h-6 rounded-full" />
                        <span className="text-xs font-medium text-body">{course.instructor?.name || 'Instructor'}</span>
                      </div>

                      <div className="mt-auto flex justify-between items-center pt-4 border-t border-border">
                        <div className="flex flex-col">
                          <span className="text-lg font-black text-heading">₹{course.price}</span>
                        </div>
                        <Link to={`/courses/${course.id}`} className="px-5 py-2 bg-white border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-colors text-sm">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center border border-border rounded-xl bg-white text-body hover:bg-gray-50 transition-colors font-medium">{'<'}</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white font-medium shadow-md shadow-primary/20">1</button>
                <button className="w-10 h-10 flex items-center justify-center border border-border rounded-xl bg-white text-body hover:bg-gray-50 transition-colors font-medium">2</button>
                <button className="w-10 h-10 flex items-center justify-center border border-border rounded-xl bg-white text-body hover:bg-gray-50 transition-colors font-medium">3</button>
                <span className="text-caption px-2">...</span>
                <button className="w-10 h-10 flex items-center justify-center border border-border rounded-xl bg-white text-body hover:bg-gray-50 transition-colors font-medium">{'>'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
