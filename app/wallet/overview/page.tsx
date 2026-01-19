'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { useTranslation } from '../../i18n/useTranslation';
import { Wallet, TrendingUp, TrendingDown, Users, Search, Eye, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserWallet {
  id: string;
  name: string;
  email: string;
  role: string;
  walletBalance: number;
  rentAmount: number | null;
  rentType: string | null;
  totalIncome: number;
  totalExpenses: number;
  pendingTransactions: number;
}

export default function WalletOverviewPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const [users, setUsers] = useState<UserWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  useEffect(() => {
    // Dati mock per ora
    setTimeout(() => {
      setUsers([
        {
          id: '1',
          name: 'Marco Rossi',
          email: 'marco.rossi@cilex.com',
          role: 'Promoter',
          walletBalance: 4500,
          rentAmount: 150,
          rentType: 'weekly',
          totalIncome: 5250,
          totalExpenses: 750,
          pendingTransactions: 2,
        },
        {
          id: '2',
          name: 'Sara Bianchi',
          email: 'sara.bianchi@cilex.com',
          role: 'Promoter',
          walletBalance: 6800,
          rentAmount: 150,
          rentType: 'weekly',
          totalIncome: 8200,
          totalExpenses: 1400,
          pendingTransactions: 1,
        },
        {
          id: '3',
          name: 'Luca Verdi',
          email: 'luca.verdi@cilex.com',
          role: 'Manager',
          walletBalance: 10200,
          rentAmount: 200,
          rentType: 'weekly',
          totalIncome: 12500,
          totalExpenses: 2300,
          pendingTransactions: 0,
        },
        {
          id: '4',
          name: 'Anna Neri',
          email: 'anna.neri@cilex.com',
          role: 'Promoter',
          walletBalance: 3200,
          rentAmount: 150,
          rentType: 'weekly',
          totalIncome: 4100,
          totalExpenses: 900,
          pendingTransactions: 3,
        },
        {
          id: '5',
          name: 'Paolo Gialli',
          email: 'paolo.gialli@cilex.com',
          role: 'Collaboratore',
          walletBalance: 1850,
          rentAmount: 100,
          rentType: 'weekly',
          totalIncome: 2200,
          totalExpenses: 350,
          pendingTransactions: 0,
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalBalance = filteredUsers.reduce((sum, u) => sum + u.walletBalance, 0);
  const totalIncome = filteredUsers.reduce((sum, u) => sum + u.totalIncome, 0);
  const totalExpenses = filteredUsers.reduce((sum, u) => sum + u.totalExpenses, 0);
  const totalPending = filteredUsers.reduce((sum, u) => sum + u.pendingTransactions, 0);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SuperAdmin':
      case 'Founder':
        return '#d4a574';
      case 'Manager':
        return '#4ecdc4';
      case 'Promoter':
        return '#48c774';
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
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>💰</div>
            <p style={{ color: '#888' }}>Caricamento panoramica wallet...</p>
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
        <div style={{ marginBottom: '35px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            <Users size={32} color="#c89664" strokeWidth={1.5} />
            <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '200', letterSpacing: '2px' }}>
              Panoramica Wallet Team
            </h1>
          </div>
          <p style={{ color: '#888', fontSize: '14px', marginLeft: '47px' }}>
            Gestisci i wallet di tutti i membri del team
          </p>
        </div>

        {/* Summary Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '35px',
        }}>
          <div className="card" style={{
            background: 'linear-gradient(135deg, rgba(200, 150, 100, 0.15), rgba(200, 150, 100, 0.05))',
            borderColor: 'rgba(200, 150, 100, 0.3)',
            padding: '20px',
          }}>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
              Saldo Totale Team
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#c89664' }}>
              {formatAmount(totalBalance)}
            </div>
          </div>

          <div className="card" style={{
            background: 'linear-gradient(135deg, rgba(72, 199, 116, 0.15), rgba(72, 199, 116, 0.05))',
            borderColor: 'rgba(72, 199, 116, 0.3)',
            padding: '20px',
          }}>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
              Entrate Totali
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#48c774' }}>
              {formatAmount(totalIncome)}
            </div>
          </div>

          <div className="card" style={{
            background: 'linear-gradient(135deg, rgba(212, 73, 95, 0.15), rgba(212, 73, 95, 0.05))',
            borderColor: 'rgba(212, 73, 95, 0.3)',
            padding: '20px',
          }}>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
              Spese Totali
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#d4495f' }}>
              {formatAmount(totalExpenses)}
            </div>
          </div>

          <div className="card" style={{
            background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(255, 193, 7, 0.05))',
            borderColor: 'rgba(255, 193, 7, 0.3)',
            padding: '20px',
          }}>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
              Transazioni Sospese
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#ffc107' }}>
              {totalPending}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: '25px' }}>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
              <Search 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '15px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: '#888' 
                }} 
              />
              <input
                type="text"
                placeholder="Cerca per nome o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 15px 12px 45px',
                  background: 'rgba(10, 10, 10, 0.6)',
                  border: '1px solid rgba(200, 150, 100, 0.3)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '300',
                  outline: 'none',
                }}
              />
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(10, 10, 10, 0.6)',
                  border: '1px solid rgba(200, 150, 100, 0.3)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '300',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="all">Tutti i Ruoli</option>
                <option value="Promoter">Promoter</option>
                <option value="Manager">Manager</option>
                <option value="Collaboratore">Collaboratore</option>
                <option value="Founder">Founder</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: '200', letterSpacing: '2px', marginBottom: '25px' }}>
            Team Members ({filteredUsers.length})
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(200, 150, 100, 0.2)' }}>
                  <th style={{ textAlign: 'left', padding: '12px', fontSize: '11px', color: '#888', fontWeight: '600', letterSpacing: '1.5px' }}>
                    UTENTE
                  </th>
                  <th style={{ textAlign: 'center', padding: '12px', fontSize: '11px', color: '#888', fontWeight: '600', letterSpacing: '1.5px' }}>
                    RUOLO
                  </th>
                  <th style={{ textAlign: 'right', padding: '12px', fontSize: '11px', color: '#888', fontWeight: '600', letterSpacing: '1.5px' }}>
                    SALDO
                  </th>
                  <th style={{ textAlign: 'right', padding: '12px', fontSize: '11px', color: '#888', fontWeight: '600', letterSpacing: '1.5px' }}>
                    ENTRATE
                  </th>
                  <th style={{ textAlign: 'right', padding: '12px', fontSize: '11px', color: '#888', fontWeight: '600', letterSpacing: '1.5px' }}>
                    SPESE
                  </th>
                  <th style={{ textAlign: 'center', padding: '12px', fontSize: '11px', color: '#888', fontWeight: '600', letterSpacing: '1.5px' }}>
                    AFFITTO
                  </th>
                  <th style={{ textAlign: 'center', padding: '12px', fontSize: '11px', color: '#888', fontWeight: '600', letterSpacing: '1.5px' }}>
                    AZIONI
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    style={{
                      background: 'rgba(20, 20, 20, 0.4)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(20, 20, 20, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(20, 20, 20, 0.4)';
                    }}
                  >
                    <td style={{ padding: '16px', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '400', color: '#fff', marginBottom: '4px' }}>
                          {user.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#888' }}>
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: `${getRoleBadgeColor(user.role)}20`,
                        color: getRoleBadgeColor(user.role),
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', fontSize: '16px', fontWeight: '700', color: '#c89664' }}>
                      {formatAmount(user.walletBalance)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', fontSize: '15px', color: '#48c774' }}>
                      {formatAmount(user.totalIncome)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', fontSize: '15px', color: '#d4495f' }}>
                      {formatAmount(user.totalExpenses)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', fontSize: '13px', color: '#888' }}>
                      {user.rentAmount ? `${formatAmount(user.rentAmount)} / ${user.rentType === 'weekly' ? 'sett.' : 'mese'}` : '-'}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>
                      <button
                        onClick={() => router.push(`/wallet?userId=${user.id}`)}
                        style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(135deg, #c89664 0%, #d4a574 100%)',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#0a0a0a',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(200, 150, 100, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <Eye size={14} />
                        Dettagli
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
              <Users size={48} strokeWidth={1} style={{ margin: '0 auto 15px', opacity: 0.5 }} />
              <p>Nessun utente trovato</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
