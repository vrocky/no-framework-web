import * as esbuild from 'esbuild';
import { copyFile, mkdir } from 'fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function copyAssets() {
  try {
    await mkdir('./dist', { recursive: true });
    await copyFile('./src/styles.css', './dist/styles.css');
    console.log('✅ Assets copied to dist');
  } catch (err) {
    console.error('❌ Error copying assets:', err);
  }
}

const config = {
  entryPoints: ['./src/index.tsx'],
  bundle: true,
  outfile: 'dist/bundle.js',
  loader: { '.tsx': 'tsx', '.ts': 'ts' },
  format: 'esm',
  target: ['es2020'],
  jsxFactory: 'h',
  sourcemap: true,
};

async function generateStaticHtml() {
  return new Promise((resolve, reject) => {
    exec('node dist-dev/gen-index-static.js', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Error generating static HTML:', error);
        reject(error);
      } else {
        console.log(stdout);
        resolve();
      }
    });
  });k
}

async function build() {
  try {
    await copyAssets();
    if (process.argv.includes('--watch')) {
      const ctx = await esbuild.context(config);
      await ctx.watch();
      console.log('Watching...');
    } else {
      await esbuild.build(config);
      console.log('✅ Built successfully!');
      await generateStaticHtml();
    }
  } catch (err) {
    console.error('❌ Build failed:', err);
    process.exit(1);
  }
}

build();
