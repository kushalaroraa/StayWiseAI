import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { BedDouble, Plus, Trash2, Calendar, ShieldCheck, X, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals visibility
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Form states - Room creation
  const [hotelId, setHotelId] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [type, setType] = useState('single');
  const [pricePerNight, setPricePerNight] = useState('');
  const [capacity, setCapacity] = useState('1');
  const [amenities, setAmenities] = useState('wifi, tv, AC');
  const [images, setImages] = useState('');

  // Form states - Dynamic pricing
  const [priceDate, setPriceDate] = useState('');
  const [overridePrice, setOverridePrice] = useState('');

  const fetchRoomsAndHotels = async () => {
    setLoading(true);
    try {
      const roomsRes = await api.get('/rooms');
      setRooms(roomsRes.data);

      const hotelsRes = await api.get('/hotels');
      setHotels(hotelsRes.data);
      if (hotelsRes.data.length > 0) {
        setHotelId(hotelsRes.data[0]._id);
      }
    } catch (err) {
      toast.error('Failed to load room details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomsAndHotels();
  }, []);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!roomNumber || !pricePerNight || !capacity) {
      toast.error('Complete all fields');
      return;
    }

    try {
      const payload = {
        hotelId,
        roomNumber,
        type,
        pricePerNight: Number(pricePerNight),
        capacity: Number(capacity),
        amenities: amenities.split(',').map(item => item.trim()),
        images: images ? [images] : ['https://images.unsplash.com/photo-1590490360182-c33d57733427']
      };

      await api.post('/rooms', payload);
      toast.success('Room added successfully!');
      
      // Reset form
      setRoomNumber('');
      setPricePerNight('');
      setAmenities('wifi, tv, AC');
      setImages('');
      setShowAddModal(false);
      
      fetchRoomsAndHotels();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create room');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to remove this room?')) return;
    try {
      await api.delete(`/rooms/${roomId}`);
      toast.success('Room removed successfully');
      fetchRoomsAndHotels();
    } catch (err) {
      toast.error('Failed to delete room');
    }
  };

  const openPricingModal = (room) => {
    setSelectedRoom(room);
    setShowPricingModal(true);
  };

  const handleDynamicPricingSubmit = async (e) => {
    e.preventDefault();
    if (!priceDate || !overridePrice) {
      toast.error('Specify date and override rate');
      return;
    }

    try {
      await api.post(`/rooms/${selectedRoom._id}/dynamic-pricing`, {
        date: priceDate,
        price: Number(overridePrice)
      });
      
      toast.success('Dynamic pricing override configured successfully!');
      
      // Reset
      setPriceDate('');
      setOverridePrice('');
      setShowPricingModal(false);
      fetchRoomsAndHotels();
    } catch (err) {
      toast.error('Failed to set pricing');
    }
  };

  if (loading) {
    return (
      <div className="h-64 rounded-2xl bg-slate-900 shimmer" />
    );
  }

  return (
    <div className="space-y-8 text-left">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Manage Rooms</h1>
          <p className="text-xs text-slate-400 mt-1">Configure room categories, pricing, and dynamic calendar tariffs.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="premium-btn text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center shadow-lg shadow-primary-500/10"
        >
          <Plus size={15} className="mr-1.5" /> Add New Room
        </button>
      </div>

      {/* Room table */}
      <div className="bg-slate-900/50 border border-slate-900 rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-500 uppercase text-[9px] font-bold tracking-widest border-b border-slate-850">
              <tr>
                <th className="p-4 rounded-l-xl">Room No</th>
                <th className="p-4">Hotel Property</th>
                <th className="p-4">Category</th>
                <th className="p-4">Capacity</th>
                <th className="p-4">Base Tariff</th>
                <th className="p-4">Overrides</th>
                <th className="p-4 rounded-r-xl text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {rooms.map((room) => (
                <tr key={room._id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="p-4 font-bold text-white uppercase flex items-center">
                    <BedDouble size={14} className="mr-2 text-primary-500" /> Room {room.roomNumber}
                  </td>
                  <td className="p-4">{room.hotelId?.name}</td>
                  <td className="p-4 uppercase">{room.type}</td>
                  <td className="p-4 font-semibold">{room.capacity} Guest{room.capacity > 1 ? 's' : ''}</td>
                  <td className="p-4 font-bold text-white">₹{room.pricePerNight} / night</td>
                  <td className="p-4">
                    <span className="text-[10px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded-md">
                      {room.dynamicPricing?.length || 0} active
                    </span>
                  </td>
                  <td className="p-4 flex gap-2 justify-center">
                    <button
                      onClick={() => openPricingModal(room)}
                      className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-primary-500 rounded-lg flex items-center gap-1 transition-colors"
                      title="Set Dynamic Price"
                    >
                      <Calendar size={12} /> Pricing
                    </button>
                    <button
                      onClick={() => handleDeleteRoom(room._id)}
                      className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                      title="Delete Room"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-md w-full text-slate-100 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Add New Inventory Room</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400"><X size={18} /></button>
            </div>

            <form onSubmit={handleAddRoom} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Hotel Property</label>
                <select
                  value={hotelId}
                  onChange={(e) => setHotelId(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-primary-500 cursor-pointer"
                >
                  {hotels.map((h) => (
                    <option key={h._id} value={h._id} className="dark:bg-slate-900">{h.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Room Number</label>
                  <input
                    type="text"
                    placeholder="104"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Category Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-primary-500 cursor-pointer"
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Base Price (INR)</label>
                  <input
                    type="number"
                    placeholder="4000"
                    value={pricePerNight}
                    onChange={(e) => setPricePerNight(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Capacity</label>
                  <select
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-primary-500 cursor-pointer"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1">Amenities (comma-separated)</label>
                <input
                  type="text"
                  value={amenities}
                  onChange={(e) => setAmenities(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1">Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo..."
                  value={images}
                  onChange={(e) => setImages(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <button
                type="submit"
                className="premium-btn w-full text-white text-xs font-semibold py-3 rounded-xl transition-all"
              >
                Create Room
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setShowPricingModal(false)} />
          <div className="relative bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-md w-full text-slate-100 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Configure Dynamic Pricing</h3>
              <button onClick={() => setShowPricingModal(false)} className="text-slate-400"><X size={18} /></button>
            </div>

            <div className="bg-primary-500/10 p-3 rounded-xl border border-primary-500/20 text-xs text-primary-400 flex items-center space-x-2">
              <DollarSign size={14} className="shrink-0" />
              <span>Configure pricing overrides for peak holidays or seasonal drop rates.</span>
            </div>

            <form onSubmit={handleDynamicPricingSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Target Date</label>
                <input
                  type="date"
                  value={priceDate}
                  onChange={(e) => setPriceDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Override Price Rate (INR)</label>
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  value={overridePrice}
                  onChange={(e) => setOverridePrice(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-primary-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="premium-btn w-full text-white text-xs font-semibold py-3 rounded-xl transition-all"
              >
                Apply Override Rate
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageRooms;
