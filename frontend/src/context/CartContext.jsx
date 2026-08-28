import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext(undefined);

const CART_STORAGE_KEY = "lms_cart";

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Failed to load cart from storage:", err);
      return [];
    }
  });

  // Sync to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error("Failed to save cart to storage:", err);
    }
  }, [cart]);

  const addToCart = (item) => {
    if (!item) return;
    const targetId = item.id || item.courseId;
    if (!targetId) return;

    setCart((prev) => {
      const alreadyInCart = prev.some((c) => (c.id || c.courseId) === targetId);
      const title = item.title || item.courseTitle || "Course";

      if (alreadyInCart) {
        toast.error(`"${title}" is already in your cart!`, { id: `cart-already-${targetId}` });
        return prev;
      }

      toast.success(`"${title}" added to cart!`, { id: `cart-added-${targetId}` });
      return [...prev, item];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => {
      const removedItem = prev.find((c) => (c.id || c.courseId) === itemId);
      if (removedItem) {
        const title = removedItem.title || removedItem.courseTitle || "Course";
        toast.success(`"${title}" removed from cart`, { id: `cart-removed-${itemId}` });
      }
      return prev.filter((c) => (c.id || c.courseId) !== itemId);
    });
  };

  const isInCart = (itemId) => {
    return cart.some((c) => (c.id || c.courseId) === itemId);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, isInCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export { CartProvider, useCart };
