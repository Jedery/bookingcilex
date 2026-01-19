'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useTranslation } from '@/app/i18n/useTranslation';
import Sidebar from '@/app/components/Sidebar';
import { Home, Plus, UserPlus, DollarSign, Users, MapPin, Calendar } from 'lucide-react';

interface Property {
  id: string;
  name: string;
  address: string;
  monthlyRent: number;
  capacity: number;
  managedBy: string | null;
  notes: string | null;
  tenants: Tenant[];
}

interface Tenant {
  id: string;
  name: string;
  email: string;
  role: string;
  rentAmount: number | null;
  rentType: string | null;
  walletBalance: number;
  moveInDate: string | null;
  moveOutDate: string | null;
}

interface AllUsers {
  id: string;
  name: string;
  email: string;
  role: string;
  propertyId: string | null;
}

export default function HousingManagement() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();
  const [properties, setProperties] = useState<Property[]>([]);
  const [allUsers, setAllUsers] = useState<AllUsers[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showAssignTenant, setShowAssignTenant] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [generatingRent, setGeneratingRent] = useState(false);

  // Form states
  const [propertyForm, setPropertyForm] = useState({
    name: '',
    address: '',
    monthlyRent: '',
    capacity: '',
    notes: '',
  });

  const [tenantForm, setTenantForm] = useState({
    userId: '',
    propertyId: '',
    rentAmount: '',
    rentType: 'monthly',
    moveInDate: '',
  });

  useEffect(() => {
    // Aspetta che l'auth finisca di caricare
    if (isLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (user.role !== 'SuperAdmin' && user.role !== 'Founder') {
      router.push('/');
      return;
    }

    fetchData();
  }, [user, router, isLoading]);

  const fetchData = async () => {
    try {
      const [propertiesRes, usersRes] = await Promise.all([
        fetch('/api/housing'),
        fetch('/api/users'),
      ]);

      if (propertiesRes.ok) {
        const data = await propertiesRes.json();
        setProperties(data.properties || []);
      }

      if (usersRes.ok) {
        const data = await usersRes.json();
        setAllUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/housing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...propertyForm,
          managedBy: user?.id,
        }),
      });

      if (res.ok) {
        setShowAddProperty(false);
        setPropertyForm({ name: '', address: '', monthlyRent: '', capacity: '', notes: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Error creating property:', error);
    }
  };

  const handleAssignTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/housing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tenantForm),
      });

      if (res.ok) {
        setShowAssignTenant(false);
        setTenantForm({ userId: '', propertyId: '', rentAmount: '', rentType: 'monthly', moveInDate: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Error assigning tenant:', error);
    }
  };

  const handleGenerateRent = async () => {
    const period = prompt('Inserisci il periodo (es: "Settimana 3" o "Gennaio 2026"):');
    if (!period) return;

    setGeneratingRent(true);
    try {
      const res = await fetch('/api/housing/generate-rent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          period,
          createdBy: user?.id,
          createdByName: user?.name,
        }),
      });

      const data = await res.json();
      alert(data.message || 'Affitti generati con successo!');
      fetchData();
    } catch (error) {
      console.error('Error generating rent:', error);
      alert('Errore nella generazione degli affitti');
    } finally {
      setGeneratingRent(false);
    }
  };

  const availableUsers = allUsers.filter(u => !u.propertyId || u.propertyId === tenantForm.propertyId);

  if (isLoading || loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar t={t} />
        <div style={{ flex: 1, padding: '40px', color: '#fff' }}>Caricamento...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar t={t} />
      
      <div className="main-content" style={{ flex: 1, padding: '40px', color: '#fff' }}>
        {/* Header */}
        <div style={{
          background: 'rgba(20, 20, 20, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(200, 150, 100, 0.3)',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '30px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '300', letterSpacing: '2px', marginBottom: '8px' }}>
                <Home size={28} style={{ display: 'inline', marginRight: '12px', verticalAlign: 'middle' }} />
                Gestione Affitti
              </h1>
              <p style={{ fontSize: '14px', color: '#aaa', margin: 0 }}>
                Gestisci proprietà, inquilini e genera transazioni affitto
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowAddProperty(true)}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(200, 150, 100, 0.2)',
                  border: '1px solid rgba(200, 150, 100, 0.5)',
                  borderRadius: '8px',
                  color: '#c89664',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(200, 150, 100, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(200, 150, 100, 0.2)';
                }}
              >
                <Plus size={16} />
                Nuova Proprietà
              </button>
              <button
                onClick={() => setShowAssignTenant(true)}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(72, 199, 116, 0.2)',
                  border: '1px solid rgba(72, 199, 116, 0.5)',
                  borderRadius: '8px',
                  color: '#48c774',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(72, 199, 116, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(72, 199, 116, 0.2)';
                }}
              >
                <UserPlus size={16} />
                Assegna Inquilino
              </button>
              <button
                onClick={handleGenerateRent}
                disabled={generatingRent}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(0, 212, 255, 0.2)',
                  border: '1px solid rgba(0, 212, 255, 0.5)',
                  borderRadius: '8px',
                  color: '#00d4ff',
                  cursor: generatingRent ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  opacity: generatingRent ? 0.5 : 1,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (!generatingRent) e.currentTarget.style.background = 'rgba(0, 212, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 212, 255, 0.2)';
                }}
              >
                <DollarSign size={16} />
                {generatingRent ? 'Generazione...' : 'Genera Affitti'}
              </button>
            </div>
          </div>
        </div>

        {/* Properties List */}
        {properties.length === 0 ? (
          <div style={{
            background: 'rgba(20, 20, 20, 0.6)',
            border: '1px solid rgba(200, 150, 100, 0.3)',
            borderRadius: '12px',
            padding: '60px',
            textAlign: 'center',
          }}>
            <Home size={48} color="#c89664" style={{ margin: '0 auto 20px', opacity: 0.5 }} />
            <p style={{ fontSize: '16px', color: '#aaa' }}>
              Nessuna proprietà trovata. Crea la prima proprietà per iniziare.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {properties.map((property) => (
              <div
                key={property.id}
                style={{
                  background: 'rgba(20, 20, 20, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(200, 150, 100, 0.3)',
                  borderRadius: '12px',
                  padding: '25px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(200, 150, 100, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(200, 150, 100, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Property Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '400', color: '#fff', marginBottom: '8px' }}>
                      {property.name}
                    </h3>
                    {property.address && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#aaa', fontSize: '13px', marginBottom: '8px' }}>
                        <MapPin size={14} />
                        {property.address}
                      </div>
                    )}
                    {property.notes && (
                      <p style={{ fontSize: '12px', color: '#888', margin: '8px 0 0 0' }}>
                        {property.notes}
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: '#c89664', marginBottom: '4px' }}>
                      €{property.monthlyRent.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      al mese
                    </div>
                  </div>
                </div>

                {/* Property Stats */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '12px',
                  marginBottom: '20px',
                  padding: '15px',
                  background: 'rgba(10, 10, 10, 0.3)',
                  borderRadius: '8px',
                }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#888', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Capacità
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '500', color: '#fff' }}>
                      {property.capacity} persone
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#888', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Occupati
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '500', color: property.tenants.length >= property.capacity ? '#ffc107' : '#48c774' }}>
                      {property.tenants.length} / {property.capacity}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#888', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Entrate Mensili
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '500', color: '#48c774' }}>
                      €{property.tenants.reduce((sum, t) => sum + (t.rentAmount || 0), 0).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Tenants */}
                {property.tenants.length > 0 ? (
                  <div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#c89664', 
                      marginBottom: '12px', 
                      textTransform: 'uppercase', 
                      letterSpacing: '1px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}>
                      <Users size={14} />
                      Inquilini ({property.tenants.length})
                    </div>
                    <div style={{ display: 'grid', gap: '10px' }}>
                      {property.tenants.map((tenant) => (
                        <div
                          key={tenant.id}
                          style={{
                            background: 'rgba(10, 10, 10, 0.4)',
                            border: '1px solid rgba(200, 150, 100, 0.2)',
                            borderRadius: '8px',
                            padding: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #c89664 0%, #d4a574 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px',
                              fontWeight: '500',
                              color: '#0a0a0a',
                            }}>
                              {tenant.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: '400', color: '#fff' }}>
                                {tenant.name}
                              </div>
                              <div style={{ fontSize: '11px', color: '#888' }}>
                                {tenant.email}
                              </div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '16px', fontWeight: '500', color: tenant.walletBalance < 0 ? '#ff4757' : '#48c774' }}>
                              €{tenant.walletBalance.toLocaleString()}
                            </div>
                            <div style={{ fontSize: '11px', color: '#888' }}>
                              {tenant.rentAmount ? `€${tenant.rentAmount}/${tenant.rentType === 'weekly' ? 'sett' : 'mese'}` : 'Non impostato'}
                            </div>
                            {tenant.moveInDate && (
                              <div style={{ fontSize: '10px', color: '#666', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                                <Calendar size={10} />
                                {new Date(tenant.moveInDate).toLocaleDateString('it-IT')}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#666',
                    fontSize: '13px',
                    background: 'rgba(10, 10, 10, 0.3)',
                    borderRadius: '8px',
                  }}>
                    Nessun inquilino assegnato
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Property Modal */}
        {showAddProperty && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}>
            <div style={{
              background: 'rgba(20, 20, 20, 0.95)',
              border: '1px solid rgba(200, 150, 100, 0.3)',
              borderRadius: '12px',
              padding: '30px',
              width: '90%',
              maxWidth: '500px',
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '400', color: '#fff', marginBottom: '20px' }}>
                Nuova Proprietà
              </h2>
              <form onSubmit={handleCreateProperty}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>
                    Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={propertyForm.name}
                    onChange={(e) => setPropertyForm({ ...propertyForm, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(10, 10, 10, 0.5)',
                      border: '1px solid rgba(200, 150, 100, 0.3)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>
                    Indirizzo
                  </label>
                  <input
                    type="text"
                    value={propertyForm.address}
                    onChange={(e) => setPropertyForm({ ...propertyForm, address: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(10, 10, 10, 0.5)',
                      border: '1px solid rgba(200, 150, 100, 0.3)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>
                      Affitto Mensile (€) *
                    </label>
                    <input
                      type="number"
                      required
                      value={propertyForm.monthlyRent}
                      onChange={(e) => setPropertyForm({ ...propertyForm, monthlyRent: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: 'rgba(10, 10, 10, 0.5)',
                        border: '1px solid rgba(200, 150, 100, 0.3)',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>
                      Capacità *
                    </label>
                    <input
                      type="number"
                      required
                      value={propertyForm.capacity}
                      onChange={(e) => setPropertyForm({ ...propertyForm, capacity: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: 'rgba(10, 10, 10, 0.5)',
                        border: '1px solid rgba(200, 150, 100, 0.3)',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>
                    Note
                  </label>
                  <textarea
                    value={propertyForm.notes}
                    onChange={(e) => setPropertyForm({ ...propertyForm, notes: e.target.value })}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(10, 10, 10, 0.5)',
                      border: '1px solid rgba(200, 150, 100, 0.3)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '14px',
                      resize: 'vertical',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddProperty(false)}
                    style={{
                      padding: '10px 20px',
                      background: 'rgba(100, 100, 100, 0.2)',
                      border: '1px solid rgba(100, 100, 100, 0.5)',
                      borderRadius: '6px',
                      color: '#aaa',
                      cursor: 'pointer',
                    }}
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 20px',
                      background: 'rgba(200, 150, 100, 0.3)',
                      border: '1px solid rgba(200, 150, 100, 0.5)',
                      borderRadius: '6px',
                      color: '#c89664',
                      cursor: 'pointer',
                    }}
                  >
                    Crea Proprietà
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Assign Tenant Modal */}
        {showAssignTenant && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}>
            <div style={{
              background: 'rgba(20, 20, 20, 0.95)',
              border: '1px solid rgba(200, 150, 100, 0.3)',
              borderRadius: '12px',
              padding: '30px',
              width: '90%',
              maxWidth: '500px',
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '400', color: '#fff', marginBottom: '20px' }}>
                Assegna Inquilino
              </h2>
              <form onSubmit={handleAssignTenant}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>
                    Proprietà *
                  </label>
                  <select
                    required
                    value={tenantForm.propertyId}
                    onChange={(e) => setTenantForm({ ...tenantForm, propertyId: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(10, 10, 10, 0.5)',
                      border: '1px solid rgba(200, 150, 100, 0.3)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '14px',
                    }}
                  >
                    <option value="">Seleziona proprietà</option>
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.tenants.length}/{p.capacity})
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>
                    Utente *
                  </label>
                  <select
                    required
                    value={tenantForm.userId}
                    onChange={(e) => setTenantForm({ ...tenantForm, userId: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(10, 10, 10, 0.5)',
                      border: '1px solid rgba(200, 150, 100, 0.3)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '14px',
                    }}
                  >
                    <option value="">Seleziona utente</option>
                    {availableUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} - {u.role} {u.propertyId ? '(già assegnato)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>
                      Affitto (€)
                    </label>
                    <input
                      type="number"
                      value={tenantForm.rentAmount}
                      onChange={(e) => setTenantForm({ ...tenantForm, rentAmount: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: 'rgba(10, 10, 10, 0.5)',
                        border: '1px solid rgba(200, 150, 100, 0.3)',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>
                      Tipo
                    </label>
                    <select
                      value={tenantForm.rentType}
                      onChange={(e) => setTenantForm({ ...tenantForm, rentType: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: 'rgba(10, 10, 10, 0.5)',
                        border: '1px solid rgba(200, 150, 100, 0.3)',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '14px',
                      }}
                    >
                      <option value="weekly">Settimanale</option>
                      <option value="monthly">Mensile</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>
                    Data Ingresso
                  </label>
                  <input
                    type="date"
                    value={tenantForm.moveInDate}
                    onChange={(e) => setTenantForm({ ...tenantForm, moveInDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(10, 10, 10, 0.5)',
                      border: '1px solid rgba(200, 150, 100, 0.3)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowAssignTenant(false)}
                    style={{
                      padding: '10px 20px',
                      background: 'rgba(100, 100, 100, 0.2)',
                      border: '1px solid rgba(100, 100, 100, 0.5)',
                      borderRadius: '6px',
                      color: '#aaa',
                      cursor: 'pointer',
                    }}
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 20px',
                      background: 'rgba(72, 199, 116, 0.3)',
                      border: '1px solid rgba(72, 199, 116, 0.5)',
                      borderRadius: '6px',
                      color: '#48c774',
                      cursor: 'pointer',
                    }}
                  >
                    Assegna
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
