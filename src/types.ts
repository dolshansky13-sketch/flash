export interface CameraSettings {
  aperture: number; // f/1.4 to f/22
  shutterSpeed: number; // in seconds (fraction stored as number)
  iso: number; // 100 to 6400
  focalLength: number; // 24mm to 200mm
}

export type ShotType = 'closeup' | 'medium' | 'fullbody' | 'detail';
export type PoseType = 'confident' | 'playful' | 'seductive' | 'dramatic' | 'candid' | 'action';
export type CompositionType = 'rule_of_thirds' | 'centered' | 'leading_lines' | 'frame_within_frame' | 'low_angle' | 'high_angle';

export interface Cosplayer {
  id: string;
  name: string;
  costume: string;
  description: string;
  image: string;
  personality: string;
  preferredPoses: PoseType[];
  preferredLighting: string;
  difficulty: number; // 1-5
  unlocked: boolean;
  location: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  image: string;
  lighting: string;
  lightingQuality: number; // 1-5 how good the lighting is
  requiredReputation: number;
  unlocked: boolean;
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
}

export interface Equipment {
  lens: string;
  body: string;
  flash: boolean;
  reflector: boolean;
}

export const APERTURE_VALUES = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];
export const SHUTTER_SPEEDS = [1/8000, 1/4000, 1/2000, 1/1000, 1/500, 1/250, 1/125, 1/60, 1/30, 1/15];
export const ISO_VALUES = [100, 200, 400, 800, 1600, 3200, 6400];
export const FOCAL_LENGTHS = [24, 35, 50, 85, 105, 135, 200];

export const SHOT_TYPE_INFO: Record<ShotType, { label: string; description: string; icon: string }> = {
  closeup: { label: 'Close-Up', description: 'Face and upper body focus', icon: '👤' },
  medium: { label: 'Medium Shot', description: 'Waist-up composition', icon: '🧍' },
  fullbody: { label: 'Full Body', description: 'Head to toe, show the costume', icon: '🦶' },
  detail: { label: 'Detail Shot', description: 'Focus on costume details', icon: '🔍' },
};

export const POSE_INFO: Record<PoseType, { label: string; description: string; icon: string }> = {
  confident: { label: 'Confident', description: 'Strong stance, hands on hips', icon: '💪' },
  playful: { label: 'Playful', description: 'Fun, energetic, animated', icon: '✨' },
  seductive: { label: 'Seductive', description: 'Alluring, mysterious gaze', icon: '💋' },
  dramatic: { label: 'Dramatic', description: 'Theatrical, intense emotion', icon: '🎭' },
  candid: { label: 'Candid', description: 'Natural, unposed moment', icon: '📸' },
  action: { label: 'Action', description: 'Dynamic movement pose', icon: '⚡' },
};

export const COMPOSITION_INFO: Record<CompositionType, { label: string; description: string; icon: string }> = {
  rule_of_thirds: { label: 'Rule of Thirds', description: 'Subject off-center, balanced', icon: '📐' },
  centered: { label: 'Centered', description: 'Subject in middle, symmetrical', icon: '🎯' },
  leading_lines: { label: 'Leading Lines', description: 'Lines guide eye to subject', icon: '➡️' },
  frame_within_frame: { label: 'Frame in Frame', description: 'Natural framing elements', icon: '🖼️' },
  low_angle: { label: 'Low Angle', description: 'Looking up, powerful', icon: '📷' },
  high_angle: { label: 'High Angle', description: 'Looking down, vulnerable', icon: '🔽' },
};
