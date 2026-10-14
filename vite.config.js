import { copyFile, stat } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function githubPagesSpaFallback() {
  let outDir;

  return {
    name: 'github-pages-spa-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const indexPath = resolve(outDir, 'index.html');
      const fallbackPath = resolve(outDir, '404.html');

      if (indexPath === fallbackPath) {
        throw new Error('GitHub Pages fallback cannot overwrite the built entry point.');
      }

      try {
        const indexStats = await stat(indexPath);
        if (!indexStats.isFile()) {
          throw new Error(`Expected the built entry point to be a file: ${indexPath}`);
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          throw new Error(`GitHub Pages fallback requires the built entry point: ${indexPath}`, { cause: error });
        }
        throw error;
      }

      try {
        await copyFile(indexPath, fallbackPath, constants.COPYFILE_EXCL);
      } catch (error) {
        if (error.code === 'EEXIST') {
          throw new Error(`Refusing to overwrite an existing GitHub Pages fallback: ${fallbackPath}`, { cause: error });
        }
        throw error;
      }
    },
  };
}

export default defineConfig({
  base: '/Maison-Temps-Luxury-Watch-Store/',
  plugins: [react(), tailwindcss(), githubPagesSpaFallback()],
});
