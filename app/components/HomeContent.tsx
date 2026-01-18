'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import BookingResumes from './BookingResumes';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '../i18n/useTranslation';

export default function HomeContent() {
  const { t, language, setLanguage } = useTranslation();
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' });
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const fullDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="dashboard-container">
      <Sidebar t={t} />
      <div className="main-content">
        <div className="header">
          <div>
            <div className="breadcrumb">
              <a href="/">{t('header.home')}</a> / {t('header.breadcrumb')}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flex: 1 }}>
            <div className="user-info">
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{t('greeting')}</div>
              <div style={{ fontSize: '14px', marginTop: '5px' }}>
                <div>{day}</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{time}</div>
                <div className="user-info-time">{fullDate}</div>
              </div>
            </div>
            <LanguageSwitcher language={language} setLanguage={setLanguage} />
          </div>
        </div>

        <h2 style={{ marginBottom: '20px' }}>{t('bookingResumes')}</h2>
        <BookingResumes t={t} />

        <h3 style={{ marginBottom: '20px', marginTop: '30px' }}>Filter by Category</h3>
        <div className="filters-section">
          <div className="filter-group" style={{ flex: 1 }}>
            <label>{t('filters.category')}</label>
            <select>
              <option>-- {t('filters.category')} --</option>
              <option>{t('filters.music')}</option>
              <option>{t('filters.party')}</option>
              <option>{t('filters.conference')}</option>
            </select>
          </div>
        </div>

        <h3 style={{ marginBottom: '20px', marginTop: '30px' }}>Filter by Date</h3>
        <div className="filters-section">
          <div className="filter-group">
            <label>{t('filters.dateFrom')}</label>
            <input type="date" />
          </div>
          <div className="filter-group">
            <label>{t('filters.dateTo')}</label>
            <input type="date" />
          </div>
        </div>

        <div className="footer-buttons">
          <div className="card button-large" style={{ background: 'linear-gradient(135deg, #0a8a87 0%, #0d9a97 100%)', cursor: 'pointer' }}>
            💺 {t('buttons.bookings')}
          </div>
          <div className="card button-large" style={{ background: 'linear-gradient(135deg, #48c774 0%, #3db66e 100%)', cursor: 'pointer' }}>
            ➕ {t('buttons.addBooking')}
          </div>
          <div className="card button-large" style={{ background: 'linear-gradient(135deg, #0a8a87 0%, #0d9a97 100%)', cursor: 'pointer' }}>
            👤 {t('buttons.myProfile')}
          </div>
          <div className="card button-large" style={{ background: 'linear-gradient(135deg, #d4495f 0%, #c43a53 100%)', cursor: 'pointer' }}>
            🚪 {t('buttons.logout')}
          </div>
        </div>
      </div>
    </div>
  );
}
