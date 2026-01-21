"use client";

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/app/components/Sidebar';
import { useTranslation } from '@/app/i18n/useTranslation';
import { TrendingUp, Calendar, Clock, Wallet, AlertTriangle, Home, DollarSign, LogOut } from 'lucide-react';
import '@/app/styles/globals.css';

interface PromoterStats {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  walletBalance: number;
  rentDue: number;
  rentType: string | null;
  fines: number;
  recentBookings: any[];
}

export default function MyProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const [stats, setStats] = useState<PromoterStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
    if (user) {
      fetchPromoterStats();
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const fetchPromoterStats = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        const currentUser = data.users?.find((u: any) => u.id === user?.id);
        
        // Fetch bookings
        const bookingsRes = await fetch('/api/bookings');
        const bookingsData = await bookingsRes.json();
        const myBookings = bookingsData.bookings?.filter((b: any) => b.soldByName === user?.name) || [];
        
        const confirmed = myBookings.filter((b: any) => b.status === 'Confirmed').length;
        const pending = myBookings.filter((b: any) => b.status === 'Pending').length;
        const totalRev = myBookings
          .filter((b: any) => b.status === 'Confirmed')
          .reduce((sum: number, b: any) => sum + (b.total || 0), 0);
        
        setStats({
          totalBookings: myBookings.length,
          confirmedBookings: confirmed,
          pendingBookings: pending,
          totalRevenue: totalRev,
          walletBalance: currentUser?.walletBalance || 0,
          rentDue: currentUser?.rentAmount || 0,
          rentType: currentUser?.rentType || null,
          fines: currentUser?.fines || 0,
          recentBookings: myBookings.slice(0, 5),
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        color: '#c89664',
        fontSize: '18px',
        fontWeight: '300',
        letterSpacing: '2px',
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const roleColors: { [key: string]: string } = {
    SuperAdmin: '#9333ea',
    Founder: '#ff4444',
    Manager: '#00d4ff',
    Promoter: '#ff9800',
    Collaboratore: '#4caf50',
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar t={t} />
      <div className="main-content" style={{ flex: 1 }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px',
        }}>
          {/* Header con Avatar e Nome */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '30px',
            padding: '20px',
            background: 'rgba(20, 20, 20, 0.6)',
            border: '1px solid rgba(200, 150, 100, 0.3)',
            borderRadius: '12px',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${roleColors[user.role]} 0%, ${roleColors[user.role]}80 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: '300',
              color: '#fff',
              marginRight: '20px',
              border: '2px solid rgba(200, 150, 100, 0.3)',
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '300',
                color: '#fff',
                marginBottom: '8px',
              }}>
                {user.name}
              </h1>
              <div style={{
                display: 'inline-block',
                padding: '4px 12px',
                background: `${roleColors[user.role]}20`,
                border: `1px solid ${roleColors[user.role]}60`,
                borderRadius: '20px',
                color: roleColors[user.role],
                fontSize: '11px',
                fontWeight: '400',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
              }}>
                {user.role}
              </div>
            </div>
          </div>

          {loadingStats ? (
            <div style={{ textAlign: 'center', color: '#c89664', padding: '40px' }}>
              Caricamento statistiche...
            </div>
          ) : (
            <>
              {/* KPI Cards - Performance */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
                marginBottom: '20px',
              }}>
                <div style={{
                  background: 'rgba(20, 20, 20, 0.6)',
                  border: '1px solid rgba(200, 150, 100, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <Calendar size={20} color="#c89664" style={{ marginRight: '10px' }} />
                    <span style={{ fontSize: '12px', color: '#888', letterSpacing: '1px' }}>TOTALE BOOKING</span>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '300', color: '#fff' }}>
                    {stats?.totalBookings || 0}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(20, 20, 20, 0.6)',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <TrendingUp size={20} color="#4caf50" style={{ marginRight: '10px' }} />
                    <span style={{ fontSize: '12px', color: '#888', letterSpacing: '1px' }}>CONFERMATI</span>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '300', color: '#4caf50' }}>
                    {stats?.confirmedBookings || 0}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(20, 20, 20, 0.6)',
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <Clock size={20} color="#ff9800" style={{ marginRight: '10px' }} />
                    <span style={{ fontSize: '12px', color: '#888', letterSpacing: '1px' }}>IN ATTESA</span>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '300', color: '#ff9800' }}>
                    {stats?.pendingBookings || 0}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(20, 20, 20, 0.6)',
                  border: '1px solid rgba(200, 150, 100, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <DollarSign size={20} color="#c89664" style={{ marginRight: '10px' }} />
                    <span style={{ fontSize: '12px', color: '#888', letterSpacing: '1px' }}>FATTURATO</span>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: '300', color: '#c89664' }}>
                    €{stats?.totalRevenue.toFixed(2) || '0.00'}
                  </div>
                </div>
              </div>

              {/* Wallet e Affitto */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
                marginBottom: '20px',
              }}>
                <div style={{
                  background: 'rgba(20, 20, 20, 0.6)',
                  border: '1px solid rgba(76, 175, 80, 0.4)',
                  borderRadius: '12px',
                  padding: '24px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Wallet size={24} color="#4caf50" style={{ marginRight: '12px' }} />
                    <span style={{ fontSize: '14px', color: '#4caf50', letterSpacing: '2px', fontWeight: '400' }}>
                      SALDO WALLET
                    </span>
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: '300', color: '#4caf50' }}>
                    €{stats?.walletBalance.toFixed(2) || '0.00'}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(20, 20, 20, 0.6)',
                  border: '1px solid rgba(33, 150, 243, 0.4)',
                  borderRadius: '12px',
                  padding: '24px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Home size={24} color="#2196f3" style={{ marginRight: '12px' }} />
                    <span style={{ fontSize: '14px', color: '#2196f3', letterSpacing: '2px', fontWeight: '400' }}>
                      AFFITTO {stats?.rentType === 'weekly' ? 'SETTIMANALE' : stats?.rentType === 'monthly' ? 'MENSILE' : ''}
                    </span>
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: '300', color: '#2196f3' }}>
                    €{stats?.rentDue?.toFixed(2) || '0.00'}
                  </div>
                  <div style={{ 
                    marginTop: '12px', 
                    fontSize: '12px', 
                    color: stats?.rentDue && stats.walletBalance >= stats.rentDue ? '#4caf50' : '#ff9800',
                    fontWeight: '300',
                  }}>
                    {stats?.rentDue && stats.walletBalance >= stats.rentDue ? '✓ Disponibile' : '⚠ Saldo insufficiente'}
                  </div>
                </div>

                {stats && stats.fines > 0 && (
                  <div style={{
                    background: 'rgba(20, 20, 20, 0.6)',
                    border: '1px solid rgba(244, 67, 54, 0.4)',
                    borderRadius: '12px',
                    padding: '24px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <AlertTriangle size={24} color="#f44336" style={{ marginRight: '12px' }} />
                      <span style={{ fontSize: '14px', color: '#f44336', letterSpacing: '2px', fontWeight: '400' }}>
                        MULTE
                      </span>
                    </div>
                    <div style={{ fontSize: '36px', fontWeight: '300', color: '#f44336' }}>
                      €{stats.fines.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>

              {/* Ultimi Booking */}
              <div style={{
                background: 'rgba(20, 20, 20, 0.6)',
                border: '1px solid rgba(200, 150, 100, 0.3)',
                borderRadius: '12px',
                padding: '24px',
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '300',
                  color: '#c89664',
                  marginBottom: '20px',
                  letterSpacing: '2px',
                }}>
                  ULTIMI BOOKING
                </h3>
                {stats?.recentBookings && stats.recentBookings.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {stats.recentBookings.map((booking: any) => (
                      <div
                        key={booking.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 16px',
                          background: 'rgba(10, 10, 10, 0.4)',
                          border: '1px solid rgba(200, 150, 100, 0.2)',
                          borderRadius: '8px',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '14px', color: '#fff', marginBottom: '4px' }}>
                            {booking.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#888' }}>
                            {booking.eventName || 'No event'} • {booking.bookingId}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ 
                            fontSize: '14px', 
                            color: booking.status === 'Confirmed' ? '#4caf50' : '#ff9800',
                            marginBottom: '4px',
                          }}>
                            {booking.status}
                          </div>
                          <div style={{ fontSize: '14px', color: '#c89664' }}>
                            €{booking.total?.toFixed(2) || '0.00'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                    Nessun booking ancora
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <div style={{ marginTop: '30px', marginBottom: '100px' }}>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'rgba(244, 67, 54, 0.1)',
                    border: '1px solid rgba(244, 67, 54, 0.3)',
                    borderRadius: '12px',
                    color: '#f44336',
                    fontSize: '14px',
                    fontWeight: '400',
                    letterSpacing: '1.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(244, 67, 54, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(244, 67, 54, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(244, 67, 54, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(244, 67, 54, 0.3)';
                  }}
                >
                  <LogOut size={18} />
                  <span>LOGOUT</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
