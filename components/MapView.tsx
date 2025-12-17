import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

export const MapView: React.FC<{ type: 'static' | 'tracking', status?: string }> = ({ type, status }) => {
  return (
    <div className="relative w-full h-48 bg-blue-50 rounded-lg overflow-hidden border border-blue-100 flex items-center justify-center group">
      {/* Simulated Map Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}></div>
      
      {/* Roads simulation */}
      <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-300 transform -rotate-12"></div>
      <div className="absolute top-0 left-1/2 w-2 h-full bg-gray-300 transform rotate-12"></div>

      <div className="relative z-10 flex flex-col items-center">
        {type === 'tracking' ? (
          <div className="flex items-center space-x-4 animate-pulse">
             <div className="bg-yellow-400 p-2 rounded-full shadow-lg">
                <Navigation className="w-6 h-6 text-black transform rotate-45" />
             </div>
             <div className="bg-white px-3 py-1 rounded shadow text-xs font-bold text-blue-600">
               {status || '正在配送中...'}
             </div>
          </div>
        ) : (
          <div className="text-gray-400 flex flex-col items-center">
             <MapPin className="w-8 h-8 mb-1" />
             <span className="text-xs">地图定位模式</span>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-2 right-2 bg-white/90 p-1 rounded text-[10px] text-gray-500">
        Simulated Map
      </div>
    </div>
  );
};