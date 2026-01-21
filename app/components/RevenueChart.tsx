'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
  t: (key: string) => string;
}

export default function RevenueChart({ t }: RevenueChartProps) {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');

  // Mock data per ogni periodo
  const getData = () => {
    switch (period) {
      case 'day':
        return [
          { month: 'Lun', amount: 450 },
          { month: 'Mar', amount: 620 },
          { month: 'Mer', amount: 580 },
          { month: 'Gio', amount: 750 },
          { month: 'Ven', amount: 920 },
          { month: 'Sab', amount: 1100 },
          { month: 'Dom', amount: 850 },
        ];
      case 'week':
        return [
          { month: 'S1', amount: 3500 },
          { month: 'S2', amount: 4200 },
          { month: 'S3', amount: 3800 },
          { month: 'S4', amount: 4500 },
        ];
      case 'month':
        return [
          { month: 'Gen', amount: 12000 },
          { month: 'Feb', amount: 18000 },
          { month: 'Mar', amount: 15000 },
          { month: 'Apr', amount: 22000 },
          { month: 'Mag', amount: 28000 },
          { month: 'Giu', amount: 35000 },
          { month: 'Lug', amount: 42000 },
          { month: 'Ago', amount: 48000 },
          { month: 'Set', amount: 32000 },
          { month: 'Ott', amount: 25000 },
          { month: 'Nov', amount: 18000 },
          { month: 'Dic', amount: 22000 },
        ];
      case 'year':
        return [
          { month: '2020', amount: 180000 },
          { month: '2021', amount: 220000 },
          { month: '2022', amount: 280000 },
          { month: '2023', amount: 320000 },
          { month: '2024', amount: 360000 },
          { month: '2025', amount: 297000 },
        ];
    }
  };

  const data = getData();
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <h3 style={{ 
          fontSize: '28px', 
          fontWeight: '700', 
          color: '#fff', 
          letterSpacing: '-0.5px',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        }}>
          {t('revenueChart.title')}
        </h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {(['day', 'week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: '10px 20px',
                background: period === p ? 'linear-gradient(135deg, rgba(200, 150, 100, 0.35), rgba(200, 150, 100, 0.25))' : 'rgba(10, 10, 10, 0.6)',
                border: `2px solid ${period === p ? 'rgba(200, 150, 100, 0.7)' : 'rgba(200, 150, 100, 0.25)'}`,
                borderRadius: '10px',
                color: period === p ? '#c89664' : '#e8e8e8',
                fontSize: '13px',
                fontWeight: period === p ? '700' : '400',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: period === p ? '0 4px 16px rgba(200, 150, 100, 0.3)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (period !== p) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(200, 150, 100, 0.2), rgba(200, 150, 100, 0.1))';
                  e.currentTarget.style.borderColor = 'rgba(200, 150, 100, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(200, 150, 100, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (period !== p) {
                  e.currentTarget.style.background = 'rgba(10, 10, 10, 0.6)';
                  e.currentTarget.style.borderColor = 'rgba(200, 150, 100, 0.25)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {t(`revenueChart.${p}`)}
            </button>
          ))}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 150, 100, 0.1)" />
          <XAxis 
            dataKey="month" 
            stroke="#888" 
            style={{ fontSize: '12px', fontWeight: '300' }}
          />
          <YAxis 
            stroke="#888" 
            style={{ fontSize: '12px', fontWeight: '300' }}
          />
          <Tooltip 
            contentStyle={{
              background: 'rgba(20, 20, 20, 0.95)',
              border: '1px solid rgba(200, 150, 100, 0.3)',
              borderRadius: '8px',
              color: '#fff',
            }}
            cursor={{ fill: 'rgba(200, 150, 100, 0.1)' }}
          />
          <Bar 
            dataKey="amount" 
            fill="url(#colorGradient)" 
            radius={[8, 8, 0, 0]}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c89664" stopOpacity={1} />
              <stop offset="100%" stopColor="#c89664" stopOpacity={0.6} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
