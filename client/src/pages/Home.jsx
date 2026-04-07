import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Search, ArrowRight, MapPin, Home, Building2, Castle,
  Star, Shield, Clock, ChevronLeft, ChevronRight,
  Users, Award, TrendingUp, Sparkles, ArrowDown
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import PropertyCard from '@/components/property/PropertyCard';
import { propertiesAPI } from '@/services/api';
import { formatPrice } from '@/utils/helpers';

gsap.registerPlugin(ScrollTrigger);

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=1080&fit=crop',
];

const STATS = [
  { value: 2500, label: 'Properties Listed', suffix: '+' },
  { value: 1200, label: 'Happy Clients', suffix: '+' },
  { value: 98, label: 'Client Satisfaction', suffix: '%' },
  { value: 15, label: 'Years Experience', suffix: '+' },
];

const PROPERTY_TYPES = [
  { icon: Home, label: 'Houses', count: 420, type: 'house' },
  { icon: Building2, label: 'Apartments', count: 680, type: 'apartment' },
  { icon: Castle, label: 'Villas', count: 150, type: 'villa' },
  { icon: Sparkles, label: 'Penthouses', count: 85, type: 'penthouse' },
];

const TESTIMONIALS = [
  {
    name: 'Emily Richardson',
    role: 'Homeowner',
    text: 'RealES made finding our dream home an absolute pleasure. The attention to detail and personalized service exceeded all expectations.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Investor',
    text: 'As a real estate investor, I need a platform I can trust. RealES provides unmatched market insights and premium property listings.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
  },
  {
    name: 'Sarah Johnson',
    role: 'First-time Buyer',
    text: 'The entire experience from search to booking was seamless. The virtual tours saved us so much time. Highly recommend!',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5,
  },
];

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const navigate = useNavigate();

  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuredRef = useRef(null);
  const typesRef = useRef(null);
  const howItWorksRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);
  const statNumbers = useRef([]);

  // Fetch featured properties
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await propertiesAPI.getAll({ featured: true, limit: 6 });
        setFeaturedProperties(data.properties);
      } catch (err) {
        // Use placeholder data if API fails
        setFeaturedProperties([]);
      }
    };
    fetchFeatured();
  }, []);

  // Hero image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      const heroTl = gsap.timeline({ delay: 0.5 });
      heroTl
        .fromTo('.hero-subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        .fromTo('.hero-title', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.4')
        .fromTo('.hero-desc', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
        .fromTo('.hero-search', { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.4)' }, '-=0.3')
        .fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1 }, '-=0.3')
        .fromTo('.hero-scroll', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.2');

      // Stats counter animation
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: 'top 80%',
        onEnter: () => {
          statNumbers.current.forEach((el, i) => {
            if (el) {
              gsap.fromTo(el,
                { innerText: 0 },
                {
                  innerText: STATS[i].value,
                  duration: 2,
                  ease: 'power2.out',
                  snap: { innerText: 1 },
                  onUpdate: function() {
                    el.innerText = Math.round(this.targets()[0].innerText);
                  }
                }
              );
            }
          });
        },
        once: true,
      });

      // Featured properties stagger
      ScrollTrigger.create({
        trigger: featuredRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo('.featured-card',
            { opacity: 0, y: 60, rotateX: -10 },
            { opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15 }
          );
        },
        once: true,
      });

      // Property types animation
      ScrollTrigger.create({
        trigger: typesRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo('.type-card',
            { opacity: 0, scale: 0.8, y: 40 },
            { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.4)', stagger: 0.1 }
          );
        },
        once: true,
      });

      // How it works timeline
      ScrollTrigger.create({
        trigger: howItWorksRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo('.how-step',
            { opacity: 0, x: -40 },
            { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', stagger: 0.2 }
          );
        },
        once: true,
      });

      // Section headers
      gsap.utils.toArray('.section-header').forEach((header) => {
        ScrollTrigger.create({
          trigger: header,
          start: 'top 85%',
          onEnter: () => {
            gsap.fromTo(header,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
            );
          },
          once: true,
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/properties');
    }
  };

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Images */}
        {HERO_IMAGES.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1500"
            style={{ opacity: currentHeroImage === i ? 1 : 0 }}
          >
            <img
              src={img}
              alt=""
              className="w-full h-full object-cover scale-110"
              style={{ transform: currentHeroImage === i ? 'scale(1.05)' : 'scale(1.1)' }}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <p className="hero-subtitle text-accent-400 text-sm md:text-base font-medium tracking-[0.3em] uppercase mb-4 opacity-0">
            Premium Real Estate
          </p>
          <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 leading-tight opacity-0">
            Find Your
            <span className="block text-gradient">Dream Home</span>
          </h1>
          <p className="hero-desc text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 opacity-0">
            Discover extraordinary properties in the most sought-after locations. 
            Experience luxury living redefined.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hero-search max-w-2xl mx-auto mb-8 opacity-0">
            <div className="flex items-center bg-white/95 backdrop-blur-lg rounded-2xl p-2 shadow-2xl">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search by location, property name, or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 text-primary-900 placeholder:text-neutral-400 bg-transparent outline-none text-sm md:text-base"
                />
              </div>
              <Button type="submit" size="lg" className="rounded-xl hidden sm:flex">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button type="submit" size="icon" className="rounded-xl sm:hidden">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* Quick CTAs */}
          <div className="hero-cta flex flex-wrap items-center justify-center gap-4 opacity-0">
            <Link to="/properties">
              <Button variant="glass" size="lg" className="rounded-xl">
                Browse All Properties
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0">
          <span className="text-white/60 text-xs tracking-widest uppercase">Scroll to Explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>

        {/* Image indicators */}
        <div className="absolute bottom-8 right-8 flex gap-2">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentHeroImage(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentHeroImage === i ? 'bg-accent-500 w-8' : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span
                    ref={(el) => (statNumbers.current[i] = el)}
                    className="text-4xl md:text-5xl font-heading font-bold text-primary-900"
                  >
                    0
                  </span>
                  <span className="text-3xl md:text-4xl font-heading font-bold text-accent-500">{stat.suffix}</span>
                </div>
                <p className="text-neutral-500 text-sm mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section ref={featuredRef} className="py-20 md:py-28 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header text-center mb-14">
            <p className="text-accent-500 text-sm font-medium tracking-[0.2em] uppercase mb-3">Handpicked for You</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              Explore our curated selection of premium properties, each chosen for its exceptional quality and remarkable value.
            </p>
          </div>

          {featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property, i) => (
                <div key={property._id} className="featured-card">
                  <PropertyCard property={property} index={i} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="featured-card bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100">
                  <div className="aspect-[4/3] skeleton" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 skeleton rounded w-3/4" />
                    <div className="h-4 skeleton rounded w-1/2" />
                    <div className="h-4 skeleton rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/properties">
              <Button size="lg" variant="outline" className="rounded-xl">
                View All Properties
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section ref={typesRef} className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header text-center mb-14">
            <p className="text-accent-500 text-sm font-medium tracking-[0.2em] uppercase mb-3">Browse By Category</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary-900 mb-4">
              Explore Property Types
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {PROPERTY_TYPES.map(({ icon: Icon, label, count, type }, i) => (
              <Link
                key={type}
                to={`/properties?type=${type}`}
                className="type-card group p-8 rounded-2xl border-2 border-neutral-200 hover:border-accent-500 transition-all duration-500 text-center hover:shadow-xl bg-white"
              >
                <div className="w-20 h-20 rounded-2xl bg-accent-500/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-500 transition-colors duration-500">
                  <Icon className="w-10 h-10 text-accent-500 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-primary-900 mb-2">{label}</h3>
                <p className="text-neutral-500 text-sm">{count} Properties</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={howItWorksRef} className="py-20 md:py-28 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header text-center mb-16">
            <p className="text-accent-500 text-sm font-medium tracking-[0.2em] uppercase mb-3">Simple Process</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
              How It Works
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Finding your perfect property has never been easier. Follow these simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: Search,
                step: '01',
                title: 'Search & Discover',
                desc: 'Browse our curated collection of premium properties using advanced filters to find your perfect match.'
              },
              {
                icon: Clock,
                step: '02',
                title: 'Schedule & Tour',
                desc: 'Book virtual or in-person tours at your convenience. Our agents are available around the clock.'
              },
              {
                icon: Shield,
                step: '03',
                title: 'Book & Enjoy',
                desc: 'Secure your dream property with our seamless booking process and move in with complete peace of mind.'
              },
            ].map(({ icon: Icon, step, title, desc }, i) => (
              <div key={i} className="how-step relative group text-center p-8">
                <div className="flex flex-col items-center">
                  <div className="relative mb-8 w-24 h-24 flex items-center justify-center">
                    <span className="absolute inset-0 flex items-center justify-center text-accent-500/10 text-7xl font-heading font-bold select-none">
                      {step}
                    </span>
                    <div className="relative w-16 h-16 rounded-2xl bg-accent-500/20 flex items-center justify-center group-hover:bg-accent-500 transition-colors duration-500">
                      <Icon className="w-7 h-7 text-accent-500 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-4">{title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="py-20 md:py-28 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header text-center mb-14">
            <p className="text-accent-500 text-sm font-medium tracking-[0.2em] uppercase mb-3">Testimonials</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary-900 mb-4">
              What Our Clients Say
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative overflow-hidden min-h-[280px]">
              {TESTIMONIALS.map((testimonial, i) => (
                <div
                  key={i}
                  className="absolute inset-0 flex flex-col items-center text-center transition-all duration-700"
                  style={{
                    opacity: currentTestimonial === i ? 1 : 0,
                    transform: currentTestimonial === i ? 'translateY(0)' : 'translateY(20px)',
                    pointerEvents: currentTestimonial === i ? 'auto' : 'none',
                  }}
                >
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star key={j} className="w-5 h-5 text-accent-500 fill-accent-500" />
                    ))}
                  </div>
                  <p className="text-lg md:text-xl text-primary-800 leading-relaxed mb-8 italic">
                    "{testimonial.text}"
                  </p>
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover mb-3 ring-2 ring-accent-500/20"
                  />
                  <p className="font-heading font-semibold text-primary-900">{testimonial.name}</p>
                  <p className="text-neutral-500 text-sm">{testimonial.role}</p>
                </div>
              ))}
            </div>

            {/* Testimonial indicators */}
            <div className="flex justify-center gap-3 mt-8">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentTestimonial === i ? 'bg-accent-500 scale-125' : 'bg-neutral-300 hover:bg-neutral-400'
                  }`}
                  aria-label={`View testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA Section */}
      <section ref={ctaRef} className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="section-header">
            <p className="text-accent-500 text-sm font-medium tracking-[0.2em] uppercase mb-3">Stay Updated</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary-900 mb-4">
              Never Miss a Premium Listing
            </h2>
            <p className="text-neutral-500 mb-10 max-w-xl mx-auto">
              Subscribe to receive exclusive property updates, market insights, and early access to new listings.
            </p>
          </div>

          <form className="max-w-lg mx-auto flex gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 h-13 px-5 rounded-xl border border-neutral-300 bg-white text-primary-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 transition-all"
            />
            <Button size="lg" className="rounded-xl whitespace-nowrap">
              Subscribe
            </Button>
          </form>
          <p className="text-neutral-400 text-xs mt-4">
            No spam, ever. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  );
}
