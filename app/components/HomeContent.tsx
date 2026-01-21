'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import KPICards from './KPICards';
import RevenueChart from './RevenueChart';
import BookingStatsWidget from './BookingStatsWidget';
import TeamPerformance from './TeamPerformance';
import SellerAnalytics from './SellerAnalytics';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '../i18n/useTranslation';
import { useAuth } from '../context/AuthContext';
import { Search, BarChart3, CheckCircle2, Clock, XCircle, Banknote, CreditCard, RefreshCw, Target } from 'lucide-react';

export default function HomeContent() {
  const { t, language, setLanguage } = useTranslation();
  const { user } = useAuth();
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' });
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const fullDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
  });
  const [todayStats, setTodayStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    revenue: 0,
  });
  const [teamSalesData, setTeamSalesData] = useState([]);
  const [kpiPeriod, setKpiPeriod] = useState<'today' | 'week' | 'month'>('month');
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('month');
  const [selectedSeller, setSelectedSeller] = useState<any>(null);

  // Load real users data for team performance
  useEffect(() => {
    Promise.all([
      fetch('/api/users').then(res => res.json()),
      fetch('/api/bookings').then(res => res.json())
    ])
      .then(([users, bookings]) => {
        // Filter out SuperAdmin
        const activeUsers = users.filter((u: any) => u.role !== 'SuperAdmin' && u.isActive);
        
        // Calculate real sales data for each user
        const teamData = activeUsers.map((u: any) => {
          // Get all bookings sold by this user
          const userBookings = bookings.filter((b: any) => b.soldBy === u.id);
          
          const totalSales = userBookings.length;
          const confirmedSales = userBookings.filter((b: any) => 
            b.status === 'Confirmed' || b.status.toLowerCase() === 'confermato'
          ).length;
          const pendingSales = userBookings.filter((b: any) => 
            b.status === 'Pending' || b.status.toLowerCase().includes('sospeso')
          ).length;
          
          // Count payment methods
          const cashSales = userBookings.filter((b: any) => b.paymentMethod === 'Cash').length;
          const cardSales = userBookings.filter((b: any) => b.paymentMethod === 'Card').length;
          
          // Calculate revenue from confirmed bookings
          const revenue = userBookings
            .filter((b: any) => b.status === 'Confirmed' || b.status.toLowerCase() === 'confermato')
            .reduce((sum: number, b: any) => sum + (b.total || 0), 0);
          
          return {
            name: u.name,
            role: u.role,
            totalSales,
            confirmedSales,
            pendingSales,
            cashSales,
            cardSales,
            revenue,
            avgConfirmTime: `${(Math.random() * 3 + 0.5).toFixed(1)}h`, // Mock for now
          };
        });
        
        setTeamSalesData(teamData);
      })
      .catch((error) => console.error('Error fetching team data:', error));
  }, []);

  useEffect(() => {
    // Fetch dashboard stats
    fetch('/api/bookings')
      .then((res) => res.json())
      .then((allData) => {
        const now = new Date();
        
        // Calculate TODAY stats
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayBookings = allData.filter((b: any) => new Date(b.createdAt) >= todayStart);
        const todayConfirmed = todayBookings.filter((b: any) => 
          b.status === 'Confirmed' || b.status.toLowerCase() === 'confermato'
        );
        const todayPending = todayBookings.filter((b: any) => 
          b.status === 'Pending' || b.status.toLowerCase().includes('sospeso')
        );
        const todayRevenue = todayConfirmed.reduce((sum: number, b: any) => sum + (b.total || 0), 0);
        
        setTodayStats({
          total: todayBookings.length,
          confirmed: todayConfirmed.length,
          pending: todayPending.length,
          revenue: todayRevenue,
        });
        
        // Filter by period for main KPIs
        let filteredData = allData;
        
        if (kpiPeriod === 'today') {
          filteredData = todayBookings;
        } else if (kpiPeriod === 'week') {
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - 7);
          filteredData = allData.filter((b: any) => new Date(b.createdAt) >= weekStart);
        } else if (kpiPeriod === 'month') {
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          filteredData = allData.filter((b: any) => new Date(b.createdAt) >= monthStart);
        }

        const confirmed = filteredData.filter((b: any) => b.status === 'Confirmed').length;
        const pending = filteredData.filter((b: any) => b.status === 'Pending').length;
        const cancelled = filteredData.filter((b: any) => b.status === 'Cancelled').length;
        const revenue = filteredData
          .filter((b: any) => b.status === 'Confirmed')
          .reduce((sum: number, b: any) => sum + (b.total || 0), 0);

        setDashboardData({
          totalBookings: filteredData.length,
          confirmedBookings: confirmed,
          pendingBookings: pending,
          cancelledBookings: cancelled,
          totalRevenue: revenue,
        });
      })
      .catch((error) => console.error('Error fetching dashboard data:', error));
  }, [kpiPeriod]);

  // Mock data per Seller Analytics - da sostituire con dati reali
  const sellerAnalyticsData = [
    {
      sellerId: '1',
      sellerName: 'Marco Rossi',
      role: 'Promoter',
      daily: { tickets: 5, revenue: 1200, cash: 600, card: 400, pos: 150, transfer: 50, avgTicketValue: 240 },
      weekly: { tickets: 22, revenue: 6800, cash: 3200, card: 2400, pos: 800, transfer: 400, avgTicketValue: 309 },
      monthly: { tickets: 95, revenue: 28500, cash: 14000, card: 9500, pos: 3500, transfer: 1500, avgTicketValue: 300 },
      trend: 'up' as const,
      trendPercentage: 18,
    },
    {
      sellerId: '2',
      sellerName: 'Sara Bianchi',
      role: 'Promoter',
      daily: { tickets: 8, revenue: 2100, cash: 900, card: 800, pos: 300, transfer: 100, avgTicketValue: 262.5 },
      weekly: { tickets: 35, revenue: 10200, cash: 5000, card: 3500, pos: 1200, transfer: 500, avgTicketValue: 291 },
      monthly: { tickets: 142, revenue: 42600, cash: 20000, card: 15000, pos: 5100, transfer: 2500, avgTicketValue: 300 },
      trend: 'up' as const,
      trendPercentage: 25,
    },
    {
      sellerId: '3',
      sellerName: 'Luca Verdi',
      role: 'Manager',
      daily: { tickets: 3, revenue: 950, cash: 500, card: 350, pos: 100, transfer: 0, avgTicketValue: 316.7 },
      weekly: { tickets: 18, revenue: 5400, cash: 2800, card: 1900, pos: 600, transfer: 100, avgTicketValue: 300 },
      monthly: { tickets: 78, revenue: 23400, cash: 12000, card: 8000, pos: 2600, transfer: 800, avgTicketValue: 300 },
      trend: 'down' as const,
      trendPercentage: -5,
    },
    {
      sellerId: '4',
      sellerName: 'Anna Neri',
      role: 'Promoter',
      daily: { tickets: 6, revenue: 1650, cash: 800, card: 600, pos: 200, transfer: 50, avgTicketValue: 275 },
      weekly: { tickets: 28, revenue: 8200, cash: 4000, card: 2800, pos: 1000, transfer: 400, avgTicketValue: 293 },
      monthly: { tickets: 118, revenue: 35400, cash: 17000, card: 12000, pos: 4500, transfer: 1900, avgTicketValue: 300 },
      trend: 'stable' as const,
      trendPercentage: 2,
    },
  ];

  const kpiCards = [
    {
      label: t('kpi.totalBookings'),
      value: dashboardData.totalBookings,
      change: 12,
      icon: <BarChart3 size={28} strokeWidth={1.5} />,
      color: '#c89664',
      bgColor: 'rgba(200, 150, 100, 0.1)',
      link: '/bookings/list?status=all',
    },
    {
      label: t('kpi.confirmed'),
      value: dashboardData.confirmedBookings,
      change: 18,
      icon: <CheckCircle2 size={28} strokeWidth={1.5} />,
      color: '#48c774',
      bgColor: 'rgba(72, 199, 116, 0.1)',
      link: '/bookings/list?status=confirmed',
    },
    {
      label: t('kpi.pending'),
      value: dashboardData.pendingBookings,
      change: -5,
      icon: <Clock size={28} strokeWidth={1.5} />,
      color: '#ffc107',
      bgColor: 'rgba(255, 193, 7, 0.1)',
      link: '/bookings/list?status=pending',
    },
    {
      label: t('kpi.cancelled'),
      value: dashboardData.cancelledBookings,
      change: -12,
      icon: <XCircle size={28} strokeWidth={1.5} />,
      color: '#d4495f',
      bgColor: 'rgba(212, 73, 95, 0.1)',
      link: '/bookings/list?status=cancelled',
    },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar t={t} />
      <div className="main-content">
        {/* Welcome Hero Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(200, 150, 100, 0.08) 0%, rgba(10, 10, 10, 0.4) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(200, 150, 100, 0.3)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}>
          {/* Left side: Avatar + Text */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Avatar */}
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #c89664 0%, #d4a574 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: '700',
              color: '#0a0a0a',
              border: '2px solid rgba(200, 150, 100, 0.4)',
              flexShrink: 0,
            }}>
              {user?.name?.charAt(0).toUpperCase() || 'G'}
            </div>

            {/* Text */}
            <div>
              <div style={{
                fontSize: '10px',
                fontWeight: '600',
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                marginBottom: '4px',
              }}>
                Benvenuto
              </div>
              <h1 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#fff',
                margin: 0,
                letterSpacing: '0.3px',
                lineHeight: 1.2,
              }}>
                {user?.name || 'Guest'}
              </h1>
            </div>
          </div>

          {/* Right side: Status Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            {/* Status Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: 'rgba(200, 150, 100, 0.15)',
              borderRadius: '8px',
              border: '1px solid rgba(200, 150, 100, 0.3)',
            }}>
              <Target size={12} color="#c89664" />
              <span style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#c89664',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                {user?.role || 'User'}
              </span>
            </div>
          </div>
        </div>

<KPICards cards={kpiCards} />

        <TeamPerformance 
          salesData={teamSalesData} 
          period={period} 
          setPeriod={setPeriod} 
          t={t}
          onSelectSeller={setSelectedSeller}
        />

        {/* Modal Dettagli Venditore */}
        {selectedSeller && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => setSelectedSeller(null)}
          >
            <div 
              style={{
                background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.95), rgba(10, 10, 10, 0.98))',
                border: '2px solid rgba(200, 150, 100, 0.4)',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '900px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #c89664 0%, #a67c52 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#0a0a0a',
                    border: '3px solid rgba(200, 150, 100, 0.5)',
                  }}>
                    {selectedSeller.name.charAt(0)}
                  </div>
                  <div>
                    <h2 style={{ 
                      fontSize: '32px', 
                      fontWeight: '700', 
                      color: '#fff', 
                      margin: 0,
                      marginBottom: '6px',
                      letterSpacing: '-0.5px',
                    }}>
                      {selectedSeller.name}
                    </h2>
                    <div style={{
                      display: 'inline-block',
                      padding: '6px 14px',
                      background: 'rgba(200, 150, 100, 0.15)',
                      border: '1px solid rgba(200, 150, 100, 0.3)',
                      borderRadius: '8px',
                      color: '#c89664',
                      fontSize: '14px',
                      fontWeight: '600',
                      letterSpacing: '0.5px',
                    }}>
                      {selectedSeller.role}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSeller(null)}
                  style={{
                    background: 'rgba(200, 150, 100, 0.1)',
                    border: '1px solid rgba(200, 150, 100, 0.3)',
                    borderRadius: '10px',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#c89664',
                    fontSize: '24px',
                    fontWeight: '300',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(200, 150, 100, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(200, 150, 100, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(200, 150, 100, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(200, 150, 100, 0.3)';
                  }}
                >×</button>
              </div>

              {/* Stats Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
              }}>
                <div style={{
                  background: 'rgba(200, 150, 100, 0.08)',
                  border: '1px solid rgba(200, 150, 100, 0.25)',
                  borderRadius: '12px',
                  padding: '20px',
                }}>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: '600', letterSpacing: '0.5px' }}>Vendite Totali</div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#fff', letterSpacing: '-1px' }}>{selectedSeller.totalSales}</div>
                </div>
                <div style={{
                  background: 'rgba(72, 199, 116, 0.08)',
                  border: '1px solid rgba(72, 199, 116, 0.25)',
                  borderRadius: '12px',
                  padding: '20px',
                }}>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: '600', letterSpacing: '0.5px' }}>Confermate</div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#48c774', letterSpacing: '-1px' }}>{selectedSeller.confirmedSales}</div>
                </div>
                <div style={{
                  background: 'rgba(255, 193, 7, 0.08)',
                  border: '1px solid rgba(255, 193, 7, 0.25)',
                  borderRadius: '12px',
                  padding: '20px',
                }}>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: '600', letterSpacing: '0.5px' }}>In Sospeso</div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#ffc107', letterSpacing: '-1px' }}>{selectedSeller.pendingSales}</div>
                </div>
                <div style={{
                  background: 'rgba(200, 150, 100, 0.08)',
                  border: '1px solid rgba(200, 150, 100, 0.25)',
                  borderRadius: '12px',
                  padding: '20px',
                }}>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: '600', letterSpacing: '0.5px' }}>Fatturato</div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#c89664', letterSpacing: '-1px' }}>
                    {selectedSeller.revenue.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}
                  </div>
                </div>
              </div>

              {/* Metodi di Pagamento */}
              <div style={{
                background: 'rgba(20, 20, 20, 0.5)',
                border: '1px solid rgba(200, 150, 100, 0.2)',
                borderRadius: '12px',
                padding: '24px',
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#c89664', 
                  marginBottom: '20px', 
                  letterSpacing: '-0.3px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <CreditCard size={20} color="#c89664" />
                  Metodi di Pagamento
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{selectedSeller.cashSales}</div>
                    <div style={{ fontSize: '13px', color: '#888', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <Banknote size={14} color="#c89664" />
                      Contanti
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{selectedSeller.cardSales}</div>
                    <div style={{ fontSize: '13px', color: '#888', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <CreditCard size={14} color="#c89664" />
                      Carta
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{selectedSeller.totalSales - selectedSeller.cashSales - selectedSeller.cardSales}</div>
                    <div style={{ fontSize: '13px', color: '#888', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <RefreshCw size={14} color="#c89664" />
                      Altro
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Chart - Hidden for Promoter */}
        {user?.role !== 'Promoter' && <RevenueChart t={t} />}

        {/* Booking Stats Widget - Hidden for Promoter */}
        {user?.role !== 'Promoter' && <BookingStatsWidget t={t} />}

        {/* TODAY STATS - Riepilogo Giornaliero */}
        <div style={{
          background: 'rgba(20, 20, 20, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(200, 150, 100, 0.3)',
          borderRadius: '12px',
          padding: '24px',
          marginTop: '30px',
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#fff',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <BarChart3 size={22} color="#c89664" />
            Riepilogo Giornaliero - {now.getDate().toString().padStart(2, '0')}/{(now.getMonth() + 1).toString().padStart(2, '0')}/{now.getFullYear()}
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
          }}>
            {/* Totale Oggi */}
            <div style={{
              background: 'rgba(10, 10, 10, 0.4)',
              borderRadius: '10px',
              padding: '16px',
              border: '1px solid rgba(200, 150, 100, 0.2)',
            }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: '500' }}>
                Ticket Oggi
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#fff' }}>
                {todayStats.total}
              </div>
            </div>

            {/* Confermati Oggi */}
            <div style={{
              background: 'rgba(10, 10, 10, 0.4)',
              borderRadius: '10px',
              padding: '16px',
              border: '1px solid rgba(34, 197, 94, 0.2)',
            }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: '500' }}>
                Confermati
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#22c55e' }}>
                {todayStats.confirmed}
              </div>
            </div>

            {/* In Sospeso Oggi */}
            <div style={{
              background: 'rgba(10, 10, 10, 0.4)',
              borderRadius: '10px',
              padding: '16px',
              border: '1px solid rgba(234, 179, 8, 0.2)',
            }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: '500' }}>
                In Sospeso
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#eab308' }}>
                {todayStats.pending}
              </div>
            </div>

            {/* Revenue Oggi - Hide for Promoter */}
            {user?.role !== 'Promoter' && (
              <div style={{
                background: 'rgba(10, 10, 10, 0.4)',
                borderRadius: '10px',
                padding: '16px',
                border: '1px solid rgba(200, 150, 100, 0.3)',
              }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: '500' }}>
                  Incasso Oggi
                </div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#c89664' }}>
                  €{todayStats.revenue.toFixed(0)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
