import { useState, useCallback } from 'react';
import { GameState, CameraSettings, ShotType, PoseType, CompositionType, Cosplayer, Location, Photo } from './types';
import { LOCATIONS, COSPLAYERS, LEVEL_THRESHOLDS, SHOP_ITEMS } from './gameData';
import { calculatePhotoScore, getStars, getMoneyReward, getXPReward } from './scoring';
import TitleScreen from './components/TitleScreen';
import LocationScreen from './components/LocationScreen';
import EncounterScreen from './components/EncounterScreen';
import CameraScreen from './components/CameraScreen';
import ReviewScreen from './components/ReviewScreen';
import PortfolioScreen from './components/PortfolioScreen';
import ShopScreen from './components/ShopScreen';

const initialState: GameState = {
  screen: 'title',
  currentLocation: null,
  currentCosplayer: null,
  cameraSettings: {
    aperture: 2.8,
    shutterSpeed: 1/125,
    iso: 1600,
    focalLength: 85,
  },
  shotType: 'medium',
  pose: 'confident',
  composition: 'rule_of_thirds',
  portfolio: [],
  reputation: 0,
  money: 100,
  level: 1,
  xp: 0,
  xpToNext: 100,
  equipment: {
    lens: 'Kit 18-55mm',
    body: 'APS-C Mirrorless',
    flash: false,
    reflector: false,
    tripod: false,
    colorFilter: false,
  },
  photosTaken: 0,
  bestScore: 0,
  achievements: [],
  totalMoneyEarned: 0,
};

export default function App() {
  const [game, setGame] = useState<GameState>(initialState);
  const [lastPhoto, setLastPhoto] = useState<Photo | null>(null);
  const [locations, setLocations] = useState<Location[]>(LOCATIONS.map(l => ({...l})));
  const [cosplayers, setCosplayers] = useState<Cosplayer[]>(COSPLAYERS.map(c => ({...c})));

  const startGame = useCallback(() => {
    setGame(prev => ({ ...prev, screen: 'location' }));
  }, []);

  const selectLocation = useCallback((location: Location) => {
    setGame(prev => ({ ...prev, screen: 'encounter', currentLocation: location }));
  }, []);

  const selectCosplayer = useCallback((cosplayer: Cosplayer) => {
    setGame(prev => ({ ...prev, screen: 'camera', currentCosplayer: cosplayer }));
  }, []);

  const updateSettings = useCallback((settings: Partial<CameraSettings>) => {
    setGame(prev => ({ ...prev, cameraSettings: { ...prev.cameraSettings, ...settings } }));
  }, []);

  const setShotType = useCallback((shotType: ShotType) => {
    setGame(prev => ({ ...prev, shotType }));
  }, []);

  const setPose = useCallback((pose: PoseType) => {
    setGame(prev => ({ ...prev, pose }));
  }, []);

  const setComposition = useCallback((composition: CompositionType) => {
    setGame(prev => ({ ...prev, composition }));
  }, []);

  const takePhoto = useCallback(() => {
    if (!game.currentCosplayer || !game.currentLocation) return;

    const { score, feedback } = calculatePhotoScore(
      game.cameraSettings,
      game.shotType,
      game.pose,
      game.composition,
      game.currentCosplayer,
      game.currentLocation,
      game.equipment.flash,
      game.equipment.reflector,
      game.equipment.body === 'Full Frame Body'
    );

    const stars = getStars(score);
    const money = getMoneyReward(score);
    const xp = getXPReward(score);

    const photo: Photo = {
      id: Date.now().toString(),
      cosplayerId: game.currentCosplayer.id,
      cosplayerName: game.currentCosplayer.name,
      costume: game.currentCosplayer.costume,
      locationId: game.currentLocation.id,
      locationName: game.currentLocation.name,
      settings: { ...game.cameraSettings },
      shotType: game.shotType,
      pose: game.pose,
      composition: game.composition,
      score,
      stars,
      timestamp: Date.now(),
      feedback,
      moneyEarned: money,
      xpEarned: xp,
    };

    let newXp = game.xp + xp;
    let newLevel = game.level;
    let newXpToNext = game.xpToNext;

    // Level up check
    while (newXp >= newXpToNext && newLevel < LEVEL_THRESHOLDS.length) {
      newXp -= newXpToNext;
      newLevel++;
      newXpToNext = LEVEL_THRESHOLDS[newLevel] || newXpToNext * 1.5;
    }

    // Unlock locations based on reputation
    const newReputation = game.reputation + Math.floor(score / 10);
    const updatedLocations = locations.map(l => {
      if (newReputation >= l.requiredReputation) {
        return { ...l, unlocked: true };
      }
      return l;
    });
    setLocations(updatedLocations);

    setLastPhoto(photo);
    setGame(prev => ({
      ...prev,
      screen: 'review',
      portfolio: [photo, ...prev.portfolio],
      reputation: newReputation,
      money: prev.money + money,
      level: newLevel,
      xp: newXp,
      xpToNext: Math.round(newXpToNext),
      photosTaken: prev.photosTaken + 1,
      bestScore: Math.max(prev.bestScore, score),
      totalMoneyEarned: prev.totalMoneyEarned + money,
    }));
  }, [game, locations]);

  const buyItem = useCallback((itemId: string) => {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item || game.money < item.price) return;

    setGame(prev => {
      const newEquipment = { ...prev.equipment };
      if (item.type === 'flash') newEquipment.flash = true;
      if (item.type === 'reflector') newEquipment.reflector = true;
      if (item.type === 'tripod') newEquipment.tripod = true;
      if (item.type === 'colorFilter') newEquipment.colorFilter = true;
      if (item.type === 'lens') newEquipment.lens = item.name;
      if (item.type === 'body') newEquipment.body = item.name;

      return {
        ...prev,
        money: prev.money - item.price,
        equipment: newEquipment,
      };
    });
  }, [game.money]);

  const goToScreen = useCallback((screen: GameState['screen']) => {
    setGame(prev => ({ ...prev, screen }));
  }, []);

  switch (game.screen) {
    case 'title':
      return <TitleScreen onStart={startGame} />;
    case 'location':
      return (
        <LocationScreen
          locations={locations}
          reputation={game.reputation}
          onSelect={selectLocation}
          onPortfolio={() => goToScreen('portfolio')}
          onShop={() => goToScreen('shop')}
          level={game.level}
          money={game.money}
          photosTaken={game.photosTaken}
        />
      );
    case 'encounter':
      return (
        <EncounterScreen
          location={game.currentLocation!}
          cosplayers={cosplayers.filter(c => c.location === game.currentLocation?.id)}
          onSelect={selectCosplayer}
          onBack={() => goToScreen('location')}
        />
      );
    case 'camera':
      return (
        <CameraScreen
          cosplayer={game.currentCosplayer!}
          location={game.currentLocation!}
          settings={game.cameraSettings}
          shotType={game.shotType}
          pose={game.pose}
          composition={game.composition}
          equipment={game.equipment}
          onUpdateSettings={updateSettings}
          onSetShotType={setShotType}
          onSetPose={setPose}
          onSetComposition={setComposition}
          onTakePhoto={takePhoto}
          onBack={() => goToScreen('encounter')}
        />
      );
    case 'review':
      return (
        <ReviewScreen
          photo={lastPhoto!}
          cosplayer={game.currentCosplayer!}
          location={game.currentLocation!}
          onContinue={() => goToScreen('encounter')}
          onLocation={() => goToScreen('location')}
          onPortfolio={() => goToScreen('portfolio')}
        />
      );
    case 'portfolio':
      return (
        <PortfolioScreen
          portfolio={game.portfolio}
          cosplayers={cosplayers}
          locations={locations}
          reputation={game.reputation}
          level={game.level}
          bestScore={game.bestScore}
          photosTaken={game.photosTaken}
          totalMoneyEarned={game.totalMoneyEarned}
          onBack={() => goToScreen('location')}
        />
      );
    case 'shop':
      return (
        <ShopScreen
          money={game.money}
          equipment={game.equipment}
          onBuy={buyItem}
          onBack={() => goToScreen('location')}
        />
      );
    default:
      return <TitleScreen onStart={startGame} />;
  }
}
