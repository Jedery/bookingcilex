'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { useTranslation } from '../i18n/useTranslation';
import { Wallet, TrendingUp, TrendingDown, Clock, ArrowUpRight, ArrowDownRight, Calendar, DollarSign } from 'lucide-react';

interface Transaction {
  id: string;
  type: string;
  category: string | null;
  amount: number;
  balanceAfter: number;
  description: string;
  reference: string | null;
  status: string;
  createdBy: string | null;
  createdByName: string | null;
  notes: string | null;
  createdAt: string;
}

interface WalletData {
  user: {
    name: string;
    email: string;
    role: string;
    walletBalance: number;
    rentAmount: number | null;
    rentType: string | null;
    bankAccount: string | null;
    paymentMethod: string | null;
  };
  transactions: Transaction[];
  stats: {
    currentBalance: number;
    totalIncome: number;
    totalExpenses: number;
    pendingTransactions: number;
  };
}

export default function WalletPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'all' | 'month' | 'week'>('all');

  useEffect(() => {
    // Usa dati mock per ora
    setTimeout(() => {
      setWalletData({
        user: {
          name: user?.name || 'Marco Rossi',
          email: user?.email || 'marco.rossi@cilex.com',
          role: user?.role || 'Promoter',
          walletBalance: 4500,
          rentAmount: 150,
          rentType: 'weekly',
          bankAccount: 'IT00X0000000000000000000',
          paymentMethod: 'bank_transfer',
        },
        transactions: [
          {
            id: '1',
            type: 'commission',
            category: 'booking',
            amount: 50,
            balanceAfter: 4500,
            description: 'Commissione Booking #BK001',
            reference: 'BK001',
            status: 'completed',
            createdBy: 'system',
            createdByName: 'Sistema',
            notes: null,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          },
          {
            id: '2',
            type: 'commission',
            category: 'booking',
            amount: 50,
            balanceAfter: 4450,
            description: 'Commissione Booking #BK002',
            reference: 'BK002',
            status: 'completed',
            createdBy: 'system',
            createdByName: 'Sistema',
            notes: null,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          },
          {
            id: '3',
            type: 'expense',
            category: 'rent',
            amount: -150,
            balanceAfter: 4400,
            description: 'Affitto Settimana 3 - Gennaio 2026',
            reference: null,
            status: 'completed',
            createdBy: 'admin',
            createdByName: 'Admin',
            notes: 'Pagamento automatico',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
          },
          {
            id: '4',
            type: 'commission',
            category: 'booking',
            amount: 75,
            balanceAfter: 4325,
            description: 'Commissione Booking VIP #BK003',
            reference: 'BK003',
            status: 'completed',
            createdBy: 'system',
            createdByName: 'Sistema',
            notes: 'Booking VIP - Commissione maggiorata',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
          },
          {
            id: '5',
            type: 'expense',
            category: 'scooter',
            amount: -25,
            balanceAfter: 4250,
            description: 'Benzina Scooter',
            reference: null,
            status: 'completed',
            createdBy: 'admin',
            createdByName: 'Admin',
            notes: null,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
          },
          {
            id: '6',
            type: 'commission',
            category: 'bonus',
            amount: 100,
            balanceAfter: 4150,
            description: 'Bonus Performance Settimana',
            reference: null,
            status: 'completed',
            createdBy: 'admin',
            createdByName: 'Manager',
            notes: 'Ottimo lavoro questa settimana!',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
          },
          {
            id: '7',
            type: 'expense',
            category: 'fine',
            amount: -50,
            balanceAfter: 4050,
            description: 'Multa ritardo consegna materiale',
            reference: null,
            status: 'completed',
            createdBy: 'admin',
            createdByName: 'Admin',
            notes: 'Materiale consegnato con 2 giorni di ritardo',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
          },
        ],
        stats: {
          currentBalance: 4500,
          totalIncome: 725,
          totalExpenses: 225,
          pendingTransactions: 0,
        },
      });
      setLoading(false);
    }, 500);
  }, [user, period]);

  const fetchWalletData = async () => {
    // Mock - non usato per ora
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryIcon = (category: string | null) => {
    switch (category) {
      case 'booking':
        return '🎫';
      case 'rent':
        return '🏠';
      case 'scooter':
        return '🛵';
      case 'fine':
        return <ArrowDownRight size={18} color="#f39c12" />;
      case 'damage':
        return <ArrowDownRight size={18} color="#e74c3c" />;
      case 'bonus':
        return <ArrowUpRight size={18} color="#2ecc71" />;
      default:
        return <Wallet size={18} color="#c89664" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#48c774';
      case 'pending':
        return '#ffc107';
      case 'cancelled':
        return '#d4495f';
      default:
        return '#888';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar t={t} />
        <div className="main-content">
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ marginBottom: '20px' }}><Wallet size={48} color="#c89664" /></div>
            <p style={{ color: '#888' }}>Caricamento wallet...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!walletData || !walletData.stats) {
    return (
      <div className="dashboard-container">
        <Sidebar t={t} />
        <div className="main-content">
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: '#d4495f', fontSize: '18px', marginBottom: '10px' }}>
              Errore nel caricamento del wallet
            </p>
            <p style={{ color: '#888', fontSize: '14px' }}>
              {user?.id ? 'Impossibile recuperare i dati' : 'Effettua il login per continuare'}
            </p>
            {user?.id && (
              <button
                onClick={fetchWalletData}
                style={{
                  marginTop: '20px',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #c89664 0%, #d4a574 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#0a0a0a',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Riprova
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar t={t} />
      <div className="main-content">
      {/* Header */}
      <div style={{ marginBottom: '35px', marginLeft: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
          <Wallet size={32} color="#c89664" strokeWidth={1.5} />
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '200', letterSpacing: '2px' }}>
            Il Mio Wallet
          </h1>
        </div>
        <p style={{ color: '#888', fontSize: '14px', marginLeft: '47px' }}>
          Gestisci le tue commissioni e spese
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '35px',
      }}>
        {/* Saldo Corrente */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(200, 150, 100, 0.15), rgba(200, 150, 100, 0.05))',
          borderColor: 'rgba(200, 150, 100, 0.3)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
            <div>
              <p style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
                Saldo Attuale
              </p>
              <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#c89664', margin: 0 }}>
                {formatAmount(walletData.stats.currentBalance)}
              </h2>
            </div>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'rgba(200, 150, 100, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <DollarSign size={26} color="#c89664" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Entrate Totali */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(72, 199, 116, 0.15), rgba(72, 199, 116, 0.05))',
          borderColor: 'rgba(72, 199, 116, 0.3)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
                Entrate
              </p>
              <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#48c774', margin: 0 }}>
                {formatAmount(walletData.stats.totalIncome)}
              </h2>
            </div>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'rgba(72, 199, 116, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <TrendingUp size={26} color="#48c774" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Uscite Totali */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(212, 73, 95, 0.15), rgba(212, 73, 95, 0.05))',
          borderColor: 'rgba(212, 73, 95, 0.3)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
                Spese
              </p>
              <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#d4495f', margin: 0 }}>
                {formatAmount(walletData.stats.totalExpenses)}
              </h2>
            </div>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'rgba(212, 73, 95, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <TrendingDown size={26} color="#d4495f" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* In Sospeso */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(255, 193, 7, 0.05))',
          borderColor: 'rgba(255, 193, 7, 0.3)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
                In Sospeso
              </p>
              <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#ffc107', margin: 0 }}>
                {walletData.stats.pendingTransactions}
              </h2>
            </div>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'rgba(255, 193, 7, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Clock size={26} color="#ffc107" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '200', letterSpacing: '2px', margin: 0 }}>
            Movimenti
          </h3>
          
          {/* Period Filter */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {['all', 'month', 'week'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p as any)}
                style={{
                  padding: '8px 16px',
                  background: period === p ? 'rgba(200, 150, 100, 0.2)' : 'transparent',
                  border: `1px solid ${period === p ? 'rgba(200, 150, 100, 0.5)' : 'rgba(200, 150, 100, 0.2)'}`,
                  borderRadius: '8px',
                  color: period === p ? '#c89664' : '#888',
                  fontSize: '12px',
                  fontWeight: '400',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                }}
              >
                {p === 'all' ? 'Tutti' : p === 'month' ? 'Mese' : 'Settimana'}
              </button>
            ))}
          </div>
        </div>

        {walletData.transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
            <Calendar size={48} strokeWidth={1} style={{ margin: '0 auto 15px', opacity: 0.5 }} />
            <p>Nessuna transazione trovata</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {walletData.transactions.map((transaction) => (
              <div
                key={transaction.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '18px',
                  background: 'rgba(20, 20, 20, 0.4)',
                  borderRadius: '12px',
                  border: '1px solid rgba(200, 150, 100, 0.1)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(20, 20, 20, 0.6)';
                  e.currentTarget.style.borderColor = 'rgba(200, 150, 100, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(20, 20, 20, 0.4)';
                  e.currentTarget.style.borderColor = 'rgba(200, 150, 100, 0.1)';
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: transaction.amount > 0 ? 'rgba(72, 199, 116, 0.15)' : 'rgba(212, 73, 95, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  flexShrink: 0,
                }}>
                  {getCategoryIcon(transaction.category)}
                </div>

                {/* Description */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '15px', fontWeight: '400', color: '#fff', marginBottom: '4px' }}>
                    {transaction.description}
                  </div>
                  <div style={{ fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{formatDate(transaction.createdAt)}</span>
                    {transaction.reference && (
                      <>
                        <span>•</span>
                        <span>{transaction.reference}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: transaction.amount > 0 ? '#48c774' : '#d4495f',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    justifyContent: 'flex-end',
                  }}>
                    {transaction.amount > 0 ? (
                      <ArrowUpRight size={18} />
                    ) : (
                      <ArrowDownRight size={18} />
                    )}
                    {formatAmount(Math.abs(transaction.amount))}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#888',
                    marginTop: '4px',
                  }}>
                    Saldo: {formatAmount(transaction.balanceAfter)}
                  </div>
                </div>

                {/* Status */}
                {transaction.status !== 'completed' && (
                  <div style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    background: `${getStatusColor(transaction.status)}20`,
                    color: getStatusColor(transaction.status),
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    {transaction.status}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
