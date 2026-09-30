#!/usr/bin/env tsx
import { glob } from 'glob';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  servers: { url: string; description: string }[];
  paths: Record<string, Record<string, any>>;
  components: {
    schemas: Record<string, any>;
    securitySchemes: Record<string, any>;
  };
}

async function generateOpenAPISpec(): Promise<OpenAPISpec> {
  const apiRoutes = await glob('src/app/api/**/route.ts', { absolute: true });

  const spec: OpenAPISpec = {
    openapi: '3.1.0',
    info: {
      title: 'Sangathan API',
      version: '1.0.0',
      description: 'Sangathan Civic Infrastructure API - Public and Private endpoints for civic organizing',
    },
    servers: [
      { url: 'https://sangathan.space/api', description: 'Production server' },
      { url: 'http://localhost:3000/api', description: 'Local development server' },
    ],
    paths: {},
    components: {
      schemas: {},
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        CookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'sb-access-token',
        },
      },
    },
  };

  for (const routeFile of apiRoutes) {
    const content = await import(routeFile, { with: { type: 'text' } });
    // Extract HTTP methods and path parameters
    // This is a simplified extractor - in production you'd want a more robust parser
    const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
    for (const method of methods) {
      const regex = new RegExp(`export\\s+async\\s+function\\s+${method.toLowerCase()}\\s*\\(`, 'g');
      if (regex.test(content)) {
        // Extract path from file structure
        const relativePath = routeFile.replace(/.*src\\app\\api\\/, '').replace(/\\route\.ts$/, '');
        const path = '/' + relativePath.replace(/\\/g, '/').replace(/\[(.*?)\]/g, '{$1}');

        if (!spec.paths[path]) spec.paths[path] = {};
        spec.paths[path][method.toLowerCase()] = {
          summary: `${method} ${path}`,
          responses: {
            '200': { description: 'Successful response' },
            '400': { description: 'Bad request' },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Not found' },
            '500': { description: 'Internal server error' },
          },
          security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        };
      }
    }
  }

  return spec;
}

async function main() {
  const spec = await generateOpenAPISpec();
  const outputPath = resolve(process.cwd(), 'openapi.json');
  writeFileSync(outputPath, JSON.stringify(spec, null, 2));
  console.log(`OpenAPI spec written to ${outputPath}`);
}

main().catch(console.error);