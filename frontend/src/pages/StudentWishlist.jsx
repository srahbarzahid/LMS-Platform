import { Link } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
const StudentWishlist = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  return <div className="space-y-8 pb-8">
      
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-heading">My Wishlist</h1>
          <p className="text-body mt-2">You have {wishlist.length} {wishlist.length === 1 ? "course" : "courses"} saved.</p>
        </div>
      </div>

      {wishlist.length === 0 ? <div className="bg-white p-12 rounded-3xl border border-border text-center shadow-sm flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-heading mb-2">Your wishlist is empty</h2>
          <p className="text-body max-w-md mx-auto mb-8">Browse our catalog to find courses you'd like to take later.</p>
          <Link to="/courses" className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-400 text-white font-bold rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all inline-block">
            Browse Courses
          </Link>
        </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((course) => <div key={course.id} className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative hover:-translate-y-1 hover:border-primary/30">
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                
                {
    /* Heart button */
  }
                <button
    onClick={() => toggleWishlist(course)}
    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
  >
                  <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                </button>

                {course.tag && <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-heading px-3 py-1 text-[10px] uppercase font-bold rounded-lg shadow-sm tracking-wider">
                    {course.tag}
                  </span>}
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  {course.category && <span className="text-orange-600 text-[10px] font-bold uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded">
                      {course.category}
                    </span>}
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                    <span className="text-sm font-bold text-heading">{course.rating}</span>
                    <span className="text-xs text-caption">({course.reviews})</span>
                  </div>
                </div>
                
                <h3 className="font-heading font-bold text-heading text-lg mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                
                {course.author && <p className="text-xs text-caption mb-4">Instructor: <span className="font-medium text-heading">{course.author}</span></p>}
                
                <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
                  <div className="text-xl font-extrabold text-heading">{course.price}</div>
                  <Link to={`/student/courses/${course.id}`} className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors text-sm">
                    View Course
                  </Link>
                </div>
              </div>
            </div>)}
        </div>}
    </div>;
};
var stdin_default = StudentWishlist;
export {
  stdin_default as default
};
