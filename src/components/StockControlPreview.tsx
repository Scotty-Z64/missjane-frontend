import { useState } from 'react';
import { 
  Mail, 
  Bell, 
  Smartphone, 
  Monitor,
  AlertTriangle,
  Package,
  ShoppingCart,
  CheckCircle,
  Clock,
  ChevronRight,
  X
} from 'lucide-react';

interface StockControlPreviewProps {
  onClose: () => void;
}

export function StockControlPreview({ onClose }: StockControlPreviewProps) {
  const [activeView, setActiveView] = useState<'email' | 'dashboard' | 'mobile'>('email');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[28px] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#0B1E1D] text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Stock Control Preview</h2>
              <p className="text-gray-400 mt-1">
                See exactly what your stock control team will receive
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* View Tabs */}
          <div className="flex gap-2 mt-6">
            <ViewTab 
              id="email" 
              label="Email Notifications" 
              icon={Mail}
              active={activeView === 'email'}
              onClick={() => setActiveView('email')}
            />
            <ViewTab 
              id="dashboard" 
              label="Web Dashboard" 
              icon={Monitor}
              active={activeView === 'dashboard'}
              onClick={() => setActiveView('dashboard')}
            />
            <ViewTab 
              id="mobile" 
              label="Mobile View" 
              icon={Smartphone}
              active={activeView === 'mobile'}
              onClick={() => setActiveView('mobile')}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          {activeView === 'email' && <EmailPreview />}
          {activeView === 'dashboard' && <DashboardPreview />}
          {activeView === 'mobile' && <MobilePreview />}
        </div>
      </div>
    </div>
  );
}

function ViewTab({ label, icon: Icon, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        active 
          ? 'bg-[#7CE2B8] text-[#111]' 
          : 'bg-white/10 text-gray-300 hover:bg-white/20'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

// Email Notification Preview
function EmailPreview() {
  const [selectedEmail, setSelectedEmail] = useState<'new-order' | 'low-stock'>('new-order');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Email Selection */}
      <div className="lg:col-span-1 space-y-3">
        <h3 className="font-semibold text-gray-700 mb-4">Email Types</h3>
        
        <button
          onClick={() => setSelectedEmail('new-order')}
          className={`w-full text-left p-4 rounded-xl border transition-all ${
            selectedEmail === 'new-order'
              ? 'border-[#7CE2B8] bg-[#7CE2B8]/10'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium">New Order</p>
              <p className="text-sm text-gray-500">Sent when customer places order</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setSelectedEmail('low-stock')}
          className={`w-full text-left p-4 rounded-xl border transition-all ${
            selectedEmail === 'low-stock'
              ? 'border-[#7CE2B8] bg-[#7CE2B8]/10'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium">Low Stock Alert</p>
              <p className="text-sm text-gray-500">Sent when stock runs low</p>
            </div>
          </div>
        </button>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
          <h4 className="font-medium text-blue-800 flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4" />
            Email Configuration
          </h4>
          <p className="text-sm text-blue-700">
            Emails are sent to: <strong>stock@missjane.co.za</strong>
          </p>
          <p className="text-sm text-blue-600 mt-2">
            Configure SMTP settings in the backend .env file
          </p>
        </div>
      </div>

      {/* Email Preview */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
          {/* Email Header */}
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">From:</span>
              <span>Miss Jane &lt;orders@missjane.co.za&gt;</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <span className="font-medium">To:</span>
              <span>Stock Control Room &lt;stock@missjane.co.za&gt;</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-800 mt-1">
              <span className="font-medium">Subject:</span>
              <span className={selectedEmail === 'new-order' ? 'text-green-600' : 'text-red-600'}>
                {selectedEmail === 'new-order' ? 'NEW ORDER: #A1B2C3D4' : 'LOW STOCK ALERT: CBD Relief Oil'}
              </span>
            </div>
          </div>

          {/* Email Body */}
          <div className="p-6">
            {selectedEmail === 'new-order' ? <NewOrderEmail /> : <LowStockEmail />}
          </div>
        </div>
      </div>
    </div>
  );
}

function NewOrderEmail() {
  return (
    <div className="space-y-4">
      <div className="text-center pb-4 border-b border-gray-100">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <ShoppingCart className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-600">NEW ORDER RECEIVED</h2>
        <p className="text-gray-500">Order #{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-700">Customer Details</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p><span className="text-gray-500">Name:</span> <strong>John Smith</strong></p>
          <p><span className="text-gray-500">Email:</span> john.smith@email.com</p>
          <p><span className="text-gray-500">Phone:</span> +27 82 123 4567</p>
          <p><span className="text-gray-500">Address:</span> 123 Main Street, Johannesburg, 2000</p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-700">Order Items</h3>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-3 py-2 text-sm">Product</th>
              <th className="text-center px-3 py-2 text-sm">Qty</th>
              <th className="text-right px-3 py-2 text-sm">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="px-3 py-3">CBD Relief Oil 30ml</td>
              <td className="text-center px-3 py-3">2</td>
              <td className="text-right px-3 py-3">R 1,298</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-3 py-3">Balanced Capsules</td>
              <td className="text-center px-3 py-3">1</td>
              <td className="text-right px-3 py-3">R 580</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="font-bold">
              <td colSpan={2} className="px-3 py-3 text-right">Total:</td>
              <td className="px-3 py-3 text-right text-green-600">R 1,878</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 font-medium flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Action Required: Please prepare this order for shipment
        </p>
      </div>

      <div className="text-center text-gray-400 text-sm pt-4 border-t border-gray-100">
        <p>Miss Jane Stock Management System</p>
        <p>{new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}

function LowStockEmail() {
  return (
    <div className="space-y-4">
      <div className="text-center pb-4 border-b border-gray-100">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-red-600">STOCK CONTROL NOTIFICATION</h2>
        <p className="text-gray-500">Low Stock Alert</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="font-semibold text-red-800 mb-3">Product Details</h3>
        <div className="space-y-2">
          <p><span className="text-red-600">Product:</span> <strong className="text-red-800">CBD Relief Oil 30ml</strong></p>
          <p><span className="text-red-600">Current Stock:</span> <strong className="text-2xl text-red-600">3</strong></p>
          <p><span className="text-red-600">Threshold:</span> <strong>10</strong></p>
          <p><span className="text-red-600">Product ID:</span> <strong>cbd-relief-oil</strong></p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-amber-800 font-medium flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Urgent: Please restock this item as soon as possible
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-gray-700">Recommended Action</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Contact supplier to place new order</li>
          <li>Update expected delivery date</li>
          <li>Check if alternative products are available</li>
        </ul>
      </div>

      <div className="text-center text-gray-400 text-sm pt-4 border-t border-gray-100">
        <p>Miss Jane Stock Management System</p>
        <p>{new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}

// Web Dashboard Preview
function DashboardPreview() {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-medium text-blue-800 flex items-center gap-2">
          <Monitor className="w-4 h-4" />
          Web Dashboard Access
        </h4>
        <p className="text-sm text-blue-700 mt-1">
          Your stock control team can access the dashboard at:<br />
          <strong>https://missjane.co.za/admin</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatCard
          title="Total Products"
          value="24"
          icon={Package}
          color="blue"
        />
        <DashboardStatCard
          title="Low Stock"
          value="3"
          icon={AlertTriangle}
          color="red"
          alert
        />
        <DashboardStatCard
          title="Pending Orders"
          value="5"
          icon={Clock}
          color="orange"
          alert
        />
        <DashboardStatCard
          title="Today's Orders"
          value="12"
          icon={ShoppingCart}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications Panel */}
        <div className="bg-white rounded-[22px] border border-black/5 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-red-50">
            <h3 className="font-semibold flex items-center gap-2 text-red-700">
              <Bell className="w-5 h-5" />
              Live Notifications (3 unread)
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            <NotificationItem
              type="low_stock"
              title="Low Stock Alert"
              message="CBD Relief Oil is low on stock (3 remaining)"
              time="2 minutes ago"
              unread
            />
            <NotificationItem
              type="new_order"
              title="New Order #A1B2C3D4"
              message="New order from John Smith - R 1,878"
              time="15 minutes ago"
              unread
            />
            <NotificationItem
              type="new_order"
              title="New Order #E5F6G7H8"
              message="New order from Sarah Jones - R 720"
              time="1 hour ago"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-[22px] border border-black/5 p-6">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <ActionButton
              icon={Package}
              label="View All Products"
              description="Manage inventory and stock levels"
            />
            <ActionButton
              icon={ShoppingCart}
              label="Process Orders"
              description="5 orders waiting to be processed"
              alert
            />
            <ActionButton
              icon={AlertTriangle}
              label="Low Stock Items"
              description="3 products need restocking"
              alert
            />
            <ActionButton
              icon={Clock}
              label="Stock Movement History"
              description="View all stock changes"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardStatCard({ title, value, icon: Icon, color, alert }: any) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className={`bg-white rounded-[22px] p-6 border border-black/5 ${alert ? 'ring-2 ring-red-200' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-3xl font-semibold mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color as keyof typeof colors]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

function NotificationItem({ type, title, message, time, unread }: any) {
  return (
    <div className={`p-4 flex items-start gap-3 ${unread ? 'bg-white' : 'bg-gray-50'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        type === 'low_stock' ? 'bg-red-100 text-red-600' :
        type === 'new_order' ? 'bg-green-100 text-green-600' :
        'bg-blue-100 text-blue-600'
      }`}>
        {type === 'low_stock' ? <AlertTriangle className="w-5 h-5" /> :
         type === 'new_order' ? <ShoppingCart className="w-5 h-5" /> :
         <Bell className="w-5 h-5" />}
      </div>
      <div className="flex-1">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-sm text-gray-600">{message}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
      {unread && (
        <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2" />
      )}
    </div>
  );
}

function ActionButton({ icon: Icon, label, description, alert }: any) {
  return (
    <button className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-md ${
      alert ? 'border-red-200 bg-red-50 hover:bg-red-100' : 'border-gray-200 bg-white hover:bg-gray-50'
    }`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
        alert ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
      }`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 text-left">
        <p className={`font-medium ${alert ? 'text-red-700' : ''}`}>{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
  );
}

// Mobile App Preview
function MobilePreview() {
  return (
    <div className="flex justify-center">
      <div className="w-[375px] bg-white rounded-[40px] border-8 border-gray-800 overflow-hidden shadow-2xl">
        {/* Mobile Header */}
        <div className="bg-[#0B1E1D] text-white p-4 pt-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs">Stock Control</p>
              <h2 className="font-semibold">Miss Jane</h2>
            </div>
            <div className="relative">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4 space-y-4 max-h-[500px] overflow-auto">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-red-50 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold text-red-600">3</p>
              <p className="text-xs text-red-700">Low Stock</p>
            </div>
            <div className="bg-orange-50 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold text-orange-600">5</p>
              <p className="text-xs text-orange-700">Pending</p>
            </div>
          </div>

          {/* Push Notification Example */}
          <div className="bg-gray-100 rounded-2xl p-3">
            <p className="text-xs text-gray-500 mb-2">Push Notification Preview</p>
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Miss Jane</p>
                  <p className="text-sm">Low Stock Alert: CBD Relief Oil (3 remaining)</p>
                  <p className="text-xs text-gray-400 mt-1">Now</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Notifications */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Recent Notifications</h3>
            <div className="space-y-2">
              <MobileNotification
                icon={AlertTriangle}
                iconColor="red"
                title="Low Stock"
                message="CBD Relief Oil - 3 left"
                time="2m ago"
              />
              <MobileNotification
                icon={ShoppingCart}
                iconColor="green"
                title="New Order"
                message="#A1B2C3D4 - R 1,878"
                time="15m ago"
              />
              <MobileNotification
                icon={Package}
                iconColor="blue"
                title="Stock Updated"
                message="THC Night Tincture +50"
                time="1h ago"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button className="w-full bg-[#7CE2B8] text-[#111] py-3 rounded-xl font-medium flex items-center justify-center gap-2">
              <Package className="w-5 h-5" />
              View Inventory
            </button>
            <button className="w-full bg-[#0B1E1D] text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Process Orders (5)
            </button>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <div className="flex justify-around">
            <MobileNavIcon icon={Package} label="Products" active />
            <MobileNavIcon icon={ShoppingCart} label="Orders" />
            <MobileNavIcon icon={Bell} label="Alerts" alert />
            <MobileNavIcon icon={Clock} label="History" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileNotification({ icon: Icon, iconColor, title, message, time }: any) {
  const colors: any = {
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors[iconColor]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-gray-500">{message}</p>
      </div>
      <span className="text-xs text-gray-400">{time}</span>
    </div>
  );
}

function MobileNavIcon({ icon: Icon, label, active, alert }: any) {
  return (
    <button className="flex flex-col items-center gap-1 relative">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        active ? 'bg-[#7CE2B8]' : 'bg-transparent'
      }`}>
        <Icon className={`w-5 h-5 ${active ? 'text-[#111]' : 'text-gray-500'}`} />
      </div>
      <span className={`text-xs ${active ? 'text-[#111] font-medium' : 'text-gray-500'}`}>
        {label}
      </span>
      {alert && (
        <span className="absolute -top-1 right-0 w-3 h-3 bg-red-500 rounded-full" />
      )}
    </button>
  );
}
