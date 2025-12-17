import React, { useState } from 'react';
import { ChevronLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Store, Product } from '../types';
import { Button, Navbar, Badge } from '../components/UIComponents';

interface StoreDetailProps {
  store: Store;
  onBack: () => void;
  onSubmitOrder: (store: Store, items: { product: Product, quantity: number }[], total: number) => void;
}

export const StoreDetail: React.FC<StoreDetailProps> = ({ store, onBack, onSubmitOrder }) => {
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  const addToCart = (productId: string) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCount = (prev[productId] || 0) - 1;
      if (newCount <= 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: newCount };
    });
  };

  const cartItems = Object.entries(cart).map(([pid, qty]) => ({
    product: store.products.find(p => p.id === pid)!,
    quantity: qty as number
  })).filter(i => i.product);

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const deliveryFee = 5;

  return (
    <div className="flex flex-col h-screen bg-white">
      <Navbar 
        title={store.name} 
        leftAction={
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
        <div className="relative rounded-2xl overflow-hidden shadow-sm">
           <img src={store.image} className="w-full h-48 object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <div className="text-white">
                <h2 className="text-2xl font-bold">{store.name}</h2>
                <div className="flex items-center gap-2 mt-1 text-sm opacity-90">
                  <span>★ {store.rating}</span>
                  <span>•</span>
                  <span>{store.distance}</span>
                </div>
              </div>
           </div>
        </div>
        
        <div>
          <h3 className="font-bold text-lg mb-4">热销商品</h3>
          <div className="space-y-6">
            {store.products.map(product => (
              <div key={product.id} className="flex gap-4">
                <img src={product.image} className="w-24 h-24 rounded-xl object-cover bg-gray-100" />
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h4 className="font-bold text-gray-900">{product.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">月售 100+ 好评率 98%</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-red-500 font-bold text-lg">
                      <span className="text-xs">¥</span>{product.price}
                    </span>
                    <div className="flex items-center gap-3">
                      {cart[product.id] ? (
                        <>
                          <button onClick={() => removeFromCart(product.id)} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:scale-90 transition-all">
                            <Minus className="w-3 h-3 text-gray-600" />
                          </button>
                          <span className="text-sm font-bold w-4 text-center">{cart[product.id]}</span>
                        </>
                      ) : null}
                      <button onClick={() => addToCart(product.id)} className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center hover:bg-yellow-500 active:scale-90 transition-all shadow-sm">
                        <Plus className="w-4 h-4 text-gray-900" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Float */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 z-20 pointer-events-none">
          <div className="bg-gray-900 text-white rounded-2xl shadow-xl p-4 flex justify-between items-center pointer-events-auto">
            <div className="flex items-center gap-4">
               <div className="relative">
                 <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                   <ShoppingCart className="w-6 h-6 text-yellow-400" />
                 </div>
                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-gray-900">
                    {Object.values(cart).reduce((a: number, b: number) => a + b, 0)}
                 </span>
               </div>
               <div>
                  <div className="text-xl font-bold">¥{totalAmount + deliveryFee}</div>
                  <div className="text-xs text-gray-400">另需配送费 ¥{deliveryFee}</div>
               </div>
            </div>
            <Button 
              className="px-6 h-10 rounded-lg bg-yellow-400 text-gray-900 hover:bg-yellow-500 border-none" 
              onClick={() => onSubmitOrder(store, cartItems, totalAmount + deliveryFee)}
            >
              去结算
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};