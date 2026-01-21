'use client';

import { Trophy, Medal, TrendingUp, Zap, Target, Award } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
  setPeriod: (period: 'today' | 'week' | 'month') => void;
  t: (key: string) => string;
  onSelectSeller?: (seller: SalesData) => void;
}

export default function TeamPerformance({ salesData, period, setPeriod, t, onSelectSeller }: TeamPerformanceProps) {
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();
  
  // Ordina per revenue decrescente
  const sortedData = [...salesData].sort((a, b) => b.revenue - a.revenue);
  
  // Mostra solo i primi 5 o tutti in base allo stato
  const displayedData = showAll ? sortedData : sortedData.slice(0, 5);

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy size={32} color="#FFD700" strokeWidth={1.5} />;
      case 1:
        return <Medal size={32} color="#C0C0C0" strokeWidth={1.5} />;
      case 2:
        return <Medal size={32} color="#CD7F32" strokeWidth={1.5} />;
      default:
        return <Award size={24} color="#888" strokeWidth={1.5} />;
    }
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 0:
        return { bg: 'rgba(255, 215, 0, 0.15)', border: 'rgba(255, 215, 0, 0.4)', text: '#FFD700' };
      case 1:
        return { bg: 'rgba(192, 192, 192, 0.15)', border: 'rgba(192, 192, 192, 0.4)', text: '#C0C0C0' };
      case 2:
        return { bg: 'rgba(205, 127, 50, 0.15)', border: 'rgba(205, 127, 50, 0.4)', text: '#CD7F32' };
      default:
        return { bg: 'rgba(20, 20, 20, 0.4)', border: 'rgba(200, 150, 100, 0.2)', text: '#888' };
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('it-IT', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <>
      <style jsx>{`
        .team-performance-container {
          background: linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(15, 15, 18, 0.9) 100%);
          backdrop-filter: blur(30px);
          border: 2px solid rgba(200, 150, 100, 0.25);
          borderRadius: 24px;
          padding: 32px;
          margin-bottom: 24px;
          margin-top: 28px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08);
          transition: all 0.4s ease;
        }
        .member-card {
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
          z-index: 1;
        }
        .member-position {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .member-info {
          display: flex;
          align-items: center;
          gap: 15px;
          flex: 1;
          min-width: 0;
        }
        .member-stats {
          display: flex;
          gap: 30px;
          align-items: center;
        }
        @media (max-width: 768px) {
          .team-performance-container {
            padding: 16px;
            margin-top: 16px;
          }
          .member-card {
            flex-wrap: wrap;
            gap: 12px;
          }
          .member-position {
            min-width: 50px;
          }
          .member-info {
            flex: 1;
            min-width: 120px;
          }
          .member-stats {
            width: 100%;
            justify-content: space-between;
            gap: 12px;
            margin-top: 8px;
            padding-left: 62px;
          }
          .stat-item {
            text-align: center;
          }
          .top-badge {
            position: static !important;
            margin-top: 8px;
            margin-left: 62px;
            align-self: flex-start;
          }
        }
      `}</style>
      <div className="team-performance-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.05))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Trophy size={26} color="#FFD700" strokeWidth={1.5} />
          </div>
          <h3 style={{ 
            fontSize: '26px', 
            fontWeight: '700', 
            color: '#fff', 
            letterSpacing: '-0.3px', 
            margin: 0,
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
          }}>
            {t('teamPerformance.title')}
          </h3>
        </div>
        
        {/* Period Selector */}
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

      {/* Leaderboard */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {displayedData.map((member, index) => {
          const colors = getPositionColor(index);
          const isTopThree = index < 3;
          
          return (
            <div
              key={index}
              style={{
                background: colors.bg,
                border: `2px solid ${colors.border}`,
                borderRadius: '10px',
                padding: isTopThree ? '12px 16px' : '10px 14px',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              onClick={() => router.push(`/user/${encodeURIComponent(member.name)}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(5px)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${colors.border}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Gradient Overlay */}
              {isTopThree && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '200px',
                  height: '200px',
                  background: `radial-gradient(circle at center, ${colors.text}15 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />
              )}

              <div className="member-card">
                {/* Position Number (only from 4th place) */}
                {!isTopThree && (
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: colors.text,
                    minWidth: '32px',
                    textAlign: 'center',
                  }}>
                    #{index + 1}
                  </div>
                )}

                {/* Avatar & Info */}
                <div className="member-info">
                  {/* Avatar */}
                  <div style={{
                    width: isTopThree ? '50px' : '44px',
                    height: isTopThree ? '50px' : '44px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #c89664 0%, #d4a574 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isTopThree ? '22px' : '18px',
                    fontWeight: '600',
                    color: '#0a0a0a',
                    border: isTopThree ? `2px solid ${colors.text}` : '2px solid rgba(200, 150, 100, 0.2)',
                    boxShadow: isTopThree ? `0 3px 12px ${colors.text}30` : 'none',
                    flexShrink: 0,
                  }}>
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* Name, Role & Stats */}
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                      <div style={{ 
                        fontSize: isTopThree ? '17px' : '15px', 
                        fontWeight: isTopThree ? '600' : '500', 
                        color: '#fff',
                        letterSpacing: '0.2px',
                      }}>
                        {member.name}
                      </div>
                      <div style={{ 
                        fontSize: '10px', 
                        color: colors.text, 
                        textTransform: 'uppercase', 
                        letterSpacing: '1px',
                        fontWeight: '600',
                      }}>
                        {member.role}
                      </div>
                    </div>
                    
                    {/* Sales inline */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{ 
                          fontSize: isTopThree ? '20px' : '18px', 
                          fontWeight: '700', 
                          color: colors.text,
                        }}>
                          {member.totalSales}
                        </span>
                        <span style={{ fontSize: '11px', color: '#888' }}>vendite</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#888' }}>
                        ✓ {member.confirmedSales} conf.
                      </div>
                      <div style={{ fontSize: '11px', color: '#666' }}>
                        ⏳ {member.pendingSales} sosp.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top 3 Badge with Medal */}
              {isTopThree && (
                <div className="top-badge" style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  padding: '4px 10px',
                  background: colors.text,
                  color: '#0a0a0a',
                  borderRadius: '16px',
                  fontSize: '10px',
                  fontWeight: '700',
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: `0 2px 8px ${colors.text}40`,
                }}>
                  {index === 0 ? <Trophy size={14} color="#c89664" /> : 
                   index === 1 ? <Medal size={14} color="#9ca3af" /> :
                   <Medal size={14} color="#cd7f32" />}
                  Top {index + 1}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Button to show all users if there are more than 5 */}
      {sortedData.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            marginTop: '16px',
            padding: '12px 24px',
            background: 'rgba(200, 150, 100, 0.15)',
            border: '1px solid rgba(200, 150, 100, 0.3)',
            borderRadius: '8px',
            color: '#c89664',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(200, 150, 100, 0.25)';
            e.currentTarget.style.borderColor = 'rgba(200, 150, 100, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(200, 150, 100, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(200, 150, 100, 0.3)';
          }}
        >
          {showAll ? 'Mostra meno' : `Mostra tutti (${sortedData.length})`}
        </button>
      )}

      {/* Footer Message */}
      {sortedData.length > 0 && (
        <div style={{
          marginTop: '25px',
          padding: '20px',
          background: 'rgba(200, 150, 100, 0.1)',
          border: '1px solid rgba(200, 150, 100, 0.2)',
          borderRadius: '10px',
          textAlign: 'center',
        }}>
          <Zap size={24} color="#c89664" strokeWidth={1.5} style={{ margin: '0 auto 10px' }} />
          <p style={{ 
            fontSize: '14px', 
            color: '#c89664', 
            margin: 0,
            fontWeight: '400',
            letterSpacing: '0.5px',
          }}>
            💪 Continua così! La competizione rende tutti migliori!
          </p>
        </div>
      )}
    </div>

    <style jsx>{`
      .member-card {
        display: flex;
        align-items: center;
        gap: 12px;
        position: relative;
        z-index: 1;
      }

      .member-info {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
        min-width: 0;
      }

      @media (max-width: 768px) {
        .member-card {
          gap: 10px;
        }

        .member-info {
          gap: 10px;
        }
      }
    `}</style>
    </>
  );
}
