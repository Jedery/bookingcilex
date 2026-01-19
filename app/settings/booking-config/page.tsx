'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useTranslation } from '../../i18n/useTranslation';

// Configurazione eventi iniziale
const DEFAULT_EVENTS = [
  { id: 1, name: 'Open Bar', basePrice: 50, category: 'Nightlife', active: true },
  { id: 2, name: 'Boat Party', basePrice: 80, category: 'Events', active: true },
  { id: 3, name: 'Escursione a Formentera', basePrice: 120, category: 'Excursions', active: true },
  { id: 4, name: 'Cena Spettacolo', basePrice: 90, category: 'Dining', active: true },
  { id: 5, name: 'Beach Club Day', basePrice: 60, category: 'Beach', active: true },
  { id: 6, name: 'VIP Table Service', basePrice: 200, category: 'VIP', active: true },
  { id: 7, name: 'Sunset Catamaran', basePrice: 150, category: 'Excursions', active: true },
  { id: 8, name: 'Club Entry + Drinks', basePrice: 40, category: 'Nightlife', active: true },
];

// Configurazione campi obbligatori
const DEFAULT_FIELD_CONFIG = {
  firstName: { required: true, visible: true, label: 'Nome' },
  lastName: { required: true, visible: true, label: 'Cognome' },
  email: { required: true, visible: true, label: 'Email' },
  phone: { required: true, visible: true, label: 'Telefono' },
  country: { required: false, visible: true, label: 'Paese' },
  notes: { required: false, visible: true, label: 'Note Cliente' },
  adminNotes: { required: false, visible: true, label: 'Note Admin' },
  guestListAccess: { required: false, visible: true, label: 'Accesso Guest List' },
  paymentMethod: { required: true, visible: true, label: 'Metodo Pagamento' },
  deposit: { required: false, visible: true, label: 'Acconto' },
};

export default function BookingConfigPage() {
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();
  
  // Controllo accesso - solo superadmin e founder
  const [userRole, setUserRole] = useState('superadmin'); // Simulo, poi integrerai con auth
  const [hasAccess, setHasAccess] = useState(true);
  
  // Stati per la configurazione
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [fieldConfig, setFieldConfig] = useState(DEFAULT_FIELD_CONFIG);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [activeTab, setActiveTab] = useState<'events' | 'fields' | 'pricing'>('events');
  
  // Form per nuovo/modifica evento
  const [eventForm, setEventForm] = useState({
    id: 0,
    name: '',
    basePrice: 0,
    category: 'Events',
    active: true,
  });

  // Configurazione prezzi dinamici
  const [pricingConfig, setPricingConfig] = useState({
    weekendMultiplier: 1.2,
    eveningMultiplier: 1.15,
    taxRate: 0.1,
    eveningStartHour: 20,
    eveningEndHour: 4,
  });

  useEffect(() => {
    // Verifica accesso
    if (userRole !== 'superadmin' && userRole !== 'founder') {
      setHasAccess(false);
    }
    
    // Carica configurazione salvata (da localStorage o API)
    loadConfiguration();
  }, []);

  const loadConfiguration = () => {
    // Carica da localStorage
    const savedEvents = localStorage.getItem('bookingEvents');
    const savedFields = localStorage.getItem('bookingFields');
    const savedPricing = localStorage.getItem('bookingPricing');
    
    if (savedEvents) setEvents(JSON.parse(savedEvents));
    if (savedFields) setFieldConfig(JSON.parse(savedFields));
    if (savedPricing) setPricingConfig(JSON.parse(savedPricing));
  };

  const saveConfiguration = () => {
    // Salva in localStorage (poi integrerai con API)
    localStorage.setItem('bookingEvents', JSON.stringify(events));
    localStorage.setItem('bookingFields', JSON.stringify(fieldConfig));
    localStorage.setItem('bookingPricing', JSON.stringify(pricingConfig));
    
    alert('✅ Configurazione salvata con successo!');
  };

  const resetConfiguration = () => {
    if (confirm('⚠️ Sei sicuro di voler ripristinare la configurazione di default?')) {
      setEvents(DEFAULT_EVENTS);
      setFieldConfig(DEFAULT_FIELD_CONFIG);
      setPricingConfig({
        weekendMultiplier: 1.2,
        eveningMultiplier: 1.15,
        taxRate: 0.1,
        eveningStartHour: 20,
        eveningEndHour: 4,
      });
      saveConfiguration();
    }
  };

  // Gestione Eventi
  const handleAddEvent = () => {
    const newEvent = {
      ...eventForm,
      id: Math.max(...events.map(e => e.id)) + 1,
    };
    setEvents([...events, newEvent]);
    setEventForm({ id: 0, name: '', basePrice: 0, category: 'Events', active: true });
    setIsEditingEvent(false);
  };

  const handleEditEvent = (event: any) => {
    setEventForm(event);
    setSelectedEvent(event);
    setIsEditingEvent(true);
  };

  const handleUpdateEvent = () => {
    setEvents(events.map(e => e.id === eventForm.id ? eventForm : e));
    setEventForm({ id: 0, name: '', basePrice: 0, category: 'Events', active: true });
    setIsEditingEvent(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (id: number) => {
    if (confirm('Sei sicuro di voler eliminare questo evento?')) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  const toggleEventActive = (id: number) => {
    setEvents(events.map(e => e.id === id ? { ...e, active: !e.active } : e));
  };

  // Gestione Campi
  const toggleFieldRequired = (fieldName: string) => {
    setFieldConfig({
      ...fieldConfig,
      [fieldName]: {
        ...fieldConfig[fieldName],
        required: !fieldConfig[fieldName].required,
      }
    });
  };

  const toggleFieldVisible = (fieldName: string) => {
    setFieldConfig({
      ...fieldConfig,
      [fieldName]: {
        ...fieldConfig[fieldName],
        visible: !fieldConfig[fieldName].visible,
      }
    });
  };

  const updateFieldLabel = (fieldName: string, label: string) => {
    setFieldConfig({
      ...fieldConfig,
      [fieldName]: {
        ...fieldConfig[fieldName],
        label,
      }
    });
  };

  if (!hasAccess) {
    return (
      <div className="dashboard-container">
        <Sidebar t={t} />
        <div className="main-content">
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
            border: '2px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '16px',
          }}>
            <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>🚫</h1>
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>Accesso Negato</h2>
            <p style={{ fontSize: '16px', color: '#888' }}>
              Solo Superadmin e Founder possono accedere a questa sezione.
            </p>
            <button 
              onClick={() => router.push('/dashboard')}
              style={{
                marginTop: '30px',
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                border: 'none',
                borderRadius: '10px',
                color: '#0f1419',
                fontWeight: '700',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Torna alla Dashboard
            </button>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
              ⚙️ Configurazione Prenotazioni
            </h1>
            <p style={{ fontSize: '14px', color: '#888' }}>
              👑 Accesso Riservato: {userRole.toUpperCase()}
            </p>
          </div>
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '30px',
          borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '0',
        }}>
          <button
            onClick={() => setActiveTab('events')}
            style={{
              padding: '14px 28px',
              background: activeTab === 'events' ? 'linear-gradient(135deg, #c89664, #b87d4b)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'events' ? '3px solid #c89664' : '3px solid transparent',
              color: activeTab === 'events' ? '#fff' : '#888',
              fontWeight: '700',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            🎪 Eventi
          </button>
          <button
            onClick={() => setActiveTab('fields')}
            style={{
              padding: '14px 28px',
              background: activeTab === 'fields' ? 'linear-gradient(135deg, #4ecdc4, #44a08d)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'fields' ? '3px solid #4ecdc4' : '3px solid transparent',
              color: activeTab === 'fields' ? '#fff' : '#888',
              fontWeight: '700',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            📝 Campi Form
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            style={{
              padding: '14px 28px',
              background: activeTab === 'pricing' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'pricing' ? '3px solid #10b981' : '3px solid transparent',
              color: activeTab === 'pricing' ? '#fff' : '#888',
              fontWeight: '700',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            💰 Prezzi Dinamici
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'events' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              
              {/* Lista Eventi */}
              <div className="card" style={{ 
                background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.95), rgba(15, 15, 18, 0.95))',
                border: '2px solid rgba(200, 150, 100, 0.2)',
                borderRadius: '16px',
                padding: '24px',
                maxHeight: '600px',
                overflowY: 'auto',
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#c89664' }}>
                  📋 Lista Eventi
                </h3>
                
                {events.map((event) => (
                  <div key={event.id} style={{
                    background: event.active ? 'rgba(78, 205, 196, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                    border: `1.5px solid ${event.active ? 'rgba(78, 205, 196, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '12px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px', color: '#fff' }}>
                          {event.name}
                        </h4>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#888' }}>
                          <span>💰 €{event.basePrice}</span>
                          <span>📁 {event.category}</span>
                          <span>{event.active ? '✅ Attivo' : '❌ Disattivo'}</span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => toggleEventActive(event.id)}
                          style={{
                            padding: '8px 12px',
                            background: event.active ? 'rgba(239, 68, 68, 0.2)' : 'rgba(78, 205, 196, 0.2)',
                            border: 'none',
                            borderRadius: '8px',
                            color: event.active ? '#ef4444' : '#4ecdc4',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          {event.active ? 'Disattiva' : 'Attiva'}
                        </button>
                        <button
                          onClick={() => handleEditEvent(event)}
                          style={{
                            padding: '8px 12px',
                            background: 'rgba(78, 205, 196, 0.2)',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#4ecdc4',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          ✏️ Modifica
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          style={{
                            padding: '8px 12px',
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#ef4444',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Aggiungi/Modifica Evento */}
              <div className="card" style={{ 
                background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.95), rgba(15, 15, 18, 0.95))',
                border: '2px solid rgba(78, 205, 196, 0.2)',
                borderRadius: '16px',
                padding: '24px',
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#4ecdc4' }}>
                  {isEditingEvent ? '✏️ Modifica Evento' : '➕ Nuovo Evento'}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', display: 'block', marginBottom: '8px' }}>
                      Nome Evento *
                    </label>
                    <input
                      type="text"
                      value={eventForm.name}
                      onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                      placeholder="es. Open Bar Deluxe"
                      style={{
                        width: '100%',
                        padding: '14px',
                        background: '#1a1a1e',
                        border: '1.5px solid #2a3a52',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '15px',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', display: 'block', marginBottom: '8px' }}>
                      Prezzo Base (€) *
                    </label>
                    <input
                      type="number"
                      value={eventForm.basePrice}
                      onChange={(e) => setEventForm({ ...eventForm, basePrice: parseFloat(e.target.value) })}
                      placeholder="50"
                      style={{
                        width: '100%',
                        padding: '14px',
                        background: '#1a1a1e',
                        border: '1.5px solid #2a3a52',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '15px',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', display: 'block', marginBottom: '8px' }}>
                      Categoria *
                    </label>
                    <select
                      value={eventForm.category}
                      onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '14px',
                        background: '#1a1a1e',
                        border: '1.5px solid #2a3a52',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '15px',
                      }}
                    >
                      <option value="Nightlife">Nightlife</option>
                      <option value="Events">Events</option>
                      <option value="Excursions">Excursions</option>
                      <option value="Dining">Dining</option>
                      <option value="Beach">Beach</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="checkbox"
                      checked={eventForm.active}
                      onChange={(e) => setEventForm({ ...eventForm, active: e.target.checked })}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <label style={{ fontSize: '15px', color: '#fff' }}>
                      Evento Attivo
                    </label>
                  </div>

                  <button
                    onClick={isEditingEvent ? handleUpdateEvent : handleAddEvent}
                    disabled={!eventForm.name || !eventForm.basePrice}
                    style={{
                      padding: '16px',
                      background: (!eventForm.name || !eventForm.basePrice)
                        ? 'rgba(100, 100, 100, 0.3)'
                        : 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#fff',
                      fontWeight: '700',
                      fontSize: '16px',
                      cursor: (!eventForm.name || !eventForm.basePrice) ? 'not-allowed' : 'pointer',
                      marginTop: '10px',
                    }}
                  >
                    {isEditingEvent ? '✅ Aggiorna Evento' : '➕ Aggiungi Evento'}
                  </button>

                  {isEditingEvent && (
                    <button
                      onClick={() => {
                        setIsEditingEvent(false);
                        setEventForm({ id: 0, name: '', basePrice: 0, category: 'Events', active: true });
                      }}
                      style={{
                        padding: '12px',
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '10px',
                        color: '#ef4444',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: 'pointer',
                      }}
                    >
                      ❌ Annulla Modifica
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fields' && (
          <div className="card" style={{ 
            background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.95), rgba(15, 15, 18, 0.95))',
            border: '2px solid rgba(78, 205, 196, 0.2)',
            borderRadius: '16px',
            padding: '24px',
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#4ecdc4' }}>
              📝 Configurazione Campi Form
            </h3>

            <div style={{ display: 'grid', gap: '16px' }}>
              {Object.entries(fieldConfig).map(([fieldName, config]) => (
                <div key={fieldName} style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr',
                  alignItems: 'center',
                  gap: '16px',
                }}>
                  <div>
                    <input
                      type="text"
                      value={config.label}
                      onChange={(e) => updateFieldLabel(fieldName, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: '#1a1a1e',
                        border: '1px solid #2a3a52',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '14px',
                      }}
                    />
                    <span style={{ fontSize: '11px', color: '#666', marginTop: '4px', display: 'block' }}>
                      {fieldName}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleFieldVisible(fieldName)}
                    style={{
                      padding: '10px 16px',
                      background: config.visible ? 'rgba(78, 205, 196, 0.2)' : 'rgba(100, 100, 100, 0.2)',
                      border: `1px solid ${config.visible ? 'rgba(78, 205, 196, 0.4)' : 'rgba(100, 100, 100, 0.4)'}`,
                      borderRadius: '8px',
                      color: config.visible ? '#4ecdc4' : '#888',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    {config.visible ? '👁️ Visibile' : '👁️‍🗨️ Nascosto'}
                  </button>

                  <button
                    onClick={() => toggleFieldRequired(fieldName)}
                    style={{
                      padding: '10px 16px',
                      background: config.required ? 'rgba(239, 68, 68, 0.2)' : 'rgba(100, 100, 100, 0.2)',
                      border: `1px solid ${config.required ? 'rgba(239, 68, 68, 0.4)' : 'rgba(100, 100, 100, 0.4)'}`,
                      borderRadius: '8px',
                      color: config.required ? '#ef4444' : '#888',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    {config.required ? '⚠️ Obbligatorio' : '➖ Facoltativo'}
                  </button>

                  <div style={{ fontSize: '12px', color: '#888', textAlign: 'center' }}>
                    {config.visible && config.required && '✅'}
                    {config.visible && !config.required && '📋'}
                    {!config.visible && '❌'}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: 'rgba(78, 205, 196, 0.1)',
              border: '1px solid rgba(78, 205, 196, 0.3)',
              borderRadius: '10px',
            }}>
              <p style={{ fontSize: '13px', color: '#4ecdc4', lineHeight: '1.6', margin: 0 }}>
                💡 <strong>Info:</strong> Modifica le etichette, rendi i campi obbligatori/facoltativi o nascondili completamente dal form di prenotazione.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="card" style={{ 
            background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.95), rgba(15, 15, 18, 0.95))',
            border: '2px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '800px',
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#10b981' }}>
              💰 Configurazione Prezzi Dinamici
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#888', display: 'block', marginBottom: '8px' }}>
                  Moltiplicatore Weekend (Ven-Sab)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="range"
                    min="1"
                    max="2"
                    step="0.05"
                    value={pricingConfig.weekendMultiplier}
                    onChange={(e) => setPricingConfig({ ...pricingConfig, weekendMultiplier: parseFloat(e.target.value) })}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: '18px', fontWeight: '700', color: '#10b981', minWidth: '80px' }}>
                    x{pricingConfig.weekendMultiplier.toFixed(2)} (+{((pricingConfig.weekendMultiplier - 1) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#888', display: 'block', marginBottom: '8px' }}>
                  Moltiplicatore Orario Serale
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="range"
                    min="1"
                    max="2"
                    step="0.05"
                    value={pricingConfig.eveningMultiplier}
                    onChange={(e) => setPricingConfig({ ...pricingConfig, eveningMultiplier: parseFloat(e.target.value) })}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: '18px', fontWeight: '700', color: '#10b981', minWidth: '80px' }}>
                    x{pricingConfig.eveningMultiplier.toFixed(2)} (+{((pricingConfig.eveningMultiplier - 1) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#888', display: 'block', marginBottom: '8px' }}>
                  Percentuale Tasse
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="range"
                    min="0"
                    max="0.3"
                    step="0.01"
                    value={pricingConfig.taxRate}
                    onChange={(e) => setPricingConfig({ ...pricingConfig, taxRate: parseFloat(e.target.value) })}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: '18px', fontWeight: '700', color: '#10b981', minWidth: '80px' }}>
                    {(pricingConfig.taxRate * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#888', display: 'block', marginBottom: '8px' }}>
                    Ora Inizio Serale
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={pricingConfig.eveningStartHour}
                    onChange={(e) => setPricingConfig({ ...pricingConfig, eveningStartHour: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: '#1a1a1e',
                      border: '1.5px solid #2a3a52',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '15px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#888', display: 'block', marginBottom: '8px' }}>
                    Ora Fine Serale
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={pricingConfig.eveningEndHour}
                    onChange={(e) => setPricingConfig({ ...pricingConfig, eveningEndHour: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: '#1a1a1e',
                      border: '1.5px solid #2a3a52',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '15px',
                    }}
                  />
                </div>
              </div>

              <div style={{
                padding: '16px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '10px',
              }}>
                <p style={{ fontSize: '13px', color: '#10b981', lineHeight: '1.6', margin: 0 }}>
                  📊 <strong>Esempio:</strong> Un evento da €100 nel weekend alle 22:00 costerà:<br/>
                  €100 × {pricingConfig.weekendMultiplier.toFixed(2)} (weekend) × {pricingConfig.eveningMultiplier.toFixed(2)} (serale) = €{(100 * pricingConfig.weekendMultiplier * pricingConfig.eveningMultiplier).toFixed(2)}<br/>
                  + Tasse ({(pricingConfig.taxRate * 100).toFixed(0)}%) = €{(100 * pricingConfig.weekendMultiplier * pricingConfig.eveningMultiplier * (1 + pricingConfig.taxRate)).toFixed(2)} <strong>Totale</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ 
          position: 'fixed', 
          bottom: '30px', 
          right: '30px', 
          display: 'flex', 
          gap: '12px',
          zIndex: 1000,
        }}>
          <button
            onClick={resetConfiguration}
            style={{
              padding: '16px 24px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontWeight: '700',
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)',
            }}
          >
            🔄 Reset Config
          </button>
          
          <button
            onClick={saveConfiguration}
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
              border: 'none',
              borderRadius: '12px',
              color: '#0f1419',
              fontWeight: '700',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(78, 205, 196, 0.3)',
            }}
          >
            💾 Salva Configurazione
          </button>
        </div>
      </div>
    </div>
  );
}
