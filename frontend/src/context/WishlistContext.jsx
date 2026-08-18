import { createContext, useContext, useState, useEffect } from "react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

const WishlistContext = createContext(undefined);

const WISHLIST_STORAGE_KEY = "lms_wishlist";

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Failed to load wishlist from storage:", err);
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Sync to localStorage whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (err) {
      console.error("Failed to save wishlist to storage:", err);
    }
  }, [wishlist]);

  const toggleWishlist = (course) => {
    if (!course || !course.id) return;
    setWishlist((prev) => {
      const isRemoving = prev.some((c) => c.id === course.id);
      const msg = isRemoving ? "Removed from wishlist" : "Added to wishlist";
      setToastMessage(msg);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      if (isRemoving) {
        toast.success(`"${course.title || "Course"}" removed from wishlist`);
        return prev.filter((c) => c.id !== course.id);
      } else {
        toast.success(`"${course.title || "Course"}" added to wishlist!`);
        return [...prev, course];
      }
    });
  };

  const isInWishlist = (courseId) => {
    return wishlist.some((c) => c.id === courseId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem(WISHLIST_STORAGE_KEY);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, clearWishlist }}>
      {children}

      {/* Wishlist Toast Floating Banner */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 z-[100] ${
          showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
        }`}
      >
        <Heart className={`w-5 h-5 ${toastMessage === "Added to wishlist" ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
        <span className="font-medium text-sm">{toastMessage}</span>
      </div>
    </WishlistContext.Provider>
  );
};

const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export { WishlistProvider, useWishlist };
