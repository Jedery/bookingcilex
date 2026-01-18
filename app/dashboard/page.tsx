'use client';

export default function Dashboard() {
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' });
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const fullDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="main-content">
      <div className="header">
        <div>
          <div className="breadcrumb">
            <a href="/">Home</a> / Dashboard
          </div>
        </div>
        <div className="user-info">
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Hello Ignazio Office Cilex 2025!</div>
          <div style={{ fontSize: '14px', marginTop: '5px' }}>
            <div>{day}</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{time}</div>
            <div className="user-info-time">{fullDate}</div>
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: '20px' }}>Booking Resumes</h2>

      {/* Import BookingResumes component here */}
    </div>
  );
}
