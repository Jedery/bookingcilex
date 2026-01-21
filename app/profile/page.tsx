'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import { useTranslation } from '../i18n/useTranslation';
import { useAuth } from '../context/AuthContext';
import { User, AlertCircle, CheckCircle, XCircle, TrendingUp, Home, Calendar, DollarSign, Star, ArrowLeft } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  walletBalance: number;
  rentAmount?: number;
  rentType?: string;
  propertyId?: string;
  moveInDate?: string;
  fines: number;
  rating: number;
  daysOff: number;
  lastCheckout?: string;
  createdAt: string;
}

interface BookingStats {
  totalSales: number;
  confirmedSales: number;
  pendingSales: number;
  revenue: number;
}

export default function Profile() {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedUserId = searchParams.get('userId');
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [bookingStats, setBookingStats] = useState<BookingStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Protezione accesso estesa a SuperAdmin, Founder e Manager
  
  // Protezione accesso
  useEffect(() => {
    if (currentUser && !['SuperAdmin', 'Founder', 'Manager'].includes(currentUser.role)) {
      router.push('/');
    }
  }, [currentUser, router]);

  // Carica utenti
  useEffect(() => {
    fetchUsers();
  }, []);

  // Carica dettaglio utente se userId presente
  useEffect(() => {
    if (selectedUserId && users.length > 0) {
      const user = users.find(u => u.id === selectedUserId);
      if (user) {
        setSelectedUser(user);
        fetchBookingStats(selectedUserId);
      }
    }
  }, [selectedUserId, users]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data.filter((u: UserData) => u.role !== 'SuperAdmin' && u.isActive));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingStats = async (userId: string) => {
    try {
      const response = await fetch('/api/bookings');
      const bookings = await response.json();
      
      const userBookings = bookings.filter((b: any) => b.soldBy === userId);
      const confirmed = userBookings.filter((b: any) => 
        b.status === 'Confirmed' || b.status.toLowerCase() === 'confermato'
      );
      const pending = userBookings.filter((b: any) => 
        b.status === 'Pending' || b.status.toLowerCase().includes('sospeso')
      );
      
      setBookingStats({
        totalSales: userBookings.length,
        confirmedSales: confirmed.length,
        pendingSales: pending.length,
        revenue: confirmed.reduce((sum: number, b: any) => sum + (b.total || 0), 0),
      });
    } catch (error) {
      console.error('Error fetching booking stats:', error);
    }
  };

  const getRentStatus = (user: UserData) => {
    if (!user.rentAmount || !user.propertyId) return null;
    
    // Calcola se ha pagato l'affitto (se wallet negativo o ha multe)
    const hasRentIssues = user.walletBalance < 0 || user.fines > 0;
    return hasRentIssues ? 'warning' : 'ok';
  };

  const getCheckoutStatus = (user: UserData) => {
    if (!user.lastCheckout) return 'warning';
    
    const lastCheckout = new Date(user.lastCheckout);
    const now = new Date();
    const daysSinceCheckout = Math.floor((now.getTime() - lastCheckout.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysSinceCheckout > 30 ? 'warning' : 'ok';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
        <Sidebar t={t} />
        <div style={{ flex: 1, padding: '40px', color: '#fff' }}>
          <p>Caricamento...</p>
        </div>
      </div>
    );
  }

  // Vista dettaglio utente
  if (selectedUser) {
    const rentStatus = getRentStatus(selectedUser);
    const checkoutStatus = getCheckoutStatus(selectedUser);
    
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
        <Sidebar t={t} />
        <div style={{ flex: 1, padding: '40px', color: '#fff' }}>
          {/* Header */}
          <div style={{ marginBottom: '30px' }}>
            <button
              onClick={() => router.push('/profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                color: '#3b82f6',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                marginBottom: '20px',
              }}
            >
              <ArrowLeft size={18} />
              Torna alla lista
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: '600',
                color: '#fff',
              }}>
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: '300',
                  letterSpacing: '-0.5px',
                  margin: '0 0 8px 0',
                  color: '#fff',
                }}>
                  {selectedUser.name}
                </h1>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{
                    padding: '4px 12px',
                    background: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#3b82f6',
                  }}>
                    {selectedUser.role}
                  </span>
                  <span style={{ color: '#94a3b8', fontSize: '14px' }}>
                    {selectedUser.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px',
          }}>
            {/* Wallet Balance */}
            <div style={{
              background: '#1a1a1a',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #2a2a2a',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <DollarSign size={24} color="#22c55e" />
                <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '500' }}>Wallet Balance</span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: '600', color: selectedUser.walletBalance >= 0 ? '#22c55e' : '#ef4444' }}>
                €{selectedUser.walletBalance.toFixed(2)}
              </div>
            </div>

            {/* Rating */}
            <div style={{
              background: '#1a1a1a',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #2a2a2a',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <Star size={24} color="#eab308" />
                <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '500' }}>Valutazione</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '28px', fontWeight: '600', color: '#fff' }}>
                  {selectedUser.rating.toFixed(1)}
                </span>
                <span style={{ fontSize: '18px', color: '#94a3b8' }}>/5.0</span>
              </div>
            </div>

            {/* Multe */}
            <div style={{
              background: '#1a1a1a',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #2a2a2a',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <AlertCircle size={24} color={selectedUser.fines > 0 ? '#ef4444' : '#22c55e'} />
                <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '500' }}>Multe</span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: '600', color: selectedUser.fines > 0 ? '#ef4444' : '#22c55e' }}>
                €{selectedUser.fines.toFixed(2)}
              </div>
            </div>

            {/* Giorni di riposo */}
            <div style={{
              background: '#1a1a1a',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #2a2a2a',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <Calendar size={24} color="#3b82f6" />
                <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '500' }}>Giorni Riposo</span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: '600', color: '#fff' }}>
                {selectedUser.daysOff}
              </div>
            </div>
          </div>

          {/* Booking Stats */}
          {bookingStats && (
            <div style={{
              background: '#1a1a1a',
              borderRadius: '12px',
              padding: '30px',
              border: '1px solid #2a2a2a',
              marginBottom: '30px',
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#fff',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <TrendingUp size={24} color="#3b82f6" />
                Performance Vendite
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
              }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Totale Vendite</div>
                  <div style={{ fontSize: '32px', fontWeight: '600', color: '#fff' }}>{bookingStats.totalSales}</div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Confermate</div>
                  <div style={{ fontSize: '32px', fontWeight: '600', color: '#22c55e' }}>{bookingStats.confirmedSales}</div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>In Sospeso</div>
                  <div style={{ fontSize: '32px', fontWeight: '600', color: '#eab308' }}>{bookingStats.pendingSales}</div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Revenue Totale</div>
                  <div style={{ fontSize: '32px', fontWeight: '600', color: '#3b82f6' }}>€{bookingStats.revenue.toFixed(0)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Status Checks */}
          <div style={{
            background: '#1a1a1a',
            borderRadius: '12px',
            padding: '30px',
            border: '1px solid #2a2a2a',
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#fff',
              marginBottom: '20px',
            }}>
              Status Overview
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Affitto */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                background: '#0f0f0f',
                borderRadius: '8px',
                border: `1px solid ${rentStatus === 'ok' ? 'rgba(34, 197, 94, 0.3)' : rentStatus === 'warning' ? 'rgba(234, 179, 8, 0.3)' : '#2a2a2a'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Home size={20} color={rentStatus === 'ok' ? '#22c55e' : rentStatus === 'warning' ? '#eab308' : '#94a3b8'} />
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '500', color: '#fff' }}>Quadro Affitti</div>
                    {selectedUser.rentAmount && (
                      <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
                        €{selectedUser.rentAmount}/{selectedUser.rentType === 'weekly' ? 'settimana' : 'mese'}
                      </div>
                    )}
                  </div>
                </div>
                {rentStatus === 'ok' ? (
                  <CheckCircle size={24} color="#22c55e" />
                ) : rentStatus === 'warning' ? (
                  <AlertCircle size={24} color="#eab308" />
                ) : (
                  <XCircle size={24} color="#94a3b8" />
                )}
              </div>

              {/* Checkout */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                background: '#0f0f0f',
                borderRadius: '8px',
                border: `1px solid ${checkoutStatus === 'ok' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <DollarSign size={20} color={checkoutStatus === 'ok' ? '#22c55e' : '#eab308'} />
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '500', color: '#fff' }}>Ultimo Checkout</div>
                    {selectedUser.lastCheckout && (
                      <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
                        {new Date(selectedUser.lastCheckout).toLocaleDateString('it-IT')}
                      </div>
                    )}
                  </div>
                </div>
                {checkoutStatus === 'ok' ? (
                  <CheckCircle size={24} color="#22c55e" />
                ) : (
                  <AlertCircle size={24} color="#eab308" />
                )}
              </div>

              {/* Multe */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                background: '#0f0f0f',
                borderRadius: '8px',
                border: `1px solid ${selectedUser.fines === 0 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <AlertCircle size={20} color={selectedUser.fines === 0 ? '#22c55e' : '#ef4444'} />
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '500', color: '#fff' }}>Stato Multe</div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
                      €{selectedUser.fines.toFixed(2)} da pagare
                    </div>
                  </div>
                </div>
                {selectedUser.fines === 0 ? (
                  <CheckCircle size={24} color="#22c55e" />
                ) : (
                  <XCircle size={24} color="#ef4444" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista lista utenti
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
      <Sidebar t={t} />
      <div style={{ flex: 1, padding: '40px', color: '#fff' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '300',
          letterSpacing: '-0.5px',
          marginBottom: '30px',
          color: '#fff',
        }}>
          Gestione Team
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
        }}>
          {users.map((user) => {
            const rentStatus = getRentStatus(user);
            const checkoutStatus = getCheckoutStatus(user);
            
            return (
              <div
                key={user.id}
                onClick={() => router.push(`/profile?userId=${user.id}`)}
                style={{
                  background: '#1a1a1a',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #2a2a2a',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#2a2a2a';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#fff',
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
                      {user.name}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      padding: '2px 8px',
                      background: 'rgba(59, 130, 246, 0.15)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '4px',
                      color: '#3b82f6',
                      display: 'inline-block',
                    }}>
                      {user.role}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '16px',
                }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Wallet</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: user.walletBalance >= 0 ? '#22c55e' : '#ef4444' }}>
                      €{user.walletBalance.toFixed(0)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Rating</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#eab308' }}>
                      {user.rating.toFixed(1)} ⭐
                    </div>
                  </div>
                </div>

                {/* Status Indicators */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  paddingTop: '16px',
                  borderTop: '1px solid #2a2a2a',
                }}>
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px',
                    borderRadius: '6px',
                    background: rentStatus === 'ok' ? 'rgba(34, 197, 94, 0.1)' : rentStatus === 'warning' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                    border: `1px solid ${rentStatus === 'ok' ? 'rgba(34, 197, 94, 0.3)' : rentStatus === 'warning' ? 'rgba(234, 179, 8, 0.3)' : 'rgba(100, 116, 139, 0.3)'}`,
                  }}>
                    <Home size={14} color={rentStatus === 'ok' ? '#22c55e' : rentStatus === 'warning' ? '#eab308' : '#64748b'} />
                  </div>
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px',
                    borderRadius: '6px',
                    background: checkoutStatus === 'ok' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                    border: `1px solid ${checkoutStatus === 'ok' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
                  }}>
                    <DollarSign size={14} color={checkoutStatus === 'ok' ? '#22c55e' : '#eab308'} />
                  </div>
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px',
                    borderRadius: '6px',
                    background: user.fines === 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${user.fines === 0 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  }}>
                    <AlertCircle size={14} color={user.fines === 0 ? '#22c55e' : '#ef4444'} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
