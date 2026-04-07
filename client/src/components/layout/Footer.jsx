import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, MessageCircle, Share2, ExternalLink, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary-900 text-white relative overflow-hidden">
      {/* Decorative accent line */}
      <div className="h-1 bg-gradient-to-r from-accent-700 via-accent-500 to-accent-700" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-heading text-lg font-bold">R</span>
              </div>
              <span className="text-2xl font-heading font-bold">
                Real<span className="text-accent-500">ES</span>
              </span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Discover extraordinary properties in the most coveted locations. 
              Your dream home awaits with our curated collection of luxury residences.
            </p>
            <div className="flex gap-3">
              {[Globe, MessageCircle, Share2, ExternalLink].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-accent-500 transition-all duration-300 group"
                  aria-label="Social media"
                >
                  <Icon className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-accent-500 mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Properties', 'About Us', 'Contact', 'Blog'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-neutral-400 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-accent-500 transition-all duration-300" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-accent-500 mb-6">Property Types</h4>
            <ul className="space-y-3">
              {['Apartments', 'Houses', 'Villas', 'Condos', 'Penthouses'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/properties?type=${item.toLowerCase()}`}
                    className="text-neutral-400 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-accent-500 transition-all duration-300" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-accent-500 mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-400 text-sm">123 Luxury Lane, Suite 100<br />New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent-500 flex-shrink-0" />
                <a href="tel:+15551234567" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent-500 flex-shrink-0" />
                <a href="mailto:hello@reales.com" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  hello@reales.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-sm">
            © {new Date().getFullYear()} RealES. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((item) => (
              <a key={item} href="#" className="text-neutral-500 hover:text-neutral-300 text-sm transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        className="absolute bottom-8 right-8 w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center hover:bg-accent-600 transition-all duration-300 hover:-translate-y-1 shadow-lg"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 text-white" />
      </button>
    </footer>
  );
}
