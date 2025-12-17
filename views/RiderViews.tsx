import React, { useState } from 'react';
import { RefreshCw, MapPin, Package, DollarSign, Navigation, Camera, Phone } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { Card, Button, Badge, Navbar } from '../components/UIComponents';

interface RiderProps {
  orders: Order[];
  onAcceptOrder: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus, photo?: string) => void;
}

export const RiderDashboard: React.FC<RiderProps> = ({ orders, onAcceptOrder, onUpdateStatus }) => {
  const [view, setView] = useState<'POOL' | 'ACTIVE' | 'PROFILE'>('POOL');
  
  // Rider Income (Mock)
  const todayIncome = 128.5;

  const availableOrders = orders.filter(o => o.status === OrderStatus.PENDING);
  const myActiveOrders = orders.filter(o => 
    o.status !== OrderStatus.PENDING && 
    o.status !== OrderStatus.COMPLETED // Keep completed separate or just hide
  );

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      <Navbar title={view === 'POOL' ? '接单大厅' : (view === 'ACTIVE' ? '配送任务' : '我的数据')} />

      {/* Stats Header */}
      <div className="bg-blue-600 text-white p-6 pb-8 rounded-b-[2rem] mb-6 shadow-lg shadow-blue-900/20">
        <div className="flex justify-between items-center mb-6">
           <div className="flex items-center gap-1 bg-blue-700/50 p-1 rounded-full">
              <button 
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${view === 'POOL' ? 'bg-white text-blue-600 shadow-sm' : 'text-blue-100 hover:bg-blue-600/50'}`} 
                onClick={() => setView('POOL')}
              >
                抢单大厅
              </button>
              <button 
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${view === 'ACTIVE' ? 'bg-white text-blue-600 shadow-sm' : 'text-blue-100 hover:bg-blue-600/50'}`} 
                onClick={() => setView('ACTIVE')}
              >
                进行中 ({myActiveOrders.length})
              </button>
           </div>
           <Badge color="bg-green-400/20 text-green-100 border border-green-400/30">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-1.5 inline-block"></span>
              听单中
           </Badge>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center divide-x divide-blue-500/30">
           <div>
             <div className="text-3xl font-extrabold mb-1">{todayIncome}</div>
             <div className="text-xs text-blue-200">今日收入(元)</div>
           </div>
           <div>
             <div className="text-3xl font-extrabold mb-1">{myActiveOrders.length}</div>
             <div className="text-xs text-blue-200">待送单</div>
           </div>
           <div>
             <div className="text-3xl font-extrabold mb-1">100<span className="text-sm">%</span></div>
             <div className="text-xs text-blue-200">准时率</div>
           </div>
        </div>
      </div>

      {view === 'POOL' && (
        <div className="px-4 space-y-4">
          {availableOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
               <RefreshCw className="w-8 h-8 mb-2 animate-spin opacity-50" />
               <p>暂无新订单，监听中...</p>
            </div>
          ) : availableOrders.map(order => (
            <Card key={order.id} className="border-l-4 border-l-yellow-400 relative overflow-hidden group">
               <div className="absolute top-3 right-3 flex flex-col items-end">
                 <span className="text-lg font-extrabold text-red-500">¥{order.deliveryFee + (order.tip || 0)}</span>
                 <span className="text-[10px] text-gray-400">含小费</span>
               </div>
               
               <div className="mb-3 flex items-center space-x-2">
                  <Badge color="bg-blue-50 text-blue-600 border border-blue-100">{order.storeName ? '商家单' : '帮我送'}</Badge>
                  <span className="text-xs text-gray-400 font-mono">2.1km</span>
               </div>
               
               <div className="space-y-3 mb-5 pr-16">
                 <div className="flex items-start gap-3">
                   <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0 ring-4 ring-green-100"></div>
                   <p className="text-sm font-bold text-gray-800 line-clamp-1">{order.storeName || order.originAddress}</p>
                 </div>
                 <div className="flex items-start gap-3">
                   <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 ring-4 ring-red-100"></div>
                   <p className="text-sm font-bold text-gray-800 line-clamp-1">{order.destAddress}</p>
                 </div>
               </div>

               <Button fullWidth onClick={() => onAcceptOrder(order.id)} className="shadow-lg shadow-yellow-200">
                 立即抢单
               </Button>
            </Card>
          ))}
        </div>
      )}

      {view === 'ACTIVE' && (
        <div className="px-4 space-y-4">
          {myActiveOrders.map(order => (
             <ActiveOrderCard key={order.id} order={order} onUpdateStatus={onUpdateStatus} />
          ))}
          {myActiveOrders.length === 0 && <div className="text-center text-gray-400 py-10">当前没有配送任务</div>}
        </div>
      )}
    </div>
  );
};

const ActiveOrderCard: React.FC<{ order: Order, onUpdateStatus: (id: string, status: OrderStatus, photo?: string) => void }> = ({ order, onUpdateStatus }) => {
  const [pickupPhoto, setPickupPhoto] = useState<string | null>(order.riderPickupPhoto || null);
  
  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPickupPhoto(url);
    }
  };

  const nextStep = () => {
    if (order.status === OrderStatus.ACCEPTED) {
       if (!pickupPhoto) {
         alert("请先拍摄取货照片");
         return;
       }
       onUpdateStatus(order.id, OrderStatus.PICKED_UP, pickupPhoto);
    } else if (order.status === OrderStatus.PICKED_UP) {
       onUpdateStatus(order.id, OrderStatus.DELIVERED);
    }
  };

  return (
    <Card className="border border-blue-100 shadow-md overflow-hidden">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-3">
        <span className="font-bold text-lg text-gray-900">#{order.id.slice(-4)}</span>
        <Badge color="bg-blue-600 text-white shadow-blue-200 shadow-sm">{order.status}</Badge>
      </div>

      <div className="space-y-4 mb-4">
        {/* Addresses */}
        <div className="space-y-3 relative">
           <div className="absolute left-[0.6rem] top-2 bottom-6 w-0.5 bg-gray-200"></div>
           <div className="flex items-start gap-3 relative z-10">
             <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 border border-green-200">
                <div className="w-2 h-2 rounded-full bg-green-600"></div>
             </div>
             <div className="flex-1">
               <div className="text-xs text-gray-400 mb-0.5">取货点</div>
               <div className="text-sm font-bold text-gray-900">{order.storeName || order.originAddress}</div>
             </div>
           </div>
           <div className="flex items-start gap-3 relative z-10">
             <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 border border-red-200">
                <div className="w-2 h-2 rounded-full bg-red-600"></div>
             </div>
             <div className="flex-1">
               <div className="text-xs text-gray-400 mb-0.5">送货点</div>
               <div className="text-sm font-bold text-gray-900">{order.destAddress}</div>
             </div>
           </div>
        </div>

        {/* Action Logic */}
        {order.status === OrderStatus.ACCEPTED && (
          <div className="bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-200 text-center hover:bg-gray-100 transition-colors">
            {pickupPhoto ? (
               <div className="relative group">
                 <img src={pickupPhoto} className="h-40 w-full mx-auto rounded-lg object-cover" />
                 <button onClick={() => setPickupPhoto(null)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full text-xs">重拍</button>
               </div>
            ) : (
               <label className="flex flex-col items-center justify-center py-4 cursor-pointer">
                 <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                    <Camera className="w-6 h-6 text-blue-500" />
                 </div>
                 <span className="text-sm font-bold text-gray-600">拍摄货品/小票以取货</span>
                 <span className="text-xs text-gray-400 mt-1">需清晰可见</span>
                 <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
               </label>
            )}
          </div>
        )}

        {/* Call Buttons */}
        <div className="flex gap-3">
           <Button variant="outline" fullWidth size="sm" className="text-gray-600 border-gray-200">
              <Phone className="w-3 h-3 mr-2" /> 联系用户
           </Button>
           {order.storeId && (
             <Button variant="outline" fullWidth size="sm" className="text-gray-600 border-gray-200">
                <Phone className="w-3 h-3 mr-2" /> 联系商家
             </Button>
           )}
        </div>
      </div>
      
      {order.status !== OrderStatus.DELIVERED && (
        <Button 
          fullWidth
          size="lg"
          className={order.status === OrderStatus.ACCEPTED ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}
          disabled={order.status === OrderStatus.ACCEPTED && !pickupPhoto}
          onClick={nextStep}
        >
          {order.status === OrderStatus.ACCEPTED ? '确认取货' : '确认送达'}
        </Button>
      )}
      
      {order.status === OrderStatus.DELIVERED && (
        <div className="bg-yellow-50 text-yellow-700 p-3 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2">
           <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
           等待用户确认收货...
        </div>
      )}
    </Card>
  );
};