'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/Sidebar';
import { useTranslation } from '../../../i18n/useTranslation';
import { Calendar, Wallet, User } from 'lucide-react';

export default function EditBooking() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    phone: '',
    notes: '',
    adminNotes: '',
    status: 'Pending',
    paymentMethod: '',
    price: '0',
    deposit: '0',
    total: '0',
    toPay: '0',
    eventName: '',
    eventDate: '',
    eventTime: '',
  });

  useEffect(() => {
    if (params.id) {
      fetchBooking();
    }
  }, [params.id]);

  const fetchBooking = async () => {
    try {
      const response = await fetch('/api/bookings');
      const allBookings = await response.json();
      const currentBooking = allBookings.find((b: any) => b.id === params.id);
      
      if (currentBooking) {
        setBooking(currentBooking);
        
        // Split name se presente
        const nameParts = currentBooking.name ? currentBooking.name.split(' ') : ['', ''];
        
        setFormData({
          firstName: currentBooking.firstName || nameParts[0] || '',
          lastName: currentBooking.lastName || nameParts.slice(1).join(' ') || '',
          email: currentBooking.email || '',
          country: currentBooking.country || '',
          phone: currentBooking.phone || '',
          notes: currentBooking.notes || '',
          adminNotes: currentBooking.adminNotes || '',
          status: currentBooking.status || 'Pending',
          paymentMethod: currentBooking.paymentMethod || '',
          price: currentBooking.price?.toString() || '0',
          deposit: currentBooking.deposit?.toString() || '0',
          total: currentBooking.total?.toString() || '0',
          toPay: currentBooking.toPay?.toString() || '0',
          eventName: currentBooking.eventName || '',
          eventDate: currentBooking.eventDate || '',
          eventTime: currentBooking.eventTime || '',
        });
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      alert('Errore nel caricamento della prenotazione');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user?.role !== 'SuperAdmin') {
      alert('Solo il SuperAdmin può modificare le prenotazioni');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/bookings/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name: `${formData.firstName} ${formData.lastName}`,
          price: parseFloat(formData.price),
          deposit: parseFloat(formData.deposit),
          total: parseFloat(formData.total),
          toPay: parseFloat(formData.toPay),
        }),
      });

      if (response.ok) {
        alert('✅ Prenotazione aggiornata con successo!');
        router.push('/bookings/list');
      } else {
        const error = await response.json();
        alert(`❌ ${error.error || "Errore nell'aggiornamento"}`);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Si è verificato un errore');
    } finally {
      setSaving(false);
    }
  };

  const handleDepositChange = (deposit: string) => {
    const depositValue = parseFloat(deposit) || 0;
    const totalValue = parseFloat(formData.total) || 0;
    const toPay = totalValue - depositValue;
    
    // Calcola automaticamente lo stato in base al pagamento (tranne se è già Cancelled)
    let newStatus = formData.status;
    if (formData.status !== 'Cancelled' && formData.status !== 'cancelled') {
      if (depositValue >= totalValue && totalValue > 0) {
        newStatus = 'Confirmed'; // Cliente ha pagato tutto
      } else if (depositValue > 0) {
        newStatus = 'Pending'; // Cliente ha lasciato un deposito
      }
    }
    
    setFormData(prev => ({
      ...prev,
      deposit: deposit,
      toPay: toPay.toFixed(2),
      status: newStatus,
    }));
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar t={t} />
        <div className="main-content">
          <p>Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="dashboard-container">
        <Sidebar t={t} />
        <div className="main-content">
          <p>Prenotazione non trovata</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar t={t} />
      <div className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700' }}>Modifica Prenotazione</h1>
          <button
            type="button"
            onClick={() => router.push('/bookings/list')}
            style={{
              padding: '10px 20px',
              background: 'rgba(100, 100, 100, 0.2)',
              border: '1px solid rgba(100, 100, 100, 0.5)',
              borderRadius: '8px',
              color: '#aaa',
              cursor: 'pointer',
            }}
          >
            ← Indietro
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* COLONNA 1: Dettagli Cliente */}
            <div className="card" style={{ 
              background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.95) 0%, rgba(15, 15, 18, 0.95) 100%)',
              border: '2px solid rgba(200, 150, 100, 0.2)',
              borderRadius: '16px',
              padding: '24px',
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '24px', 
                color: '#c89664',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <User size={20} color="#c89664" />
                Dettagli Cliente
              </h3>

              <div className="filter-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '8px', display: 'block' }}>
                  Nome *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                  }}
                />
              </div>

              <div className="filter-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '8px', display: 'block' }}>
                  Cognome *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                  }}
                />
              </div>

              <div className="filter-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '8px', display: 'block' }}>
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                  }}
                />
              </div>

              <div className="filter-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '8px', display: 'block' }}>
                  Telefono
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                  }}
                />
              </div>

              <div className="filter-group">
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '8px', display: 'block' }}>
                  Paese
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                  }}
                />
              </div>
            </div>

            {/* COLONNA 2: Dettagli Evento */}
            <div className="card" style={{ 
              background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.95) 0%, rgba(15, 15, 18, 0.95) 100%)',
              border: '2px solid rgba(200, 150, 100, 0.2)',
              borderRadius: '16px',
              padding: '24px',
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '24px', 
                color: '#c89664',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <Calendar size={20} color="#c89664" />
                Dettagli Evento
              </h3>

              <div className="filter-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '8px', display: 'block' }}>
                  Nome Evento
                </label>
                <input
                  type="text"
                  value={formData.eventName}
                  onChange={(e) => setFormData({...formData, eventName: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                  }}
                />
              </div>

              <div className="filter-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '8px', display: 'block' }}>
                  Data Evento
                </label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                  }}
                />
              </div>

              <div className="filter-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '8px', display: 'block' }}>
                  Orario Evento
                </label>
                <input
                  type="time"
                  value={formData.eventTime}
                  onChange={(e) => setFormData({...formData, eventTime: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                  }}
                />
              </div>

              <div className="filter-group">
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '8px', display: 'block' }}>
                  Note Cliente
                </label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>

            {/* COLONNA 3: Pagamento e Stato */}
            <div className="card" style={{ 
              background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.95) 0%, rgba(15, 15, 18, 0.95) 100%)',
              border: '2px solid rgba(200, 150, 100, 0.2)',
              borderRadius: '16px',
              padding: '24px',
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '24px', 
                color: '#c89664',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <Wallet size={20} color="#c89664" />
                Pagamento
              </h3>

              <div className="filter-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '8px', display: 'block' }}>
                  Prezzo (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => {
                    const price = parseFloat(e.target.value) || 0;
                    const deposit = parseFloat(formData.deposit) || 0;
                    setFormData({
                      ...formData, 
                      price: e.target.value,
                      total: price.toFixed(2),
                      toPay: (price - deposit).toFixed(2),
                    });
                  }}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                  }}
                />
              </div>

              <div className="filter-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '8px', display: 'block' }}>
                  Deposito (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.deposit}
                  onChange={(e) => handleDepositChange(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                  }}
                />
              </div>

              <div className="filter-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '8px', display: 'block' }}>
                  Totale (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.total}
                  readOnly
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#0f0f12', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#aaa',
                  }}
                />
              </div>

              <div className="filter-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '8px', display: 'block' }}>
                  Da Pagare (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.toPay}
                  readOnly
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#0f0f12', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#48c774',
                    fontWeight: 'bold',
                  }}
                />
              </div>

              <div className="filter-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '8px', display: 'block' }}>
                  Metodo Pagamento
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                  }}
                >
                  <option value="">Seleziona...</option>
                  <option value="Cash">Contanti</option>
                  <option value="Card">Carta</option>
                  <option value="Transfer">Bonifico</option>
                  <option value="POS">POS</option>
                </select>
              </div>

              <div className="filter-group">
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '8px', display: 'block' }}>
                  Stato
                </label>
                {user?.role === 'SuperAdmin' && (formData.status === 'Cancelled' || formData.status === 'cancelled') ? (
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    style={{ 
                      width: '100%', 
                      padding: '14px', 
                      backgroundColor: '#1a1a1e', 
                      border: '1.5px solid #2a3a52', 
                      borderRadius: '10px', 
                      color: '#fff',
                    }}
                  >
                    <option value="Pending">In Sospeso</option>
                    <option value="Confirmed">Confermato</option>
                    <option value="Cancelled">Cancellato</option>
                  </select>
                ) : (
                  <div style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: '#0f0f12',
                    border: `2px solid ${formData.status === 'Confirmed' || formData.status === 'confirmed' ? '#4ecdc4' : formData.status === 'Cancelled' || formData.status === 'cancelled' ? '#ff4757' : '#f4b860'}`,
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: formData.status === 'Confirmed' || formData.status === 'confirmed' ? '#4ecdc4' : formData.status === 'Cancelled' || formData.status === 'cancelled' ? '#ff4757' : '#f4b860',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {(formData.status === 'Confirmed' || formData.status === 'confirmed') ? '✅ Confermato' : 
                     (formData.status === 'Cancelled' || formData.status === 'cancelled') ? '❌ Cancellato' : 
                     '⏳ In Sospeso'}
                  </div>
                )}
                <p style={{ fontSize: '11px', color: '#666', marginTop: '8px', fontStyle: 'italic' }}>
                  {user?.role === 'SuperAdmin' && (formData.status === 'Cancelled' || formData.status === 'cancelled') 
                    ? 'Solo tu puoi modificare prenotazioni cancellate' 
                    : 'Lo stato si aggiorna automaticamente in base al pagamento'}
                </p>
              </div>

              <div className="filter-group" style={{ marginTop: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '8px', display: 'block' }}>
                  Note Admin
                </label>
                <textarea
                  rows={3}
                  value={formData.adminNotes}
                  onChange={(e) => setFormData({...formData, adminNotes: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Pulsanti Azione */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '30px' }}>
            <button
              type="button"
              onClick={() => router.push('/bookings/list')}
              style={{
                padding: '14px 28px',
                background: 'rgba(100, 100, 100, 0.2)',
                border: '1px solid rgba(100, 100, 100, 0.5)',
                borderRadius: '10px',
                color: '#aaa',
                cursor: 'pointer',
                fontSize: '15px',
              }}
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #c89664 0%, #d4a574 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#0a0a0a',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? 'Salvataggio...' : '💾 Salva Modifiche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
