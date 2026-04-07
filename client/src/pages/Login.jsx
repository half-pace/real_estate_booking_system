import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import useAuthStore from '@/store/authStore';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, isAuthenticated, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    gsap.fromTo(formRef.current,
      { opacity: 0, y: 40, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    try {
      await login({ email, password });
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=1600&fit=crop"
          alt="Luxury property"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-900/40" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-heading text-lg font-bold">R</span>
            </div>
            <span className="text-2xl font-heading font-bold text-white">
              Real<span className="text-accent-500">ES</span>
            </span>
          </Link>
          <h2 className="text-4xl font-heading font-bold text-white mb-4">
            Welcome Back
          </h2>
          <p className="text-white/70 text-lg max-w-md">
            Continue your journey to finding the perfect luxury property.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <div ref={formRef} className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-heading text-lg font-bold">R</span>
              </div>
              <span className="text-2xl font-heading font-bold text-primary-900">
                Real<span className="text-accent-500">ES</span>
              </span>
            </Link>
          </div>

          <h1 className="text-3xl font-heading font-bold text-primary-900 mb-2">Sign In</h1>
          <p className="text-neutral-500 mb-8">Enter your credentials to access your account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-12 pl-11 pr-12 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-neutral-300 text-accent-500 focus:ring-accent-500" />
                <span className="text-sm text-neutral-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-accent-500 hover:text-accent-600 transition-colors">
                Forgot password?
              </a>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-error">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-12 rounded-xl text-base" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-sm text-neutral-400">or</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          {/* Social Login Placeholders */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="h-11 rounded-xl border border-neutral-200 flex items-center justify-center gap-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button className="h-11 rounded-xl border border-neutral-200 flex items-center justify-center gap-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>

          <p className="text-center text-sm text-neutral-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent-500 hover:text-accent-600 font-medium transition-colors">
              Create Account
            </Link>
          </p>

          {/* Demo accounts */}
          <div className="mt-8 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
            <p className="text-xs font-medium text-neutral-600 mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-neutral-500">
              <p>Agent: agent@reales.com / password123</p>
              <p>User: user@reales.com / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
