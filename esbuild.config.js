import { build } from 'esbuild';
import { readFileSync } from 'fs';

// Read package.json to get dependencies
const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
const dependencies = Object.keys(packageJson.dependencies || {});

const baseConfig = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outfile: 'dist/index.js',
  sourcemap: true,
  minify: false,
  // External dependencies (don't bundle them)
  external: dependencies,
  // Handle TypeScript path mapping
  resolveExtensions: ['.ts', '.js'],
  // Preserve JSX and other settings
  jsx: 'preserve',
  // Define environment
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  // Banner to add shebang or other content
  banner: {
    js: '// Tailscale MCP Server - Built with esbuild'
  }
};

// Development config
export const devConfig = {
  ...baseConfig,
  minify: false,
  sourcemap: true,
  define: {
    'process.env.NODE_ENV': '"development"'
  }
};

// Production config
export const prodConfig = {
  ...baseConfig,
  minify: true,
  sourcemap: false,
  define: {
    'process.env.NODE_ENV': '"production"'
  }
};

// Watch config
export const watchConfig = {
  ...devConfig,
  watch: {
    onRebuild(error, result) {
      if (error) {
        console.error('❌ Build failed:', error);
      } else {
        console.log('✅ Build succeeded');
      }
    }
  }
};

// Build function
export async function buildProject(config = prodConfig) {
  try {
    const result = await build(config);
    console.log('✅ Build completed successfully');
    return result;
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// CLI handling
if (import.meta.url === `file://${process.argv[1]}`) {
  const mode = process.argv[2] || 'build';

  switch (mode) {
    case 'dev':
      buildProject(devConfig);
      break;
    case 'watch':
      buildProject(watchConfig);
      break;
    case 'build':
    default:
      buildProject(prodConfig);
      break;
  }
}
