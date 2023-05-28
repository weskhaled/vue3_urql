<script setup lang="ts">
// import { mdAndLarger, smAndSmaller } from '~/common/stores'

// defineOptions({
//   name: 'socialPage',
// })
// definePage({
//   name: 'adminSocial',
//   path: '/admin/social',
//   // alias: ['/admin/social'],
//   meta: {
//     layout: 'admin',
//     requiresAuth: true,
//     menu: {
//       name: 'social',
//       icon: 'i-carbon-two-person-lift',
//       parent: null,
//       hidden: false,
//     },
//   },
// })
// const { t } = useI18n()
// const { message } = useMessage()
// const { width: windowWidth } = useWindowSize()
// const router = useRouter()
</script>

<template>
  <div flex-1 h-full grow-1>
    test social page
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  requiresAuth: true
  adminSidebar:
    title: Social
    link: /admin/social
    order: 1
    icon: i-carbon-two-person-lift
    childOf: null
    hidden: false
</route>
