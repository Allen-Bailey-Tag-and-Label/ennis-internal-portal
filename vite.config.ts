import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			'@components': path.resolve('./src/components'),
			'@lib': path.resolve('./src/lib'),
			'@routes': path.resolve('./src/routes'),
			'@stores': path.resolve('./src/stores')
		}
	}
});
