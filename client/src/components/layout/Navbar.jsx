import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Menu, X, User, LogOut, Heart, Calendar, LayoutDashboard, ChevronDown, Sun, Moon } from 'lucide-react';
import { Button } from '../ui/Button';
import useAuthStore from '@/store/authStore';
import useThemeStore from '@/store/themeStore';
import { cn } from '@/utils/helpers';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMobileMenuOpen) {
        gsap.fromTo(mobileMenuRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
        );
      }
    }
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Properties', path: '/properties' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header
      ref={navRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled || !isHomePage
          ? 'bg-white/95 backdrop-blur-lg shadow-sm border-b border-neutral-200/50'
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" aria-label="RealES Home">
            <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <span className="text-white font-heading text-lg font-bold">R</span>
            </div>
            <span className={cn(
              'text-2xl font-heading font-bold transition-colors duration-300',
              isScrolled || !isHomePage ? 'text-primary-900' : 'text-white'
            )}>
              Real<span className="text-accent-500">ES</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-sm font-medium transition-all duration-300 relative group',
                  location.pathname === link.path
                    ? 'text-accent-500'
                    : isScrolled || !isHomePage
                      ? 'text-primary-800 hover:text-accent-500'
                      : 'text-white/90 hover:text-white'
                )}
              >
                {link.label}
                <span className={cn(
                  'absolute -bottom-1 left-0 h-0.5 bg-accent-500 transition-all duration-300',
                  location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                )} />
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300',
                isScrolled || !isHomePage
                  ? 'text-primary-800 hover:bg-neutral-100'
                  : 'text-white hover:bg-white/10'
              )}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300',
                    isScrolled || !isHomePage
                      ? 'hover:bg-neutral-100 text-primary-800'
                      : 'hover:bg-white/10 text-white'
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 animate-scale-in">
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="text-sm font-medium text-primary-900">{user?.name}</p>
                      <p className="text-xs text-neutral-500">{user?.email}</p>
                    </div>
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-800 hover:bg-neutral-50 transition-colors">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link to="/dashboard/bookings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-800 hover:bg-neutral-50 transition-colors">
                      <Calendar className="w-4 h-4" /> My Bookings
                    </Link>
                    <Link to="/dashboard/favorites" className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-800 hover:bg-neutral-50 transition-colors">
                      <Heart className="w-4 h-4" /> Favorites
                    </Link>
                    <Link to="/dashboard/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-800 hover:bg-neutral-50 transition-colors">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <div className="border-t border-neutral-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-red-50 transition-colors w-full"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant={isScrolled || !isHomePage ? 'ghost' : 'glass'} size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300',
                isScrolled || !isHomePage ? 'text-primary-900' : 'text-white'
              )}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              className="p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className={cn('w-6 h-6', isScrolled || !isHomePage ? 'text-primary-900' : 'text-white')} />
              ) : (
                <Menu className={cn('w-6 h-6', isScrolled || !isHomePage ? 'text-primary-900' : 'text-white')} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden bg-white border-t border-neutral-200 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'block text-lg font-medium py-2 transition-colors',
                  location.pathname === link.path ? 'text-accent-500' : 'text-primary-800'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-neutral-200 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="outline" className="w-full">Dashboard</Button>
                  </Link>
                  <Button variant="destructive" className="w-full" onClick={handleLogout}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
