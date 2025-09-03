// Klikd™ Complete Brand System
// Based on official brand guidelines v1.0
export const KlikdBrandSystem = {
  // Primary Brand Colors
  colors: {
    primary: {
      klikd_green: '#ECFF00',      // Fluorescent Klikd Green
      klikd_black: '#0B0B0B',      // Klikd Black
      klikd_white: '#FFFFFF',      // Klikd White
    },
    
    // UI Colors
    ui: {
      soft_gray: '#D9D9D9',        // Inputs, disabled buttons
      alert_red: '#FF3B30',        // Errors, warnings
      crown_stroke: '#0D0D0D',     // Crown stroke color
      highlight_text: '#FFFEFE',   // Ultra white for punchy text
      link_cta: '#00F0A8',         // TikTok-style accent (teal)
      dark_bg: '#121212',          // Dark mode base (Snapchat style)
      app_bg_light: '#FFFFF6',     // Soft warm white with green hues
    },
    
    // Tier Colors (User Plans)
    tiers: {
      spark: '#ECFF00',            // ✨ Spark™
      ignite: '#FF4500',           // 🔥 Ignite™
      dominator: '#FFD700',        // 🦁 Dominator™
      brand_luxury: '#9932CC',     // ⚜️ BrandLuxury™
      brand_luxury_elite: '#4B0082', // 🔱 BrandLuxury™ Elite
      creator_go: '#FF69B4',       // 📣 CreatorGo™
      creator_x: '#00CED1',        // 🚀 CreatorX™
      creator_star: '#FFD700',     // ⭐ CreatorStar™
      creator_luxury: '#9932CC',   // 💎 CreatorLuxury™
      creator_luxury_elite: '#4B0082', // ♕ CreatorLuxury™ Elite
      agency_lite: '#87CEEB',      // 📢 AgencyLite™
      agency_plus: '#4169E1',      // 📽 AgencyPlus™
      agency_max: '#191970',       // 🎬 AgencyMax™
      wizard_coach: '#8A2BE2',     // 🧙 WizardCoach™
    }
  },

  // Typography System (Inter Font Family)
  typography: {
    fontFamily: {
      primary: 'Inter',
      display: 'Inter-Bold',
      body: 'Inter-Regular',
    },
    
    sizes: {
      app_title: 28,      // App Title
      section_header: 22, // Section Header  
      paragraph: 16,      // Paragraph
      caption: 12,        // Caption
    },
    
    weights: {
      bold: '700',
      semibold: '600',
      regular: '400',
      light: '300',
    },
    
    // Font behavior rules
    rules: {
      alignment: 'left',           // Always left-aligned
      baseline_grid: 8,            // 8pt baseline grid
      max_weights_per_screen: 2,   // Limit to two weights per screen
      avoid_italics: true,         // No italics
      avoid_underlines: true,      // No underlines
      variable_spacing: true,      // Use variable spacing for dynamic UI
    }
  },

  // Spacing System (8pt base)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    base: 8, // Base spacing unit
  },

  // Border Radius System
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,   // Standard button radius
    xl: 16,
    round: 999,
  },

  // Shadow System (TikTok-style)
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    glow: {
      shadowColor: '#ECFF00',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 8,
    }
  },

  // Component Specifications
  components: {
    buttons: {
      primary: {
        backgroundColor: '#ECFF00',
        color: '#0B0B0B',
        borderRadius: 12,
        paddingHorizontal: 24,
        paddingVertical: 12,
        fontWeight: '600',
        fontSize: 16,
      },
      secondary: {
        backgroundColor: 'transparent',
        color: '#ECFF00',
        borderColor: '#ECFF00',
        borderWidth: 2,
        borderRadius: 12,
        paddingHorizontal: 24,
        paddingVertical: 12,
        fontWeight: '600',
        fontSize: 16,
      },
      cta: {
        backgroundColor: '#00F0A8', // Teal accent
        color: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 24,
        paddingVertical: 12,
        fontWeight: '600',
        fontSize: 16,
      },
      disabled: {
        backgroundColor: '#D9D9D9',
        color: '#999999',
        borderRadius: 12,
        paddingHorizontal: 24,
        paddingVertical: 12,
        fontWeight: '600',
        fontSize: 16,
      }
    },
    
    cards: {
      default: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
      dark: {
        backgroundColor: '#121212',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      },
      quest: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#ECFF00',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }
    },

    navigation: {
      tabBar: {
        backgroundColor: '#121212',
        borderTopWidth: 1,
        borderTopColor: '#333333',
        paddingVertical: 8,
        height: 80,
      },
      header: {
        backgroundColor: '#ECFF00',
        height: 88,
        paddingTop: 44, // Status bar height
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
      }
    }
  },

  // Animation Specifications (TikTok/Snapchat inspired)
  animations: {
    bounce: {
      tension: 300,
      friction: 8,
    },
    scale: {
      activeScale: 0.95,
      duration: 150,
    },
    slide: {
      duration: 300,
      easing: 'ease-out',
    },
    fade: {
      duration: 200,
      easing: 'ease-in-out',
    },
    glow: {
      duration: 1000,
      iterations: -1, // Infinite
      direction: 'alternate',
    }
  },

  // Grid System
  grid: {
    mobile: {
      columns: 4,
      gutter: 16,
      margin: 16,
    },
    tablet: {
      columns: 8,
      gutter: 24,
      margin: 24,
    },
    desktop: {
      columns: 12,
      gutter: 32,
      margin: 32,
    }
  },

  // Breakpoints
  breakpoints: {
    mobile: 375,
    tablet: 768,
    desktop: 1024,
  },

  // Logo Specifications
  logo: {
    minSizes: {
      icon: 24,
      app_display: 48,
      hero: 96,
    },
    clearSpace: {
      multiplier: 1, // 1x height of crown
    },
    variants: {
      'full-color': {
        background: '#ECFF00',
        fill: '#FFFFFF',
        stroke: '#0D0D0D',
      },
      'icon-only': {
        background: 'transparent',
        fill: '#FFFFFF',
        stroke: '#0D0D0D',
      },
      'inverted': {
        background: '#121212',
        fill: '#FFFFFF',
        stroke: '#FFFFFF',
      },
      'monochrome': {
        background: 'transparent',
        fill: '#0B0B0B',
        stroke: '#0B0B0B',
      }
    }
  },

  // Brand Voice & Copy Guidelines
  voice: {
    tone: ['playful', 'modern', 'bold'],
    casing: {
      casual: 'lowercase', // "klikd"
      brand: 'capitalized', // "Klikd"
      headers: 'capitalized', // "KLIKD"
    },
    cta_starters: [
      'Create Quest',
      'Get Klikd',
      'Start Now',
      'Join Quest',
      'Boost Me',
      'Drop Now'
    ],
    youth_language: [
      'Squad Goals',
      'Epic',
      'Boost Me',
      'Drop Now',
      'Getting Klikd...'
    ]
  },

  // Platform-specific adaptations
  platforms: {
    ios: {
      statusBar: 'light-content',
      navigationBar: 'default',
      tabBar: 'black-translucent',
    },
    android: {
      statusBar: 'light-content',
      navigationBar: 'dark-content',
      systemUI: 'immersive',
    }
  }
};

// Theme variants for different modes
export const KlikdThemes = {
  light: {
    background: KlikdBrandSystem.colors.ui.app_bg_light,
    surface: KlikdBrandSystem.colors.primary.klikd_white,
    text: KlikdBrandSystem.colors.primary.klikd_black,
    accent: KlikdBrandSystem.colors.primary.klikd_green,
    border: KlikdBrandSystem.colors.ui.soft_gray,
  },
  
  dark: {
    background: KlikdBrandSystem.colors.ui.dark_bg,
    surface: '#1E1E1E',
    text: KlikdBrandSystem.colors.primary.klikd_white,
    accent: KlikdBrandSystem.colors.primary.klikd_green,
    border: '#333333',
  },
  
  neon: {
    background: KlikdBrandSystem.colors.primary.klikd_black,
    surface: '#0A0A0A',
    text: KlikdBrandSystem.colors.primary.klikd_white,
    accent: KlikdBrandSystem.colors.primary.klikd_green,
    border: KlikdBrandSystem.colors.primary.klikd_green,
    glow: true,
  }
};

// Export default
export default KlikdBrandSystem;
