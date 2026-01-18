'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
  data: Array<{ month: string; amount: number }>;
}

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div style={{
      background: 'rgba(20, 20, 20, 0.6)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(200, 150, 100, 0.3)',
      borderRadius: '12px',
      padding: '30px',
      marginBottom: '30px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '300', color: '#fff', letterSpacing: '2px' }}>
          Revenue Chart
        </h3>
        <select style={{
          padding: '8px 16px',
          background: 'rgba(10, 10, 10, 0.6)',
          border: '1px solid rgba(200, 150, 100, 0.3)',
          borderRadius: '6px',
          color: '#e8e8e8',
          fontSize: '13px',
          fontWeight: '300',
          cursor: 'pointer',
        }}>
          <option>This Year</option>
          <option>Last Year</option>
        </select>
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
