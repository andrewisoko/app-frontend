import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { useAuth } from '@/hooks/useAuth'
import Welcome from '@/pages/Welcome'
import Onboarding from '@/pages/Onboarding'
import Login from '@/pages/Login'
import SignUp from '@/pages/SignUp'
import MainLayout from '@/layouts/MainLayout'
import Home from '@/pages/Home'
import Cards from '@/pages/Cards'
import Inbox from '@/pages/Inbox'
import Contracts from '@/pages/Contracts'
import Accounts from '@/pages/Accounts'
import Transactions from '@/pages/Transactions'
import Profile from '@/pages/Profile'
import SendMoney from '@/pages/SendMoney'
import Transfer from '@/pages/Transfer'
import TopUp from '@/pages/TopUp'
import NewContract from '@/pages/NewContract'
import QrCodeContract from '@/pages/QrCodeContract'
import { LandingPage } from './pages/LandingPage'
import { POSTerminal } from './pages/POSterminal'
import { TerminalProvider } from './contexts/TerminalContext'
import { DraftProvider } from './contexts/PaymentDraftContext'
import QrCodeOnboarding from './pages/QrCodeOnboarding'
import { Notifications } from './pages/Notifications'


function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-primary-600">Loading...</div>
    </div>
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />
  }
  
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-primary-600">Loading...</div>
    </div>
  }
  
  if (isAuthenticated) {
    return <Navigate to="/app" replace />
  }
  
  return <>{children}</>
}

function App() {
  return (
    <AuthProvider>
      <DraftProvider>
    <TerminalProvider>
        <BrowserRouter>
          <Routes>

            <Route path="/welcome" element={
              <PublicRoute>
                <Welcome />
              </PublicRoute>
            } />
             <Route path="/landing" element={
              <PublicRoute>
                <LandingPage/>
              </PublicRoute>
            } />
          
            
             <Route path="/terminal" element={
              <PublicRoute>
                <POSTerminal/>
              </PublicRoute>
            } />

            {/* QR Code Contract - Public route for new users */}
            <Route path="/app/contract/:id" element={
              <QrCodeContract />
            } />

          <Route path="/app/qr-code/new-user/onboarding" 
              element={
                <QrCodeOnboarding/>
              }/>
            
          <Route path="/onboarding" element={
            <PublicRoute>
              <Onboarding />
            </PublicRoute>
          } />
          
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/signup" element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          } />
          
          <Route path="/app" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Home />} />
            <Route path="cards" element={<Cards />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="contracts" element={<Contracts />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="profile" element={<Profile />} />
            <Route path="send" element={<SendMoney />} />
            <Route path="transfer" element={<Transfer />} />
            <Route path="topup" element={<TopUp />} />
            <Route path="contracts/new" element={<NewContract />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          <Route path="/" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </BrowserRouter>
    </TerminalProvider>
    </DraftProvider>
    </AuthProvider>
  )
}

export default App
