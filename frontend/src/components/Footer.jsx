import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-foodie-cream border-t border-foodie-primary/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* 1. Brand & Description */}
          <div className="space-y-4">
            <Link to="/" className="inline-block group">
              <span className="text-3xl font-extrabold text-foodie-primary tracking-tight group-hover:text-orange-600 transition duration-300">
                Foodie<span className="text-foodie-text">Flow</span>
              </span>
            </Link>
            <p className="text-gray-600 leading-relaxed text-sm">
              Experience the best culinary delights delivered right to your doorstep. Fresh ingredients, expert chefs, and unforgettable flavors.
            </p>
            <div className="flex gap-4 pt-2">
              <SocialIcon Icon={FaFacebookF} href="https://facebook.com" />
              <SocialIcon Icon={FaInstagram} href="https://instagram.com" />
              <SocialIcon Icon={FaTwitter} href="https://twitter.com" />
              <SocialIcon Icon={FaLinkedinIn} href="https://linkedin.com" />
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-foodie-text mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-foodie-primary rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/" text="Home" />
              <FooterLink to="/menu" text="Our Menu" />
              <FooterLink to="/about" text="About Us" />
              <FooterLink to="/contact" text="Contact" />
            </ul>
          </div>

          {/* 3. Support */}
          <div>
            <h3 className="text-lg font-bold text-foodie-text mb-6 relative inline-block">
              Support
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-foodie-primary rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/faq" text="FAQ" />
              <FooterLink to="/terms" text="Terms of Service" />
              <FooterLink to="/privacy" text="Privacy Policy" />
              <FooterLink to="/help" text="Help Center" />
            </ul>
          </div>

          {/* 4. Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-foodie-text mb-6 relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-foodie-primary rounded-full"></span>
            </h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <span className="font-semibold text-foodie-primary">Address:</span>
                123 Culinary Avenue,<br />Foodie City, FC 90210
              </li>
              <li className="flex items-center gap-3">
                <span className="font-semibold text-foodie-primary">Phone:</span>
                <a href="tel:+1234567890" className="hover:text-foodie-primary transition-colors">+1 (234) 567-890</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="font-semibold text-foodie-primary">Email:</span>
                <a href="mailto:hello@foodieflow.com" className="hover:text-foodie-primary transition-colors">hello@foodieflow.com</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="font-semibold text-foodie-primary">Hours:</span>
                Mon - Sun: 10am - 11pm
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} FoodieFlow. All rights reserved.</p>
          <p>Designed with <span className="text-foodie-danger">❤</span> for food lovers.</p>
        </div>
      </div>
    </footer>
  );
};

// Helper Components
const SocialIcon = ({ Icon, href }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noreferrer"
    className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-foodie-primary hover:text-white hover:border-foodie-primary transition-all duration-300 shadow-sm"
  >
    <Icon size={14} />
  </a>
);

const FooterLink = ({ to, text }) => (
  <li>
    <Link 
      to={to} 
      className="text-gray-600 hover:text-foodie-primary hover:translate-x-1 transition-all duration-200 inline-block text-sm"
    >
      {text}
    </Link>
  </li>
);

export default Footer;
