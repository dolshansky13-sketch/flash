import { Cosplayer, Location, POSE_INFO, PoseType, SHOT_TYPE_INFO } from '../types';

interface Props {
  location: Location;
  cosplayers: Cosplayer[];
  onSelect: (cosplayer: Cosplayer) => void;
  onBack: () => void;
}

export default function EncounterScreen({ location, cosplayers, onSelect, onBack }: Props) {
  const tierColors = {
    common: 'border-gray-500/30 hover:border-gray-400/60',
    rare: 'border-blue-500/30 hover:border-blue-400/60',
    elite: 'border-purple-500/30 hover:border-purple-400/60',
    legendary: 'border-yellow-500/30 hover:border-yellow-400/60',
  };

  const tierBadgeColors = {
    common: 'bg-gray-500/20 text-gray-400',
    rare: 'bg-blue-500/20 text-blue-400',
    elite: 'bg-purple-500/20 text-purple-400',
    legendary: 'bg-yellow-500/20 text-yellow-400',
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Location Header */}
      <div className="relative h-40 overflow-hidden">
        <img src={location.image} alt={location.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={onBack}
            className="text-sm text-gray-400 hover:text-white transition mb-2 flex items-center gap-1"
          >
            ← Back to locations
          </button>
          <h1 className="text-2xl font-bold">{location.name}</h1>
          <p className="text-gray-400 text-sm">{cosplayers.length} cosplayer{cosplayers.length !== 1 ? 's' : ''} here</p>
          <p className="text-gray-500 text-xs mt-1 italic">{location.ambience}</p>
        </div>
      </div>

      {/* Cosplayer Grid */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-pink-400">👥</span> Available Subjects
          <span className="text-xs text-gray-500 font-normal ml-2">Tap to approach</span>
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cosplayers.map(cosplayer => (
            <div
              key={cosplayer.id}
              className={`bg-gray-900 rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer group hover:scale-[1.01] hover:shadow-xl ${tierColors[cosplayer.tier]}`}
              onClick={() => onSelect(cosplayer)}
            >
              {/* Character Image */}
              <div className="h-64 relative overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={cosplayer.image}
                  alt={cosplayer.name}
                  className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${tierBadgeColors[cosplayer.tier]}`}>
                      {cosplayer.tier.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">{cosplayer.archetype}</span>
                  </div>
                  <h3 className="text-xl font-bold">{cosplayer.name}</h3>
                  <p className="text-pink-400 text-sm font-medium">{cosplayer.costume}</p>
                </div>
                {/* Difficulty badge */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= cosplayer.difficulty ? 'bg-yellow-400' : 'bg-gray-600'}`} />
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-gray-400 text-xs mb-2 line-clamp-2">{cosplayer.description}</p>
                
                {/* Outfit highlights */}
                <div className="mb-2">
                  <div className="flex flex-wrap gap-1">
                    {cosplayer.outfitDetails.colors.slice(0, 4).map(color => (
                      <span key={color} className="text-xs bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preferred poses */}
                <div className="flex flex-wrap gap-1 mb-2">
                  <span className="text-xs text-gray-500 mr-1">Best:</span>
                  {cosplayer.preferredPoses.slice(0, 3).map(p => (
                    <span key={p} className="text-xs bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-full">
                      {POSE_INFO[p as PoseType]?.icon}
                    </span>
                  ))}
                </div>

                {/* Preferred shots */}
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs text-gray-500 mr-1">Shots:</span>
                  {cosplayer.preferredShots.slice(0, 3).map(s => (
                    <span key={s} className="text-xs bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded-full">
                      {SHOT_TYPE_INFO[s as keyof typeof SHOT_TYPE_INFO]?.icon}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {cosplayers.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <div className="text-4xl mb-4">🌙</div>
            <p>No cosplayers in this area right now.</p>
            <p className="text-sm mt-2">Try another location!</p>
          </div>
        )}
      </div>
    </div>
  );
}
