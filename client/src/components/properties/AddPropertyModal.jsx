import { useState } from 'react';
import { X, Building } from 'lucide-react';
import { Button } from '../ui/Button';
import { propertiesAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AddPropertyModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'apartment',
    price: '',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
    features: {
      bedrooms: 1,
      bathrooms: 1,
      area: 100,
    },
    mainImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await propertiesAPI.create({
        ...formData,
        price: Number(formData.price),
      });
      toast.success('Property added successfully!');
      onSuccess(data.property);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-heading font-bold text-primary-900 flex items-center gap-2">
            <Building className="w-5 h-5" /> Add New Property
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Title</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-accent-500/30 outline-none"
                placeholder="Luxury Villa in Beverly Hills"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Property Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-accent-500/30 outline-none bg-white"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="condo">Condo</option>
                <option value="penthouse">Penthouse</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Price (per night)</label>
              <input
                required
                type="number"
                min="0"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-accent-500/30 outline-none"
                placeholder="250"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Image URL</label>
              <input
                type="text"
                value={formData.mainImage}
                onChange={e => setFormData({ ...formData, mainImage: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-accent-500/30 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-4 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-accent-500/30 outline-none min-h-[100px]"
              placeholder="Describe the property..."
            />
          </div>

          <div className="border-t border-neutral-100 pt-6">
            <h3 className="font-heading font-semibold text-primary-900 mb-4">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                required
                type="text"
                placeholder="Street Address"
                value={formData.location.address}
                onChange={e => setFormData({ ...formData, location: { ...formData.location, address: e.target.value } })}
                className="w-full h-11 px-4 rounded-xl border border-neutral-300 text-sm"
              />
              <input
                required
                type="text"
                placeholder="City"
                value={formData.location.city}
                onChange={e => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })}
                className="w-full h-11 px-4 rounded-xl border border-neutral-300 text-sm"
              />
              <input
                required
                type="text"
                placeholder="State"
                value={formData.location.state}
                onChange={e => setFormData({ ...formData, location: { ...formData.location, state: e.target.value } })}
                className="w-full h-11 px-4 rounded-xl border border-neutral-300 text-sm"
              />
              <input
                type="text"
                placeholder="Zip Code"
                value={formData.location.zipCode}
                onChange={e => setFormData({ ...formData, location: { ...formData.location, zipCode: e.target.value } })}
                className="w-full h-11 px-4 rounded-xl border border-neutral-300 text-sm"
              />
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-6">
            <h3 className="font-heading font-semibold text-primary-900 mb-4">Features</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Bedrooms</label>
                <input
                  type="number"
                  min="0"
                  value={formData.features.bedrooms}
                  onChange={e => setFormData({ ...formData, features: { ...formData.features, bedrooms: Number(e.target.value) } })}
                  className="w-full h-11 px-4 rounded-xl border border-neutral-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Bathrooms</label>
                <input
                  type="number"
                  min="0"
                  value={formData.features.bathrooms}
                  onChange={e => setFormData({ ...formData, features: { ...formData.features, bathrooms: Number(e.target.value) } })}
                  className="w-full h-11 px-4 rounded-xl border border-neutral-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Area (sq ft)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.features.area}
                  onChange={e => setFormData({ ...formData, features: { ...formData.features, area: Number(e.target.value) } })}
                  className="w-full h-11 px-4 rounded-xl border border-neutral-300 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-neutral-100">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl">Cancel</Button>
            <Button type="submit" disabled={loading} className="rounded-xl">
              {loading ? 'Adding...' : 'Add Property'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
