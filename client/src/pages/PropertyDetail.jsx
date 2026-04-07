import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import {
  MapPin, Bed, Bath, Maximize, Car, Star, Heart, Share2, Eye,
  ChevronLeft, ChevronRight, X, Calendar, Users, Phone, Mail,
  Wifi, Dumbbell, Waves, TreePine, Shield, Home, Check, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import PropertyCard from '@/components/property/PropertyCard';
import { propertiesAPI, bookingsAPI, reviewsAPI } from '@/services/api';
import useAuthStore from '@/store/authStore';
import { formatPrice, formatDate } from '@/utils/helpers';
import toast from 'react-hot-toast';

const AMENITY_ICONS = {
  'Pool': Waves, 'Gym': Dumbbell, 'Garden': TreePine, 'Security': Shield,
  'Wifi': Wifi, 'Smart Home': Home, 'Parking': Car,
};

export default function PropertyDetail() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuthStore();
  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Booking state
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  const heroRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [propRes, simRes, revRes] = await Promise.allSettled([
          propertiesAPI.getOne(id),
          propertiesAPI.getSimilar(id),
          reviewsAPI.getPropertyReviews(id),
        ]);

        if (propRes.status === 'fulfilled') setProperty(propRes.value.data.property);
        if (simRes.status === 'fulfilled') setSimilar(simRes.value.data.properties || []);
        if (revRes.status === 'fulfilled') setReviews(revRes.value.data.reviews || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!loading && property) {
      gsap.fromTo(heroRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out' }
      );
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 }
      );
    }
  }, [loading, property]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to book a property');
      return;
    }
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    if (new Date(checkIn) >= new Date(checkOut)) {
      toast.error('Check-out must be after check-in');
      return;
    }

    setBookingLoading(true);
    try {
      await bookingsAPI.create({
        property: property._id,
        checkIn,
        checkOut,
        guests,
      });
      toast.success('Booking created successfully!');
      setCheckIn('');
      setCheckOut('');
      setGuests(1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    return Math.max(0, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));
  };

  if (loading) {
    return (
      <div className="pt-24 pb-20 min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="aspect-[16/7] skeleton rounded-2xl mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-10 skeleton rounded w-3/4" />
              <div className="h-6 skeleton rounded w-1/2" />
              <div className="h-40 skeleton rounded" />
            </div>
            <div className="h-96 skeleton rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold text-primary-900 mb-4">Property Not Found</h2>
          <Link to="/properties"><Button>Browse Properties</Button></Link>
        </div>
      </div>
    );
  }

  const nights = calculateNights();

  return (
    <div className="page-transition pt-20 min-h-screen bg-neutral-50">
      {/* Image Gallery */}
      <div ref={heroRef} className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-2xl overflow-hidden max-h-[500px]">
            {/* Main Image */}
            <div
              className="md:col-span-2 md:row-span-2 relative cursor-pointer group overflow-hidden"
              onClick={() => { setCurrentImage(0); setShowLightbox(true); }}
            >
              <img
                src={property.images?.[0] || property.mainImage}
                alt={property.title}
                className="w-full h-full object-cover min-h-[300px] md:min-h-[500px] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>

            {/* Thumbnails */}
            {property.images?.slice(1, 5).map((img, i) => (
              <div
                key={i}
                className="hidden md:block relative cursor-pointer group overflow-hidden"
                onClick={() => { setCurrentImage(i + 1); setShowLightbox(true); }}
              >
                <img
                  src={img}
                  alt={`${property.title} - ${i + 2}`}
                  className="w-full h-full object-cover min-h-[245px] transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                {i === 3 && property.images.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">+{property.images.length - 5} more</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge>{property.type}</Badge>
                    <Badge variant={property.status === 'available' ? 'success' : 'warning'}>
                      {property.status}
                    </Badge>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 text-neutral-500">
                    <MapPin className="w-4 h-4 text-accent-500" />
                    <span>{property.location?.address}, {property.location?.city}, {property.location?.state}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors" aria-label="Save">
                    <Heart className="w-5 h-5 text-neutral-600" />
                  </button>
                  <button className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors" aria-label="Share">
                    <Share2 className="w-5 h-5 text-neutral-600" />
                  </button>
                </div>
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap items-center gap-6 py-4 mt-4 border-y border-neutral-200">
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-accent-500" />
                  <span className="text-sm"><strong>{property.features?.bedrooms}</strong> Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-accent-500" />
                  <span className="text-sm"><strong>{property.features?.bathrooms}</strong> Bathrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize className="w-5 h-5 text-accent-500" />
                  <span className="text-sm"><strong>{property.features?.area?.toLocaleString()}</strong> sq ft</span>
                </div>
                {property.features?.parking > 0 && (
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-accent-500" />
                    <span className="text-sm"><strong>{property.features.parking}</strong> Parking</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 text-accent-500 fill-accent-500" />
                  <span className="text-sm font-semibold">{property.rating}</span>
                  <span className="text-sm text-neutral-500">({property.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{property.views} views</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div>
              <div className="flex border-b border-neutral-200">
                {['overview', 'amenities', 'reviews'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 text-sm font-medium capitalize transition-all relative ${
                      activeTab === tab ? 'text-accent-500' : 'text-neutral-500 hover:text-primary-800'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-500" />
                    )}
                  </button>
                ))}
              </div>

              <div className="py-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-heading font-semibold text-primary-900 mb-3">About this property</h3>
                      <p className="text-neutral-600 leading-relaxed whitespace-pre-line">{property.description}</p>
                    </div>
                    {property.features?.furnished && (
                      <div className="flex items-center gap-2 text-success">
                        <Check className="w-5 h-5" />
                        <span className="text-sm font-medium">Fully Furnished</span>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'amenities' && (
                  <div>
                    <h3 className="text-xl font-heading font-semibold text-primary-900 mb-4">Amenities & Features</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.amenities?.map((amenity, i) => {
                        const Icon = AMENITY_ICONS[amenity] || Check;
                        return (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                            <div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-accent-500" />
                            </div>
                            <span className="text-sm font-medium text-primary-800">{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-xl font-heading font-semibold text-primary-900 mb-4">
                      Guest Reviews ({reviews.length})
                    </h3>
                    {reviews.length > 0 ? (
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div key={review._id} className="p-4 rounded-xl bg-white border border-neutral-100">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-full bg-accent-500/10 flex items-center justify-center">
                                <span className="text-accent-500 font-semibold text-sm">
                                  {review.user?.name?.[0] || 'U'}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-primary-900 text-sm">{review.user?.name}</p>
                                <div className="flex gap-0.5">
                                  {Array.from({ length: review.rating }).map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 text-accent-500 fill-accent-500" />
                                  ))}
                                </div>
                              </div>
                              <span className="text-xs text-neutral-400 ml-auto">{formatDate(review.createdAt)}</span>
                            </div>
                            <p className="text-neutral-600 text-sm">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-neutral-500 text-sm">No reviews yet. Be the first to review!</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Agent Card */}
            {property.agent && (
              <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
                <h3 className="text-lg font-heading font-semibold text-primary-900 mb-4">Listed By</h3>
                <div className="flex items-center gap-4">
                  <img
                    src={property.agent.avatar || `https://ui-avatars.com/api/?name=${property.agent.name}&background=c9a55c&color=fff`}
                    alt={property.agent.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-accent-500/20"
                  />
                  <div className="flex-1">
                    <p className="font-heading font-semibold text-primary-900">{property.agent.name}</p>
                    <p className="text-sm text-neutral-500">{property.agent.bio?.slice(0, 80) || 'Real Estate Agent'}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${property.agent.phone}`} className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-accent-500 hover:text-white hover:border-accent-500 transition-all">
                      <Phone className="w-4 h-4" />
                    </a>
                    <a href={`mailto:${property.agent.email}`} className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-accent-500 hover:text-white hover:border-accent-500 transition-all">
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl p-6 border border-neutral-100 shadow-lg">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-heading font-bold text-primary-900">{formatPrice(property.price)}</span>
                <span className="text-neutral-500">/night</span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-neutral-600 mb-1 block">CHECK-IN</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-600 mb-1 block">CHECK-OUT</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-600 mb-1 block">GUESTS</label>
                  <div className="flex items-center border border-neutral-200 rounded-lg">
                    <button
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-10 h-10 flex items-center justify-center text-lg hover:bg-neutral-50 transition-colors"
                    >-</button>
                    <span className="flex-1 text-center text-sm font-medium">{guests}</span>
                    <button
                      onClick={() => setGuests(Math.min(10, guests + 1))}
                      className="w-10 h-10 flex items-center justify-center text-lg hover:bg-neutral-50 transition-colors"
                    >+</button>
                  </div>
                </div>
              </div>

              {nights > 0 && (
                <div className="space-y-3 mb-6 pt-4 border-t border-neutral-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">{formatPrice(property.price)} × {nights} nights</span>
                    <span className="text-primary-900">{formatPrice(property.price * nights)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Service fee</span>
                    <span className="text-primary-900">{formatPrice(Math.round(property.price * nights * 0.1))}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-3 border-t border-neutral-100">
                    <span>Total</span>
                    <span className="text-accent-600">{formatPrice(Math.round(property.price * nights * 1.1))}</span>
                  </div>
                </div>
              )}

              <Button
                className="w-full rounded-xl text-base h-12"
                onClick={handleBooking}
                disabled={bookingLoading || property.status !== 'available'}
              >
                {bookingLoading ? 'Booking...' : property.status !== 'available' ? 'Not Available' : 'Reserve Now'}
              </Button>

              <p className="text-center text-xs text-neutral-400 mt-3">You won't be charged yet</p>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-heading font-bold text-primary-900 mb-8">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similar.map((prop) => (
                <PropertyCard key={prop._id} property={prop} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => setCurrentImage((currentImage - 1 + property.images.length) % property.images.length)}
            className="absolute left-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <img
            src={property.images[currentImage]}
            alt={`${property.title} - ${currentImage + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain"
          />
          <button
            onClick={() => setCurrentImage((currentImage + 1) % property.images.length)}
            className="absolute right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
          <div className="absolute bottom-4 text-white text-sm">
            {currentImage + 1} / {property.images.length}
          </div>
        </div>
      )}
    </div>
  );
}
