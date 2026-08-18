import { Link } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
const Wishlist = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  return <div className="bg-[#f8f9fa] min-h-screen pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-heading font-bold text-heading">My Wishlist</h1>
          <p className="text-body mt-2 text-lg">You have {wishlist.length} {wishlist.length === 1 ? "course" : "courses"} in your wishlist.</p>
        </div>

        {wishlist.length === 0 ? <div className="bg-white p-12 rounded-3xl border border-border text-center shadow-sm">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-heading font-bold text-heading mb-2">Your wishlist is empty</h2>
            <p className="text-body mb-8">Browse our catalog to find courses you'd like to take later.</p>
            <Link to="/courses" className="px-8 py-3.5 bg-gradient-to-r from-orange-600 to-orange-400 text-white font-bold rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all inline-block">
              Browse Courses
            </Link>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((course) => <div key={course.id} className="bg-white rounded-3xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group relative hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {
    /* Heart button */
  }
                  <button
    onClick={() => toggleWishlist(course)}
    className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
  >
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  </button>

                  {course.tag && <span className="absolute top-4 left-4 bg-white text-heading px-3 py-1 text-xs font-bold rounded-full shadow-sm">
                      {course.tag}
                    </span>}
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    {course.category && <span className="text-orange-500 text-xs font-bold uppercase tracking-wider bg-orange-50 px-2 py-1 rounded-md">{course.category}</span>}
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                      <span className="text-sm font-bold text-heading">{course.rating}</span>
                      <span className="text-xs text-caption">({course.reviews})</span>
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-heading mb-2 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors">
                    {course.title}
                  </h3>
                  {course.author && <p className="text-xs text-body mb-4">By <span className="font-medium text-heading">{course.author}</span></p>}
                  <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
                    <div className="text-xl font-extrabold text-heading">{course.price}</div>
                    <Link to={`/courses/${course.id}`} className="px-5 py-2 bg-gradient-to-r from-orange-600 to-orange-400 text-white font-medium rounded-full hover:shadow-md hover:from-orange-700 hover:to-orange-500 transition-all text-sm">
                      View Course
                    </Link>
                  </div>
                </div>
              </div>)}
          </div>}
      </div>
    </div>;
};
var stdin_default = Wishlist;
export {
  stdin_default as default
};
