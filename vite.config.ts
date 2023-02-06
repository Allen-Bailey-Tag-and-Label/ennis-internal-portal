import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';
import type { UserConfig } from 'vite';

const config: UserConfig = {
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $auth: resolve('./src/auth'),
      $components: resolve('./src/components'),
      $db: resolve('./src/db'),
      $icons: resolve('./src/icons'),
      $lib: resolve('./src/lib'),
      $routes: resolve('./src/routes'),
      $src: resolve('./src')
    }
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
};

export default config;
