import { useState } from 'react';
import { CameraSettings, ShotType, PoseType, CompositionType, Cosplayer, Location, Equipment, APERTURE_VALUES, SHUTTER_SPEEDS, ISO_VALUES, FOCAL_LENGTHS, SHOT_TYPE_INFO, POSE_INFO, COMPOSITION_INFO } from '../types';

interface Props {
  cosplayer: Cosplayer;
  location: Location;
  settings: CameraSettings;
  shotType: ShotType;
  pose: PoseType;
  composition: CompositionType;
  equipment: Equipment;
  onUpdateSettings: (settings: Partial<CameraSettings>) => void;
  onSetShotType: (type: ShotType) => void;
  onSetPose: (pose: PoseType) => void;
  onSetComposition: (comp: CompositionType) => void;
  onTakePhoto: () => void;
  onBack: () => void;
}

function formatShutter(speed: number): string {
  if (speed >= 1) return `${speed}s`;
  return `1/${Math.round(1/speed)}`;
}

export default function CameraScreen({
  cosplayer, location, settings, shotType, pose, composition, equipment,
  onUpdateSettings, onSetShotType, onSetPose, onSetComposition, onTakePhoto, onBack
}: Props) {
  const [activeTab, setActiveTab] = useState<'exposure' | 'shot' | 'pose' | 'compose' | 'info'>('exposure');
  const [shutterAnim, setShutterAnim] = useState(false);

  const handleShutter = () => {
    setShutterAnim(true);
    setTimeout(() => {
      setShutterAnim(false);
      onTakePhoto();
    }, 400);
  };

  // Calculate exposure indicator
  const isDark = location.lightingQuality <= 3;
  const idealISO = isDark ? 1600 : location.lightingQuality === 4 ? 800 : 400;
  const exposureOk = settings.iso >= idealISO * 0.5 && settings.aperture <= (isDark ? 4 : 8);

  const getZoomScale = () => {
    switch (shotType) {
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
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Shutter animation overlay */}
      {shutterAnim && (
        <div className="fixed inset-0 z-50 bg-white animate-pulse" style={{ animationDuration: '0.2s' }} />
      )}

      {/* Top Bar */}
      <div className="bg-gray-900/95 border-b border-gray-800 px-4 py-2 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack} className="text-gray-400 hover:text-white text-sm">← Leave</button>
        <div className="flex items-center gap-3 text-xs">
          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
            cosplayer.tier === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
            cosplayer.tier === 'elite' ? 'bg-purple-500/20 text-purple-400' :
            cosplayer.tier === 'rare' ? 'bg-blue-500/20 text-blue-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>{cosplayer.tier.toUpperCase()}</span>
          <span className="text-pink-400">{cosplayer.name}</span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-400 hidden md:inline">{cosplayer.costume}</span>
        </div>
        <div className={`flex items-center gap-1 text-xs ${exposureOk ? 'text-green-400' : 'text-yellow-400'}`}>
          <div className={`w-2 h-2 rounded-full ${exposureOk ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'}`} />
          <span className="hidden md:inline">{exposureOk ? 'Good Exposure' : 'Check Settings'}</span>
        </div>
      </div>

      {/* Viewfinder Area */}
      <div className="flex-1 relative flex items-center justify-center p-4 min-h-[280px] max-h-[45vh]">
        <div className="relative w-full max-w-lg aspect-[3/4] rounded-lg overflow-hidden border-2 border-gray-700 shadow-2xl">
          {/* Background/Location */}
          <img src={location.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />

          {/* Subject */}
          <img
            src={cosplayer.image}
            alt={cosplayer.name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${getZoomScale()}`}
            style={{
              filter: `brightness(${settings.iso >= 800 ? 1 : 0.7}) contrast(1.1)`,
            }}
          />

          {/* Viewfinder overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Grid lines based on composition */}
            {composition === 'rule_of_thirds' && (
              <div className="absolute inset-0">
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/20" />
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/20" />
                <div className="absolute top-1/3 left-0 right-0 h-px bg-white/20" />
                <div className="absolute top-2/3 left-0 right-0 h-px bg-white/20" />
              </div>
            )}
            {composition === 'centered' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border border-white/20 rounded-full" />
                <div className="absolute w-2 h-2 bg-white/40 rounded-full" />
              </div>
            )}
            {composition === 'leading_lines' && (
              <div className="absolute inset-0">
                <div className="absolute top-0 left-1/2 w-px h-full bg-white/10 -rotate-12 origin-top" />
                <div className="absolute top-0 left-1/2 w-px h-full bg-white/10 rotate-12 origin-top" />
              </div>
            )}
            {composition === 'frame_within_frame' && (
              <div className="absolute inset-4 border-2 border-white/15 rounded-lg" />
            )}
            {composition === 'dutch_angle' && (
              <div className="absolute inset-0 rotate-12 origin-center">
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/10" />
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/10" />
              </div>
            )}
            {composition === 'profile' && (
              <div className="absolute inset-0">
                <div className="absolute right-1/3 top-0 bottom-0 w-px bg-cyan-400/20" />
              </div>
            )}

            {/* Focus point */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 border border-green-400/60 rounded-sm flex items-center justify-center">
                <div className="w-1 h-1 bg-green-400 rounded-full" />
              </div>
            </div>

            {/* Corner brackets */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-white/30" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-white/30" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-white/30" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-white/30" />
          </div>

          {/* HUD overlay info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <div className="flex justify-between text-xs font-mono text-green-400/80">
              <span>f/{settings.aperture}</span>
              <span>{formatShutter(settings.shutterSpeed)}</span>
              <span>ISO {settings.iso}</span>
              <span>{settings.focalLength}mm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="bg-gray-900 border-t border-gray-800 flex-shrink-0">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-800 overflow-x-auto">
          {[
            { id: 'exposure' as const, label: '📊 Exposure' },
            { id: 'shot' as const, label: '🎯 Shot' },
            { id: 'pose' as const, label: '💃 Pose' },
            { id: 'compose' as const, label: '📐 Angle' },
            { id: 'info' as const, label: '📋 Info' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[70px] py-2.5 text-xs font-medium transition whitespace-nowrap px-2 ${
                activeTab === tab.id
                  ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-3 max-h-44 overflow-y-auto">
          {activeTab === 'exposure' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Aperture</label>
                <select
                  value={settings.aperture}
                  onChange={e => onUpdateSettings({ aperture: parseFloat(e.target.value) })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm text-white"
                >
                  {APERTURE_VALUES.map(v => (
                    <option key={v} value={v}>f/{v}</option>
                  ))}
                </select>
                <div className="text-xs text-gray-500 mt-1">
                  {settings.aperture <= 2.8 ? '🌙 Shallow DOF' : settings.aperture <= 8 ? '⚖️ Balanced' : '🔍 Deep DOF'}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Shutter</label>
                <select
                  value={settings.shutterSpeed}
                  onChange={e => onUpdateSettings({ shutterSpeed: parseFloat(e.target.value) })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm text-white"
                >
                  {SHUTTER_SPEEDS.map(v => (
                    <option key={v} value={v}>{formatShutter(v)}</option>
                  ))}
                </select>
                <div className="text-xs text-gray-500 mt-1">
                  {settings.shutterSpeed >= 1/250 ? '⚡ Freeze' : settings.shutterSpeed >= 1/60 ? '⚠️ Risk' : '🌀 Blur'}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">ISO</label>
                <select
                  value={settings.iso}
                  onChange={e => onUpdateSettings({ iso: parseInt(e.target.value) })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm text-white"
                >
                  {ISO_VALUES.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
                <div className="text-xs text-gray-500 mt-1">
                  {settings.iso <= 400 ? '✨ Clean' : settings.iso <= 1600 ? '📺 Some noise' : '🔥 Noisy'}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Focal Length</label>
                <select
                  value={settings.focalLength}
                  onChange={e => onUpdateSettings({ focalLength: parseInt(e.target.value) })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm text-white"
                >
                  {FOCAL_LENGTHS.map(v => (
                    <option key={v} value={v}>{v}mm</option>
                  ))}
                </select>
                <div className="text-xs text-gray-500 mt-1">
                  {settings.focalLength <= 35 ? '🌐 Wide' : settings.focalLength <= 85 ? '👤 Portrait' : '🔭 Tele'}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shot' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(Object.entries(SHOT_TYPE_INFO) as [ShotType, typeof SHOT_TYPE_INFO[ShotType]][]).map(([key, info]) => {
                const isPreferred = cosplayer.preferredShots.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => onSetShotType(key)}
                    className={`p-2 rounded-lg border text-left transition relative ${
                      shotType === key
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                        : 'border-gray-700 hover:border-gray-500 text-gray-400'
                    }`}
                  >
                    {isPreferred && <span className="absolute top-1 right-1 text-xs bg-green-500/20 text-green-400 px-1 rounded">★</span>}
                    <div className="text-lg mb-0.5">{info.icon}</div>
                    <div className="text-xs font-medium">{info.label}</div>
                    <div className="text-xs opacity-60 mt-0.5 leading-tight">{info.description}</div>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'pose' && (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {(Object.entries(POSE_INFO) as [PoseType, typeof POSE_INFO[PoseType]][]).map(([key, info]) => {
                const isPreferred = cosplayer.preferredPoses.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => onSetPose(key)}
                    className={`p-2 rounded-lg border text-left transition relative ${
                      pose === key
                        ? 'border-pink-500 bg-pink-500/20 text-pink-300'
                        : 'border-gray-700 hover:border-gray-500 text-gray-400'
                    }`}
                  >
                    {isPreferred && <span className="absolute top-0.5 right-0.5 text-xs bg-green-500/20 text-green-400 px-1 rounded">★</span>}
                    <div className="text-lg mb-0.5">{info.icon}</div>
                    <div className="text-xs font-medium">{info.label}</div>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'compose' && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {(Object.entries(COMPOSITION_INFO) as [CompositionType, typeof COMPOSITION_INFO[CompositionType]][]).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => onSetComposition(key)}
                  className={`p-2 rounded-lg border text-left transition ${
                    composition === key
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                      : 'border-gray-700 hover:border-gray-500 text-gray-400'
                  }`}
                >
                  <div className="text-lg mb-0.5">{info.icon}</div>
                  <div className="text-xs font-medium">{info.label}</div>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-3">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <h4 className="text-xs font-bold text-purple-400 mb-1">💡 Photographer Tips for {cosplayer.name}</h4>
                <p className="text-xs text-gray-300">{cosplayer.tips}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <h4 className="text-xs font-bold text-pink-400 mb-1">👗 Outfit Details</h4>
                <div className="text-xs text-gray-300 space-y-1">
                  <div><span className="text-gray-500">Top:</span> {cosplayer.outfitDetails.top}</div>
                  <div><span className="text-gray-500">Bottom:</span> {cosplayer.outfitDetails.bottom}</div>
                  <div><span className="text-gray-500">Accessories:</span> {cosplayer.outfitDetails.accessories.join(', ')}</div>
                  <div><span className="text-gray-500">Hair:</span> {cosplayer.outfitDetails.hair}</div>
                  <div><span className="text-gray-500">Colors:</span> {cosplayer.outfitDetails.colors.join(', ')}</div>
                  <div><span className="text-gray-500">Fabric:</span> {cosplayer.outfitDetails.fabric}</div>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <h4 className="text-xs font-bold text-cyan-400 mb-1">📍 Location: {location.name}</h4>
                <p className="text-xs text-gray-400">{location.ambience}</p>
                <div className="text-xs text-gray-500 mt-1">Props: {location.props.join(', ')}</div>
              </div>
            </div>
          )}
        </div>

        {/* Shutter Button */}
        <div className="flex items-center justify-center pb-3 pt-2 border-t border-gray-800">
          <button
            onClick={handleShutter}
            className="w-14 h-14 rounded-full bg-gradient-to-b from-gray-200 to-gray-400 border-4 border-gray-600 shadow-lg hover:from-white hover:to-gray-300 active:scale-95 transition-all flex items-center justify-center"
          >
            <div className="w-9 h-9 rounded-full border-2 border-gray-500 bg-gray-300" />
          </button>
          <div className="ml-4 text-xs text-gray-500 hidden md:block">
            <div>{equipment.body} • {equipment.lens}</div>
            <div className="flex gap-2 mt-0.5">
              {equipment.flash && <span className="text-yellow-400">💡</span>}
              {equipment.reflector && <span className="text-cyan-400">🪞</span>}
              {equipment.tripod && <span className="text-green-400">📐</span>}
              {equipment.colorFilter && <span className="text-purple-400">🎨</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
