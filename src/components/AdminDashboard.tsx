import { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  TrendingUp, 
  Bell,
  ArrowLeft,
  Plus,
  Minus,
  Edit,
  Search,
  Clock,
  RefreshCw,
  Eye,
  Server,
  Truck,
  X,
  Trash2,
  Save,
  CheckCircle
} from 'lucide-react';
// API imports available for future backend integration
import { StockControlPreview } from './StockControlPreview';

interface AdminDashboardProps {
  onBack: () => void;
}

// Demo data for when backend is not available
const demoStats = {
  total_products: 6,
  low_stock_products: 2,
  total_orders: 15,
  pending_orders: 3,
  today_orders: 2,
  total_revenue: 15840,
  unread_notifications: 4
};

const demoOrders = [
  {
    id: 'ord-001',
    customer_name: 'John Smith',
    customer_email: 'john@email.com',
    customer_phone: '+27 82 123 4567',
    customer_address: '123 Main St, Johannesburg',
    total_amount: 1298,
    status: 'pending',
    created_at: new Date().toISOString(),
    items: [
      { product_name: 'CBD Relief Oil 30ml', quantity: 2, price: 649 }
    ]
  },
  {
    id: 'ord-002',
    customer_name: 'Sarah Jones',
    customer_email: 'sarah@email.com',
    customer_phone: '+27 83 456 7890',
    customer_address: '456 Oak Ave, Cape Town',
    total_amount: 720,
    status: 'processing',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    items: [
      { product_name: 'THC Night Tincture', quantity: 1, price: 720 }
    ]
  },
  {
    id: 'ord-003',
    customer_name: 'Mike Brown',
    customer_email: 'mike@email.com',
    customer_phone: '+27 84 789 0123',
    customer_address: '789 Pine Rd, Durban',
    total_amount: 580,
    status: 'shipped',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    items: [
      { product_name: 'Balanced Capsules', quantity: 1, price: 580 }
    ]
  }
];

const demoNotifications = [
  {
    id: 1,
    type: 'low_stock',
    title: 'Low Stock Alert',
    message: 'CBD Relief Oil is low on stock (3 remaining)',
    reference_id: 'cbd-relief-oil',
    is_read: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    type: 'new_order',
    title: 'New Order #ORD-001',
    message: 'New order from John Smith - R 1,298',
    reference_id: 'ord-001',
    is_read: 0,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 3,
    type: 'low_stock',
    title: 'Low Stock Alert',
    message: 'Indica Flower is low on stock (5 remaining)',
    reference_id: 'indica-flower',
    is_read: 1,
    created_at: new Date(Date.now() - 7200000).toISOString()
  }
];

// Initial products
const initialProducts = [
  {
    id: 'cbd-relief-oil',
    name: 'CBD Relief Oil 30ml',
    description: 'Daytime calm, non-intoxicating.',
    price: 649,
    image: '/images/product_cbd_oil.jpg',
    category: 'oils',
    stock: 25,
    thc: '<0.3%',
    cbd: '1000mg',
    low_stock_threshold: 10
  },
  {
    id: 'thc-night-tincture',
    name: 'THC Night Tincture',
    description: 'Sleep support, low dose.',
    price: 720,
    image: '/images/product_thc_tincture.jpg',
    category: 'oils',
    stock: 18,
    thc: '1000mg',
    cbd: '500mg',
    low_stock_threshold: 10
  },
  {
    id: 'balanced-capsules',
    name: 'Balanced Capsules',
    description: 'Consistent, taste-free.',
    price: 580,
    image: '/images/product_capsules.jpg',
    category: 'capsules',
    stock: 40,
    thc: '25mg',
    cbd: '25mg',
    low_stock_threshold: 15
  },
  {
    id: 'indica-flower',
    name: 'Indica Flower 5g',
    description: 'Evening relaxation.',
    price: 495,
    image: '/images/product_indica.jpg',
    category: 'flower',
    stock: 15,
    thc: '18%',
    cbd: '<1%',
    low_stock_threshold: 5
  },
  {
    id: 'sativa-flower',
    name: 'Sativa Flower 5g',
    description: 'Daytime clarity.',
    price: 495,
    image: '/images/product_sativa.jpg',
    category: 'flower',
    stock: 12,
    thc: '20%',
    cbd: '<1%',
    low_stock_threshold: 5
  },
  {
    id: 'microdose-mints',
    name: 'Microdose Mints',
    description: 'Discreet, predictable.',
    price: 320,
    image: '/images/product_mints.jpg',
    category: 'edibles',
    stock: 50,
    thc: '2mg',
    cbd: '5mg',
    low_stock_threshold: 20
  }
];

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'stock' | 'notifications'>('dashboard');
  const [stats, setStats] = useState<any>(demoStats);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stockMovements, setStockMovements] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [useBackend] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedProducts = localStorage.getItem('missjane_products');
    const storedMovements = localStorage.getItem('missjane_stock_movements');
    const storedOrders = localStorage.getItem('missjane_orders');
    const storedNotifications = localStorage.getItem('missjane_notifications');
    
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      // Initialize with default products
      setProducts(initialProducts);
      localStorage.setItem('missjane_products', JSON.stringify(initialProducts));
    }
    
    if (storedMovements) {
      setStockMovements(JSON.parse(storedMovements));
    }
    
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      // Initialize with demo orders if none exist
      setOrders(demoOrders);
      localStorage.setItem('missjane_orders', JSON.stringify(demoOrders));
    }
    
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    } else {
      // Initialize with demo notifications if none exist
      setNotifications(demoNotifications);
      localStorage.setItem('missjane_notifications', JSON.stringify(demoNotifications));
    }
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('missjane_products', JSON.stringify(products));
      updateStats();
    }
  }, [products]);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('missjane_orders', JSON.stringify(orders));
    }
  }, [orders]);

  // Save stock movements to localStorage whenever they change
  useEffect(() => {
    if (stockMovements.length > 0) {
      localStorage.setItem('missjane_stock_movements', JSON.stringify(stockMovements));
    }
  }, [stockMovements]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('missjane_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const updateStats = () => {
    const lowStockCount = products.filter(p => p.stock <= (p.low_stock_threshold || 10)).length;
    setStats((prev: any) => ({
      ...prev,
      total_products: products.length,
      low_stock_products: lowStockCount,
      total_revenue: orders.reduce((sum, o) => sum + (o.total_amount || 0), 0),
      total_orders: orders.length,
      pending_orders: orders.filter(o => o.status === 'pending').length,
      today_orders: orders.filter(o => {
        const orderDate = new Date(o.created_at).toDateString();
        const today = new Date().toDateString();
        return orderDate === today;
      }).length
    }));
  };

  const refreshData = () => {
    // Reload from localStorage
    const storedProducts = localStorage.getItem('missjane_products');
    const storedMovements = localStorage.getItem('missjane_stock_movements');
    const storedOrders = localStorage.getItem('missjane_orders');
    const storedNotifications = localStorage.getItem('missjane_notifications');
    
    if (storedProducts) setProducts(JSON.parse(storedProducts));
    if (storedMovements) setStockMovements(JSON.parse(storedMovements));
    if (storedOrders) setOrders(JSON.parse(storedOrders));
    if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
  };

  // Product management functions
  const addProduct = (newProduct: any) => {
    const product = {
      ...newProduct,
      id: newProduct.id || `prod-${Date.now()}`,
      low_stock_threshold: newProduct.low_stock_threshold || 10
    };
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (id: string, updates: any) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const adjustStock = (id: string, delta: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const newStock = Math.max(0, product.stock + delta);
    
    // Update product stock
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
    
    // Log stock movement
    const movement = {
      id: Date.now(),
      product_id: id,
      product_name: product.name,
      type: delta > 0 ? 'adjustment' : 'sale',
      quantity: delta,
      previous_stock: product.stock,
      new_stock: newStock,
      notes: delta > 0 ? 'Manual stock increase' : 'Manual stock decrease',
      created_at: new Date().toISOString()
    };
    
    setStockMovements(prev => [movement, ...prev].slice(0, 100));
  };

  const stockIn = (id: string, quantity: number, supplier: string, notes?: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const newStock = product.stock + quantity;
    
    // Update product stock
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
    
    // Log stock movement
    const movement = {
      id: Date.now(),
      product_id: id,
      product_name: product.name,
      type: 'stock_in',
      quantity: quantity,
      previous_stock: product.stock,
      new_stock: newStock,
      notes: `Stock received from ${supplier}${notes ? ' - ' + notes : ''}`,
      created_at: new Date().toISOString()
    };
    
    setStockMovements(prev => [movement, ...prev].slice(0, 100));
  };

  // Order management functions
  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  // Notification functions
  const markNotificationAsRead = (notificationId: number) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, is_read: 1 } : n));
  };

  const clearAllNotifications = () => {
    if (confirm('Clear all notifications?')) {
      setNotifications([]);
    }
  };

  if (showPreview) {
    return <StockControlPreview onClose={() => setShowPreview(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg sm:text-xl font-semibold">Miss Jane Admin</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 px-3 py-2 bg-[#7CE2B8] text-[#111] rounded-full text-sm font-medium hover:bg-[#6dd3a9] transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview Team View</span>
              </button>
              <button 
                onClick={refreshData}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full text-sm">
                <Server className="w-4 h-4" />
                <span className="hidden sm:inline">{useBackend ? 'Backend' : 'Local'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 sm:px-6 border-t border-gray-100">
          <nav className="flex gap-1 sm:gap-6 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'orders', label: 'Orders', icon: ShoppingCart },
              { id: 'stock', label: 'Stock', icon: RefreshCw },
              { id: 'notifications', label: 'Notifications', icon: Bell },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#7CE2B8] text-[#111]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardTab 
              stats={stats} 
              orders={orders.slice(0, 5)} 
              products={products}
            />
          )}
          {activeTab === 'products' && (
            <ProductsTab 
              products={products} 
              onAddProduct={addProduct}
              onUpdateProduct={updateProduct}
              onDeleteProduct={deleteProduct}
              onAdjustStock={adjustStock}
              onStockIn={stockIn}
            />
          )}
          {activeTab === 'orders' && (
            <OrdersTab 
              orders={orders} 
              onUpdateStatus={updateOrderStatus}
            />
          )}
          {activeTab === 'stock' && (
            <StockTab 
              stockMovements={stockMovements} 
              products={products} 
            />
          )}
          {activeTab === 'notifications' && (
            <NotificationsTab 
              notifications={notifications}
              onMarkAsRead={markNotificationAsRead}
              onClearAll={clearAllNotifications}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// Dashboard Tab
function DashboardTab({ stats, orders, products }: { stats: any; orders: any[]; products: any[] }) {
  const lowStockProducts = products.filter(p => p.stock <= (p.low_stock_threshold || 10));

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Products"
          value={stats?.total_products || 0}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Low Stock"
          value={stats?.low_stock_products || 0}
          icon={AlertTriangle}
          color="red"
          alert={(stats?.low_stock_products || 0) > 0}
        />
        <StatCard
          title="Total Orders"
          value={stats?.total_orders || 0}
          icon={ShoppingCart}
          color="green"
        />
        <StatCard
          title="Pending"
          value={stats?.pending_orders || 0}
          icon={Clock}
          color="orange"
        />
      </div>

      {/* Low Stock & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Low Stock Alert */}
        <div className="bg-white rounded-[22px] border border-black/5 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Low Stock Alert ({lowStockProducts.length} items)
            </h3>
          </div>
          {lowStockProducts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p className="text-green-600">All products are well-stocked!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-semibold">{product.stock} remaining</p>
                    <p className="text-xs text-gray-500">Threshold: {product.low_stock_threshold || 10}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-[22px] border border-black/5 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
              <ShoppingCart className="w-5 h-5 text-[#7CE2B8]" />
              Recent Orders
            </h3>
            <span className="text-xs text-gray-500">{orders.filter(o => o.status === 'pending').length} pending</span>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-sm">#{order.id.slice(-4).toUpperCase()}</p>
                  <p className="text-xs text-gray-500">{order.customer_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">R {order.total_amount?.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-center text-gray-500 py-8">No orders yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="bg-white rounded-[22px] border border-black/5 p-4 sm:p-6">
        <h3 className="font-semibold mb-4 text-sm sm:text-base">Revenue Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <p className="text-xl sm:text-2xl font-semibold">R {stats?.total_revenue?.toLocaleString() || 0}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Today's Orders</p>
            <p className="text-xl sm:text-2xl font-semibold">{stats?.today_orders || 0}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Average Order</p>
            <p className="text-xl sm:text-2xl font-semibold">
              R {stats?.total_orders > 0 ? Math.round(stats.total_revenue / stats.total_orders).toLocaleString() : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, alert }: any) {
  const colorClasses: any = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className={`bg-white rounded-[22px] p-4 sm:p-6 border border-black/5 ${alert ? 'ring-2 ring-red-200' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-xs sm:text-sm">{title}</p>
          <p className="text-xl sm:text-3xl font-semibold mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  );
}

// Products Tab
function ProductsTab({ 
  products, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct, 
  onAdjustStock, 
  onStockIn 
}: { 
  products: any[]; 
  onAddProduct: (product: any) => void;
  onUpdateProduct: (id: string, updates: any) => void;
  onDeleteProduct: (id: string) => void;
  onAdjustStock: (id: string, delta: number) => void;
  onStockIn: (id: string, quantity: number, supplier: string, notes?: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [stockInProduct, setStockInProduct] = useState<any>(null);
  const [stockInQuantity, setStockInQuantity] = useState('');
  const [stockInSupplier, setStockInSupplier] = useState('');
  const [stockInNotes, setStockInNotes] = useState('');

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'oils',
    thc: '',
    cbd: '',
    image: '/images/product_cbd_oil.jpg'
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert('Please fill in all required fields (Name, Price, Stock)');
      return;
    }

    onAddProduct({
      ...newProduct,
      price: parseInt(newProduct.price),
      stock: parseInt(newProduct.stock),
      id: `prod-${Date.now()}`
    });

    setNewProduct({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: 'oils',
      thc: '',
      cbd: '',
      image: '/images/product_cbd_oil.jpg'
    });
    setShowAddModal(false);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct.name || !editingProduct.price) {
      alert('Please fill in all required fields');
      return;
    }

    onUpdateProduct(editingProduct.id, {
      name: editingProduct.name,
      description: editingProduct.description,
      price: parseInt(editingProduct.price),
      stock: parseInt(editingProduct.stock),
      category: editingProduct.category,
      thc: editingProduct.thc,
      cbd: editingProduct.cbd,
      low_stock_threshold: parseInt(editingProduct.low_stock_threshold) || 10
    });

    setEditingProduct(null);
  };

  const handleStockInSubmit = () => {
    if (!stockInProduct || !stockInQuantity || !stockInSupplier) {
      alert('Please fill in all required fields');
      return;
    }

    const quantity = parseInt(stockInQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    onStockIn(stockInProduct.id, quantity, stockInSupplier, stockInNotes);

    setStockInProduct(null);
    setStockInQuantity('');
    setStockInSupplier('');
    setStockInNotes('');
  };

  return (
    <div className="space-y-4">
      {/* Search & Add */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
          />
        </div>
        <button 
          onClick={() => setShowAddModal(true)} 
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[22px] p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#7CE2B8]" />
                Add New Product
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                  placeholder="e.g., Premium CBD Oil"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none resize-none"
                  rows={2}
                  placeholder="Brief product description..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (R) *</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                    placeholder="e.g., 649"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                    placeholder="e.g., 25"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                >
                  <option value="oils">Oils</option>
                  <option value="capsules">Capsules</option>
                  <option value="flower">Flower</option>
                  <option value="edibles">Edibles</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">THC Content</label>
                  <input
                    type="text"
                    value={newProduct.thc}
                    onChange={(e) => setNewProduct({...newProduct, thc: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                    placeholder="e.g., <0.3%"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CBD Content</label>
                  <input
                    type="text"
                    value={newProduct.cbd}
                    onChange={(e) => setNewProduct({...newProduct, cbd: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                    placeholder="e.g., 1000mg"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button onClick={handleAddProduct} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[22px] p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#7CE2B8]" />
                Edit Product
              </h3>
              <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none resize-none"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (R)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                >
                  <option value="oils">Oils</option>
                  <option value="capsules">Capsules</option>
                  <option value="flower">Flower</option>
                  <option value="edibles">Edibles</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">THC Content</label>
                  <input
                    type="text"
                    value={editingProduct.thc}
                    onChange={(e) => setEditingProduct({...editingProduct, thc: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CBD Content</label>
                  <input
                    type="text"
                    value={editingProduct.cbd}
                    onChange={(e) => setEditingProduct({...editingProduct, cbd: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
                <input
                  type="number"
                  value={editingProduct.low_stock_threshold || 10}
                  onChange={(e) => setEditingProduct({...editingProduct, low_stock_threshold: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                  placeholder="e.g., 10"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditingProduct(null)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button onClick={handleUpdateProduct} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock In Modal */}
      {stockInProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[22px] p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#7CE2B8]" />
                Stock In: {stockInProduct.name}
              </h3>
              <button onClick={() => setStockInProduct(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
                <p className="text-2xl font-semibold">{stockInProduct.stock}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Add *</label>
                <input
                  type="number"
                  min="1"
                  value={stockInQuantity}
                  onChange={(e) => setStockInQuantity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                  placeholder="e.g., 50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier *</label>
                <input
                  type="text"
                  value={stockInSupplier}
                  onChange={(e) => setStockInSupplier(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                  placeholder="e.g., Green Leaf Suppliers"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                  value={stockInNotes}
                  onChange={(e) => setStockInNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none resize-none"
                  rows={2}
                  placeholder="e.g., Batch #12345, Expiry: 2025-12-31"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStockInProduct(null)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button onClick={handleStockInSubmit} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <Truck className="w-4 h-4" />
                  Add Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid (Mobile) */}
      <div className="sm:hidden space-y-3">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl p-4 border border-black/5">
            <div className="flex items-center gap-3 mb-3">
              <img src={product.image || '/placeholder.png'} alt={product.name} className="w-14 h-14 object-cover rounded-lg" />
              <div className="flex-1">
                <p className="font-medium text-sm">{product.name}</p>
                <p className="text-xs text-gray-500">{product.category}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold">R {product.price?.toLocaleString()}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => onAdjustStock(product.id, -1)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200">
                  <Minus className="w-3 h-3" />
                </button>
                <span className={`font-medium w-8 text-center ${product.stock <= (product.low_stock_threshold || 10) ? 'text-red-600' : ''}`}>
                  {product.stock}
                </span>
                <button onClick={() => onAdjustStock(product.id, 1)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setStockInProduct(product)} 
                className="flex-1 py-2 bg-[#7CE2B8] text-[#111] rounded-lg text-sm font-medium flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                Stock In
              </button>
              <button 
                onClick={() => setEditingProduct(product)} 
                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Products Table (Desktop) */}
      <div className="hidden sm:block bg-white rounded-[22px] border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Product</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.image || '/placeholder.png'} alt={product.name} className="w-10 h-10 object-cover rounded-lg" />
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.description?.slice(0, 30)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{product.category}</td>
                  <td className="px-4 py-3 text-sm">R {product.price?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => onAdjustStock(product.id, -1)} className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className={`font-medium w-6 text-center ${product.stock <= (product.low_stock_threshold || 10) ? 'text-red-600' : ''}`}>
                        {product.stock}
                      </span>
                      <button onClick={() => onAdjustStock(product.id, 1)} className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setStockInProduct(product)} 
                        className="p-2 bg-[#7CE2B8] hover:bg-[#6dd3a9] rounded-full"
                        title="Stock In"
                      >
                        <Truck className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setEditingProduct(product)} 
                        className="p-2 hover:bg-gray-100 rounded-full"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDeleteProduct(product.id)} 
                        className="p-2 hover:bg-red-100 rounded-full text-red-500"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Orders Tab
function OrdersTab({ orders, onUpdateStatus }: { orders: any[]; onUpdateStatus: (id: string, status: string) => void }) {
  const [filter, setFilter] = useState('all');
  const [viewingOrder, setViewingOrder] = useState<any>(null);

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'processing', 'shipped', 'delivered'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium capitalize ${
              filter === status ? 'bg-[#7CE2B8] text-[#111]' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Order Detail Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[22px] p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Order #{viewingOrder.id.slice(-4).toUpperCase()}</h3>
              <button onClick={() => setViewingOrder(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">{viewingOrder.customer_name}</p>
                <p className="text-sm text-gray-600">{viewingOrder.customer_email}</p>
                <p className="text-sm text-gray-600">{viewingOrder.customer_phone}</p>
                <p className="text-sm text-gray-600 mt-1">{viewingOrder.customer_address}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Items</p>
                <div className="space-y-2">
                  {(viewingOrder.items || []).map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm">{item.product_name || item.name} x{item.quantity}</span>
                      <span className="text-sm font-medium">R {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between p-4 bg-[#7CE2B8]/10 rounded-xl">
                <span className="font-medium">Total</span>
                <span className="font-semibold">R {viewingOrder.total_amount?.toLocaleString()}</span>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        onUpdateStatus(viewingOrder.id, status);
                        setViewingOrder({...viewingOrder, status});
                      }}
                      className={`px-3 py-2 rounded-full text-sm font-medium capitalize ${
                        viewingOrder.status === status 
                          ? 'bg-[#7CE2B8] text-[#111]' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders List (Mobile) */}
      <div className="sm:hidden space-y-3">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl p-4 border border-black/5">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">#{order.id.slice(-4).toUpperCase()}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">{order.customer_name}</p>
            <p className="text-xs text-gray-400">{order.customer_email}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="font-semibold">R {order.total_amount?.toLocaleString()}</p>
              <button 
                onClick={() => setViewingOrder(order)}
                className="text-sm text-[#7CE2B8] hover:underline"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Table (Desktop) */}
      <div className="hidden sm:block bg-white rounded-[22px] border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Order ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-sm font-medium">#{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm">{order.customer_name}</p>
                      <p className="text-xs text-gray-500">{order.customer_email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">R {order.total_amount?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => setViewingOrder(order)}
                      className="text-sm text-[#7CE2B8] hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Stock Tab
function StockTab({ stockMovements, products }: { stockMovements: any[]; products: any[] }) {
  const lowStockProducts = products.filter(p => p.stock <= (p.low_stock_threshold || 10));

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Low Stock Summary */}
      <div className="bg-red-50 border border-red-200 rounded-[22px] p-4 sm:p-6">
        <h3 className="font-semibold text-red-800 flex items-center gap-2 mb-4 text-sm sm:text-base">
          <AlertTriangle className="w-5 h-5" />
          Low Stock Alert ({lowStockProducts.length} items)
        </h3>
        {lowStockProducts.length === 0 ? (
          <div className="text-center py-4">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
            <p className="text-green-600">All products are well-stocked!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl p-3 sm:p-4">
                <p className="font-medium text-sm">{product.name}</p>
                <p className="text-red-600 font-semibold text-lg">{product.stock} remaining</p>
                <p className="text-xs text-gray-500">Threshold: {product.low_stock_threshold || 10}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stock Movement History */}
      <div className="bg-white rounded-[22px] border border-black/5 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-sm sm:text-base">Stock Movement History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">Product</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">Change</th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">New</th>
              </tr>
            </thead>
            <tbody>
              {stockMovements.slice(0, 20).map((movement) => (
                <tr key={movement.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-xs sm:text-sm text-gray-500">{new Date(movement.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-xs sm:text-sm">{movement.product_name}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      movement.type === 'sale' ? 'bg-green-100 text-green-800' :
                      movement.type === 'stock_in' ? 'bg-blue-100 text-blue-800' :
                      movement.type === 'adjustment' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {movement.type}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-xs sm:text-sm font-medium ${movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                  </td>
                  <td className="px-4 py-3 text-xs sm:text-sm font-medium">{movement.new_stock}</td>
                </tr>
              ))}
              {stockMovements.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No stock movements yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Notifications Tab
function NotificationsTab({ 
  notifications, 
  onMarkAsRead, 
  onClearAll 
}: { 
  notifications: any[]; 
  onMarkAsRead: (id: number) => void;
  onClearAll: () => void;
}) {
  return (
    <div className="bg-white rounded-[22px] border border-black/5 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-sm sm:text-base">Notifications</h3>
        {notifications.length > 0 && (
          <button 
            onClick={onClearAll}
            className="text-sm text-red-500 hover:text-red-600"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="divide-y divide-gray-100">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 flex items-start gap-3 sm:gap-4 ${notification.is_read ? 'bg-gray-50' : 'bg-white'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                notification.type === 'low_stock' ? 'bg-red-100 text-red-600' :
                notification.type === 'new_order' ? 'bg-green-100 text-green-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {notification.type === 'low_stock' ? <AlertTriangle className="w-5 h-5" /> :
                 notification.type === 'new_order' ? <ShoppingCart className="w-5 h-5" /> :
                 <Bell className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{notification.title}</p>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(notification.created_at).toLocaleString()}</p>
              </div>
              {!notification.is_read && (
                <button 
                  onClick={() => onMarkAsRead(notification.id)}
                  className="text-xs text-[#7CE2B8] hover:underline"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
