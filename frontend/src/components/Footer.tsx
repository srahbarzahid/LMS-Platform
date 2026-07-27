import { Link } from 'react-router-dom';
import { BookOpen, Globe, Mail, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#f0f4f8] pt-16 pb-8 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <BookOpen className="text-primary w-6 h-6" />
              <span className="font-heading font-bold text-xl text-heading">Pibots Robotics</span>
            </Link>
            <p className="text-body text-sm leading-relaxed mb-6">
              Empowering lifelong learners everywhere through expert-led courses, a vibrant community, and modern tools.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-body hover:text-primary hover:border-primary transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-body hover:text-primary hover:border-primary transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading font-bold text-heading mb-6">Explore</h4>
            <ul className="space-y-4">
              <li><Link to="/courses" className="text-body hover:text-primary transition-colors text-sm">All Courses</Link></li>
              <li><Link to="#" className="text-body hover:text-primary transition-colors text-sm">Learning Paths</Link></li>
              <li><Link to="#" className="text-body hover:text-primary transition-colors text-sm">Categories</Link></li>
              <li><Link to="/about" className="text-body hover:text-primary transition-colors text-sm">Our Teams</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-bold text-heading mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-body hover:text-primary transition-colors text-sm">About Us</Link></li>
              <li><Link to="#" className="text-body hover:text-primary transition-colors text-sm">Careers</Link></li>
              <li><Link to="/contact" className="text-body hover:text-primary transition-colors text-sm">Contact</Link></li>
              <li><Link to="#" className="text-body hover:text-primary transition-colors text-sm">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-bold text-heading mb-6">Newsletter</h4>
            <p className="text-body text-sm mb-4">
              Stay updated with our latest news and offers.
            </p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-white border border-border rounded-lg pl-4 pr-12 py-2 text-sm focus:outline-none focus:border-primary"
              />
              <button className="absolute right-1 top-1 bottom-1 bg-primary text-white w-8 rounded-md flex items-center justify-center hover:bg-secondary transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border/60 pt-8 text-center text-caption text-xs">
          <p>&copy; {new Date().getFullYear()} Pibots Robotics. Empowering lifelong learners everywhere.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
