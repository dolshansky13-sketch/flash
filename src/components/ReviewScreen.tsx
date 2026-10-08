import { Photo, Cosplayer, Location, SHOT_TYPE_INFO, POSE_INFO, COMPOSITION_INFO } from '../types';
import { getScoreLabel } from '../scoring';

interface Props {
  photo: Photo;
  cosplayer: Cosplayer;
  location: Location;
  onContinue: () => void;
  onLocation: () => void;
  onPortfolio: () => void;
}

function formatShutter(speed: number): string {
  if (speed >= 1) return `${speed}s`;
  return `1/${Math.round(1/speed)}`;
}

export default function ReviewScreen({ photo, cosplayer, location, onContinue, onLocation, onPortfolio }: Props) {
  const scoreColor = photo.score >= 75 ? 'text-green-400' : photo.score >= 50 ? 'text-yellow-400' : 'text-red-400';
  const scoreBg = photo.score >= 75 ? 'from-green-500/20 to-green-500/5' : photo.score >= 50 ? 'from-yellow-500/20 to-yellow-500/5' : 'from-red-500/20 to-red-500/5';

  const getZoomScale = () => {
    switch (photo.shotType) {
      case 'extreme_closeup': return 'scale-[2.5] translate-y-16';
      case 'closeup': return 'scale-[1.8] translate-y-10';
      case 'bust': return 'scale-[1.5] translate-y-6';
      case 'medium': return 'scale-125 translate-y-4';
      case 'cowboy': return 'scale-110 translate-y-2';
      case 'fullbody': return 'scale-100';
      case 'wide': return 'scale-90';
      case 'detail': return 'scale-[2.2] translate-x-4 translate-y-4';
      default: return 'scale-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold">📸 Photo Review</h1>
          <div className="flex gap-3">
            <span className="text-xs text-green-400">+${photo.moneyEarned}</span>
            <span className="text-xs text-purple-400">+{photo.xpEarned} XP</span>
            <button onClick={onPortfolio} className="text-xs text-purple-400 hover:text-purple-300">Portfolio →</button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Photo Display */}
        <div className="relative rounded-xl overflow-hidden mb-6 border border-gray-800">
          <div className="aspect-[3/4] max-h-[380px] relative">
            <img src={location.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <img
              src={cosplayer.image}
              alt={cosplayer.name}
              className={`absolute inset-0 w-full h-full object-cover transition-all ${getZoomScale()}`}
              style={{ filter: `brightness(${photo.settings.iso >= 800 ? 1 : 0.7}) contrast(1.1)` }}
            />
            {/* Score overlay */}
            <div className={`absolute top-4 right-4 bg-gradient-to-br ${scoreBg} backdrop-blur-md rounded-xl p-4 border border-gray-700/50`}>
              <div className={`text-4xl font-black ${scoreColor}`}>{photo.score}</div>
              <div className="flex gap-0.5 mt-1">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className={`text-sm ${i <= photo.stars ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
                ))}
              </div>
              <div className={`text-xs font-bold mt-1 ${scoreColor}`}>{getScoreLabel(photo.score)}</div>
            </div>
            {/* Tier badge */}
            <div className={`absolute top-4 left-4 px-2 py-1 rounded text-xs font-bold ${
              cosplayer.tier === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
              cosplayer.tier === 'elite' ? 'bg-purple-500/20 text-purple-400' :
              cosplayer.tier === 'rare' ? 'bg-blue-500/20 text-blue-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {cosplayer.tier.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Shot Details */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Technical Details */}
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Camera Settings</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-800/50 rounded-lg p-2">
                <div className="text-xs text-gray-500">Aperture</div>
                <div className="text-sm font-mono text-white">f/{photo.settings.aperture}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-2">
                <div className="text-xs text-gray-500">Shutter</div>
                <div className="text-sm font-mono text-white">{formatShutter(photo.settings.shutterSpeed)}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-2">
                <div className="text-xs text-gray-500">ISO</div>
                <div className="text-sm font-mono text-white">{photo.settings.iso}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-2">
                <div className="text-xs text-gray-500">Focal Length</div>
                <div className="text-sm font-mono text-white">{photo.settings.focalLength}mm</div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                {SHOT_TYPE_INFO[photo.shotType].icon} {SHOT_TYPE_INFO[photo.shotType].label}
              </span>
              <span className="text-xs bg-pink-500/20 text-pink-300 px-2 py-1 rounded">
                {POSE_INFO[photo.pose].icon} {POSE_INFO[photo.pose].label}
              </span>
              <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">
                {COMPOSITION_INFO[photo.composition].icon} {COMPOSITION_INFO[photo.composition].label}
              </span>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Photographer Notes</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {photo.feedback.map((note, i) => (
                <div key={i} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="mt-0.5 flex-shrink-0">{note.substring(0, 2)}</span>
                  <span>{note.substring(2).trim()}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-800">
              <div className="text-xs text-gray-500">
                Earned: <span className="text-green-400">${photo.moneyEarned}</span> • <span className="text-purple-400">{photo.xpEarned} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={onContinue}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold hover:from-purple-500 hover:to-pink-500 transition shadow-lg shadow-purple-500/20"
          >
            📸 Shoot Again
          </button>
          <button
            onClick={onLocation}
            className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg font-bold hover:bg-gray-700 transition"
          >
            🗺️ Change Location
          </button>
          <button
            onClick={onPortfolio}
            className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg font-bold hover:bg-gray-700 transition"
          >
            📁 Portfolio
          </button>
        </div>
      </div>
    </div>
  );
}
