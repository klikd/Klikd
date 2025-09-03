#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Required environment variables
const REQUIRED_VARS = [
  'DATABASE_URL',
  'REDIS_URL',
  'JWT_SECRET',
  'MEILISEARCH_URL',
  'MEILISEARCH_MASTER_KEY',
  'S3_ENDPOINT',
  'S3_ACCESS_KEY_ID',
  'S3_SECRET_ACCESS_KEY',
  'S3_BUCKET_NAME'
];

// Optional but recommended variables
const RECOMMENDED_VARS = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STC_PAY_API_KEY',
  'FIREBASE_PROJECT_ID',
  'MIXPANEL_TOKEN',
  'SENTRY_DSN'
];

function checkEnvironment() {
  console.log('🔍 Checking environment variables...\n');

  const missing = [];
  const present = [];
  const recommended = [];

  // Check required variables
  for (const varName of REQUIRED_VARS) {
    if (process.env[varName]) {
      present.push(varName);
    } else {
      missing.push(varName);
    }
  }

  // Check recommended variables
  for (const varName of RECOMMENDED_VARS) {
    if (process.env[varName]) {
      present.push(varName);
    } else {
      recommended.push(varName);
    }
  }

  // Display results
  if (present.length > 0) {
    console.log('✅ Present variables:');
    present.forEach(varName => {
      const value = process.env[varName];
      const masked = value.length > 10 ? 
        `${value.substring(0, 4)}...${value.substring(value.length - 4)}` : 
        '***';
      console.log(`   ${varName}=${masked}`);
    });
    console.log('');
  }

  if (missing.length > 0) {
    console.log('❌ Missing required variables:');
    missing.forEach(varName => {
      console.log(`   ${varName}`);
    });
    console.log('');
  }

  if (recommended.length > 0) {
    console.log('⚠️  Missing recommended variables:');
    recommended.forEach(varName => {
      console.log(`   ${varName}`);
    });
    console.log('');
  }

  // Check .env.example exists
  try {
    const envExamplePath = join(__dirname, '..', '.env.example');
    const envExample = readFileSync(envExamplePath, 'utf8');
    console.log('📄 .env.example found with', envExample.split('\n').length, 'lines');
  } catch (error) {
    console.log('⚠️  .env.example not found');
  }

  // Final status
  if (missing.length === 0) {
    console.log('🎉 Environment check passed!');
    process.exit(0);
  } else {
    console.log(`💥 Environment check failed! ${missing.length} required variables missing.`);
    console.log('\n💡 Copy .env.example to .env and fill in the missing values:');
    console.log('   cp .env.example .env');
    process.exit(1);
  }
}

checkEnvironment();
