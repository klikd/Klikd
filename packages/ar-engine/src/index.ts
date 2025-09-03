// Klikd AR Engine Package
// This package provides AR functionality and 3D rendering

export interface ARConfig {
  enableAR: boolean;
  enable3D: boolean;
  quality: 'low' | 'medium' | 'high';
}

export interface ARScene {
  id: string;
  name: string;
  objects: ARObject[];
}

export interface ARObject {
  id: string;
  type: 'model' | 'text' | 'image';
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

export class KlikdAREngine {
  private config: ARConfig;

  constructor(config: ARConfig) {
    this.config = config;
  }

  createScene(name: string): ARScene {
    return {
      id: `scene_${Date.now()}`,
      name,
      objects: []
    };
  }

  addObject(scene: ARScene, object: ARObject): void {
    scene.objects.push(object);
  }
}

// Export AR types and classes
export type { ARConfig, ARScene, ARObject };
export { KlikdAREngine };
