import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import {
  LayoutDashboard, Calendar, Heart, User, Settings, LogOut,
  Home, TrendingUp, Eye, Star, Plus, Edit, Trash2,
  ChevronRight, Bell, DollarSign, Building2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import useAuthStore from '@/store/authStore';
import { bookingsAPI, propertiesAPI, usersAPI } from '@/services/api';
import { formatPrice, formatDate } from '@/utils/helpers';
import toast from 'react-hot-toast';

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
  { icon: Calendar, label: 'Bookings', id: 'bookings' },
  { icon: Heart, label: 'Favorites', id: 'favorites' },
  { icon: User, label: 'Profile', id: 'profile' },
];

const AGENT_ITEMS = [
  { icon: Building2, label: 'My Properties', id: 'properties' },
  { icon: TrendingUp, label: 'Analytics', id: 'analytics' },
];

export default function Dashboard() {
  const { user, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  const contentRef = useRef(null);

  const isAgent = user?.role === 'agent' || user?.role === 'admin';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bookRes] = await Promise.allSettled([
          bookingsAPI.getAll(),
          isAgent ? propertiesAPI.getMyProperties() : Promise.resolve({ data: { properties: [] } }),
        ]);

        if (bookRes.status === 'fulfilled') setBookings(bookRes.value.data.bookings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAgent]);

  useEffect(() => {
    if (isAgent) {
      propertiesAPI.getMyProperties().then(res => {
        setProperties(res.data.properties || []);
      }).catch(() => {});
    }
  }, [isAgent]);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [activeTab]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await usersAPI.updateProfile(profileForm);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingsAPI.cancel(bookingId);
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
      toast.success('Booking cancelled');
    } catch (err) {
      toast.error('Failed to cancel booking');
    }
  };

  const sidebarItems = isAgent ? [...SIDEBAR_ITEMS, ...AGENT_ITEMS] : SIDEBAR_ITEMS;

  const statusColors = {
    pending: 'warning',
    confirmed: 'success',
    cancelled: 'error',
    completed: 'secondary',
  };

  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((acc, b) => acc + (b.totalPrice || 0), 0);

  return (
    <div className="page-transition pt-20 min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 sticky top-24">
              {/* User info */}
              <div className="text-center mb-6 pb-6 border-b border-neutral-100">
                <div className="w-16 h-16 rounded-full bg-accent-500 flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-2xl font-bold">{user?.name?.[0]?.toUpperCase()}</span>
                </div>
                <h3 className="font-heading font-semibold text-primary-900">{user?.name}</h3>
                <p className="text-sm text-neutral-500 capitalize">{user?.role}</p>
              </div>

              {/* Nav */}
              <nav className="space-y-1">
                {sidebarItems.map(({ icon: Icon, label, id }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      activeTab === id
                        ? 'bg-accent-500/10 text-accent-600'
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-error hover:bg-red-50 transition-colors mt-4"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main ref={contentRef} className="flex-1 min-w-0">
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-heading font-bold text-primary-900">
                  Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h2>

                {/* Stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: Calendar, label: 'Total Bookings', value: bookings.length, color: 'bg-blue-500' },
                    { icon: Home, label: 'Active', value: bookings.filter(b => b.status === 'confirmed').length, color: 'bg-green-500' },
                    { icon: DollarSign, label: 'Total Spent', value: formatPrice(totalRevenue), color: 'bg-accent-500' },
                    { icon: Star, label: 'Properties', value: isAgent ? properties.length : bookings.filter(b => b.status === 'completed').length, color: 'bg-purple-500' },
                  ].map(({ icon: Icon, label, value, color }, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <p className="text-2xl font-heading font-bold text-primary-900">{value}</p>
                      <p className="text-sm text-neutral-500">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent bookings */}
                <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm">
                  <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                    <h3 className="text-lg font-heading font-semibold text-primary-900">Recent Bookings</h3>
                    <button onClick={() => setActiveTab('bookings')} className="text-sm text-accent-500 hover:text-accent-600 flex items-center gap-1">
                      View All <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="divide-y divide-neutral-100">
                    {bookings.slice(0, 4).map((booking) => (
                      <div key={booking._id} className="p-4 flex items-center gap-4 hover:bg-neutral-50 transition-colors">
                        <img
                          src={booking.property?.mainImage || 'https://via.placeholder.com/80'}
                          alt={booking.property?.title}
                          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-primary-900 text-sm truncate">{booking.property?.title || 'Property'}</p>
                          <p className="text-xs text-neutral-500">
                            {formatDate(booking.checkIn)} — {formatDate(booking.checkOut)}
                          </p>
                        </div>
                        <Badge variant={statusColors[booking.status]}>{booking.status}</Badge>
                        <p className="font-semibold text-primary-900 text-sm">{formatPrice(booking.totalPrice)}</p>
                      </div>
                    ))}
                    {bookings.length === 0 && (
                      <div className="p-8 text-center">
                        <p className="text-neutral-500 text-sm">No bookings yet</p>
                        <Link to="/properties">
                          <Button size="sm" variant="outline" className="mt-3 rounded-lg">Browse Properties</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bookings */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-heading font-bold text-primary-900">My Bookings</h2>
                <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                  <div className="divide-y divide-neutral-100">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                        <img
                          src={booking.property?.mainImage || 'https://via.placeholder.com/100'}
                          alt={booking.property?.title}
                          className="w-24 h-20 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <Link
                            to={`/properties/${booking.property?._id}`}
                            className="font-heading font-semibold text-primary-900 hover:text-accent-500 transition-colors"
                          >
                            {booking.property?.title || 'Property'}
                          </Link>
                          <p className="text-sm text-neutral-500 mt-1">
                            {formatDate(booking.checkIn)} — {formatDate(booking.checkOut)} · {booking.guests} guests
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant={statusColors[booking.status]}>{booking.status}</Badge>
                            <span className="text-lg font-heading font-bold text-primary-900">{formatPrice(booking.totalPrice)}</span>
                          </div>
                        </div>
                        {booking.status === 'pending' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelBooking(booking._id)}
                            className="rounded-lg"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    ))}
                    {bookings.length === 0 && (
                      <div className="p-12 text-center">
                        <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                        <h3 className="font-heading font-semibold text-primary-900 mb-2">No Bookings Yet</h3>
                        <p className="text-neutral-500 text-sm mb-4">Start exploring properties and make your first booking.</p>
                        <Link to="/properties"><Button className="rounded-xl">Browse Properties</Button></Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Profile */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-heading font-bold text-primary-900">Profile Settings</h2>
                <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
                  <form onSubmit={handleProfileUpdate} className="space-y-5 max-w-lg">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
                      <input
                        type="email"
                        value={user?.email}
                        disabled
                        className="w-full h-11 px-4 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">Phone</label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full h-11 px-4 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">Bio</label>
                      <textarea
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        rows={4}
                        placeholder="Tell us about yourself..."
                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 transition-all resize-none"
                      />
                    </div>
                    <Button type="submit" className="rounded-xl">Save Changes</Button>
                  </form>
                </div>
              </div>
            )}

            {/* Favorites */}
            {activeTab === 'favorites' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-heading font-bold text-primary-900">Saved Properties</h2>
                <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-12 text-center">
                  <Heart className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <h3 className="font-heading font-semibold text-primary-900 mb-2">No Favorites Yet</h3>
                  <p className="text-neutral-500 text-sm mb-4">Save properties you love for quick access later.</p>
                  <Link to="/properties"><Button className="rounded-xl">Browse Properties</Button></Link>
                </div>
              </div>
            )}

            {/* Agent: My Properties */}
            {activeTab === 'properties' && isAgent && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-heading font-bold text-primary-900">My Properties</h2>
                  <Button className="rounded-xl">
                    <Plus className="w-4 h-4 mr-2" /> Add Property
                  </Button>
                </div>
                <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                  <div className="divide-y divide-neutral-100">
                    {properties.map((prop) => (
                      <div key={prop._id} className="p-5 flex items-center gap-4">
                        <img src={prop.mainImage} alt={prop.title} className="w-20 h-16 rounded-xl object-cover" />
                        <div className="flex-1">
                          <Link to={`/properties/${prop._id}`} className="font-heading font-semibold text-primary-900 hover:text-accent-500">
                            {prop.title}
                          </Link>
                          <p className="text-sm text-neutral-500">{prop.location?.city} · {formatPrice(prop.price)}/night</p>
                        </div>
                        <Badge variant={prop.status === 'available' ? 'success' : 'warning'}>{prop.status}</Badge>
                        <div className="flex items-center gap-1 text-neutral-400 text-sm">
                          <Eye className="w-4 h-4" /> {prop.views}
                        </div>
                      </div>
                    ))}
                    {properties.length === 0 && (
                      <div className="p-12 text-center">
                        <Building2 className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                        <h3 className="font-heading font-semibold text-primary-900 mb-2">No Properties</h3>
                        <p className="text-neutral-500 text-sm">Add your first property listing.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Agent: Analytics */}
            {activeTab === 'analytics' && isAgent && (
              <div className="space-y-6">
                <h2 className="text-2xl font-heading font-bold text-primary-900">Analytics Dashboard</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
                    <p className="text-sm text-neutral-500 mb-2">Total Properties</p>
                    <p className="text-3xl font-heading font-bold text-primary-900">{properties.length}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
                    <p className="text-sm text-neutral-500 mb-2">Total Views</p>
                    <p className="text-3xl font-heading font-bold text-primary-900">
                      {properties.reduce((acc, p) => acc + (p.views || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
                    <p className="text-sm text-neutral-500 mb-2">Avg Rating</p>
                    <p className="text-3xl font-heading font-bold text-primary-900">
                      {properties.length > 0 ? (properties.reduce((acc, p) => acc + (p.rating || 0), 0) / properties.length).toFixed(1) : '0'}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
                  <h3 className="font-heading font-semibold text-primary-900 mb-4">Performance Overview</h3>
                  <p className="text-neutral-500 text-sm">Chart analytics will be displayed here when you have more data.</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
