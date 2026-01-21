'use client';

import { BarChart3, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface KPICard {
  label: string;
  value: number;
  change?: number;
  icon: React.ReactNode;
  color?: string; // Primary color for the card
  bgColor?: string; // Background color
  link?: string; // Link to navigate to when card is clicked
}

interface KPICardsProps {
  cards: KPICard[];
}

export default function KPICards({ cards }: KPICardsProps) {
  const router = useRouter();

  const handleCardClick = (link?: string) => {
    if (link) {
      router.push(link);
    }
  };

  return (
    <>
      <style jsx>{`
        .kpi-cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          .kpi-cards-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-bottom: 20px;
            margin-top: 0;
          }

          .kpi-card {
            padding: 20px !important;
            border-radius: 12px !important;
            background: rgba(20, 20, 20, 0.6) !important;
            border: 1px solid rgba(200, 150, 100, 0.3) !important;
            box-shadow: none !important;
          }

          .kpi-card-header {
            margin-bottom: 16px !important;
            align-items: flex-start !important;
            min-height: 44px;
          }

          .kpi-card-label {
            font-size: 10px !important;
            letter-spacing: 1px !important;
            max-width: 65%;
            line-height: 1.4;
            display: flex;
            align-items: center;
            min-height: 44px;
          }

          .kpi-card-icon {
            width: 44px !important;
            height: 44px !important;
            border-radius: 12px !important;
            flex-shrink: 0;
          }

          .kpi-card-icon svg {
            width: 22px !important;
            height: 22px !important;
          }

          .kpi-card-value {
            font-size: 42px !important;
            letter-spacing: -1.5px !important;
          }

          .kpi-card-gradient {
            width: 60px !important;
            height: 60px !important;
            opacity: 0.25 !important;
          }
        }
      `}</style>
      <div className="kpi-cards-container">
      {cards.map((card, index) => (
        <div
          key={index}
          onClick={() => handleCardClick(card.link)}
          className="kpi-card"
          style={{
            position: 'relative',
            background: `linear-gradient(135deg, ${card.bgColor || 'rgba(26, 26, 30, 0.95)'} 0%, rgba(15, 15, 18, 0.98) 100%)`,
            backdropFilter: 'blur(30px)',
            border: `2px solid ${card.color || 'rgba(200, 150, 100, 0.25)'}`,
            borderRadius: '24px',
            padding: '32px',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: card.link ? 'pointer' : 'default',
            overflow: 'hidden',
            boxShadow: `0 12px 40px rgba(0, 0, 0, 0.5), 
                       inset 0 1px 0 rgba(255, 255, 255, 0.08),
                       0 0 0 1px rgba(0, 0, 0, 0.1)`,
          }}
          onMouseEnter={(e) => {
            if (card.link) {
              e.currentTarget.style.transform = 'translateY(-10px) scale(1.03)';
              e.currentTarget.style.borderColor = card.color || 'rgba(200, 150, 100, 0.7)';
              e.currentTarget.style.boxShadow = `0 20px 60px rgba(0, 0, 0, 0.6), 
                                                  0 0 50px ${card.color || 'rgba(200, 150, 100, 0.5)'}, 
                                                  inset 0 1px 0 rgba(255, 255, 255, 0.15),
                                                  0 0 0 1px rgba(0, 0, 0, 0.15)`;
            }
          }}
          onMouseLeave={(e) => {
            if (card.link) {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.borderColor = card.color || 'rgba(200, 150, 100, 0.25)';
              e.currentTarget.style.boxShadow = `0 12px 40px rgba(0, 0, 0, 0.5), 
                                                  inset 0 1px 0 rgba(255, 255, 255, 0.08),
                                                  0 0 0 1px rgba(0, 0, 0, 0.1)`;
            }
          }}
        >

          
          {/* Icon container with modern design */}
          <div 
            className="kpi-card-header"
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <p 
              className="kpi-card-label"
              style={{ 
                fontSize: '12px', 
                fontWeight: '600', 
                color: '#888', 
                letterSpacing: '2px', 
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              {card.label}
            </p>
            
            {/* Modern icon circle */}
            <div 
              className="kpi-card-icon"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '18px',
                background: `linear-gradient(135deg, ${card.color || 'rgba(200, 150, 100, 0.25)'}, transparent)`,
                border: `2px solid ${card.color || 'rgba(200, 150, 100, 0.4)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.color || '#c89664',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {card.icon}
            </div>
          </div>
          
          {/* Value only - removed percentage badge */}
          <div 
            className="kpi-card-footer"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'flex-start',
            }}
          >
            <h2 
              className="kpi-card-value"
              style={{ 
                fontSize: '62px', 
                fontWeight: '800', 
                color: card.color || '#fff', 
                letterSpacing: '-3px',
                margin: 0,
                lineHeight: 1,
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {card.value}
            </h2>
          </div>
        </div>
      ))}
      </div>
    </>
  );
}
