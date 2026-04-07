import { CartProvider } from './context/CartContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Bestsellers from './components/Bestsellers'
import HomeSections from './components/HomeSections'
import CartDrawer from './components/CartDrawer'
import FloatingZalo from './components/FloatingZalo'
import AmbientMood from './components/AmbientMood'
import ProductListing from './pages/ProductListing'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import Auth from './pages/Auth'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import BlogFAQ from './pages/BlogFAQ'
import Contact from './pages/Contact'
import Wishlist from './pages/Wishlist'
import './styles/theme.css'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="App">
          <AmbientMood />
          <Navbar />
          <CartDrawer />
          <main>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Hero />
                    <Bestsellers />
                    <HomeSections />
                  </>
                }
              />
              <Route path="/products" element={<ProductListing />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/blog" element={<BlogFAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/wishlist" element={<Wishlist />} />
            </Routes>
          </main>
          <FloatingZalo />
          <footer className="site-footer">
            <p>© 2026 An Hy Candle. All rights reserved.</p>
          </footer>
        </div>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
