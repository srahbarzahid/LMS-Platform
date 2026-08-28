import { useState, useEffect, useMemo, useRef } from "react";
import { Search, Filter, Star, Heart, ArrowUpDown, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import CustomDropdown from "../components/common/CustomDropdown";
import apiClient from "../api/client";

const sortOptions = [
  { value: "most-relevant", label: "Most Relevant" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "highest-rated", label: "Highest Rated" }
];

const ITEMS_PER_PAGE = 10;

// Exactly 2 Demo Courses
const demoCoursesList = [
  {
    id: "course-1",
    title: "Mastering ESP32 for Advanced IoT Projects",
    author: "PiTech Instructor 1",
    price: "₹1,999",
    priceNum: 1999,
    rating: "4.9",
    reviews: "850 reviews",
    level: "Intermediate",
    category: "IoT",
    createdAt: new Date().toISOString(),
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "course-2",
    title: "Complete Robotics Engineering & ROS2 Masterclass",
    author: "PiTech Instructor 2",
    price: "₹2,499",
    priceNum: 2499,
    rating: "4.8",
    reviews: "620 reviews",
    level: "Advanced",
    category: "Robotics",
    createdAt: new Date().toISOString(),
    img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=500&q=60"
  }
];

const StudentBrowseCourses = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("most-relevant");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [priceFilter, setPriceFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const gridTopRef = useRef(null);

  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    let isMounted = true;
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get("/courses?limit=100");
        const apiCourses = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data?.courses) ? res.data.courses : [];
        
        if (isMounted) {
          if (apiCourses.length > 0) {
            setCourses(apiCourses.map((c) => ({
              ...c,
              priceNum: parseFloat(String(c.price || "0").replace(/[^\d.]/g, "")) || 0
            })));
          } else {
            setCourses(demoCoursesList);
          }
        }
      } catch (err) {
        if (isMounted) {
          setCourses(demoCoursesList);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCategoryToggle = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setCurrentPage(1);
  };

  const handleLevelToggle = (lvl) => {
    setSelectedLevels((prev) =>
      prev.includes(lvl) ? prev.filter((l) => l !== lvl) : [...prev, lvl]
    );
    setCurrentPage(1);
  };

  const handlePriceChange = (val) => {
    setPriceFilter(val);
    setCurrentPage(1);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.author?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q)
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((c) => selectedCategories.includes(c.category));
    }

    if (selectedLevels.length > 0) {
      result = result.filter((c) => selectedLevels.includes(c.level || c.tag));
    }

    if (priceFilter === "Paid") {
      result = result.filter((c) => String(c.price).toLowerCase() !== "free" && (c.priceNum > 0 || String(c.price).includes("₹")));
    } else if (priceFilter === "Free") {
      result = result.filter((c) => String(c.price).toLowerCase() === "free" || c.priceNum === 0);
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => (a.priceNum || 0) - (b.priceNum || 0));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => (b.priceNum || 0) - (a.priceNum || 0));
    } else if (sortBy === "highest-rated") {
      result.sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0));
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return result;
  }, [courses, search, selectedCategories, selectedLevels, priceFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
    if (gridTopRef.current) {
      gridTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="pb-12 max-w-7xl">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-heading font-bold text-heading dark:text-white">Browse Courses</h1>
            <p className="text-body dark:text-neutral-400 mt-2 text-lg">Explore our extensive library of technology courses.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-caption w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-border dark:border-neutral-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all text-body dark:text-white bg-white dark:bg-neutral-900"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-border dark:border-neutral-800 sticky top-6 shadow-sm">
              <div className="flex items-center gap-2 font-heading font-bold text-lg mb-6 text-heading dark:text-white border-b border-border dark:border-neutral-800 pb-4">
                <Filter className="w-5 h-5 text-primary" /> Filters
              </div>

              <div className="mb-8">
                <h3 className="font-bold text-heading dark:text-neutral-200 mb-4 text-sm uppercase tracking-wider">Category</h3>
                <div className="space-y-3">
                  {["Robotics", "IoT", "AI", "Web Development", "Hardware"].map((cat) => (
                    <label key={cat} className="flex items-center gap-3 text-body dark:text-neutral-300 hover:text-primary cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryToggle(cat)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                      />
                      <span className="group-hover:font-medium transition-all">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-bold text-heading dark:text-neutral-200 mb-4 text-sm uppercase tracking-wider">Level</h3>
                <div className="space-y-3">
                  {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
                    <label key={lvl} className="flex items-center gap-3 text-body dark:text-neutral-300 hover:text-primary cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedLevels.includes(lvl)}
                        onChange={() => handleLevelToggle(lvl)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                      />
                      <span className="group-hover:font-medium transition-all">{lvl}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-heading dark:text-neutral-200 mb-4 text-sm uppercase tracking-wider">Price</h3>
                <div className="space-y-3">
                  {["All", "Paid", "Free"].map((price) => (
                    <label key={price} className="flex items-center gap-3 text-body dark:text-neutral-300 hover:text-primary cursor-pointer group">
                      <input
                        type="radio"
                        name="priceFilterGroup"
                        checked={priceFilter === price}
                        onChange={() => handlePriceChange(price)}
                        className="w-4 h-4 border-border text-primary focus:ring-primary/20 cursor-pointer"
                      />
                      <span className="group-hover:font-medium transition-all">{price === "All" ? "All Prices" : price}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-grow" ref={gridTopRef}>
            <div className="flex justify-between items-center mb-6 bg-white dark:bg-neutral-900 p-4 rounded-xl border border-border dark:border-neutral-800 shadow-sm">
              <span className="text-body dark:text-neutral-300 font-medium">
                Showing <strong className="text-heading dark:text-white">{filteredCourses.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredCourses.length)}</strong> of {filteredCourses.length} results
              </span>
              <CustomDropdown
                value={sortBy}
                onChange={setSortBy}
                options={sortOptions}
                icon={ArrowUpDown}
                align="right"
              />
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-neutral-900 rounded-2xl border border-border dark:border-neutral-800">
                <RefreshCw className="w-8 h-8 text-primary animate-spin mb-3" />
                <span className="text-sm font-bold text-heading dark:text-neutral-200">Loading courses catalog...</span>
              </div>
            ) : paginatedCourses.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-neutral-900 rounded-2xl border border-border dark:border-neutral-800">
                <p className="text-lg font-bold text-heading dark:text-white mb-2">No courses match your filter criteria.</p>
                <p className="text-sm text-caption">Try resetting your category or search filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedCourses.map((course) => (
                  <div key={course.id} className="bg-white dark:bg-neutral-900 rounded-2xl border border-border dark:border-neutral-800 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer hover:-translate-y-1 relative">
                    <div className="relative h-48 overflow-hidden block">
                      <img src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(course);
                        }}
                        className="absolute top-4 right-4 w-10 h-10 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
                      >
                        <Heart className={`w-5 h-5 ${isInWishlist(course.id) ? "fill-red-500 text-red-500" : "text-caption hover:text-red-500 hover:fill-red-500/20"} transition-colors`} />
                      </button>

                      <span className="absolute top-4 left-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm px-3 py-1 text-xs font-bold rounded-lg text-heading dark:text-white">{course.level || course.tag || "Intermediate"}</span>
                    </div>

                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-xs text-primary font-bold uppercase tracking-wider bg-primary/10 px-2 py-1 rounded-md">{course.category}</div>
                      </div>
                      <Link to={`/student/courses/${course.id}`}>
                        <h3 className="font-heading font-bold text-heading dark:text-white mb-2 line-clamp-2 hover:text-primary transition-colors leading-tight">{course.title}</h3>
                      </Link>
                      <p className="text-sm text-body dark:text-neutral-400 mb-4 line-clamp-2">Learn to build real-world IoT and technology applications with hands-on projects.</p>
                      
                      <div className="flex items-center gap-1 mb-6">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span className="text-sm font-bold text-heading dark:text-white">{course.rating}</span>
                        <span className="text-xs text-caption ml-1">({course.reviews})</span>
                      </div>

                      <div className="mt-auto pt-4 border-t border-border dark:border-neutral-800 flex justify-between items-center">
                        <div className="text-xl font-extrabold text-heading dark:text-white">{course.price}</div>
                        <Link to={`/student/courses/${course.id}`} className="px-5 py-2 bg-gradient-to-r from-orange-600 to-orange-400 text-white font-medium rounded-full hover:shadow-md hover:from-orange-700 hover:to-orange-500 transition-all text-sm">
                          View Course
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(validCurrentPage - 1)}
                    disabled={validCurrentPage === 1}
                    className="w-10 h-10 flex items-center justify-center border border-border dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 text-body dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNum = index + 1;
                    const isActive = pageNum === validCurrentPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all cursor-pointer ${
                          isActive
                            ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                            : "bg-white dark:bg-neutral-900 border border-border dark:border-neutral-800 text-heading dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(validCurrentPage + 1)}
                    disabled={validCurrentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center border border-border dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 text-body dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentBrowseCourses;
