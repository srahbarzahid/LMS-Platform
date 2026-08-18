import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, BookOpen, Heart, Menu, X } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.pathname === "/" ? "/" : location.pathname);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

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
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search for courses, skills..."
              className="bg-white/80 dark:bg-neutral-800 border border-border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary w-48 lg:w-72 transition-all shadow-xs"
            />
            <Search className="w-4 h-4 text-caption absolute left-3.5 top-1/2 -translate-y-1/2" />
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
          {/* Mobile Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search for courses, skills..."
              className="w-full bg-gray-100 dark:bg-neutral-800 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-heading outline-none focus:border-primary"
            />
            <Search className="w-4 h-4 text-caption absolute left-3.5 top-1/2 -translate-y-1/2" />
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
