'use client';

import { useState } from 'react';
import { TrendingUp, DollarSign, CreditCard, Banknote, Calendar, Clock, User } from 'lucide-react';

interface SellerStats {
  sellerId: string;
  sellerName: string;
  role: string;
  daily: {
    tickets: number;
    revenue: number;
    cash: number;
    card: number;
    pos: number;
    transfer: number;
    avgTicketValue: number;
  };
  weekly: {
    tickets: number;
    revenue: number;
    cash: number;
    card: number;
    pos: number;
    transfer: number;
    avgTicketValue: number;
  };
  monthly: {
    tickets: number;
    revenue: number;
    cash: number;
    card: number;
    pos: number;
    transfer: number;
    avgTicketValue: number;
  };
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

interface SellerAnalyticsProps {
  sellers: SellerStats[];
  t: (key: string) => string;
}

export default function SellerAnalytics({ sellers, t }: SellerAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedSeller, setSelectedSeller] = useState<string>('all');

  const filteredSellers = selectedSeller === 'all' 
    ? sellers 
    : sellers.filter(s => s.sellerId === selectedSeller);

  const getPeriodData = (seller: SellerStats) => {
    return seller[selectedPeriod];
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return '📈';
    if (trend === 'down') return '📉';
    return '➡️';
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return '#48c774';
    if (trend === 'down') return '#d4495f';
    return '#ffc107';
  };

  return (
    <div style={{
      background: 'rgba(20, 20, 20, 0.6)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(200, 150, 100, 0.3)',
      borderRadius: '12px',
      padding: '30px',
      marginBottom: '30px',
    }}>
      {/* Header con filtri */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '15px',
      }}>
        <h3 style={{ 
          fontSize: '22px', 
          fontWeight: '300', 
          color: '#fff', 
          letterSpacing: '2px',
        }}>
          {t('sellerAnalytics.title')}
        </h3>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          {/* Filtro Venditore */}
          <select
            value={selectedSeller}
            onChange={(e) => setSelectedSeller(e.target.value)}
            style={{
              padding: '10px 20px',
              background: 'rgba(10, 10, 10, 0.6)',
              border: '1px solid rgba(200, 150, 100, 0.3)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="all">{t('sellerAnalytics.allSellers')}</option>
            {sellers.map(seller => (
              <option key={seller.sellerId} value={seller.sellerId}>
                {seller.sellerName}
              </option>
            ))}
          </select>

          {/* Filtro Periodo */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
            style={{
              padding: '10px 20px',
              background: 'rgba(10, 10, 10, 0.6)',
              border: '1px solid rgba(200, 150, 100, 0.3)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="daily">{t('sellerAnalytics.daily')}</option>
            <option value="weekly">{t('sellerAnalytics.weekly')}</option>
            <option value="monthly">{t('sellerAnalytics.monthly')}</option>
          </select>
        </div>
      </div>

      {/* Grid venditori */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px',
      }}>
        {filteredSellers.map((seller) => {
          const data = getPeriodData(seller);
          
          return (
            <div
              key={seller.sellerId}
              style={{
                background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.8), rgba(15, 15, 18, 0.9))',
                border: '1px solid rgba(200, 150, 100, 0.3)',
                borderRadius: '12px',
                padding: '24px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(200, 150, 100, 0.6)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(200, 150, 100, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(200, 150, 100, 0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Header venditore */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                marginBottom: '20px',
                paddingBottom: '15px',
                borderBottom: '1px solid rgba(200, 150, 100, 0.2)',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #c89664 0%, #d4a574 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#0a0a0a',
                }}>
                  {seller.sellerName.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#fff',
                    marginBottom: '4px',
                  }}>
                    {seller.sellerName}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#888',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    {seller.role}
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '20px',
                }}>
                  <span>{getTrendIcon(seller.trend)}</span>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '600',
                    color: getTrendColor(seller.trend),
                  }}>
                    {seller.trendPercentage > 0 ? '+' : ''}{seller.trendPercentage}%
                  </span>
                </div>
              </div>

              {/* Metriche principali */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '16px',
              }}>
                {/* Ticket venduti */}
                <div style={{
                  background: 'rgba(72, 199, 116, 0.1)',
                  border: '1px solid rgba(72, 199, 116, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                }}>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#888',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '6px',
                  }}>
                    {t('sellerAnalytics.tickets')}
                  </div>
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: '600',
                    color: '#48c774',
                  }}>
                    {data.tickets}
                  </div>
                </div>

                {/* Revenue */}
                <div style={{
                  background: 'rgba(200, 150, 100, 0.1)',
                  border: '1px solid rgba(200, 150, 100, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                }}>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#888',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '6px',
                  }}>
                    {t('sellerAnalytics.revenue')}
                  </div>
                  <div style={{ 
                    fontSize: '22px', 
                    fontWeight: '600',
                    color: '#c89664',
                  }}>
                    €{data.revenue.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Metodi pagamento */}
              <div style={{
                background: 'rgba(10, 10, 10, 0.3)',
                borderRadius: '8px',
                padding: '14px',
              }}>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#888',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '10px',
                }}>
                  {t('sellerAnalytics.paymentMethods')}
                </div>
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Banknote size={16} color="#48c774" />
                    <span style={{ fontSize: '13px', color: '#aaa' }}>
                      {t('sellerAnalytics.cash')}: <strong style={{ color: '#fff' }}>€{data.cash}</strong>
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={16} color="#3b82f6" />
                    <span style={{ fontSize: '13px', color: '#aaa' }}>
                      {t('sellerAnalytics.card')}: <strong style={{ color: '#fff' }}>€{data.card}</strong>
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <DollarSign size={16} color="#f59e0b" />
                    <span style={{ fontSize: '13px', color: '#aaa' }}>
                      POS: <strong style={{ color: '#fff' }}>€{data.pos}</strong>
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={16} color="#8b5cf6" />
                    <span style={{ fontSize: '13px', color: '#aaa' }}>
                      {t('sellerAnalytics.transfer')}: <strong style={{ color: '#fff' }}>€{data.transfer}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Ticket medio */}
              <div style={{
                marginTop: '12px',
                padding: '10px',
                background: 'rgba(200, 150, 100, 0.05)',
                borderRadius: '6px',
                textAlign: 'center',
              }}>
                <span style={{ fontSize: '12px', color: '#888' }}>
                  {t('sellerAnalytics.avgTicket')}: 
                </span>
                <span style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#c89664',
                  marginLeft: '8px',
                }}>
                  €{data.avgTicketValue.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Riepilogo totale se "Tutti" è selezionato */}
      {selectedSeller === 'all' && (
        <div style={{
          marginTop: '30px',
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(200, 150, 100, 0.1), rgba(200, 150, 100, 0.05))',
          border: '2px solid rgba(200, 150, 100, 0.3)',
          borderRadius: '12px',
        }}>
          <h4 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#c89664',
            marginBottom: '20px',
            letterSpacing: '1px',
          }}>
            {t('sellerAnalytics.totalSummary')}
          </h4>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>
                {t('sellerAnalytics.totalTickets')}
              </div>
              <div style={{ fontSize: '28px', fontWeight: '600', color: '#48c774' }}>
                {filteredSellers.reduce((sum, s) => sum + getPeriodData(s).tickets, 0)}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>
                {t('sellerAnalytics.totalRevenue')}
              </div>
              <div style={{ fontSize: '28px', fontWeight: '600', color: '#c89664' }}>
                €{filteredSellers.reduce((sum, s) => sum + getPeriodData(s).revenue, 0).toLocaleString()}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>
                {t('sellerAnalytics.totalCash')}
              </div>
              <div style={{ fontSize: '28px', fontWeight: '600', color: '#48c774' }}>
                €{filteredSellers.reduce((sum, s) => sum + getPeriodData(s).cash, 0).toLocaleString()}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>
                {t('sellerAnalytics.totalCard')}
              </div>
              <div style={{ fontSize: '28px', fontWeight: '600', color: '#3b82f6' }}>
                €{filteredSellers.reduce((sum, s) => sum + getPeriodData(s).card, 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
