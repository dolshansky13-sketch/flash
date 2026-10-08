import { CameraSettings, ShotType, PoseType, CompositionType, Cosplayer, Location } from './types';

export function calculatePhotoScore(
  settings: CameraSettings,
  shotType: ShotType,
  pose: PoseType,
  composition: CompositionType,
  cosplayer: Cosplayer,
  location: Location,
  hasFlash: boolean,
  hasReflector: boolean,
  hasFullFrame: boolean
): { score: number; feedback: string[] } {
  let score = 0;
  const feedback: string[] = [];

  // 1. Lighting & Exposure Score (25 points max)
  const exposureScore = calculateExposure(settings, location, hasFlash, hasReflector);
  score += exposureScore.score;
  feedback.push(...exposureScore.feedback);

  // 2. Pose Match Score (20 points max)
  const poseScore = calculatePoseMatch(pose, cosplayer);
  score += poseScore.score;
  feedback.push(...poseScore.feedback);

  // 3. Composition Score (20 points max)
  const compScore = calculateComposition(composition, shotType, location);
  score += compScore.score;
  feedback.push(...compScore.feedback);

  // 4. Lens Choice Score (15 points max)
  const lensScore = calculateLensChoice(settings.focalLength, shotType);
  score += lensScore.score;
  feedback.push(...lensScore.feedback);

  // 5. Depth of Field Score (10 points max)
  const dofScore = calculateDOF(settings.aperture, shotType, location);
  score += dofScore.score;
  feedback.push(...dofScore.feedback);

  // 6. Location-Lighting Synergy (10 points max)
  const synergyScore = calculateSynergy(location, cosplayer);
  score += synergyScore.score;
  feedback.push(...synergyScore.feedback);

  // Equipment bonuses
  if (hasFullFrame) {
    score = Math.min(100, score + 5);
    feedback.push('📷 Full-frame sensor gives cleaner image quality');
  }

  // Clamp score
  score = Math.max(0, Math.min(100, Math.round(score)));

  return { score, feedback };
}

function calculateExposure(settings: CameraSettings, location: Location, hasFlash: boolean, hasReflector: boolean) {
  let score = 15; // base
  const feedback: string[] = [];

  const isDark = location.lightingQuality <= 3;
  const isMedium = location.lightingQuality === 4;

  if (isDark) {
    if (settings.iso >= 1600 && settings.aperture <= 2.8) {
      score += 10;
      feedback.push('✅ Great exposure for dark venue - wide aperture + high ISO');
    } else if (settings.iso >= 800 || settings.aperture <= 4) {
      score += 6;
      feedback.push('👍 Acceptable exposure, could be better in this lighting');
    } else {
      score += 2;
      feedback.push('⚠️ Underexposed - venue is too dark for these settings');
    }
    if (hasFlash) {
      score += 3;
      feedback.push('💡 Flash helps fill in shadows');
    }
    if (hasReflector) {
      score += 2;
      feedback.push('🪞 Reflector adds nice fill light');
    }
  } else if (isMedium) {
    if (settings.iso <= 800 && settings.aperture <= 4) {
      score += 10;
      feedback.push('✅ Perfect exposure balance for ambient lighting');
    } else if (settings.iso <= 1600) {
      score += 7;
      feedback.push('👍 Good exposure with minimal noise');
    } else {
      score += 4;
      feedback.push('⚠️ High ISO introducing noise unnecessarily');
    }
  } else {
    if (settings.iso <= 400) {
      score += 10;
      feedback.push('✅ Clean image with low ISO in great lighting');
    } else {
      score += 5;
      feedback.push('⚠️ ISO could be lower - lighting is good here');
    }
  }

  // Shutter speed check
  if (settings.shutterSpeed >= 1/125) {
    score = Math.min(25, score + 3);
    feedback.push('✅ Fast enough shutter to freeze motion');
  } else if (settings.shutterSpeed >= 1/60) {
    feedback.push('⚠️ Slight motion blur risk at this shutter speed');
  } else {
    score = Math.max(0, score - 5);
    feedback.push('❌ Too slow - subjects will be blurry');
  }

  return { score: Math.min(25, score), feedback };
}

function calculatePoseMatch(pose: PoseType, cosplayer: Cosplayer) {
  const feedback: string[] = [];

  if (cosplayer.preferredPoses.includes(pose)) {
    if (cosplayer.preferredPoses[0] === pose) {
      feedback.push(`✅ Perfect pose choice! "${pose}" matches ${cosplayer.name}'s style perfectly`);
      return { score: 20, feedback };
    } else {
      feedback.push(`👍 Great pose! "${pose}" works well with ${cosplayer.name}'s character`);
      return { score: 15, feedback };
    }
  } else {
    feedback.push(`⚠️ "${pose}" isn't ideal for ${cosplayer.name} - try ${cosplayer.preferredPoses[0]}`);
    return { score: 7, feedback };
  }
}

function calculateComposition(composition: CompositionType, shotType: ShotType, location: Location) {
  let score = 10;
  const feedback: string[] = [];

  // Certain compositions work better with certain shots
  const goodCompositions: Record<ShotType, CompositionType[]> = {
    extreme_closeup: ['rule_of_thirds', 'centered'],
    closeup: ['rule_of_thirds', 'centered', 'profile'],
    bust: ['rule_of_thirds', 'centered', 'profile'],
    medium: ['rule_of_thirds', 'frame_within_frame', 'leading_lines', 'dutch_angle'],
    cowboy: ['rule_of_thirds', 'centered', 'leading_lines', 'low_angle'],
    fullbody: ['centered', 'leading_lines', 'low_angle', 'overhead'],
    wide: ['leading_lines', 'frame_within_frame', 'rule_of_thirds', 'overhead'],
    detail: ['rule_of_thirds', 'frame_within_frame', 'centered'],
  };

  if (goodCompositions[shotType].includes(composition)) {
    score += 8;
    feedback.push(`✅ "${composition}" complements the ${shotType} shot type`);
  } else {
    score += 3;
    feedback.push(`👍 Composition works but could be stronger for this shot type`);
  }

  // Location-specific bonuses
  if (location.id === 'neon_hallway' && composition === 'leading_lines') {
    score += 4;
    feedback.push('🌟 Neon corridor lines create stunning leading lines!');
  }
  if (location.id === 'vip_lounge' && composition === 'frame_within_frame') {
    score += 3;
    feedback.push('🌟 Velvet curtains frame the subject beautifully');
  }
  if (composition === 'low_angle' && (shotType === 'fullbody' || shotType === 'cowboy')) {
    score += 3;
    feedback.push('🌟 Low angle makes the costume look epic and powerful');
  }
  if (composition === 'reflection' && location.id === 'neon_hallway') {
    score += 4;
    feedback.push('🌟 Reflective floor creates stunning mirror effect!');
  }
  if (composition === 'dutch_angle' && shotType === 'medium') {
    score += 2;
    feedback.push('🌟 Dutch angle adds dynamic editorial energy');
  }
  if (composition === 'profile' && (shotType === 'closeup' || shotType === 'bust')) {
    score += 3;
    feedback.push('🌟 Profile view highlights facial features and silhouette');
  }

  return { score: Math.min(20, score), feedback };
}

function calculateLensChoice(focalLength: number, shotType: ShotType) {
  const feedback: string[] = [];

  const idealRanges: Record<ShotType, [number, number]> = {
    extreme_closeup: [85, 200],
    closeup: [85, 135],
    bust: [50, 105],
    medium: [50, 85],
    cowboy: [35, 85],
    fullbody: [24, 50],
    wide: [24, 35],
    detail: [85, 200],
  };

  const [min, max] = idealRanges[shotType];

  if (focalLength >= min && focalLength <= max) {
    feedback.push(`✅ ${focalLength}mm is perfect for ${shotType} shots`);
    return { score: 15, feedback };
  } else if (Math.abs(focalLength - (min + max) / 2) < 60) {
    feedback.push(`👍 ${focalLength}mm works but isn't ideal for ${shotType}`);
    return { score: 10, feedback };
  } else {
    feedback.push(`⚠️ ${focalLength}mm is ${focalLength < min ? 'too wide' : 'too tight'} for ${shotType}`);
    return { score: 5, feedback };
  }
}

function calculateDOF(aperture: number, shotType: ShotType, _location: Location) {
  const feedback: string[] = [];

  // For portraits/closeups, wide aperture (low f-number) is good for bokeh
  // For full body/detail, might want more depth of field
  if (shotType === 'extreme_closeup' || shotType === 'closeup' || shotType === 'detail') {
    if (aperture <= 2.8) {
      feedback.push('✅ Beautiful bokeh separates subject from busy background');
      return { score: 10, feedback };
    } else if (aperture <= 5.6) {
      feedback.push('👍 Good separation, some background visible');
      return { score: 7, feedback };
    } else {
      feedback.push('⚠️ Too much depth of field - background is distracting');
      return { score: 3, feedback };
    }
  } else if (shotType === 'fullbody' || shotType === 'wide') {
    if (aperture >= 4 && aperture <= 8) {
      feedback.push('✅ Good depth of field keeps entire costume sharp');
      return { score: 10, feedback };
    } else if (aperture < 4) {
      feedback.push('⚠️ Parts of costume may be out of focus');
      return { score: 5, feedback };
    } else {
      feedback.push('👍 Everything is sharp but less artistic separation');
      return { score: 6, feedback };
    }
  } else {
    // medium, bust, cowboy
    if (aperture <= 4) {
      feedback.push('✅ Nice bokeh while keeping subject sharp');
      return { score: 10, feedback };
    } else {
      feedback.push('👍 Adequate depth of field for this shot');
      return { score: 7, feedback };
    }
  }
}

function calculateSynergy(location: Location, cosplayer: Cosplayer) {
  const feedback: string[] = [];

  if (cosplayer.preferredLighting === location.lighting) {
    feedback.push(`🌟 Perfect match! ${cosplayer.name}'s style complements this location's lighting`);
    return { score: 10, feedback };
  }

  const neonTypes = ['neon_pulsing', 'neon_linear'];
  const warmTypes = ['warm_golden'];

  if (neonTypes.includes(cosplayer.preferredLighting) && neonTypes.includes(location.lighting)) {
    feedback.push('👍 Neon lighting works with this character aesthetic');
    return { score: 7, feedback };
  }
  if (warmTypes.includes(cosplayer.preferredLighting) && warmTypes.includes(location.lighting)) {
    feedback.push('👍 Warm lighting flatters this costume beautifully');
    return { score: 7, feedback };
  }

  feedback.push('⚠️ Lighting style doesn\'t perfectly match the costume aesthetic');
  return { score: 4, feedback };
}

export function getStars(score: number): number {
  if (score >= 90) return 5;
  if (score >= 75) return 4;
  if (score >= 60) return 3;
  if (score >= 40) return 2;
  return 1;
}

export function getScoreLabel(score: number): string {
  if (score >= 95) return 'LEGENDARY';
  if (score >= 90) return 'MASTERPIECE';
  if (score >= 75) return 'Excellent';
  if (score >= 60) return 'Great Shot';
  if (score >= 40) return 'Decent';
  if (score >= 25) return 'Needs Work';
  return 'Keep Practicing';
}

export function getMoneyReward(score: number): number {
  if (score >= 90) return 50;
  if (score >= 75) return 30;
  if (score >= 60) return 20;
  if (score >= 40) return 10;
  return 5;
}

export function getXPReward(score: number): number {
  if (score >= 90) return 50;
  if (score >= 75) return 30;
  if (score >= 60) return 20;
  if (score >= 40) return 10;
  return 5;
}
