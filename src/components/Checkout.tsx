import { useState } from 'react';
import { ArrowLeft, CreditCard, Lock, CheckCircle, AlertTriangle, WifiOff } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductContext';
import { ordersAPI } from '@/services/api';

interface CheckoutProps {
  onBack: () => void;
}

export function Checkout({ onBack }: CheckoutProps) {
  const { items, totalPrice, clearCart } = useCart();
  const { deductStockForOrder } = useProducts();
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });

  const generateDemoInvoiceNumber = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `INV-${date}-${random}`;
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Prepare order data
      const orderData = {
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: formData.address,
        total_amount: totalPrice,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      };
      
      // Try to send order to backend
      let orderIdGenerated: string;
      try {
        const response = await ordersAPI.create(orderData);
        orderIdGenerated = response.id;
        setOrderId(response.id);
        setInvoiceNumber(response.invoice_number);
        setDemoMode(false);
      } catch (apiError: any) {
        // Backend not available - use demo mode
        console.log('Backend not available, using demo mode');
        setDemoMode(true);
        orderIdGenerated = 'demo-' + Math.random().toString(36).substring(2, 10);
        setOrderId(orderIdGenerated);
        const invoiceNum = generateDemoInvoiceNumber();
        setInvoiceNumber(invoiceNum);
        
        // Deduct stock for demo mode
        await deductStockForOrder(items.map(item => ({ id: item.id, quantity: item.quantity })));
        
        // Save order to localStorage for admin panel
        const newOrder = {
          id: orderIdGenerated,
          invoice_number: invoiceNum,
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          customer_phone: orderData.customer_phone,
          customer_address: orderData.customer_address,
          total_amount: orderData.total_amount,
          status: 'pending',
          items: orderData.items,
          created_at: new Date().toISOString()
        };
        
        const existingOrders = JSON.parse(localStorage.getItem('missjane_orders') || '[]');
        existingOrders.unshift(newOrder);
        localStorage.setItem('missjane_orders', JSON.stringify(existingOrders.slice(0, 100)));
        
        // Add notification for new order
        const existingNotifications = JSON.parse(localStorage.getItem('missjane_notifications') || '[]');
        existingNotifications.unshift({
          id: Date.now(),
          type: 'new_order',
          title: `New Order #${orderIdGenerated.slice(-4).toUpperCase()}`,
          message: `New order from ${orderData.customer_name} - R ${orderData.total_amount.toLocaleString()}`,
          reference_id: orderIdGenerated,
          is_read: 0,
          created_at: new Date().toISOString()
        });
        localStorage.setItem('missjane_notifications', JSON.stringify(existingNotifications.slice(0, 50)));
      }
      
      // Clear cart after successful order
      clearCart();
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-[#F6F7F9] pt-24 pb-12 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold">Your cart is empty</h2>
          <p className="text-gray-600 mt-2">
            Add some products before checking out
          </p>
          <button onClick={onBack} className="btn-primary mt-6">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9] pt-20 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-black"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to shop
          </button>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Secure checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {step === 'success' ? (
          <div className="bg-white rounded-[28px] p-8 lg:p-12 text-center">
            <CheckCircle className="w-20 h-20 text-[#7CE2B8] mx-auto mb-6" />
            <h2 className="text-2xl lg:text-3xl font-semibold">
              Order confirmed!
            </h2>
            
            {demoMode && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4 max-w-md mx-auto">
                <div className="flex items-center gap-2 justify-center">
                  <WifiOff className="w-5 h-5 text-amber-600" />
                  <p className="text-amber-800 text-sm font-medium">Demo Mode</p>
                </div>
                <p className="text-amber-700 text-xs mt-1">
                  Backend server not connected. In production, this would send a real invoice.
                </p>
              </div>
            )}
            
            <p className="text-gray-500 mt-2">
              Order ID: <span className="font-mono">#{orderId?.slice(0, 8).toUpperCase()}</span>
            </p>
            {invoiceNumber && (
              <p className="text-gray-500 mt-1">
                Invoice: <span className="font-mono">{invoiceNumber}</span>
              </p>
            )}
            <p className="text-gray-600 mt-4 max-w-md mx-auto">
              Thank you for your order. We've sent a confirmation email to <strong>{formData.email}</strong> and will
              process your prescription request shortly.
            </p>
            
            {!demoMode && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6 max-w-md mx-auto">
                <p className="text-green-800 text-sm">
                  <strong>Stock Updated:</strong> Your order has been deducted from our inventory.
                </p>
              </div>
            )}
            
            <div className="mt-8 p-4 bg-gray-50 rounded-xl max-w-md mx-auto text-left">
              <h4 className="font-semibold mb-2">Order Summary</h4>
              {items.length === 0 ? (
                <p className="text-sm text-gray-500">Cart cleared</p>
              ) : (
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>R {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>R {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <button onClick={onBack} className="btn-primary mt-8">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Order Summary */}
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-[28px] p-6 lg:p-8">
                <h3 className="font-semibold text-lg mb-6">Order Summary</h3>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-gray-500 text-xs">
                          Qty: {item.quantity}
                        </p>
                        {item.stock < 10 && (
                          <p className="text-amber-600 text-xs mt-1">
                            Only {item.stock} left in stock
                          </p>
                        )}
                      </div>
                      <span className="font-medium">
                        R {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 mt-6 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>R {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg mt-4">
                    <span>Total</span>
                    <span>R {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Payment Form */}
            <div className="order-1 lg:order-2">
              <div className="bg-white rounded-[28px] p-6 lg:p-8">
                <h3 className="font-semibold text-lg mb-6">
                  {step === 'details' ? 'Shipping Details' : 'Payment'}
                </h3>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {step === 'details' ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setStep('payment');
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none resize-none"
                      />
                    </div>
                    <button type="submit" className="btn-primary w-full">
                      Continue to Payment
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="text-amber-800 text-sm">
                        <strong>Demo Mode:</strong> This is a demo checkout. In production,
                        this would integrate with PayFast or Stripe for South African payments.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="4242 4242 4242 4242"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVC
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setStep('details')}
                        className="btn-secondary flex-1"
                      >
                        Back
                      </button>
                      <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-[#111] border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            Pay R {totalPrice.toLocaleString()}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
