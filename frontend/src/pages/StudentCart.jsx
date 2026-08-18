import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import axios from "axios";
const StudentCart = () => {
  const { cart, removeFromCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [automaticOffers, setAutomaticOffers] = useState([]);
  const [isApplying, setIsApplying] = useState(false);
  const [promoError, setPromoError] = useState("");
  useEffect(() => {
    const fetchAutomaticOffers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/student/offers/automatic", {
          withCredentials: true
        });
        if (response.data.success) {
          setAutomaticOffers(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch automatic offers", err);
      }
    };
    fetchAutomaticOffers();
  }, []);
  const handleApplyCoupon = async () => {
    if (!promoCode.trim()) return;
    setIsApplying(true);
    setPromoError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/student/offers/validate",
        { code: promoCode },
        { withCredentials: true }
      );
      if (response.data.success) {
        setAppliedCoupon(response.data.data);
        setPromoCode("");
      }
    } catch (err) {
      setPromoError(err.response?.data?.message || "Invalid coupon code");
    } finally {
      setIsApplying(false);
    }
  };
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const priceValue = parseFloat(item.price.replace(/[^\d.]/g, ""));
      return total + (isNaN(priceValue) ? 0 : priceValue);
    }, 0);
  };
  const originalTotal = calculateTotal();
  let bestDiscountAmount = 0;
  let bestDiscountName = "";
  automaticOffers.forEach((offer) => {
    if (offer.offerType === "Course Offer" || offer.offerType === "Category Offer") {
      let discountAmount = 0;
      if (offer.discountType === "Percentage") {
        discountAmount = originalTotal * (offer.discountValue / 100);
      } else {
        discountAmount = offer.discountValue;
      }
      if (offer.maximumDiscountAmount && discountAmount > offer.maximumDiscountAmount) {
        discountAmount = offer.maximumDiscountAmount;
      }
      if (discountAmount > bestDiscountAmount) {
        bestDiscountAmount = discountAmount;
        bestDiscountName = offer.name;
      }
    }
  });
  if (appliedCoupon) {
    let discountAmount = 0;
    if (appliedCoupon.discountType === "Percentage") {
      discountAmount = originalTotal * (appliedCoupon.discountValue / 100);
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
    if (appliedCoupon.maximumDiscountAmount && discountAmount > appliedCoupon.maximumDiscountAmount) {
      discountAmount = appliedCoupon.maximumDiscountAmount;
    }
    if (discountAmount > bestDiscountAmount) {
      bestDiscountAmount = discountAmount;
      bestDiscountName = appliedCoupon.code;
    }
  }
  const finalTotal = Math.max(0, originalTotal - bestDiscountAmount);
  return <div className="space-y-8 pb-8">
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm">
        <h1 className="text-3xl font-heading font-bold text-heading">Shopping Cart</h1>
      </div>

      {cart.length === 0 ? <div className="bg-white p-12 rounded-3xl border border-border text-center shadow-sm flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <ShoppingCart className="w-10 h-10 text-caption" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-heading mb-2">Your cart is empty</h2>
          <p className="text-body max-w-md mx-auto mb-8">Keep shopping to find a course you'd like to learn!</p>
          <Link to="/courses" className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-400 text-white font-bold rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all inline-block">
            Keep Shopping
          </Link>
        </div> : <div className="flex flex-col lg:flex-row gap-8">
          
          {
    /* Cart Items List */
  }
          <div className="flex-1 space-y-4">
            <div className="bg-white rounded-3xl border border-border shadow-sm p-6 lg:p-8">
              <h3 className="font-bold text-heading text-lg mb-6 pb-4 border-b border-border">
                {cart.length} Course{cart.length !== 1 ? "s" : ""} in Cart
              </h3>
              
              <div className="space-y-6">
                {cart.map((item) => <div key={item.id} className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-border last:border-0 last:pb-0">
                    <div className="w-full sm:w-48 aspect-video rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-heading font-bold text-heading text-lg leading-tight line-clamp-2 pr-4 group-hover:text-primary transition-colors">
                            {item.title}
                          </h4>
                          <span className="font-extrabold text-primary text-xl">{item.price}</span>
                        </div>
                        {item.author && <p className="text-sm text-caption">Instructor: <span className="text-heading font-medium">{item.author}</span></p>}
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <button
    onClick={() => removeFromCart(item.id)}
    className="text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
  >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>

          {
    /* Checkout Panel */
  }
          <div className="w-full lg:w-80 xl:w-96 shrink-0">
            <div className="bg-white rounded-3xl border border-border shadow-sm p-6 lg:p-8 sticky top-8">
              <h3 className="font-heading font-bold text-heading text-xl mb-6 pb-4 border-b border-border">Order Summary</h3>
              
              <div className="flex justify-between items-center mb-4 text-body">
                <span>Original Price:</span>
                <span className={bestDiscountAmount > 0 ? "line-through text-gray-400" : "font-medium"}>
                  ₹{originalTotal.toLocaleString("en-IN")}
                </span>
              </div>

              {bestDiscountAmount > 0 && <div className="flex justify-between items-center mb-4 text-emerald-600 font-medium">
                  <span>Discount ({bestDiscountName}):</span>
                  <span>-₹{bestDiscountAmount.toLocaleString("en-IN")}</span>
                </div>}
              
              <div className="pt-4 border-t border-border mb-6">
                <div className="flex justify-between items-end mb-1">
                  <span className="font-bold text-heading text-lg">Total:</span>
                  <span className="text-4xl font-extrabold text-heading">
                    ₹{finalTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {
    /* Promo Code Section */
  }
              <div className="mb-6 pt-6 border-t border-border">
                <label className="block text-sm font-bold text-heading mb-2">Promo Code</label>
                <div className="flex gap-2">
                  <input
    type="text"
    value={promoCode}
    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
    placeholder="Enter coupon code"
    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all uppercase font-medium"
  />
                  <button
    onClick={handleApplyCoupon}
    disabled={isApplying || !promoCode.trim()}
    className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors"
  >
                    {isApplying ? "..." : "Apply"}
                  </button>
                </div>
                {promoError && <p className="text-sm text-red-500 mt-2 font-medium">{promoError}</p>}
                
                {appliedCoupon && appliedCoupon.code !== bestDiscountName && bestDiscountName !== "" && <p className="text-sm text-amber-600 mt-2 font-medium">
                    Note: A better automatic discount ({bestDiscountName}) is currently applied.
                  </p>}
                
                {appliedCoupon && (appliedCoupon.code === bestDiscountName || appliedCoupon.name === bestDiscountName) && <div className="flex items-center justify-between mt-3 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                    <span className="font-bold text-sm">Code <span className="uppercase">{appliedCoupon.code}</span> applied!</span>
                    <button onClick={() => setAppliedCoupon(null)} className="text-emerald-700 hover:text-emerald-900 p-1 rounded-md hover:bg-emerald-100 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>}
              </div>
              
              <button className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-secondary transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                Checkout <ArrowRight className="w-5 h-5" />
              </button>
              
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-caption text-center">
                  Secure checkout powered by Stripe. 30-Day Money-Back Guarantee.
                </p>
              </div>
            </div>
          </div>
          
        </div>}
    </div>;
};
var stdin_default = StudentCart;
export {
  stdin_default as default
};
