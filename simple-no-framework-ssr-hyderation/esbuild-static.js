import * as esbuild from 'esbuild';
import { mkdir } from 'fs/promises';

async function buildStaticGenerator() {
  try {
    await mkdir('./dist-dev', { recursive: true });

    await esbuild.build({
      entryPoints: ['./gen-index-static.tsx'],
      bundle: true,
      outfile: 'dist-dev/gen-index-static.js',
      loader: { '.tsx': 'tsx', '.ts': 'ts' },
      format: 'esm',
      target: ['es2020'],
      platform: 'node',
      sourcemap: true,
      external: [
        'canvas',
        'jsdom',
      ],
    });

    console.log('✅ Static HTML generator built successfully in dist-dev/');
  } catch (err) {
    console.error('❌ Static generator build failed:', err);
    process.exit(1);
  }
}

buildStaticGenerator();
