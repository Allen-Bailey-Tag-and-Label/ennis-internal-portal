import { resolve } from 'path';
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [
    vitePreprocess(),
    preprocess({
      postcss: true
    })
  ],

  kit: {
    adapter: adapter(),
    alias: {
      $actions: resolve('./src/actions'),
      $auth: resolve('./src/auth'),
      $components: resolve('./src/components'),
      $db: resolve('./src/db'),
      $icons: resolve('./src/icons'),
      $lib: resolve('./src/lib'),
      $routes: resolve('./src/routes'),
      $src: resolve('./src')
    }
  }
};

export default config;
