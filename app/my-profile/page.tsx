"use client";

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/app/components/Sidebar';
import { useTranslation } from '@/app/i18n/useTranslation';
import '@/app/styles/globals.css';

export default function MyProfilePage() {
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        color: '#c89664',
        fontSize: '18px',
        fontWeight: '300',
        letterSpacing: '2px',
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const roleColors: { [key: string]: string } = {
    SuperAdmin: '#9333ea',
    Founder: '#ff4444',
    Manager: '#00d4ff',
    Promoter: '#ff9800',
    Collaboratore: '#4caf50',
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar t={t} />
      <div style={{ flex: 1, padding: '40px' }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '200',
            color: '#c89664',
            marginBottom: '40px',
            letterSpacing: '4px',
          }}>
            MY PROFILE
          </h1>

          <div style={{
            background: 'rgba(20, 20, 20, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(200, 150, 100, 0.3)',
            borderRadius: '12px',
            padding: '40px',
            marginBottom: '30px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${roleColors[user.role]} 0%, ${roleColors[user.role]}80 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                fontWeight: '300',
                color: '#fff',
                marginRight: '30px',
                border: '2px solid rgba(200, 150, 100, 0.3)',
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '300',
                  color: '#fff',
                  marginBottom: '8px',
                }}>
                  {user.name}
                </h2>
                <div style={{
                  display: 'inline-block',
                  padding: '6px 16px',
                  background: `${roleColors[user.role]}20`,
                  border: `1px solid ${roleColors[user.role]}60`,
                  borderRadius: '20px',
                  color: roleColors[user.role],
                  fontSize: '12px',
                  fontWeight: '400',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}>
                  {user.role}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '24px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '300',
                  color: '#c89664',
                  marginBottom: '8px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}>
                  Email
                </label>
                <div style={{
                  padding: '14px 16px',
                  background: 'rgba(10, 10, 10, 0.4)',
                  border: '1px solid rgba(200, 150, 100, 0.2)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '300',
                }}>
                  {user.email}
                </div>
              </div>

              {user.phone && (
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '300',
                    color: '#c89664',
                    marginBottom: '8px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                  }}>
                    Phone
                  </label>
                  <div style={{
                    padding: '14px 16px',
                    background: 'rgba(10, 10, 10, 0.4)',
                    border: '1px solid rgba(200, 150, 100, 0.2)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '300',
                  }}>
                    {user.phone}
                  </div>
                </div>
              )}

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '300',
                  color: '#c89664',
                  marginBottom: '8px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}>
                  Role Description
                </label>
                <div style={{
                  padding: '14px 16px',
                  background: 'rgba(10, 10, 10, 0.4)',
                  border: '1px solid rgba(200, 150, 100, 0.2)',
                  borderRadius: '8px',
                  color: '#aaa',
                  fontSize: '13px',
                  fontWeight: '300',
                  lineHeight: '1.6',
                }}>
                  {user.role === 'SuperAdmin' && 'Ultimate access with full system control, user management, and all administrative privileges.'}
                  {user.role === 'Founder' && 'Full access to all features including user management and invite generation.'}
                  {user.role === 'Manager' && 'Manage bookings, events, and view reports.'}
                  {user.role === 'Promoter' && 'Create bookings and manage guest lists.'}
                  {user.role === 'Collaboratore' && 'View bookings and basic operations.'}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(20, 20, 20, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(200, 150, 100, 0.3)',
            borderRadius: '12px',
            padding: '30px',
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '300',
              color: '#c89664',
              marginBottom: '20px',
              letterSpacing: '3px',
            }}>
              ACCOUNT INFORMATION
            </h3>
            <div style={{
              display: 'grid',
              gap: '16px',
              fontSize: '13px',
              fontWeight: '300',
              color: '#aaa',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>User ID:</span>
                <span style={{ color: '#fff', fontFamily: 'monospace' }}>{user.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Status:</span>
                <span style={{
                  color: '#4caf50',
                  fontWeight: '400',
                }}>
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
