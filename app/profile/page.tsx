'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from '../i18n/useTranslation';
import { useAuth } from '../context/AuthContext';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

export default function Profile() {
  const { t, language, setLanguage } = useTranslation();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  
  // Protezione accesso solo SuperAdmin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'SuperAdmin') {
      window.location.href = '/';
    }
  }, [currentUser]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    phone: '',
    isActive: true,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInviteLink = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch('/api/auth/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setInviteLink(data.inviteLink);
        setShowInvite(true);
      } else {
        alert(data.error || 'Failed to generate invite');
      }
    } catch (error) {
      console.error('Error generating invite:', error);
      alert('An error occurred while generating invite');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('User created successfully!');
        setShowAddForm(false);
        setFormData({
          name: '',
          email: '',
          password: '',
          role: '',
          phone: '',
          isActive: true,
        });
        fetchUsers();
      } else {
        alert('Failed to create user');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SuperAdmin':
        return '#9333ea'; // Purple
      case 'Founder':
        return '#d4495f';
      case 'Manager':
        return '#4ecdc4';
      case 'Promoter':
        return '#f4b860';
      case 'Collaboratore':
        return '#48c774';
      default:
        return '#999';
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar t={t} />
      <div className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>User Management</h1>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <LanguageSwitcher language={language} setLanguage={setLanguage} />
            {currentUser?.role === 'Founder' && (
              <button 
                onClick={generateInviteLink}
                className="button"
                style={{
                  background: 'linear-gradient(135deg, #c89664 0%, #b8865a 100%)',
                  color: '#0a0a0a',
                  border: 'none',
                  padding: '10px 20px',
                  fontWeight: '500',
                }}
              >
                🔗 Generate Invite Link
              </button>
            )}
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="button button-primary"
            >
              ➕ Add User
            </button>
          </div>
        </div>

        {showInvite && inviteLink && (
          <div className="card" style={{ 
            marginBottom: '30px', 
            background: 'rgba(200, 150, 100, 0.1)',
            border: '1px solid rgba(200, 150, 100, 0.3)',
          }}>
            <h3 style={{ color: '#c89664', marginBottom: '15px' }}>🎉 Invite Link Generated!</h3>
            <p style={{ marginBottom: '15px', fontSize: '14px', color: '#aaa' }}>
              Share this link with the person you want to invite. They can use it to create their account:
            </p>
            <div style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}>
              <input 
                type="text" 
                value={inviteLink} 
                readOnly
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'rgba(10, 10, 10, 0.6)',
                  border: '1px solid rgba(200, 150, 100, 0.3)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                }}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(inviteLink);
                  alert('Link copied to clipboard!');
                }}
                className="button button-primary"
              >
                📋 Copy
              </button>
              <button
                onClick={() => setShowInvite(false)}
                className="button button-secondary"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {showAddForm && (
          <div className="card" style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '20px' }}>Add New User</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div className="filter-group">
                  <label>Name *</label>
                  <input 
                    type="text" 
                    style={{ width: '100%' }}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="filter-group">
                  <label>Email *</label>
                  <input 
                    type="email" 
                    style={{ width: '100%' }}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="filter-group">
                  <label>Password *</label>
                  <input 
                    type="password" 
                    style={{ width: '100%' }}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="filter-group">
                  <label>Role *</label>
                  <select 
                    style={{ width: '100%' }}
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                  >
                    <option value="">-- Select Role --</option>
                    <option value="Founder">Founder</option>
                    <option value="Manager">Manager</option>
                    <option value="Promoter">Promoter</option>
                    <option value="Collaboratore">Collaboratore</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Phone</label>
                  <input 
                    type="tel" 
                    style={{ width: '100%' }}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="filter-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    Active
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="button button-primary">
                  Save User
                </button>
                <button 
                  type="button" 
                  className="button button-secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ fontSize: '18px', color: '#999' }}>No users yet</p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="button button-primary"
              style={{ marginTop: '20px' }}
            >
              Create your first user
            </button>
          </div>
        ) : (
          <div className="card">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {users.map((user) => (
                <div 
                  key={user.id}
                  style={{
                    padding: '20px',
                    backgroundColor: '#0f1419',
                    borderRadius: '8px',
                    border: '1px solid #2a3a52',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: getRoleBadgeColor(user.role) + '33',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: getRoleBadgeColor(user.role),
                    }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ marginBottom: '5px' }}>{user.name}</h3>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        backgroundColor: getRoleBadgeColor(user.role) + '33',
                        color: getRoleBadgeColor(user.role),
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}>
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: '14px', color: '#999' }}>
                    <div style={{ marginBottom: '8px' }}>
                      📧 {user.email}
                    </div>
                    {user.phone && (
                      <div style={{ marginBottom: '8px' }}>
                        📱 {user.phone}
                      </div>
                    )}
                    <div>
                      {user.isActive ? (
                        <span style={{ color: '#48c774' }}>✓ Active</span>
                      ) : (
                        <span style={{ color: '#d4495f' }}>✗ Inactive</span>
                      )}
                    </div>
                  </div>

                  <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
