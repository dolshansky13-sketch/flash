import { Photo, Cosplayer, Location, SHOT_TYPE_INFO, POSE_INFO, getCosplayerImage } from '../types';

interface Props {
  portfolio: Photo[];
  cosplayers: Cosplayer[];
  locations: Location[];
  reputation: number;
  level: number;
  bestScore: number;
  photosTaken: number;
  totalMoneyEarned: number;
  onBack: () => void;
}

function formatShutter(speed: number): string {
  if (speed >= 1) return `${speed}s`;
  return `1/${Math.round(1/speed)}`;
}

export default function PortfolioScreen({ portfolio, cosplayers, reputation, level, bestScore, photosTaken, totalMoneyEarned, onBack }: Props) {
  const avgScore = portfolio.length > 0 ? Math.round(portfolio.reduce((sum, p) => sum + p.score, 0) / portfolio.length) : 0;
  const uniqueCostumes = new Set(portfolio.map(p => p.cosplayerId)).size;

  const getImg = (id: string, pose?: any) => {
    const cosplayer = cosplayers.find(c => c.id === id);
    if (!cosplayer) return '';
    return getCosplayerImage(cosplayer, pose);
  };
  const getCosplayerTier = (id: string) => cosplayers.find(c => c.id === id)?.tier || 'common';

  const tierColors = {
    common: 'border-gray-500/30',
    rare: 'border-blue-500/30',
    elite: 'border-purple-500/30',
    legendary: 'border-yellow-500/30',
  };

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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <div className="bg-gray-900 rounded-xl p-3 border border-gray-800 text-center">
            <div className="text-2xl font-black text-purple-400">{photosTaken}</div>
            <div className="text-xs text-gray-500 mt-1">Photos</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-3 border border-gray-800 text-center">
            <div className="text-2xl font-black text-pink-400">{bestScore}</div>
            <div className="text-xs text-gray-500 mt-1">Best Score</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-3 border border-gray-800 text-center">
            <div className="text-2xl font-black text-cyan-400">{avgScore}</div>
            <div className="text-xs text-gray-500 mt-1">Average</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-3 border border-gray-800 text-center">
            <div className="text-2xl font-black text-green-400">${totalMoneyEarned}</div>
            <div className="text-xs text-gray-500 mt-1">Total Earned</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-3 border border-gray-800 text-center">
            <div className="text-2xl font-black text-yellow-400">{uniqueCostumes}</div>
            <div className="text-xs text-gray-500 mt-1">Costumes</div>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {portfolio.map(photo => (
              <div
                key={photo.id}
                className={`bg-gray-900 rounded-xl overflow-hidden border hover:border-purple-500/50 transition group ${tierColors[getCosplayerTier(photo.cosplayerId) as keyof typeof tierColors]}`}
              >
                {/* Thumbnail */}
                <div className="aspect-[3/4] relative overflow-hidden bg-black flex items-center justify-center">
                  <img
                    src={getImg(photo.cosplayerId, photo.pose)}
                    alt={photo.cosplayerName}
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
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
                  {/* Tier badge */}
                  <div className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-xs font-bold ${
                    getCosplayerTier(photo.cosplayerId) === 'legendary' ? 'bg-yellow-500/30 text-yellow-300' :
                    getCosplayerTier(photo.cosplayerId) === 'elite' ? 'bg-purple-500/30 text-purple-300' :
                    getCosplayerTier(photo.cosplayerId) === 'rare' ? 'bg-blue-500/30 text-blue-300' :
                    'bg-gray-500/30 text-gray-300'
                  }`}>
                    {getCosplayerTier(photo.cosplayerId)[0].toUpperCase()}
                  </div>
                </div>

                {/* Info */}
                <div className="p-2.5">
                  <div className="text-sm font-bold truncate">{photo.cosplayerName}</div>
                  <div className="text-xs text-gray-500 truncate">{photo.costume}</div>
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-600">
                    <span>{SHOT_TYPE_INFO[photo.shotType].icon}</span>
                    <span>{POSE_INFO[photo.pose].icon}</span>
                    <span>f/{photo.settings.aperture}</span>
                    <span>{formatShutter(photo.settings.shutterSpeed)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="text-green-400">${photo.moneyEarned}</span>
                    <span className="text-purple-400">+{photo.xpEarned}xp</span>
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
