'use client';

export default function BookingResumes({ t }: { t: (key: string) => string }) {

  const data = [
    {
      id: 1,
      title: t('confirmedAndPaid'),
      number: 20,
      icon: '💺',
      className: 'booking-card-teal',
      description: '5 Events - 120 Tickets',
    },
    {
      id: 2,
      title: t('pendingAndPaid'),
      number: 0,
      icon: '💼',
      className: 'booking-card-orange',
      description: '0 Events - 0 Tickets',
    },
    {
      id: 3,
      title: t('invited'),
      number: 0,
      icon: '✉️',
      className: 'booking-card-green',
      description: '0 Events - 0 Tickets',
    },
    {
      id: 4,
      title: t('pendingAndNotPaid'),
      number: 0,
      icon: '❌',
      className: 'booking-card-red',
      description: '0 Events - 0 Tickets',
    },
  ];

  return (
    <div className="booking-cards-container">
      {data.map((item) => (
        <div key={item.id} className={`booking-card ${item.className}`}>
          <div className="booking-card-icon">{item.icon}</div>
          <div className="booking-card-number">{item.number}</div>
          <div className="booking-card-title">{item.title}</div>
          <div style={{ fontSize: '12px', marginTop: '10px', opacity: 0.8 }}>
            {item.description}
          </div>
        </div>
      ))}
    </div>
  );
}
