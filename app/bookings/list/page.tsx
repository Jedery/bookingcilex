'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { useTranslation } from '../../i18n/useTranslation';
import { CheckCircle, XCircle, Edit2 } from 'lucide-react';

interface Booking {
  id: string;
  bookingId: string;
  name: string;
  email: string;
  status: string;
  total: number;
  toPay: number;
  createdAt: string;
  eventName?: string;
  event?: {
    name: string;
    category: string;
  };
}

export default function ListBookings() {
  const { user } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status') || 'all';
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Stati per i filtri di ricerca
  const [searchFilters, setSearchFilters] = useState({
    bookingId: '',
    event: '',
    name: '',
    email: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    // Applica tutti i filtri (status URL + ricerca)
    let filtered = bookings;

    // Filtro per status (da URL)
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => {
        const normalizedStatus = booking.status.toLowerCase();
        if (statusFilter === 'confirmed') {
          return normalizedStatus === 'confirmed' || normalizedStatus === 'confermato';
        } else if (statusFilter === 'pending') {
          return normalizedStatus === 'pending' || normalizedStatus === 'in sospeso' || normalizedStatus === 'sospeso';
        } else if (statusFilter === 'cancelled') {
          return normalizedStatus === 'cancelled' || normalizedStatus === 'cancellato' || normalizedStatus === 'annullato';
        }
        return false;
      });
    }

    // Filtri di ricerca
    if (searchFilters.bookingId) {
      filtered = filtered.filter(booking => 
        booking.bookingId.toLowerCase().includes(searchFilters.bookingId.toLowerCase())
      );
    }
    if (searchFilters.event) {
      filtered = filtered.filter(booking => 
        (booking.eventName?.toLowerCase().includes(searchFilters.event.toLowerCase()) ||
         booking.event?.name?.toLowerCase().includes(searchFilters.event.toLowerCase()))
      );
    }
    if (searchFilters.name) {
      filtered = filtered.filter(booking => 
        booking.name.toLowerCase().includes(searchFilters.name.toLowerCase())
      );
    }
    if (searchFilters.email) {
      filtered = filtered.filter(booking => 
        booking.email.toLowerCase().includes(searchFilters.email.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, statusFilter, searchFilters]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus === 'confirmed' || normalizedStatus === 'confermato') {
      return '#4ecdc4';
    } else if (normalizedStatus === 'pending' || normalizedStatus === 'in sospeso' || normalizedStatus === 'sospeso') {
      return '#f4b860';
    } else if (normalizedStatus === 'cancelled' || normalizedStatus === 'cancellato' || normalizedStatus === 'annullato') {
      return '#ff4757';
    } else if (normalizedStatus === 'invited' || normalizedStatus === 'invitato') {
      return '#48c774';
    } else {
      return '#999';
    }
  };

  const getStatusLabel = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus === 'confirmed') return 'Confermato';
    if (normalizedStatus === 'pending') return 'In Sospeso';
    if (normalizedStatus === 'cancelled') return 'Cancellato';
    if (normalizedStatus === 'invited') return 'Invitato';
    return status;
  };

  const handleConfirmBooking = async (bookingId: string) => {
    if (!user || user.role !== 'SuperAdmin') {
      alert('❌ Solo il SuperAdmin può confermare le prenotazioni');
      return;
    }

    if (!confirm('Confermare questa prenotazione? Il cliente ha saldato il totale?')) {
      return;
    }

    setUpdatingId(bookingId);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Confirmed',
          userId: user.id,
          userRole: user.role,
        }),
      });

      if (response.ok) {
        alert('✅ Prenotazione confermata con successo!');
        fetchBookings(); // Ricarica la lista
      } else {
        const error = await response.json();
        alert(`❌ ${error.error || 'Errore nella conferma'}`);
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert('❌ Si è verificato un errore');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!user || user.role !== 'SuperAdmin') {
      alert('❌ Solo il SuperAdmin può cancellare le prenotazioni');
      return;
    }

    if (!confirm('Cancellare questa prenotazione?')) {
      return;
    }

    setUpdatingId(bookingId);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Cancelled',
          userId: user.id,
          userRole: user.role,
        }),
      });

      if (response.ok) {
        alert('✅ Prenotazione cancellata');
        fetchBookings();
      } else {
        const error = await response.json();
        alert(`❌ ${error.error || 'Errore nella cancellazione'}`);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('❌ Si è verificato un errore');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar t={t} />
      <div className="main-content">
        <style jsx>{`
          .filters-container {
            display: grid;
          }

          .filter-toggle {
            display: none;
          }

          @media (max-width: 768px) {
            .filters-container {
              grid-template-columns: 1fr !important;
              gap: 10px !important;
              padding: 15px !important;
              display: ${showFilters ? 'grid' : 'none'};
            }
            
            .filter-toggle {
              display: block !important;
              margin-bottom: 15px;
            }
            
            .desktop-table {
              display: none !important;
            }
            
            .mobile-cards {
              display: block !important;
            }
          }
          
          @media (min-width: 769px) {
            .filter-toggle {
              display: none;
            }
            
            .filters-container {
              display: grid !important;
            }
            
            .desktop-table {
              display: table !important;
            }
            
            .mobile-cards {
              display: none !important;
            }
          }
        `}</style>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '700',
              letterSpacing: '-0.5px',
              color: '#fff',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              margin: 0,
            }}>
              {t('listBooking.title')}
            </h1>
            {statusFilter !== 'all' && (
              <p style={{ 
                fontSize: '14px', 
                color: '#888', 
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                Filtro attivo: 
                <span style={{ 
                  padding: '4px 12px', 
                  borderRadius: '12px',
                  background: statusFilter === 'confirmed' ? 'rgba(72, 199, 116, 0.2)' : 
                              statusFilter === 'pending' ? 'rgba(255, 193, 7, 0.2)' : 
                              'rgba(255, 71, 87, 0.2)',
                  color: statusFilter === 'confirmed' ? '#48c774' : 
                         statusFilter === 'pending' ? '#ffc107' : 
                         '#ff4757',
                  fontWeight: '600'
                }}>
                  {statusFilter === 'confirmed' ? 'Confermati' : 
                   statusFilter === 'pending' ? 'In Sospeso' : 
                   'Cancellati'}
                </span>
                <button
                  onClick={() => window.location.href = '/bookings/list?status=all'}
                  style={{
                    padding: '4px 12px',
                    background: 'rgba(200, 150, 100, 0.2)',
                    border: '1px solid rgba(200, 150, 100, 0.3)',
                    borderRadius: '12px',
                    color: '#c89664',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  ✕ Rimuovi filtro
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Toggle filtri per mobile */}
        <button
          className="filters-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          🔍 {showFilters ? 'Nascondi' : 'Mostra'} Filtri
        </button>

        {/* Barra di filtri ricerca */}
        <div 
          className="filters-container"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '15px',
            marginBottom: '25px',
            padding: '20px',
            background: 'rgba(20, 20, 20, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(200, 150, 100, 0.3)',
            borderRadius: '12px',
          }}
        >
          <div>
            <label style={{ fontSize: '12px', color: '#888', marginBottom: '6px', display: 'block', fontWeight: '600' }}>
              🔍 ID Prenotazione
            </label>
            <input
              type="text"
              placeholder="BK-1768..."
              value={searchFilters.bookingId}
              onChange={(e) => setSearchFilters({ ...searchFilters, bookingId: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'rgba(10, 10, 10, 0.6)',
                border: '1px solid rgba(200, 150, 100, 0.3)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#888', marginBottom: '6px', display: 'block', fontWeight: '600' }}>
              🎉 Evento
            </label>
            <input
              type="text"
              placeholder="Nome evento..."
              value={searchFilters.event}
              onChange={(e) => setSearchFilters({ ...searchFilters, event: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'rgba(10, 10, 10, 0.6)',
                border: '1px solid rgba(200, 150, 100, 0.3)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#888', marginBottom: '6px', display: 'block', fontWeight: '600' }}>
              👤 Nome Cliente
            </label>
            <input
              type="text"
              placeholder="Nome cognome..."
              value={searchFilters.name}
              onChange={(e) => setSearchFilters({ ...searchFilters, name: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'rgba(10, 10, 10, 0.6)',
                border: '1px solid rgba(200, 150, 100, 0.3)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#888', marginBottom: '6px', display: 'block', fontWeight: '600' }}>
              📧 Email
            </label>
            <input
              type="text"
              placeholder="email@example.com"
              value={searchFilters.email}
              onChange={(e) => setSearchFilters({ ...searchFilters, email: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'rgba(10, 10, 10, 0.6)',
                border: '1px solid rgba(200, 150, 100, 0.3)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {(searchFilters.bookingId || searchFilters.event || searchFilters.name || searchFilters.email) && (
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={() => setSearchFilters({ bookingId: '', event: '', name: '', email: '' })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(200, 150, 100, 0.2)',
                  border: '1px solid rgba(200, 150, 100, 0.4)',
                  borderRadius: '8px',
                  color: '#c89664',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(200, 150, 100, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(200, 150, 100, 0.2)';
                }}
              >
                ✕ Pulisci filtri
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <p>{t('listBooking.loading')}</p>
        ) : filteredBookings.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ fontSize: '18px', color: '#999' }}>
              {statusFilter === 'all' ? t('listBooking.noBookings') : 
               `Nessuna prenotazione ${statusFilter === 'confirmed' ? 'confermata' : 
                                      statusFilter === 'pending' ? 'in sospeso' : 
                                      'cancellata'} trovata`}
            </p>
            {statusFilter !== 'all' && (
              <button
                onClick={() => window.location.href = '/bookings/list?status=all'}
                className="button button-primary"
                style={{ marginTop: '20px' }}
              >
                Mostra tutte le prenotazioni
              </button>
            )}
            {statusFilter === 'all' && (
              <a 
                href="/bookings/add" 
                className="button button-primary"
                style={{ marginTop: '20px', display: 'inline-flex', textDecoration: 'none' }}
              >
                {t('listBooking.createFirst')}
              </a>
            )}
          </div>
        ) : (
          <>
            {/* Tabella Desktop */}
            <div className="card desktop-table">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #2a3a52' }}>
                  <th style={{ padding: '15px', textAlign: 'left' }}>{t('listBooking.bookingId')}</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>{t('listBooking.event')}</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>{t('listBooking.name')}</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>{t('listBooking.email')}</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>{t('listBooking.status')}</th>
                  <th style={{ padding: '15px', textAlign: 'right' }}>{t('listBooking.total')}</th>
                  <th style={{ padding: '15px', textAlign: 'right' }}>{t('listBooking.toPay')}</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>{t('listBooking.date')}</th>
                  {user?.role === 'SuperAdmin' && (
                    <th style={{ padding: '15px', textAlign: 'center' }}>Azioni</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr 
                    key={booking.id} 
                    style={{ borderBottom: '1px solid #2a3a52' }}
                  >
                    <td style={{ padding: '15px' }}>
                      <strong>{booking.bookingId}</strong>
                    </td>
                    <td style={{ padding: '15px' }}>
                      {booking.event ? (
                        <div>
                          <div>{booking.event.name}</div>
                          <div style={{ fontSize: '12px', color: '#999' }}>{booking.event.category}</div>
                        </div>
                      ) : booking.eventName ? (
                        <div>{booking.eventName}</div>
                      ) : (
                        <span style={{ color: '#999' }}>{t('listBooking.noEvent')}</span>
                      )}
                    </td>
                    <td style={{ padding: '15px' }}>{booking.name}</td>
                    <td style={{ padding: '15px' }}>{booking.email}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        padding: '6px 16px',
                        borderRadius: '20px',
                        backgroundColor: getStatusColor(booking.status),
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                        display: 'inline-block',
                        boxShadow: `0 2px 8px ${getStatusColor(booking.status)}40`,
                      }}>
                        {getStatusLabel(booking.status)}
                      </span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'right' }}>
                      €{booking.total.toFixed(2)}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'right' }}>
                      <strong>€{booking.toPay.toFixed(2)}</strong>
                    </td>
                    <td style={{ padding: '15px' }}>
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                    {user?.role === 'SuperAdmin' && (
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                          {(booking.status.toLowerCase() === 'pending' || booking.status === 'Pending') && (
                            <button
                              onClick={() => handleConfirmBooking(booking.id)}
                              disabled={updatingId === booking.id}
                              title="Conferma prenotazione"
                              style={{
                                padding: '8px',
                                background: 'rgba(78, 205, 196, 0.2)',
                                border: '1px solid rgba(78, 205, 196, 0.5)',
                                borderRadius: '6px',
                                color: '#4ecdc4',
                                cursor: updatingId === booking.id ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: updatingId === booking.id ? 0.5 : 1,
                                transition: 'all 0.3s ease',
                              }}
                              onMouseEnter={(e) => {
                                if (updatingId !== booking.id) {
                                  e.currentTarget.style.background = 'rgba(78, 205, 196, 0.3)';
                                  e.currentTarget.style.transform = 'scale(1.1)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(78, 205, 196, 0.2)';
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => window.location.href = `/bookings/edit/${booking.id}`}
                            title="Modifica prenotazione"
                            style={{
                              padding: '8px',
                              background: 'rgba(200, 150, 100, 0.2)',
                              border: '1px solid rgba(200, 150, 100, 0.5)',
                              borderRadius: '6px',
                              color: '#c89664',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(200, 150, 100, 0.3)';
                              e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(200, 150, 100, 0.2)';
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            <Edit2 size={16} />
                          </button>
                          {booking.status.toLowerCase() !== 'cancelled' && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              disabled={updatingId === booking.id}
                              title="Annulla prenotazione"
                              style={{
                                padding: '8px',
                                background: 'rgba(255, 71, 87, 0.2)',
                                border: '1px solid rgba(255, 71, 87, 0.5)',
                                borderRadius: '6px',
                                color: '#ff4757',
                                cursor: updatingId === booking.id ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: updatingId === booking.id ? 0.5 : 1,
                                transition: 'all 0.3s ease',
                              }}
                              onMouseEnter={(e) => {
                                if (updatingId !== booking.id) {
                                  e.currentTarget.style.background = 'rgba(255, 71, 87, 0.3)';
                                  e.currentTarget.style.transform = 'scale(1.1)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 71, 87, 0.2)';
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                            >
                              <XCircle size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card Mobile */}
          <div className="mobile-cards" style={{ display: 'none' }}>
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                style={{
                  background: 'rgba(20, 20, 20, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(200, 150, 100, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '12px',
                }}
              >
                {/* Header con ID e Stato */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#c89664' }}>
                    {booking.bookingId}
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    backgroundColor: getStatusColor(booking.status),
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: '600',
                  }}>
                    {getStatusLabel(booking.status)}
                  </span>
                </div>

                {/* Evento */}
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '3px' }}>🎉 Evento</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>
                    {booking.event?.name || booking.eventName || 'N/A'}
                  </div>
                </div>

                {/* Nome e Email */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#888', marginBottom: '3px' }}>👤 Cliente</div>
                    <div style={{ fontSize: '13px', color: '#fff' }}>{booking.name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#888', marginBottom: '3px' }}>📧 Email</div>
                    <div style={{ fontSize: '12px', color: '#fff', wordBreak: 'break-all' }}>{booking.email}</div>
                  </div>
                </div>

                {/* Prezzi */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px', padding: '10px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#888', marginBottom: '2px' }}>Totale</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#10b981' }}>€{booking.total.toFixed(2)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#888', marginBottom: '2px' }}>Da Pagare</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#ef4444' }}>€{booking.toPay.toFixed(2)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#888', marginBottom: '2px' }}>Data</div>
                    <div style={{ fontSize: '11px', color: '#fff' }}>{new Date(booking.createdAt).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit' })}</div>
                  </div>
                </div>

                {/* Azioni */}
                {user?.role === 'SuperAdmin' && (
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    {(booking.status.toLowerCase() === 'pending' || booking.status === 'Pending') && (
                      <button
                        onClick={() => handleConfirmBooking(booking.id)}
                        disabled={updatingId === booking.id}
                        style={{
                          flex: 1,
                          padding: '10px',
                          background: 'rgba(78, 205, 196, 0.2)',
                          border: '1px solid rgba(78, 205, 196, 0.5)',
                          borderRadius: '8px',
                          color: '#4ecdc4',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: updatingId === booking.id ? 'not-allowed' : 'pointer',
                          opacity: updatingId === booking.id ? 0.5 : 1,
                        }}
                      >
                        ✓ Conferma
                      </button>
                    )}
                    <button
                      onClick={() => window.location.href = `/bookings/edit/${booking.id}`}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: 'rgba(200, 150, 100, 0.2)',
                        border: '1px solid rgba(200, 150, 100, 0.5)',
                        borderRadius: '8px',
                        color: '#c89664',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      ✎ Modifica
                    </button>
                    {booking.status.toLowerCase() !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={updatingId === booking.id}
                        style={{
                          flex: 1,
                          padding: '10px',
                          background: 'rgba(255, 71, 87, 0.2)',
                          border: '1px solid rgba(255, 71, 87, 0.5)',
                          borderRadius: '8px',
                          color: '#ff4757',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: updatingId === booking.id ? 'not-allowed' : 'pointer',
                          opacity: updatingId === booking.id ? 0.5 : 1,
                        }}
                      >
                        ✕ Annulla
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
        )}
      </div>
    </div>
  );
}
