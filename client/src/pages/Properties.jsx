import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Search, SlidersHorizontal, Grid3X3, List, X, ChevronDown,
  MapPin, Home, Building2, Castle, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import PropertyCard from '@/components/property/PropertyCard';
import { propertiesAPI } from '@/services/api';
import { debounce } from '@/utils/helpers';

gsap.registerPlugin(ScrollTrigger);

const PROPERTY_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'condo', label: 'Condo' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'studio', label: 'Studio' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
];

const AMENITIES_LIST = [
  'Pool', 'Gym', 'Parking', 'Garden', 'Concierge', 'Smart Home',
  'Beach Access', 'Fireplace', 'Wine Cellar', 'Home Theater',
  'Pet Friendly', 'Laundry', 'Rooftop', 'Security',
];

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [sort, setSort] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const headerRef = useRef(null);
  const gridRef = useRef(null);

  // Fetch properties
  const fetchProperties = async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = {
        search: search || undefined,
        type: type || undefined,
        sort,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        bedrooms: bedrooms || undefined,
        amenities: selectedAmenities.length > 0 ? selectedAmenities.join(',') : undefined,
        page: params.page || 1,
        limit: 12,
        ...params,
      };

      // Remove undefined values
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === undefined) delete queryParams[key];
      });

      const { data } = await propertiesAPI.getAll(queryParams);
      setProperties(data.properties);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [type, sort, bedrooms]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, minPrice, maxPrice]);

  // Animation
  useEffect(() => {
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  useEffect(() => {
    if (!loading && properties.length > 0) {
      gsap.fromTo('.property-item',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08 }
      );
    }
  }, [loading, properties]);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setType('');
    setSort('newest');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setSelectedAmenities([]);
  };

  const hasActiveFilters = search || type || minPrice || maxPrice || bedrooms || selectedAmenities.length > 0;

  return (
    <div className="page-transition pt-24 pb-20 min-h-screen bg-neutral-50">
      {/* Header */}
      <div ref={headerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-accent-500 text-sm font-medium tracking-[0.2em] uppercase mb-2">Discover</p>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary-900">
              Browse Properties
            </h1>
            <p className="text-neutral-500 mt-2">
              {pagination.total || 0} properties available
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by name, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 transition-all"
              />
            </div>

            {/* Type */}
            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="appearance-none h-11 pl-4 pr-10 rounded-xl border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 transition-all cursor-pointer min-w-[150px]"
              >
                {PROPERTY_TYPES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none h-11 pl-4 pr-10 rounded-xl border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 transition-all cursor-pointer min-w-[170px]"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>

            {/* Filter toggle */}
            <Button
              variant={showFilters ? 'default' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-xl"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 w-5 h-5 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center">
                  !
                </span>
              )}
            </Button>

            {/* View Mode */}
            <div className="hidden md:flex items-center gap-1 bg-neutral-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                aria-label="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-neutral-100 space-y-4 animate-slide-down">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Min Price ($/night)</label>
                  <input
                    type="number"
                    placeholder="Min price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Max Price ($/night)</label>
                  <input
                    type="number"
                    placeholder="Max price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Bedrooms (min)</label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/30"
                  >
                    <option value="">Any</option>
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>{n}+</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-2 block">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES_LIST.map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
                        selectedAmenities.includes(amenity)
                          ? 'bg-accent-500 text-white border-accent-500'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:border-accent-500'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={clearFilters} className="rounded-lg">
                  <X className="w-3 h-3 mr-1" /> Clear All
                </Button>
                <Button size="sm" onClick={() => fetchProperties()} className="rounded-lg">
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Properties Grid */}
      <div ref={gridRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100">
                <div className="aspect-[4/3] skeleton" />
                <div className="p-5 space-y-3">
                  <div className="h-5 skeleton rounded w-3/4" />
                  <div className="h-4 skeleton rounded w-1/2" />
                  <div className="flex gap-4 mt-4">
                    <div className="h-4 skeleton rounded w-16" />
                    <div className="h-4 skeleton rounded w-16" />
                    <div className="h-4 skeleton rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <>
            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-4xl'}`}>
              {properties.map((property, i) => (
                <div key={property._id} className="property-item">
                  <PropertyCard property={property} index={i} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => fetchProperties({ page })}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-300 ${
                      pagination.page === page
                        ? 'bg-accent-500 text-white shadow-md'
                        : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-primary-900 mb-2">No Properties Found</h3>
            <p className="text-neutral-500 mb-6">Try adjusting your search criteria or browse all properties.</p>
            <Button onClick={clearFilters} variant="outline" className="rounded-xl">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
