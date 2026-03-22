import { Leaf } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B1E1D] text-white py-12 px-6 lg:px-[7vw]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          {/* Logo & Tagline */}
          <div>
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-[#7CE2B8]" />
              <span className="font-semibold text-xl">Miss Jane</span>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Medical cannabis, prescribed with precision.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-8">
            <div>
              <h4 className="font-medium text-sm mb-3">Shop</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#products" className="hover:text-white transition-colors">All Products</a></li>
                <li><a href="#shop-by-form" className="hover:text-white transition-colors">Oils</a></li>
                <li><a href="#shop-by-form" className="hover:text-white transition-colors">Edibles</a></li>
                <li><a href="#shop-by-form" className="hover:text-white transition-colors">Flower</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-3">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#quality" className="hover:text-white transition-colors">Quality</a></li>
                <li><a href="#guide" className="hover:text-white transition-colors">Education</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Prescription Terms</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} Miss Jane. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs text-center sm:text-right">
            Licensed by SAHPRA. For medical use only. Prescription required.
          </p>
        </div>
      </div>
    </footer>
  );
}
