import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import useAuthStore from '@/store/authStore';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading, isAuthenticated, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    gsap.fromTo(formRef.current,
      { opacity: 0, y: 40, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  const getPasswordStrength = () => {
    const { password } = form;
    if (!password) return { width: '0%', color: 'bg-neutral-200', label: '' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const levels = [
      { width: '20%', color: 'bg-error', label: 'Weak' },
      { width: '40%', color: 'bg-orange-500', label: 'Fair' },
      { width: '60%', color: 'bg-warning', label: 'Good' },
      { width: '80%', color: 'bg-lime-500', label: 'Strong' },
      { width: '100%', color: 'bg-success', label: 'Very Strong' },
    ];
    return levels[Math.min(score, 4)];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await register({ name: form.name, email: form.email, password: form.password, role: form.role });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex">
      {/* Left - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=1600&fit=crop"
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
            Join CIT-ES
          </h2>
          <p className="text-white/70 text-lg max-w-md">
            Create an account and start exploring the finest properties available.
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

          <h1 className="text-3xl font-heading font-bold text-primary-900 mb-2">Create Account</h1>
          <p className="text-neutral-500 mb-8">Start your luxury property journey today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full h-12 pl-11 pr-12 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} rounded-full transition-all duration-500`} style={{ width: strength.width }} />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">Password strength: {strength.label}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                {['user', 'agent'].map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setForm({ ...form, role })}
                    className={`h-11 rounded-xl border-2 text-sm font-medium capitalize transition-all ${
                      form.role === role
                        ? 'border-accent-500 bg-accent-500/5 text-accent-600'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    {role === 'user' ? '🏠 Buyer/Renter' : '🏢 Agent'}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-error">{error}</div>
            )}

            <Button type="submit" className="w-full h-12 rounded-xl text-base" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          <p className="text-center text-sm text-neutral-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-500 hover:text-accent-600 font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
