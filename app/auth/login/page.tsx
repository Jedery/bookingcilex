"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import '../../styles/globals.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);

    if (success) {
      router.push('/');
    } else {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      padding: '20px',
    }}>
      <div style={{
        background: 'rgba(20, 20, 20, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(200, 150, 100, 0.3)',
        borderRadius: '16px',
        padding: '48px',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '200',
            letterSpacing: '8px',
            background: 'linear-gradient(135deg, #c89664 0%, #f4e4d4 50%, #c89664 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px',
          }}>
            CILEX
          </h1>
          <p style={{
            fontSize: '12px',
            fontWeight: '300',
            color: '#c89664',
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}>
            Ibiza Luxury Concierge
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
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
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(10, 10, 10, 0.6)',
                border: '1px solid rgba(200, 150, 100, 0.3)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '300',
                outline: 'none',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#c89664';
                e.target.style.boxShadow = '0 0 20px rgba(200, 150, 100, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(200, 150, 100, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '300',
              color: '#c89664',
              marginBottom: '8px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(10, 10, 10, 0.6)',
                border: '1px solid rgba(200, 150, 100, 0.3)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '300',
                outline: 'none',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#c89664';
                e.target.style.boxShadow = '0 0 20px rgba(200, 150, 100, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(200, 150, 100, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '12px',
              background: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              borderRadius: '8px',
              color: '#ff6b6b',
              fontSize: '13px',
              fontWeight: '300',
              marginBottom: '24px',
              textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading 
                ? 'rgba(100, 100, 100, 0.3)'
                : 'linear-gradient(135deg, #c89664 0%, #b8865a 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#0a0a0a',
              fontSize: '14px',
              fontWeight: '400',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(200, 150, 100, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
