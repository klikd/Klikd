import * as Location from 'expo-location';

export interface SpatialAnchor {
  id: string;
  worldPosition: [number, number, number]; // lat, lng, altitude
  localPosition: [number, number, number]; // relative to AR origin
  rotation: [number, number, number, number]; // quaternion
  confidence: number; // 0-1
  type: 'persistent' | 'session' | 'cloud';
  metadata: Record<string, any>;
  createdAt: number;
  lastUpdated: number;
}

export interface SpatialZone {
  id: string;
  center: [number, number, number];
  radius: number;
  bounds?: {
    min: [number, number, number];
    max: [number, number, number];
  };
  anchors: string[];
  priority: number;
  active: boolean;
}

export class ARSpatialManager {
  private anchors: Map<string, SpatialAnchor> = new Map();
  private zones: Map<string, SpatialZone> = new Map();
  private currentLocation: [number, number, number] = [0, 0, 0];
  private arOrigin: [number, number, number] = [0, 0, 0];
  private locationSubscription: Location.LocationSubscription | null = null;
  private spatialCallbacks: Set<(anchors: SpatialAnchor[]) => void> = new Set();

  async initialize(): Promise<boolean> {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Location permission denied');
        return false;
      }

      // Get initial location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      this.currentLocation = [
        location.coords.latitude,
        location.coords.longitude,
        location.coords.altitude || 0,
      ];

      // Set AR origin to current location
      this.arOrigin = [...this.currentLocation];

      // Start location tracking
      this.startLocationTracking();

      return true;
    } catch (error) {
      console.error('Failed to initialize spatial manager:', error);
      return false;
    }
  }

  private startLocationTracking(): void {
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (location) => {
        this.currentLocation = [
          location.coords.latitude,
          location.coords.longitude,
          location.coords.altitude || 0,
        ];

        this.updateSpatialAnchors();
      }
    ).then(subscription => {
      this.locationSubscription = subscription;
    });
  }

  // Anchor management
  createAnchor(
    worldPos: [number, number, number],
    rotation: [number, number, number, number] = [0, 0, 0, 1],
    type: SpatialAnchor['type'] = 'session',
    metadata: Record<string, any> = {}
  ): string {
    const id = `anchor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const anchor: SpatialAnchor = {
      id,
      worldPosition: worldPos,
      localPosition: this.worldToLocal(worldPos),
      rotation,
      confidence: 1.0,
      type,
      metadata,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
    };

    this.anchors.set(id, anchor);
    this.notifySpatialUpdate();
    
    return id;
  }

  updateAnchor(anchorId: string, updates: Partial<SpatialAnchor>): boolean {
    const anchor = this.anchors.get(anchorId);
    if (!anchor) return false;

    Object.assign(anchor, updates);
    anchor.lastUpdated = Date.now();

    // Recalculate local position if world position changed
    if (updates.worldPosition) {
      anchor.localPosition = this.worldToLocal(updates.worldPosition);
    }

    this.notifySpatialUpdate();
    return true;
  }

  removeAnchor(anchorId: string): boolean {
    const removed = this.anchors.delete(anchorId);
    if (removed) {
      this.notifySpatialUpdate();
    }
    return removed;
  }

  getAnchor(anchorId: string): SpatialAnchor | undefined {
    return this.anchors.get(anchorId);
  }

  getAnchorsInRadius(center: [number, number, number], radius: number): SpatialAnchor[] {
    return Array.from(this.anchors.values()).filter(anchor => {
      const distance = this.calculateDistance(center, anchor.worldPosition);
      return distance <= radius;
    });
  }

  // Zone management
  createZone(
    center: [number, number, number],
    radius: number,
    priority: number = 1
  ): string {
    const id = `zone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const zone: SpatialZone = {
      id,
      center,
      radius,
      anchors: [],
      priority,
      active: true,
    };

    this.zones.set(id, zone);
    return id;
  }

  addAnchorToZone(zoneId: string, anchorId: string): boolean {
    const zone = this.zones.get(zoneId);
    const anchor = this.anchors.get(anchorId);
    
    if (!zone || !anchor) return false;

    const distance = this.calculateDistance(zone.center, anchor.worldPosition);
    if (distance <= zone.radius) {
      zone.anchors.push(anchorId);
      return true;
    }
    
    return false;
  }

  getActiveZones(): SpatialZone[] {
    return Array.from(this.zones.values())
      .filter(zone => zone.active)
      .sort((a, b) => b.priority - a.priority);
  }

  // Coordinate transformations
  worldToLocal(worldPos: [number, number, number]): [number, number, number] {
    // Convert lat/lng to meters relative to AR origin
    const [lat, lng, alt] = worldPos;
    const [originLat, originLng, originAlt] = this.arOrigin;

    // Approximate conversion (more accurate methods available)
    const latDiff = lat - originLat;
    const lngDiff = lng - originLng;
    const altDiff = alt - originAlt;

    const metersPerDegree = 111320; // Approximate at equator
    
    return [
      lngDiff * metersPerDegree * Math.cos(originLat * Math.PI / 180),
      altDiff,
      latDiff * metersPerDegree,
    ];
  }

  localToWorld(localPos: [number, number, number]): [number, number, number] {
    const [x, y, z] = localPos;
    const [originLat, originLng, originAlt] = this.arOrigin;

    const metersPerDegree = 111320;
    
    const lat = originLat + (z / metersPerDegree);
    const lng = originLng + (x / (metersPerDegree * Math.cos(originLat * Math.PI / 180)));
    const alt = originAlt + y;

    return [lat, lng, alt];
  }

  // Spatial queries
  findNearestAnchor(position: [number, number, number]): SpatialAnchor | null {
    let nearest: SpatialAnchor | null = null;
    let minDistance = Infinity;

    this.anchors.forEach(anchor => {
      const distance = this.calculateDistance(position, anchor.worldPosition);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = anchor;
      }
    });

    return nearest;
  }

  getAnchorsInBounds(
    min: [number, number, number],
    max: [number, number, number]
  ): SpatialAnchor[] {
    return Array.from(this.anchors.values()).filter(anchor => {
      const [lat, lng, alt] = anchor.worldPosition;
      return lat >= min[0] && lat <= max[0] &&
             lng >= min[1] && lng <= max[1] &&
             alt >= min[2] && alt <= max[2];
    });
  }

  // Persistence
  async saveAnchorsToCloud(): Promise<boolean> {
    try {
      const persistentAnchors = Array.from(this.anchors.values())
        .filter(anchor => anchor.type === 'persistent');

      // Mock cloud save - replace with actual API
      const data = {
        anchors: persistentAnchors,
        origin: this.arOrigin,
        timestamp: Date.now(),
      };

      console.log('Saving anchors to cloud:', data);
      return true;
    } catch (error) {
      console.error('Failed to save anchors to cloud:', error);
      return false;
    }
  }

  async loadAnchorsFromCloud(): Promise<boolean> {
    try {
      // Mock cloud load - replace with actual API
      const mockData = {
        anchors: [],
        origin: this.arOrigin,
        timestamp: Date.now(),
      };

      mockData.anchors.forEach((anchorData: any) => {
        this.anchors.set(anchorData.id, anchorData);
      });

      this.notifySpatialUpdate();
      return true;
    } catch (error) {
      console.error('Failed to load anchors from cloud:', error);
      return false;
    }
  }

  // Spatial tracking
  private updateSpatialAnchors(): void {
    // Update local positions based on new location
    this.anchors.forEach(anchor => {
      anchor.localPosition = this.worldToLocal(anchor.worldPosition);
    });

    // Check zone boundaries
    this.zones.forEach(zone => {
      const distance = this.calculateDistance(this.currentLocation, zone.center);
      zone.active = distance <= zone.radius;
    });

    this.notifySpatialUpdate();
  }

  // Utilities
  private calculateDistance(
    pos1: [number, number, number],
    pos2: [number, number, number]
  ): number {
    // Haversine formula for lat/lng distance
    const [lat1, lng1] = pos1;
    const [lat2, lng2] = pos2;

    const R = 6371000; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // Subscription management
  subscribe(callback: (anchors: SpatialAnchor[]) => void): () => void {
    this.spatialCallbacks.add(callback);
    
    return () => {
      this.spatialCallbacks.delete(callback);
    };
  }

  private notifySpatialUpdate(): void {
    const anchors = Array.from(this.anchors.values());
    this.spatialCallbacks.forEach(callback => {
      callback(anchors);
    });
  }

  // Cleanup
  dispose(): void {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
    
    this.spatialCallbacks.clear();
    this.anchors.clear();
    this.zones.clear();
  }

  // Getters
  getCurrentLocation(): [number, number, number] {
    return [...this.currentLocation];
  }

  getAROrigin(): [number, number, number] {
    return [...this.arOrigin];
  }

  getAllAnchors(): SpatialAnchor[] {
    return Array.from(this.anchors.values());
  }
}
