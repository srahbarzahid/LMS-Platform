import { createContext, useContext, useState, useEffect } from "react";
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

  // Sync to localStorage whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (err) {
      console.error("Failed to save wishlist to storage:", err);
    }
  }, [wishlist]);

  const toggleWishlist = (course) => {
    if (!course) return;
    const targetId = course.id || course.courseId;
    if (!targetId) return;

    setWishlist((prev) => {
      const isRemoving = prev.some((c) => (c.id || c.courseId) === targetId);
      const title = course.title || course.courseTitle || "Course";

      if (isRemoving) {
        toast.success(`"${title}" removed from wishlist`, { id: `wishlist-toggle-${targetId}` });
        return prev.filter((c) => (c.id || c.courseId) !== targetId);
      } else {
        toast.success(`"${title}" added to wishlist!`, { id: `wishlist-toggle-${targetId}` });
        return [...prev, course];
      }
    });
  };

  const isInWishlist = (courseId) => {
    return wishlist.some((c) => (c.id || c.courseId) === courseId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem(WISHLIST_STORAGE_KEY);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, clearWishlist }}>
      {children}
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
