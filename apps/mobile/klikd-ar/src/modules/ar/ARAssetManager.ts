import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

export interface ARAsset {
  id: string;
  type: '3d_model' | 'texture' | 'animation' | 'audio' | 'video';
  url: string;
  localPath?: string;
  size: number;
  checksum: string;
  metadata: {
    format: string;
    version: string;
    dependencies?: string[];
    tags?: string[];
  };
  cachePolicy: 'always' | 'session' | 'never';
  priority: 'high' | 'medium' | 'low';
  downloadProgress?: number;
  lastAccessed?: number;
}

export interface AssetBundle {
  id: string;
  name: string;
  version: string;
  assets: ARAsset[];
  totalSize: number;
  dependencies: string[];
}

export class ARAssetManager {
  private assets: Map<string, ARAsset> = new Map();
  private bundles: Map<string, AssetBundle> = new Map();
  private downloadQueue: Set<string> = new Set();
  private cacheDirectory: string;
  private maxCacheSize: number = 500 * 1024 * 1024; // 500MB
  private currentCacheSize: number = 0;

  constructor() {
    this.cacheDirectory = `${FileSystem.documentDirectory}ar_cache/`;
    this.initializeCache();
  }

  private async initializeCache(): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.cacheDirectory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.cacheDirectory, { intermediates: true });
      }
      
      await this.calculateCacheSize();
    } catch (error) {
      console.error('Failed to initialize AR asset cache:', error);
    }
  }

  private async calculateCacheSize(): Promise<void> {
    try {
      const files = await FileSystem.readDirectoryAsync(this.cacheDirectory);
      let totalSize = 0;
      
      for (const file of files) {
        const filePath = `${this.cacheDirectory}${file}`;
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (fileInfo.exists && fileInfo.size) {
          totalSize += fileInfo.size;
        }
      }
      
      this.currentCacheSize = totalSize;
    } catch (error) {
      console.error('Failed to calculate cache size:', error);
    }
  }

  // Asset registration
  registerAsset(asset: ARAsset): void {
    this.assets.set(asset.id, asset);
  }

  registerBundle(bundle: AssetBundle): void {
    this.bundles.set(bundle.id, bundle);
    
    // Register individual assets
    bundle.assets.forEach(asset => {
      this.registerAsset(asset);
    });
  }

  // Asset loading
  async loadAsset(assetId: string): Promise<string | null> {
    const asset = this.assets.get(assetId);
    if (!asset) {
      console.error(`Asset not found: ${assetId}`);
      return null;
    }

    // Check if already cached
    if (asset.localPath) {
      const fileInfo = await FileSystem.getInfoAsync(asset.localPath);
      if (fileInfo.exists) {
        asset.lastAccessed = Date.now();
        return asset.localPath;
      }
    }

    // Download asset
    return await this.downloadAsset(asset);
  }

  async loadBundle(bundleId: string): Promise<boolean> {
    const bundle = this.bundles.get(bundleId);
    if (!bundle) {
      console.error(`Bundle not found: ${bundleId}`);
      return false;
    }

    try {
      // Load dependencies first
      for (const depId of bundle.dependencies) {
        await this.loadBundle(depId);
      }

      // Load all assets in bundle
      const loadPromises = bundle.assets.map(asset => this.loadAsset(asset.id));
      await Promise.all(loadPromises);
      
      return true;
    } catch (error) {
      console.error(`Failed to load bundle ${bundleId}:`, error);
      return false;
    }
  }

  private async downloadAsset(asset: ARAsset): Promise<string | null> {
    if (this.downloadQueue.has(asset.id)) {
      // Wait for existing download
      return new Promise((resolve) => {
        const checkDownload = () => {
          if (!this.downloadQueue.has(asset.id) && asset.localPath) {
            resolve(asset.localPath);
          } else {
            setTimeout(checkDownload, 100);
          }
        };
        checkDownload();
      });
    }

    this.downloadQueue.add(asset.id);

    try {
      // Check cache space
      if (this.currentCacheSize + asset.size > this.maxCacheSize) {
        await this.cleanupCache(asset.size);
      }

      const fileName = `${asset.id}.${asset.metadata.format}`;
      const localPath = `${this.cacheDirectory}${fileName}`;

      const downloadResult = await FileSystem.downloadAsync(asset.url, localPath);
      
      if (downloadResult.status === 200) {
        asset.localPath = localPath;
        asset.lastAccessed = Date.now();
        this.currentCacheSize += asset.size;
        
        // Verify checksum if provided
        if (asset.checksum) {
          const isValid = await this.verifyChecksum(localPath, asset.checksum);
          if (!isValid) {
            await FileSystem.deleteAsync(localPath);
            throw new Error(`Checksum verification failed for asset ${asset.id}`);
          }
        }
        
        return localPath;
      } else {
        throw new Error(`Download failed with status ${downloadResult.status}`);
      }
    } catch (error) {
      console.error(`Failed to download asset ${asset.id}:`, error);
      return null;
    } finally {
      this.downloadQueue.delete(asset.id);
    }
  }

  private async verifyChecksum(filePath: string, expectedChecksum: string): Promise<boolean> {
    try {
      // Simple implementation - in production, use proper hashing
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      return fileInfo.size?.toString() === expectedChecksum;
    } catch (error) {
      console.error('Checksum verification failed:', error);
      return false;
    }
  }

  // Cache management
  private async cleanupCache(requiredSpace: number): Promise<void> {
    const assets = Array.from(this.assets.values())
      .filter(asset => asset.localPath && asset.cachePolicy !== 'always')
      .sort((a, b) => (a.lastAccessed || 0) - (b.lastAccessed || 0));

    let freedSpace = 0;
    
    for (const asset of assets) {
      if (freedSpace >= requiredSpace) break;
      
      try {
        if (asset.localPath) {
          await FileSystem.deleteAsync(asset.localPath);
          freedSpace += asset.size;
          this.currentCacheSize -= asset.size;
          asset.localPath = undefined;
        }
      } catch (error) {
        console.error(`Failed to delete cached asset ${asset.id}:`, error);
      }
    }
  }

  async clearCache(): Promise<void> {
    try {
      await FileSystem.deleteAsync(this.cacheDirectory);
      await FileSystem.makeDirectoryAsync(this.cacheDirectory, { intermediates: true });
      
      this.currentCacheSize = 0;
      
      // Clear local paths
      this.assets.forEach(asset => {
        asset.localPath = undefined;
      });
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  // Preloading
  async preloadAssets(assetIds: string[]): Promise<void> {
    const highPriorityAssets = assetIds
      .map(id => this.assets.get(id))
      .filter(asset => asset && asset.priority === 'high')
      .map(asset => asset!);

    const mediumPriorityAssets = assetIds
      .map(id => this.assets.get(id))
      .filter(asset => asset && asset.priority === 'medium')
      .map(asset => asset!);

    // Load high priority first
    await Promise.all(highPriorityAssets.map(asset => this.loadAsset(asset.id)));
    
    // Then medium priority
    await Promise.all(mediumPriorityAssets.map(asset => this.loadAsset(asset.id)));
  }

  // Asset queries
  getAssetsByType(type: ARAsset['type']): ARAsset[] {
    return Array.from(this.assets.values()).filter(asset => asset.type === type);
  }

  getAssetsByTags(tags: string[]): ARAsset[] {
    return Array.from(this.assets.values()).filter(asset => 
      asset.metadata.tags?.some(tag => tags.includes(tag))
    );
  }

  getCacheStats(): {
    totalAssets: number;
    cachedAssets: number;
    cacheSize: number;
    maxCacheSize: number;
    cacheUsage: number;
  } {
    const cachedAssets = Array.from(this.assets.values()).filter(asset => asset.localPath).length;
    
    return {
      totalAssets: this.assets.size,
      cachedAssets,
      cacheSize: this.currentCacheSize,
      maxCacheSize: this.maxCacheSize,
      cacheUsage: this.currentCacheSize / this.maxCacheSize,
    };
  }

  // Asset streaming for large models
  async streamAsset(assetId: string, onProgress?: (progress: number) => void): Promise<string | null> {
    const asset = this.assets.get(assetId);
    if (!asset) return null;

    const fileName = `${asset.id}.${asset.metadata.format}`;
    const localPath = `${this.cacheDirectory}${fileName}`;

    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        asset.url,
        localPath,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          asset.downloadProgress = progress;
          onProgress?.(progress);
        }
      );

      const result = await downloadResumable.downloadAsync();
      
      if (result && result.status === 200) {
        asset.localPath = localPath;
        asset.lastAccessed = Date.now();
        asset.downloadProgress = undefined;
        return localPath;
      }
      
      return null;
    } catch (error) {
      console.error(`Failed to stream asset ${assetId}:`, error);
      return null;
    }
  }
}
