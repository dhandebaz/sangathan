const fs = require('fs');
const path = require('path');
const glob = require('glob');

async function generateOpenAPISpec() {
  const apiRoutes = await glob.glob('src/app/api/**/route.ts', { absolute: true });

  const spec = {
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
    const content = fs.readFileSync(routeFile, 'utf8');
    const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
    for (const method of methods) {
      // Case-insensitive regex to match export async function GET/POST/etc
      const regex = new RegExp(`export\\s+async\\s+function\\s+${method}\\s*\\(`, 'i');
      if (regex.test(content)) {
        const relativePath = routeFile.replace(/.*src[\\/]app[\\/]api[\\/]/, '').replace(/[\\/]route\.ts$/, '');
        const apiPath = '/' + relativePath.replace(/[\\/]/g, '/').replace(/\[(.*?)\]/g, '{$1}');

        if (!spec.paths[apiPath]) spec.paths[apiPath] = {};
        spec.paths[apiPath][method.toLowerCase()] = {
          summary: `${method} ${apiPath}`,
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
  const outputPath = path.resolve(process.cwd(), 'openapi.json');
  fs.writeFileSync(outputPath, JSON.stringify(spec, null, 2));
  console.log(`OpenAPI spec written to ${outputPath}`);
  console.log(`Paths found: ${Object.keys(spec.paths).length}`);
}

main().catch(console.error);