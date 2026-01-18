'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useTranslation } from '../../i18n/useTranslation';

interface Booking {
  id: string;
  bookingId: string;
  name: string;
  email: string;
  status: string;
  total: number;
  toPay: number;
  createdAt: string;
  event?: {
    name: string;
    category: string;
  };
}

export default function ListBookings() {
  const { t, language, setLanguage } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

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
    switch (status) {
      case 'Confirmed':
        return '#4ecdc4';
      case 'Pending':
        return '#f4b860';
      case 'Invited':
        return '#48c774';
      default:
        return '#999';
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar t={t} />
      <div className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>{t('listBooking.title')}</h1>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <LanguageSwitcher language={language} setLanguage={setLanguage} />
            <a 
            href="/bookings/add" 
            className="button button-primary"
            style={{ textDecoration: 'none' }}
          >
            ➕ {t('listBooking.addNew')}
          </a>
          </div>
        </div>

        {loading ? (
          <p>{t('listBooking.loading')}</p>
        ) : bookings.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ fontSize: '18px', color: '#999' }}>{t('listBooking.noBookings')}</p>
            <a 
              href="/bookings/add" 
              className="button button-primary"
              style={{ marginTop: '20px', display: 'inline-flex', textDecoration: 'none' }}
            >
              {t('listBooking.createFirst')}
            </a>
          </div>
        ) : (
          <div className="card">
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
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
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
                      ) : (
                        <span style={{ color: '#999' }}>{t('listBooking.noEvent')}</span>
                      )}
                    </td>
                    <td style={{ padding: '15px' }}>{booking.name}</td>
                    <td style={{ padding: '15px' }}>{booking.email}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        padding: '5px 12px',
                        borderRadius: '12px',
                        backgroundColor: getStatusColor(booking.status) + '33',
                        color: getStatusColor(booking.status),
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}>
                        {booking.status}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
