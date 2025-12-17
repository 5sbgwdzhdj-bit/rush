import React, { useState } from 'react';
import { Search, ShoppingBag, Utensils, Bike, MapPin, Camera, Sparkles } from 'lucide-react';
import { MOCK_STORES } from '../constants';
import { ServiceType, Store } from '../types';
import { Card, Badge, Button, Input, TextArea } from '../components/UIComponents';
import { generateErrandDescription } from '../services/geminiService';

interface UserHomeProps {
  onSelectStore: (store: Store) => void;
  onCreateErrand: (details: any) => void;
}

export const UserHome: React.FC<UserHomeProps> = ({ onSelectStore, onCreateErrand }) => {
  const [activeTab, setActiveTab] = useState<ServiceType>(ServiceType.DINING);
  const [searchQuery, setSearchQuery] = useState('');

  // Errand State
  const [errandText, setErrandText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [origin, setOrigin] = useState('');
  const [dest, setDest] = useState('');
  const [itemImage, setItemImage] = useState<string | null>(null);

  const filteredStores = MOCK_STORES.filter(s => 
    (activeTab === ServiceType.DINING ? s.type === ServiceType.DINING : s.type === ServiceType.MARKET) &&
    s.name.includes(searchQuery)
  );

  const handleGenerateDesc = async () => {
    if (!errandText) return;
    setIsGenerating(true);
    const desc = await generateErrandDescription(errandText);
    setErrandText(desc);
    setIsGenerating(false);
  };

  const handleErrandSubmit = () => {
    if(!origin || !dest || !errandText) {
      alert("请填写完整信息");
      return;
    }
    onCreateErrand({
      originAddress: origin,
      destAddress: dest,
      errandDescription: errandText,
      errandItemImage: itemImage
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setItemImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="pb-24">
      {/* Header / Search */}
      <div className="bg-yellow-400 p-4 rounded-b-[2rem] shadow-md mb-6 sticky top-0 z-20 transition-all">
        <h1 className="text-xl font-extrabold mb-3 ml-1 text-gray-900">SwiftRun 跑腿</h1>
        <Input 
          icon={<Search className="w-5 h-5" />} 
          placeholder="搜索商家、商品或服务..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-full bg-white/90 border-0 shadow-sm focus:bg-white"
        />
      </div>

      {/* Service Tabs */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => setActiveTab(ServiceType.DINING)}
            className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 ${activeTab === ServiceType.DINING ? 'bg-yellow-100 ring-2 ring-yellow-400 shadow-md scale-105' : 'bg-white shadow-sm hover:bg-gray-50'}`}
          >
            <div className={`p-2 rounded-full mb-2 ${activeTab === ServiceType.DINING ? 'bg-yellow-400' : 'bg-orange-100'}`}>
              <Utensils className={`w-6 h-6 ${activeTab === ServiceType.DINING ? 'text-gray-900' : 'text-orange-600'}`} />
            </div>
            <span className="text-xs font-bold text-gray-800">美食餐饮</span>
          </button>
          <button 
            onClick={() => setActiveTab(ServiceType.MARKET)}
            className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 ${activeTab === ServiceType.MARKET ? 'bg-yellow-100 ring-2 ring-yellow-400 shadow-md scale-105' : 'bg-white shadow-sm hover:bg-gray-50'}`}
          >
            <div className={`p-2 rounded-full mb-2 ${activeTab === ServiceType.MARKET ? 'bg-yellow-400' : 'bg-green-100'}`}>
              <ShoppingBag className={`w-6 h-6 ${activeTab === ServiceType.MARKET ? 'text-gray-900' : 'text-green-600'}`} />
            </div>
            <span className="text-xs font-bold text-gray-800">商超百货</span>
          </button>
          <button 
            onClick={() => setActiveTab(ServiceType.ERRAND)}
            className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 ${activeTab === ServiceType.ERRAND ? 'bg-yellow-100 ring-2 ring-yellow-400 shadow-md scale-105' : 'bg-white shadow-sm hover:bg-gray-50'}`}
          >
            <div className={`p-2 rounded-full mb-2 ${activeTab === ServiceType.ERRAND ? 'bg-yellow-400' : 'bg-blue-100'}`}>
              <Bike className={`w-6 h-6 ${activeTab === ServiceType.ERRAND ? 'text-gray-900' : 'text-blue-600'}`} />
            </div>
            <span className="text-xs font-bold text-gray-800">万能代送</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-4">
        {activeTab === ServiceType.ERRAND ? (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-gray-800">创建跑腿任务</h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">全城送</span>
            </div>
            
            <Card className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1">
                  <Input 
                    placeholder="从哪里取货？" 
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="border-none px-0 py-2 bg-transparent focus:ring-0 focus:bg-transparent text-base"
                    containerClassName="border-b border-gray-100"
                  />
                </div>
                <button className="text-xs text-blue-600 font-bold flex items-center bg-blue-50 px-2 py-1 rounded-lg">
                  <MapPin className="w-3 h-3 mr-1" />
                  地图
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                </div>
                <div className="flex-1">
                  <Input 
                    placeholder="送到哪里去？" 
                    value={dest}
                    onChange={(e) => setDest(e.target.value)}
                    className="border-none px-0 py-2 bg-transparent focus:ring-0 focus:bg-transparent text-base"
                  />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-bold text-gray-700">物品描述</div>
                <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-yellow-600 hover:bg-yellow-50"
                    onClick={handleGenerateDesc} 
                    loading={isGenerating}
                    disabled={!errandText}
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI 润色
                 </Button>
              </div>
              <TextArea 
                rows={3}
                placeholder="例如：一把钥匙，文件袋，需要轻拿轻放..."
                value={errandText}
                onChange={(e) => setErrandText(e.target.value)}
                className="mb-4"
              />
              <div className="flex justify-start">
                 <div className="relative group cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full z-10" />
                    <div className={`flex items-center justify-center w-20 h-20 rounded-xl border-2 border-dashed transition-all ${itemImage ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 group-hover:bg-gray-100'}`}>
                      {itemImage ? (
                        <img src={itemImage} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="flex flex-col items-center text-gray-400">
                          <Camera className="w-6 h-6 mb-1" />
                          <span className="text-[10px]">拍照上传</span>
                        </div>
                      )}
                    </div>
                 </div>
              </div>
            </Card>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl flex justify-between items-center border border-blue-200">
              <div>
                <span className="text-sm text-blue-800 font-medium">预估费用</span>
                <div className="text-xs text-blue-400">距离 2.5km</div>
              </div>
              <span className="font-extrabold text-2xl text-blue-900">¥15.00</span>
            </div>

            <Button size="lg" fullWidth className="text-lg shadow-yellow-200" onClick={handleErrandSubmit}>
              立即下单
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
             {filteredStores.map(store => (
               <Card key={store.id} onClick={() => onSelectStore(store)} className="flex gap-4 hover:shadow-md transition-shadow" interactive>
                 <img src={store.image} alt={store.name} className="w-24 h-24 rounded-xl object-cover bg-gray-200 shrink-0" />
                 <div className="flex-1 flex flex-col justify-between py-1">
                   <div>
                     <h3 className="font-bold text-gray-900 text-lg leading-tight">{store.name}</h3>
                     <div className="flex items-center space-x-2 mt-2">
                       <div className="flex items-center text-orange-500 font-bold text-xs bg-orange-50 px-1.5 py-0.5 rounded">
                         <span className="mr-1">★</span>{store.rating}
                       </div>
                       <span className="text-gray-400 text-xs">{store.distance}</span>
                       <span className="text-gray-400 text-xs">•</span>
                       <span className="text-gray-400 text-xs">30分钟</span>
                     </div>
                   </div>
                   <div className="flex gap-2 overflow-hidden mt-3">
                     {store.products.slice(0, 2).map(p => (
                       <Badge key={p.id} color="bg-gray-100 text-gray-500 border border-gray-200">{p.name}</Badge>
                     ))}
                   </div>
                 </div>
               </Card>
             ))}
             {filteredStores.length === 0 && (
               <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                 <ShoppingBag className="w-12 h-12 mb-2 opacity-20" />
                 <p>暂无相关店铺</p>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};