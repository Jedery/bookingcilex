'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import KPICards from './KPICards';
import RevenueChart from './RevenueChart';
import RecentTransactions from './RecentTransactions';
import TeamPerformance from './TeamPerformance';
import SellerAnalytics from './SellerAnalytics';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '../i18n/useTranslation';
import { useAuth } from '../context/AuthContext';
import { Search, BarChart3, CheckCircle2, Clock, XCircle } from 'lucide-react';

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

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [teamSalesData, setTeamSalesData] = useState([]);
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('month');

  useEffect(() => {
    // Fetch dashboard stats
    fetch('/api/bookings')
      .then((res) => res.json())
      .then((data) => {
        const confirmed = data.filter((b: any) => b.status === 'Confirmed').length;
        const pending = data.filter((b: any) => b.status === 'Pending').length;
        const cancelled = data.filter((b: any) => b.status === 'Cancelled').length;
        const revenue = data
          .filter((b: any) => b.status === 'Confirmed')
          .reduce((sum: number, b: any) => sum + (b.total || 0), 0);

        setDashboardData({
          totalBookings: data.length,
          confirmedBookings: confirmed,
          pendingBookings: pending,
          cancelledBookings: cancelled,
          totalRevenue: revenue,
        });

        // Map recent transactions
        const transactions = data.slice(0, 8).map((b: any) => ({
          id: b.bookingId,
          name: `${b.name} - ${b.event?.name || 'N/A'}`,
          status: b.status,
          date: new Date(b.createdAt).toLocaleDateString('it-IT', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          amount: b.total || 0,
          paymentMethod: b.paymentMethod || 'N/A',
          soldBy: b.soldByName || 'N/A',
        }));
        setRecentTransactions(transactions);

        // Calculate team performance (mock data - you'll replace with real aggregation)
        const mockTeamData = [
          {
            name: 'Marco Rossi',
            role: 'Promoter',
            totalSales: 15,
            confirmedSales: 12,
            pendingSales: 3,
            cashSales: 8,
            cardSales: 7,
            revenue: 4500,
            avgConfirmTime: '2.5h',
          },
          {
            name: 'Sara Bianchi',
            role: 'Promoter',
            totalSales: 22,
            confirmedSales: 20,
            pendingSales: 2,
            cashSales: 10,
            cardSales: 12,
            revenue: 6800,
            avgConfirmTime: '1.8h',
          },
          {
            name: 'Luca Verdi',
            role: 'Manager',
            totalSales: 35,
            confirmedSales: 30,
            pendingSales: 5,
            cashSales: 18,
            cardSales: 17,
            revenue: 10200,
            avgConfirmTime: '1.2h',
          },
        ];
        setTeamSalesData(mockTeamData);
      })
      .catch((error) => console.error('Error fetching dashboard data:', error));
  }, []);

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
        <div className="header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px',
          paddingTop: '0',
        }}>
          {/* Desktop: Search + Language + User */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '20px',
            width: '100%',
            flex: 1,
          }}>
            {/* Search Bar - Solo Desktop */}
            <div style={{ 
              flex: 1, 
              maxWidth: '400px',
            }}
              className="search-desktop"
            >
              <div style={{ position: 'relative' }}>
                <Search 
                  size={18} 
                  style={{ 
                    position: 'absolute', 
                    left: '15px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#888' 
                  }} 
                />
                <input
                  type="text"
                  placeholder="Search..."
                  style={{
                    width: '100%',
                    padding: '12px 15px 12px 45px',
                    background: 'rgba(10, 10, 10, 0.6)',
                    border: '1px solid rgba(200, 150, 100, 0.3)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '300',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(200, 150, 100, 0.6)';
                    e.target.style.boxShadow = '0 0 20px rgba(200, 150, 100, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(200, 150, 100, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Mobile: Saluto Personalizzato - Allineato perfettamente */}
            <div className="mobile-greeting" style={{
              display: 'none',
              flex: 1,
              alignItems: 'center',
              gap: '10px',
              padding: '6px 10px',
              background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.6), rgba(15, 15, 18, 0.8))',
              border: '1px solid rgba(200, 150, 100, 0.2)',
              borderRadius: '12px',
              minHeight: '52px',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #c89664 0%, #d4a574 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '700',
                color: '#0a0a0a',
                border: '2px solid rgba(200, 150, 100, 0.4)',
                flexShrink: 0,
              }}>
                {user?.name?.charAt(0).toUpperCase() || 'G'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  fontSize: '9px', 
                  color: '#999',
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  fontWeight: '600',
                  marginBottom: '2px',
                  lineHeight: 1,
                }}>
                  Benvenuto
                </div>
                <div style={{ 
                  fontSize: '15px', 
                  fontWeight: '600',
                  color: '#fff',
                  letterSpacing: '0.3px',
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {user?.name || 'Guest'}
                </div>
              </div>
            </div>

            {/* Language Switcher - Migliorato */}
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
            }}>
              <LanguageSwitcher language={language} setLanguage={setLanguage} />
            </div>

            {/* User Info - Solo Desktop */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              className="user-info-desktop"
            >
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: '400', color: '#fff' }}>
                  {user?.name || 'Guest'}
                </div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                  {user?.role || 'User'}
                </div>
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #c89664 0%, #a67c52 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '500',
              }}>
                {user?.name?.charAt(0).toUpperCase() || 'G'}
              </div>
            </div>
          </div>
        </div>

        <h2 style={{ 
          marginBottom: '30px', 
          marginTop: '10px',
          fontSize: '36px', 
          fontWeight: '700', 
          letterSpacing: '0.5px',
          background: 'linear-gradient(135deg, #fff 0%, #c89664 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: 'none',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
        className="dashboard-title"
        >
          {t('dashboard.title')}
        </h2>

        <KPICards cards={kpiCards} />

        {/* Period Selector for Team Performance */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px',
          marginTop: '40px',
        }}>
          <h3 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            letterSpacing: '-0.5px',
            color: '#fff',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          }}>
            {t('dashboard.teamAnalysis')}
          </h3>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as 'today' | 'week' | 'month')}
            style={{
              padding: '10px 20px',
              background: 'rgba(10, 10, 10, 0.6)',
              border: '1px solid rgba(200, 150, 100, 0.3)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '300',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="today">{t('dashboard.today')}</option>
            <option value="week">{t('dashboard.thisWeek')}</option>
            <option value="month">{t('dashboard.thisMonth')}</option>
          </select>
        </div>

        <TeamPerformance salesData={teamSalesData} period={period} t={t} />

        {/* Seller Analytics - Solo per SuperAdmin e Founder */}
        {(user?.role === 'SuperAdmin' || user?.role === 'Founder') && (
          <SellerAnalytics sellers={sellerAnalyticsData} t={t} />
        )}

        <RevenueChart />

        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  );
}
