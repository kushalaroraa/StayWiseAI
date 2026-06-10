import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 transition-colors duration-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <span className="text-2xl font-bold tracking-tight text-white">
              StayWise<span className="text-primary-500">.ai</span>
            </span>
            <p className="text-sm text-slate-400 leading-relaxed">
              Premium AI-powered hotel reservations. Seamless stays, dynamic pricing, and intelligent personalization for travelers and hoteliers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-500 transition-colors"><Github size={18} /></a>
              <a href="#" className="hover:text-primary-500 transition-colors"><Twitter size={18} /></a>
              <a href="#" className="hover:text-primary-500 transition-colors"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Top Destinations</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/search-results?location=Goa" className="hover:text-white transition-colors">Goa Beaches</Link></li>
              <li><Link to="/search-results?location=Udaipur" className="hover:text-white transition-colors">Udaipur Royal Palaces</Link></li>
              <li><Link to="/search-results?location=Mumbai" className="hover:text-white transition-colors">Mumbai Business Hub</Link></li>
              <li><Link to="/search-results?location=Paris" className="hover:text-white transition-colors">Parisian Retreats</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Support & Care</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cancellation Policies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy & GDPR</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact Office</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <MapPin size={16} className="text-primary-500 mr-2 shrink-0" />
                <span>BKC Corporate Park, Mumbai, India</span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="text-primary-500 mr-2 shrink-0" />
                <span>+91 (22) 555-0199</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="text-primary-500 mr-2 shrink-0" />
                <span>reservations@staywise.ai</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-850 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} StayWise.ai. Built with pride using Gemini AI.</p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Shield size={14} className="text-primary-500" />
            <span>Secure 256-bit SSL encrypted payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
