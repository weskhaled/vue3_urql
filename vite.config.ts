import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
// import Preview from 'vite-plugin-vue-component-preview'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
// import VueRouter from 'unplugin-vue-router/vite'
import generateSitemap from 'vite-ssg-sitemap'
import Layouts from 'vite-plugin-vue-layouts'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
// import { VueRouterAutoImports } from 'unplugin-vue-router'
import Markdown from 'vite-plugin-vue-markdown'
import { VitePWA } from 'vite-plugin-pwa'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import Inspect from 'vite-plugin-inspect'
import Inspector from 'vite-plugin-vue-inspector'
import LinkAttributes from 'markdown-it-link-attributes'
import Unocss from 'unocss/vite'
import Shiki from 'markdown-it-shiki'
// @ts-expect-error failed to resolve types
import VueMacros from 'unplugin-vue-macros/vite'
// import { ViteWebfontDownload } from 'vite-plugin-webfont-dl'
import { ArcoResolver, VueUseComponentsResolver } from 'unplugin-vue-components/resolvers'

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'src')}/`,
      },
    },
    plugins: [
      // VueRouter(),
      VueMacros({
        plugins: {
          vue: Vue({
            include: [/\.vue$/, /\.md$/],
            reactivityTransform: true,
          }),
        },
      }),

      // https://github.com/hannoeru/vite-plugin-pages
      Pages({
        extensions: ['vue', 'md'],
        extendRoute(route) {
          // Augment the route with meta that indicates that the route requires authentication.
          return {
            ...route,
            meta: { requiresAuth: false, ...route.meta },
          }
        },
      }),

      // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
      Layouts(),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          // VueRouterAutoImports,
          'vue-i18n',
          'vue/macros',
          '@vueuse/head',
          '@vueuse/core',
        ],
        dts: 'src/auto-imports.d.ts',
        dirs: [
          'src/composables',
          'src/stores',
        ],
        vueTemplate: true,
        resolvers: [
          VueUseComponentsResolver(),
          ArcoResolver({
            sideEffect: true,
            importStyle: 'less',
            resolveIcons: true,
          }),
        ],
      }),

      // https://github.com/antfu/unplugin-vue-components
      Components({
        // allow auto load markdown components under `./src/components/`
        extensions: ['vue', 'md'],
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: 'src/components.d.ts',
        directoryAsNamespace: true,
        resolvers: [
          VueUseComponentsResolver(),
          ArcoResolver({
            sideEffect: true,
            importStyle: 'less',
            resolveIcons: true,
          }),
        ],
      }),
      // https://github.com/antfu/unocss
      // see unocss.config.ts for config
      Unocss(),

      // https://github.com/antfu/vite-plugin-vue-markdown
      // Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
      Markdown({
        wrapperClasses: 'prose prose-sm m-auto text-left',
        headEnabled: true,
        markdownItSetup(md) {
          // https://prismjs.com/
          md.use(Shiki, {
            theme: {
              light: 'vitesse-light',
              dark: 'vitesse-dark',
            },
          })
          md.use(LinkAttributes, {
            matcher: (link: string) => /^https?:\/\//.test(link),
            attrs: {
              target: '_blank',
              rel: 'noopener',
            },
          })
        },
      }),

      // https://github.com/antfu/vite-plugin-pwa
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'safari-pinned-tab.svg'],
        manifest: {
          name: 'Weskhaled',
          short_name: 'Weskhaled',
          theme_color: '#ffffff',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
      }),

      // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
      VueI18n({
        runtimeOnly: true,
        compositionOnly: true,
        fullInstall: true,
        include: [path.resolve(__dirname, 'locales/**')],
      }),

      // https://github.com/antfu/vite-plugin-inspect
      // Visit http://localhost:3333/__inspect/ to see the inspector
      Inspect(),

      // https://github.com/webfansplz/vite-plugin-vue-inspector
      Inspector({
        toggleButtonVisibility: 'never',
      }),

      // // https://github.com/feat-agency/vite-plugin-webfont-dl
      // ViteWebfontDownload([
      //   'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;700&family=Fira+Code:wght@400;600&family=Montserrat:ital,wght@0,200;0,400;0,700;1,200;1,400;1,700&display=swap',
      // ], {
      //   injectAsStyleTag: false,
      //   minifyCss: true,
      //   async: true,
      //   cache: true,
      //   proxy: false,
      // }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            // 'primary-6': '#0075ff',
            'border-radius-small': '0',
            'border-radius-medium': '2px',
          },
          javascriptEnabled: true,
        },
      },
    },
    test: {
      include: ['test/**/*.test.ts'],
      environment: 'jsdom',
      deps: {
        inline: ['@vue', '@vueuse', 'vue-demi', '@arco-design/web-vue'],
      },
      globals: false,
    },
    optimizeDeps: {
      include: [],
      exclude: [],
    },
    // https://github.com/antfu/vite-ssg
    ssgOptions: {
      script: 'async',
      formatting: 'none',
      format: 'esm',
      onFinished() { generateSitemap() },
    },

    ssr: {
      // TODO: workaround until they support native ESM
      noExternal: ['workbox-window', /vue-i18n/, '@arco-design/web-vue', 'scroll-into-view-if-needed', 'isotope-layout', '@googlemaps/js-api-loader'],
    },
    server: {
      hmr: {
        host: 'localhost',
        protocol: 'ws',
      },
      proxy: {
        // with options: http://localhost:5173/api/bar-> http://jsonplaceholder.typicode.com/bar
        '/graphql': {
          target: process.env.VITE_API_URL || 'http://localhost:3000/graphql',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/graphql/, ''),
        },
        // Proxying websockets or socket.io: ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
        '/socket.io': {
          target: process.env.VITE_API_WS_URL || 'ws://localhost:3000/graphql',
          ws: true,
          secure: true,
        },
      },
    },
  })
}
