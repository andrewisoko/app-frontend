# TransAct — Frontend Project Plan

> Financial service mobile app built with React Native (Expo) + NativeWind (Tailwind CSS).
> This document is the single source of truth for design decisions, architecture, screen inventory, and API mapping.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Design System](#3-design-system)
4. [App Architecture & Folder Structure](#4-app-architecture--folder-structure)
5. [Navigation Structure](#5-navigation-structure)
6. [Screen Inventory](#6-screen-inventory)
7. [API Integration Map](#7-api-integration-map)
8. [State Management (React Context)](#8-state-management-react-context)
9. [Component Library Plan](#9-component-library-plan)
10. [Onboarding Flow](#10-onboarding-flow)
11. [Animations & Interactions](#11-animations--interactions)
12. [Contract Form Design](#12-contract-form-design)
13. [Virtual Card Design](#13-virtual-card-design)
14. [Backend Data Models Reference](#14-backend-data-models-reference)
15. [Development Phases](#15-development-phases)
16. [Dependencies](#16-dependencies)

---

## 1. Project Overview

**App Name:** TransAct  
**Type:** Cross-platform mobile application (iOS + Android)  
**Backend:** NestJS REST API (dual database: PostgreSQL + MongoDB)  
**Purpose:** A financial services app with a modern, gaming-inspired aesthetic. Users manage virtual cards, accounts, contracts (split agreements), and an inbox for receiving contracts.

### Core Features

| Feature | Description |
|---------|-------------|
| Virtual Cards | Main card + multiple temporary cards with QR code generation |
| Inbox | Receive, accept, or decline contracts sent by other users |
| Contracts | Create split-payment agreements (by % or fixed amount) with time, event, location conditions |
| Accounts | View account details, balances, PAN, status |
| User Profile | Manage user information, settings |
| Authentication | JWT-based login and registration |

---

## 2. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | **React Native** via **Expo** (managed workflow) | Cross-platform iOS + Android |
| Styling | **NativeWind v4** (Tailwind CSS for React Native) | Utility-first, consistent with design system |
| Navigation | **React Navigation v6** | Drawer + Stack navigators |
| State | **React Context API** | AuthContext, AccountContext, CardContext, ContractContext, InboxContext |
| HTTP Client | **Axios** | Centralized API service layer |
| Animations | **React Native Reanimated v3** | Fluid, physics-based animations |
| Gestures | **React Native Gesture Handler** | Drag & drop, swipe interactions |
| Forms | **React Hook Form** | Contract form, registration, login |
| Validation | **Zod** | Schema validation for forms |
| Icons | **Expo Vector Icons** + custom SVGs | Consistent iconography |
| QR Code | **react-native-qrcode-svg** | For virtual card QR display |
| Date Picker | **@react-native-community/datetimepicker** | Contract time agreement |
| Storage | **Expo SecureStore** | JWT token storage (secure, encrypted) |
| Fonts | **Expo Google Fonts** | Custom typography |
| Gradients | **expo-linear-gradient** | Blue-to-purple gradient backgrounds |
| Blur | **expo-blur** | Frosted glass card effects |

---

## 3. Design System

### 3.1 Colour Palette

```
Primary:
  blue-600:    #2563EB   — primary buttons, active states, highlights
  blue-500:    #3B82F6   — secondary blue
  blue-900:    #1E3A8A   — dark blue backgrounds

Accent:
  purple-600:  #7C3AED   — accent colour, gradients, CTAs
  purple-500:  #8B5CF6   — lighter purple
  purple-900:  #4C1D95   — deep purple backgrounds

Neutrals:
  white:       #FFFFFF   — card surfaces, text on dark
  gray-100:    #F3F4F6   — subtle backgrounds
  gray-400:    #9CA3AF   — placeholder text
  gray-700:    #374151   — secondary text (light mode)

Dark:
  black:       #000000   — headings on light surfaces
  slate-900:   #0F172A   — main dark background (dark mode primary)
  slate-800:   #1E293B   — card backgrounds in dark mode

Status:
  green-400:   #4ADE80   — active, accepted
  red-400:     #F87171   — declined, error, suspended
  yellow-400:  #FACC15   — pending, warning
  gray-400:    #9CA3AF   — inactive, closed
```

### 3.2 Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| App Logo | Space Grotesk | 800 | 32px |
| Screen Title | Space Grotesk | 700 | 24px |
| Section Header | Space Grotesk | 600 | 18px |
| Body | Inter | 400 | 14px |
| Label | Inter | 500 | 12px |
| Caption / Meta | Inter | 400 | 11px |
| Card PAN (masked) | Space Mono | 400 | 16px |
| Numbers / Balances | Space Grotesk | 700 | 20–28px |

### 3.3 Design Language

- **Dark-mode first** with a deep slate/dark blue base.
- **Gradient surfaces**: blue-to-purple gradients used on cards, headers, and featured elements.
- **Glassmorphism**: frosted blur on card overlays and modals (`expo-blur`).
- **Neon glow accents**: subtle box shadows in blue/purple on interactive elements.
- **Gaming-inspired**: bold numbers, glowing status badges, animated counters, pill-shaped tags.
- **Financial-grade clarity**: masked PANs, clear balance hierarchy, status chips.
- **Rounded corners**: `rounded-2xl` (16px) for cards, `rounded-xl` (12px) for inputs, `rounded-full` for pills/badges.

### 3.4 Spacing & Layout

- Base unit: 4px (Tailwind default)
- Screen horizontal padding: `px-5` (20px)
- Card padding: `p-5` (20px)
- Section gap: `gap-4` (16px) to `gap-6` (24px)
- Safe area insets: handled via `SafeAreaView` from `react-native-safe-area-context`

---

## 4. App Architecture & Folder Structure

```
app-frontend/
├── app/                          # Expo Router entry (if using Expo Router)
│   └── _layout.tsx
├── src/
│   ├── api/
│   │   ├── axiosInstance.ts      # Base Axios config + interceptors (JWT attach)
│   │   ├── auth.api.ts           # login, register
│   │   ├── account.api.ts        # create account, get account
│   │   ├── cards.api.ts          # create main card, create temp card, generate QR
│   │   ├── contract.api.ts       # send contract, accept/decline
│   │   ├── inbox.api.ts          # post inbox, accept via inbox
│   │   └── user.api.ts           # get user, delete user
│   │
│   ├── components/
│   │   ├── ui/                   # Design system primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── GradientCard.tsx
│   │   │   ├── GlassCard.tsx
│   │   │   ├── Divider.tsx
│   │   │   ├── Skeleton.tsx      # Loading placeholders
│   │   │   └── ScreenWrapper.tsx
│   │   │
│   │   ├── cards/
│   │   │   ├── VirtualCardTile.tsx        # Flat card with masked PAN
│   │   │   ├── VirtualCardBadge.tsx       # MAIN / TEMP badge
│   │   │   ├── CardStatusChip.tsx
│   │   │   └── QRCodeSheet.tsx            # Bottom sheet showing QR
│   │   │
│   │   ├── contracts/
│   │   │   ├── ContractFormStep.tsx       # Step wrapper
│   │   │   ├── SplitTypeSelector.tsx      # Percentage vs Amount toggle
│   │   │   ├── TimeAgreementPicker.tsx    # Start + End date pickers
│   │   │   ├── ReceiverInput.tsx          # Add/remove receiver fields
│   │   │   └── ContractStatusBadge.tsx
│   │   │
│   │   ├── inbox/
│   │   │   ├── InboxItem.tsx              # Contract preview row
│   │   │   ├── InboxHistory.tsx           # Collapsible history section
│   │   │   └── AcceptDeclineBar.tsx       # Accept / Decline action row
│   │   │
│   │   ├── account/
│   │   │   ├── BalanceDisplay.tsx         # Ledger + available balance
│   │   │   ├── AccountStatusChip.tsx
│   │   │   └── AccountCard.tsx
│   │   │
│   │   └── navigation/
│   │       ├── DrawerContent.tsx          # Custom drawer sidebar
│   │       └── DrawerHeader.tsx
│   │
│   ├── context/
│   │   ├── AuthContext.tsx               # user, tokens, login(), logout()
│   │   ├── AccountContext.tsx            # account data, refresh
│   │   ├── CardContext.tsx               # virtual cards list, create
│   │   ├── ContractContext.tsx           # contracts, send, respond
│   │   └── InboxContext.tsx              # inbox messages, respond
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useAccount.ts
│   │   ├── useCards.ts
│   │   ├── useContracts.ts
│   │   └── useInbox.ts
│   │
│   ├── navigation/
│   │   ├── RootNavigator.tsx             # Auth vs App switch
│   │   ├── AuthStack.tsx                 # Login, Register
│   │   ├── AppDrawer.tsx                 # Main drawer navigator
│   │   └── CardStack.tsx                 # Cards sub-stack
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── SplashScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   │
│   │   ├── home/
│   │   │   └── HomeScreen.tsx
│   │   │
│   │   ├── cards/
│   │   │   ├── CardsScreen.tsx           # Cards list
│   │   │   ├── CardDetailScreen.tsx      # Card detail + QR button
│   │   │   ├── CreateMainCardScreen.tsx
│   │   │   └── CreateTempCardScreen.tsx
│   │   │
│   │   ├── inbox/
│   │   │   ├── InboxScreen.tsx           # Inbox list
│   │   │   └── ContractReviewScreen.tsx  # Accept / decline screen
│   │   │
│   │   ├── contracts/
│   │   │   ├── ContractsScreen.tsx       # Contracts list
│   │   │   ├── ContractDetailScreen.tsx
│   │   │   └── CreateContractScreen.tsx  # Multi-step form
│   │   │
│   │   ├── account/
│   │   │   └── AccountScreen.tsx
│   │   │
│   │   └── profile/
│   │       └── ProfileScreen.tsx
│   │
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── api.ts                        # BASE_URL constant
│   │
│   ├── types/
│   │   ├── user.types.ts
│   │   ├── account.types.ts
│   │   ├── card.types.ts
│   │   ├── contract.types.ts
│   │   ├── inbox.types.ts
│   │   └── transaction.types.ts
│   │
│   └── utils/
│       ├── formatters.ts                 # maskPAN(), formatBalance(), formatDate()
│       ├── tokenStorage.ts               # SecureStore get/set/delete
│       └── validators.ts                 # Zod schemas
│
├── assets/
│   ├── fonts/
│   ├── images/
│   └── icons/
│
├── app.json
├── tailwind.config.js
├── babel.config.js
├── tsconfig.json
├── package.json
└── TRANSACT_PROJECT_PLAN.md
```

---

## 5. Navigation Structure

```
RootNavigator
├── AuthStack (unauthenticated)
│   ├── SplashScreen
│   ├── LoginScreen
│   └── RegisterScreen
│
└── AppDrawer (authenticated)
    │
    ├── [Drawer Sidebar — DrawerContent.tsx]
    │   ├── User avatar + name + account number
    │   ├── Home
    │   ├── Virtual Cards
    │   ├── Inbox            (badge: unread count)
    │   ├── Contracts
    │   ├── Account
    │   ├── Profile
    │   └── Logout
    │
    ├── HomeScreen
    ├── CardsStack
    │   ├── CardsScreen
    │   ├── CardDetailScreen
    │   ├── CreateMainCardScreen
    │   └── CreateTempCardScreen
    ├── InboxStack
    │   ├── InboxScreen
    │   └── ContractReviewScreen
    ├── ContractsStack
    │   ├── ContractsScreen
    │   ├── ContractDetailScreen
    │   └── CreateContractScreen
    ├── AccountScreen
    └── ProfileScreen
```

**Drawer behaviour:**
- Slides in from the left with a `translateX` animation (Reanimated).
- Background uses a frosted blur overlay on the current screen.
- Active drawer item glows with a blue/purple highlight.
- iOS-style drag-from-edge gesture opens/closes the drawer.

---

## 6. Screen Inventory

### 6.1 SplashScreen
- Full-screen gradient (blue → purple)
- Animated "TransAct" logo (scale + fade in)
- Auto-navigates after token check (1.5s)

### 6.2 LoginScreen
- Dark background with subtle gradient card
- Email + Password inputs
- Glowing "Sign In" button (blue → purple gradient)
- "Don't have an account? Register" link

### 6.3 RegisterScreen
- Fields: Name, Surname, Email, Mobile Number, Password, Confirm Password
- Step progress indicator (optional, for feel)
- Same visual language as Login
- Validates with Zod on submit

### 6.4 HomeScreen (Dashboard)
- Header: "Good morning, [Name]" + avatar
- Featured account balance card (gradient, large numbers)
- Quick-action row: Send Contract, View Cards, Check Inbox, Add Account
- Recent contracts section (mini list)
- Animated number count-up on balance display

### 6.5 CardsScreen
- Section header: "My Cards"
- List: 1 Main card + N Temp cards
- Each card tile: masked PAN (`**** **** **** 1234`), card type badge, expiry
- FAB (Floating Action Button): + Create Card (opens choice modal)
- Swipe left on temp card → Delete (future)

### 6.6 CardDetailScreen
- Flat card preview (larger, still masked)
- Toggle: "Reveal" button → unmasks PAN with blur animation
- CVC display (masked by default)
- Expiry, billing address
- "Generate QR Code" button → bottom sheet with QR

### 6.7 CreateMainCardScreen
- Simple form: uses authenticated user's account data
- One button: "Issue Main Card"

### 6.8 CreateTempCardScreen
- Fields: expiry time, linked account users
- Date-time picker for expiry
- "Issue Temporary Card" button

### 6.9 InboxScreen
- Two tabs: **Recent** | **History**
- Each item: sender info, contract type, split amount, status badge, timestamp
- Tap → ContractReviewScreen
- Empty state: animated illustration + "No contracts yet"

### 6.10 ContractReviewScreen
- Full contract detail (read-only form style)
- All agreement fields displayed
- Action row (if pending): Accept (green) | Decline (red) buttons
- Decline requires confirmation modal
- Status shown prominently if already resolved

### 6.11 ContractsScreen
- List of sent contracts with status badges
- Filter chips: All | Pending | Accepted | Declined | Failed
- Each row: receiver(s), split info, time range, status
- FAB: + New Contract

### 6.12 ContractDetailScreen
- Full read-only view of a contract
- Status timeline (created → accepted/declined)
- Related transactions (future)

### 6.13 CreateContractScreen (Multi-step form)
- **Step 1 — Parties**
  - Sender: pre-filled with logged-in user's username (read-only field, visually styled as "You")
  - Receivers: dynamic add/remove input fields (username lookup)
  - Contract type: One-time | Existing User (toggle)

- **Step 2 — Split Agreement**
  - Split type: Percentage | Amount (segmented control)
  - Sender share: input field
  - Receiver shares: per-receiver input fields
  - Visual breakdown bar (shows proportional split)

- **Step 3 — Time Agreement**
  - Start Date: date picker (calendar sheet)
  - End Date: date picker (calendar sheet)
  - Displayed as: "From Jan 15, 2026 to Mar 31, 2026"

- **Step 4 — Optional Conditions**
  - Repayment agreement: text input (optional)
  - Event agreement: text input (optional)
  - Location agreement: text input (optional)
  - Each has a toggle to enable/disable

- **Step 5 — Review & Send**
  - Full summary of all fields
  - "Send Contract" button (gradient, animated)
  - Edit navigation back to any step

**Progress indicator:** Horizontal step dots at the top with animated fill.

### 6.14 AccountScreen
- Account number, full name, currency
- Balance cards: Ledger Balance | Available Balance | Hold
- PAN (masked, tap to reveal)
- Account status chip (active/inactive/suspended)
- Virtual cards linked count
- Transactions section (placeholder)

### 6.15 ProfileScreen
- Avatar placeholder (initials-based)
- Name, surname, email, mobile number
- Role badge (USER / ADMIN)
- User type (default / completed)
- Edit Profile button (future)
- Danger zone: Delete Account (confirmation required)
- Logout button

---

## 7. API Integration Map

### Base URL
```
http://localhost:3000   (development)
https://api.transact.app  (production)
```

All authenticated requests attach `Authorization: Bearer <accessToken>` header via an Axios interceptor.

### Endpoint → Screen Map

| Endpoint | Method | Screen(s) |
|----------|--------|-----------|
| `POST /user/register` | POST | RegisterScreen |
| `POST /user/login` | POST | LoginScreen |
| `GET /user/:id` | GET | ProfileScreen, AuthContext init |
| `DELETE /user/:id` | DELETE | ProfileScreen |
| `POST /account/create` | POST | AccountScreen (create flow) |
| `POST /virtual-card/create-main` | POST | CreateMainCardScreen |
| `POST /virtual-card/create-temp` | POST | CreateTempCardScreen |
| `POST /virtual-card/generate-qr-code` | POST | CardDetailScreen |
| `POST /contract/send-contract` | POST | CreateContractScreen |
| `POST /contract/receiver-inbox-contract` | POST | ContractReviewScreen |
| `POST /inbox/post-inbox` | POST | (internal / backend triggered) |
| `POST /inbox/receiver-inbox-contract` | POST | ContractReviewScreen |

---

## 8. State Management (React Context)

### AuthContext
```ts
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
// Actions: login(), logout(), register(), refreshSession()
```

### AccountContext
```ts
interface AccountState {
  account: Account | null;
  isLoading: boolean;
}
// Actions: fetchAccount(), createAccount()
```

### CardContext
```ts
interface CardState {
  mainCard: VirtualCard | null;
  tempCards: VirtualCard[];
  isLoading: boolean;
}
// Actions: fetchCards(), createMainCard(), createTempCard(), generateQR()
```

### ContractContext
```ts
interface ContractState {
  contracts: Contract[];
  isLoading: boolean;
}
// Actions: fetchContracts(), sendContract(), respondToContract()
```

### InboxContext
```ts
interface InboxState {
  recent: Partial<Contract>[];
  history: Partial<Contract>[];
  unreadCount: number;
  isLoading: boolean;
}
// Actions: fetchInbox(), respondToInboxContract()
```

---

## 9. Component Library Plan

### UI Primitives

| Component | Props | Description |
|-----------|-------|-------------|
| `Button` | `variant` (primary/ghost/danger), `size`, `loading`, `onPress` | Gradient primary, outlined ghost, red danger |
| `Input` | `label`, `error`, `secureTextEntry`, `leftIcon` | Styled text input with error state |
| `Badge` | `status` (active/inactive/pending/suspended/closed/accepted/declined) | Coloured status pill |
| `GradientCard` | `colors`, `style` | Blue-purple gradient container |
| `GlassCard` | `style` | Frosted glass surface using `expo-blur` |
| `Skeleton` | `width`, `height`, `borderRadius` | Animated shimmer loading placeholder |
| `ScreenWrapper` | `scrollable`, `padded` | Safe area + optional scroll container |

### Reusable Patterns

- **Section header** with optional "See All" link
- **Empty state** component with icon + message + optional CTA
- **Confirmation modal** (destructive actions)
- **Bottom sheet** (QR code, date pickers, card creation choice)
- **Toast / snackbar** notifications

---

## 10. Onboarding Flow

```
App Launch
    │
    ▼
SplashScreen (1.5s)
    │
    ├── Has valid stored token? ──YES──► HomeScreen (via AppDrawer)
    │
    └── NO
        │
        ▼
    LoginScreen
        │
        ├── "Register" link ──► RegisterScreen ──► Auto-login ──► HomeScreen
        │
        └── Login ──► HomeScreen
```

**SplashScreen design:**
- Full-screen deep blue-to-purple gradient
- "TransAct" wordmark fades + scales in (Reanimated: `withSpring` + `withTiming`)
- Subtitle: "Your money. Your rules." fades in 300ms after logo
- No loading spinner — clean and fast

---

## 11. Animations & Interactions

### 11.1 Core Animation Library
- **React Native Reanimated v3** — all layout animations, transitions
- **React Native Gesture Handler v2** — gestures, drag interactions

### 11.2 Planned Animations

| Animation | Where | Implementation |
|-----------|-------|---------------|
| Splash logo entrance | SplashScreen | `withSpring` scale + `withTiming` opacity |
| Screen transitions | All navigations | Shared element transitions, slide + fade |
| Drawer open/close | Drawer | `withSpring` translateX + `withTiming` overlay opacity |
| Balance count-up | HomeScreen, AccountScreen | Animated number interpolation |
| Card tile press feedback | CardsScreen | `withSpring` scale down to 0.97 on press |
| PAN reveal | CardDetailScreen | Blur → unblur with `withTiming` + blur intensity |
| Contract step progress | CreateContractScreen | Animated width bar, dot fill |
| Inbox item swipe | InboxScreen | Horizontal swipe with reveal action (Gesture Handler) |
| Accept/Decline buttons | ContractReviewScreen | Scale bounce on press |
| Status badge pulse | Pending badges | Looped opacity pulse |
| Form input focus ring | All inputs | Animated border-colour transition |
| Bottom sheet | QR, date pickers | Spring-based vertical translation |
| Skeleton shimmer | Loading states | Linear gradient shimmer loop |
| FAB press | CardsScreen, ContractsScreen | Rotation + expand animation |

### 11.3 iOS-Style Drag-and-Drop
Used primarily on the **Cards screen** to reorder virtual cards.

**Implementation plan:**
- Use `react-native-gesture-handler` `LongPressGestureHandler` to initiate drag
- While dragging: card lifts (shadow increases, slight scale-up to 1.05)
- Other cards animate out of the way using `withSpring` layout animations
- Drop: card snaps to new position with `withSpring`
- Haptic feedback via `expo-haptics` on pickup and drop
- Visual indicator: dragged card has a glowing blue border

```tsx
// Concept: drag-and-drop card reordering
<LongPressGestureHandler onActivated={handleDragStart}>
  <Animated.View style={[cardStyle, draggingStyle]}>
    <VirtualCardTile ... />
  </Animated.View>
</LongPressGestureHandler>
```

---

## 12. Contract Form Design

The contract creation screen is a **multi-step form** that combines financial precision with a game-like progression feel.

### Visual Design
- **Step indicator:** Row of 5 numbered dots at top; active dot fills with gradient + glows
- **Card-based sections:** Each step is a `GlassCard` with a section title
- **Navigation:** "Next" (gradient) + "Back" (ghost) buttons at bottom
- **Progress:** Subtle horizontal progress bar under the step dots

### Step Breakdown

#### Step 1 — Parties
```
┌────────────────────────────────┐
│  From (You)                    │
│  ┌──────────────────────────┐  │
│  │ 🔒  john_doe_92          │  │  ← pre-filled, locked, styled distinctly
│  └──────────────────────────┘  │
│                                │
│  To (Receivers)                │
│  ┌──────────────────────────┐  │
│  │  + Enter username        │  │
│  └──────────────────────────┘  │
│  [+ Add another receiver]      │
│                                │
│  Contract Type                 │
│  [One-Time] [Existing User]    │  ← pill toggle
└────────────────────────────────┘
```

#### Step 2 — Split Agreement
```
┌────────────────────────────────┐
│  Split by: [%] [Amount]        │  ← segmented control
│                                │
│  You        [  25  ] %         │
│  receiver1  [  50  ] %         │
│  receiver2  [  25  ] %         │
│                                │
│  ████████░░░░░░░░              │  ← visual split bar
│  You 25%  |  Others 75%        │
└────────────────────────────────┘
```

#### Step 3 — Time Agreement
```
┌────────────────────────────────┐
│  Contract Period               │
│                                │
│  From                          │
│  ┌──────────────────────────┐  │
│  │  📅  January 15, 2026    │  │  ← taps to open calendar picker
│  └──────────────────────────┘  │
│                                │
│  To                            │
│  ┌──────────────────────────┐  │
│  │  📅  March 31, 2026      │  │
│  └──────────────────────────┘  │
│                                │
│  Duration: 2 months, 16 days   │  ← auto-calculated
└────────────────────────────────┘
```

#### Step 4 — Optional Conditions
```
┌────────────────────────────────┐
│  Repayment Condition  [toggle] │
│  ┌──────────────────────────┐  │
│  │  e.g. Monthly on the 1st │  │
│  └──────────────────────────┘  │
│                                │
│  Event Trigger       [toggle]  │
│  ┌──────────────────────────┐  │
│  │  e.g. Invoice received   │  │
│  └──────────────────────────┘  │
│                                │
│  Location            [toggle]  │
│  ┌──────────────────────────┐  │
│  │  e.g. UK only            │  │
│  └──────────────────────────┘  │
└────────────────────────────────┘
```

#### Step 5 — Review & Send
- Full read-only summary of all entered data
- Each section is a collapsible row
- "Send Contract" — full-width gradient button with send animation

---

## 13. Virtual Card Design

### Card Tile (flat, list view)
```
┌─────────────────────────────────────────┐
│  ●●●● ●●●● ●●●● 4821    [MAIN]         │
│  John Doe                    12/27      │
│  GBP  •  Active                        │
└─────────────────────────────────────────┘
```

- Background: subtle gradient (blue-900 → purple-900)
- PAN: Space Mono font, spaced out, dots masked
- Type badge: top-right pill — "MAIN" (blue) or "TEMP" (purple)
- Status: small green/red/yellow dot
- Tap → CardDetailScreen

### Card Detail
- Larger version of the tile
- "Reveal PAN" toggle → animated blur removal
- CVC field masked, tap to reveal
- "Generate QR" button → bottom sheet

### QR Sheet
- Dark bottom sheet sliding up
- Centred QR code (`react-native-qrcode-svg`)
- "Share" and "Close" buttons
- Caption: "Point camera to share card details securely"
- QR encodes JWT token containing `{ pan, expiry }`

---

## 14. Backend Data Models Reference

### User
```ts
{ id: uuid, role: 'user'|'admin', user_type: 'default'|'completed',
  name: string, surname: string, mobile_number: string,
  user_name: string, email: string, password: string,
  accounts: string[], inbox: Inbox }
```

### Account (MongoDB)
```ts
{ accountNumber: number, fullName: string, pan: string,
  ledger_balance: number, available_balance: number, hold: number,
  currency: string, expiry: string, status: AccountStatus,
  mainVirtualCard: string, tempVirtualCard: string[],
  transactions: ObjectId[], customer: ObjectId }
```

### VirtualCard
```ts
{ id: uuid, card_type: 'main'|'temporary', full_name: string,
  pan: string, account_number: number, CVC: string,
  expiry: string, expiry_time: string|null, billing_address: string,
  account_users: string[]|null, qr_token: string }
```

### Contract
```ts
{ id: uuid, contract_type: 'one_time'|'existing_user',
  sender: string, receiver: string[],
  split_agreement: 'percentage'|'amount',
  contract_status: 'accepted'|'declined'|'failed'|'pending',
  time_agreement: string, sender_percentage: number,
  receiver_percentage: number[], sender_amount: number,
  receiver_amount: number[], repayment_agreement: string|null,
  event_agreement: string|null, location_agreement: string|null }
```

### Inbox
```ts
{ id: uuid, most_recent: Partial<Contract>[],
  history: Partial<Contract>[], user: User, contract: Contract }
```

### Transaction (placeholder)
```ts
{ id: uuid, available_balance: decimal, status: string,
  amount: decimal, timestamp: Date, contract: Contract }
```

---

## 15. Development Phases

### Phase 1 — Foundation (Week 1)
- [ ] Expo project initialisation
- [ ] NativeWind v4 configuration
- [ ] Navigation setup (Drawer + Stacks)
- [ ] Design system: colours, typography constants
- [ ] UI primitives: Button, Input, Badge, GradientCard, ScreenWrapper
- [ ] Axios instance + interceptors
- [ ] AuthContext + SecureStore token management
- [ ] SplashScreen
- [ ] LoginScreen + RegisterScreen (connected to API)

### Phase 2 — Core Screens (Week 2–3)
- [ ] HomeScreen (dashboard with placeholder data)
- [ ] AccountScreen
- [ ] CardsScreen + CardDetailScreen
- [ ] CreateMainCardScreen + CreateTempCardScreen
- [ ] QR code bottom sheet
- [ ] ProfileScreen
- [ ] DrawerContent (sidebar navigation)

### Phase 3 — Contracts & Inbox (Week 3–4)
- [ ] InboxScreen (recent + history tabs)
- [ ] ContractReviewScreen (accept/decline)
- [ ] ContractsScreen (list + filter chips)
- [ ] ContractDetailScreen
- [ ] CreateContractScreen (5-step form)
- [ ] Contract contexts + API integration

### Phase 4 — Animations & Polish (Week 4–5)
- [ ] Splash entrance animation
- [ ] Drawer slide animation
- [ ] Balance count-up animation
- [ ] Card press feedback
- [ ] PAN reveal blur animation
- [ ] Contract step progress animation
- [ ] Drag-and-drop card reordering
- [ ] Skeleton loading states
- [ ] Toast notifications
- [ ] Bottom sheet animations

### Phase 5 — QA & Refinement (Week 5–6)
- [ ] iOS + Android testing
- [ ] Edge cases (empty states, errors, network failures)
- [ ] Accessibility audit
- [ ] Performance optimisation
- [ ] Final animation tuning

---

## 16. Dependencies

```json
{
  "dependencies": {
    "expo": "~51.0.0",
    "react": "18.2.0",
    "react-native": "0.74.x",
    "nativewind": "^4.0.0",
    "tailwindcss": "^3.4.0",
    "@react-navigation/native": "^6.x",
    "@react-navigation/drawer": "^6.x",
    "@react-navigation/stack": "^6.x",
    "react-native-screens": "~3.31.0",
    "react-native-safe-area-context": "4.10.x",
    "react-native-reanimated": "~3.10.0",
    "react-native-gesture-handler": "~2.16.0",
    "axios": "^1.7.0",
    "react-hook-form": "^7.51.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.3.0",
    "expo-secure-store": "~13.0.0",
    "expo-linear-gradient": "~13.0.0",
    "expo-blur": "~13.0.0",
    "expo-haptics": "~13.0.0",
    "@expo-google-fonts/inter": "^0.2.3",
    "@expo-google-fonts/space-grotesk": "^0.2.3",
    "@expo-google-fonts/space-mono": "^0.2.3",
    "react-native-qrcode-svg": "^6.3.0",
    "react-native-svg": "15.2.0",
    "@react-native-community/datetimepicker": "8.0.x",
    "react-native-reanimated-carousel": "^3.5.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "~18.2.0",
    "@types/react-native": "~0.73.0"
  }
}
```

---

## Notes & Decisions Log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-05-08 | Expo managed workflow | Faster setup, easier builds for cross-platform |
| 2026-05-08 | React Context (no Redux) | App complexity doesn't justify Redux overhead |
| 2026-05-08 | Flat card list (no flip animation) | Cleaner, faster UX for card management |
| 2026-05-08 | Side drawer navigation | Requested by user; suits multi-section app |
| 2026-05-08 | Transactions screen skipped | Backend module not yet implemented (pending Kafka) |
| 2026-05-08 | Dark-mode first design | Aligns with gaming-inspired aesthetic |
| 2026-05-08 | Sender pre-filled from auth | Auto-populated from logged-in user's username |

---

*Last updated: 2026-05-08 | TransAct v0.1 — Planning Stage*
