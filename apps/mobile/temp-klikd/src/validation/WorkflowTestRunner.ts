// Comprehensive Workflow Test Runner
// Validates all 50+ user journey categories against current implementation

import { validateAllWorkflows, WorkflowTest, UserJourneyValidation } from './WorkflowValidator';

interface ValidationReport {
  timestamp: string;
  totalCategories: number;
  implementedCategories: number;
  missingFeatures: string[];
  criticalGaps: string[];
  recommendations: string[];
  userTypeStatus: {
    general: 'complete' | 'incomplete' | 'critical_gaps';
    influencer: 'complete' | 'incomplete' | 'critical_gaps';
    business: 'complete' | 'incomplete' | 'critical_gaps';
    agency: 'complete' | 'incomplete' | 'critical_gaps';
  };
}

export class WorkflowTestRunner {
  
  // Test all 50+ workflow categories
  async runFullValidation(): Promise<ValidationReport> {
    console.log('🚀 Starting comprehensive workflow validation...');
    
    const validationResults = validateAllWorkflows();
    const report = this.generateValidationReport(validationResults);
    
    console.log('📊 Validation Results:');
    console.log(`✅ Implemented: ${report.implementedCategories}/${report.totalCategories} categories`);
    console.log(`⚠️  Critical Gaps: ${report.criticalGaps.length}`);
    console.log(`🔧 Missing Features: ${report.missingFeatures.length}`);
    
    return report;
  }

  // Validate specific workflow categories
  validateWorkflowCategory(category: string): WorkflowTest[] {
    const allResults = validateAllWorkflows();
    const categoryTests: WorkflowTest[] = [];
    
    allResults.forEach(userValidation => {
      const categoryWorkflows = userValidation.workflows.filter(
        workflow => workflow.category === category
      );
      categoryTests.push(...categoryWorkflows);
    });
    
    return categoryTests;
  }

  // Test critical user journeys
  testCriticalJourneys(): { passed: number; failed: number; issues: string[] } {
    const criticalJourneys = [
      'Onboarding to Mission Completion',
      'Friend Collaboration Mission', 
      'Sponsored Mission Flow',
      'AR Content Publishing',
      'Voucher Redemption Flow'
    ];

    let passed = 0;
    let failed = 0;
    const issues: string[] = [];

    const allResults = validateAllWorkflows();
    
    criticalJourneys.forEach(journeyName => {
      const journey = this.findWorkflowByName(allResults, journeyName);
      if (journey) {
        if (journey.status === 'passed') {
          passed++;
        } else {
          failed++;
          if (journey.issues) {
            issues.push(...journey.issues);
          }
        }
      } else {
        failed++;
        issues.push(`Critical journey "${journeyName}" not found`);
      }
    });

    return { passed, failed, issues };
  }

  // Generate comprehensive validation report
  private generateValidationReport(validationResults: UserJourneyValidation[]): ValidationReport {
    const timestamp = new Date().toISOString();
    const totalCategories = 50; // Based on your comprehensive list
    
    let implementedCategories = 0;
    const missingFeatures: string[] = [];
    const criticalGaps: string[] = [];
    const recommendations: string[] = [];

    // Analyze each user type
    const userTypeStatus: {
      general: 'complete' | 'incomplete' | 'critical_gaps';
      influencer: 'complete' | 'incomplete' | 'critical_gaps';
      business: 'complete' | 'incomplete' | 'critical_gaps';
      agency: 'complete' | 'incomplete' | 'critical_gaps';
    } = {
      general: 'incomplete',
      influencer: 'incomplete',
      business: 'incomplete',
      agency: 'critical_gaps' // Not implemented yet
    };

    validationResults.forEach(userValidation => {
      userTypeStatus[userValidation.userType] = userValidation.overallStatus;
      
      // Count implemented categories
      const passedWorkflows = userValidation.workflows.filter(w => w.status === 'passed');
      implementedCategories += passedWorkflows.length;
      
      // Collect missing features and gaps
      userValidation.workflows.forEach(workflow => {
        if (workflow.status === 'failed' || workflow.status === 'partial') {
          workflow.requiredFeatures.forEach(feature => {
            if (!missingFeatures.includes(feature)) {
              missingFeatures.push(feature);
            }
          });
          
          if (workflow.issues) {
            criticalGaps.push(...workflow.issues);
          }
        }
      });
      
      // Add critical issues
      criticalGaps.push(...userValidation.criticalIssues);
    });

    // Generate recommendations
    recommendations.push(...this.generateRecommendations(missingFeatures, criticalGaps));

    return {
      timestamp,
      totalCategories,
      implementedCategories: Math.min(implementedCategories, totalCategories),
      missingFeatures: [...new Set(missingFeatures)],
      criticalGaps: [...new Set(criticalGaps)],
      recommendations,
      userTypeStatus
    };
  }

  // Generate actionable recommendations
  private generateRecommendations(missingFeatures: string[], criticalGaps: string[]): string[] {
    const recommendations: string[] = [];

    // AR/Camera recommendations
    if (missingFeatures.includes('ar_detection') || criticalGaps.some(gap => gap.includes('AR'))) {
      recommendations.push('Implement comprehensive AR detection and interaction system');
      recommendations.push('Add zone-based AR triggers with proper camera integration');
    }

    // POS Integration recommendations
    if (missingFeatures.includes('pos_integration') || criticalGaps.some(gap => gap.includes('POS'))) {
      recommendations.push('Integrate with Foodics/Oracle POS systems for reward redemption');
      recommendations.push('Implement QR code scanning for in-store voucher validation');
    }

    // Agency workflows
    if (criticalGaps.some(gap => gap.includes('Agency'))) {
      recommendations.push('Implement Agency Dashboard with brand management features');
      recommendations.push('Add multi-client campaign management and reporting tools');
    }

    // Real-time features
    if (missingFeatures.includes('real_time_sync')) {
      recommendations.push('Add real-time synchronization for social interactions');
      recommendations.push('Implement live mission updates and friend activity feeds');
    }

    // Advanced personalization
    if (missingFeatures.includes('ai_personalization')) {
      recommendations.push('Enhance AI-driven content personalization and recommendations');
      recommendations.push('Add behavioral analysis for improved user engagement');
    }

    return recommendations;
  }

  // Helper method to find workflow by name
  private findWorkflowByName(validationResults: UserJourneyValidation[], name: string): WorkflowTest | null {
    for (const userValidation of validationResults) {
      const workflow = userValidation.workflows.find(w => w.testName === name);
      if (workflow) return workflow;
    }
    return null;
  }

  // Validate specific user journey paths
  validateUserJourneyPath(path: string[]): { valid: boolean; missingSteps: string[] } {
    const missingSteps: string[] = [];
    
    // Check if each step in the path is implemented
    path.forEach(step => {
      if (!this.isStepImplemented(step)) {
        missingSteps.push(step);
      }
    });

    return {
      valid: missingSteps.length === 0,
      missingSteps
    };
  }

  // Check if a specific step is implemented
  private isStepImplemented(step: string): boolean {
    const implementedSteps = [
      'onboarding_complete',
      'avatar_creation',
      'map_navigation', 
      'mission_discovery',
      'friend_management',
      'social_interaction',
      'profile_management',
      'influencer_dashboard',
      'business_dashboard',
      'mission_completion',
      'reward_earning',
      'content_creation'
    ];

    return implementedSteps.includes(step.toLowerCase().replace(/\s+/g, '_'));
  }

  // Generate test summary
  generateTestSummary(): string {
    const results = validateAllWorkflows();
    let summary = '# Klikd User Journey Validation Summary\n\n';
    
    results.forEach(userValidation => {
      summary += `## ${userValidation.userType.toUpperCase()} User Workflows\n`;
      summary += `Status: ${userValidation.overallStatus}\n`;
      summary += `Total Tests: ${userValidation.workflows.length}\n`;
      
      const passed = userValidation.workflows.filter(w => w.status === 'passed').length;
      const partial = userValidation.workflows.filter(w => w.status === 'partial').length;
      const failed = userValidation.workflows.filter(w => w.status === 'failed').length;
      
      summary += `✅ Passed: ${passed}\n`;
      summary += `⚠️  Partial: ${partial}\n`;
      summary += `❌ Failed: ${failed}\n\n`;
      
      if (userValidation.criticalIssues.length > 0) {
        summary += `### Critical Issues:\n`;
        userValidation.criticalIssues.forEach(issue => {
          summary += `- ${issue}\n`;
        });
        summary += '\n';
      }
    });

    return summary;
  }
}

// Export test runner instance
export const workflowTestRunner = new WorkflowTestRunner();
