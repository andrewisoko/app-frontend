# TransAct Frontend

A modern, mobile-first financial services application built with React, TypeScript, and Tailwind CSS.

## Features

- 🎨 Beautiful gradient-based UI (blue-purple color system)
- 📱 Mobile-first responsive design
- ✨ Smooth animations with Framer Motion
- 🔐 JWT authentication
- 💳 Virtual card management (main & temporary cards)
- 📥 Card inbox for received cards
- 📄 Interactive contract forms
- 💰 Multiple account support
- 📊 Transaction history with filters
- 👤 User profile management

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool & dev server

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Backend Configuration

The app connects to the backend at `http://localhost:3100` by default.

To change the API base URL, edit `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://your-backend-url'
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Card, Input, etc.)
│   └── animations/     # Animation wrappers
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── layouts/            # Page layouts
├── pages/              # Page components
├── services/           # API service layer
├── App.tsx             # Main app component with routing
├── main.tsx            # App entry point
└── index.css           # Global styles

```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Authentication

The app uses JWT tokens for authentication:

1. User logs in via `/login`
2. Token is stored in localStorage
3. Token is automatically attached to API requests
4. On 401 response, user is redirected to login

## Key Components

### Button
Animated button with multiple variants (primary, secondary, outline, ghost) and loading states.

### Card
Animated card component with hover effects and shadow transitions.

### PageTransition
Smooth page transition wrapper using Framer Motion.

## API Services

All API calls are abstracted in the `src/services/` directory:

- `auth.ts` - Authentication & user management
- `cards.ts` - Virtual card operations
- `inbox.ts` - Received cards management
- `contracts.ts` - Contract CRUD operations
- `accounts.ts` - Account management
- `transactions.ts` - Transaction history

## Design System

### Colors

- **Primary**: Blue gradient (`#3b82f6` to `#2563eb`)
- **Secondary**: Purple gradient (`#a855f7` to `#7e22ce`)
- **Gradient**: Combined blue-purple gradient

### Typography

- System font stack for optimal readability
- Semibold headings
- Medium weight for buttons
- Regular for body text

### Animations

- Page transitions: 300ms ease-in-out
- Button interactions: Scale on tap/hover
- Card hover: Lift effect with shadow
- Loading states: Skeleton loaders

## Mobile Navigation

Bottom tab navigation with 5 main sections:
- Home
- Cards
- Inbox
- Contracts
- Profile

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This project follows strict TypeScript rules:
- No `any` types
- Strict null checks
- Unused variable detection

## License

Proprietary - All rights reserved
