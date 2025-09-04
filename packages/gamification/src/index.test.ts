import { describe, it, expect } from 'vitest';
import { GamificationEngine, type GamificationConfig, type UserPoints, type Badge } from './index.js';

describe('Gamification Engine', () => {
  it('should create a gamification engine instance', () => {
    const config: GamificationConfig = {
      enablePoints: true,
      enableBadges: true,
      enableLeaderboards: true
    };
    
    const engine = new GamificationEngine(config);
    expect(engine).toBeDefined();
  });

  it('should award points', () => {
    const config: GamificationConfig = {
      enablePoints: true,
      enableBadges: false,
      enableLeaderboards: false
    };
    
    const engine = new GamificationEngine(config);
    expect(() => engine.awardPoints('user-123', 100)).not.toThrow();
  });

  it('should grant badges', () => {
    const config: GamificationConfig = {
      enablePoints: false,
      enableBadges: true,
      enableLeaderboards: false
    };
    
    const engine = new GamificationEngine(config);
    const badge: Badge = {
      id: 'badge-1',
      name: 'First Badge',
      description: 'A test badge',
      icon: '🏆'
    };
    
    expect(() => engine.grantBadge('user-123', badge)).not.toThrow();
  });
});
