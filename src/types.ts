export interface CameraSettings {
  aperture: number; // f/1.4 to f/22
  shutterSpeed: number; // in seconds (fraction stored as number)
  iso: number; // 100 to 6400
  focalLength: number; // 24mm to 200mm
}

export type ShotType = 'extreme_closeup' | 'closeup' | 'bust' | 'medium' | 'cowboy' | 'fullbody' | 'wide' | 'detail';
export type PoseType = 
  | 'confident' | 'playful' | 'seductive' | 'dramatic' | 'candid' | 'action'
  | 'over_shoulder' | 'sitting' | 'leaning' | 'hands_in_hair' | 'kneeling' | 'back_pose'
  | 'peace_sign' | 'heart_hands' | 'head_tilt' | 'lip_bite';
export type CompositionType = 
  | 'rule_of_thirds' | 'centered' | 'leading_lines' | 'frame_within_frame' 
  | 'low_angle' | 'high_angle' | 'dutch_angle' | 'profile' | 'overhead' | 'reflection';

export interface OutfitDetail {
  top: string;
  bottom: string;
  accessories: string[];
  footwear: string;
  hair: string;
  makeup: string;
  colors: string[];
  fabric: string;
}

export interface Cosplayer {
  id: string;
  name: string;
  costume: string;
  archetype: string; // JAV cosplay archetype category
  description: string;
  outfitDetails: OutfitDetail;
  image: string;
  personality: string;
  preferredPoses: PoseType[];
  preferredShots: ShotType[];
  preferredLighting: string;
  difficulty: number; // 1-5
  unlocked: boolean;
  location: string;
  tier: 'common' | 'rare' | 'elite' | 'legendary';
  tips: string; // photographer tips for this character
}

export interface Location {
  id: string;
  name: string;
  description: string;
  image: string;
  lighting: string;
  lightingQuality: number; // 1-5
  requiredReputation: number;
  unlocked: boolean;
  ambience: string;
  props: string[];
}

export interface Photo {
  id: string;
  cosplayerId: string;
  cosplayerName: string;
  costume: string;
  locationId: string;
  locationName: string;
  settings: CameraSettings;
  shotType: ShotType;
  pose: PoseType;
  composition: CompositionType;
  score: number; // 0-100
  stars: number; // 1-5
  timestamp: number;
  feedback: string[];
  moneyEarned: number;
  xpEarned: number;
}

export interface GameState {
  screen: 'title' | 'location' | 'encounter' | 'camera' | 'review' | 'portfolio' | 'shop' | 'achievements';
  currentLocation: Location | null;
  currentCosplayer: Cosplayer | null;
  cameraSettings: CameraSettings;
  shotType: ShotType;
  pose: PoseType;
  composition: CompositionType;
  portfolio: Photo[];
  reputation: number;
  money: number;
  level: number;
  xp: number;
  xpToNext: number;
  equipment: Equipment;
  photosTaken: number;
  bestScore: number;
  achievements: string[];
  totalMoneyEarned: number;
}

export interface Equipment {
  lens: string;
  body: string;
  flash: boolean;
  reflector: boolean;
  tripod: boolean;
  colorFilter: boolean;
}

export const APERTURE_VALUES = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];
export const SHUTTER_SPEEDS = [1/8000, 1/4000, 1/2000, 1/1000, 1/500, 1/250, 1/125, 1/60, 1/30, 1/15];
export const ISO_VALUES = [100, 200, 400, 800, 1600, 3200, 6400];
export const FOCAL_LENGTHS = [24, 35, 50, 85, 105, 135, 200];

export const SHOT_TYPE_INFO: Record<ShotType, { label: string; description: string; icon: string }> = {
  extreme_closeup: { label: 'Extreme Close-Up', description: 'Eyes, lips, or detail focus', icon: '👁️' },
  closeup: { label: 'Close-Up', description: 'Face and upper body', icon: '👤' },
  bust: { label: 'Bust Shot', description: 'Head and shoulders framing', icon: '🖼️' },
  medium: { label: 'Medium Shot', description: 'Waist-up composition', icon: '🧍' },
  cowboy: { label: 'Cowboy Shot', description: 'Mid-thigh up, shows belt/outfit', icon: '🤠' },
  fullbody: { label: 'Full Body', description: 'Head to toe, full costume', icon: '🦶' },
  wide: { label: 'Wide Shot', description: 'Subject + environment context', icon: '🏞️' },
  detail: { label: 'Detail Shot', description: 'Costume details, textures, props', icon: '🔍' },
};

export const POSE_INFO: Record<PoseType, { label: string; description: string; icon: string }> = {
  confident: { label: 'Confident', description: 'Strong stance, hands on hips, chin up', icon: '💪' },
  playful: { label: 'Playful', description: 'Fun, energetic, animated expression', icon: '✨' },
  seductive: { label: 'Seductive', description: 'Alluring gaze, slight smile, body angle', icon: '💋' },
  dramatic: { label: 'Dramatic', description: 'Theatrical, intense emotion, flowing fabric', icon: '🎭' },
  candid: { label: 'Candid', description: 'Natural unposed moment, laughing or distracted', icon: '📸' },
  action: { label: 'Action', description: 'Dynamic movement, hair flowing, energy', icon: '⚡' },
  over_shoulder: { label: 'Over Shoulder', description: 'Looking back, mysterious, shows back details', icon: '🔄' },
  sitting: { label: 'Sitting', description: 'Cross-legged or on edge, relaxed elegance', icon: '🪑' },
  leaning: { label: 'Leaning', description: 'Against wall or prop, casual cool', icon: '🧱' },
  hands_in_hair: { label: 'Hands in Hair', description: 'Arms raised, shows outfit lines, glamorous', icon: '💇' },
  kneeling: { label: 'Kneeling', description: 'Low pose, dramatic perspective, powerful', icon: '🧎' },
  back_pose: { label: 'Back Pose', description: 'Facing away, looking back, shows back design', icon: '🔙' },
  peace_sign: { label: 'Peace Sign', description: 'Classic kawaii V-sign, cute and youthful', icon: '✌️' },
  heart_hands: { label: 'Heart Hands', description: 'Fingers forming heart shape, adorable', icon: '💕' },
  head_tilt: { label: 'Head Tilt', description: 'Curious tilt, innocent look, endearing', icon: '🤔' },
  lip_bite: { label: 'Lip Bite', description: 'Sultry, intense, magazine cover energy', icon: '😏' },
};

export const COMPOSITION_INFO: Record<CompositionType, { label: string; description: string; icon: string }> = {
  rule_of_thirds: { label: 'Rule of Thirds', description: 'Subject off-center, balanced composition', icon: '📐' },
  centered: { label: 'Centered', description: 'Subject in middle, symmetrical power', icon: '🎯' },
  leading_lines: { label: 'Leading Lines', description: 'Environmental lines guide eye to subject', icon: '➡️' },
  frame_within_frame: { label: 'Frame in Frame', description: 'Natural framing elements surround subject', icon: '🖼️' },
  low_angle: { label: 'Low Angle', description: 'Looking up, powerful and dominant', icon: '📷' },
  high_angle: { label: 'High Angle', description: 'Looking down, vulnerable or cute', icon: '🔽' },
  dutch_angle: { label: 'Dutch Angle', description: 'Tilted camera, dynamic tension', icon: '📊' },
  profile: { label: 'Profile', description: 'Side view, shows silhouette and profile', icon: '👃' },
  overhead: { label: 'Overhead', description: 'Bird\'s eye view, unique perspective', icon: '🦅' },
  reflection: { label: 'Reflection', description: 'Mirror or surface reflection adds depth', icon: '🪞' },
};
