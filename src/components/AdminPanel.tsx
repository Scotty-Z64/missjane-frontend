import { useState, useRef } from 'react';
import { ArrowLeft, Upload, Plus, Minus, Save, Image as ImageIcon, X } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import type { Product } from '@/types';

interface AdminPanelProps {
  onBack: () => void;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const { products, updateProduct, updateStock, updateProductImage } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [showImageUpload, setShowImageUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditForm(product);
  };

  const handleSave = () => {
    if (selectedProduct && editForm) {
      updateProduct(selectedProduct.id, editForm);
      setSelectedProduct(null);
    }
  };

  const handleStockChange = (productId: string, delta: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const newStock = Math.max(0, product.stock + delta);
      updateStock(productId, newStock);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedProduct) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        updateProductImage(selectedProduct.id, imageUrl);
        setEditForm({ ...editForm, image: imageUrl });
        setShowImageUpload(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] pt-20 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-black"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to shop
          </button>
          <h1 className="font-semibold text-lg">Admin Panel</h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[28px] p-6">
              <h2 className="font-semibold mb-4">Products</h2>
              <div className="space-y-2 max-h-[600px] overflow-auto">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                      selectedProduct?.id === product.id
                        ? 'bg-[#7CE2B8]/20'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {product.name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Stock: {product.stock}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            {selectedProduct ? (
              <div className="bg-white rounded-[28px] p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-lg">Edit Product</h2>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Image */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image
                  </label>
                  <div className="relative w-40 h-40">
                    <img
                      src={editForm.image}
                      alt={editForm.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <button
                      onClick={() => setShowImageUpload(true)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <Upload className="w-6 h-6 text-white" />
                    </button>
                  </div>
                  {showImageUpload && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-xl">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <ImageIcon className="w-4 h-4" />
                        Choose Image
                      </button>
                    </div>
                  )}
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (R)
                    </label>
                    <input
                      type="number"
                      value={editForm.price || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          price: parseInt(e.target.value) || 0
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={editForm.description || ''}
                      onChange={(e) =>
                        setEditForm({ ...editForm, description: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      THC
                    </label>
                    <input
                      type="text"
                      value={editForm.thc || ''}
                      onChange={(e) =>
                        setEditForm({ ...editForm, thc: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                      placeholder="e.g., 18%"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CBD
                    </label>
                    <input
                      type="text"
                      value={editForm.cbd || ''}
                      onChange={(e) =>
                        setEditForm({ ...editForm, cbd: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CE2B8] focus:ring-2 focus:ring-[#7CE2B8]/20 outline-none"
                      placeholder="e.g., 1000mg"
                    />
                  </div>
                </div>

                {/* Stock Management */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Management
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleStockChange(selectedProduct.id, -1)}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-full border border-gray-200 hover:border-gray-300"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-2xl font-semibold w-16 text-center">
                      {editForm.stock}
                    </span>
                    <button
                      onClick={() => handleStockChange(selectedProduct.id, 1)}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-full border border-gray-200 hover:border-gray-300"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-[28px] p-8 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-lg">Select a product</h3>
                <p className="text-gray-600 mt-2">
                  Choose a product from the list to edit its details and manage stock
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
