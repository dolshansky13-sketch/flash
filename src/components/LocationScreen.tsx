import { Location } from '../types';

interface Props {
  locations: Location[];
  reputation: number;
  onSelect: (location: Location) => void;
  onPortfolio: () => void;
  onShop: () => void;
  level: number;
  money: number;
  photosTaken: number;
}

export default function LocationScreen({ locations, reputation, onSelect, onPortfolio, onShop, level, money, photosTaken }: Props) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header Stats Bar */}
      <div className="bg-gray-900/90 border-b border-purple-500/30 px-4 py-3 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-purple-400 font-bold">📸 FLASH</span>
            <span className="text-xs text-gray-400">Lv.{level}</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-yellow-400">💰 ${money}</span>
            <span className="text-pink-400">⭐ {reputation} Rep</span>
            <span className="text-cyan-400">📷 {photosTaken} shots</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onShop}
              className="px-3 py-1.5 bg-yellow-600/20 border border-yellow-500/40 rounded text-yellow-400 text-xs hover:bg-yellow-600/40 transition"
            >
              🛒 Shop
            </button>
            <button
              onClick={onPortfolio}
              className="px-3 py-1.5 bg-purple-600/20 border border-purple-500/40 rounded text-purple-400 text-xs hover:bg-purple-600/40 transition"
            >
              📁 Portfolio
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Choose Your Location</h1>
          <p className="text-gray-400">Explore the after-party and find cosplayers to photograph</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-2 flex-1 bg-gray-800 rounded-full overflow-hidden max-w-xs">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (reputation / 300) * 100)}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{reputation}/300 Rep</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {locations.map(location => (
            <div
              key={location.id}
              className={`
                relative rounded-xl overflow-hidden border transition-all duration-300 group
                ${location.unlocked
                  ? 'border-purple-500/30 hover:border-purple-400/60 cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20'
                  : 'border-gray-700/30 opacity-60 cursor-not-allowed'
                }
              `}
              onClick={() => location.unlocked && onSelect(location)}
            >
              {/* Background Image */}
              <div className="h-48 relative overflow-hidden">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                {!location.unlocked && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl mb-2">🔒</div>
                      <div className="text-sm text-gray-300">Requires {location.requiredReputation} Rep</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 bg-gray-900">
                <h3 className="text-lg font-bold mb-1">{location.name}</h3>
                <p className="text-gray-400 text-sm mb-3">{location.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Lighting:</span>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(i => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${i <= location.lightingQuality ? 'bg-yellow-400' : 'bg-gray-700'}`}
                        />
                      ))}
                    </div>
                  </div>
                  {location.unlocked && (
                    <span className="text-xs text-purple-400 group-hover:text-purple-300">
                      Enter →
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
