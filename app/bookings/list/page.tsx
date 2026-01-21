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
  soldByName?: string;
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
  }, [user]);

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
      
      // Se l'utente è un Promoter, mostra solo i suoi booking
      if (user?.role === 'Promoter') {
        const myBookings = data.filter((b: Booking) => b.soldByName === user.name);
        setBookings(myBookings);
      } else {
        setBookings(data);
      }
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
      alert('Solo il SuperAdmin può confermare le prenotazioni');
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
      alert('Si è verificato un errore');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!user || user.role !== 'SuperAdmin') {
      alert('Solo il SuperAdmin può cancellare le prenotazioni');
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
      alert('Si è verificato un errore');
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
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          marginBottom: '32px',
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(30, 30, 35, 0.6), rgba(20, 20, 25, 0.6))',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                width: '8px',
                height: '36px',
                background: 'linear-gradient(180deg, #3b82f6, #1d4ed8)',
                borderRadius: '4px',
              }}></div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '600',
                margin: 0,
                letterSpacing: '-0.5px',
                color: '#f1f5f9',
              }}>
                {t('listBooking.title')}
              </h1>
            </div>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginLeft: '20px', fontWeight: '400', marginTop: '4px' }}>
              {t('listBooking.subtitle')}
            </p>
            {statusFilter !== 'all' && (
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '12px',
                marginLeft: '20px',
              }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>{t('listBooking.activeFilter')}:</span>
                <span style={{ 
                  padding: '6px 14px', 
                  borderRadius: '6px',
                  background: statusFilter === 'confirmed' ? 'rgba(34, 197, 94, 0.15)' : 
                              statusFilter === 'pending' ? 'rgba(59, 130, 246, 0.15)' : 
                              'rgba(239, 68, 68, 0.15)',
                  border: statusFilter === 'confirmed' ? '1px solid rgba(34, 197, 94, 0.3)' : 
                          statusFilter === 'pending' ? '1px solid rgba(59, 130, 246, 0.3)' : 
                          '1px solid rgba(239, 68, 68, 0.3)',
                  color: statusFilter === 'confirmed' ? '#22c55e' : 
                         statusFilter === 'pending' ? '#60a5fa' : 
                         '#ef4444',
                  fontWeight: '600',
                  fontSize: '12px',
                  letterSpacing: '0.3px',
                }}>
                  {statusFilter === 'confirmed' ? 'CONFIRMED' : 
                   statusFilter === 'pending' ? 'PENDING' : 
                   'CANCELLED'}
                </span>
                <button
                  onClick={() => window.location.href = '/bookings/list?status=all'}
                  style={{
                    padding: '6px 14px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '6px',
                    color: '#ef4444',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  {t('listBooking.removeFilter')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Toggle filtri per mobile */}
        <button
          className="filters-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          🔍 {showFilters ? t('listBooking.hideFilters') : t('listBooking.showFilters')}
        </button>

        {/* Barra di filtri ricerca */}
        <div 
          className="filters-container"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px',
            marginBottom: '28px',
            padding: '24px',
            background: 'rgba(30, 30, 35, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '12px',
          }}
        >
          <div>
            <label style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', display: 'block', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {t('listBooking.searchBookingId')}
            </label>
            <input
              type="text"
              placeholder={t('listBooking.bookingIdPlaceholder')}
              value={searchFilters.bookingId}
              onChange={(e) => setSearchFilters({ ...searchFilters, bookingId: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'rgba(15, 15, 20, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', display: 'block', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {t('listBooking.searchEventName')}
            </label>
            <input
              type="text"
              placeholder={t('listBooking.eventNamePlaceholder')}
              value={searchFilters.event}
              onChange={(e) => setSearchFilters({ ...searchFilters, event: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'rgba(15, 15, 20, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', display: 'block', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {t('listBooking.searchClientName')}
            </label>
            <input
              type="text"
              placeholder={t('listBooking.clientNamePlaceholder')}
              value={searchFilters.name}
              onChange={(e) => setSearchFilters({ ...searchFilters, name: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'rgba(15, 15, 20, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', display: 'block', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {t('listBooking.searchEmail')}
            </label>
            <input
              type="text"
              placeholder={t('listBooking.emailPlaceholder')}
              value={searchFilters.email}
              onChange={(e) => setSearchFilters({ ...searchFilters, email: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'rgba(15, 15, 20, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#f1f5f9',
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
                  padding: '10px 14px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  letterSpacing: '0.3px',
                }}
              >
                Clear Filters
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
            <div className="card desktop-table" style={{
              background: 'rgba(30, 30, 35, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ 
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  background: 'rgba(15, 15, 20, 0.3)',
                }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('listBooking.bookingId')}</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('listBooking.event')}</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('listBooking.name')}</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('listBooking.email')}</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('listBooking.status')}</th>
                  <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('listBooking.total')}</th>
                  <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('listBooking.toPay')}</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('listBooking.date')}</th>
                  {user?.role === 'SuperAdmin' && (
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('listBooking.actions')}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr 
                    key={booking.id} 
                    style={{ 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.03)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '16px' }}>
                      <strong style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: '600' }}>{booking.bookingId}</strong>
                    </td>
                    <td style={{ padding: '16px' }}>
                      {booking.event ? (
                        <div>
                          <div style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: '500' }}>{booking.event.name}</div>
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{booking.event.category}</div>
                        </div>
                      ) : booking.eventName ? (
                        <div style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: '500' }}>{booking.eventName}</div>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '13px' }}>No event</span>
                      )}
                    </td>
                    <td style={{ padding: '16px', color: '#f1f5f9', fontSize: '14px' }}>{booking.name}</td>
                    <td style={{ padding: '16px', color: '#94a3b8', fontSize: '13px' }}>{booking.email}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: booking.status.toLowerCase() === 'confirmed' || booking.status.toLowerCase() === 'confermato' ? 'rgba(34, 197, 94, 0.15)' :
                                   booking.status.toLowerCase() === 'pending' || booking.status.toLowerCase().includes('sospeso') ? 'rgba(234, 179, 8, 0.15)' :
                                   'rgba(239, 68, 68, 0.15)',
                        border: booking.status.toLowerCase() === 'confirmed' || booking.status.toLowerCase() === 'confermato' ? '1px solid rgba(34, 197, 94, 0.3)' :
                               booking.status.toLowerCase() === 'pending' || booking.status.toLowerCase().includes('sospeso') ? '1px solid rgba(234, 179, 8, 0.3)' :
                               '1px solid rgba(239, 68, 68, 0.3)',
                        color: booking.status.toLowerCase() === 'confirmed' || booking.status.toLowerCase() === 'confermato' ? '#22c55e' :
                              booking.status.toLowerCase() === 'pending' || booking.status.toLowerCase().includes('sospeso') ? '#eab308' :
                              '#ef4444',
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        display: 'inline-block',
                      }}>
                        {booking.status.toLowerCase() === 'confirmed' || booking.status.toLowerCase() === 'confermato' ? 'CONFIRMED' :
                         booking.status.toLowerCase() === 'pending' || booking.status.toLowerCase().includes('sospeso') ? 'PENDING' :
                         booking.status.toLowerCase().includes('cancel') || booking.status.toLowerCase().includes('annull') ? 'CANCELLED' :
                         booking.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', color: '#f1f5f9', fontSize: '14px', fontWeight: '600' }}>
                      €{booking.total.toFixed(2)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <strong style={{ color: '#60a5fa', fontSize: '14px', fontWeight: '600' }}>€{booking.toPay.toFixed(2)}</strong>
                    </td>
                    <td style={{ padding: '16px', color: '#94a3b8', fontSize: '13px' }}>
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                    {user?.role === 'SuperAdmin' && (
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                          {(booking.status.toLowerCase() === 'pending' || booking.status === 'Pending' || booking.status.toLowerCase().includes('sospeso')) && (
                            <button
                              onClick={() => handleConfirmBooking(booking.id)}
                              disabled={updatingId === booking.id}
                              title="Confirm booking"
                              style={{
                                padding: '7px 9px',
                                background: 'rgba(34, 197, 94, 0.15)',
                                border: '1px solid rgba(34, 197, 94, 0.3)',
                                borderRadius: '6px',
                                color: '#22c55e',
                                cursor: updatingId === booking.id ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: updatingId === booking.id ? 0.5 : 1,
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <CheckCircle size={15} />
                            </button>
                          )}
                          <button
                            onClick={() => window.location.href = `/bookings/edit/${booking.id}`}
                            title="Edit booking"
                            style={{
                              padding: '7px 9px',
                              background: 'rgba(59, 130, 246, 0.15)',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                              borderRadius: '6px',
                              color: '#60a5fa',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <Edit2 size={15} />
                          </button>
                          {(booking.status.toLowerCase() !== 'cancelled' && !booking.status.toLowerCase().includes('cancel')) && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              disabled={updatingId === booking.id}
                              title="Cancel booking"
                              style={{
                                padding: '7px 9px',
                                background: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '6px',
                                color: '#ef4444',
                                cursor: updatingId === booking.id ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: updatingId === booking.id ? 0.5 : 1,
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <XCircle size={15} />
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
                  background: 'rgba(30, 30, 35, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderLeft: `4px solid ${
                    booking.status.toLowerCase() === 'confirmed' || booking.status.toLowerCase() === 'confermato' ? '#22c55e' :
                    booking.status.toLowerCase() === 'pending' || booking.status.toLowerCase().includes('sospeso') ? '#eab308' :
                    '#ef4444'
                  }`,
                  borderRadius: '10px',
                  padding: '16px',
                  marginBottom: '14px',
                }}
              >
                {/* Header: Booking ID + Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                      {t('listBooking.bookingId')}
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#f1f5f9' }}>
                      {booking.bookingId}
                    </div>
                  </div>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: booking.status.toLowerCase() === 'confirmed' || booking.status.toLowerCase() === 'confermato' ? 'rgba(34, 197, 94, 0.15)' :
                               booking.status.toLowerCase() === 'pending' || booking.status.toLowerCase().includes('sospeso') ? 'rgba(234, 179, 8, 0.15)' :
                               'rgba(239, 68, 68, 0.15)',
                    border: booking.status.toLowerCase() === 'confirmed' || booking.status.toLowerCase() === 'confermato' ? '1px solid rgba(34, 197, 94, 0.3)' :
                           booking.status.toLowerCase() === 'pending' || booking.status.toLowerCase().includes('sospeso') ? '1px solid rgba(234, 179, 8, 0.3)' :
                           '1px solid rgba(239, 68, 68, 0.3)',
                    color: booking.status.toLowerCase() === 'confirmed' || booking.status.toLowerCase() === 'confermato' ? '#22c55e' :
                          booking.status.toLowerCase() === 'pending' || booking.status.toLowerCase().includes('sospeso') ? '#eab308' :
                          '#ef4444',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    {booking.status.toLowerCase() === 'confirmed' || booking.status.toLowerCase() === 'confermato' ? 'CONFIRMED' :
                     booking.status.toLowerCase() === 'pending' || booking.status.toLowerCase().includes('sospeso') ? 'PENDING' :
                     'CANCELLED'}
                  </span>
                </div>

                {/* Event Info */}
                <div style={{ marginBottom: '12px', padding: '12px', background: 'rgba(15, 15, 20, 0.4)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                    {t('listBooking.event')}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9', marginBottom: '2px' }}>
                    {booking.event?.name || booking.eventName || 'N/A'}
                  </div>
                  {booking.event?.category && (
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                      {booking.event.category}
                    </div>
                  )}
                </div>

                {/* Client Info */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                    {t('listBooking.clientInfo')}
                  </div>
                  <div style={{ fontSize: '14px', color: '#f1f5f9', marginBottom: '4px', fontWeight: '500' }}>
                    {booking.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {booking.email}
                  </div>
                </div>

                {/* Sold By (chi ha creato la prenotazione) */}
                {booking.soldByName && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                      {t('listBooking.createdBy')}
                    </div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>
                      {booking.soldByName}
                    </div>
                  </div>
                )}

                {/* Financial Info */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '10px', 
                  marginBottom: '14px',
                  padding: '12px',
                  background: 'rgba(59, 130, 246, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(59, 130, 246, 0.15)',
                }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                      {t('listBooking.total')}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9' }}>
                      €{booking.total.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                      {t('listBooking.toPay')}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: booking.toPay > 0 ? '#ef4444' : '#22c55e' }}>
                      €{booking.toPay.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Actions Buttons */}
                {user?.role === 'SuperAdmin' && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {(booking.status.toLowerCase() === 'pending' || booking.status === 'Pending' || booking.status.toLowerCase().includes('sospeso')) && (
                      <button
                        onClick={() => handleConfirmBooking(booking.id)}
                        disabled={updatingId === booking.id}
                        style={{
                          flex: '1 1 calc(50% - 4px)',
                          padding: '11px',
                          background: 'rgba(34, 197, 94, 0.15)',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          borderRadius: '8px',
                          color: '#22c55e',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: updatingId === booking.id ? 'not-allowed' : 'pointer',
                          opacity: updatingId === booking.id ? 0.5 : 1,
                          letterSpacing: '0.3px',
                        }}
                      >
                        Confirm
                      </button>
                    )}
                    <button
                      onClick={() => window.location.href = `/bookings/edit/${booking.id}`}
                      style={{
                        flex: '1 1 calc(50% - 4px)',
                        padding: '11px',
                        background: 'rgba(59, 130, 246, 0.15)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '8px',
                        color: '#60a5fa',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        letterSpacing: '0.3px',
                      }}
                    >
                      Edit
                    </button>
                    {(booking.status.toLowerCase() !== 'cancelled' && !booking.status.toLowerCase().includes('cancel')) && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={updatingId === booking.id}
                        style={{
                          flex: '1 1 100%',
                          padding: '11px',
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '8px',
                          color: '#ef4444',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: updatingId === booking.id ? 'not-allowed' : 'pointer',
                          opacity: updatingId === booking.id ? 0.5 : 1,
                          letterSpacing: '0.3px',
                        }}
                      >
                        Cancel Booking
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
