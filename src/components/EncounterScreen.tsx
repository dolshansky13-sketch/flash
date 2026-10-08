import { Cosplayer, Location, POSE_INFO, PoseType } from '../types';

interface Props {
  location: Location;
  cosplayers: Cosplayer[];
  onSelect: (cosplayer: Cosplayer) => void;
  onBack: () => void;
}

export default function EncounterScreen({ location, cosplayers, onSelect, onBack }: Props) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Location Header */}
      <div className="relative h-48 overflow-hidden">
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
        </div>
      </div>

      {/* Cosplayer Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="text-pink-400">👥</span> Available Subjects
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cosplayers.map(cosplayer => (
            <div
              key={cosplayer.id}
              className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-pink-500/50 transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:shadow-xl hover:shadow-pink-500/10"
              onClick={() => onSelect(cosplayer)}
            >
              {/* Character Image */}
              <div className="h-72 relative overflow-hidden">
                <img
                  src={cosplayer.image}
                  alt={cosplayer.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
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
              <div className="p-4">
                <p className="text-gray-400 text-sm mb-3">{cosplayer.description}</p>
                <div className="mb-3">
                  <span className="text-xs text-gray-500">Personality: </span>
                  <span className="text-xs text-gray-300">{cosplayer.personality}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs text-gray-500 mr-1">Best poses:</span>
                  {cosplayer.preferredPoses.map(pose => (
                    <span key={pose} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                      {POSE_INFO[pose as PoseType]?.icon} {POSE_INFO[pose as PoseType]?.label}
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
