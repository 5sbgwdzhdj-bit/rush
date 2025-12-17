import React, { useState, useEffect } from 'react';
import { User, Bike, List, User as UserIcon, LogOut, CheckCircle, Lock, Camera, ArrowLeft } from 'lucide-react';
import { UserHome } from './views/UserHome';
import { StoreDetail } from './views/StoreDetail';
import { RiderDashboard } from './views/RiderViews';
import { Button, Card, Navbar, Badge } from './components/UIComponents';
import { MapView } from './components/MapView';
import { UserRole, Order, Store, Product, OrderStatus, UserState } from './types';
import { MOCK_STORES, INITIAL_USER_BALANCE } from './constants';

const App = () => {
  // --- Global State ---
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.USER);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userState, setUserState] = useState<UserState>({
    id: 'u1',
    name: '测试用户',
    balance: INITIAL_USER_BALANCE,
    isLocked: false
  });

  // --- Navigation State ---
  const [currentView, setCurrentView] = useState<'HOME' | 'STORE_DETAIL' | 'ORDERS' | 'PROFILE'>('HOME');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  // --- Actions ---

  // 1. User Creates Order
  const handleCreateOrder = (orderData: Partial<Order>) => {
    if (userState.isLocked) {
      alert("您有未完成的验证订单，请先确认收货！");
      return;
    }

    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      userId: userState.id,
      status: OrderStatus.PENDING,
      createdAt: Date.now(),
      totalPrice: 0,
      deliveryFee: 15, // Mock fee
      originAddress: 'Current Location',
      destAddress: 'Destination',
      ...orderData
    } as Order;

    setOrders(prev => [newOrder, ...prev]);
    // setUserState(prev => ({ ...prev, isLocked: true })); // Lock immediately or after pickup? Let's lock on pickup for realism, but prompt implies strict loop. Let's lock.
    setUserState(prev => ({ ...prev, isLocked: true }));
    
    alert("下单成功！正在为您寻找骑手...");
    setCurrentView('ORDERS');
  };

  // 2. Rider Accepts Order
  const handleAcceptOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: OrderStatus.ACCEPTED, riderId: 'r1' } : o));
  };

  // 3. Rider Updates Status (Pickup Photo / Delivered)
  const handleRiderUpdateStatus = (orderId: string, status: OrderStatus, photo?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        status,
        riderPickupPhoto: photo || o.riderPickupPhoto
      };
    }));
  };

  // 4. User Verifies & Completes
  const handleUserVerify = (orderId: string, photo: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: OrderStatus.COMPLETED, userReceiptPhoto: photo } : o));
    setUserState(prev => ({ ...prev, isLocked: false, balance: prev.balance - 15 })); // Deduct money
    alert("订单完成！感谢您的使用。");
  };

  // --- Views Rendering ---

  // User Order List View
  const UserOrderList = () => {
    const myOrders = orders.filter(o => o.userId === userState.id);
    
    return (
      <div className="pb-24 bg-gray-50 min-h-screen">
        <Navbar title="我的订单" />
        <div className="p-4 space-y-4">
          {myOrders.length === 0 && (
             <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <List className="w-16 h-16 mb-4 opacity-20" />
                <p>暂无订单记录</p>
                <Button variant="outline" className="mt-4" onClick={() => setCurrentView('HOME')}>去下单</Button>
             </div>
          )}
          
          {myOrders.map(order => (
            <Card key={order.id} className="space-y-4 shadow-md">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                 <div className="font-bold text-lg text-gray-900">{order.storeName || '帮我送'}</div>
                 <Badge color={
                    order.status === OrderStatus.COMPLETED ? 'bg-green-100 text-green-700' : 
                    order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-700'
                 }>
                    {order.status}
                 </Badge>
              </div>
              <div className="text-sm text-gray-500 space-y-2">
                 <div className="flex justify-between">
                   <span>下单时间</span>
                   <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
                 </div>
                 <div className="flex justify-between">
                   <span>总价</span>
                   <span className="font-bold text-gray-900">¥{order.totalPrice}</span>
                 </div>
                 {order.errandDescription && (
                    <div className="bg-gray-50 p-3 rounded-lg text-gray-700 mt-2 text-xs leading-relaxed">
                       <span className="font-bold block mb-1">备注:</span>
                       "{order.errandDescription}"
                    </div>
                 )}
              </div>

              {/* Status Logic */}
              {(order.status === OrderStatus.PICKED_UP || order.status === OrderStatus.DELIVERED) && (
                 <div className="mt-2 rounded-xl overflow-hidden shadow-sm border border-blue-100">
                   <MapView type="tracking" status={order.status} />
                 </div>
              )}

              {/* Rider Photo Evidence */}
              {order.riderPickupPhoto && (
                <div className="bg-gray-50 p-3 rounded-xl border border-dashed border-gray-200">
                  <p className="text-xs font-bold text-gray-500 mb-2">骑手取货凭证</p>
                  <img src={order.riderPickupPhoto} className="h-32 w-full object-cover rounded-lg" />
                </div>
              )}

              {/* User Verification Action */}
              {order.status === OrderStatus.DELIVERED && (
                <div className="bg-yellow-50 p-4 border border-yellow-200 rounded-xl">
                   <p className="text-sm font-bold text-yellow-800 mb-3 flex items-center">
                     <Lock className="w-4 h-4 mr-2"/> 安全签收验证
                   </p>
                   <div className="flex items-center space-x-2">
                     <label className="flex-1 bg-white border border-gray-200 rounded-xl h-12 flex items-center justify-center cursor-pointer text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
                       <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          if(e.target.files?.[0]) handleUserVerify(order.id, URL.createObjectURL(e.target.files[0]));
                       }} />
                       <Camera className="w-5 h-5 mr-2 text-gray-500" /> 拍照确认收货
                     </label>
                   </div>
                   <p className="text-[10px] text-yellow-600/70 mt-2 text-center">请拍摄商品照片以确保无损，确认后将自动付款</p>
                </div>
              )}

              {order.status === OrderStatus.COMPLETED && (
                <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm font-bold flex items-center justify-center">
                   <CheckCircle className="w-5 h-5 mr-2" /> 订单已完成支付
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // --- Main Render ---

  if (currentUserRole === UserRole.RIDER) {
    return (
      <>
        <RiderDashboard 
          orders={orders} 
          onAcceptOrder={handleAcceptOrder} 
          onUpdateStatus={handleRiderUpdateStatus}
        />
        {/* Role Switcher for Demo */}
        <button 
           onClick={() => setCurrentUserRole(UserRole.USER)}
           className="fixed bottom-4 right-4 bg-gray-900 text-white px-5 py-3 rounded-full shadow-2xl z-50 text-xs font-bold flex items-center hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          回用户端
        </button>
      </>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen max-w-md mx-auto shadow-2xl relative overflow-hidden flex flex-col">
      
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* View Switcher */}
        {currentView === 'HOME' && (
          <UserHome 
            onSelectStore={(store) => {
              setSelectedStore(store);
              setCurrentView('STORE_DETAIL');
            }}
            onCreateErrand={(details) => handleCreateOrder({ ...details, totalPrice: 15 })}
          />
        )}

        {currentView === 'STORE_DETAIL' && selectedStore && (
          <StoreDetail 
            store={selectedStore} 
            onBack={() => {
              setSelectedStore(null);
              setCurrentView('HOME');
            }}
            onSubmitOrder={(store, items, total) => {
               handleCreateOrder({
                 storeId: store.id,
                 storeName: store.name,
                 items,
                 totalPrice: total,
                 originAddress: store.name,
                 destAddress: '我的收货地址 (自动)'
               });
               setCurrentView('ORDERS');
            }}
          />
        )}

        {currentView === 'ORDERS' && <UserOrderList />}

        {currentView === 'PROFILE' && (
          <div className="p-6">
             <h1 className="text-2xl font-bold mb-6 text-gray-900">个人中心</h1>
             <Card className="mb-6 flex items-center p-6 bg-gradient-to-br from-yellow-400 to-orange-300 border-none text-white shadow-lg">
                <div className="w-16 h-16 bg-white/20 rounded-full mr-4 backdrop-blur-sm border-2 border-white/30"></div>
                <div>
                   <div className="font-bold text-xl">{userState.name}</div>
                   <div className="text-sm opacity-90 mt-1">余额: ¥{userState.balance.toFixed(2)}</div>
                </div>
             </Card>
             
             {userState.isLocked && (
               <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm mb-6 flex items-start border border-red-100">
                 <Lock className="w-5 h-5 mr-3 shrink-0 mt-0.5" /> 
                 <div>
                   <span className="font-bold block mb-1">账户受限</span>
                   您有未完成的验证订单，请前往订单页面完成收货验证。
                 </div>
               </div>
             )}

             <div className="space-y-3">
               <Button variant="secondary" fullWidth className="justify-start h-14" onClick={() => setCurrentUserRole(UserRole.RIDER)}>
                 <Bike className="w-5 h-5 mr-3" /> 切换到骑手端 (模拟)
               </Button>
               <Button variant="outline" fullWidth className="justify-start h-14 text-red-500 border-red-100 hover:bg-red-50">
                 <LogOut className="w-5 h-5 mr-3" /> 退出登录
               </Button>
             </div>
          </div>
        )}
      </div>

      {/* Bottom Nav (Only show if not in full screen details) */}
      {currentView !== 'STORE_DETAIL' && (
        <div className="flex-none bg-white border-t border-gray-100 flex justify-around py-2 pb-5 z-40 text-[10px] shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
          <button onClick={() => setCurrentView('HOME')} className={`flex flex-col items-center p-2 rounded-xl transition-all ${currentView === 'HOME' ? 'text-yellow-500 bg-yellow-50/50' : 'text-gray-400 hover:bg-gray-50'}`}>
            <UserIcon className="w-6 h-6 mb-1" />
            <span className="font-medium">首页</span>
          </button>
          <button onClick={() => setCurrentView('ORDERS')} className={`flex flex-col items-center p-2 rounded-xl transition-all ${currentView === 'ORDERS' ? 'text-yellow-500 bg-yellow-50/50' : 'text-gray-400 hover:bg-gray-50'}`}>
            <List className="w-6 h-6 mb-1" />
            <span className="font-medium">订单</span>
          </button>
          <button onClick={() => setCurrentView('PROFILE')} className={`flex flex-col items-center p-2 rounded-xl transition-all ${currentView === 'PROFILE' ? 'text-yellow-500 bg-yellow-50/50' : 'text-gray-400 hover:bg-gray-50'}`}>
            <UserIcon className="w-6 h-6 mb-1" />
            <span className="font-medium">我的</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;