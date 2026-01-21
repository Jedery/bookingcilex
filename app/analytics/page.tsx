'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useTranslation } from '../i18n/useTranslation';
import { MapPin, Clock, TrendingUp, Calendar, Award, Trophy } from 'lucide-react';

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');

  // MOCK DATA - Locations Performance
  const locationData = [
    { name: 'Playa d\'en Bossa', sales: 145, revenue: 43500, trend: 15 },
    { name: 'Cala Jondal', sales: 98, revenue: 38200, trend: 8 },
    { name: 'Ses Salines', sales: 87, revenue: 28900, trend: -3 },
    { name: 'Cala Bassa', sales: 76, revenue: 24800, trend: 12 },
    { name: 'Talamanca', sales: 54, revenue: 18600, trend: 5 },
  ];

  // MOCK DATA - Time Analytics (vendite per fascia oraria)
  const timeSlots = [
    { time: '08:00-10:00', sales: 12 },
    { time: '10:00-12:00', sales: 45 },
    { time: '12:00-14:00', sales: 78 },
    { time: '14:00-16:00', sales: 92 },
    { time: '16:00-18:00', sales: 115 },
    { time: '18:00-20:00', sales: 98 },
    { time: '20:00-22:00', sales: 67 },
    { time: '22:00-24:00', sales: 23 },
  ];

  // MOCK DATA - Seasonal Trends
  const seasonalData = [
    { month: 'Maggio', sales: 320, avgDaily: 10 },
    { month: 'Giugno', sales: 850, avgDaily: 28 },
    { month: 'Luglio', sales: 1240, avgDaily: 40 },
    { month: 'Agosto', sales: 1580, avgDaily: 51 },
    { month: 'Settembre', sales: 920, avgDaily: 31 },
    { month: 'Ottobre', sales: 450, avgDaily: 15 },
  ];

  const maxTimeSlotSales = Math.max(...timeSlots.map(t => t.sales));

  return (
    <div className="dashboard-container">
      <Sidebar t={t} />
      
      <div className="main-content" style={{ padding: '40px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px', marginLeft: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            <TrendingUp size={36} color="#c89664" strokeWidth={1.5} />
            <h1 style={{ margin: 0, fontSize: '36px', fontWeight: '700', color: '#fff' }}>
              {t('analytics.title')}
            </h1>
          </div>
          <p style={{ color: '#888', fontSize: '15px', margin: 0 }}>
            {t('analytics.subtitle')}
          </p>
        </div>

        {/* Period Filter */}
        <div style={{ 
          marginBottom: '36px',
          display: 'flex',
          gap: '14px',
          flexWrap: 'wrap',
        }}>
          {(['day', 'week', 'month'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: '14px 28px',
                background: period === p ? 'linear-gradient(135deg, rgba(200, 150, 100, 0.35), rgba(200, 150, 100, 0.25))' : 'rgba(20, 20, 20, 0.7)',
                border: `2px solid ${period === p ? 'rgba(200, 150, 100, 0.7)' : 'rgba(200, 150, 100, 0.25)'}`,
                borderRadius: '12px',
                color: period === p ? '#c89664' : '#888',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: period === p ? '0 4px 20px rgba(200, 150, 100, 0.3)' : 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {p === 'day' ? t('dashboard.today') : p === 'week' ? t('dashboard.thisWeek') : t('dashboard.thisMonth')}
            </button>
          ))}
        </div>

        {/* 1. LOCATION PERFORMANCE */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(15, 15, 18, 0.9) 100%)',
          backdropFilter: 'blur(30px)',
          border: '2px solid rgba(200, 150, 100, 0.25)',
          borderRadius: '24px',
          padding: '36px',
          marginBottom: '32px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          transition: 'all 0.4s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
            <MapPin size={28} color="#c89664" strokeWidth={1.5} />
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', margin: 0 }}>
              {t('analytics.locationPerformance')}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {locationData.map((location, index) => {
              const isTop = index < 3;
              const colors = ['#FFD700', '#C0C0C0', '#CD7F32'];
              
              return (
                <div
                  key={location.name}
                  style={{
                    background: isTop ? 'linear-gradient(135deg, rgba(200, 150, 100, 0.15), rgba(200, 150, 100, 0.08))' : 'rgba(10, 10, 10, 0.5)',
                    border: `2px solid ${isTop ? 'rgba(200, 150, 100, 0.4)' : 'rgba(200, 150, 100, 0.2)'}`,
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    boxShadow: isTop ? '0 4px 20px rgba(200, 150, 100, 0.15)' : '0 2px 10px rgba(0, 0, 0, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(8px) translateY(-2px)';
                    e.currentTarget.style.borderColor = 'rgba(200, 150, 100, 0.6)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(200, 150, 100, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0) translateY(0)';
                    e.currentTarget.style.borderColor = isTop ? 'rgba(200, 150, 100, 0.4)' : 'rgba(200, 150, 100, 0.2)';
                    e.currentTarget.style.boxShadow = isTop ? '0 4px 20px rgba(200, 150, 100, 0.15)' : '0 2px 10px rgba(0, 0, 0, 0.2)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                    {/* Position */}
                    {isTop ? (
                      <div style={{ fontSize: '24px' }}>
                        {['🥇', '🥈', '🥉'][index]}
                      </div>
                    ) : (
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(200, 150, 100, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#888',
                      }}>
                        #{index + 1}
                      </div>
                    )}

                    {/* Location Name */}
                    <div>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#fff',
                        marginBottom: '4px',
                      }}>
                        {location.name}
                      </div>
                      <div style={{ fontSize: '13px', color: '#888' }}>
                        {location.sales} {t('analytics.sales')} • €{location.revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Trend */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: location.trend > 0 ? 'rgba(72, 199, 116, 0.2)' : 'rgba(212, 73, 95, 0.2)',
                    borderRadius: '8px',
                  }}>
                    <span style={{ fontSize: '18px' }}>
                      {location.trend > 0 ? '📈' : '📉'}
                    </span>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: location.trend > 0 ? '#48c774' : '#d4495f',
                    }}>
                      {location.trend > 0 ? '+' : ''}{location.trend}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. TIME ANALYTICS */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(15, 15, 18, 0.9) 100%)',
          backdropFilter: 'blur(30px)',
          border: '2px solid rgba(200, 150, 100, 0.25)',
          borderRadius: '24px',
          padding: '36px',
          marginBottom: '32px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          transition: 'all 0.4s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
            <Clock size={28} color="#c89664" strokeWidth={1.5} />
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', margin: 0 }}>
              {t('analytics.timeAnalysis')}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {timeSlots.map((slot) => {
              const percentage = (slot.sales / maxTimeSlotSales) * 100;
              const isHotTime = slot.sales > 90;
              
              return (
                <div key={slot.time}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                  }}>
                    <span style={{ fontSize: '14px', color: '#888', fontWeight: '600' }}>
                      {slot.time}
                    </span>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: isHotTime ? '#c89664' : '#fff',
                    }}>
                      {slot.sales} {t('analytics.sales')}
                      {isHotTime && ' 🔥'}
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '12px',
                    background: 'rgba(10, 10, 10, 0.6)',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      background: isHotTime
                        ? 'linear-gradient(90deg, #c89664, #d4a574)'
                        : 'linear-gradient(90deg, rgba(200, 150, 100, 0.6), rgba(200, 150, 100, 0.3))',
                      transition: 'width 0.5s ease',
                      borderRadius: '6px',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hot Time Insight */}
          <div style={{
            marginTop: '25px',
            padding: '20px',
            background: 'rgba(200, 150, 100, 0.1)',
            border: '1px solid rgba(200, 150, 100, 0.3)',
            borderRadius: '10px',
          }}>
            <div style={{ fontSize: '14px', color: '#c89664', fontWeight: '600', marginBottom: '8px' }}>
              💡 {t('analytics.insight')}
            </div>
            <div style={{ fontSize: '13px', color: '#aaa', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: t('analytics.timeSlotInsight') }} />
          </div>
        </div>

        {/* 3. SEASONAL TRENDS */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(15, 15, 18, 0.9) 100%)',
          backdropFilter: 'blur(30px)',
          border: '2px solid rgba(200, 150, 100, 0.25)',
          borderRadius: '24px',
          padding: '36px',
          marginBottom: '32px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          transition: 'all 0.4s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
            <Calendar size={28} color="#c89664" strokeWidth={1.5} />
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', margin: 0 }}>
              {t('analytics.seasonalTrends')}
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '16px',
            marginBottom: '30px',
          }}>
            {seasonalData.map((month, index) => {
              const isPeak = month.avgDaily > 40;
              return (
                <div
                  key={month.month}
                  style={{
                    background: isPeak ? 'rgba(200, 150, 100, 0.15)' : 'rgba(10, 10, 10, 0.4)',
                    border: `2px solid ${isPeak ? 'rgba(200, 150, 100, 0.4)' : 'rgba(200, 150, 100, 0.2)'}`,
                    borderRadius: '10px',
                    padding: '20px',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(200, 150, 100, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {isPeak && (
                    <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                      <Trophy size={24} color="#c89664" />
                    </div>
                  )}
                  <div style={{
                    fontSize: '14px',
                    color: '#888',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '10px',
                  }}>
                    {month.month}
                  </div>
                  <div style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: isPeak ? '#c89664' : '#fff',
                    marginBottom: '8px',
                  }}>
                    {month.sales}
                  </div>
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    ~{month.avgDaily}{t('analytics.perDay')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Peak Season Insight */}
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(200, 150, 100, 0.2), rgba(200, 150, 100, 0.05))',
            border: '1px solid rgba(200, 150, 100, 0.3)',
            borderRadius: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Award size={24} color="#c89664" strokeWidth={1.5} />
              <div style={{ fontSize: '14px', color: '#c89664', fontWeight: '600' }}>
                {t('analytics.seasonalAnalysis')}
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#aaa', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: t('analytics.seasonInsight') }} />
          </div>
        </div>
      </div>
    </div>
  );
}
