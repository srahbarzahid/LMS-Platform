import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.error(
        "SMTP Email Gateway for automated password reset links is currently under construction.",
        {
          id: "forgot-password-under-construction",
          duration: 5000,
          icon: "🚧"
        }
      );
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-neutral-950 flex items-center justify-center pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-xl overflow-hidden border border-border dark:border-neutral-800">
        <div className="p-8">
          {/* Back to Login Arrow Link */}
          <div className="flex items-center justify-start mb-4">
            <Link
              to="/login"
              className="text-caption hover:text-primary transition-colors cursor-pointer flex items-center gap-2 text-sm font-bold"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Log In
            </Link>
          </div>

          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl text-primary flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-heading dark:text-white">Forgot Password?</h2>
            <p className="text-body dark:text-neutral-400 text-sm mt-2">
              Enter your email address below and we'll send you instructions to reset your password.
            </p>
          </div>

          {submitted && (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs font-semibold text-amber-800 dark:text-amber-300 leading-relaxed">
                <span className="font-bold block mb-1">Notice: Service Under Construction</span>
                SMTP Email Gateway integration for automated password reset links is currently under construction. Please contact support or your administrator to reset your account password.
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
            <input type="text" name="fake_email_trap" className="hidden" tabIndex={-1} autoComplete="username" />
            
            <div>
              <label className="block text-sm font-bold text-heading dark:text-neutral-200 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-caption w-5 h-5" />
                <input
                  type="email"
                  name="lms_forgot_pwd_email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border dark:border-neutral-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body dark:text-white bg-[#f8f9fa] dark:bg-neutral-800"
                  placeholder="john@example.com"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold text-base hover:bg-secondary transition-colors shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Sending Instructions...
                </>
              ) : (
                <>
                  Send Reset Instructions <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-body dark:text-neutral-400">
            Remember your password?{" "}
            <Link to="/login" className="font-bold text-primary hover:text-secondary transition-colors">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
