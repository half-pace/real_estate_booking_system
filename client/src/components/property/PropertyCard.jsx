import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { MapPin, Bed, Bath, Maximize, Heart, Star, Eye } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { formatPrice } from '@/utils/helpers';

export default function PropertyCard({ property, index = 0, onFavorite }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 1000,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const typeLabels = {
    apartment: 'Apartment',
    house: 'House',
    villa: 'Villa',
    condo: 'Condo',
    penthouse: 'Penthouse',
    studio: 'Studio',
  };

  return (
    <div
      ref={cardRef}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-500 border border-neutral-100"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={property.mainImage}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className="bg-accent-500 text-white border-none shadow-lg">
            {typeLabels[property.type] || property.type}
          </Badge>
          {property.featured && (
            <Badge className="bg-white text-primary-900 border-none shadow-lg">
              Featured
            </Badge>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onFavorite?.(property._id);
          }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Add to favorites"
        >
          <Heart className="w-5 h-5 text-primary-800 hover:text-error transition-colors" />
        </button>

        {/* Price overlay on hover */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <div>
            <p className="text-white/80 text-xs mb-0.5">Starting from</p>
            <p className="text-white text-2xl font-heading font-bold">
              {formatPrice(property.price)}
              <span className="text-sm font-body font-normal text-white/70">/night</span>
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
            <Star className="w-4 h-4 text-accent-400 fill-accent-400" />
            <span className="text-white text-sm font-medium">{property.rating}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <Link to={`/properties/${property._id}`} className="block p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-heading font-semibold text-primary-900 group-hover:text-accent-600 transition-colors line-clamp-1">
            {property.title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-neutral-500 mb-4">
          <MapPin className="w-4 h-4 text-accent-500 flex-shrink-0" />
          <span className="text-sm truncate">
            {property.location?.city}, {property.location?.state}
          </span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 py-3 border-t border-neutral-100">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-neutral-400" />
            <span className="text-sm text-neutral-600">{property.features?.bedrooms || 0} Beds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-neutral-400" />
            <span className="text-sm text-neutral-600">{property.features?.bathrooms || 0} Baths</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize className="w-4 h-4 text-neutral-400" />
            <span className="text-sm text-neutral-600">{property.features?.area?.toLocaleString() || 0} ft²</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <p className="text-xl font-heading font-bold text-primary-900">
            {formatPrice(property.price)}
            <span className="text-sm font-body font-normal text-neutral-500">/night</span>
          </p>
          <div className="flex items-center gap-1 text-neutral-400">
            <Eye className="w-4 h-4" />
            <span className="text-xs">{property.views}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
