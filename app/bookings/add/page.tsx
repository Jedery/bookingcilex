'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import { useTranslation } from '../../i18n/useTranslation';
import { Calendar, Wallet, User, Ticket, Globe, Info, Clock, Users, CreditCard, Mail, Phone, Check } from 'lucide-react';

// Configurazione default eventi - NON USARE DIRETTAMENTE, caricare sempre da localStorage!
// Questa è solo una configurazione di fallback se localStorage è vuoto
// DEVE MATCHARE ESATTAMENTE quella in settings/booking-config/page.tsx
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

// Fasce orarie predefinite organizzate per momento della giornata
const TIME_SLOTS = [
  {
    period: '☀️ Mattina',
    color: '#f7b731',
    times: ['09:00', '10:00', '11:00', '12:00'],
  },
  {
    period: '🌅 Pomeriggio',
    color: '#ff6b9d',
    times: ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
  },
  {
    period: '🌆 Sunset',
    color: '#c89664',
    times: ['19:00', '20:00', '21:00'],
  },
  {
    period: '🌙 Notte',
    color: '#a29bfe',
    times: ['22:00', '23:00', '00:00', '01:00', '02:00'],
  },
];

export default function AddBooking() {
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [eventsGroups, setEventsGroups] = useState<any[]>([]); // Caricato da localStorage
  
  // Stati aggiuntivi per le nuove funzionalità
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(0);
  const [bookingId, setBookingId] = useState('');
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
  const [isPeopleDropdownOpen, setIsPeopleDropdownOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [createdBy, setCreatedBy] = useState({
    role: 'superadmin',
    name: 'Ignazio Ibiza',
    timestamp: new Date().toISOString(),
  });

  // Helper function per verificare se un campo è completato
  const isStepCompleted = (step: number): boolean => {
    switch(step) {
      case 0: return !!selectedEvent;
      case 1: return !!selectedEvent && !!selectedDate;
      case 2: return !!selectedEvent && !!selectedDate && !!selectedTime;
      case 3: return !!selectedEvent && !!selectedDate && !!selectedTime && numberOfPeople > 0;
      case 4: return !!selectedEvent && !!selectedDate && !!selectedTime && numberOfPeople > 0 && !!selectedPaymentMethod;
      case 5: return !!selectedEvent && !!selectedDate && !!selectedTime && numberOfPeople > 0 && !!selectedPaymentMethod && !!formData.deposit && parseFloat(formData.deposit) > 0;
      case 6: return !!selectedEvent && !!selectedDate && !!selectedTime && numberOfPeople > 0 && !!selectedPaymentMethod && !!formData.deposit && parseFloat(formData.deposit) > 0 && !!formData.firstName;
      case 7: return !!selectedEvent && !!selectedDate && !!selectedTime && numberOfPeople > 0 && !!selectedPaymentMethod && !!formData.deposit && parseFloat(formData.deposit) > 0 && !!formData.firstName && !!formData.lastName;
      case 8: return !!selectedEvent && !!selectedDate && !!selectedTime && numberOfPeople > 0 && !!selectedPaymentMethod && !!formData.deposit && parseFloat(formData.deposit) > 0 && !!formData.firstName && !!formData.lastName && !!formData.email;
      case 9: return !!selectedEvent && !!selectedDate && !!selectedTime && numberOfPeople > 0 && !!selectedPaymentMethod && !!formData.deposit && parseFloat(formData.deposit) > 0 && !!formData.firstName && !!formData.lastName && !!formData.email && !!formData.country;
      case 10: return !!selectedEvent && !!selectedDate && !!selectedTime && numberOfPeople > 0 && !!selectedPaymentMethod && !!formData.deposit && parseFloat(formData.deposit) > 0 && !!formData.firstName && !!formData.lastName && !!formData.email && !!formData.country && !!formData.phone;
      default: return false;
    }
  };

  // Helper function per ottenere il prefisso in base al paese
  const getCountryPrefix = (country: string): string => {
    const prefixes: { [key: string]: string } = {
      'Italy': '+39',
      'Spain': '+34',
      'France': '+33',
      'UK': '+44',
      'Germany': '+49',
      'USA': '+1',
      'Other': '+',
    };
    return prefixes[country] || '';
  };
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    phone: '',
    notes: '',
    adminNotes: '',
    status: 'pending',
    paymentMethod: '',
    price: '',
    discount: 0,
    tax: 0,
    total: 0,
    deposit: '',
    depositPercent: false,
    toPay: 0,
    guestListAccess: '',
    emailLanguage: 'it',
    eventId: '',
    eventName: '',
    eventDate: '',
    eventTime: '',
    salesZone: '', // Nuovo campo Zona Vendita
  });

  const [languageToggles, setLanguageToggles] = useState({
    it: true,
    en: false,
    es: false,
    fr: false,
  });

  useEffect(() => {
    // Carica configurazione eventi da localStorage
    const savedGroups = localStorage.getItem('bookingEventsGroups');
    if (savedGroups) {
      try {
        const parsedGroups = JSON.parse(savedGroups);
        setEventsGroups(parsedGroups);
        console.log('✅ Eventi caricati da configurazione salvata:', parsedGroups);
      } catch (error) {
        console.error('❌ Errore nel parsing eventi salvati:', error);
        // Usa default se parsing fallisce
        setEventsGroups(DEFAULT_EVENTS_GROUPS);
      }
    } else {
      // Se localStorage è vuoto, usa configurazione default
      console.warn('⚠️ localStorage vuoto, uso configurazione default');
      setEventsGroups(DEFAULT_EVENTS_GROUPS);
      // Salva la configurazione default in localStorage
      localStorage.setItem('bookingEventsGroups', JSON.stringify(DEFAULT_EVENTS_GROUPS));
    }
    
    // Genera ID booking automatico
    generateBookingId();
  }, []);

  useEffect(() => {
    // Ricarica eventi quando eventsGroups cambia
    if (eventsGroups && eventsGroups.length > 0) {
      const flatEvents = eventsGroups.flatMap((group) =>
        group.events
          .filter((event: any) => event.active !== false) // Mostra solo eventi attivi
          .map((event: any) => ({ ...event, group: group.group, groupColor: group.color }))
      );
      setEvents(flatEvents);
      console.log('📋 Eventi disponibili per booking:', flatEvents);
    }
  }, [eventsGroups]);

  useEffect(() => {
    // Calcola prezzo automaticamente quando cambia evento, metodo di pagamento o numero di persone
    if (selectedEvent && selectedDate && selectedTime && numberOfPeople > 0) {
      calculateAutomaticPrice();
    }
  }, [selectedEvent, selectedDate, selectedTime, selectedPaymentMethod, numberOfPeople]);

  const generateBookingId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const id = `BK-${timestamp}-${random}`;
    setBookingId(id);
  };

  const calculateAutomaticPrice = () => {
    if (!selectedEvent || numberOfPeople <= 0) return;
    
    let pricePerPerson = selectedEvent.basePrice;
    
    // Applica tassa del 5% solo per carta, POS e bonifico
    if (selectedPaymentMethod === 'card' || selectedPaymentMethod === 'pos' || selectedPaymentMethod === 'transfer') {
      const tax = pricePerPerson * 0.05;
      pricePerPerson = pricePerPerson + tax;
    }
    
    // Moltiplica per il numero di persone
    const totalPrice = pricePerPerson * numberOfPeople;
    
    setFormData(prev => ({
      ...prev,
      price: totalPrice.toFixed(2),
      total: totalPrice.toFixed(2),
      toPay: totalPrice.toFixed(2),
    }));
  };

  const handleEventChange = (eventId: string) => {
    const event = events.find(e => e.id.toString() === eventId);
    setSelectedEvent(event);
    setIsEventDropdownOpen(false);
    setFormData(prev => ({
      ...prev,
      eventId: eventId,
      eventName: event?.name || '',
    }));
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, eventDate: date }));
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    setFormData(prev => ({ ...prev, eventTime: time }));
  };

  const capitalizeFirstLetter = (text: string) => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const handleDepositChange = (deposit: string) => {
    const depositValue = parseFloat(deposit) || 0;
    const totalValue = parseFloat(formData.total) || 0;
    const toPay = totalValue - depositValue;
    
    // Calcola automaticamente lo stato in base al pagamento
    let newStatus = 'pending';
    if (depositValue >= totalValue && totalValue > 0) {
      newStatus = 'confirmed'; // Cliente ha pagato tutto
    } else if (depositValue > 0) {
      newStatus = 'pending'; // Cliente ha lasciato un deposito
    }
    
    setFormData(prev => ({
      ...prev,
      deposit: deposit,
      toPay: toPay.toFixed(2),
      status: newStatus,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingData = {
        bookingId: bookingId,
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`,
        soldBy: createdBy.role,
        soldByName: createdBy.name,
        createdAt: createdBy.timestamp,
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        alert('✅ Prenotazione creata con successo!');
        router.push('/bookings/list');
      } else {
        alert('Errore nella creazione della prenotazione');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Si è verificato un errore');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar t={t} />
      <div className="main-content">
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700' }}>Aggiungi Prenotazione</h1>
        </div>

        {/* Progress Indicator */}
        <div 
          className="hide-on-mobile"
          style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(15, 15, 18, 0.9) 100%)',
          border: '1px solid rgba(200, 150, 100, 0.3)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          backdropFilter: 'blur(30px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#c89664' }}>Progresso:</span>
            {[
              { step: 1, label: '1. Evento', icon: <Ticket size={14} /> },
              { step: 2, label: '2. Data', icon: <Calendar size={14} /> },
              { step: 3, label: '3. Orario', icon: <Clock size={14} /> },
              { step: 4, label: '4. N. Persone', icon: <Users size={14} /> },
              { step: 5, label: '5. Pagamento', icon: <CreditCard size={14} /> },
              { step: 6, label: '6. Acconto', icon: <Wallet size={14} /> },
              { step: 7, label: '7. Nome', icon: <User size={14} /> },
              { step: 8, label: '8. Cognome', icon: <User size={14} /> },
              { step: 9, label: '9. Email', icon: <Mail size={14} /> },
              { step: 10, label: '10. Paese', icon: <Globe size={14} /> },
              { step: 11, label: '11. Telefono', icon: <Phone size={14} /> },
            ].map((item) => (
              <div
                key={item.step}
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  background: isStepCompleted(item.step) ? 'linear-gradient(135deg, rgba(200, 150, 100, 0.25), rgba(200, 150, 100, 0.15))' : 'rgba(100, 100, 100, 0.1)',
                  color: isStepCompleted(item.step) ? '#c89664' : '#666',
                  border: `2px solid ${isStepCompleted(item.step) ? 'rgba(200, 150, 100, 0.5)' : 'rgba(100, 100, 100, 0.2)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isStepCompleted(item.step) ? '0 4px 12px rgba(200, 150, 100, 0.2)' : 'none',
                }}
              >
                {item.icon}
                <span>{item.label}</span>
                {isStepCompleted(item.step) && <Check size={16} color="#48c774" />}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* ========== COLONNA 1: EVENTO E DATA ========== */}
            <div className="card" style={{ 
              background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.95) 0%, rgba(15, 15, 18, 0.98) 100%)',
              border: '2px solid rgba(200, 150, 100, 0.25)',
              borderRadius: '20px',
              padding: '32px',
              backdropFilter: 'blur(30px)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '24px', 
                color: '#c89664',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <Calendar size={20} color="#c89664" />
                Dettagli Evento
              </h3>

              {/* Scegli Evento - Custom Dropdown */}
              <div className="filter-group">
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
                  Scegli Evento *
                </label>
                
                {/* Selected Event Display / Trigger */}
                <div
                  onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: selectedEvent ? '#0f1419' : '#1a1a1e',
                    border: selectedEvent ? '2px solid #c89664' : '1.5px solid #2a3a52',
                    borderRadius: '12px',
                    color: selectedEvent ? '#fff' : '#888',
                    fontSize: '15px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span>
                    {selectedEvent ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Ticket size={18} color="#c89664" />
                        <span style={{ fontWeight: '600' }}>{selectedEvent.name}</span>
                        <span style={{ 
                          color: '#c89664',
                          fontWeight: '700'
                        }}>
                          €{selectedEvent.basePrice}
                        </span>
                      </span>
                    ) : (
                      '-- Seleziona Evento --'
                    )}
                  </span>
                  <span style={{ transform: isEventDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                    ▼
                  </span>
                </div>

                {/* Dropdown Menu */}
                {isEventDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    zIndex: 1000,
                    width: 'calc(100% - 48px)',
                    maxHeight: '500px',
                    overflowY: 'auto',
                    marginTop: '8px',
                    backgroundColor: '#1a1a1e',
                    border: '2px solid #2a3a52',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  }}>
                    {eventsGroups.map((group, groupIndex) => (
                      <div key={group.group}>
                        {/* Group Header */}
                        <div style={{
                          padding: '16px 20px',
                          background: `linear-gradient(135deg, ${group.bgColor} 0%, rgba(0,0,0,0.2) 100%)`,
                          borderBottom: `2px solid ${group.color}`,
                          position: 'sticky',
                          top: 0,
                          zIndex: 10,
                        }}>
                          <span style={{
                            fontSize: '15px',
                            fontWeight: '700',
                            color: group.color,
                            textTransform: 'uppercase',
                            letterSpacing: '1.5px',
                          }}>
                            {group.group}
                          </span>
                        </div>

                        {/* Group Events */}
                        {group.events.map((event) => (
                          <div
                            key={event.id}
                            onClick={() => handleEventChange(event.id.toString())}
                            style={{
                              padding: '14px 20px',
                              cursor: 'pointer',
                              backgroundColor: formData.eventId === event.id.toString() ? group.bgColor : 'transparent',
                              borderLeft: formData.eventId === event.id.toString() ? `4px solid ${group.color}` : '4px solid transparent',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                            onMouseEnter={(e) => {
                              if (formData.eventId !== event.id.toString()) {
                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                e.currentTarget.style.borderLeftColor = group.color;
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (formData.eventId !== event.id.toString()) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.borderLeftColor = 'transparent';
                              }
                            }}
                          >
                            <span style={{
                              fontSize: '14px',
                              color: '#fff',
                              fontWeight: formData.eventId === event.id.toString() ? '600' : '400',
                            }}>
                              {event.name}
                            </span>
                            <span style={{
                              fontSize: '16px',
                              color: group.color,
                              fontWeight: '700',
                            }}>
                              €{event.basePrice}
                            </span>
                          </div>
                        ))}

                        {/* Separator */}
                        {groupIndex < eventsGroups.length - 1 && (
                          <div style={{
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent 0%, #2a3a52 50%, transparent 100%)',
                            margin: '8px 0',
                          }} />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Hidden input for form validation */}
                <input 
                  type="hidden" 
                  value={formData.eventId} 
                  required 
                />
              </div>

              {/* Descrizione Evento Selezionato */}
              {selectedEvent && (
                <div style={{
                  marginTop: '16px',
                  padding: '18px',
                  background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.95) 0%, rgba(15, 15, 18, 0.95) 100%)',
                  border: '1px solid rgba(200, 150, 100, 0.3)',
                  borderRadius: '12px',
                }}>
                  <p style={{ 
                    fontSize: '12px', 
                    fontWeight: '700', 
                    color: '#c89664',
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                  }}>
                    📋 Descrizione
                  </p>
                  <p style={{ 
                    fontSize: '13px', 
                    color: '#ddd', 
                    lineHeight: '1.7', 
                    margin: 0,
                  }}>
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              {/* Data */}
              <div className="filter-group" style={{ marginTop: '20px', position: 'relative' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: isStepCompleted(1) ? '#888' : '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Data *
                  {isStepCompleted(0) && !isStepCompleted(1) && <span style={{fontSize: '11px', color: '#c89664', fontWeight: '700'}}>→ Compila ora</span>}
                </label>
                <input 
                  type="date" 
                  disabled={!isStepCompleted(0)}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: isStepCompleted(0) ? '#1a1a1e' : '#0f0f12', 
                    border: isStepCompleted(0) && !isStepCompleted(1) ? '2px solid #c89664' : '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: isStepCompleted(0) ? '#fff' : '#555',
                    fontSize: '15px',
                    cursor: isStepCompleted(0) ? 'text' : 'not-allowed',
                    opacity: isStepCompleted(0) ? 1 : 0.5,
                    boxShadow: isStepCompleted(0) && !isStepCompleted(1) ? '0 0 20px rgba(200, 150, 100, 0.4)' : 'none',
                    animation: isStepCompleted(0) && !isStepCompleted(1) ? 'pulse 2s infinite' : 'none',
                  }}
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  required
                />
              </div>

              {/* Orario - Selezione */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: isStepCompleted(2) ? '#888' : '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Orario *
                  {isStepCompleted(1) && !isStepCompleted(2) && <span style={{fontSize: '11px', color: '#c89664', fontWeight: '700'}}>→ Compila ora</span>}
                </label>
                {selectedEvent && isStepCompleted(1) ? (
                  <select
                    disabled={!isStepCompleted(1)}
                    style={{ 
                      width: '100%', 
                      padding: '14px', 
                      backgroundColor: isStepCompleted(1) ? '#1a1a1e' : '#0f0f12', 
                      border: isStepCompleted(1) && !isStepCompleted(2) ? '2px solid #c89664' : '1.5px solid #2a3a52',
                      borderRadius: '10px', 
                      color: isStepCompleted(1) ? '#fff' : '#555',
                      fontSize: '15px',
                      cursor: isStepCompleted(1) ? 'pointer' : 'not-allowed',
                      opacity: isStepCompleted(1) ? 1 : 0.5,
                      boxShadow: isStepCompleted(1) && !isStepCompleted(2) ? '0 0 20px rgba(200, 150, 100, 0.4)' : 'none',
                      animation: isStepCompleted(1) && !isStepCompleted(2) ? 'pulse 2s infinite' : 'none',
                    }}
                    value={selectedTime}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    required
                  >
                    <option value="">-- Seleziona Orario --</option>
                    {selectedEvent.availableTimes?.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: '#0f0f12',
                    border: '1.5px solid #2a3a52',
                    borderRadius: '10px',
                    color: '#666',
                    fontSize: '14px',
                    fontStyle: 'italic',
                  }}>
                    ⏳ Seleziona prima un evento per vedere gli orari disponibili
                  </div>
                )}
              </div>

              {/* Numero Persone */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: isStepCompleted(3) ? '#888' : '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={16} color={isStepCompleted(3) ? '#888' : '#555'} />
                  Numero Persone *
                  {isStepCompleted(2) && !isStepCompleted(3) && <span style={{fontSize: '11px', color: '#c89664', fontWeight: '700'}}>→ Compila ora</span>}
                </label>
                
                {/* Trigger per aprire/chiudere la griglia */}
                <div
                  onClick={() => isStepCompleted(2) && setIsPeopleDropdownOpen(!isPeopleDropdownOpen)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: numberOfPeople > 0 ? '#0f1419' : '#1a1a1e',
                    border: isStepCompleted(2) && !isStepCompleted(3) ? '2px solid #c89664' : numberOfPeople > 0 ? '2px solid #c89664' : '1.5px solid #2a3a52',
                    borderRadius: '12px',
                    color: numberOfPeople > 0 ? '#fff' : '#888',
                    fontSize: '15px',
                    cursor: isStepCompleted(2) ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                    opacity: isStepCompleted(2) ? 1 : 0.5,
                    boxShadow: isStepCompleted(2) && !isStepCompleted(3) ? '0 0 20px rgba(200, 150, 100, 0.4)' : 'none',
                    animation: isStepCompleted(2) && !isStepCompleted(3) ? 'pulse 2s infinite' : 'none',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Users size={18} color={numberOfPeople > 0 ? '#c89664' : '#888'} />
                    {numberOfPeople > 0 ? (
                      <span style={{ fontWeight: '600' }}>
                        {numberOfPeople} {numberOfPeople === 1 ? 'Persona' : 'Persone'}
                      </span>
                    ) : (
                      '-- Seleziona Numero Persone --'
                    )}
                  </span>
                  <span style={{ transform: isPeopleDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                    ▼
                  </span>
                </div>

                {/* Griglia numeri a scomparsa */}
                {isPeopleDropdownOpen && (
                  <div style={{
                    marginTop: '12px',
                    padding: '16px',
                    background: 'rgba(26, 26, 30, 0.8)',
                    border: '1.5px solid #2a3a52',
                    borderRadius: '12px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(55px, 1fr))',
                      gap: '8px',
                    }}>
                      {[...Array(50)].map((_, i) => {
                        const number = i + 1;
                        const isSelected = numberOfPeople === number;
                        return (
                          <button
                            key={number}
                            type="button"
                            onClick={() => {
                              setNumberOfPeople(number);
                              setIsPeopleDropdownOpen(false);
                            }}
                            style={{
                              padding: '12px 8px',
                              background: isSelected ? 'linear-gradient(135deg, rgba(200, 150, 100, 0.2), rgba(200, 150, 100, 0.1))' : 'rgba(15, 15, 18, 0.8)',
                              border: isSelected ? '2px solid #c89664' : '1.5px solid #2a3a52',
                              borderRadius: '8px',
                              color: isSelected ? '#c89664' : '#fff',
                              fontSize: '14px',
                              fontWeight: isSelected ? '700' : '500',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              boxShadow: isSelected ? '0 0 12px rgba(200, 150, 100, 0.3)' : 'none',
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.borderColor = '#c89664';
                                e.currentTarget.style.transform = 'scale(1.05)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.borderColor = '#2a3a52';
                                e.currentTarget.style.transform = 'scale(1)';
                              }
                            }}
                          >
                            {number}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedEvent && numberOfPeople > 0 && (
                  <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: 'rgba(200, 150, 100, 0.1)',
                    border: '1px solid rgba(200, 150, 100, 0.3)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#c89664',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <Info size={16} color="#c89664" />
                    <span><strong>Prezzo per persona:</strong> €{selectedEvent.basePrice} × {numberOfPeople} = <strong>€{(selectedEvent.basePrice * numberOfPeople).toFixed(2)}</strong></span>
                  </div>
                )}
              </div>

              {/* ID Prenotazione */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
                  ID Prenotazione
                </label>
                <input 
                  type="text" 
                  value={bookingId}
                  disabled 
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#0f1419', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                    fontSize: '15px',
                    fontWeight: '600',
                  }} 
                />
              </div>

              {/* Stato (Automatico) */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
                  Stato *
                </label>
                <div style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#0f1419',
                  border: '1.5px solid #2a3a52',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {formData.status === 'confirmed' ? '✅ Confermato' : '⏳ In Sospeso'}
                </div>
                <p style={{ fontSize: '11px', color: '#666', marginTop: '8px', fontStyle: 'italic' }}>
                  Lo stato si aggiorna automaticamente in base al pagamento
                </p>
              </div>

              {/* Metodo Pagamento */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: isStepCompleted(4) ? '#888' : '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Metodo di Pagamento *
                  {isStepCompleted(3) && !isStepCompleted(4) && <span style={{fontSize: '11px', color: '#c89664', fontWeight: '700'}}>→ Compila ora</span>}
                </label>
                <select 
                  disabled={!isStepCompleted(3)}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: isStepCompleted(3) ? '#1a1a1e' : '#0f0f12', 
                    border: isStepCompleted(3) && !isStepCompleted(4) ? '2px solid #c89664' : '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: isStepCompleted(3) ? '#fff' : '#555',
                    fontSize: '15px',
                    cursor: isStepCompleted(3) ? 'pointer' : 'not-allowed',
                    opacity: isStepCompleted(3) ? 1 : 0.5,
                    boxShadow: isStepCompleted(3) && !isStepCompleted(4) ? '0 0 20px rgba(200, 150, 100, 0.4)' : 'none',
                    animation: isStepCompleted(3) && !isStepCompleted(4) ? 'pulse 2s infinite' : 'none',
                  }}
                  value={formData.paymentMethod}
                  onChange={(e) => {
                    const method = e.target.value;
                    setFormData({ ...formData, paymentMethod: method });
                    setSelectedPaymentMethod(method);
                  }}
                  required
                >
                  <option value="">-- Seleziona Metodo --</option>
                  <option value="cash">Contanti</option>
                  <option value="card">Carta</option>
                  <option value="pos">POS</option>
                  <option value="transfer">Bonifico</option>
                </select>
              </div>
            </div>

            {/* ========== COLONNA 2: PREZZI E PAGAMENTI ========== */}
            <div className="card" style={{ 
              background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.95) 0%, rgba(15, 15, 18, 0.95) 100%)',
              border: '1px solid rgba(200, 150, 100, 0.3)',
              borderRadius: '12px',
              padding: '24px',
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '24px', 
                color: '#c89664',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <CreditCard size={20} color="#c89664" />
                Dettagli Pagamento
              </h3>

              {/* Totale */}
              <div className="filter-group">
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
                  Totale €
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  disabled
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#0f1419', 
                    border: '2px solid #10b981', 
                    borderRadius: '10px', 
                    color: '#10b981',
                    fontSize: '24px',
                    fontWeight: '700',
                  }}
                  value={formData.total}
                />
              </div>

              {/* Acconto */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: isStepCompleted(4) ? '#888' : '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Acconto Pagato € *
                  {isStepCompleted(4) && !isStepCompleted(5) && <span style={{fontSize: '11px', color: '#c89664', fontWeight: '700'}}>→ Compila ora</span>}
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0.01"
                  disabled={!isStepCompleted(4)}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: isStepCompleted(4) ? '#1a1a1e' : '#0f0f12', 
                    border: isStepCompleted(4) && !isStepCompleted(5) ? '2px solid #c89664' : '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: isStepCompleted(4) ? '#fff' : '#555',
                    fontSize: '15px',
                    cursor: isStepCompleted(4) ? 'text' : 'not-allowed',
                    opacity: isStepCompleted(4) ? 1 : 0.5,
                    boxShadow: isStepCompleted(4) && !isStepCompleted(5) ? '0 0 20px rgba(200, 150, 100, 0.4)' : 'none',
                    animation: isStepCompleted(4) && !isStepCompleted(5) ? 'pulse 2s infinite' : 'none',
                  }}
                  value={formData.deposit}
                  onChange={(e) => handleDepositChange(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Da Saldare */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
                  Da Saldare €
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  disabled
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: '#0f1419', 
                    border: '2px solid #ef4444', 
                    borderRadius: '10px', 
                    color: '#ef4444',
                    fontSize: '20px',
                    fontWeight: '700',
                  }}
                  value={formData.toPay}
                />
              </div>

              {/* Info Box */}
              <div style={{
                marginTop: '20px',
                padding: '18px',
                background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.95) 0%, rgba(15, 15, 18, 0.95) 100%)',
                border: '1px solid rgba(200, 150, 100, 0.3)',
                borderRadius: '12px',
              }}>
                <p style={{ 
                  fontSize: '12px', 
                  fontWeight: '700', 
                  color: '#c89664',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <Info size={16} color="#c89664" />
                  Informazioni Prezzo
                </p>
                <p style={{ 
                  fontSize: '13px', 
                  color: '#ddd', 
                  lineHeight: '1.7', 
                  margin: 0,
                }}>
                  Il prezzo è determinato dall'evento selezionato<br/>
                  • Metodo pagamento Carta/POS/Bonifico: +5% di tassa
                </p>
              </div>
            </div>

            {/* ========== COLONNA 3: DATI CLIENTE ========== */}
            <div className="card" style={{ 
              background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.95) 0%, rgba(15, 15, 18, 0.95) 100%)',
              border: '1px solid rgba(200, 150, 100, 0.3)',
              borderRadius: '12px',
              padding: '24px',
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '24px', 
                color: '#c89664',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <User size={20} color="#c89664" />
                Dati Cliente
              </h3>

              {/* Nome */}
              <div className="filter-group">
                <label style={{ fontSize: '13px', fontWeight: '600', color: isStepCompleted(5) ? '#888' : '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Nome *
                  {isStepCompleted(4) && !isStepCompleted(5) && <span style={{fontSize: '11px', color: '#c89664', fontWeight: '700'}}>→ Compila ora</span>}
                </label>
                <input 
                  type="text" 
                  disabled={!isStepCompleted(5)}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: isStepCompleted(5) ? '#1a1a1e' : '#0f0f12', 
                    border: isStepCompleted(5) && !isStepCompleted(6) ? '2px solid #c89664' : '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: isStepCompleted(5) ? '#fff' : '#555',
                    fontSize: '15px',
                    cursor: isStepCompleted(5) ? 'text' : 'not-allowed',
                    opacity: isStepCompleted(5) ? 1 : 0.5,
                    boxShadow: isStepCompleted(5) && !isStepCompleted(6) ? '0 0 20px rgba(200, 150, 100, 0.4)' : 'none',
                    animation: isStepCompleted(5) && !isStepCompleted(6) ? 'pulse 2s infinite' : 'none',
                  }}
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: capitalizeFirstLetter(e.target.value) })}
                  required
                  placeholder="Mario"
                />
              </div>

              {/* Cognome */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: isStepCompleted(6) ? '#888' : '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Cognome *
                  {isStepCompleted(6) && !isStepCompleted(7) && <span style={{fontSize: '11px', color: '#c89664', fontWeight: '700'}}>→ Compila ora</span>}
                </label>
                <input 
                  type="text" 
                  disabled={!isStepCompleted(6)}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: isStepCompleted(6) ? '#1a1a1e' : '#0f0f12', 
                    border: isStepCompleted(6) && !isStepCompleted(7) ? '2px solid #c89664' : '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: isStepCompleted(6) ? '#fff' : '#555',
                    fontSize: '15px',
                    cursor: isStepCompleted(6) ? 'text' : 'not-allowed',
                    opacity: isStepCompleted(6) ? 1 : 0.5,
                    boxShadow: isStepCompleted(6) && !isStepCompleted(7) ? '0 0 20px rgba(200, 150, 100, 0.4)' : 'none',
                    animation: isStepCompleted(6) && !isStepCompleted(7) ? 'pulse 2s infinite' : 'none',
                  }}
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: capitalizeFirstLetter(e.target.value) })}
                  required
                  placeholder="Rossi"
                />
              </div>

              {/* Email */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: isStepCompleted(7) ? '#888' : '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Email *
                  {isStepCompleted(7) && !isStepCompleted(8) && <span style={{fontSize: '11px', color: '#c89664', fontWeight: '700'}}>→ Compila ora</span>}
                </label>
                <input 
                  type="email" 
                  disabled={!isStepCompleted(7)}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: isStepCompleted(7) ? '#1a1a1e' : '#0f0f12', 
                    border: isStepCompleted(7) && !isStepCompleted(8) ? '2px solid #c89664' : '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: isStepCompleted(7) ? '#fff' : '#555',
                    fontSize: '15px',
                    cursor: isStepCompleted(7) ? 'text' : 'not-allowed',
                    opacity: isStepCompleted(7) ? 1 : 0.5,
                    boxShadow: isStepCompleted(7) && !isStepCompleted(8) ? '0 0 20px rgba(200, 150, 100, 0.4)' : 'none',
                    animation: isStepCompleted(7) && !isStepCompleted(8) ? 'pulse 2s infinite' : 'none',
                  }}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })}
                  required
                  placeholder="mario.rossi@email.com"
                />
              </div>

              {/* Paese */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: isStepCompleted(8) ? '#888' : '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Paese *
                  {isStepCompleted(8) && !isStepCompleted(9) && <span style={{fontSize: '11px', color: '#c89664', fontWeight: '700'}}>→ Compila ora</span>}
                </label>
                <select 
                  disabled={!isStepCompleted(8)}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: isStepCompleted(8) ? '#1a1a1e' : '#0f0f12', 
                    border: isStepCompleted(8) && !isStepCompleted(9) ? '2px solid #c89664' : '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: isStepCompleted(8) ? '#fff' : '#555',
                    fontSize: '15px',
                    cursor: isStepCompleted(8) ? 'pointer' : 'not-allowed',
                    opacity: isStepCompleted(8) ? 1 : 0.5,
                    boxShadow: isStepCompleted(8) && !isStepCompleted(9) ? '0 0 20px rgba(200, 150, 100, 0.4)' : 'none',
                    animation: isStepCompleted(8) && !isStepCompleted(9) ? 'pulse 2s infinite' : 'none',
                  }}
                  value={formData.country}
                  onChange={(e) => {
                    const selectedCountry = e.target.value;
                    const prefix = getCountryPrefix(selectedCountry);
                    setFormData({ 
                      ...formData, 
                      country: selectedCountry,
                      phone: prefix + ' ' // Imposta il prefisso automaticamente
                    });
                  }}
                  required
                >
                  <option value="">-- Seleziona Paese --</option>
                  <option value="Italy">Italia</option>
                  <option value="Spain">Spagna</option>
                  <option value="France">Francia</option>
                  <option value="UK">Regno Unito</option>
                  <option value="Germany">Germania</option>
                  <option value="USA">Stati Uniti</option>
                  <option value="Other">Altro</option>
                </select>
              </div>

              {/* Telefono */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: isStepCompleted(9) ? '#888' : '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Telefono *
                  {isStepCompleted(9) && !isStepCompleted(10) && <span style={{fontSize: '11px', color: '#c89664', fontWeight: '700'}}>→ Compila ora</span>}
                </label>
                <input 
                  type="tel" 
                  disabled={!isStepCompleted(9)}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: isStepCompleted(9) ? '#1a1a1e' : '#0f0f12', 
                    border: isStepCompleted(9) && !isStepCompleted(10) ? '2px solid #c89664' : '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: isStepCompleted(9) ? '#fff' : '#555',
                    fontSize: '15px',
                    cursor: isStepCompleted(9) ? 'text' : 'not-allowed',
                    opacity: isStepCompleted(9) ? 1 : 0.5,
                    boxShadow: isStepCompleted(9) && !isStepCompleted(10) ? '0 0 20px rgba(200, 150, 100, 0.4)' : 'none',
                    animation: isStepCompleted(9) && !isStepCompleted(10) ? 'pulse 2s infinite' : 'none',
                  }}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  placeholder={formData.country ? `${getCountryPrefix(formData.country)} 123 456 7890` : "+39 123 456 7890"}
                />
              </div>

              {/* Note Cliente */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
                  Note Cliente
                </label>
                <textarea 
                  style={{ 
                    width: '100%', 
                    minHeight: '80px', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #2a3a52', 
                    borderRadius: '10px', 
                    color: '#fff',
                    fontSize: '16px',
                    resize: 'vertical',
                  }}
                  placeholder="Scrivi qui le note del cliente, ad esempio: Cliente vegano..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              {/* Note Admin */}
              <div className="filter-group" style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
                  Note Admin
                </label>
                <textarea 
                  style={{ 
                    width: '100%', 
                    minHeight: '80px', 
                    padding: '14px', 
                    backgroundColor: '#1a1a1e', 
                    border: '1.5px solid #c89664', 
                    borderRadius: '10px', 
                    color: '#fff',
                    fontSize: '16px',
                    resize: 'vertical',
                  }}
                  placeholder="Scrivi qui note per l'amministratore..."
                  value={formData.adminNotes}
                  onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* ========== SEZIONE AGGIUNTIVA: ZONA VENDITA, GUEST LIST E LINGUA ========== */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginTop: '24px' }}>

            {/* Zona Vendita */}
            <div
              className="card"
              style={{
                background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.95) 0%, rgba(15, 15, 18, 0.95) 100%)',
                border: '1px solid rgba(200, 150, 100, 0.3)',
                borderRadius: '12px',
                padding: '24px',
              }}
            >
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '24px',
                color: '#c89664',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <Globe size={20} color="#c89664" />
                Zona Vendita
              </h3>
              <select
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#1a1a1e',
                  border: '1.5px solid #2a3a52',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '15px',
                  boxShadow: 'none',
                  animation: 'none',
                }}
                value={formData.salesZone}
                onChange={(e) => setFormData({ ...formData, salesZone: e.target.value })}
                required
              >
                <option value="">-- Seleziona Zona Vendita --</option>
                <option value="Online">Online</option>
                <option value="Ibiza Centro">Ibiza Centro</option>
                <option value="Hotel">Hotel</option>
                <option value="Social">Social</option>
                <option value="Aeroporto">Aeroporto</option>
                <option value="Spiaggia">Spiaggia</option>
                <option value="Altro">Altro</option>
              </select>
            </div>

            {/* Guest List */}
            <div className="card" style={{
              background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.95) 0%, rgba(15, 15, 18, 0.95) 100%)',
              border: '1px solid rgba(200, 150, 100, 0.3)',
              borderRadius: '12px',
              padding: '24px',
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '24px',
                color: '#c89664',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <Ticket size={20} color="#c89664" />
                Accesso Liste Eventi
              </h3>
              <select
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#1a1a1e',
                  border: isStepCompleted(10) ? '2px solid #c89664' : '1.5px solid #2a3a52',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '15px',
                  boxShadow: isStepCompleted(10) ? '0 0 20px rgba(200, 150, 100, 0.4)' : 'none',
                  animation: isStepCompleted(10) ? 'pulse 2s infinite' : 'none',
                }}
                value={formData.guestListAccess}
                onChange={(e) => setFormData({ ...formData, guestListAccess: e.target.value })}
              >
                <option value="">-- Seleziona Accesso --</option>
                <option value="vip">VIP List</option>
                <option value="standard">Standard List</option>
                <option value="guest">Guest +1</option>
                <option value="none">Nessun Accesso</option>
              </select>
            </div>

            {/* Lingua Email */}
            <div className="card" style={{ 
              background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.95) 0%, rgba(15, 15, 18, 0.95) 100%)',
              border: '1px solid rgba(200, 150, 100, 0.3)',
              borderRadius: '12px',
              padding: '24px',
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '24px', 
                color: '#c89664',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <Globe size={20} color="#c89664" />
                Seleziona Lingua per Inviare Email / SMS
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {Object.entries(languageToggles).map(([lang, active]) => {
                  const flagEmojis = { it: '🇮🇹', en: '🇬🇧', es: '🇪🇸', fr: '🇫🇷' };
                  const langNames = { it: 'Italiano', en: 'English', es: 'Español', fr: 'Français' };
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setLanguageToggles({ it: false, en: false, es: false, fr: false, [lang]: true });
                        setFormData({ ...formData, emailLanguage: lang });
                      }}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: active ? '2px solid #c89664' : '1.5px solid #2a3a52',
                        background: active ? 'linear-gradient(135deg, rgba(200, 150, 100, 0.15) 0%, rgba(200, 150, 100, 0.05) 100%)' : 'rgba(26, 26, 30, 0.8)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontWeight: active ? '600' : '500',
                        fontSize: '15px',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>{flagEmojis[lang]}</span>
                      <span>{langNames[lang]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chi ha creato */}
            <div className="card" style={{ 
              background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.95) 0%, rgba(15, 15, 18, 0.95) 100%)',
              border: '2px solid rgba(200, 150, 100, 0.2)',
              borderRadius: '16px',
              padding: '24px',
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '24px', 
                color: '#c89664',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <User size={20} color="#c89664" />
                Creato Da
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '4px' }}>Ruolo</label>
                  <input 
                    type="text" 
                    disabled 
                    value={createdBy.role.toUpperCase()}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      backgroundColor: '#0f1419', 
                      border: '1px solid #c89664', 
                      borderRadius: '8px', 
                      color: '#c89664',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '4px' }}>Nome</label>
                  <input 
                    type="text" 
                    disabled 
                    value={createdBy.name}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      backgroundColor: '#0f1419', 
                      border: '1px solid #2a3a52', 
                      borderRadius: '8px', 
                      color: '#fff',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '4px' }}>Data e Ora</label>
                  <input 
                    type="text" 
                    disabled 
                    value={new Date(createdBy.timestamp).toLocaleString('it-IT')}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      backgroundColor: '#0f1419', 
                      border: '1px solid #2a3a52', 
                      borderRadius: '8px', 
                      color: '#888',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ========== PULSANTE SALVA ========== */}
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '32px', 
              width: '100%', 
              padding: '20px',
              fontSize: '18px',
              fontWeight: '700',
              background: loading 
                ? 'linear-gradient(135deg, #555 0%, #333 100%)'
                : 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
              color: '#0f1419',
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.3s ease',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(78, 205, 196, 0.3)',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(78, 205, 196, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(78, 205, 196, 0.3)';
              }
            }}
          >
            {loading ? '⏳ Salvataggio in corso...' : '✅ Salva Prenotazione'}
          </button>
        </form>
      </div>
    </div>
  );
}
