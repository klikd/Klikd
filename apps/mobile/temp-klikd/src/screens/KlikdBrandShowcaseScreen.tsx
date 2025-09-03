// Klikd™ Brand Showcase Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Switch,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KlikdLogo, KlikdHorizontalLogo, KlikdAppIcon } from '../components/KlikdLogo';
import { KlikdBrandSystem, KlikdThemes } from '../design/KlikdBrandSystem';

const { width: screenWidth } = Dimensions.get('window');

interface KlikdBrandShowcaseScreenProps {
  navigation: any;
}

export default function KlikdBrandShowcaseScreen({ navigation }: KlikdBrandShowcaseScreenProps) {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'neon'>('dark');
  const [showGrid, setShowGrid] = useState(false);

  const theme = KlikdThemes[currentTheme];

  const logoVariants = [
    { name: 'Full Color', variant: 'full-color' as const, size: 64 },
    { name: 'Icon Only', variant: 'icon-only' as const, size: 64 },
    { name: 'Inverted', variant: 'inverted' as const, size: 64 },
    { name: 'Monochrome', variant: 'monochrome' as const, size: 64 },
  ];

  const colorPalette = [
    { name: 'Klikd Green', color: KlikdBrandSystem.colors.primary.klikd_green, text: '#0B0B0B' },
    { name: 'Klikd Black', color: KlikdBrandSystem.colors.primary.klikd_black, text: '#FFFFFF' },
    { name: 'Klikd White', color: KlikdBrandSystem.colors.primary.klikd_white, text: '#0B0B0B' },
    { name: 'Link/CTA', color: KlikdBrandSystem.colors.ui.link_cta, text: '#FFFFFF' },
    { name: 'Alert Red', color: KlikdBrandSystem.colors.ui.alert_red, text: '#FFFFFF' },
    { name: 'Soft Gray', color: KlikdBrandSystem.colors.ui.soft_gray, text: '#0B0B0B' },
  ];

  const tierColors = [
    { name: '✨ Spark', color: KlikdBrandSystem.colors.tiers.spark, emoji: '✨' },
    { name: '🔥 Ignite', color: KlikdBrandSystem.colors.tiers.ignite, emoji: '🔥' },
    { name: '🦁 Dominator', color: KlikdBrandSystem.colors.tiers.dominator, emoji: '🦁' },
    { name: '⚜️ BrandLuxury', color: KlikdBrandSystem.colors.tiers.brand_luxury, emoji: '⚜️' },
    { name: '🚀 CreatorX', color: KlikdBrandSystem.colors.tiers.creator_x, emoji: '🚀' },
    { name: '💎 CreatorLuxury', color: KlikdBrandSystem.colors.tiers.creator_luxury, emoji: '💎' },
  ];

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.surface }]}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={theme.text} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: theme.text }]}>Klikd™ Brand System</Text>
      <View style={styles.placeholder} />
    </View>
  );

  const renderThemeSelector = () => (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Theme Preview</Text>
      <View style={styles.themeButtons}>
        {(['light', 'dark', 'neon'] as const).map((themeKey) => (
          <TouchableOpacity
            key={themeKey}
            style={[
              styles.themeButton,
              { 
                backgroundColor: currentTheme === themeKey ? theme.accent : 'transparent',
                borderColor: theme.accent 
              }
            ]}
            onPress={() => setCurrentTheme(themeKey)}
          >
            <Text style={[
              styles.themeButtonText,
              { 
                color: currentTheme === themeKey ? KlikdBrandSystem.colors.primary.klikd_black : theme.text 
              }
            ]}>
              {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderLogoVariants = () => (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Logo Variants</Text>
      <View style={styles.logoGrid}>
        {logoVariants.map((logo) => (
          <View key={logo.name} style={styles.logoItem}>
            <View style={[
              styles.logoContainer,
              { 
                backgroundColor: logo.variant === 'monochrome' ? theme.background : 'transparent',
                borderColor: theme.border,
                borderWidth: 1
              }
            ]}>
              <KlikdLogo size={logo.size} variant={logo.variant} />
            </View>
            <Text style={[styles.logoLabel, { color: theme.text }]}>{logo.name}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.horizontalLogoSection}>
        <Text style={[styles.sectionSubtitle, { color: theme.text }]}>Horizontal Lockup</Text>
        <View style={[styles.logoContainer, { backgroundColor: theme.background, borderColor: theme.border, borderWidth: 1 }]}>
          <KlikdHorizontalLogo size={48} variant={currentTheme === 'light' ? 'monochrome' : 'inverted'} />
        </View>
      </View>

      <View style={styles.appIconSection}>
        <Text style={[styles.sectionSubtitle, { color: theme.text }]}>App Icon</Text>
        <View style={styles.appIconContainer}>
          <KlikdAppIcon size={80} />
        </View>
      </View>
    </View>
  );

  const renderColorPalette = () => (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Brand Colors</Text>
      <View style={styles.colorGrid}>
        {colorPalette.map((color) => (
          <View key={color.name} style={styles.colorItem}>
            <View style={[styles.colorSwatch, { backgroundColor: color.color }]}>
              <Text style={[styles.colorHex, { color: color.text }]}>
                {color.color}
              </Text>
            </View>
            <Text style={[styles.colorName, { color: theme.text }]}>{color.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderTierColors = () => (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>User Tier Colors</Text>
      <View style={styles.tierGrid}>
        {tierColors.map((tier) => (
          <View key={tier.name} style={styles.tierItem}>
            <View style={[styles.tierBadge, { backgroundColor: tier.color }]}>
              <Text style={styles.tierEmoji}>{tier.emoji}</Text>
            </View>
            <Text style={[styles.tierName, { color: theme.text }]}>{tier.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderTypography = () => (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Typography System</Text>
      <View style={styles.typographySection}>
        <Text style={[styles.appTitle, { color: theme.text }]}>App Title (28px Bold)</Text>
        <Text style={[styles.sectionHeader, { color: theme.text }]}>Section Header (22px Semibold)</Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>Paragraph text using Inter Regular (16px)</Text>
        <Text style={[styles.caption, { color: theme.text }]}>Caption text for small details (12px Light)</Text>
      </View>
    </View>
  );

  const renderButtons = () => (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Button System</Text>
      <View style={styles.buttonSection}>
        <TouchableOpacity style={[styles.primaryButton, KlikdBrandSystem.components.buttons.primary]}>
          <Text style={[styles.buttonText, { color: KlikdBrandSystem.colors.primary.klikd_black }]}>
            Get Klikd
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.secondaryButton, KlikdBrandSystem.components.buttons.secondary]}>
          <Text style={[styles.buttonText, { color: KlikdBrandSystem.colors.primary.klikd_green }]}>
            Join Quest
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.ctaButton, KlikdBrandSystem.components.buttons.cta]}>
          <Text style={[styles.buttonText, { color: KlikdBrandSystem.colors.primary.klikd_white }]}>
            Start Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {renderHeader()}
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderThemeSelector()}
        {renderLogoVariants()}
        {renderColorPalette()}
        {renderTierColors()}
        {renderTypography()}
        {renderButtons()}
        
        {/* Brand Guidelines Summary */}
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Brand Guidelines</Text>
          <View style={styles.guidelinesSection}>
            <Text style={[styles.guidelineItem, { color: theme.text }]}>
              • Logo: Origami crown with 5 geometric segments
            </Text>
            <Text style={[styles.guidelineItem, { color: theme.text }]}>
              • Fill: Always white (#FFFFFF) inside crown
            </Text>
            <Text style={[styles.guidelineItem, { color: theme.text }]}>
              • Stroke: Black (#0B0B0B) 3-4px outline
            </Text>
            <Text style={[styles.guidelineItem, { color: theme.text }]}>
              • Spacing: 1x crown height clearspace
            </Text>
            <Text style={[styles.guidelineItem, { color: theme.text }]}>
              • Typography: Inter font family only
            </Text>
            <Text style={[styles.guidelineItem, { color: theme.text }]}>
              • Voice: Playful, modern, bold, Gen-Z forward
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  
  // Theme Selector
  themeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  themeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Logo Variants
  logoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  logoItem: {
    alignItems: 'center',
    width: (screenWidth - 80) / 2,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  horizontalLogoSection: {
    marginBottom: 24,
  },
  appIconSection: {
    alignItems: 'center',
  },
  appIconContainer: {
    marginTop: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  
  // Colors
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorItem: {
    alignItems: 'center',
    width: (screenWidth - 80) / 3,
  },
  colorSwatch: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorHex: {
    fontSize: 10,
    fontWeight: '600',
  },
  colorName: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // Tier Colors
  tierGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tierItem: {
    alignItems: 'center',
    width: (screenWidth - 80) / 3,
  },
  tierBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  tierEmoji: {
    fontSize: 20,
  },
  tierName: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // Typography
  typographySection: {
    gap: 12,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: '600',
  },
  paragraph: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    fontWeight: '300',
  },
  
  // Buttons
  buttonSection: {
    gap: 12,
  },
  primaryButton: {
    alignItems: 'center',
  },
  secondaryButton: {
    alignItems: 'center',
  },
  ctaButton: {
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Guidelines
  guidelinesSection: {
    gap: 8,
  },
  guidelineItem: {
    fontSize: 14,
    lineHeight: 20,
  },
});
