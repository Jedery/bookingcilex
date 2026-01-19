'use client';

import { Trophy, Medal, TrendingUp, Zap, Target, Award } from 'lucide-react';

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
  // Ordina per revenue decrescente
  const sortedData = [...salesData].sort((a, b) => b.revenue - a.revenue);

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
          background: rgba(20, 20, 20, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(200, 150, 100, 0.3);
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 30px;
        }
        @media (max-width: 768px) {
          .team-performance-container {
            padding: 20px;
            margin-top: 16px;
          }
        }
      `}</style>
      <div className="team-performance-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
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
          <div>
            <h3 style={{ 
              fontSize: '26px', 
              fontWeight: '700', 
              color: '#fff', 
              letterSpacing: '-0.3px', 
              margin: 0,
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            }}>
              🏆 Classifica Team
            </h3>
            <p style={{ 
              fontSize: '13px', 
              color: '#c89664', 
              margin: '6px 0 0 0', 
              letterSpacing: '1px',
              fontWeight: '600',
              textTransform: 'uppercase',
            }}>
              {period === 'today' ? 'Oggi' : period === 'week' ? 'Questa Settimana' : 'Questo Mese'}
            </p>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {sortedData.map((member, index) => {
          const colors = getPositionColor(index);
          const isTopThree = index < 3;
          
          return (
            <div
              key={index}
              style={{
                background: colors.bg,
                border: `2px solid ${colors.border}`,
                borderRadius: '16px',
                padding: isTopThree ? '25px' : '20px',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 1 }}>
                {/* Position & Medal */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  minWidth: isTopThree ? '80px' : '60px',
                }}>
                  {getMedalIcon(index)}
                  <div style={{
                    fontSize: isTopThree ? '32px' : '24px',
                    fontWeight: '700',
                    color: colors.text,
                    marginTop: '8px',
                    textShadow: isTopThree ? `0 0 20px ${colors.text}40` : 'none',
                  }}>
                    #{index + 1}
                  </div>
                </div>

                {/* Avatar & Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                  <div style={{
                    width: isTopThree ? '64px' : '56px',
                    height: isTopThree ? '64px' : '56px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #c89664 0%, #d4a574 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isTopThree ? '26px' : '22px',
                    fontWeight: '600',
                    color: '#0a0a0a',
                    border: isTopThree ? `3px solid ${colors.text}` : '2px solid rgba(200, 150, 100, 0.3)',
                    boxShadow: isTopThree ? `0 4px 16px ${colors.text}40` : 'none',
                  }}>
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: isTopThree ? '20px' : '18px', 
                      fontWeight: isTopThree ? '600' : '400', 
                      color: '#fff',
                      letterSpacing: '0.5px',
                    }}>
                      {member.name}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: colors.text, 
                      marginTop: '4px', 
                      textTransform: 'uppercase', 
                      letterSpacing: '1.5px',
                      fontWeight: '600',
                    }}>
                      {member.role}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ 
                  display: 'flex', 
                  gap: isTopThree ? '30px' : '20px',
                  alignItems: 'center',
                }}>
                  {/* Revenue */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px', letterSpacing: '1px' }}>
                      FATTURATO
                    </div>
                    <div style={{ 
                      fontSize: isTopThree ? '28px' : '24px', 
                      fontWeight: '700', 
                      color: '#48c774',
                      textShadow: isTopThree ? '0 0 20px rgba(72, 199, 116, 0.3)' : 'none',
                    }}>
                      {formatCurrency(member.revenue)}
                    </div>
                  </div>

                  {/* Sales */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px', letterSpacing: '1px' }}>
                      VENDITE
                    </div>
                    <div style={{ 
                      fontSize: isTopThree ? '28px' : '24px', 
                      fontWeight: '700', 
                      color: colors.text,
                    }}>
                      {member.totalSales}
                    </div>
                    <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                      {member.confirmedSales} confermate
                    </div>
                  </div>

                  {/* Conversion Rate */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px', letterSpacing: '1px' }}>
                      CONVERSIONE
                    </div>
                    <div style={{ 
                      fontSize: isTopThree ? '28px' : '24px', 
                      fontWeight: '700', 
                      color: '#4ecdc4',
                    }}>
                      {((member.confirmedSales / member.totalSales) * 100 || 0).toFixed(0)}%
                    </div>
                    <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                      ⚡ {member.avgConfirmTime}
                    </div>
                  </div>
                </div>
              </div>

              {/* Top 3 Badge */}
              {isTopThree && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  padding: '4px 12px',
                  background: colors.text,
                  color: '#0a0a0a',
                  borderRadius: '20px',
                  fontSize: '10px',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}>
                  Top {index + 1}
                </div>
              )}
            </div>
          );
        })}
      </div>

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
    </>
  );
}
