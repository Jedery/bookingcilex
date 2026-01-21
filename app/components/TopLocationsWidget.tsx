'use client';

import { MapPin, TrendingUp, Award } from 'lucide-react';

interface TopLocationsWidgetProps {
  t: (key: string) => string;
}

export default function TopLocationsWidget({ t }: TopLocationsWidgetProps) {
  // Mock data - da sostituire con dati reali
  const locations = [
    {
      name: "Playa d'en Bossa",
      sales: 145,
      revenue: 43500,
      trend: 18,
      trendDirection: 'up' as const,
      rank: 1,
    },
    {
      name: 'Ushuaïa Beach',
      sales: 132,
      revenue: 39600,
      trend: 12,
      trendDirection: 'up' as const,
      rank: 2,
    },
    {
      name: 'Cala Jondal',
      sales: 98,
      revenue: 29400,
      trend: -5,
      trendDirection: 'down' as const,
      rank: 3,
    },
  ];

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return '#c89664';
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.85) 0%, rgba(15, 15, 18, 0.95) 100%)',
      backdropFilter: 'blur(30px)',
      borderRadius: '24px',
      padding: '36px',
      border: '2px solid rgba(200, 150, 100, 0.25)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      transition: 'all 0.4s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MapPin size={28} strokeWidth={1.5} color="#c89664" />
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#fff',
            letterSpacing: '-0.5px',
          }}>
            Top Locations
          </h3>
        </div>
        <div style={{
          padding: '6px 12px',
          background: 'rgba(200, 150, 100, 0.15)',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#c89664',
          fontWeight: '600',
        }}>
          Oggi
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {locations.map((location, idx) => (
          <div
            key={idx}
            style={{
              background: `linear-gradient(135deg, rgba(200, 150, 100, 0.12) 0%, rgba(200, 150, 100, 0.04) 100%)`,
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid rgba(200, 150, 100, 0.25)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(200, 150, 100, 0.2) 0%, rgba(200, 150, 100, 0.08) 100%)';
              e.currentTarget.style.borderColor = 'rgba(200, 150, 100, 0.5)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(200, 150, 100, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(200, 150, 100, 0.12) 0%, rgba(200, 150, 100, 0.04) 100%)';
              e.currentTarget.style.borderColor = 'rgba(200, 150, 100, 0.25)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
            }}
          >
            {/* Rank Badge */}
            <div style={{
              position: 'absolute',
              top: '15px',
              left: '15px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: getRankColor(location.rank),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '700',
              color: '#000',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            }}>
              {location.rank}
            </div>

            <div style={{ marginLeft: '45px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
                    {location.name}
                  </h4>
                  <div style={{ fontSize: '13px', color: '#888', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} />
                    <span>Ibiza</span>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  background: location.trendDirection === 'up' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(244, 67, 54, 0.15)',
                  borderRadius: '6px',
                }}>
                  <TrendingUp
                    size={14}
                    color={location.trendDirection === 'up' ? '#4CAF50' : '#F44336'}
                    style={{ transform: location.trendDirection === 'down' ? 'rotate(180deg)' : 'none' }}
                  />
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: location.trendDirection === 'up' ? '#4CAF50' : '#F44336',
                  }}>
                    {location.trend > 0 ? '+' : ''}{location.trend}%
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
                    Vendite
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#c89664' }}>
                    {location.sales}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
                    Revenue
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#4CAF50' }}>
                    €{location.revenue.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button style={{
        marginTop: '20px',
        width: '100%',
        padding: '12px',
        background: 'rgba(200, 150, 100, 0.1)',
        border: '1px solid rgba(200, 150, 100, 0.3)',
        borderRadius: '8px',
        color: '#c89664',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(200, 150, 100, 0.2)';
        e.currentTarget.style.borderColor = 'rgba(200, 150, 100, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(200, 150, 100, 0.1)';
        e.currentTarget.style.borderColor = 'rgba(200, 150, 100, 0.3)';
      }}>
        Vedi Tutte le Location →
      </button>
    </div>
  );
}
