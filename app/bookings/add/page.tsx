'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import { useTranslation } from '../../i18n/useTranslation';

export default function AddBooking() {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [timeFilter, setTimeFilter] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    phone: '',
    notes: '',
    adminNotes: '',
    status: '',
    paymentMethod: '',
    price: '',
    deposit: '',
    depositPercent: false,
    coupon: '',
    guestList: '',
    gifts: '',
    booker: '',
    emailLanguage: 'en',
    eventId: '',
  });

  const [languageToggles, setLanguageToggles] = useState({
    it: false,
    en: true,
    es: false,
    fr: false,
  });

  useEffect(() => {
    fetchEvents();
  }, [timeFilter]);

  const fetchEvents = async () => {
    try {
      const url = timeFilter 
        ? `/api/events?category=${encodeURIComponent(timeFilter)}`
        : '/api/events';
      const response = await fetch(url);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const calculateTotal = () => {
    const price = parseFloat(formData.price) || 0;
    return price;
  };

  const calculateToPay = () => {
    const total = calculateTotal();
    const deposit = parseFloat(formData.deposit) || 0;
    return total - deposit;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const total = calculateTotal();
      const toPay = calculateToPay();

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          total,
          toPay,
        }),
      });

      if (response.ok) {
        alert('Booking created successfully!');
        router.push('/bookings/list');
      } else {
        alert('Failed to create booking');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar t={t} />
      <div className="main-content">
        <h1 style={{ marginBottom: '30px' }}>Add Booking</h1>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            
            {/* Left Column */}
            <div className="card">
              <div className="filter-group">
                <label>Filter by Time</label>
                <select 
                  style={{ width: '100%' }}
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                >
                  <option value="">All Events</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="10:00 PM">10:00 PM</option>
                </select>
              </div>

              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label>Choose Event</label>
                <select 
                  style={{ width: '100%' }}
                  value={formData.eventId}
                  onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                  required
                >
                  <option value="">-- Choose Event --</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name} - {new Date(event.date).toLocaleDateString()} ({event.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label>Booking ID</label>
                <input type="text" value="Auto-generated" disabled style={{ width: '100%' }} />
              </div>

              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label>Choose Status</label>
                <select 
                  style={{ width: '100%' }}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="">-- Choose Status --</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Invited">Invited</option>
                </select>
              </div>

              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label>Choose Payment</label>
                <select 
                  style={{ width: '100%' }}
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                >
                  <option value="">-- Choose Payment --</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Transfer">Transfer</option>
                </select>
              </div>

              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label>Price €</label>
                <input 
                  type="number" 
                  step="0.01"
                  style={{ width: '100%' }}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label>Deposit €</label>
                <input 
                  type="number" 
                  step="0.01"
                  style={{ width: '100%' }}
                  value={formData.deposit}
                  onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                />
                <label style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox"
                    checked={formData.depositPercent}
                    onChange={(e) => setFormData({ ...formData, depositPercent: e.target.checked })}
                  />
                  Click to add price (€) instead of %
                </label>
              </div>

              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label>To Pay €</label>
                <input 
                  type="number" 
                  step="0.01"
                  style={{ width: '100%' }}
                  value={calculateToPay()}
                  disabled
                />
              </div>

              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label>Coupon</label>
                <input 
                  type="text" 
                  style={{ width: '100%' }}
                  value={formData.coupon}
                  onChange={(e) => setFormData({ ...formData, coupon: e.target.value })}
                />
                <button 
                  type="button" 
                  className="button button-primary" 
                  style={{ marginTop: '10px', width: '100%' }}
                >
                  Apply Coupon
                </button>
              </div>
            </div>

            {/* Middle Column */}
            <div className="card">
              <div className="filter-group">
                <label>Name *</label>
                <input 
                  type="text" 
                  style={{ width: '100%' }}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label>E-mail *</label>
                <input 
                  type="email" 
                  style={{ width: '100%' }}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label>Choose Country</label>
                <select 
                  style={{ width: '100%' }}
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                >
                  <option value="">-- Choose Country --</option>
                  <option value="Italy">Italy</option>
                  <option value="Spain">Spain</option>
                  <option value="France">France</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Germany">Germany</option>
                </select>
              </div>

              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label>Phone</label>
                <input 
                  type="tel" 
                  style={{ width: '100%' }}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label>Notes</label>
                <textarea 
                  style={{ width: '100%', minHeight: '80px', padding: '10px', backgroundColor: '#1a2540', border: '1px solid #2a3a52', borderRadius: '6px', color: '#fff' }}
                  placeholder="Write here notes of the customer, for example: Vegan client..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label>Admin Notes</label>
                <textarea 
                  style={{ width: '100%', minHeight: '80px', padding: '10px', backgroundColor: '#1a2540', border: '1px solid #2a3a52', borderRadius: '6px', color: '#fff' }}
                  placeholder="Write here notes for the admin..."
                  value={formData.adminNotes}
                  onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="card">
              <div className="filter-group">
                <label>Select Guest List</label>
                <select 
                  style={{ width: '100%' }}
                  value={formData.guestList}
                  onChange={(e) => setFormData({ ...formData, guestList: e.target.value })}
                >
                  <option value="">Select...</option>
                </select>
              </div>

              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label>Select Gifts</label>
                <select 
                  style={{ width: '100%' }}
                  value={formData.gifts}
                  onChange={(e) => setFormData({ ...formData, gifts: e.target.value })}
                >
                  <option value="">Select...</option>
                </select>
              </div>

              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label>Choose Booker</label>
                <select 
                  style={{ width: '100%' }}
                  value={formData.booker}
                  onChange={(e) => setFormData({ ...formData, booker: e.target.value })}
                >
                  <option value="">-- Choose Booker --</option>
                </select>
              </div>

              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label>Select language to send Emails / Sms</label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {Object.entries(languageToggles).map(([lang, active]) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setLanguageToggles({ it: false, en: false, es: false, fr: false, [lang]: true });
                        setFormData({ ...formData, emailLanguage: lang });
                      }}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '20px',
                        border: 'none',
                        backgroundColor: active ? '#4ecdc4' : '#2a3a52',
                        color: active ? '#0f1419' : '#fff',
                        cursor: 'pointer',
                        fontWeight: active ? 'bold' : 'normal',
                      }}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '30px', 
              width: '100%', 
              padding: '20px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: '#4ecdc4',
              color: '#0f1419',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Saving...' : 'Save Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}
