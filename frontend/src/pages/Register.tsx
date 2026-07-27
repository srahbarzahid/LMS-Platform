import { Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Phone } from 'lucide-react';

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff0e0] to-white flex items-center justify-center pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-border">
        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold text-heading">Create Account</h2>
            <p className="text-body mt-2">Join us and start learning today.</p>
          </div>
          
          <div className="flex justify-center mb-6">
            <button type="button" className="w-14 h-14 flex items-center justify-center bg-white border border-border rounded-full hover:bg-gray-50 transition-all hover:shadow-md hover:-translate-y-1">
              <svg className="w-7 h-7" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-caption font-medium">Or continue with</span>
            </div>
          </div>
          
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-heading mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-caption w-5 h-5" />
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all text-body bg-gray-50"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-heading mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-caption w-5 h-5" />
                <input 
                  type="email" 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all text-body bg-gray-50"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-heading mb-2">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-caption w-5 h-5" />
                <input 
                  type="tel" 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all text-body bg-gray-50"
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-heading mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-caption w-5 h-5" />
                <input 
                  type="password" 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all text-body bg-gray-50"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-orange-400 text-white py-3.5 rounded-xl font-bold text-lg hover:shadow-lg hover:from-orange-700 hover:to-orange-500 transition-all flex items-center justify-center gap-2 mt-2">
              Create Account <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-body">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-orange-600 hover:text-orange-700 transition-colors">
              Log in
            </Link>
          </div>
        </div>
        <div className="bg-gray-50 border-t border-border p-6 text-center text-xs text-caption">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
};

export default Register;
