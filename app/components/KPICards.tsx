'use client';

interface KPICard {
  label: string;
  value: number;
  change?: number;
  icon: string;
  color?: string; // Primary color for the card
  bgColor?: string; // Background color
}

interface KPICardsProps {
  cards: KPICard[];
}

export default function KPICards({ cards }: KPICardsProps) {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
      gap: '24px',
      marginBottom: '30px',
    }}>
      {cards.map((card, index) => (
        <div
          key={index}
          style={{
            position: 'relative',
            background: `linear-gradient(135deg, ${card.bgColor || 'rgba(26, 26, 30, 0.95)'} 0%, rgba(15, 15, 18, 0.95) 100%)`,
            backdropFilter: 'blur(20px)',
            border: `2px solid ${card.color || 'rgba(200, 150, 100, 0.2)'}`,
            borderRadius: '20px',
            padding: '28px',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            overflow: 'hidden',
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.borderColor = card.color || 'rgba(200, 150, 100, 0.6)';
            e.currentTarget.style.boxShadow = `0 20px 60px ${card.color || 'rgba(200, 150, 100, 0.3)'}, inset 0 1px 0 rgba(255, 255, 255, 0.1)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.borderColor = card.color || 'rgba(200, 150, 100, 0.2)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)';
          }}
        >
          {/* Gradient overlay effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '120px',
            height: '120px',
            background: `radial-gradient(circle at center, ${card.color || 'rgba(200, 150, 100, 0.15)'} 0%, transparent 70%)`,
            opacity: 0.4,
            pointerEvents: 'none',
          }} />
          
          {/* Icon container with modern design */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '24px',
          }}>
            <p style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              color: '#888', 
              letterSpacing: '2px', 
              textTransform: 'uppercase',
              margin: 0,
            }}>
              {card.label}
            </p>
            
            {/* Modern icon circle */}
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${card.color || 'rgba(200, 150, 100, 0.2)'}, transparent)`,
              border: `1.5px solid ${card.color || 'rgba(200, 150, 100, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              boxShadow: `0 8px 24px ${card.color || 'rgba(200, 150, 100, 0.15)'}`,
              transition: 'all 0.3s ease',
            }}>
              {card.icon}
            </div>
          </div>
          
          {/* Value and change */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-end', 
            justifyContent: 'space-between',
            gap: '12px',
          }}>
            <h2 style={{ 
              fontSize: '56px', 
              fontWeight: '700', 
              color: card.color || '#fff', 
              letterSpacing: '-2px',
              margin: 0,
              lineHeight: 1,
              textShadow: `0 4px 24px ${card.color || 'rgba(200, 150, 100, 0.3)'}`,
            }}>
              {card.value}
            </h2>
            
            {card.change !== undefined && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '12px',
                background: card.change >= 0 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1))' 
                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))',
                border: card.change >= 0 
                  ? '1px solid rgba(16, 185, 129, 0.3)' 
                  : '1px solid rgba(239, 68, 68, 0.3)',
                marginBottom: '4px',
              }}>
                <span style={{ 
                  fontSize: '18px',
                  lineHeight: 1,
                }}>
                  {card.change >= 0 ? '↗' : '↘'}
                </span>
                <span style={{
                  fontSize: '15px',
                  fontWeight: '700',
                  color: card.change >= 0 ? '#10b981' : '#ef4444',
                  letterSpacing: '0.5px',
                }}>
                  {Math.abs(card.change)}%
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
