'use client';

import { Banknote, CreditCard, Building2, Wallet } from 'lucide-react';

interface Transaction {
  id: string;
  name: string;
  status: string;
  date: string;
  amount: number;
  paymentMethod?: string;
  soldBy?: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return { bg: 'rgba(72, 199, 116, 0.15)', color: '#48c774', text: 'Confermato' };
      case 'pending':
        return { bg: 'rgba(255, 193, 7, 0.15)', color: '#ffc107', text: 'In Sospeso' };
      case 'invited':
        return { bg: 'rgba(0, 212, 255, 0.15)', color: '#00d4ff', text: 'Invitato' };
      case 'cancelled':
        return { bg: 'rgba(212, 73, 95, 0.15)', color: '#d4495f', text: 'Cancellato' };
      case 'not paid':
        return { bg: 'rgba(212, 73, 95, 0.15)', color: '#d4495f', text: 'Non Pagato' };
      default:
        return { bg: 'rgba(150, 150, 150, 0.15)', color: '#999', text: status };
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'cash':
      case 'contanti':
        return <Banknote size={16} color="#c89664" />;
      case 'card':
      case 'carta':
        return <CreditCard size={16} color="#c89664" />;
      case 'transfer':
      case 'bonifico':
        return <Building2 size={16} color="#c89664" />;
      default:
        return <Wallet size={16} color="#c89664" />;
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(15, 15, 18, 0.9) 100%)',
      backdropFilter: 'blur(30px)',
      border: '2px solid rgba(200, 150, 100, 0.25)',
      borderRadius: '24px',
      padding: '36px',
      marginBottom: '32px',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      transition: 'all 0.4s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h3 style={{ 
          fontSize: '28px', 
          fontWeight: '700', 
          color: '#fff', 
          letterSpacing: '-0.5px',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        }}>
          Transazioni Recenti
        </h3>
        <button style={{
          padding: '8px 16px',
          background: 'transparent',
          border: '1px solid rgba(200, 150, 100, 0.3)',
          borderRadius: '6px',
          color: '#c89664',
          fontSize: '13px',
          fontWeight: '300',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}>
          Vedi Tutto →
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(200, 150, 100, 0.2)' }}>
              <th style={{ padding: '15px 10px', textAlign: 'left', fontSize: '12px', fontWeight: '400', color: '#888', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Cliente / Evento
              </th>
              <th style={{ padding: '15px 10px', textAlign: 'left', fontSize: '12px', fontWeight: '400', color: '#888', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Status
              </th>
              <th style={{ padding: '15px 10px', textAlign: 'left', fontSize: '12px', fontWeight: '400', color: '#888', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Pagamento
              </th>
              <th style={{ padding: '15px 10px', textAlign: 'left', fontSize: '12px', fontWeight: '400', color: '#888', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Venditore
              </th>
              <th style={{ padding: '15px 10px', textAlign: 'left', fontSize: '12px', fontWeight: '400', color: '#888', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Data
              </th>
              <th style={{ padding: '15px 10px', textAlign: 'right', fontSize: '12px', fontWeight: '400', color: '#888', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Importo
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              const statusStyle = getStatusColor(transaction.status);
              return (
                <tr key={transaction.id} style={{ borderBottom: '1px solid rgba(200, 150, 100, 0.1)' }}>
                  <td style={{ padding: '18px 10px', fontSize: '14px', fontWeight: '300', color: '#fff' }}>
                    {transaction.name}
                  </td>
                  <td style={{ padding: '18px 10px' }}>
                    <span style={{
                      padding: '6px 14px',
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '400',
                      display: 'inline-block',
                    }}>
                      {statusStyle.text}
                    </span>
                  </td>
                  <td style={{ padding: '18px 10px', fontSize: '14px', fontWeight: '300', color: '#aaa' }}>
                    <span style={{ marginRight: '6px' }}>{getPaymentIcon(transaction.paymentMethod || '')}</span>
                    {transaction.paymentMethod || 'N/A'}
                  </td>
                  <td style={{ padding: '18px 10px', fontSize: '13px', fontWeight: '300', color: '#c89664' }}>
                    {transaction.soldBy || 'N/A'}
                  </td>
                  <td style={{ padding: '18px 10px', fontSize: '14px', fontWeight: '300', color: '#aaa' }}>
                    {transaction.date}
                  </td>
                  <td style={{ 
                    padding: '18px 10px', 
                    fontSize: '15px', 
                    fontWeight: '400', 
                    color: transaction.amount >= 0 ? '#48c774' : '#d4495f',
                    textAlign: 'right',
                  }}>
                    {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
