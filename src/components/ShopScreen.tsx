import { Equipment } from '../types';
import { SHOP_ITEMS } from '../gameData';

interface Props {
  money: number;
  equipment: Equipment;
  onBuy: (itemId: string) => void;
  onBack: () => void;
}

export default function ShopScreen({ money, equipment, onBuy, onBack }: Props) {
  const isOwned = (itemId: string): boolean => {
    switch (itemId) {
      case 'flash': return equipment.flash;
      case 'reflector': return equipment.reflector;
      case 'lens_50': return equipment.lens === '50mm f/1.4 Lens';
      case 'lens_85': return equipment.lens === '85mm f/1.2 Lens';
      case 'body_upgrade': return equipment.body === 'Full Frame Body';
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-white">←</button>
            <h1 className="text-lg font-bold">🛒 Camera Shop</h1>
          </div>
          <span className="text-yellow-400 font-bold">💰 ${money}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Current Equipment */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-8">
          <h2 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Current Equipment</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-xs text-gray-500">Camera Body</div>
              <div className="text-sm font-medium text-white mt-1">{equipment.body}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-xs text-gray-500">Lens</div>
              <div className="text-sm font-medium text-white mt-1">{equipment.lens}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-xs text-gray-500">Flash</div>
              <div className="text-sm font-medium mt-1">{equipment.flash ? '💡 Ring Flash' : '❌ None'}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-xs text-gray-500">Reflector</div>
              <div className="text-sm font-medium mt-1">{equipment.reflector ? '🪞 5-in-1' : '❌ None'}</div>
            </div>
          </div>
        </div>

        {/* Shop Items */}
        <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Available Upgrades</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {SHOP_ITEMS.map(item => {
            const owned = isOwned(item.id);
            const canAfford = money >= item.price;

            return (
              <div
                key={item.id}
                className={`bg-gray-900 rounded-xl p-5 border transition ${
                  owned ? 'border-green-500/30 opacity-70' : 'border-gray-800 hover:border-yellow-500/30'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white">{item.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-yellow-400">${item.price}</div>
                  </div>
                </div>

                {owned ? (
                  <div className="w-full py-2 rounded-lg bg-green-500/20 text-green-400 text-center text-sm font-medium">
                    ✓ Owned
                  </div>
                ) : (
                  <button
                    onClick={() => onBuy(item.id)}
                    disabled={!canAfford}
                    className={`w-full py-2 rounded-lg text-sm font-bold transition ${
                      canAfford
                        ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:from-yellow-500 hover:to-orange-500 shadow-lg shadow-yellow-500/20'
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Purchase' : `Need $${item.price - money} more`}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Tips */}
        <div className="mt-8 bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
          <h3 className="text-sm font-bold text-purple-400 mb-2">💡 Photography Tips</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Match poses to cosplayer preferences for higher scores</li>
            <li>• Use wider apertures (lower f-numbers) in dark venues</li>
            <li>• 85mm+ is ideal for portraits, 24-50mm for full body</li>
            <li>• Keep shutter speed above 1/125 to avoid motion blur</li>
            <li>• Different locations have different lighting qualities</li>
            <li>• Build reputation to unlock new areas and cosplayers</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
