import { useState } from "react";
import { Search, Filter, Star, Heart, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import CustomDropdown from "../components/common/CustomDropdown";

const sortOptions = [
  { value: "most-relevant", label: "Most Relevant" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "highest-rated", label: "Highest Rated" }
];

const StudentBrowseCourses = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("most-relevant");
  const { toggleWishlist, isInWishlist } = useWishlist();
  return <div className="pb-12 max-w-7xl">
      <div className="px-4 sm:px-6 lg:px-8">
        
        {
    /* Header & Search */
  }
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-heading font-bold text-heading">Browse Courses</h1>
            <p className="text-body mt-2 text-lg">Explore our extensive library of technology courses.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-caption w-5 h-5" />
            <input
    type="text"
    placeholder="Search courses..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full pl-12 pr-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all text-body bg-white"
  />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {
    /* Sidebar Filters */
  }
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl border border-border sticky top-6 shadow-sm">
              <div className="flex items-center gap-2 font-heading font-bold text-lg mb-6 text-heading border-b border-border pb-4">
                <Filter className="w-5 h-5 text-primary" /> Filters
              </div>
              
              {
    /* Category Filter */
  }
              <div className="mb-8">
                <h3 className="font-bold text-heading mb-4 text-sm uppercase tracking-wider">Category</h3>
                <div className="space-y-3">
                  {["Robotics", "IoT", "AI", "Web Development", "Hardware"].map((cat) => <label key={cat} className="flex items-center gap-3 text-body hover:text-primary cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer" />
                      <span className="group-hover:font-medium transition-all">{cat}</span>
                    </label>)}
                </div>
              </div>

              {
    /* Level Filter */
  }
              <div className="mb-8">
                <h3 className="font-bold text-heading mb-4 text-sm uppercase tracking-wider">Level</h3>
                <div className="space-y-3">
                  {["Beginner", "Intermediate", "Advanced"].map((lvl) => <label key={lvl} className="flex items-center gap-3 text-body hover:text-primary cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer" />
                      <span className="group-hover:font-medium transition-all">{lvl}</span>
                    </label>)}
                </div>
              </div>

              {
    /* Price Filter */
  }
              <div>
                <h3 className="font-bold text-heading mb-4 text-sm uppercase tracking-wider">Price</h3>
                <div className="space-y-3">
                  {["Paid", "Free"].map((price) => <label key={price} className="flex items-center gap-3 text-body hover:text-primary cursor-pointer group">
                      <input type="radio" name="price" className="w-4 h-4 border-border text-primary focus:ring-primary/20 cursor-pointer" />
                      <span className="group-hover:font-medium transition-all">{price}</span>
                    </label>)}
                </div>
              </div>
            </div>
          </div>

          {
    /* Course Grid */
  }
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-border shadow-sm">
              <span className="text-body font-medium">Showing <strong className="text-heading">12</strong> of 150 results</span>
              <CustomDropdown
                value={sortBy}
                onChange={setSortBy}
                options={sortOptions}
                icon={ArrowUpDown}
                align="right"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {
    /* Dummy Courses */
  }
              {[1, 2, 3, 4, 5, 6].map((i) => {
    const course = {
      id: `c${i}`,
      title: "Mastering ESP32 for Advanced IoT Projects",
      author: "Pibots Instructor",
      price: "\u20B91,999",
      rating: "4.9",
      reviews: "850 reviews",
      tag: "Intermediate",
      category: "IoT & Hardware",
      img: [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
      ][i % 3]
    };
    return <div key={i} className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer hover:-translate-y-1 relative">
                  <div className="relative h-48 overflow-hidden block">
                    <img src={course.img} alt="Course thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    
                    {
      /* Heart button */
    }
                    <button
      onClick={(e) => {
        e.preventDefault();
        toggleWishlist(course);
      }}
      className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
    >
                      <Heart className={`w-5 h-5 ${isInWishlist(course.id) ? "fill-red-500 text-red-500" : "text-caption hover:text-red-500 hover:fill-red-500/20"} transition-colors`} />
                    </button>

                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold rounded-lg text-heading">{course.tag}</span>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-xs text-primary font-bold uppercase tracking-wider bg-accent px-2 py-1 rounded-md">{course.category}</div>
                    </div>
                    <Link to={`/student/courses/${i}`}>
                      <h3 className="font-heading font-bold text-heading mb-2 line-clamp-2 hover:text-primary transition-colors leading-tight">{course.title}</h3>
                    </Link>
                    <p className="text-sm text-body mb-4 line-clamp-2">Learn to build real-world IoT applications using ESP32, advanced sensors, and secure cloud integration.</p>
                    <div className="flex items-center gap-1 mb-6">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="text-sm font-bold text-heading">{course.rating}</span>
                      <span className="text-xs text-caption">({course.reviews})</span>
                    </div>
                    <div className="mt-auto pt-4 border-t border-border flex justify-between items-center mt-4">
                      <div className="text-xl font-extrabold text-heading">{course.price}</div>
                      <Link to={`/student/courses/${i}`} className="px-5 py-2 bg-gradient-to-r from-orange-600 to-orange-400 text-white font-medium rounded-full hover:shadow-md hover:from-orange-700 hover:to-orange-500 transition-all text-sm">
                        View Course
                      </Link>
                    </div>
                  </div>
                </div>;
  })}
            </div>

            {
    /* Pagination */
  }
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center border border-border rounded-xl bg-white text-body hover:bg-gray-50 transition-colors font-medium">{"<"}</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white font-medium shadow-md shadow-primary/20">1</button>
                <button className="w-10 h-10 flex items-center justify-center border border-border rounded-xl bg-white text-body hover:bg-gray-50 transition-colors font-medium">2</button>
                <button className="w-10 h-10 flex items-center justify-center border border-border rounded-xl bg-white text-body hover:bg-gray-50 transition-colors font-medium">3</button>
                <span className="text-caption px-2">...</span>
                <button className="w-10 h-10 flex items-center justify-center border border-border rounded-xl bg-white text-body hover:bg-gray-50 transition-colors font-medium">{">"}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
var stdin_default = StudentBrowseCourses;
export {
  stdin_default as default
};
