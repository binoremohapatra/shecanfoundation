import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import StatsBar from './components/StatsBar'
import AboutStrip from './components/AboutStrip'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboard from './pages/AdminDashboard'

// ── Public Homepage ────────────────────────────────────────────────────────
const HomePage = () => (
  <>
    <Navbar />
    <main id="main-content">
      <HeroSection />
      <StatsBar />
      <AboutStrip />
      <ContactForm />
    </main>
    <Footer />
  </>
)

// ── App with Router ────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontSize: '14px',
            borderRadius: '12px',
          },
        }}
      />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100]
                   focus:bg-flame focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-body"
      >
        Skip to main content
      </a>

      <Routes>
        {/* Public routes */}
        <Route path="/"       element={<HomePage />} />

        {/* Admin routes */}
        <Route path="/admin"            element={<AdminLoginPage />} />
        <Route path="/admin/dashboard"  element={<AdminDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
