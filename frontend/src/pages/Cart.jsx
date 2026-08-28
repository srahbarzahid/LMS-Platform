import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const Cart = () => {
  const { cart, removeFromCart } = useCart();

  const handleCheckout = () => {
    toast.error("Payment gateway is currently under construction. Online payment processing is not implemented yet.", {
      id: "checkout-under-construction",
      duration: 4000,
      icon: "🚧"
    });
  };

  const calculateTotal = () => {
    return cart.reduce((total2, item) => {
      const priceValue = parseFloat(item.price.replace(/[^\d.]/g, ""));
      return total2 + (isNaN(priceValue) ? 0 : priceValue);
    }, 0);
  };
  const total = calculateTotal();

  return (
    <div className="bg-[#f8f9fa] dark:bg-neutral-950 min-h-screen pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-heading font-bold text-heading mb-10">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 p-12 rounded-3xl border border-border text-center shadow-sm">
            <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-neutral-700 mx-auto mb-4" />
            <h2 className="text-2xl font-heading font-bold text-heading mb-2">Your cart is empty</h2>
            <p className="text-body mb-8">Keep shopping to find a course!</p>
            <Link
              to="/courses"
              className="px-8 py-3.5 bg-gradient-to-r from-orange-600 to-orange-400 text-white font-bold rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all inline-block"
            >
              Keep Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-border shadow-sm p-6 mb-4">
                <h3 className="font-bold text-heading text-lg mb-4">
                  {cart.length} Course{cart.length !== 1 ? "s" : ""} in Cart
                </h3>

                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-border last:border-0 last:pb-0">
                      <div className="w-full sm:w-40 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-heading leading-tight line-clamp-2 pr-4">{item.title}</h4>
                            <span className="font-extrabold text-heading text-lg">{item.price}</span>
                          </div>
                          {item.author && <p className="text-sm text-body">By {item.author}</p>}
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-600 text-sm font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-border shadow-sm p-6 sticky top-24">
                <h3 className="font-bold text-heading text-xl mb-6">Total:</h3>
                <div className="text-4xl font-extrabold text-heading mb-6">
                  ₹{total.toLocaleString("en-IN")}
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-secondary transition-colors shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Checkout <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-body text-center">
                    Secure checkout powered by Stripe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
