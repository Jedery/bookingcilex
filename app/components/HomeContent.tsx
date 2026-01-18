'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import KPICards from './KPICards';
import RevenueChart from './RevenueChart';
import RecentTransactions from './RecentTransactions';
import TeamPerformance from './TeamPerformance';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '../i18n/useTranslation';
import { useAuth } from '../context/AuthContext';
import { Search } from 'lucide-react';

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

  const kpiCards = [
    {
      label: 'Totale Bookings',
      value: dashboardData.totalBookings,
      change: 12,
      icon: '📊',
      color: '#c89664',
      bgColor: 'rgba(200, 150, 100, 0.1)',
    },
    {
      label: 'Confermati',
      value: dashboardData.confirmedBookings,
      change: 18,
      icon: '✅',
      color: '#48c774',
      bgColor: 'rgba(72, 199, 116, 0.1)',
    },
    {
      label: 'In Sospeso',
      value: dashboardData.pendingBookings,
      change: -5,
      icon: '⏳',
      color: '#ffc107',
      bgColor: 'rgba(255, 193, 7, 0.1)',
    },
    {
      label: 'Cancellati',
      value: dashboardData.cancelledBookings,
      change: -12,
      icon: '❌',
      color: '#d4495f',
      bgColor: 'rgba(212, 73, 95, 0.1)',
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
        }}>
          <div style={{ flex: 1, maxWidth: '400px' }}>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <LanguageSwitcher language={language} setLanguage={setLanguage} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
          marginBottom: '25px', 
          fontSize: '28px', 
          fontWeight: '200', 
          letterSpacing: '2px',
          color: '#fff',
        }}>
          Dashboard Overview
        </h2>

        <KPICards cards={kpiCards} />

        {/* Period Selector for Team Performance */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '300', 
            letterSpacing: '2px',
            color: '#fff',
          }}>
            Analisi Team
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
            <option value="today">Oggi</option>
            <option value="week">Questa Settimana</option>
            <option value="month">Questo Mese</option>
          </select>
        </div>

        <TeamPerformance salesData={teamSalesData} period={period} />

        <RevenueChart />

        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  );
}
