<script setup lang="ts">
import enUS from '@arco-design/web-vue/es/locale/lang/en-us'
import frFR from '@arco-design/web-vue/es/locale/lang/fr-fr'
import { isAuthenticated, userLang } from '~/common/stores'

import { availableLocales, loadLanguageAsync } from '~/modules/i18n'

const router = useRouter()

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Vitesse',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
    { name: 'description', content: 'Opinionated Vite Starter Template' },
    {
      name: 'theme-color',
      content: computed(() => isDark.value ? '#00aba9' : '#ffffff'),
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: computed(() => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg'),
    },
  ],
})
const locales = {
  'en-US': enUS,
  'fr-FR': frFR,
}

const localeProvider = computed(() => {
  return locales[userLang.value] || enUS
})
watch(userLang, async (val) => {
  val && availableLocales.includes(val) && (await loadLanguageAsync(val))
})
watchOnce(isAuthenticated, async (val, oldVal) => {
  if (val && !oldVal)
    return await router.push('/')

  if (!val)
    return await router.push('/login')
}, { immediate: true })
</script>

<template>
  <Suspense>
    <!-- component with nested async dependencies -->
    <a-config-provider :locale="localeProvider">
      <RouterView />
    </a-config-provider>
    <template #fallback>
      <span class="flex justify-center content-center h-screen">
        <span class="m-auto text-sky-500">
          <span class="mx-auto my-2 block w-8 h-8 i-line-md-loading-twotone-loop" />
          Loading...
        </span>
      </span>
    </template>
  </Suspense>
</template>
