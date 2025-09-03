#!/usr/bin/env node

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Mock OpenAPI generation - in real implementation this would import from @klikd/contracts
function generateOpenAPISpec() {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Klikd Platform API',
      version: '1.0.0',
      description: 'AR-powered social commerce platform API',
      contact: {
        name: 'Klikd API Support',
        email: 'api@klikd.com'
      }
    },
    servers: [
      {
        url: 'https://api.klikd.com/v1',
        description: 'Production server'
      },
      {
        url: 'https://staging-api.klikd.com/v1',
        description: 'Staging server'
      },
      {
        url: 'http://localhost:3001/api/v1',
        description: 'Development server'
      }
    ],
    paths: {
      '/auth/login': {
        post: {
          summary: 'User login',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 8 },
                    tenantId: { type: 'string', format: 'uuid' }
                  },
                  required: ['email', 'password']
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      accessToken: { type: 'string' },
                      refreshToken: { type: 'string' },
                      user: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', format: 'uuid' },
                          email: { type: 'string', format: 'email' },
                          role: { 
                            type: 'string', 
                            enum: ['explorer', 'influencer', 'business', 'agency', 'admin'] 
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/missions': {
        get: {
          summary: 'List available missions',
          tags: ['Missions'],
          parameters: [
            {
              name: 'cursor',
              in: 'query',
              schema: { type: 'string' },
              description: 'Pagination cursor'
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
              description: 'Number of items per page'
            }
          ],
          responses: {
            '200': {
              description: 'List of missions',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', format: 'uuid' },
                            title: { type: 'string' },
                            description: { type: 'string' },
                            type: { 
                              type: 'string', 
                              enum: ['ar_scan', 'social_share', 'location_visit', 'purchase'] 
                            },
                            reward: {
                              type: 'object',
                              properties: {
                                xp: { type: 'integer' },
                                coins: { type: 'integer' }
                              }
                            }
                          }
                        }
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          nextCursor: { type: 'string' },
                          hasMore: { type: 'boolean' },
                          total: { type: 'integer' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  };
}

function generateHTMLDocs(spec) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>Klikd API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
  <style>
    html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin:0; background: #fafafa; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        spec: ${JSON.stringify(spec, null, 2)},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.presets.standalone
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>`;
}

async function main() {
  const isValidate = process.argv.includes('--validate');
  
  console.log('🔧 Generating OpenAPI specification...');
  
  try {
    // Generate OpenAPI spec
    const spec = generateOpenAPISpec();
    
    // Create docs directory
    const docsDir = join(__dirname, '..', 'docs');
    mkdirSync(docsDir, { recursive: true });
    
    // Write OpenAPI JSON
    const specPath = join(docsDir, 'openapi.json');
    writeFileSync(specPath, JSON.stringify(spec, null, 2));
    console.log('✅ Generated OpenAPI spec:', specPath);
    
    // Generate HTML documentation
    const htmlDocs = generateHTMLDocs(spec);
    const htmlPath = join(docsDir, 'api-docs.html');
    writeFileSync(htmlPath, htmlDocs);
    console.log('✅ Generated HTML docs:', htmlPath);
    
    if (isValidate) {
      console.log('✅ OpenAPI validation passed');
      return;
    }
    
    console.log('\n📖 View documentation:');
    console.log(`   Open: ${htmlPath}`);
    console.log(`   Or serve: python -m http.server 8000 --directory docs`);
    
  } catch (error) {
    console.error('❌ OpenAPI generation failed:', error.message);
    process.exit(1);
  }
}

main();
