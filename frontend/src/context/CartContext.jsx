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
    if (!item || !item.id) return;
    setCart((prev) => {
      if (!prev.some((c) => c.id === item.id)) {
        toast.success(`"${item.title || "Course"}" added to cart!`);
        return [...prev, item];
      } else {
        toast.error(`"${item.title || "Course"}" is already in your cart!`);
        return prev;
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => {
      const removedItem = prev.find((c) => c.id === itemId);
      if (removedItem) {
        toast.success(`"${removedItem.title || "Course"}" removed from cart`);
      }
      return prev.filter((c) => c.id !== itemId);
    });
  };

  const isInCart = (itemId) => {
    return cart.some((c) => c.id === itemId);
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
