import { cwd } from 'node:process'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'

// import Preview from 'vite-plugin-vue-component-preview'
import Vue from '@vitejs/plugin-vue'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import Pages from 'vite-plugin-pages'

import VueRouter from 'unplugin-vue-router/vite'
import generateSitemap from 'vite-ssg-sitemap'
import Layouts from 'vite-plugin-vue-layouts'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

import { VueRouterAutoImports } from 'unplugin-vue-router'
import Markdown from 'vite-plugin-vue-markdown'
import { VitePWA } from 'vite-plugin-pwa'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import LinkAttributes from 'markdown-it-link-attributes'
import Unocss from 'unocss/vite'
import Shiki from 'markdown-it-shiki'
import VueMacros from 'unplugin-vue-macros/vite'

// import WebfontDownload from 'vite-plugin-webfont-dl'
import { vitePluginForArco } from '@arco-plugins/vite-vue'
import { VueUseComponentsResolver } from 'unplugin-vue-components/resolvers'

export default ({ mode }: any) => {
  const env = loadEnv(mode, cwd())

  return defineConfig({
    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'src')}/`,
      },
    },
    plugins: [
      VueRouter(),
      VueMacros({
        plugins: {
          vue: Vue({
            include: [/\.vue$/, /\.md$/],
            reactivityTransform: true,
          }),
        },
      }),
      ViteImageOptimizer({}),
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
          // 'vue-router',
          VueRouterAutoImports,
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
          // ArcoResolver({
          //   sideEffect: true,
          //   importStyle: 'less',
          //   resolveIcons: true,
          // }),
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
        ],
      }),
      // https://github.com/antfu/unocss
      // see unocss.config.ts for config
      Unocss(),

      // https://github.com/antfu/vite-plugin-vue-markdown
      // Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
      Markdown({
        wrapperClasses: 'prose prose-sm m-auto text-left h-screen',
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
        devOptions: {
          enabled: false,
        },
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

      // https://github.com/feat-agency/vite-plugin-webfont-dl
      // WebfontDownload('https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300;0,400;0,500;0,900;1,300;1,400;1,500;1,900&family=Fira+Code:wght@300;400;500;600;700&family=Kaushan+Script&family=Montserrat:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&family=Space+Grotesk:wght@300;400;700&display=swap'),

      // https://github.com/webfansplz/vite-plugin-vue-devtools
      VueDevTools(),

      // https://github.com/arco-design/arco-plugins/blob/main/packages/plugin-vite-vue/README.md
      vitePluginForArco({
        style: true,
        modifyVars: {
          'arcoblue-6': '#00aaff',
        },
      }),
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
      noExternal: ['workbox-window', /vue-i18n/, '@arco-design/web-vue', 'scroll-into-view-if-needed', 'isotope-layout', '@googlemaps/js-api-loader', '@vueuse/integrations'],
    },
    server: {
      hmr: {
        host: 'localhost',
        protocol: 'ws',
      },
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
        '/graphql': {
          target: `${env.VITE_API_URL || 'http://localhost:3000'}/graphql`,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/graphql/, ''),
        },
        // Proxying websockets or socket.io: ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
        '/socket.io': {
          target: env.VITE_API_WS_URL || 'ws://localhost:3000/graphql',
          ws: true,
          secure: true,
          rewrite: path => path.replace(/^\/socket.io/, ''),
        },
        // Proxying websockets or socket.io: ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
        '/all-api': {
          target: 'http://all.api.radio-browser.info/json',
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/all-api/, ''),
        },
      },
    },
  })
}
