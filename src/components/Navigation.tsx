import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface NavigationProps {
  onNavigate: (section: string) => void;
}

export function Navigation({ onNavigate }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Shop', section: 'products' },
    { label: 'How it works', section: 'how-it-works' },
    { label: 'Quality', section: 'quality' },
    { label: 'Education', section: 'guide' },
    { label: 'Contact', section: 'contact' },
  ];

  const handleNavClick = (section: string) => {
    onNavigate(section);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <button
              onClick={() => handleNavClick('hero')}
              className="font-semibold text-lg lg:text-xl tracking-tight"
            >
              Miss Jane
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.section}
                  onClick={() => handleNavClick(link.section)}
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline">Cart ({totalItems})</span>
              </button>
              
              <button
                onClick={() => handleNavClick('contact')}
                className="hidden sm:block btn-primary text-sm py-2 px-4"
              >
                Book a consult
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.section}
                  onClick={() => handleNavClick(link.section)}
                  className="block w-full text-left py-2 text-sm font-medium text-gray-600"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => handleNavClick('contact')}
                className="btn-primary w-full text-center mt-4"
              >
                Book a consult
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
