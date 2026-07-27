import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, BookOpen, Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname === '/' ? '/' : location.pathname);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef<HTMLDivElement>(null);

  // Sync activeTab with route changes initially
  useEffect(() => {
    setActiveTab(location.pathname === '/' ? (location.hash || '/') : location.pathname);
  }, [location]);

  // Scroll spy for Home page
  useEffect(() => {
    if (location.pathname !== '/') {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 })); // Hide initially on route change until measured
      return;
    }

    const handleScroll = () => {
      const sections = ['home', 'courses', 'about', 'contact'];
      let newSection = '/';
      
      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the section has scrolled past the middle of the screen
          if (rect.top <= window.innerHeight / 2) {
            newSection = id === 'home' ? '/' : (id === 'contact' ? '#contact' : `/${id}`);
          }
        }
      }
      
      // Special case: if we hit the very bottom of the page, select contact
      if (window.innerHeight + Math.round(window.scrollY) >= document.body.offsetHeight - 50) {
        newSection = '#contact';
      }

      setActiveTab(newSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Update indicator style when activeTab changes
  useEffect(() => {
    if (!navRef.current) return;
    
    // Wait a tick for DOM to update
    const timeout = setTimeout(() => {
      if (!navRef.current) return;
      const activeEl = navRef.current.querySelector(`[data-active="true"]`) as HTMLElement;
      if (activeEl) {
        setIndicatorStyle({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
          opacity: 1
        });
      }
    }, 50);

    return () => clearTimeout(timeout);
  }, [activeTab, location.pathname]);

  const isTabActive = (path: string) => activeTab === path;
  const { wishlist } = useWishlist();
  const { cart } = useCart();

  return (
    <div className="fixed w-full z-50 top-4 px-4 sm:px-6 lg:px-8 transition-all duration-300 pointer-events-none flex justify-center">
      <nav className="pointer-events-auto bg-white/40 backdrop-blur-lg border border-white/40 shadow-sm w-full max-w-[95%] xl:max-w-7xl rounded-full px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Left Side: Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <BookOpen className="text-white w-5 h-5" />
          </div>
          <span className="font-heading font-bold text-lg text-heading hidden sm:block leading-tight">
            Pi Tech
          </span>
        </Link>
        
        {/* Center: Navigation Links */}
        <div ref={navRef} className="hidden lg:flex items-center space-x-1 relative">
          {/* Animated Pill Indicator */}
          <div 
            className="absolute h-9 bg-primary/15 rounded-full transition-all duration-300 ease-out shadow-inner z-0 pointer-events-none"
            style={{ 
              left: `${indicatorStyle.left}px`, 
              width: `${indicatorStyle.width}px`,
              opacity: indicatorStyle.opacity 
            }}
          />
          <Link 
            data-active={isTabActive('/')} 
            to="/" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`px-4 py-2 rounded-full transition-colors relative z-10 text-sm ${isTabActive('/') ? 'text-primary font-bold' : 'text-heading font-medium hover:text-primary hover:bg-primary/5'}`}
          >
            Home
          </Link>
          <Link data-active={isTabActive('/courses')} to="/courses" className={`px-4 py-2 rounded-full transition-colors relative z-10 text-sm ${isTabActive('/courses') ? 'text-primary font-bold' : 'text-heading font-medium hover:text-primary hover:bg-primary/5'}`}>Courses</Link>
          <Link data-active={isTabActive('/about')} to="/about" className={`px-4 py-2 rounded-full transition-colors relative z-10 text-sm ${isTabActive('/about') ? 'text-primary font-bold' : 'text-heading font-medium hover:text-primary hover:bg-primary/5'}`}>About</Link>
          <a data-active={isTabActive('#contact')} href="/#contact" className={`px-4 py-2 rounded-full transition-colors relative z-10 text-sm ${isTabActive('#contact') ? 'text-primary font-bold' : 'text-heading font-medium hover:text-primary hover:bg-primary/5'}`}>Contact</a>
        </div>

        {/* Right Side: Search and Actions */}
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Search for courses, skills, and more" 
              className="bg-white border border-transparent rounded-full pl-11 pr-4 py-2 text-sm focus:outline-none focus:border-primary w-64 lg:w-80 transition-all shadow-sm"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/wishlist" className="text-body hover:text-primary relative hidden sm:block">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{wishlist.length}</span>
              )}
            </Link>
            <Link to="/cart" className="text-body hover:text-primary relative hidden sm:block">
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{cart.length}</span>
              )}
            </Link>
          </div>

          <div className="flex items-center gap-3 pl-2">
            <Link to="/login" className="hidden sm:block text-primary font-bold text-sm hover:opacity-80">Log In</Link>
            <Link to="/register" className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-secondary transition-colors shadow-md">Sign Up</Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
