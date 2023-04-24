<script setup lang="ts">
import { Button, Space } from '@arco-design/web-vue'
import '@arco-design/web-vue/es/button/style/css.js'
import '@arco-design/web-vue/es/space/style/css.js'

const { notification } = useNotification()
const router = useRouter()

const notificationId = `${Date.now()}`
onMounted(() => {
  notification.info({
    id: notificationId,
    title: 'Notification',
    content: 'This is a notification!',
    duration: 0,
    closable: true,
    footer: () => h(Space, {}, () => [
      h(Button, { size: 'mini', type: 'primary', onClick: () => notification.remove(notificationId) }, () => 'Ok'),
      h(Button, { size: 'mini', type: 'secondary', onClick: () => { router.push('/admin') } }, () => 'Go To Admin'),
    ]),
  })
})
</script>

<template>
  <!-- Example -->
  <div class="min-h-screen font-sans">
    <!-- Container -->
    <h1 class="text-xl">
      index
      <!-- <component is="templ" /> -->
    </h1>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
  requiresAuth: false
</route>
