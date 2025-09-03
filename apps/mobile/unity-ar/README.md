# Unity AR Module

Advanced AR experiences using Unity AR Foundation for Klikd platform.

## Setup

1. **Unity Version**: 2022.3.0f1 LTS
2. **Required Packages**:
   - AR Foundation 5.0+
   - ARCore XR Plugin 5.0+
   - ARKit XR Plugin 5.0+
   - Universal Render Pipeline 14.0+

## Project Structure

```
Assets/
├── Scripts/
│   ├── AR/
│   │   ├── ARManager.cs
│   │   ├── AnchorManager.cs
│   │   └── PlaneDetection.cs
│   ├── Klikd/
│   │   ├── MissionController.cs
│   │   └── RewardSystem.cs
│   └── UI/
├── Prefabs/
│   ├── AR Camera.prefab
│   └── Mission Objects/
├── Materials/
├── Scenes/
│   ├── MainScene.unity
│   └── ARScene.unity
└── StreamingAssets/
```

## Integration with React Native

Unity communicates with React Native through:
- Unity as a Library (UaaL)
- Native bridge for data exchange
- Shared AR anchor system

## Build Process

1. Configure XR settings in Unity
2. Build for iOS/Android
3. Integrate with React Native project
4. Deploy through Expo development build
