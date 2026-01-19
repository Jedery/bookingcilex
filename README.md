# 🌴 BookingCilex - Luxury Booking Management System

## 📋 Panoramica

**BookingCilex** è un sistema avanzato di gestione prenotazioni sviluppato specificamente per il mercato luxury di Ibiza. L'applicazione offre una piattaforma completa per gestire eventi esclusivi, prenotazioni clienti, team di vendita, sistema wallet interno e gestione alloggi per il personale.

### 🎯 Obiettivi del Progetto

- **Gestione Centralizzata**: Un'unica piattaforma per gestire tutte le prenotazioni, eventi e operazioni finanziarie
- **Tracking Vendite**: Monitoraggio dettagliato delle performance del team di vendita (Promoter, Manager, Founder)
- **Sistema Wallet Integrato**: Gestione commissioni, affitti, bonus e pagamenti per il personale
- **Multilingua**: Supporto completo per italiano, inglese, spagnolo e francese
- **Analytics Avanzate**: Dashboard con KPI in tempo reale e statistiche dettagliate
- **Mobile-First**: Interfaccia completamente ottimizzata per dispositivi mobili

---

## 🏗️ Architettura Tecnica

### Stack Tecnologico Principale

#### **Frontend Framework**
- **Next.js 15.0.0** (App Router)
  - Framework React full-stack con rendering server-side (SSR) e static site generation (SSG)
  - **App Router**: Nuova architettura di routing basata su file system con React Server Components
  - **Route Handlers**: API routes native per backend serverless
  - **Streaming SSR**: Rendering progressivo per migliorare le performance percepite
  - **Metadata API**: Gestione SEO ottimizzata automaticamente
  - **Configurazione**: `next.config.js` per ottimizzazioni e configurazioni personalizzate

#### **UI Library**
- **React 19.0.0**
  - Libreria UI dichiarativa con component-based architecture
  - **Hooks utilizzati**:
    - `useState`: Gestione stato locale dei componenti
    - `useEffect`: Side effects e data fetching
    - `useContext`: Context API per state management globale (Auth, i18n)
    - `useRouter`: Navigation programmatica (Next.js)
    - `useSearchParams`: Gestione query parameters per filtri
  - **Client Components**: Componenti interattivi con direttiva `"use client"`
  - **Server Components**: Rendering ottimizzato lato server (default)

#### **Type Safety**
- **TypeScript**
  - Tipizzazione statica per tutto il codebase
  - **Interfaces definite**:
    - `User`: Modello utente con ruoli e wallet
    - `Booking`: Struttura prenotazione completa
    - `Transaction`: Transazioni finanziarie
    - `Event`: Eventi e liste
  - `tsconfig.json`: Configurazione strict mode per massima type safety
  - `next-env.d.ts`: Type definitions per Next.js

#### **Database & ORM**
- **Prisma 5.22.0**
  - ORM type-safe per database management
  - **Prisma Client**: Query builder auto-generato con autocompletamento
  - **Prisma Migrate**: Sistema di migrazione database versionato
  - **Schema Prisma**: Schema dichiarativo per modelli dati (SQLite)
  - **Features utilizzate**:
    - Relations: One-to-many (User ↔ Transactions, Event ↔ Bookings)
    - Indexes: Ottimizzazione query su userId, createdAt, type
    - Cascade Delete: Pulizia automatica dati correlati
    - UUID: ID univoci per tutte le entità
  - **Database**: SQLite per sviluppo (facile migration a PostgreSQL per produzione)

#### **Styling**
- **CSS Modules + Styled JSX**
  - `globals.css`: Stili globali e variabili CSS custom
  - **Styled JSX**: CSS scoped per componenti con interpolazione dinamica
  - **Responsive Design**: Media queries per mobile/desktop
    - Breakpoint: `@media (max-width: 768px)`
    - Grid layouts dinamici: `grid-template-columns: repeat(auto-fit, minmax(...))`
    - Flexbox per allineamenti complessi
  - **Design System**:
    - Palette colori: Gold (#c89664) per accenti premium
    - Glassmorphism: `backdrop-filter: blur(10px)` per effetti moderni
    - Dark theme: Background scuri con trasparenze `rgba(20, 20, 20, 0.6)`
    - Typography moderna: `system-ui`, font-weight: 700, letter-spacing negativo

#### **Icons & Graphics**
- **Lucide React 0.562.0**
  - Libreria icone moderna e leggera (fork di Feather Icons)
  - **Icone utilizzate**:
    - `CheckCircle`, `XCircle`: Stati prenotazione
    - `Edit2`, `Trash2`: Azioni CRUD
    - `Search`: Filtri ricerca
    - `BarChart3`, `TrendingUp`: Analytics
    - `Users`, `Calendar`, `DollarSign`: KPI cards
  - Tree-shakeable: Solo le icone importate vengono incluse nel bundle
  - Personalizzabili: size, color, strokeWidth via props

#### **Charts & Visualizations**
- **Recharts 3.6.0**
  - Libreria grafici React componibile e responsive
  - **Chart types implementati**:
    - `LineChart`: Trend revenue nel tempo
    - `BarChart`: Comparazione performance team
    - `AreaChart`: Visualizzazione cumulativa
    - `PieChart`: Distribuzione metodi pagamento
  - **Features**:
    - Tooltip interattivi personalizzati
    - Responsive: `ResponsiveContainer` per adattamento automatico
    - Theming: Colori personalizzati per brand consistency
    - Animations: Transizioni fluide sui cambi dati

#### **Security**
- **bcryptjs 3.0.3**
  - Hashing password sicuro con salt automatico
  - **Utilizzo**:
    - `bcrypt.hash(password, 10)`: Registrazione utenti con 10 rounds
    - `bcrypt.compare(password, hash)`: Verifica login
    - Protezione contro rainbow table attacks
  - Async operations per non bloccare event loop

---

## 🗄️ Database Schema

### Modelli Principali

#### **User (Utenti)**
```prisma
model User {
  id              String    @id @default(uuid())
  email           String    @unique
  password        String    // Hash bcrypt
  name            String
  role            String    // SuperAdmin | Founder | Manager | Promoter | Collaboratore
  phone           String?
  avatar          String?
  isActive        Boolean   @default(true)
  inviteToken     String?   @unique
  invitedBy       String?
  
  // Wallet System
  walletBalance   Float     @default(0)
  rentAmount      Float?
  rentType        String?   // "weekly" | "monthly"
  bankAccount     String?   // IBAN
  paymentMethod   String?   // "bank_transfer" | "cash" | "revolut"
  
  // Housing Management
  propertyId      String?
  property        Property? @relation(fields: [propertyId], references: [id])
  moveInDate      DateTime?
  moveOutDate     DateTime?
  
  transactions    Transaction[]
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

**Funzionalità**:
- Sistema ruoli gerarchico con 5 livelli di accesso
- Wallet integrato per tracking commissioni e spese
- Sistema inviti con token univoci
- Gestione alloggi per personale stagionale

#### **Booking (Prenotazioni)**
```prisma
model Booking {
  id              String    @id @default(uuid())
  bookingId       String    @unique // Format: BK{timestamp}
  
  // Event Reference
  eventId         String?
  event           Event?    @relation(fields: [eventId], references: [id])
  eventName       String?   // Snapshot per storico
  eventDate       String?
  eventTime       String?
  
  // Customer Data
  name            String
  firstName       String?
  lastName        String?
  email           String
  country         String?
  phone           String?
  notes           String?
  adminNotes      String?
  
  // Payment Details
  status          String    // Confirmed | Pending | Invited | Cancelled
  paymentMethod   String?   // Cash | Card | Transfer | POS
  price           Float
  discount        Float     @default(0)
  tax             Float     @default(0)
  total           Float
  deposit         Float     @default(0)
  depositPercent  Boolean   @default(false)
  toPay           Float
  coupon          String?
  
  // Sales Tracking
  soldBy          String?   // Ruolo venditore
  soldByName      String?
  confirmedAt     DateTime?
  cancelledAt     DateTime?
  
  // Guest List Features
  guestList       String?
  guestListAccess String?   // VIP | Standard | Guest +1 | None
  gifts           String?
  booker          String?
  emailLanguage   String    @default("it") // en | it | fr | es
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

**Funzionalità**:
- ID univoco auto-generato per tracking
- Snapshot dati evento per storico immutabile
- Sistema sconti e depositi percentuali
- Tracking completo del sales funnel
- Multi-language per comunicazioni clienti

#### **Transaction (Transazioni Wallet)**
```prisma
model Transaction {
  id            String    @id @default(uuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type          String    // "commission" | "expense" | "payout" | "adjustment"
  category      String?   // "rent" | "scooter" | "fine" | "damage" | "booking" | "bonus"
  
  amount        Float     // Positivo = entrata, Negativo = uscita
  balanceAfter  Float     // Snapshot saldo post-transazione
  
  description   String
  reference     String?   // Link a booking/evento
  status        String    @default("completed") // "completed" | "pending" | "cancelled"
  
  createdBy     String?
  createdByName String?
  notes         String?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([userId])
  @@index([createdAt])
  @@index([type])
}
```

**Funzionalità**:
- Double-entry bookkeeping con balanceAfter
- Categorizzazione flessibile per reporting
- Audit trail completo con createdBy
- Indexes per query performance su analytics

#### **Property (Alloggi)**
```prisma
model Property {
  id          String    @id @default(uuid())
  name        String
  address     String?
  monthlyRent Float     @default(0)
  capacity    Int       @default(1)
  managedBy   String?   // Founder responsabile
  notes       String?
  tenants     User[]    // Inquilini attuali
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

**Funzionalità**:
- Gestione alloggi per team stagionale
- Calcolo automatico affitti settimanali/mensili
- Multi-tenancy con capacità configurabile

---

## 🚀 Funzionalità Principali

### 1. **Sistema di Autenticazione**
📁 `app/context/AuthContext.tsx`, `app/api/auth/*/route.ts`

- **Login/Logout**:
  - Validazione credenziali con bcrypt
  - Session management con localStorage
  - Redirect automatici basati su ruolo
  
- **Sistema Inviti**:
  - Generazione token univoci
  - Invite link con scadenza
  - Tracking chi ha invitato chi (referral system)
  
- **Ruoli e Permessi**:
  - **SuperAdmin**: Accesso completo, gestione utenti
  - **Founder**: Gestione team, housing, wallet
  - **Manager**: Supervisione vendite, reports
  - **Promoter**: Creazione prenotazioni, modifica proprie
  - **Collaboratore**: Accesso limitato read-only

**Implementazione**:
```typescript
const { user, login, logout, isLoading } = useAuth();

// Protected routes
if (!user) {
  router.push('/auth/login');
}

// Role-based rendering
{user?.role === 'SuperAdmin' && (
  <AdminPanel />
)}
```

### 2. **Gestione Prenotazioni**
📁 `app/bookings/`, `app/api/bookings/route.ts`

#### **Creazione Prenotazione** (`/bookings/add`)
- **Form Dinamico**:
  - Selezione evento con color-coding
  - Auto-capitalizzazione nomi (Primo carattere maiuscolo)
  - Email auto-lowercase
  - Validazione telefono internazionale
  
- **Calcoli Automatici**:
  ```javascript
  total = price - discount + tax
  toPay = total - (depositPercent ? total * (deposit/100) : deposit)
  ```
  
- **Features Avanzate**:
  - Snapshot dati evento per storico
  - Note pubbliche (cliente) e private (admin)
  - Sistema coupon/sconti
  - Gift tracking per VIP clients

#### **Lista Prenotazioni** (`/bookings/list`)
- **Filtri Avanzati**:
  - Ricerca per ID prenotazione
  - Filtro per evento
  - Ricerca per nome cliente
  - Filtro per email
  - Stato prenotazione (Confirmed/Pending/Cancelled)
  
- **Vista Responsive**:
  - **Desktop**: Tabella completa con sorting
  - **Mobile**: Card layout ottimizzato
  - Filtri collapsabili su mobile
  
- **Azioni Bulk** (Solo SuperAdmin):
  - Conferma prenotazioni pending
  - Cancellazione booking
  - Modifica rapida dati

#### **Modifica Prenotazione** (`/bookings/edit/[id]`)
- Form pre-popolato con dati esistenti
- Tracking modifiche con updatedAt
- Preserve audit trail (createdBy, soldBy)

**API Endpoints**:
```typescript
GET  /api/bookings          // Lista completa
POST /api/bookings          // Crea nuova
GET  /api/bookings/[id]     // Dettaglio singola
PUT  /api/bookings/[id]     // Aggiorna
```

### 3. **Dashboard Analytics**
📁 `app/dashboard/page.tsx`, `app/components/HomeContent.tsx`

#### **KPI Cards**
Metriche in tempo reale con navigazione filtrata:
- **Totale Prenotazioni**: Click → `/bookings/list?status=all`
- **Confermate**: Click → `/bookings/list?status=confirmed`
- **In Attesa**: Click → `/bookings/list?status=pending`
- **Cancellate**: Click → `/bookings/list?status=cancelled`
- **Revenue Totale**: Somma bookings confermati

**Design**:
- Color-coding per stati (Verde/Giallo/Rosso)
- Icone Lucide per riconoscibilità
- Grid responsive: 4 colonne desktop, 2x2 mobile
- Effetti glassmorphism e glow ridotto

#### **Revenue Chart** (`RevenueChart.tsx`)
- Line/Area chart con Recharts
- Filtri: Today, Week, Month
- Tooltip custom con formattazione euro
- Responsive container 100% width

#### **Team Performance** (`TeamPerformance.tsx`)
Classifica venditori con:
- Total sales count
- Confirmed vs Pending ratio
- Cash vs Card split
- Revenue generato
- Average confirmation time

Sorting dinamico per colonna

#### **Recent Transactions** (`RecentTransactions.tsx`)
Ultime 8 transazioni con:
- Nome cliente + evento
- Data formattata (it-IT locale)
- Importo con color-coding
- Metodo pagamento
- Venditore responsabile

### 4. **Sistema Wallet**
📁 `app/wallet/`, `app/api/wallet/route.ts`

#### **Overview Wallet** (`/wallet/overview`)
Dashboard finanziaria personale con:

- **Saldo Attuale**:
  - Display prominente con colore dinamico (verde/rosso)
  - Storico saldo ultimi 30 giorni
  
- **Transazioni**:
  - Lista filtrata per periodo (week/month/all)
  - Categorizzazione:
    - 💰 Commission: Da bookings confermati
    - 💸 Expense: Affitti, multe, danni
    - 💳 Payout: Prelievi/pagamenti
    - ⚙️ Adjustment: Correzioni admin
  
- **Dettagli Affitto**:
  - Importo settimanale/mensile
  - Prossima scadenza
  - Giorni rimanenti
  - Storico pagamenti

#### **Gestione Transazioni** (SuperAdmin)
```typescript
POST /api/wallet
{
  userId: string,
  type: "commission" | "expense" | "payout",
  amount: number,
  description: string,
  category?: string
}
```

**Logica Calcolo**:
```javascript
// Automatic balance calculation
const newBalance = currentBalance + amount; // amount can be negative
await prisma.transaction.create({
  data: {
    userId,
    amount,
    balanceAfter: newBalance,
    type,
    category,
    description
  }
});

await prisma.user.update({
  where: { id: userId },
  data: { walletBalance: newBalance }
});
```

#### **Rent Generation** (`/api/housing/generate-rent`)
Automated script per generare transazioni affitto:
- Trova tutti gli utenti con `rentAmount` e `propertyId`
- Crea transaction negativa per ogni inquilino
- Aggiorna `walletBalance`
- Invia notifica (future: email)

### 5. **Housing Management**
📁 `app/housing/`, `app/api/housing/route.ts`

Sistema completo per gestione alloggi stagionali:

#### **Properties Dashboard**
- Lista properties con occupancy status
- Calcolo automatico rent split per inquilino
- Calendario move-in/move-out dates

#### **Tenant Assignment**
- Assegna dipendenti a property
- Imposta rentAmount e rentType (weekly/monthly)
- Tracking moveInDate/moveOutDate

#### **Rent Automation**
- Cron job simulato per addebitare affitti
- Notifiche pre-scadenza
- Report ritardi pagamento

### 6. **Sistema Multilingua**
📁 `app/i18n/`

#### **Implementazione**
- **Context Provider**: `LanguageContext.tsx`
- **Custom Hook**: `useTranslation.ts`
- **Translation Files**:
  - `en.json`: English
  - `it.json`: Italiano (default)
  - `es.json`: Español
  - `fr.json`: Français

#### **Utilizzo**:
```typescript
const { t, language, setLanguage } = useTranslation();

<h1>{t('dashboard.welcome')}</h1>
<button onClick={() => setLanguage('en')}>EN</button>
```

#### **Language Switcher**
Componente `LanguageSwitcher.tsx` con:
- Flag emoji (🇮🇹 🇬🇧 🇪🇸 🇫🇷)
- Dropdown menu stilizzato
- Persistenza in localStorage
- Animazioni smooth

### 7. **User Management**
📁 `app/users/`, `app/api/users/route.ts`

#### **Team Overview** (SuperAdmin/Founder)
- Lista tutti gli utenti attivi
- Filtri per ruolo
- Quick actions:
  - Toggle isActive
  - Reset password
  - View wallet balance
  - Assign property

#### **Profile Pages**
- **My Profile** (`/my-profile`): Utente loggato
  - Edit info personali
  - Change password
  - View wallet summary
  - Upload avatar (future)
  
- **User Profile** (`/profile?id=xxx`): Admin view
  - Full transaction history
  - Edit permissions
  - Assign roles
  - View sales stats

### 8. **Settings & Configuration**
📁 `app/settings/`

#### **Booking Config** (`/settings/booking-config`)
Configurazione dinamica stored in DB (`BookingConfig` model):

```typescript
// Events Management
{
  key: "events",
  value: JSON.stringify([
    { name: "Pacha", color: "#FF6B6B", price: 80 },
    { name: "Ushuaïa", color: "#4ECDC4", price: 120 }
  ])
}

// Custom Fields
{
  key: "fields",
  value: JSON.stringify({
    showGuestList: true,
    requirePhone: false,
    enableGifts: true
  })
}

// Pricing Rules
{
  key: "pricing",
  value: JSON.stringify({
    defaultTax: 10,
    defaultDeposit: 30,
    currency: "EUR"
  })
}
```

Allows SuperAdmin to:
- Add/remove eventi
- Configure form fields visibility
- Set default pricing rules
- Customize workflows

---

## 🎨 UI/UX Features

### Design System

#### **Color Palette**
- **Primary Gold**: `#c89664` - Accenti premium, CTA buttons
- **Success Green**: `#10b981` - Confirmed bookings, positive metrics
- **Warning Yellow**: `#ffc107` - Pending status, alerts
- **Danger Red**: `#ff4757` - Cancelled, negative values
- **Neutral Grays**: `#888`, `#1a1a1a` - Testi e backgrounds

#### **Typography**
```css
/* Headings */
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
font-weight: 700;
letter-spacing: -0.5px;
text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

/* Body */
font-size: 14-16px;
line-height: 1.5;
```

#### **Glassmorphism Effects**
```css
background: rgba(20, 20, 20, 0.6);
backdrop-filter: blur(10px);
border: 1px solid rgba(200, 150, 100, 0.3);
border-radius: 12px;
```

#### **Responsive Breakpoints**
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Animations & Interactions
- **Hover states**: Subtle scale(1.02) e brightness
- **Transitions**: `transition: all 0.3s ease`
- **Loading states**: Skeleton loaders, spinner
- **Micro-interactions**: Button ripple, icon bounce

### Mobile Optimizations
- **Touch targets**: Minimum 44x44px
- **Collapsible sections**: Filtri, sidebar
- **Card layouts**: Sostituiscono tabelle su mobile
- **Swipe gestures**: Future: swipe to delete bookings
- **Bottom navigation**: Fixed CTA buttons

---

## 🔐 Security Best Practices

### Authentication
- **Password Hashing**: bcrypt con 10 salt rounds
- **No JWT**: Session-based auth con localStorage (considera HttpOnly cookies per prod)
- **Token Expiry**: Implement expiration per invite tokens

### API Security
- **Validation**: Zod schema validation su tutti gli endpoints (to implement)
- **Rate Limiting**: Implement con middleware (to implement)
- **CORS**: Configure per production domain
- **SQL Injection**: Protected by Prisma parameterized queries

### Data Privacy
- **Role-Based Access Control** (RBAC): Check user.role su ogni route
- **Field-Level Permissions**: Admin-only fields hidden client-side
- **Audit Logging**: Track who modified what (`updatedBy`, `createdBy`)

### Environment Variables
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-here"  # For future NextAuth integration
SMTP_HOST="smtp.gmail.com"          # For email notifications
```

---

## 📦 Deployment

### Build & Start
```bash
# Development
npm run dev              # http://localhost:3000

# Production
npm run build            # Genera .next/ optimized bundle
npm start                # Serve production build

# Database
npx prisma generate      # Generate Prisma Client dopo modifiche schema
npx prisma migrate dev   # Apply migrations in dev
npx prisma migrate deploy # Apply migrations in prod
npx prisma studio        # GUI per visualizzare/editare DB
npx prisma db seed       # Popola DB con dati iniziali
```

### Prisma Migrations
```bash
# Create new migration
npx prisma migrate dev --name add_booking_config

# Reset database (ATTENZIONE: cancella tutti i dati)
npx prisma migrate reset

# View migration status
npx prisma migrate status
```

### Environment Setup

#### Development
1. Clone repository
2. `npm install`
3. Crea `.env` con `DATABASE_URL`
4. `npx prisma migrate dev`
5. `npx prisma db seed` (carica dati demo)
6. `npm run dev`

#### Production (Vercel)
1. Push to GitHub
2. Import project su Vercel
3. Configure environment variables:
   - `DATABASE_URL`: PostgreSQL connection string (Supabase/Railway/Neon)
   - `NODE_ENV=production`
4. Deploy automatico su ogni push

#### Database Migration (SQLite → PostgreSQL)
```bash
# Export data
npx prisma db pull --force

# Change schema.prisma datasource
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# Generate new migration
npx prisma migrate dev --name switch_to_postgresql

# Deploy
npx prisma migrate deploy
```

---

## 📊 Performance Optimizations

### Next.js Features Utilizzate

#### **Automatic Code Splitting**
Ogni route carica solo il JS necessario:
```javascript
// app/bookings/list/page.tsx viene bundled separatamente
// app/dashboard/page.tsx è un chunk indipendente
```

#### **Image Optimization**
```jsx
import Image from 'next/image';

<Image 
  src="/avatar.jpg" 
  width={40} 
  height={40}
  alt="User"
  loading="lazy"  // Lazy load automatico
/>
```

#### **Font Optimization**
Next.js ottimizza font system-ui senza FOUT (Flash of Unstyled Text)

#### **Dynamic Imports** (Future)
```javascript
const AdminPanel = dynamic(() => import('./AdminPanel'), {
  loading: () => <Spinner />,
  ssr: false // Carica solo client-side
});
```

### Database Performance

#### **Indexes**
```prisma
@@index([userId])    // Fast user lookups
@@index([createdAt]) // Fast date range queries
@@index([type])      // Fast transaction filtering
```

#### **Efficient Queries**
```typescript
// Include relations solo quando necessario
const bookings = await prisma.booking.findMany({
  include: { event: true }, // Solo se serve event data
  where: { status: 'Confirmed' },
  orderBy: { createdAt: 'desc' },
  take: 10 // Limit results
});
```

#### **Connection Pooling**
Prisma gestisce automaticamente il pool di connessioni:
```typescript
// lib/prisma.ts - Singleton pattern
export const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
```

### Frontend Optimizations

#### **Memoization** (To Implement)
```javascript
import { useMemo, useCallback } from 'react';

const filteredBookings = useMemo(() => 
  bookings.filter(b => b.status === filter),
  [bookings, filter]
);

const handleClick = useCallback(() => {
  // Expensive operation
}, [dependencies]);
```

#### **Lazy Loading**
```javascript
// Mobile cards visibili solo quando necessario
<div className="mobile-cards">
  {filteredBookings.map(booking => (
    <BookingCard key={booking.id} {...booking} />
  ))}
</div>
```

#### **Debouncing Search** (To Implement)
```javascript
const debouncedSearch = useDebouncedCallback(
  (value) => setSearchTerm(value),
  500 // Wait 500ms dopo ultimo keystroke
);
```

---

## 🧪 Testing (Future Implementation)

### Unit Tests
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Run tests
npm test
```

### E2E Tests
```bash
npm install --save-dev playwright

# Run E2E
npx playwright test
```

### Test Coverage
- Authentication flow
- Booking CRUD operations
- Wallet calculations
- Role-based access control
- API endpoint responses

---

## 🚧 Roadmap & Future Features

### Phase 1 - Core Improvements
- [ ] **Email Notifications**: Nodemailer integration per conferme booking
- [ ] **PDF Generation**: Invoice/ticket generation con jsPDF
- [ ] **QR Codes**: Guest list check-in system
- [ ] **Export Data**: CSV/Excel export per reports

### Phase 2 - Advanced Features
- [ ] **Real-time Updates**: Socket.io per dashboard live
- [ ] **Calendar View**: React Big Calendar per eventi timeline
- [ ] **Mobile App**: React Native companion app
- [ ] **WhatsApp Integration**: Business API per notifiche automatiche

### Phase 3 - Scale & Enterprise
- [ ] **Multi-tenant**: Supporto multiple venues/organizzatori
- [ ] **Advanced Analytics**: Data warehouse con BigQuery
- [ ] **Payment Gateway**: Stripe integration per online payments
- [ ] **CRM Integration**: Salesforce/HubSpot connectors

---

## 🤝 Contributing

### Development Guidelines
1. **Branch Strategy**: feature/xxx, bugfix/xxx
2. **Commit Convention**: 
   - `feat:` nuove funzionalità
   - `fix:` bug fixes
   - `refactor:` code restructuring
   - `style:` formatting, UI changes
   - `docs:` documentation updates

3. **Code Style**:
   - ESLint rules adherence
   - TypeScript strict mode
   - Meaningful variable names
   - Comments per logica complessa

### Pull Request Process
1. Fork repository
2. Create feature branch
3. Implement changes + tests
4. Run `npm run lint` e `npm run build`
5. Submit PR con description dettagliata

---

## 📝 License

**Proprietary Software** - © 2026 BookingCilex
All rights reserved. 

Questo software è proprietario e non può essere copiato, modificato o distribuito senza autorizzazione esplicita.

---

## 📞 Support & Contact

**Developer**: BookingCilex Team
**Email**: support@bookingcilex.com
**Location**: Ibiza, Spain

---

## 🙏 Acknowledgments

- **Next.js Team**: Per il framework eccezionale
- **Vercel**: Hosting platform ottimizzato
- **Prisma**: Best-in-class ORM
- **Lucide Icons**: Beautiful icon library
- **Recharts**: Powerful charting solution

---

## 📖 Appendix

### Glossary
- **Booking**: Prenotazione evento
- **Wallet**: Sistema finanziario interno
- **Property**: Alloggio per staff
- **Transaction**: Movimento finanziario
- **Promoter**: Venditore entry-level
- **Founder**: Manager alto livello con equity
- **SuperAdmin**: Administrator con accesso completo

### Common Issues & Solutions

#### Issue: "prisma:error" durante build
**Solution**: 
```bash
npx prisma generate
npm run build
```

#### Issue: Stile non applicato dopo modifica
**Solution**:
```bash
Remove-Item -Path ".next" -Recurse -Force
npm run dev
```

#### Issue: Database locked (SQLite)
**Solution**: Chiudi Prisma Studio e riavvia dev server

---

**Version**: 1.0.0
**Last Updated**: 19 Gennaio 2026
**Next.js Version**: 15.0.0
**Node Version**: 18.x or higher required