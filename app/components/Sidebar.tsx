'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, Calendar, Plus, List, User, Users, LogOut, ChevronRight } from 'lucide-react';

export default function Sidebar({ t }: { t: (key: string) => string }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [bookingsOpen, setBookingsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <a href="/" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
          <div className="sidebar-brand-logo">CILEX</div>
          <div className="sidebar-brand-subtitle">Ibiza Luxury Concierge Services</div>
        </a>
      </div>
      
      {user && (
        <div style={{
          padding: '20px',
          marginBottom: '30px',
          borderTop: '1px solid rgba(200, 150, 100, 0.2)',
          borderBottom: '1px solid rgba(200, 150, 100, 0.2)',
          textAlign: 'center',
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #c89664 0%, #d4a574 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: '300',
            color: '#0a0a0a',
            margin: '0 auto 12px',
            border: '2px solid rgba(200, 150, 100, 0.5)',
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div style={{
            fontSize: '14px',
            fontWeight: '300',
            color: '#fff',
            marginBottom: '4px',
          }}>
            {user.name}
          </div>
          <div style={{
            fontSize: '11px',
            fontWeight: '300',
            color: '#c89664',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}>
            {user.role}
          </div>
        </div>
      )}
      
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <a href="/" className="sidebar-link">
            <span className="sidebar-icon">
              <LayoutDashboard size={20} strokeWidth={1.5} />
            </span>
            <span className="sidebar-text">{t('sidebar.dashboard')}</span>
          </a>
        </li>
        <li className="sidebar-item">
          <div 
            className="sidebar-link" 
            style={{ cursor: 'pointer' }}
            onClick={() => setBookingsOpen(!bookingsOpen)}
          >
            <span className="sidebar-icon">
              <Calendar size={20} strokeWidth={1.5} />
            </span>
            <span className="sidebar-text">{t('sidebar.bookings')}</span>
            <span style={{ marginLeft: 'auto', transition: 'transform 0.3s ease', transform: bookingsOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
              <ChevronRight size={16} />
            </span>
          </div>
        </li>
        {bookingsOpen && (
          <>
            <li className="sidebar-item sidebar-subitem">
              <a href="/bookings/add" className="sidebar-link">
                <span className="sidebar-icon">
                  <Plus size={18} strokeWidth={1.5} />
                </span>
                <span className="sidebar-text">Add Booking</span>
              </a>
            </li>
            <li className="sidebar-item sidebar-subitem">
              <a href="/bookings/list" className="sidebar-link">
                <span className="sidebar-icon">
                  <List size={18} strokeWidth={1.5} />
                </span>
                <span className="sidebar-text">List Bookings</span>
              </a>
            </li>
          </>
        )}
        <li className="sidebar-item">
          <a href="/my-profile" className="sidebar-link">
            <span className="sidebar-icon">
              <User size={20} strokeWidth={1.5} />
            </span>
            <span className="sidebar-text">{t('sidebar.myProfile')}</span>
          </a>
        </li>
        {user?.role === 'SuperAdmin' && (
          <li className="sidebar-item">
            <a href="/profile" className="sidebar-link">
              <span className="sidebar-icon">
                <Users size={20} strokeWidth={1.5} />
              </span>
              <span className="sidebar-text">{t('sidebar.manageProfiles')}</span>
            </a>
          </li>
        )}
        <li className="sidebar-item" style={{ marginTop: 'auto' }}>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); handleLogout(); }}
            className="sidebar-link"
          >
            <span className="sidebar-icon">
              <LogOut size={20} strokeWidth={1.5} />
            </span>
            <span className="sidebar-text">{t('sidebar.logout')}</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
