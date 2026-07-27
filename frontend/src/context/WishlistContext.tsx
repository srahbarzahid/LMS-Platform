import { createContext, useContext, useState, type ReactNode } from 'react';
import { Heart } from 'lucide-react';

export interface Course {
  id: string;
  title: string;
  author?: string;
  price: string;
  rating: string;
  reviews: string;
  tag?: string;
  img: string;
  category?: string;
  level?: string;
}

interface WishlistContextType {
  wishlist: Course[];
  toggleWishlist: (course: Course) => void;
  isInWishlist: (courseId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Course[]>([]);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const toggleWishlist = (course: Course) => {
    setWishlist((prev) => {
      const isRemoving = prev.some((c) => c.id === course.id);
      
      setToastMessage(isRemoving ? 'Removed from wishlist' : 'Added to wishlist');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      if (isRemoving) {
        return prev.filter((c) => c.id !== course.id);
      } else {
        return [...prev, course];
      }
    });
  };

  const isInWishlist = (courseId: string) => {
    return wishlist.some((c) => c.id === courseId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
      {/* Global Wishlist Toast Notification */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 z-[100] ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
        <Heart className={`w-5 h-5 ${toastMessage === 'Added to wishlist' ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        <span className="font-medium text-sm">{toastMessage}</span>
      </div>
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
