import { describe, it, expect } from 'vitest';
import { KlikdAREngine, type ARConfig, type ARScene, type ARObject } from './index.js';

describe('Klikd AR Engine', () => {
  it('should create an AR engine instance', () => {
    const config: ARConfig = {
      enableAR: true,
      enable3D: true,
      quality: 'high'
    };
    
    const engine = new KlikdAREngine(config);
    expect(engine).toBeDefined();
  });

  it('should create a scene', () => {
    const config: ARConfig = {
      enableAR: true,
      enable3D: true,
      quality: 'medium'
    };
    
    const engine = new KlikdAREngine(config);
    const scene = engine.createScene('Test Scene');
    
    expect(scene).toBeDefined();
    expect(scene.name).toBe('Test Scene');
    expect(scene.objects).toEqual([]);
  });

  it('should add objects to a scene', () => {
    const config: ARConfig = {
      enableAR: true,
      enable3D: true,
      quality: 'low'
    };
    
    const engine = new KlikdAREngine(config);
    const scene = engine.createScene('Test Scene');
    
    const object: ARObject = {
      id: 'obj-1',
      type: 'model',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    };
    
    engine.addObject(scene, object);
    
    expect(scene.objects).toHaveLength(1);
    expect(scene.objects[0]).toEqual(object);
  });
});
