import { useState, useEffect } from 'react';
import { CameraSettings, ShotType, PoseType, CompositionType, Cosplayer, Location, Equipment, APERTURE_VALUES, SHUTTER_SPEEDS, ISO_VALUES, FOCAL_LENGTHS, SHOT_TYPE_INFO, POSE_INFO, COMPOSITION_INFO, getCosplayerImage } from '../types';

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
  const [activeTab, setActiveTab] = useState<'exposure' | 'shot' | 'pose' | 'compose' | 'info'>('pose');
  const [shutterAnim, setShutterAnim] = useState(false);

  const handleShutter = () => {
    setShutterAnim(true);
    setTimeout(() => {
      setShutterAnim(false);
      onTakePhoto();
    }, 300);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleShutter();
      }
      if (e.key === 'Escape') {
        onBack();
      }
      // Number keys for quick pose selection
      const poseKeys = Object.keys(POSE_INFO) as PoseType[];
      const num = parseInt(e.key);
      if (num >= 1 && num <= 9 && activeTab === 'pose') {
        const idx = num - 1;
        if (idx < poseKeys.length) {
          onSetPose(poseKeys[idx]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, onSetPose, onBack]);

  const isDark = location.lightingQuality <= 3;
  const idealISO = isDark ? 1600 : location.lightingQuality === 4 ? 800 : 400;
  const exposureOk = settings.iso >= idealISO * 0.5 && settings.aperture <= (isDark ? 4 : 8);

  // Get the actual image for current pose
  const currentImage = getCosplayerImage(cosplayer, pose);
  
  // Get shot type transform
  const shotInfo = SHOT_TYPE_INFO[shotType];
  const imgTransform = `scale(${shotInfo.zoom}) translateY(${shotInfo.translateY}%)`;
  
  // Get composition rotation
  const compInfo = COMPOSITION_INFO[composition];
  const rotation = compInfo.rotate || 0;

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Shutter animation overlay */}
      {shutterAnim && (
        <div className="fixed inset-0 z-50 bg-white pointer-events-none" 
          style={{ animation: 'flash 0.3s ease-out' }} />
      )}

      {/* Top Bar */}
      <div className="bg-gray-900 border-b border-gray-800 px-3 py-2 flex items-center justify-between flex-shrink-0">
        <button onClick={onBack} className="text-gray-400 hover:text-white text-sm flex items-center gap-1">
          ← Back
        </button>
        <div className="flex items-center gap-2 text-xs">
          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
            cosplayer.tier === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
            cosplayer.tier === 'elite' ? 'bg-purple-500/20 text-purple-400' :
            cosplayer.tier === 'rare' ? 'bg-blue-500/20 text-blue-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>{cosplayer.tier.toUpperCase()}</span>
          <span className="text-pink-400 font-medium">{cosplayer.name}</span>
          <span className="text-gray-600 hidden sm:inline">•</span>
          <span className="text-gray-400 hidden sm:inline text-xs">{cosplayer.costume}</span>
        </div>
        <div className={`flex items-center gap-1 text-xs ${exposureOk ? 'text-green-400' : 'text-yellow-400'}`}>
          <div className={`w-2 h-2 rounded-full ${exposureOk ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'}`} />
        </div>
      </div>

      {/* Viewfinder Area */}
      <div className="flex-1 flex items-center justify-center p-2 bg-gray-950 min-h-0">
        <div className="relative w-full max-w-md aspect-[3/4] rounded-lg overflow-hidden border-2 border-gray-700 shadow-2xl bg-black">
          {/* Background */}
          <img 
            src={location.image} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover opacity-30" 
          />
          
          {/* Subject - THIS IS THE KEY: actually changes based on pose */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <img
              key={`${cosplayer.id}-${pose}`}
              src={currentImage}
              alt={`${cosplayer.name} - ${POSE_INFO[pose].label}`}
              className="max-w-full max-h-full object-contain transition-all duration-300"
              style={{
                transform: `${imgTransform} rotate(${rotation}deg)`,
                filter: `brightness(${settings.iso >= 800 ? 1 : 0.7}) contrast(1.1)`,
              }}
            />
          </div>

          {/* Composition overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {composition === 'rule_of_thirds' && (
              <>
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/20" />
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/20" />
                <div className="absolute top-1/3 left-0 right-0 h-px bg-white/20" />
                <div className="absolute top-2/3 left-0 right-0 h-px bg-white/20" />
              </>
            )}
            {composition === 'centered' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 border border-white/20 rounded-full" />
                <div className="absolute w-1.5 h-1.5 bg-white/40 rounded-full" />
              </div>
            )}
            {composition === 'frame_within_frame' && (
              <div className="absolute inset-4 border-2 border-white/15 rounded-lg" />
            )}
            {composition === 'leading_lines' && (
              <>
                <div className="absolute top-0 left-1/3 w-px h-full bg-white/10" />
                <div className="absolute top-0 left-2/3 w-px h-full bg-white/10" />
              </>
            )}

            {/* Focus point */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 border border-green-400/60 rounded-sm flex items-center justify-center">
                <div className="w-1 h-1 bg-green-400 rounded-full" />
              </div>
            </div>

            {/* Corner brackets */}
            <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-white/30" />
            <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-white/30" />
            <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-white/30" />
            <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-white/30" />
          </div>

          {/* HUD */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
            <div className="flex justify-between text-[10px] font-mono text-green-400/80">
              <span>f/{settings.aperture}</span>
              <span>{formatShutter(settings.shutterSpeed)}</span>
              <span>ISO {settings.iso}</span>
              <span>{settings.focalLength}mm</span>
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
              <span>{SHOT_TYPE_INFO[shotType].icon} {SHOT_TYPE_INFO[shotType].label}</span>
              <span>{POSE_INFO[pose].icon} {POSE_INFO[pose].label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="bg-gray-900 border-t border-gray-800 flex-shrink-0">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-800">
          {[
            { id: 'pose' as const, label: '💃 Pose' },
            { id: 'shot' as const, label: '🎯 Shot' },
            { id: 'compose' as const, label: '📐 Angle' },
            { id: 'exposure' as const, label: '📊 Settings' },
            { id: 'info' as const, label: '📋 Info' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-xs font-medium transition ${
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
        <div className="p-3 h-36 overflow-y-auto">
          {activeTab === 'pose' && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
              {(Object.entries(POSE_INFO) as [PoseType, typeof POSE_INFO[PoseType]][]).map(([key, info], idx) => {
                const isPreferred = cosplayer.preferredPoses.includes(key);
                const hasImage = cosplayer.poseImages && cosplayer.poseImages[key];
                return (
                  <button
                    key={key}
                    onClick={() => onSetPose(key)}
                    className={`p-1.5 rounded border text-center transition relative ${
                      pose === key
                        ? 'border-pink-500 bg-pink-500/20 text-pink-300 scale-105'
                        : 'border-gray-700 hover:border-gray-500 text-gray-400 hover:text-gray-200'
                    }`}
                    title={`${info.label}: ${info.description}`}
                  >
                    {isPreferred && <span className="absolute -top-1 -right-1 text-[8px] bg-green-500 text-white w-3 h-3 rounded-full flex items-center justify-center">★</span>}
                    {hasImage && <span className="absolute -top-1 -left-1 text-[8px] bg-blue-500 text-white w-3 h-3 rounded-full flex items-center justify-center">📷</span>}
                    <div className="text-sm">{info.icon}</div>
                    <div className="text-[9px] font-medium leading-tight mt-0.5">{info.label}</div>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'shot' && (
            <div className="grid grid-cols-4 gap-1.5">
              {(Object.entries(SHOT_TYPE_INFO) as [ShotType, typeof SHOT_TYPE_INFO[ShotType]][]).map(([key, info]) => {
                const isPreferred = cosplayer.preferredShots.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => onSetShotType(key)}
                    className={`p-2 rounded border text-center transition relative ${
                      shotType === key
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300 scale-105'
                        : 'border-gray-700 hover:border-gray-500 text-gray-400 hover:text-gray-200'
                    }`}
                    title={info.description}
                  >
                    {isPreferred && <span className="absolute -top-1 -right-1 text-[8px] bg-green-500 text-white w-3 h-3 rounded-full flex items-center justify-center">★</span>}
                    <div className="text-lg">{info.icon}</div>
                    <div className="text-[9px] font-medium leading-tight mt-0.5">{info.label}</div>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'compose' && (
            <div className="grid grid-cols-5 gap-1.5">
              {(Object.entries(COMPOSITION_INFO) as [CompositionType, typeof COMPOSITION_INFO[CompositionType]][]).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => onSetComposition(key)}
                  className={`p-2 rounded border text-center transition ${
                    composition === key
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 scale-105'
                      : 'border-gray-700 hover:border-gray-500 text-gray-400 hover:text-gray-200'
                  }`}
                  title={info.description}
                >
                  <div className="text-lg">{info.icon}</div>
                  <div className="text-[8px] font-medium leading-tight mt-0.5">{info.label}</div>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'exposure' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-gray-400 mb-0.5 block">Aperture</label>
                <select
                  value={settings.aperture}
                  onChange={e => onUpdateSettings({ aperture: parseFloat(e.target.value) })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white"
                >
                  {APERTURE_VALUES.map(v => (
                    <option key={v} value={v}>f/{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 mb-0.5 block">Shutter</label>
                <select
                  value={settings.shutterSpeed}
                  onChange={e => onUpdateSettings({ shutterSpeed: parseFloat(e.target.value) })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white"
                >
                  {SHUTTER_SPEEDS.map(v => (
                    <option key={v} value={v}>{formatShutter(v)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 mb-0.5 block">ISO</label>
                <select
                  value={settings.iso}
                  onChange={e => onUpdateSettings({ iso: parseInt(e.target.value) })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white"
                >
                  {ISO_VALUES.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 mb-0.5 block">Focal Length</label>
                <select
                  value={settings.focalLength}
                  onChange={e => onUpdateSettings({ focalLength: parseInt(e.target.value) })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white"
                >
                  {FOCAL_LENGTHS.map(v => (
                    <option key={v} value={v}>{v}mm</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-2 text-xs">
              <div className="bg-gray-800/50 rounded p-2">
                <span className="text-purple-400 font-bold">💡 Tip:</span>
                <span className="text-gray-300 ml-1">{cosplayer.tips}</span>
              </div>
              <div className="bg-gray-800/50 rounded p-2">
                <span className="text-pink-400 font-bold">👗 Top:</span>
                <span className="text-gray-300 ml-1">{cosplayer.outfitDetails.top}</span>
              </div>
              <div className="bg-gray-800/50 rounded p-2">
                <span className="text-cyan-400 font-bold">📍 {location.name}:</span>
                <span className="text-gray-300 ml-1">{location.ambience}</span>
              </div>
            </div>
          )}
        </div>

        {/* Shutter Button */}
        <div className="flex items-center justify-center pb-3 pt-1 border-t border-gray-800">
          <button
            onClick={handleShutter}
            className="w-14 h-14 rounded-full bg-gradient-to-b from-gray-200 to-gray-400 border-4 border-gray-600 shadow-lg hover:from-white hover:to-gray-300 active:scale-90 transition-all flex items-center justify-center"
            title="Take Photo (Space/Enter)"
          >
            <div className="w-9 h-9 rounded-full border-2 border-gray-500 bg-gray-300" />
          </button>
          <div className="ml-3 text-[10px] text-gray-500">
            <div className="text-gray-400">Space = Shoot • Esc = Back</div>
            <div>{equipment.body} • {equipment.lens}</div>
          </div>
        </div>
      </div>

      {/* CSS for flash animation */}
      <style>{`
        @keyframes flash {
          0% { opacity: 0.8; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
