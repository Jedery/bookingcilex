'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useTranslation } from '../../i18n/useTranslation';

// Configurazione eventi organizzati per gruppi (come in add booking)
const DEFAULT_EVENTS_GROUPS = [
  {
    id: 1,
    group: '🍹 OPEN BAR',
    color: '#ff6b9d',
    bgColor: 'rgba(255, 107, 157, 0.15)',
    events: [
      { id: 1, name: 'Tantra', basePrice: 50, description: 'Open bar completo presso Tantra Club. Include bevande standard e accesso prioritario.', availableTimes: ['22:00', '23:00', '00:00', '01:00'], active: true },
      { id: 2, name: 'Moma', basePrice: 60, description: 'Open bar premium presso Moma. Include cocktails selezionati e accesso VIP.', availableTimes: ['23:00', '00:00', '01:00', '02:00'], active: true },
      { id: 3, name: "Angelo's", basePrice: 55, description: "Open bar presso Angelo's. Include bevande e snacks leggeri.", availableTimes: ['22:00', '23:00', '00:00'], active: true },
      { id: 4, name: 'Ushuaia', basePrice: 70, description: 'Open bar esclusivo presso Ushuaia Beach Club. Include premium drinks e accesso beach area.', availableTimes: ['17:00', '18:00', '19:00', '20:00'], active: true },
    ],
  },
  {
    id: 2,
    group: '⛵ BOAT PARTY',
    color: '#4ecdc4',
    bgColor: 'rgba(78, 205, 196, 0.15)',
    events: [
      { id: 5, name: 'Standard (3 ore)', basePrice: 100, description: 'Boat party di 3 ore. Include bevande, musica e DJ set. Partenza dal porto.', availableTimes: ['10:00', '14:00', '18:00'], active: true },
      { id: 6, name: 'Premium (5 ore + Pranzo)', basePrice: 130, description: 'Boat party premium di 5 ore con pranzo incluso. Open bar completo, DJ set e catering gourmet.', availableTimes: ['11:00', '12:00'], active: true },
      { id: 7, name: 'Sunset (4 ore)', basePrice: 115, description: 'Boat party al tramonto di 4 ore. Aperitivo, musica live e vista spettacolare sul tramonto.', availableTimes: ['17:00', '18:00', '19:00'], active: true },
    ],
  },
  {
    id: 3,
    group: '🏝️ ESCURSIONI',
    color: '#95e1d3',
    bgColor: 'rgba(149, 225, 211, 0.15)',
    events: [
      { id: 8, name: 'Formentera Standard', basePrice: 120, description: 'Escursione giornaliera a Formentera. Include trasporto, pranzo e tempo libero in spiaggia.', availableTimes: ['09:00', '10:00'], active: true },
      { id: 9, name: 'Formentera VIP', basePrice: 180, description: 'Escursione VIP a Formentera. Trasporto privato, pranzo gourmet, beach club access e servizio dedicato.', availableTimes: ['09:00', '10:00', '11:00'], active: true },
      { id: 10, name: 'Sunset Catamaran', basePrice: 150, description: 'Escursione in catamarano al tramonto. Include aperitivo, snorkeling e vista panoramica.', availableTimes: ['17:00', '18:00', '19:00'], active: true },
    ],
  },
  {
    id: 4,
    group: '🏖️ BEACH CLUB',
    color: '#f7b731',
    bgColor: 'rgba(247, 183, 49, 0.15)',
    events: [
      { id: 11, name: 'Nassau Beach Club', basePrice: 60, description: 'Giornata al Nassau Beach Club. Include lettino, ombrellone e credito consumazione.', availableTimes: ['10:00', '11:00', '12:00', '13:00'], active: true },
      { id: 12, name: 'Nikki Beach', basePrice: 80, description: 'Accesso Nikki Beach con lettino riservato. Include welcome drink e credito bar.', availableTimes: ['11:00', '12:00', '13:00', '14:00'], active: true },
      { id: 13, name: 'Blue Marlin', basePrice: 90, description: 'Blue Marlin Ibiza experience. Lettino VIP, servizio al tavolo e credito consumazione.', availableTimes: ['10:00', '11:00', '12:00'], active: true },
    ],
  },
  {
    id: 5,
    group: '🍽️ CENA & SPETTACOLO',
    color: '#c89664',
    bgColor: 'rgba(200, 150, 100, 0.15)',
    events: [
      { id: 14, name: 'Cena Spettacolo Standard', basePrice: 90, description: 'Cena con spettacolo live. Menu 3 portate, bevande e intrattenimento serale.', availableTimes: ['20:00', '21:00', '22:00'], active: true },
      { id: 15, name: 'Cena VIP + Show', basePrice: 150, description: 'Esperienza VIP con cena gourmet 5 portate, vini selezionati e spettacolo esclusivo.', availableTimes: ['19:00', '20:00', '21:00'], active: true },
    ],
  },
  {
    id: 6,
    group: '⭐ VIP SERVICES',
    color: '#a29bfe',
    bgColor: 'rgba(162, 155, 254, 0.15)',
    events: [
      { id: 16, name: 'VIP Table Service', basePrice: 200, description: 'Servizio tavolo VIP in discoteca. Include tavolo riservato, bottiglie premium e host dedicato.', availableTimes: ['22:00', '23:00', '00:00', '01:00'], active: true },
      { id: 17, name: 'Club Entry + Drinks', basePrice: 40, description: 'Ingresso club con drink inclusi. Skip the line e accesso prioritario.', availableTimes: ['23:00', '00:00', '01:00'], active: true },
    ],
  },
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
  const [eventsGroups, setEventsGroups] = useState(DEFAULT_EVENTS_GROUPS);
  const [fieldConfig, setFieldConfig] = useState(DEFAULT_FIELD_CONFIG);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [activeTab, setActiveTab] = useState<'events' | 'fields' | 'pricing'>('events');
  
  // Form per gruppo
  const [groupForm, setGroupForm] = useState({
    id: 0,
    group: '',
    color: '#ff6b9d',
    bgColor: 'rgba(255, 107, 157, 0.15)',
  });

  // Form per evento
  const [eventForm, setEventForm] = useState({
    id: 0,
    name: '',
    basePrice: 0,
    description: '',
    availableTimes: [] as string[],
    active: true,
    groupId: 0,
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
    const savedGroups = localStorage.getItem('bookingEventsGroups');
    const savedFields = localStorage.getItem('bookingFields');
    const savedPricing = localStorage.getItem('bookingPricing');
    
    if (savedGroups) setEventsGroups(JSON.parse(savedGroups));
    if (savedFields) setFieldConfig(JSON.parse(savedFields));
    if (savedPricing) setPricingConfig(JSON.parse(savedPricing));
  };

  const saveConfiguration = () => {
    // Salva in localStorage (poi integrerai con API)
    localStorage.setItem('bookingEventsGroups', JSON.stringify(eventsGroups));
    localStorage.setItem('bookingFields', JSON.stringify(fieldConfig));
    localStorage.setItem('bookingPricing', JSON.stringify(pricingConfig));
    
    alert('✅ Configurazione salvata con successo!');
  };

  const resetConfiguration = () => {
    if (confirm('⚠️ Sei sicuro di voler ripristinare la configurazione di default?')) {
      setEventsGroups(DEFAULT_EVENTS_GROUPS);
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

  // === GESTIONE GRUPPI/CATEGORIE ===
  const handleAddGroup = () => {
    const newGroup = {
      ...groupForm,
      id: Math.max(...eventsGroups.map(g => g.id), 0) + 1,
      events: [],
    };
    setEventsGroups([...eventsGroups, newGroup]);
    setGroupForm({ id: 0, group: '', color: '#ff6b9d', bgColor: 'rgba(255, 107, 157, 0.15)' });
    setIsEditingGroup(false);
  };

  const handleEditGroup = (group: any) => {
    setGroupForm({
      id: group.id,
      group: group.group,
      color: group.color,
      bgColor: group.bgColor,
    });
    setSelectedGroup(group);
    setIsEditingGroup(true);
  };

  const handleUpdateGroup = () => {
    setEventsGroups(eventsGroups.map(g => 
      g.id === groupForm.id 
        ? { ...g, group: groupForm.group, color: groupForm.color, bgColor: groupForm.bgColor }
        : g
    ));
    setGroupForm({ id: 0, group: '', color: '#ff6b9d', bgColor: 'rgba(255, 107, 157, 0.15)' });
    setIsEditingGroup(false);
    setSelectedGroup(null);
  };

  const handleDeleteGroup = (id: number) => {
    if (confirm('⚠️ Eliminare questo gruppo rimuoverà anche tutti gli eventi al suo interno. Continuare?')) {
      setEventsGroups(eventsGroups.filter(g => g.id !== id));
    }
  };

  // === GESTIONE EVENTI ===
  const handleAddEvent = () => {
    if (!eventForm.groupId) {
      alert('⚠️ Seleziona un gruppo per questo evento');
      return;
    }
    
    const newEvent = {
      id: Math.max(...eventsGroups.flatMap(g => g.events.map(e => e.id)), 0) + 1,
      name: eventForm.name,
      basePrice: eventForm.basePrice,
      description: eventForm.description,
      availableTimes: eventForm.availableTimes,
      active: eventForm.active,
    };
    
    setEventsGroups(eventsGroups.map(g => 
      g.id === eventForm.groupId 
        ? { ...g, events: [...g.events, newEvent] }
        : g
    ));
    
    setEventForm({ id: 0, name: '', basePrice: 0, description: '', availableTimes: [], active: true, groupId: 0 });
    setIsEditingEvent(false);
  };

  const handleEditEvent = (groupId: number, event: any) => {
    setEventForm({
      ...event,
      groupId: groupId,
    });
    setSelectedEvent(event);
    setIsEditingEvent(true);
  };

  const handleUpdateEvent = () => {
    setEventsGroups(eventsGroups.map(g => {
      if (g.id === eventForm.groupId) {
        return {
          ...g,
          events: g.events.map(e => 
            e.id === eventForm.id 
              ? {
                  id: eventForm.id,
                  name: eventForm.name,
                  basePrice: eventForm.basePrice,
                  description: eventForm.description,
                  availableTimes: eventForm.availableTimes,
                  active: eventForm.active,
                }
              : e
          ),
        };
      }
      return g;
    }));
    
    setEventForm({ id: 0, name: '', basePrice: 0, description: '', availableTimes: [], active: true, groupId: 0 });
    setIsEditingEvent(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (groupId: number, eventId: number) => {
    if (confirm('Sei sicuro di voler eliminare questo evento?')) {
      setEventsGroups(eventsGroups.map(g => {
        if (g.id === groupId) {
          return { ...g, events: g.events.filter(e => e.id !== eventId) };
        }
        return g;
      }));
    }
  };

  const toggleEventActive = (groupId: number, eventId: number) => {
    setEventsGroups(eventsGroups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          events: g.events.map(e => e.id === eventId ? { ...e, active: !e.active } : e),
        };
      }
      return g;
    }));
  };

  const handleAddTimeToEvent = (time: string) => {
    if (!eventForm.availableTimes.includes(time)) {
      setEventForm({
        ...eventForm,
        availableTimes: [...eventForm.availableTimes, time].sort(),
      });
    }
  };

  const handleRemoveTimeFromEvent = (time: string) => {
    setEventForm({
      ...eventForm,
      availableTimes: eventForm.availableTimes.filter(t => t !== time),
    });
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
          <button
            onClick={() => setActiveTab('times')}
            style={{
              padding: '14px 28px',
              background: activeTab === 'times' ? 'linear-gradient(135deg, #a29bfe, #6c5ce7)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'times' ? '3px solid #a29bfe' : '3px solid transparent',
              color: activeTab === 'times' ? '#fff' : '#888',
              fontWeight: '700',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            ⏰ Orari Eventi
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'events' && (
          <div>
            {/* Sezione Gruppi/Categorie */}
            <div style={{ marginBottom: '30px' }}>
              <div className="card" style={{ 
                background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.95), rgba(15, 15, 18, 0.95))',
                border: '2px solid rgba(200, 150, 100, 0.2)',
                borderRadius: '16px',
                padding: '24px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#c89664' }}>
                    🎭 Gestione Categorie
                  </h3>
                  <button
                    onClick={() => {
                      setIsEditingGroup(true);
                      setGroupForm({ id: 0, group: '', color: '#ff6b9d', bgColor: 'rgba(255, 107, 157, 0.15)' });
                    }}
                    style={{
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, #c89664, #b87d4b)',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#fff',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    ➕ Nuova Categoria
                  </button>
                </div>

                {/* Form Categoria (se in editing) */}
                {isEditingGroup && (
                  <div style={{
                    padding: '20px',
                    background: 'rgba(200, 150, 100, 0.1)',
                    border: '1px solid rgba(200, 150, 100, 0.3)',
                    borderRadius: '12px',
                    marginBottom: '20px',
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <input
                        type="text"
                        value={groupForm.group}
                        onChange={(e) => setGroupForm({ ...groupForm, group: e.target.value })}
                        placeholder="es. 🍹 OPEN BAR"
                        style={{
                          padding: '14px',
                          background: '#1a1a1e',
                          border: '1.5px solid #2a3a52',
                          borderRadius: '10px',
                          color: '#fff',
                          fontSize: '15px',
                        }}
                      />
                      <input
                        type="color"
                        value={groupForm.color}
                        onChange={(e) => setGroupForm({ ...groupForm, color: e.target.value })}
                        style={{
                          padding: '8px',
                          background: '#1a1a1e',
                          border: '1.5px solid #2a3a52',
                          borderRadius: '10px',
                          cursor: 'pointer',
                        }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={groupForm.id ? handleUpdateGroup : handleAddGroup}
                          disabled={!groupForm.group}
                          style={{
                            flex: 1,
                            padding: '14px',
                            background: !groupForm.group ? 'rgba(100, 100, 100, 0.3)' : 'linear-gradient(135deg, #10b981, #059669)',
                            border: 'none',
                            borderRadius: '10px',
                            color: '#fff',
                            fontWeight: '700',
                            cursor: !groupForm.group ? 'not-allowed' : 'pointer',
                          }}
                        >
                          ✅
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingGroup(false);
                            setGroupForm({ id: 0, group: '', color: '#ff6b9d', bgColor: 'rgba(255, 107, 157, 0.15)' });
                          }}
                          style={{
                            padding: '14px',
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: 'none',
                            borderRadius: '10px',
                            color: '#ef4444',
                            fontWeight: '700',
                            cursor: 'pointer',
                          }}
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lista Gruppi */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
                  {eventsGroups.map((group) => (
                    <div
                      key={group.id}
                      style={{
                        padding: '16px',
                        background: group.bgColor,
                        border: `2px solid ${group.color}`,
                        borderRadius: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', color: group.color, margin: 0 }}>
                          {group.group}
                        </h4>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => handleEditGroup(group)}
                            style={{
                              padding: '6px 10px',
                              background: 'rgba(78, 205, 196, 0.2)',
                              border: 'none',
                              borderRadius: '6px',
                              color: '#4ecdc4',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteGroup(group.id)}
                            style={{
                              padding: '6px 10px',
                              background: 'rgba(239, 68, 68, 0.2)',
                              border: 'none',
                              borderRadius: '6px',
                              color: '#ef4444',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', color: '#888' }}>
                        {group.events.length} eventi
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sezione Eventi per Gruppo */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Lista Eventi Organizzati per Gruppo */}
              <div className="card" style={{ 
                background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.95), rgba(15, 15, 18, 0.95))',
                border: '2px solid rgba(78, 205, 196, 0.2)',
                borderRadius: '16px',
                padding: '24px',
                maxHeight: '700px',
                overflowY: 'auto',
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#4ecdc4' }}>
                  📋 Eventi per Categoria
                </h3>
                
                {eventsGroups.map((group) => (
                  <div key={group.id} style={{ marginBottom: '24px' }}>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: group.color,
                      marginBottom: '12px',
                      padding: '10px 16px',
                      background: group.bgColor,
                      borderRadius: '8px',
                      borderLeft: `4px solid ${group.color}`,
                    }}>
                      {group.group} ({group.events.length})
                    </h4>
                    
                    {group.events.length === 0 ? (
                      <p style={{ fontSize: '13px', color: '#666', fontStyle: 'italic', marginLeft: '16px' }}>
                        Nessun evento in questa categoria
                      </p>
                    ) : (
                      group.events.map((event) => (
                        <div
                          key={event.id}
                          style={{
                            background: event.active ? 'rgba(78, 205, 196, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                            border: `1.5px solid ${event.active ? 'rgba(78, 205, 196, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                            borderRadius: '10px',
                            padding: '12px',
                            marginBottom: '8px',
                            marginLeft: '16px',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                              <h5 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px', color: '#fff' }}>
                                {event.name}
                              </h5>
                              <div style={{ fontSize: '12px', color: '#888' }}>
                                💰 €{event.basePrice} • {event.active ? '✅ Attivo' : '❌ Disattivo'}
                              </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => toggleEventActive(group.id, event.id)}
                                style={{
                                  padding: '6px 10px',
                                  background: event.active ? 'rgba(239, 68, 68, 0.2)' : 'rgba(78, 205, 196, 0.2)',
                                  border: 'none',
                                  borderRadius: '6px',
                                  color: event.active ? '#ef4444' : '#4ecdc4',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                }}
                              >
                                {event.active ? 'OFF' : 'ON'}
                              </button>
                              <button
                                onClick={() => handleEditEvent(group.id, event)}
                                style={{
                                  padding: '6px 10px',
                                  background: 'rgba(78, 205, 196, 0.2)',
                                  border: 'none',
                                  borderRadius: '6px',
                                  color: '#4ecdc4',
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                }}
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(group.id, event.id)}
                                style={{
                                  padding: '6px 10px',
                                  background: 'rgba(239, 68, 68, 0.2)',
                                  border: 'none',
                                  borderRadius: '6px',
                                  color: '#ef4444',
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                }}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', display: 'block', marginBottom: '8px' }}>
                      Categoria *
                    </label>
                    <select
                      value={eventForm.groupId}
                      onChange={(e) => setEventForm({ ...eventForm, groupId: parseInt(e.target.value) })}
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
                      <option value={0}>-- Seleziona Categoria --</option>
                      {eventsGroups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.group}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', display: 'block', marginBottom: '8px' }}>
                      Nome Evento *
                    </label>
                    <input
                      type="text"
                      value={eventForm.name}
                      onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                      placeholder="es. Tantra"
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
                      onChange={(e) => setEventForm({ ...eventForm, basePrice: parseFloat(e.target.value) || 0 })}
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
                      Descrizione
                    </label>
                    <textarea
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      placeholder="Descrizione evento..."
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '14px',
                        background: '#1a1a1e',
                        border: '1.5px solid #2a3a52',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '14px',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', display: 'block', marginBottom: '8px' }}>
                      Orari Disponibili
                    </label>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '8px',
                      marginBottom: '8px',
                    }}>
                      {eventForm.availableTimes.map((time) => (
                        <span
                          key={time}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(78, 205, 196, 0.2)',
                            border: '1px solid rgba(78, 205, 196, 0.4)',
                            borderRadius: '6px',
                            color: '#4ecdc4',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleRemoveTimeFromEvent(time)}
                        >
                          {time} ✕
                        </span>
                      ))}
                      {eventForm.availableTimes.length === 0 && (
                        <span style={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
                          Nessun orario selezionato
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                      {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00'].map((time) => (
                        <button
                          key={time}
                          onClick={() => handleAddTimeToEvent(time)}
                          disabled={eventForm.availableTimes.includes(time)}
                          style={{
                            padding: '8px',
                            background: eventForm.availableTimes.includes(time) ? 'rgba(100, 100, 100, 0.2)' : 'rgba(78, 205, 196, 0.1)',
                            border: '1px solid rgba(78, 205, 196, 0.3)',
                            borderRadius: '6px',
                            color: eventForm.availableTimes.includes(time) ? '#666' : '#4ecdc4',
                            fontSize: '12px',
                            cursor: eventForm.availableTimes.includes(time) ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
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
                    disabled={!eventForm.name || !eventForm.basePrice || !eventForm.groupId}
                    style={{
                      padding: '16px',
                      background: (!eventForm.name || !eventForm.basePrice || !eventForm.groupId)
                        ? 'rgba(100, 100, 100, 0.3)'
                        : 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#fff',
                      fontWeight: '700',
                      fontSize: '16px',
                      cursor: (!eventForm.name || !eventForm.basePrice || !eventForm.groupId) ? 'not-allowed' : 'pointer',
                      marginTop: '10px',
                    }}
                  >
                    {isEditingEvent ? '✅ Aggiorna Evento' : '➕ Aggiungi Evento'}
                  </button>

                  {isEditingEvent && (
                    <button
                      onClick={() => {
                        setIsEditingEvent(false);
                        setSelectedEvent(null);
                        setEventForm({ id: 0, name: '', basePrice: 0, description: '', availableTimes: [], active: true, groupId: 0 });
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

        {/* Tab Orari Eventi */}
        {activeTab === 'times' && (
          <div>
            <div className="card" style={{
              background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.95), rgba(15, 15, 18, 0.95))',
              border: '2px solid rgba(162, 155, 254, 0.2)',
              borderRadius: '16px',
              padding: '24px',
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#a29bfe' }}>
                ⏰ Gestione Orari per Evento
              </h3>
              
              <p style={{ fontSize: '14px', color: '#888', marginBottom: '24px' }}>
                Configura gli orari disponibili per ogni evento. Questi orari verranno mostrati nella selezione durante la creazione di una prenotazione.
              </p>

              <div style={{ display: 'grid', gap: '24px' }}>
                {events.map((event) => (
                  <div key={event.id} style={{
                    background: 'rgba(162, 155, 254, 0.05)',
                    border: '1.5px solid rgba(162, 155, 254, 0.2)',
                    borderRadius: '12px',
                    padding: '20px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                      <div>
                        <h4 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '6px', color: '#fff' }}>
                          {event.name}
                        </h4>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#888' }}>
                          <span>💰 €{event.basePrice}</span>
                          <span>📁 {event.category}</span>
                        </div>
                      </div>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: event.active ? 'rgba(78, 205, 196, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: event.active ? '#4ecdc4' : '#ef4444',
                      }}>
                        {event.active ? '✅ Attivo' : '❌ Non Attivo'}
                      </span>
                    </div>

                    {/* Orari Attuali */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '10px', display: 'block' }}>
                        Orari Disponibili ({event.availableTimes?.length || 0})
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {event.availableTimes && event.availableTimes.length > 0 ? (
                          event.availableTimes.map((time) => (
                            <div key={time} style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 14px',
                              background: 'rgba(162, 155, 254, 0.15)',
                              border: '1px solid rgba(162, 155, 254, 0.3)',
                              borderRadius: '8px',
                              color: '#a29bfe',
                              fontSize: '14px',
                              fontWeight: '600',
                            }}>
                              ⏰ {time}
                              <button
                                onClick={() => handleRemoveTimeFromEvent(event.id, time)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#ef4444',
                                  cursor: 'pointer',
                                  fontSize: '16px',
                                  padding: '0',
                                  marginLeft: '4px',
                                }}
                                title="Rimuovi orario"
                              >
                                ×
                              </button>
                            </div>
                          ))
                        ) : (
                          <span style={{ fontSize: '13px', color: '#666', fontStyle: 'italic' }}>
                            Nessun orario configurato
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Aggiungi Nuovo Orario */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '10px', display: 'block' }}>
                        Aggiungi Orario
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="time"
                          id={`time-input-${event.id}`}
                          style={{
                            flex: 1,
                            padding: '12px',
                            background: '#1a1a1e',
                            border: '1.5px solid #2a3a52',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '14px',
                          }}
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById(`time-input-${event.id}`) as HTMLInputElement;
                            if (input && input.value) {
                              handleAddTimeToEvent(event.id, input.value);
                              input.value = '';
                            }
                          }}
                          style={{
                            padding: '12px 20px',
                            background: 'linear-gradient(135deg, #a29bfe, #6c5ce7)',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          ➕ Aggiungi
                        </button>
                      </div>
                    </div>

                    {/* Descrizione Evento */}
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '10px', display: 'block' }}>
                        📋 Descrizione Evento
                      </label>
                      <textarea
                        value={event.description || ''}
                        onChange={(e) => handleUpdateEventDescription(event.id, e.target.value)}
                        placeholder="Inserisci una descrizione dettagliata dell'evento..."
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: '#1a1a1e',
                          border: '1.5px solid #2a3a52',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '14px',
                          lineHeight: '1.6',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                        }}
                      />
                      <p style={{ fontSize: '12px', color: '#666', marginTop: '6px', fontStyle: 'italic' }}>
                        💡 Questa descrizione verrà mostrata nella pagina di creazione prenotazione dopo la selezione dell'evento.
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Info Box */}
              <div style={{
                marginTop: '24px',
                padding: '16px',
                background: 'rgba(162, 155, 254, 0.1)',
                border: '1px solid rgba(162, 155, 254, 0.3)',
                borderRadius: '10px',
              }}>
                <p style={{ fontSize: '13px', color: '#a29bfe', lineHeight: '1.6', margin: 0 }}>
                  💡 <strong>Suggerimento:</strong> Gli orari che aggiungi qui verranno mostrati automaticamente nel dropdown di selezione orario quando crei una prenotazione per l'evento specifico. Questo rende la compilazione più veloce e riduce gli errori.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <style jsx>{`
          .action-buttons {
            position: fixed;
            bottom: 30px;
            right: 30px;
            display: flex;
            gap: 12px;
            z-index: 1000;
          }
          @media (max-width: 768px) {
            .action-buttons {
              bottom: 90px;
              right: 15px;
              left: 15px;
              justify-content: space-between;
            }
            .action-buttons button {
              padding: 12px 16px !important;
              font-size: 14px !important;
              flex: 1;
            }
          }
        `}</style>
        <div className="action-buttons">
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
