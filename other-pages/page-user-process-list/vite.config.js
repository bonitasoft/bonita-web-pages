import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const bonitaUrl = process.env.BONITA_URL || 'http://localhost:8080';

export default defineConfig(() => ({
    plugins: [
        svelte(),
        {
            // Inject Bonita theme.css AFTER Vite's bundled CSS so the theme
            // overrides npm Bootstrap's default colors (e.g. link color).
            name: 'bonita-theme',
            transformIndexHtml: {
                order: 'post',
                handler: () => [{
                    tag: 'link',
                    attrs: { rel: 'stylesheet', href: '../theme/theme.css' },
                    injectTo: 'head',
                }],
            },
        },
    ],
    base: './',
    build: {
        outDir: 'build',
        emptyOutDir: true,
    },
    server: {
        proxy: {
            // In production, pages call ../API/* relative to their Bonita path.
            // In dev, ../API resolves to /API from the root — rewrite to /bonita/API.
            '/API': {
                target: bonitaUrl,
                changeOrigin: true,
                cookieDomainRewrite: '',
                cookiePathRewrite: { '/bonita': '/' },
                rewrite: (path) => `/bonita${path}`,
            },
            '/bonita': {
                target: bonitaUrl,
                changeOrigin: true,
                cookieDomainRewrite: '',
                cookiePathRewrite: { '/bonita': '/' },
            },
        },
    },
}));
