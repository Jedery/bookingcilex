'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useTranslation } from '../../i18n/useTranslation';

// Eventi disponibili con prezzi
const EVENTS_DATA = [
  { id: 1, name: 'Open Bar', basePrice: 50, category: 'Nightlife' },
  { id: 2, name: 'Boat Party', basePrice: 80, category: 'Events' },
  { id: 3, name: 'Escursione a Formentera', basePrice: 120, category: 'Excursions' },
  { id: 4, name: 'Cena Spettacolo', basePrice: 90, category: 'Dining' },
  { id: 5, name: 'Beach Club Day', basePrice: 60, category: 'Beach' },
  { id: 6, name: 'VIP Table Service', basePrice: 200, category: 'VIP' },
  { id: 7, name: 'Sunset Catamaran', basePrice: 150, category: 'Excursions' },
  { id: 8, name: 'Club Entry + Drinks', basePrice: 40, category: 'Nightlife' },
];

export default function AddBooking() {
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  
  // Stati aggiuntivi per le nuove funzionalità
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [createdBy, setCreatedBy] = useState({
    role: 'superadmin',
    name: 'Ignazio Ibiza',
    timestamp: new Date().toISOString(),
  });
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    phone: '',
    notes: '',
    adminNotes: '',
    status: 'pending',
    paymentMethod: '',
    price: '',
    discount: 0,
    tax: 0,
    total: 0,
    deposit: '',
    depositPercent: false,
    toPay: 0,
    guestListAccess: '',
    emailLanguage: 'it',
    eventId: '',
    eventName: '',
    eventDate: '',
    eventTime: '',
  });

  const [languageToggles, setLanguageToggles] = useState({
    it: true,
    en: false,
    es: false,
    fr: false,
  });

  useEffect(() => {
    // Genera ID booking automatico
    generateBookingId();
    fetchEvents();
  }, []);

  useEffect(() => {
    // Calcola prezzo automaticamente quando cambia evento, data o orario
    if (selectedEvent && selectedDate && selectedTime) {
      calculateAutomaticPrice();
    }
  }, [selectedEvent, selectedDate, selectedTime]);

  const generateBookingId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const id = `BK-${timestamp}-${random}`;
    setBookingId(id);
  };

  const fetchEvents = async () => {
    try {
      setEvents(EVENTS_DATA);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const calculateAutomaticPrice = () => {
    if (!selectedEvent) return;
    
    let price = selectedEvent.basePrice;
    
    // Modifica prezzo in base a data (weekend +20%)
    if (selectedDate) {
      const date = new Date(selectedDate);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 5 || dayOfWeek === 6) { // Venerdì o Sabato
        price = price * 1.2;
      }
    }
    
    // Modifica prezzo in base a orario (sera +15%)
    if (selectedTime) {
      const hour = parseInt(selectedTime.split(':')[0]);
      if (hour >= 20 || hour <= 4) { // Dalle 20:00 alle 04:00
        price = price * 1.15;
      }
    }
    
    const tax = price * 0.1; // 10% tasse
    const total = price + tax;
    
    setFormData(prev => ({
      ...prev,
      price: price.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      toPay: total.toFixed(2),
    }));
  };

  const handleEventChange = (eventId: string) => {
    const event = EVENTS_DATA.find(e => e.id.toString() === eventId);
    setSelectedEvent(event);
    setFormData(prev => ({
      ...prev,
      eventId: eventId,
      eventName: event?.name || '',
    }));
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, eventDate: date }));
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    setFormData(prev => ({ ...prev, eventTime: time }));
  };

  const handleDepositChange = (deposit: string) => {
    const depositValue = parseFloat(deposit) || 0;
    const totalValue = parseFloat(formData.total) || 0;
    const toPay = totalValue - depositValue;
    
    setFormData(prev => ({
      ...prev,
      deposit: deposit,
      toPay: toPay.toFixed(2),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingData = {
        bookingId: bookingId,
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`,
        soldBy: createdBy.role,
        soldByName: createdBy.name,
        createdAt: createdBy.timestamp,
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        alert('✅ Prenotazione creata con successo!');
        router.push('/bookings/list');
      } else {
        alert('❌ Errore nella creazione della prenotazione');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Si è verificato un errore');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar t={t} />
      <div className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700' }}>Aggiungi Prenotazione</h1>
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* ========== COLONNA 1: EVENTO E DATA ========== */}
            <div className="card" style={{ 
              background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.95) 0%, rgba(15, 15, 18, 0.95) 100%)',
              border: '2px solid rgba(200, 150, 100, 0.2)',
              borderRadius: '16px',
              padding: '24px',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#c89664' }}>
                📅 Dettagli Evento
              </h3>

              {/* Scegli Evento */}
              <div className="filter-group">
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
                  Scegli Evento *
                </label>
                <select 
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                    fontSize: '15px',
                  }}
                  value={formData.eventId}
                  onChange={(e) => handleEventChange(e.target.value)}
                  required
                >
                  <option value="">-- Seleziona Evento --</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name} - €{event.basePrice} ({event.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Data */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
                  Data *
                </label>
                <input 
                  type="date" 
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                    fontSize: '15px',
                  }}
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  required
                />
              </div>

              {/* Orario */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
                  Orario *
                </label>
                <input 
                  type="time" 
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                    fontSize: '15px',
                  }}
                  value={selectedTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  required
                />
              </div>

              {/* ID Prenotazione */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
                  ID Prenotazione
                </label>
                <input 
                  type="text" 
                  value={bookingId}
                  disabled 
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#0f1419', 
                    border: '1.5px solid #4ecdc4', 
                    borderRadius: '10px', 
                    color: '#4ecdc4',
                    fontSize: '15px',
                    fontWeight: '600',
                  }} 
                />
              </div>

              {/* Stato */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
                  Stato *
                </label>
                <select 
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                    fontSize: '15px',
                  }}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="pending">⏳ In Sospeso</option>
                  <option value="confirmed">✅ Confermato</option>
                  <option value="cancelled">❌ Cancellato</option>
                </select>
              </div>

              {/* Metodo Pagamento */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
                  Metodo di Pagamento *
                </label>
                <select 
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                    fontSize: '15px',
                  }}
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  required
                >
                  <option value="">-- Seleziona Metodo --</option>
                  <option value="cash">💵 Contanti</option>
                  <option value="card">💳 Carta</option>
                  <option value="pos">📱 POS</option>
                  <option value="transfer">🏦 Bonifico</option>
                </select>
              </div>
            </div>

            {/* ========== COLONNA 2: PREZZI E PAGAMENTI ========== */}
            <div className="card" style={{ 
              background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.95) 0%, rgba(15, 15, 18, 0.95) 100%)',
              border: '2px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '16px',
              padding: '24px',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#10b981' }}>
                💰 Dettagli Pagamento
              </h3>

              {/* Prezzo Base */}
              <div className="filter-group">
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
                  Prezzo Base €
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  disabled
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#0f1419', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#10b981',
                    fontSize: '18px',
                    fontWeight: '700',
                  }}
                  value={formData.price}
                />
              </div>

              {/* Tasse */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
                  Tasse (10%) €
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  disabled
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#0f1419', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#888',
                    fontSize: '15px',
                  }}
                  value={formData.tax}
                />
              </div>

              {/* Totale */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
                  Totale €
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  disabled
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#0f1419', 
                    border: '2px solid #10b981', 
                    borderRadius: '10px', 
                    color: '#10b981',
                    fontSize: '24px',
                    fontWeight: '700',
                  }}
                  value={formData.total}
                />
              </div>

              {/* Acconto */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
                  Acconto Pagato €
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                    fontSize: '15px',
                  }}
                  value={formData.deposit}
                  onChange={(e) => handleDepositChange(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              {/* Da Saldare */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
                  Da Saldare €
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  disabled
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#0f1419', 
                    border: '2px solid #ef4444', 
                    borderRadius: '10px', 
                    color: '#ef4444',
                    fontSize: '20px',
                    fontWeight: '700',
                  }}
                  value={formData.toPay}
                />
              </div>

              {/* Info Box */}
              <div style={{
                marginTop: '20px',
                padding: '16px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '10px',
              }}>
                <p style={{ fontSize: '12px', color: '#10b981', lineHeight: '1.6', margin: 0 }}>
                  ℹ️ Il prezzo viene calcolato automaticamente in base a:<br/>
                  • Evento selezionato<br/>
                  • Data (weekend +20%)<br/>
                  • Orario (sera +15%)
                </p>
              </div>
            </div>

            {/* ========== COLONNA 3: DATI CLIENTE ========== */}
            <div className="card" style={{ 
              background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.95) 0%, rgba(15, 15, 18, 0.95) 100%)',
              border: '2px solid rgba(78, 205, 196, 0.2)',
              borderRadius: '16px',
              padding: '24px',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#4ecdc4' }}>
                👤 Dati Cliente
              </h3>

              {/* Nome */}
              <div className="filter-group">
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
                  Nome *
                </label>
                <input 
                  type="text" 
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                    fontSize: '15px',
                  }}
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  placeholder="Mario"
                />
              </div>

              {/* Cognome */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
                  Cognome *
                </label>
                <input 
                  type="text" 
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                    fontSize: '15px',
                  }}
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  placeholder="Rossi"
                />
              </div>

              {/* Email */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
                  Email *
                </label>
                <input 
                  type="email" 
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                    fontSize: '15px',
                  }}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="mario.rossi@email.com"
                />
              </div>

              {/* Telefono */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
                  Telefono *
                </label>
                <input 
                  type="tel" 
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                    fontSize: '15px',
                  }}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  placeholder="+39 123 456 7890"
                />
              </div>

              {/* Paese */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
                  Paese
                </label>
                <select 
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                    fontSize: '15px',
                  }}
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                >
                  <option value="">-- Seleziona Paese --</option>
                  <option value="Italy">🇮🇹 Italia</option>
                  <option value="Spain">🇪🇸 Spagna</option>
                  <option value="France">🇫🇷 Francia</option>
                  <option value="UK">🇬🇧 Regno Unito</option>
                  <option value="Germany">🇩🇪 Germania</option>
                  <option value="USA">🇺🇸 Stati Uniti</option>
                  <option value="Other">🌍 Altro</option>
                </select>
              </div>

              {/* Note Cliente */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
                  Note Cliente
                </label>
                <textarea 
                  style={{ 
                    width: '100%', 
                    minHeight: '80px', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                    fontSize: '14px',
                    resize: 'vertical',
                  }}
                  placeholder="Scrivi qui le note del cliente, ad esempio: Cliente vegano..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              {/* Note Admin */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
                  Note Admin
                </label>
                <textarea 
                  style={{ 
                    width: '100%', 
                    minHeight: '80px', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #c89664', 
                    borderRadius: '10px', 
                    color: '#fff',
                    fontSize: '14px',
                    resize: 'vertical',
                  }}
                  placeholder="Scrivi qui note per l'amministratore..."
                  value={formData.adminNotes}
                  onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* ========== SEZIONE AGGIUNTIVA: GUEST LIST E LINGUA ========== */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginTop: '24px' }}>
            
            {/* Guest List */}
            <div className="card" style={{ 
              background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.95) 0%, rgba(15, 15, 18, 0.95) 100%)',
              border: '2px solid rgba(147, 51, 234, 0.2)',
              borderRadius: '16px',
              padding: '24px',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#9333ea' }}>
                🎫 Accesso Liste Eventi
              </h3>
              <select 
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  backgroundColor: '#1a1a1e', 
                  border: '1.5px solid #2a3a52', 
                  borderRadius: '10px', 
                  color: '#fff',
                  fontSize: '15px',
                }}
                value={formData.guestListAccess}
                onChange={(e) => setFormData({ ...formData, guestListAccess: e.target.value })}
              >
                <option value="">-- Seleziona Accesso --</option>
                <option value="vip">⭐ VIP List</option>
                <option value="standard">🎉 Standard List</option>
                <option value="guest">👥 Guest +1</option>
                <option value="none">❌ Nessun Accesso</option>
              </select>
            </div>

            {/* Lingua Email */}
            <div className="card" style={{ 
              background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.95) 0%, rgba(15, 15, 18, 0.95) 100%)',
              border: '2px solid rgba(78, 205, 196, 0.2)',
              borderRadius: '16px',
              padding: '24px',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#4ecdc4' }}>
                🌍 Seleziona Lingua per Inviare Email / SMS
              </h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {Object.entries(languageToggles).map(([lang, active]) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      setLanguageToggles({ it: false, en: false, es: false, fr: false, [lang]: true });
                      setFormData({ ...formData, emailLanguage: lang });
                    }}
                    style={{
                      padding: '14px 28px',
                      borderRadius: '12px',
                      border: active ? '2px solid #4ecdc4' : '1.5px solid #2a3a52',
                      backgroundColor: active ? '#4ecdc4' : '#1a1a1e',
                      color: active ? '#0f1419' : '#fff',
                      cursor: 'pointer',
                      fontWeight: active ? '700' : '500',
                      fontSize: '15px',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Chi ha creato */}
            <div className="card" style={{ 
              background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.95) 0%, rgba(15, 15, 18, 0.95) 100%)',
              border: '2px solid rgba(200, 150, 100, 0.2)',
              borderRadius: '16px',
              padding: '24px',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#c89664' }}>
                👨‍💼 Creato Da
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '4px' }}>Ruolo</label>
                  <input 
                    type="text" 
                    disabled 
                    value={createdBy.role.toUpperCase()}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      backgroundColor: '#0f1419', 
                      border: '1px solid #c89664', 
                      borderRadius: '8px', 
                      color: '#c89664',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '4px' }}>Nome</label>
                  <input 
                    type="text" 
                    disabled 
                    value={createdBy.name}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      backgroundColor: '#0f1419', 
                      border: '1px solid #2a3a52', 
                      borderRadius: '8px', 
                      color: '#fff',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '4px' }}>Data e Ora</label>
                  <input 
                    type="text" 
                    disabled 
                    value={new Date(createdBy.timestamp).toLocaleString('it-IT')}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      backgroundColor: '#0f1419', 
                      border: '1px solid #2a3a52', 
                      borderRadius: '8px', 
                      color: '#888',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ========== PULSANTE SALVA ========== */}
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '32px', 
              width: '100%', 
              padding: '20px',
              fontSize: '18px',
              fontWeight: '700',
              background: loading 
                ? 'linear-gradient(135deg, #555 0%, #333 100%)'
                : 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
              color: '#0f1419',
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.3s ease',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(78, 205, 196, 0.3)',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(78, 205, 196, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(78, 205, 196, 0.3)';
              }
            }}
          >
            {loading ? '⏳ Salvataggio in corso...' : '✅ Salva Prenotazione'}
          </button>
        </form>
      </div>
    </div>
  );
}
