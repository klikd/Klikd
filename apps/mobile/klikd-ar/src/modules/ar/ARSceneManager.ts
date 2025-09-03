import { ViroNode, ViroMaterials, ViroAnimations } from 'viro';

export interface ARNode {
  id: string;
  type: 'zone' | 'booth' | 'ncp' | 'mission' | 'user_object';
  position: [number, number, number];
  rotation: [number, number, number, number];
  scale: [number, number, number];
  visible: boolean;
  interactive: boolean;
  children: ARNode[];
  metadata: Record<string, any>;
  animations?: string[];
  materials?: string[];
}

export interface SceneGraph {
  root: ARNode;
  nodes: Map<string, ARNode>;
  activeNodes: Set<string>;
  visibilityRules: Map<string, (node: ARNode) => boolean>;
}

export class ARSceneManager {
  private sceneGraph: SceneGraph;
  private updateCallbacks: Set<(graph: SceneGraph) => void> = new Set();
  private animationFrameId: number | null = null;

  constructor() {
    this.sceneGraph = {
      root: this.createRootNode(),
      nodes: new Map(),
      activeNodes: new Set(),
      visibilityRules: new Map(),
    };

    this.initializeMaterials();
    this.initializeAnimations();
    this.startUpdateLoop();
  }

  private createRootNode(): ARNode {
    return {
      id: 'root',
      type: 'user_object',
      position: [0, 0, 0],
      rotation: [0, 0, 0, 1],
      scale: [1, 1, 1],
      visible: true,
      interactive: false,
      children: [],
      metadata: {},
    };
  }

  private initializeMaterials() {
    ViroMaterials.createMaterials({
      // Zone materials
      zoneActive: {
        lightingModel: 'PBR',
        diffuseColor: '#00FF88',
        metalness: 0.1,
        roughness: 0.3,
        bloomThreshold: 0.4,
      },
      zoneInactive: {
        lightingModel: 'PBR',
        diffuseColor: '#666666',
        metalness: 0.1,
        roughness: 0.7,
        opacity: 0.6,
      },
      
      // Booth materials
      boothBrand: {
        lightingModel: 'PBR',
        diffuseColor: '#007AFF',
        metalness: 0.8,
        roughness: 0.2,
        bloomThreshold: 0.3,
      },
      
      // NCP materials
      ncpFriendly: {
        lightingModel: 'Constant',
        diffuseColor: '#FFD700',
        bloomThreshold: 0.5,
      },
      ncpMerchant: {
        lightingModel: 'Constant',
        diffuseColor: '#FF6B35',
        bloomThreshold: 0.4,
      },
      
      // Mission materials
      missionAvailable: {
        lightingModel: 'Constant',
        diffuseColor: '#00FF88',
        bloomThreshold: 0.6,
      },
      missionCompleted: {
        lightingModel: 'Constant',
        diffuseColor: '#888888',
        opacity: 0.5,
      },
      
      // UI materials
      uiBackground: {
        lightingModel: 'Constant',
        diffuseColor: '#000000',
        opacity: 0.8,
      },
      uiHighlight: {
        lightingModel: 'Constant',
        diffuseColor: '#007AFF',
        bloomThreshold: 0.3,
      },
    });
  }

  private initializeAnimations() {
    ViroAnimations.registerAnimations({
      // Pulse animations
      zonePulse: {
        properties: {
          scaleX: 1.2,
          scaleY: 1.2,
          scaleZ: 1.2,
        },
        duration: 2000,
        easing: 'EaseInEaseOut',
      },
      
      // Rotation animations
      slowRotate: {
        properties: {
          rotateY: '+=360',
        },
        duration: 10000,
      },
      
      // Floating animations
      float: {
        properties: {
          positionY: '+=0.5',
        },
        duration: 3000,
        easing: 'EaseInEaseOut',
      },
      
      // Appearance animations
      fadeIn: {
        properties: {
          opacity: 1,
          scaleX: 1,
          scaleY: 1,
          scaleZ: 1,
        },
        duration: 500,
        easing: 'EaseOut',
      },
      
      fadeOut: {
        properties: {
          opacity: 0,
          scaleX: 0.8,
          scaleY: 0.8,
          scaleZ: 0.8,
        },
        duration: 300,
        easing: 'EaseIn',
      },
      
      // Interaction animations
      bounce: {
        properties: {
          scaleX: 1.3,
          scaleY: 1.3,
          scaleZ: 1.3,
        },
        duration: 200,
        easing: 'Bounce',
      },
    });
  }

  // Node management
  addNode(node: ARNode, parentId: string = 'root'): void {
    const parent = this.sceneGraph.nodes.get(parentId) || this.sceneGraph.root;
    
    parent.children.push(node);
    this.sceneGraph.nodes.set(node.id, node);
    
    if (node.visible) {
      this.sceneGraph.activeNodes.add(node.id);
    }
    
    this.notifyUpdate();
  }

  removeNode(nodeId: string): void {
    const node = this.sceneGraph.nodes.get(nodeId);
    if (!node) return;

    // Remove from parent's children
    const parent = this.findParentNode(nodeId);
    if (parent) {
      parent.children = parent.children.filter(child => child.id !== nodeId);
    }

    // Remove from maps and sets
    this.sceneGraph.nodes.delete(nodeId);
    this.sceneGraph.activeNodes.delete(nodeId);
    
    // Remove children recursively
    node.children.forEach(child => this.removeNode(child.id));
    
    this.notifyUpdate();
  }

  updateNode(nodeId: string, updates: Partial<ARNode>): void {
    const node = this.sceneGraph.nodes.get(nodeId);
    if (!node) return;

    Object.assign(node, updates);
    
    // Update visibility
    if (updates.visible !== undefined) {
      if (updates.visible) {
        this.sceneGraph.activeNodes.add(nodeId);
      } else {
        this.sceneGraph.activeNodes.delete(nodeId);
      }
    }
    
    this.notifyUpdate();
  }

  getNode(nodeId: string): ARNode | undefined {
    return this.sceneGraph.nodes.get(nodeId);
  }

  getNodesByType(type: ARNode['type']): ARNode[] {
    return Array.from(this.sceneGraph.nodes.values()).filter(node => node.type === type);
  }

  // Visibility management
  setVisibilityRule(nodeId: string, rule: (node: ARNode) => boolean): void {
    this.sceneGraph.visibilityRules.set(nodeId, rule);
  }

  removeVisibilityRule(nodeId: string): void {
    this.sceneGraph.visibilityRules.delete(nodeId);
  }

  // Spatial queries
  getNodesInRadius(center: [number, number, number], radius: number): ARNode[] {
    return Array.from(this.sceneGraph.nodes.values()).filter(node => {
      const distance = this.calculateDistance(center, node.position);
      return distance <= radius;
    });
  }

  getNodesInBounds(min: [number, number, number], max: [number, number, number]): ARNode[] {
    return Array.from(this.sceneGraph.nodes.values()).filter(node => {
      const [x, y, z] = node.position;
      return x >= min[0] && x <= max[0] &&
             y >= min[1] && y <= max[1] &&
             z >= min[2] && z <= max[2];
    });
  }

  // Culling and optimization
  cullNodes(cameraPosition: [number, number, number], maxDistance: number): void {
    this.sceneGraph.nodes.forEach((node, nodeId) => {
      const distance = this.calculateDistance(cameraPosition, node.position);
      const shouldBeVisible = distance <= maxDistance;
      
      if (shouldBeVisible !== this.sceneGraph.activeNodes.has(nodeId)) {
        if (shouldBeVisible) {
          this.sceneGraph.activeNodes.add(nodeId);
        } else {
          this.sceneGraph.activeNodes.delete(nodeId);
        }
      }
    });
    
    this.notifyUpdate();
  }

  // Level of Detail (LOD) management
  updateLOD(cameraPosition: [number, number, number]): void {
    this.sceneGraph.nodes.forEach(node => {
      const distance = this.calculateDistance(cameraPosition, node.position);
      
      // Adjust scale based on distance for LOD
      let lodScale = 1;
      if (distance > 50) {
        lodScale = 0.5; // Low detail
      } else if (distance > 20) {
        lodScale = 0.75; // Medium detail
      }
      
      node.scale = [lodScale, lodScale, lodScale];
    });
  }

  // Animation management
  playAnimation(nodeId: string, animationName: string, loop: boolean = false): void {
    const node = this.sceneGraph.nodes.get(nodeId);
    if (!node) return;

    if (!node.animations) {
      node.animations = [];
    }
    
    if (!node.animations.includes(animationName)) {
      node.animations.push(animationName);
    }
    
    node.metadata.currentAnimation = {
      name: animationName,
      loop,
      startTime: Date.now(),
    };
    
    this.notifyUpdate();
  }

  stopAnimation(nodeId: string, animationName?: string): void {
    const node = this.sceneGraph.nodes.get(nodeId);
    if (!node) return;

    if (animationName) {
      node.animations = node.animations?.filter(anim => anim !== animationName) || [];
    } else {
      node.animations = [];
      delete node.metadata.currentAnimation;
    }
    
    this.notifyUpdate();
  }

  // Utility methods
  private findParentNode(nodeId: string): ARNode | null {
    const findParent = (node: ARNode): ARNode | null => {
      for (const child of node.children) {
        if (child.id === nodeId) {
          return node;
        }
        const found = findParent(child);
        if (found) return found;
      }
      return null;
    };

    return findParent(this.sceneGraph.root);
  }

  private calculateDistance(pos1: [number, number, number], pos2: [number, number, number]): number {
    return Math.sqrt(
      Math.pow(pos1[0] - pos2[0], 2) +
      Math.pow(pos1[1] - pos2[1], 2) +
      Math.pow(pos1[2] - pos2[2], 2)
    );
  }

  // Update loop
  private startUpdateLoop(): void {
    const update = () => {
      this.updateVisibilityRules();
      this.animationFrameId = requestAnimationFrame(update);
    };
    
    this.animationFrameId = requestAnimationFrame(update);
  }

  private updateVisibilityRules(): void {
    let hasChanges = false;
    
    this.sceneGraph.visibilityRules.forEach((rule, nodeId) => {
      const node = this.sceneGraph.nodes.get(nodeId);
      if (!node) return;

      const shouldBeVisible = rule(node);
      const isCurrentlyActive = this.sceneGraph.activeNodes.has(nodeId);
      
      if (shouldBeVisible !== isCurrentlyActive) {
        if (shouldBeVisible) {
          this.sceneGraph.activeNodes.add(nodeId);
        } else {
          this.sceneGraph.activeNodes.delete(nodeId);
        }
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      this.notifyUpdate();
    }
  }

  // Subscription management
  subscribe(callback: (graph: SceneGraph) => void): () => void {
    this.updateCallbacks.add(callback);
    
    return () => {
      this.updateCallbacks.delete(callback);
    };
  }

  private notifyUpdate(): void {
    this.updateCallbacks.forEach(callback => {
      callback(this.sceneGraph);
    });
  }

  // Cleanup
  dispose(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    this.updateCallbacks.clear();
    this.sceneGraph.nodes.clear();
    this.sceneGraph.activeNodes.clear();
    this.sceneGraph.visibilityRules.clear();
  }

  // Export/Import scene data
  exportScene(): any {
    return {
      root: this.sceneGraph.root,
      nodes: Array.from(this.sceneGraph.nodes.entries()),
      activeNodes: Array.from(this.sceneGraph.activeNodes),
    };
  }

  importScene(sceneData: any): void {
    this.sceneGraph.root = sceneData.root;
    this.sceneGraph.nodes = new Map(sceneData.nodes);
    this.sceneGraph.activeNodes = new Set(sceneData.activeNodes);
    this.notifyUpdate();
  }
}
