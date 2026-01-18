'use client';

export default function Sidebar({ t }: { t: (key: string) => string }) {

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          📱 {t('sidebar.brand')}
        </a>
      </div>
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <a href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px' }}>
            📊 {t('sidebar.dashboard')}
          </a>
        </li>
        <li className="sidebar-item">
          <a href="/bookings/list" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px' }}>
            📅 {t('sidebar.bookings')}
          </a>
        </li>
        <li className="sidebar-item" style={{ paddingLeft: '30px' }}>
          <a href="/bookings/add" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px' }}>
            ➕ Add Booking
          </a>
        </li>
        <li className="sidebar-item" style={{ paddingLeft: '30px' }}>
          <a href="/bookings/list" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px' }}>
            📋 List Bookings
          </a>
        </li>
        <li className="sidebar-item">
          <a href="#" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px' }}>
            👤 {t('sidebar.profile')}
          </a>
        </li>
        <li className="sidebar-item">
          <a href="#" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px' }}>
            🚪 {t('sidebar.logout')}
          </a>
        </li>
      </ul>
    </div>
  );
}
