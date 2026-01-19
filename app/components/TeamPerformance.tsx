'use client';

import { TrendingUp, DollarSign, CreditCard, Banknote } from 'lucide-react';

interface SalesData {
  name: string;
  role: string;
  totalSales: number;
  confirmedSales: number;
  pendingSales: number;
  cashSales: number;
  cardSales: number;
  revenue: number;
  avgConfirmTime: string;
}

interface TeamPerformanceProps {
  salesData: SalesData[];
  period: 'today' | 'week' | 'month';
  t: (key: string) => string;
}

export default function TeamPerformance({ salesData, period, t }: TeamPerformanceProps) {
  return (
    <div style={{
      background: 'rgba(20, 20, 20, 0.6)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(200, 150, 100, 0.3)',
      borderRadius: '12px',
      padding: '30px',
      marginBottom: '30px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '300', color: '#fff', letterSpacing: '2px' }}>
          {t('teamPerformance.title')} - {t(`dashboard.${period === 'today' ? 'today' : period === 'week' ? 'thisWeek' : 'thisMonth'}`)}
        </h3>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {salesData.map((member, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(10, 10, 10, 0.4)',
              border: '1px solid rgba(200, 150, 100, 0.2)',
              borderRadius: '10px',
              padding: '20px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(200, 150, 100, 0.5)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(200, 150, 100, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Header: Name + Role */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #c89664 0%, #d4a574 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: '400',
                  color: '#0a0a0a',
                }}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '400', color: '#fff' }}>
                    {member.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#c89664', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {member.role}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '200', color: '#48c774' }}>
                {member.revenue.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
              {/* Total Sales */}
              <div style={{ 
                background: 'rgba(72, 199, 116, 0.1)', 
                border: '1px solid rgba(72, 199, 116, 0.3)',
                borderRadius: '8px', 
                padding: '15px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <TrendingUp size={16} color="#48c774" />
                  <span style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Vendite Totali
                  </span>
                </div>
                <div style={{ fontSize: '28px', fontWeight: '200', color: '#48c774' }}>
                  {member.totalSales}
                </div>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                  {member.confirmedSales} confermate
                </div>
              </div>

              {/* Pending */}
              <div style={{ 
                background: 'rgba(255, 193, 7, 0.1)', 
                border: '1px solid rgba(255, 193, 7, 0.3)',
                borderRadius: '8px', 
                padding: '15px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    In Sospeso
                  </span>
                </div>
                <div style={{ fontSize: '28px', fontWeight: '200', color: '#ffc107' }}>
                  {member.pendingSales}
                </div>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                  Media conferma: {member.avgConfirmTime}
                </div>
              </div>

              {/* Cash */}
              <div style={{ 
                background: 'rgba(0, 212, 255, 0.1)', 
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '8px', 
                padding: '15px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Banknote size={16} color="#00d4ff" />
                  <span style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Contanti
                  </span>
                </div>
                <div style={{ fontSize: '28px', fontWeight: '200', color: '#00d4ff' }}>
                  {member.cashSales}
                </div>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                  {((member.cashSales / member.totalSales) * 100 || 0).toFixed(0)}% del totale
                </div>
              </div>

              {/* Card */}
              <div style={{ 
                background: 'rgba(147, 51, 234, 0.1)', 
                border: '1px solid rgba(147, 51, 234, 0.3)',
                borderRadius: '8px', 
                padding: '15px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <CreditCard size={16} color="#9333ea" />
                  <span style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Carta
                  </span>
                </div>
                <div style={{ fontSize: '28px', fontWeight: '200', color: '#9333ea' }}>
                  {member.cardSales}
                </div>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                  {((member.cardSales / member.totalSales) * 100 || 0).toFixed(0)}% del totale
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
