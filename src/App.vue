<script setup lang="ts">
import enUS from '@arco-design/web-vue/es/locale/lang/en-us'
import frFR from '@arco-design/web-vue/es/locale/lang/fr-fr'
import { userLang } from '~/common/stores'

import { availableLocales, loadLanguageAsync } from '~/modules/i18n'

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Weskhaled',
  meta: [
    // { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
    { name: 'description', content: 'Weskhaled Portfolio' },
    {
      name: 'theme-color',
      content: computed(() => isDark.value ? '#000000' : '#ffffff'),
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

const locales: any = {
  'en-US': enUS,
  'fr-FR': frFR,
}

const localeProvider = computed(() => {
  return locales[userLang.value] || enUS
})

watch(userLang, async (val) => {
  val && availableLocales.includes(val) && (await loadLanguageAsync(val))
})
</script>

<template>
  <Suspense>
    <!-- component with nested async dependencies -->
    <a-config-provider :locale="localeProvider">
      <RouterView />
    </a-config-provider>
    <template #fallback>
      <span class="flex justify-center content-center h-screen bg-light/55 dark:bg-dark/55">
        <span class="m-auto">
          <span class="mx-auto my-2 block w-8 h-8 i-line-md-loading-twotone-loop" />
          Loading...
        </span>
      </span>
    </template>
  </Suspense>
</template>
