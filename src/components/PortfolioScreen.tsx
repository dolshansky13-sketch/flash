import { Photo, Cosplayer, Location, SHOT_TYPE_INFO, POSE_INFO } from '../types';

interface Props {
  portfolio: Photo[];
  cosplayers: Cosplayer[];
  locations: Location[];
  reputation: number;
  level: number;
  bestScore: number;
  photosTaken: number;
  onBack: () => void;
}

function formatShutter(speed: number): string {
  if (speed >= 1) return `${speed}s`;
  return `1/${Math.round(1/speed)}`;
}

export default function PortfolioScreen({ portfolio, cosplayers, reputation, level, bestScore, photosTaken, onBack }: Props) {
  const avgScore = portfolio.length > 0 ? Math.round(portfolio.reduce((sum, p) => sum + p.score, 0) / portfolio.length) : 0;

  const getCosplayerImage = (id: string) => cosplayers.find(c => c.id === id)?.image || '';

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-white">←</button>
            <h1 className="text-lg font-bold">📁 Portfolio</h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-purple-400">Lv.{level}</span>
            <span className="text-pink-400">⭐ {reputation} Rep</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
            <div className="text-3xl font-black text-purple-400">{photosTaken}</div>
            <div className="text-xs text-gray-500 mt-1">Photos Taken</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
            <div className="text-3xl font-black text-pink-400">{bestScore}</div>
            <div className="text-xs text-gray-500 mt-1">Best Score</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
            <div className="text-3xl font-black text-cyan-400">{avgScore}</div>
            <div className="text-xs text-gray-500 mt-1">Average Score</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
            <div className="text-3xl font-black text-yellow-400">{reputation}</div>
            <div className="text-xs text-gray-500 mt-1">Reputation</div>
          </div>
        </div>

        {/* Portfolio Grid */}
        {portfolio.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <div className="text-5xl mb-4">📷</div>
            <p className="text-lg">No photos yet</p>
            <p className="text-sm mt-2">Start shooting to build your portfolio!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {portfolio.map(photo => (
              <div
                key={photo.id}
                className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition group"
              >
                {/* Thumbnail */}
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={getCosplayerImage(photo.cosplayerId)}
                    alt={photo.cosplayerName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    style={{ filter: `brightness(${photo.settings.iso >= 800 ? 1 : 0.7}) contrast(1.1)` }}
                  />
                  {/* Score badge */}
                  <div className={`absolute top-2 right-2 rounded-lg px-2 py-1 text-xs font-bold backdrop-blur-sm ${
                    photo.score >= 75 ? 'bg-green-500/30 text-green-300' :
                    photo.score >= 50 ? 'bg-yellow-500/30 text-yellow-300' :
                    'bg-red-500/30 text-red-300'
                  }`}>
                    {photo.score}
                  </div>
                  {/* Stars */}
                  <div className="absolute bottom-2 left-2 flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className={`text-xs ${i <= photo.stars ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
                    ))}
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <div className="text-sm font-bold truncate">{photo.cosplayerName}</div>
                  <div className="text-xs text-gray-500 truncate">{photo.costume}</div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                    <span>{SHOT_TYPE_INFO[photo.shotType].icon}</span>
                    <span>{POSE_INFO[photo.pose].icon}</span>
                    <span>f/{photo.settings.aperture}</span>
                    <span>{formatShutter(photo.settings.shutterSpeed)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
