import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Root Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Explorer: NavigatorScreenParams<ExplorerStackParamList>;
  Influencer: NavigatorScreenParams<InfluencerStackParamList>;
  Business: NavigatorScreenParams<BusinessStackParamList>;
  Agency: NavigatorScreenParams<AgencyStackParamList>;
};

// Auth Stack
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Onboarding Stack
export type OnboardingStackParamList = {
  OnboardingWelcome: undefined;
  RoleSelection: undefined;
  ProfileSetup: undefined;
  Permissions: undefined;
  Tutorial: undefined;
};

// Explorer Stack
export type ExplorerStackParamList = {
  MainTabs: NavigatorScreenParams<ExplorerTabParamList>;
  MissionDetails: { missionId: string };
  ARExperience: { anchorId: string };
  Profile: undefined;
};

export type ExplorerTabParamList = {
  Home: undefined;
  AR: undefined;
  Missions: undefined;
  Rewards: undefined;
  Profile: undefined;
};

// Influencer Stack
export type InfluencerStackParamList = {
  MainTabs: NavigatorScreenParams<InfluencerTabParamList>;
  CampaignDetails: { campaignId: string };
  ContentCreator: undefined;
  Analytics: undefined;
};

export type InfluencerTabParamList = {
  Dashboard: undefined;
  Campaigns: undefined;
  Content: undefined;
  Analytics: undefined;
  Wallet: undefined;
  Profile: undefined;
};

// Business Stack
export type BusinessStackParamList = {
  MainTabs: NavigatorScreenParams<BusinessTabParamList>;
  CreateCampaign: undefined;
  CampaignDetails: { campaignId: string };
  CustomerDetails: { customerId: string };
};

export type BusinessTabParamList = {
  Dashboard: undefined;
  Campaigns: undefined;
  Customers: undefined;
  Analytics: undefined;
  Billing: undefined;
  Settings: undefined;
};

// Agency Stack
export type AgencyStackParamList = {
  MainTabs: NavigatorScreenParams<AgencyTabParamList>;
  ClientDetails: { clientId: string };
  CampaignDetails: { campaignId: string };
  TeamMember: { memberId: string };
};

export type AgencyTabParamList = {
  Dashboard: undefined;
  Clients: undefined;
  Campaigns: undefined;
  Reports: undefined;
  Team: undefined;
  Settings: undefined;
};

// Screen Props Types
export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type ExplorerScreenProps<T extends keyof ExplorerStackParamList> = NativeStackScreenProps<
  ExplorerStackParamList,
  T
>;
