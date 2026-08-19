import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, BookOpen, Heart, Menu, X, ArrowRight } from "lucide-react";
import axios from "axios";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.pathname === "/" ? "/" : location.pathname);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  // Search Bar States
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  const searchContainerRef = useRef(null);
  const mobileSearchRef = useRef(null);

  useEffect(() => {
    axios
      .get("/api/courses?limit=100")
      .then((res) => {
        const list = Array.isArray(res.data.data) ? res.data.data : res.data.courses || [];
        setAllCourses(list);
      })
      .catch((err) => {
        console.error("Error prefetching courses for search:", err);
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const currentHash = location.hash || window.location.hash;
    if (location.pathname === "/" && currentHash) {
      setActiveTab(currentHash);
    } else {
      setActiveTab(location.pathname === "/" ? "/" : location.pathname);
    }
    setIsMobileMenuOpen(false);

    if (location.pathname === "/" && currentHash) {
      const targetId = currentHash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 50);
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (location.pathname !== "/") {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      return;
    }
    const handleScroll = () => {
      const sections = ["home", "courses", "about", "faqs", "contact"];
      let newSection = location.hash || "/";
      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 3 && rect.bottom >= 100) {
            newSection = id === "home" ? "/" : id === "contact" ? "#contact" : id === "faqs" ? "#faqs" : `/${id}`;
          }
        }
      }
      if (window.innerHeight + Math.round(window.scrollY) >= document.body.offsetHeight - 50) {
        newSection = "#contact";
      }
      setActiveTab(newSection);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!navRef.current) return;
    const timeout = setTimeout(() => {
      if (!navRef.current) return;
      const activeEl = navRef.current.querySelector(`[data-active="true"]`);
      if (activeEl) {
        setIndicatorStyle({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
          opacity: 1,
        });
      }
    }, 50);
    return () => clearTimeout(timeout);
  }, [activeTab, location.pathname]);

  const handleAnchorClick = (e, anchorId) => {
    e.preventDefault();
    setActiveTab(anchorId);
    if (location.pathname !== "/") {
      navigate(`/${anchorId}`);
    } else {
      const targetId = anchorId.replace("#", "");
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      navigate("/courses");
    } else {
      navigate(`/courses?search=${encodeURIComponent(query)}`);
    }
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleSelectCourse = (courseId) => {
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    setSearchQuery("");
    navigate(`/courses/${courseId}`);
  };

  const filteredSuggestions = searchQuery.trim()
    ? allCourses
        .filter((course) => {
          const q = searchQuery.toLowerCase().trim();
          return (
            course.title?.toLowerCase().includes(q) ||
            course.subtitle?.toLowerCase().includes(q) ||
            course.category?.toLowerCase().includes(q) ||
            course.instructor?.name?.toLowerCase().includes(q)
          );
        })
        .slice(0, 5)
    : [];

  const isTabActive = (path) => activeTab === path;
  const { wishlist } = useWishlist();
  const { cart } = useCart();

  return (
    <div className="fixed w-full z-50 top-4 px-4 sm:px-6 lg:px-8 transition-all duration-300 pointer-events-none flex flex-col items-center">
      {/* Floating Navbar Pill */}
      <nav className="pointer-events-auto bg-white/70 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/40 dark:border-neutral-800 shadow-lg w-full max-w-[95%] xl:max-w-7xl rounded-full px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Left Side: Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-md">
            <BookOpen className="text-white w-5 h-5" />
          </div>
          <span className="font-heading font-bold text-lg text-heading hidden sm:block leading-tight">
            Pi Tech
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <div ref={navRef} className="hidden lg:flex items-center space-x-1 relative">
          <div
            className="absolute h-9 bg-primary/15 rounded-full transition-all duration-300 ease-out shadow-inner z-0 pointer-events-none"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
              opacity: indicatorStyle.opacity,
            }}
          />
          <Link
            data-active={isTabActive("/")}
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`px-4 py-2 rounded-full transition-colors relative z-10 text-sm ${
              isTabActive("/") ? "text-primary font-bold" : "text-heading font-medium hover:text-primary hover:bg-primary/5"
            }`}
          >
            Home
          </Link>
          <Link
            data-active={isTabActive("/courses")}
            to="/courses"
            className={`px-4 py-2 rounded-full transition-colors relative z-10 text-sm ${
              isTabActive("/courses") ? "text-primary font-bold" : "text-heading font-medium hover:text-primary hover:bg-primary/5"
            }`}
          >
            Courses
          </Link>
          <Link
            data-active={isTabActive("/about")}
            to="/about"
            className={`px-4 py-2 rounded-full transition-colors relative z-10 text-sm ${
              isTabActive("/about") ? "text-primary font-bold" : "text-heading font-medium hover:text-primary hover:bg-primary/5"
            }`}
          >
            About
          </Link>
          <a
            data-active={isTabActive("#faqs")}
            href="/#faqs"
            onClick={(e) => handleAnchorClick(e, "#faqs")}
            className={`px-4 py-2 rounded-full transition-colors relative z-10 text-sm ${
              isTabActive("#faqs") ? "text-primary font-bold" : "text-heading font-medium hover:text-primary hover:bg-primary/5"
            }`}
          >
            FAQs
          </a>
          <a
            data-active={isTabActive("#contact")}
            href="/#contact"
            onClick={(e) => handleAnchorClick(e, "#contact")}
            className={`px-4 py-2 rounded-full transition-colors relative z-10 text-sm ${
              isTabActive("#contact") ? "text-primary font-bold" : "text-heading font-medium hover:text-primary hover:bg-primary/5"
            }`}
          >
            Contact
          </a>
        </div>

        {/* Right Side: Search, Cart, Wishlist, Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Desktop Search Bar with Auto-complete Dropdown */}
          <div ref={searchContainerRef} className="relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setIsSearchOpen(false);
                }}
                placeholder="Search for courses, skills..."
                className="bg-white/80 dark:bg-neutral-800 border border-border rounded-full pl-10 pr-8 py-2 text-sm focus:outline-none focus:border-primary w-48 lg:w-72 transition-all shadow-xs text-heading placeholder:text-caption"
              />
              <button
                type="submit"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-caption hover:text-primary transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-caption hover:text-heading transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Live Search Auto-complete Dropdown Popover */}
            {isSearchOpen && (
              <div className="absolute top-full right-0 mt-3 w-80 lg:w-96 bg-white dark:bg-neutral-900 border border-border shadow-2xl rounded-2xl z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 p-3">
                {searchQuery.trim() ? (
                  filteredSuggestions.length > 0 ? (
                    <div>
                      <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-caption flex items-center justify-between border-b border-border/50 pb-2 mb-2">
                        <span>Courses Found ({filteredSuggestions.length})</span>
                        <span className="text-[10px] text-primary font-normal">Press Enter to search</span>
                      </div>
                      <div className="space-y-1">
                        {filteredSuggestions.map((course) => (
                          <button
                            key={course.id}
                            type="button"
                            onClick={() => handleSelectCourse(course.id)}
                            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-primary/10 dark:hover:bg-neutral-800 text-left transition-all group cursor-pointer"
                          >
                            <img
                              src={course.thumbnailUrl || `https://picsum.photos/seed/${course.id}/100/100`}
                              alt={course.title}
                              className="w-10 h-10 rounded-lg object-cover shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-heading truncate group-hover:text-primary transition-colors">
                                {course.title}
                              </div>
                              <div className="text-[11px] text-caption truncate flex items-center gap-2 mt-0.5">
                                <span className="bg-primary/10 text-primary px-1.5 py-0.2 rounded text-[10px] font-semibold">
                                  {course.category || "Course"}
                                </span>
                                <span>₹{course.price}</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="w-full mt-3 py-2 px-3 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>View all results for "{searchQuery}"</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <p className="text-sm font-bold text-heading">No courses found for "{searchQuery}"</p>
                      <p className="text-xs text-caption mt-1">Press Enter to view catalog search</p>
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="mt-3 px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-secondary transition-colors cursor-pointer"
                      >
                        Search Catalog
                      </button>
                    </div>
                  )
                ) : (
                  <div>
                    <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-caption mb-2">
                      Popular Search Topics
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {["Web Development", "Python", "IoT & ESP32", "AI & ML", "Robotics"].map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => {
                            setSearchQuery(topic);
                            navigate(`/courses?search=${encodeURIComponent(topic)}`);
                            setIsSearchOpen(false);
                          }}
                          className="px-3 py-1.5 bg-gray-100 dark:bg-neutral-800 hover:bg-primary/10 hover:text-primary rounded-xl text-xs font-medium text-heading transition-colors cursor-pointer"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/wishlist" className="text-body hover:text-primary relative hidden sm:block p-1">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="text-body hover:text-primary relative hidden sm:block p-1">
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <Link to="/login" className="hidden sm:block text-primary font-bold text-sm hover:opacity-80 px-2">
              Log In
            </Link>
            <Link
              to="/register"
              className="bg-primary text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold hover:bg-secondary transition-colors shadow-md shrink-0"
            >
              Sign Up
            </Link>

            {/* Mobile Menu Icon Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-heading hover:bg-primary/10 rounded-full transition-colors cursor-pointer shrink-0 ml-1"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-heading" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Interactive Navigation Dropdown Panel */}
      {isMobileMenuOpen && (
        <div className="pointer-events-auto w-full max-w-[95%] bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-white/40 dark:border-neutral-800 shadow-2xl rounded-3xl p-5 mt-3 animate-in fade-in-50 zoom-in-95 space-y-4">
          {/* Mobile Search Bar with Auto-complete Dropdown */}
          <div ref={mobileSearchRef} className="relative">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search for courses, skills..."
                className="w-full bg-gray-100 dark:bg-neutral-800 border border-border rounded-xl pl-10 pr-8 py-2.5 text-sm text-heading outline-none focus:border-primary placeholder:text-caption"
              />
              <button
                type="submit"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-caption hover:text-primary transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-caption hover:text-heading transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Mobile Search Results Popover */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 border border-border shadow-2xl rounded-2xl z-50 overflow-hidden p-3 max-h-72 overflow-y-auto">
                {searchQuery.trim() ? (
                  filteredSuggestions.length > 0 ? (
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold uppercase text-caption pb-1 border-b border-border">
                        Course Matches
                      </div>
                      {filteredSuggestions.map((course) => (
                        <button
                          key={course.id}
                          type="button"
                          onClick={() => handleSelectCourse(course.id)}
                          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-primary/10 text-left cursor-pointer"
                        >
                          <img
                            src={course.thumbnailUrl || `https://picsum.photos/seed/${course.id}/100/100`}
                            alt={course.title}
                            className="w-9 h-9 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-heading truncate">{course.title}</div>
                            <div className="text-[10px] text-caption truncate">₹{course.price} • {course.category || "General"}</div>
                          </div>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="w-full py-2 bg-primary/10 text-primary font-bold text-xs rounded-xl text-center cursor-pointer"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                      <p className="text-xs font-bold text-heading">No courses match "{searchQuery}"</p>
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="mt-2 px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg cursor-pointer"
                      >
                        Search Catalog
                      </button>
                    </div>
                  )
                ) : (
                  <div>
                    <div className="text-[11px] font-bold uppercase text-caption mb-2">Popular Searches</div>
                    <div className="flex flex-wrap gap-1.5">
                      {["Web Development", "Python", "IoT", "AI"].map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => {
                            setSearchQuery(topic);
                            navigate(`/courses?search=${encodeURIComponent(topic)}`);
                            setIsSearchOpen(false);
                            setIsMobileMenuOpen(false);
                          }}
                          className="px-2.5 py-1 bg-gray-100 dark:bg-neutral-800 text-xs font-medium rounded-lg text-heading cursor-pointer"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Nav Sections List */}
          <div className="space-y-1 border-t border-b border-border py-3">
            <Link
              to="/"
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                isTabActive("/") ? "bg-primary/15 text-primary" : "text-heading hover:bg-gray-100 dark:hover:bg-neutral-800"
              }`}
            >
              <span>Home</span>
            </Link>
            <Link
              to="/courses"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                isTabActive("/courses") ? "bg-primary/15 text-primary" : "text-heading hover:bg-gray-100 dark:hover:bg-neutral-800"
              }`}
            >
              <span>Courses</span>
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                isTabActive("/about") ? "bg-primary/15 text-primary" : "text-heading hover:bg-gray-100 dark:hover:bg-neutral-800"
              }`}
            >
              <span>About</span>
            </Link>
            <a
              href="/#faqs"
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                handleAnchorClick(e, "#faqs");
              }}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                isTabActive("#faqs") ? "bg-primary/15 text-primary" : "text-heading hover:bg-gray-100 dark:hover:bg-neutral-800"
              }`}
            >
              <span>FAQs</span>
            </a>
            <a
              href="/#contact"
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                handleAnchorClick(e, "#contact");
              }}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                isTabActive("#contact") ? "bg-primary/15 text-primary" : "text-heading hover:bg-gray-100 dark:hover:bg-neutral-800"
              }`}
            >
              <span>Contact</span>
            </a>
          </div>

          {/* Quick Actions (Wishlist & Cart) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <Link
              to="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-neutral-800 border border-border rounded-2xl text-sm font-bold text-heading hover:bg-gray-100 transition-colors"
            >
              <Heart className="w-4 h-4 text-red-500" />
              <span>Wishlist ({wishlist.length})</span>
            </Link>
            <Link
              to="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-neutral-800 border border-border rounded-2xl text-sm font-bold text-heading hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="w-4 h-4 text-primary" />
              <span>Cart ({cart.length})</span>
            </Link>
          </div>

          {/* Mobile Login / Register */}
          <div className="pt-2 flex items-center gap-3">
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 py-3 text-center border border-border rounded-2xl font-bold text-sm text-heading hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 py-3 text-center bg-primary text-white rounded-2xl font-bold text-sm hover:bg-secondary transition-colors shadow-md"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
