import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Globe, Mail, ArrowRight, Share2 } from "lucide-react";
import axios from "axios";
import apiClient from "../api/client";

// Clean SVG Social Icon Components
const FacebookIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.5C10 7.02 11.49 5.65 13.72 5.65c1.07 0 2.19.19 2.19.19v2.41h-1.24c-1.23 0-1.61.76-1.61 1.54V12h2.72l-.43 3H13v6.8c4.56-.93 8-4.96 8-9.8z" />
  </svg>
);

const TwitterIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z" />
  </svg>
);

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Footer = () => {
  const [footerData, setFooterData] = useState({
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    contactEmail: "pibotsacademy@gmail.com",
    copyright: `© ${new Date().getFullYear()} Pi Tech LMS Platform. All Rights Reserved.`,
  });

  useEffect(() => {
    apiClient
      .get("/public/content")
      .then((res) => {
        if (res.data?.success && res.data?.data?.footer) {
          setFooterData((prev) => ({
            ...prev,
            ...res.data.data.footer,
          }));
        }
      })
      .catch((err) => console.log("Using default footer data"));
  }, []);

  return (
    <footer className="bg-[#f0f4f8] pt-16 pb-8 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <BookOpen className="text-primary w-6 h-6" />
              <span className="font-heading font-bold text-xl text-heading">Pi Tech LMS</span>
            </Link>
            <p className="text-body text-sm leading-relaxed mb-6">
              Empowering lifelong learners everywhere through expert-led courses, a vibrant community, and modern tools.
            </p>
            <div className="flex space-x-3">
              {footerData.facebook && (
                <a
                  href={footerData.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center text-body hover:text-primary hover:border-primary transition-colors"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              )}
              {footerData.twitter && (
                <a
                  href={footerData.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center text-body hover:text-primary hover:border-primary transition-colors"
                >
                  <TwitterIcon className="w-4 h-4" />
                </a>
              )}
              {footerData.linkedin && (
                <a
                  href={footerData.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center text-body hover:text-primary hover:border-primary transition-colors"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              )}
              {footerData.instagram && (
                <a
                  href={footerData.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center text-body hover:text-primary hover:border-primary transition-colors"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              )}
              <a
                href={`mailto:${footerData.contactEmail}`}
                className="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center text-body hover:text-primary hover:border-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-heading mb-6">Explore</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/courses" className="text-body hover:text-primary transition-colors text-sm">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-body hover:text-primary transition-colors text-sm">
                  Learning Paths
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-body hover:text-primary transition-colors text-sm">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-body hover:text-primary transition-colors text-sm">
                  Our Team
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-heading mb-6">Company</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-body hover:text-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-body hover:text-primary transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-body hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-heading mb-6">Newsletter</h4>
            <p className="text-body text-sm mb-4">Stay updated with our latest news and offers.</p>
            <div className="relative">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-white border border-border rounded-lg pl-4 pr-12 py-2 text-sm focus:outline-none focus:border-primary"
              />
              <button className="absolute right-1 top-1 bottom-1 bg-primary text-white w-8 rounded-md flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border/60 pt-8 text-center text-caption text-xs">
          <p>{footerData.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
