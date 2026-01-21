'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import { useTranslation } from '../../i18n/useTranslation';
import { ArrowLeft, CheckCircle2, Clock, BarChart3, TrendingUp } from 'lucide-react';

export default function UserProfile() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const userName = decodeURIComponent(params.name as string);

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data - for now using mock data based on name
    // TODO: Replace with actual API call
    const mockUserData = {
      name: userName,
      role: 'Founder',
      totalSales: 95,
      confirmedSales: 85,
      pendingSales: 10,
      revenue: 28500,
    };
    
    setUserData(mockUserData);
    setLoading(false);
  }, [userName]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1410 100%)',
      }}>
        <Sidebar t={t} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: '#c89664', fontSize: '18px' }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .user-profile-container {
          flex: 1;
          padding: 40px;
          overflow-y: auto;
        }
        .back-button {
          margin-bottom: 30px;
        }
        .user-header-card {
          padding: 40px;
          margin-bottom: 30px;
        }
        .user-avatar {
          width: 100px;
          height: 100px;
          font-size: 42px;
        }
        .user-name {
          font-size: 36px;
        }
        .user-role-badge {
          padding: 6px 16px;
          font-size: 13px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        .stat-card {
          padding: 30px;
        }
        .stat-icon-box {
          width: 48px;
          height: 48px;
        }
        .stat-value {
          fontSize: 42px;
        }

        @media (max-width: 768px) {
          .user-profile-container {
            padding: 20px 16px;
          }
          .back-button {
            margin-bottom: 20px;
            padding: 8px 12px;
            font-size: 13px;
          }
          .user-header-card {
            padding: 20px;
            margin-bottom: 20px;
          }
          .user-avatar {
            width: 70px;
            height: 70px;
            font-size: 30px;
          }
          .user-name {
            font-size: 26px;
          }
          .user-role-badge {
            padding: 4px 12px;
            font-size: 11px;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .stat-card {
            padding: 16px;
          }
          .stat-icon-box {
            width: 36px;
            height: 36px;
          }
          .stat-icon-box svg {
            width: 18px;
            height: 18px;
          }
          .stat-label {
            font-size: 11px;
          }
          .stat-value {
            font-size: 28px;
          }
        }
      `}</style>
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1410 100%)',
      }}>
        <Sidebar t={t} />
        
        <div className="user-profile-container">
          {/* Back Button */}
          <button
            className="back-button"
            onClick={() => router.back()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: 'rgba(10, 10, 10, 0.6)',
              border: '1px solid rgba(200, 150, 100, 0.3)',
              borderRadius: '8px',
              color: '#c89664',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(200, 150, 100, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(200, 150, 100, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(10, 10, 10, 0.6)';
              e.currentTarget.style.borderColor = 'rgba(200, 150, 100, 0.3)';
            }}
          >
            <ArrowLeft size={18} />
            Torna alla Dashboard
          </button>

          {/* User Header Card */}
          <div className="user-header-card" style={{
            background: 'rgba(10, 10, 10, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(200, 150, 100, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '25px',
              flexWrap: 'wrap',
            }}>
              {/* Avatar */}
              <div className="user-avatar" style={{
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #c89664 0%, #d4a574 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                color: '#0a0a0a',
                border: '3px solid rgba(200, 150, 100, 0.4)',
                boxShadow: '0 4px 20px rgba(200, 150, 100, 0.3)',
              }}>
                {userData.name.charAt(0).toUpperCase()}
              </div>

              {/* Name and Role */}
              <div style={{ flex: 1 }}>
                <h1 className="user-name" style={{
                  fontWeight: '700',
                  color: '#fff',
                  margin: '0 0 8px 0',
                  letterSpacing: '-0.5px',
                }}>
                  {userData.name}
                </h1>
                <div className="user-role-badge" style={{
                  display: 'inline-block',
                  background: 'rgba(200, 150, 100, 0.15)',
                  borderRadius: '8px',
                  color: '#c89664',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  {userData.role}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            {/* Total Sales */}
            <div className="stat-card" style={{
              background: 'rgba(10, 10, 10, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(200, 150, 100, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                <div className="stat-icon-box" style={{
                  borderRadius: '12px',
                  background: 'rgba(200, 150, 100, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <BarChart3 size={24} color="#c89664" strokeWidth={1.5} />
                </div>
                <div className="stat-label" style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>
                  Vendite Totali
                </div>
              </div>
              <div className="stat-value" style={{
                fontWeight: '700',
                color: '#c89664',
                lineHeight: 1,
              }}>
                {userData.totalSales}
              </div>
            </div>

            {/* Confirmed Sales */}
            <div className="stat-card" style={{
              background: 'rgba(10, 10, 10, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(76, 175, 80, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                <div className="stat-icon-box" style={{
                  borderRadius: '12px',
                  background: 'rgba(76, 175, 80, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <CheckCircle2 size={24} color="#4CAF50" strokeWidth={1.5} />
                </div>
                <div className="stat-label" style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>
                  Vendite Confermate
                </div>
              </div>
              <div className="stat-value" style={{
                fontWeight: '700',
                color: '#4CAF50',
                lineHeight: 1,
              }}>
                {userData.confirmedSales}
              </div>
            </div>

            {/* Pending Sales */}
            <div className="stat-card" style={{
              background: 'rgba(10, 10, 10, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 193, 7, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                <div className="stat-icon-box" style={{
                  borderRadius: '12px',
                  background: 'rgba(255, 193, 7, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Clock size={24} color="#FFC107" strokeWidth={1.5} />
                </div>
                <div className="stat-label" style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>
                  Vendite in Sospeso
                </div>
              </div>
              <div className="stat-value" style={{
                fontWeight: '700',
                color: '#FFC107',
                lineHeight: 1,
              }}>
                {userData.pendingSales}
              </div>
            </div>

            {/* Revenue */}
            <div className="stat-card" style={{
              background: 'rgba(10, 10, 10, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(33, 150, 243, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                <div className="stat-icon-box" style={{
                  borderRadius: '12px',
                  background: 'rgba(33, 150, 243, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <TrendingUp size={24} color="#2196F3" strokeWidth={1.5} />
                </div>
                <div className="stat-label" style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>
                  Fatturato
                </div>
              </div>
              <div className="stat-value" style={{
                fontWeight: '700',
                color: '#2196F3',
                lineHeight: 1,
              }}>
                €{userData.revenue.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
