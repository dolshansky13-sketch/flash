export interface CameraSettings {
  aperture: number;
  shutterSpeed: number;
  iso: number;
  focalLength: number;
}

export type ShotType = 'extreme_closeup' | 'closeup' | 'bust' | 'medium' | 'cowboy' | 'fullbody' | 'wide' | 'detail';
export type PoseType = 
  | 'confident' | 'playful' | 'seductive' | 'dramatic' | 'candid' | 'action'
  | 'over_shoulder' | 'sitting' | 'leaning' | 'hands_in_hair' | 'kneeling' | 'back_pose'
  | 'peace_sign' | 'heart_hands' | 'head_tilt' | 'lip_bite'
  | 'ahegao' | 'pouty' | 'shy' | 'teasing' | 'curtsy' | 'stretching'
  | 'looking_away' | 'finger_on_lips' | 'arms_crossed' | 'hand_on_thigh';
export type CompositionType = 
  | 'rule_of_thirds' | 'centered' | 'leading_lines' | 'frame_within_frame' 
  | 'low_angle' | 'high_angle' | 'dutch_angle' | 'profile' | 'overhead' | 'reflection';

export interface PoseAsset {
  id: PoseType;
  image: string;
  description: string;
  cssTransform?: string;
}

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
  archetype: string;
  description: string;
  outfitDetails: OutfitDetail;
  image: string;
  poseImages?: Partial<Record<PoseType, string>>;
  personality: string;
  preferredPoses: PoseType[];
  preferredShots: ShotType[];
  preferredLighting: string;
  difficulty: number;
  unlocked: boolean;
  location: string;
  tier: 'common' | 'rare' | 'elite' | 'legendary';
  tips: string;
}

// Helper to get the right image for a pose
export function getCosplayerImage(cosplayer: Cosplayer, pose?: PoseType): string {
  if (pose && cosplayer.poseImages && cosplayer.poseImages[pose]) {
    return cosplayer.poseImages[pose]!;
  }
  return cosplayer.image;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  image: string;
  lighting: string;
  lightingQuality: number;
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
  score: number;
  stars: number;
  timestamp: number;
  feedback: string[];
  moneyEarned: number;
  xpEarned: number;
}

export interface GameState {
  screen: 'title' | 'location' | 'encounter' | 'camera' | 'review' | 'portfolio' | 'shop';
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

export const SHOT_TYPE_INFO: Record<ShotType, { label: string; description: string; icon: string; zoom: number; translateY: number }> = {
  extreme_closeup: { label: 'Extreme Close-Up', description: 'Eyes, lips, or detail focus', icon: '👁️', zoom: 2.5, translateY: 16 },
  closeup: { label: 'Close-Up', description: 'Face and upper body', icon: '👤', zoom: 1.8, translateY: 10 },
  bust: { label: 'Bust Shot', description: 'Head and shoulders framing', icon: '🖼️', zoom: 1.5, translateY: 6 },
  medium: { label: 'Medium Shot', description: 'Waist-up composition', icon: '🧍', zoom: 1.25, translateY: 4 },
  cowboy: { label: 'Cowboy Shot', description: 'Mid-thigh up', icon: '🤠', zoom: 1.1, translateY: 2 },
  fullbody: { label: 'Full Body', description: 'Head to toe, full costume', icon: '🦶', zoom: 1, translateY: 0 },
  wide: { label: 'Wide Shot', description: 'Subject + environment', icon: '🏞️', zoom: 0.9, translateY: 0 },
  detail: { label: 'Detail Shot', description: 'Costume details, textures', icon: '🔍', zoom: 2.2, translateY: 4 },
};

export const POSE_INFO: Record<PoseType, { label: string; description: string; icon: string }> = {
  confident: { label: 'Confident', description: 'Strong stance, hands on hips', icon: '💪' },
  playful: { label: 'Playful', description: 'Fun, energetic, animated', icon: '✨' },
  seductive: { label: 'Seductive', description: 'Alluring gaze, slight smile', icon: '💋' },
  dramatic: { label: 'Dramatic', description: 'Theatrical, intense emotion', icon: '🎭' },
  candid: { label: 'Candid', description: 'Natural unposed moment', icon: '📸' },
  action: { label: 'Action', description: 'Dynamic movement pose', icon: '⚡' },
  over_shoulder: { label: 'Over Shoulder', description: 'Looking back, mysterious', icon: '🔄' },
  sitting: { label: 'Sitting', description: 'Cross-legged or on edge', icon: '🪑' },
  leaning: { label: 'Leaning', description: 'Against wall or prop', icon: '🧱' },
  hands_in_hair: { label: 'Hands in Hair', description: 'Arms raised, glamorous', icon: '💇' },
  kneeling: { label: 'Kneeling', description: 'Low pose, dramatic', icon: '🧎' },
  back_pose: { label: 'Back Pose', description: 'Facing away, looking back', icon: '🔙' },
  peace_sign: { label: 'Peace Sign', description: 'Classic kawaii V-sign', icon: '✌️' },
  heart_hands: { label: 'Heart Hands', description: 'Fingers forming heart', icon: '💕' },
  head_tilt: { label: 'Head Tilt', description: 'Curious tilt, innocent', icon: '🤔' },
  lip_bite: { label: 'Lip Bite', description: 'Sultry, intense', icon: '😏' },
  ahegao: { label: 'Ahegao', description: 'Overwhelmed expression', icon: '😵' },
  pouty: { label: 'Pouty', description: 'Duck face, cute pout', icon: '😗' },
  shy: { label: 'Shy', description: 'Looking down, blushing', icon: '😳' },
  teasing: { label: 'Teasing', description: 'Winking, playful smirk', icon: '😉' },
  curtsy: { label: 'Curtsy', description: 'Elegant curtsy pose', icon: '👸' },
  stretching: { label: 'Stretching', description: 'Arms raised, back arched', icon: '🙆' },
  looking_away: { label: 'Looking Away', description: 'Profile view, thoughtful', icon: '👀' },
  finger_on_lips: { label: 'Finger on Lips', description: 'Shh gesture, mysterious', icon: '🤫' },
  arms_crossed: { label: 'Arms Crossed', description: 'Defensive but cute', icon: '💪' },
  hand_on_thigh: { label: 'Hand on Thigh', description: 'Casual, hand on thigh', icon: '🤚' },
};

export const COMPOSITION_INFO: Record<CompositionType, { label: string; description: string; icon: string; rotate?: number }> = {
  rule_of_thirds: { label: 'Rule of Thirds', description: 'Subject off-center', icon: '📐' },
  centered: { label: 'Centered', description: 'Subject in middle', icon: '🎯' },
  leading_lines: { label: 'Leading Lines', description: 'Lines guide eye', icon: '➡️' },
  frame_within_frame: { label: 'Frame in Frame', description: 'Natural framing', icon: '🖼️' },
  low_angle: { label: 'Low Angle', description: 'Looking up, powerful', icon: '📷' },
  high_angle: { label: 'High Angle', description: 'Looking down', icon: '🔽' },
  dutch_angle: { label: 'Dutch Angle', description: 'Tilted, dynamic', icon: '📊', rotate: 15 },
  profile: { label: 'Profile', description: 'Side view', icon: '👃' },
  overhead: { label: 'Overhead', description: 'Bird\'s eye view', icon: '🦅' },
  reflection: { label: 'Reflection', description: 'Mirror effect', icon: '🪞' },
};
