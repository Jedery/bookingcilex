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
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: '20px',
      marginBottom: '30px',
    }}>
      {cards.map((card, index) => (
        <div
          key={index}
          style={{
            background: card.bgColor || 'rgba(20, 20, 20, 0.6)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${card.color || 'rgba(200, 150, 100, 0.3)'}`,
            borderRadius: '12px',
            padding: '25px',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.borderColor = card.color || 'rgba(200, 150, 100, 0.6)';
            e.currentTarget.style.boxShadow = `0 10px 30px ${card.color || 'rgba(200, 150, 100, 0.15)'}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = card.color || 'rgba(200, 150, 100, 0.3)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
            <p style={{ fontSize: '13px', fontWeight: '300', color: '#aaa', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {card.label}
            </p>
            <span style={{ fontSize: '24px' }}>{card.icon}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <h2 style={{ fontSize: '42px', fontWeight: '200', color: card.color || '#fff', letterSpacing: '1px' }}>
              {card.value}
            </h2>
            {card.change !== undefined && (
              <span style={{
                fontSize: '14px',
                fontWeight: '400',
                color: card.change >= 0 ? '#48c774' : '#d4495f',
              }}>
                {card.change >= 0 ? '+' : ''}{card.change}%
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
