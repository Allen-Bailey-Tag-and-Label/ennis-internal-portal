import adapter from '@sveltejs/adapter-netlify';
import path from 'path';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    vite: {
      optimizeDeps: {
        include: ['hashlru']
      },
      resolve: {
        alias: {
          '@components': path.resolve('./src/components'),
          '@lib': path.resolve('./src/lib'),
          '@routes': path.resolve('./src/routes'),
          '@stores': path.resolve('./src/stores')
        }
      }
    }
  },

  preprocess: [
    preprocess({
      postcss: true
    })
  ]
};

export default config;
