import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Settings } from 'lucide-react';

import { CartProvider } from '@/context/CartContext';
import { ProductProvider } from '@/context/ProductContext';
import { Navigation } from '@/components/Navigation';
import { CartDrawer } from '@/components/CartDrawer';
import { Checkout } from '@/components/Checkout';
import { AdminDashboard } from '@/components/AdminDashboard';
import { Footer } from '@/components/Footer';

import { Hero } from '@/sections/Hero';
import { HowItWorks } from '@/sections/HowItWorks';
import { ShopByForm } from '@/sections/ShopByForm';
import { Products } from '@/sections/Products';
import { Quality } from '@/sections/Quality';
import { Conditions } from '@/sections/Conditions';
import { PatientGuide } from '@/sections/PatientGuide';
import { Testimonials } from '@/sections/Testimonials';
import { Contact } from '@/sections/Contact';

import './App.css';

gsap.registerPlugin(ScrollTrigger);

type View = 'home' | 'checkout' | 'admin';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Refresh ScrollTrigger when view changes
    if (currentView === 'home') {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [currentView]);

  const handleNavigate = (section: string) => {
    setCurrentView('home');
    setTimeout(() => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleCheckout = () => {
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromCheckout = () => {
    setCurrentView('home');
  };

  if (currentView === 'checkout') {
    return (
      <CartProvider>
        <ProductProvider>
          <Checkout onBack={handleBackFromCheckout} />
        </ProductProvider>
      </CartProvider>
    );
  }

  if (currentView === 'admin') {
    return (
      <CartProvider>
        <ProductProvider>
          <AdminDashboard onBack={handleBackFromCheckout} />
        </ProductProvider>
      </CartProvider>
    );
  }

  return (
    <CartProvider>
      <ProductProvider>
        <div ref={mainRef} className="relative min-h-screen bg-[#F6F7F9]">
          {/* Grain Overlay */}
          <div className="grain-overlay" />

          {/* Navigation */}
          <Navigation onNavigate={handleNavigate} />

          {/* Cart Drawer */}
          <CartDrawer onCheckout={handleCheckout} />

          {/* Admin Access Button */}
          <button
            onClick={() => setCurrentView('admin')}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-[#7CE2B8] hover:bg-[#6dd3a9] rounded-full flex items-center justify-center shadow-lg transition-all"
            title="Admin Panel"
          >
            <Settings className="w-5 h-5 text-[#111]" />
          </button>

          {/* Main Content */}
          <main>
            <Hero onNavigate={handleNavigate} />
            <HowItWorks onNavigate={handleNavigate} />
            <ShopByForm onNavigate={handleNavigate} />
            <Products onNavigate={handleNavigate} />
            <Quality onNavigate={handleNavigate} />
            <Conditions onNavigate={handleNavigate} />
            <PatientGuide onNavigate={handleNavigate} />
            <Testimonials />
            <Contact />
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </ProductProvider>
    </CartProvider>
  );
}

export default App;
