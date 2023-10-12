import { ViteSSG } from 'vite-ssg'
import { setupLayouts } from 'virtual:generated-layouts'

import {
  type RouteRecordRaw,
} from 'vue-router/auto'

// import Previewer from 'virtual:vue-component-preview'
import { routes as generatedRoutes } from 'vue-router/auto/routes'
import App from './App.vue'
import type { UserModule } from './types'

// import generatedRoutes from '~pages'

import '@unocss/reset/tailwind.css'
import './styles/main.less'
import 'animate.css'
import 'uno.css'

function recursiveLayouts(route: RouteRecordRaw): RouteRecordRaw {
  if (route.children) {
    for (let i = 0; i < route.children.length; i++)
      route.children[i] = recursiveLayouts(route.children[i])

    return route
  }

  return setupLayouts([route])[0]
}

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  {
    // routes: setupLayouts(generatedRoutes),
    routes: generatedRoutes.map((route: RouteRecordRaw) => {
      // For each route, pass it to recursiveLayouts, which will apply layouts properly
      // (without duplicating or accidentally double-wrapping components).
      return recursiveLayouts(route)
    }),
    base: import.meta.env.BASE_URL,
  },
  async (ctx) => {
    // install all modules under `modules/`
    // await Promise.all(Object.values(import.meta.globEager('./modules/*.ts')).map(i => i.install?.(ctx)))
    Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
      .forEach(i => i.install?.(ctx))
    // ctx.app.use(Previewer)
  },
)
