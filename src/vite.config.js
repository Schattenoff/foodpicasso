import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import svgLoader from 'vite-svg-loader';
import imagePresets, { hdPreset, formatPreset, widthPreset, densityPreset } from 'vite-plugin-image-presets';

// https://vitejs.dev/config/
export default defineConfig({

    base: '/',

    server: {
        host: true
    },

    build: {
        target: 'es2015',
        outDir: '../build',
        emptyOutDir: true,
        rollupOptions: {
            output: {
                chunkFileNames: 'js/[name]-[hash].js',
                entryFileNames: 'js/[name]-[hash].js',

                assetFileNames: ({name}) => {
                    if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')){
                        return 'img/[name]-[hash][extname]';
                    }

                    if (/\.css$/.test(name ?? '')) {
                        return 'css/[name]-[hash][extname]';
                    }

                    if (/\.woff2?$/.test(name ?? '')) {
                        return 'font/[name]-[hash][extname]';
                    }

                    if (/\.mp3$/.test(name ?? '')) {
                        return 'media/[name]-[hash][extname]';
                    }

                    // default value
                    // ref: https://rollupjs.org/guide/en/#outputassetfilenames
                    return '[name]-[hash][extname]';
                },
            },
        },
        ssgOptions: {
            crittersOptions: {
                // E.g., change the preload strategy
                preload: 'media',
                // Other options: https://github.com/GoogleChromeLabs/critters#usage
            },
        },
    },

    plugins: [

        vue(),

        svgLoader(),

        /**
         * Автоимпорт компонентов .vue по их имени,
         * поэтому именуем компоненты в PascalCase (например: HelloWorld.vue)
         * */
        Components({
            // extensions: ['vue', 'svg'],
            dirs: ['src/common/components', 'src/page'],
        }),

        /**
         * Картинки импортированные с get параметром preset=full
         * */
        imagePresets({
            full: formatPreset({
                loading: 'eager',
                formats: {
                    avif: { quality: 80 },
                    webp: { quality: 80 },
                    png: { quality: 80 },
                },
            }),
            // hd: hdPreset({
            //     loading: 'lazy',
            //     widths: [1000, 'original'],
            //     sizes: '(min-width: 500px) 500px, 100vw',
            //     formats: {
            //         avif: { lossless: true },
            //         webp: { lossless: true },
            //         png: { quality: 80 },
            //     },
            // }),
        }, {
            assetsDir: 'img',
        }),
    ],

    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
});

// todo Нужно настроить https для preview