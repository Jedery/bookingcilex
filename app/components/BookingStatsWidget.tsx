'use client';

import { Clock, CreditCard, Calendar, TrendingUp } from 'lucide-react';

interface BookingStatsWidgetProps {
  t: (key: string) => string;
}

export default function BookingStatsWidget({ t }: BookingStatsWidgetProps) {
  // Mock data - da sostituire con dati reali
  const stats = [
    {
      label: 'Prenotazioni per Fascia Oraria',
      icon: <Clock size={24} strokeWidth={1.5} />,
      data: [
        { time: '08:00 - 12:00', count: 12, percentage: 15 },
        { time: '12:00 - 16:00', count: 28, percentage: 35 },
        { time: '16:00 - 20:00', count: 32, percentage: 40 },
        { time: '20:00 - 24:00', count: 8, percentage: 10 },
      ],
      color: '#c89664',
    },
    {
      label: 'Metodi di Pagamento',
      icon: <CreditCard size={24} strokeWidth={1.5} />,
      data: [
        { method: 'Carta', count: 45, percentage: 56, color: '#4CAF50' },
        { method: 'Contanti', count: 25, percentage: 31, color: '#2196F3' },
        { method: 'Bonifico', count: 10, percentage: 13, color: '#FF9800' },
      ],
      color: '#4CAF50',
    },
    {
      label: 'Tipologie Evento',
      icon: <Calendar size={24} strokeWidth={1.5} />,
      data: [
        { type: 'Beach Party', count: 38, percentage: 48 },
        { type: 'Club Night', count: 28, percentage: 35 },
        { type: 'Boat Party', count: 14, percentage: 17 },
      ],
      color: '#2196F3',
    },
  ];

  return (
    <div style={{
      background: 'rgba(10, 10, 10, 0.8)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      padding: '30px',
      border: '1px solid rgba(200, 150, 100, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <TrendingUp size={28} strokeWidth={1.5} color="#c89664" />
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#fff',
            letterSpacing: '-0.5px',
          }}>
            Statistiche Booking
          </h3>
        </div>
        <div style={{
          padding: '6px 14px',
          background: 'rgba(200, 150, 100, 0.15)',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#c89664',
          fontWeight: '600',
        }}>
          Questa Settimana
        </div>
      </div>

      <div style={{ display: 'grid', gap: '25px' }}>
        {stats.map((stat, idx) => (
          <div key={idx} style={{
            background: 'rgba(200, 150, 100, 0.05)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(200, 150, 100, 0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <div style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#e8e8e8' }}>
                {stat.label}
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {stat.data.map((item: any, i: number) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: '#b8b8b8' }}>
                      {item.time || item.method || item.type}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#e8e8e8' }}>
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div style={{
                    height: '6px',
                    background: 'rgba(200, 150, 100, 0.1)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${item.percentage}%`,
                      background: item.color || stat.color,
                      borderRadius: '3px',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
