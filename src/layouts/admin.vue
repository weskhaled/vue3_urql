<script setup lang="ts">
import { UseDraggable as Draggable } from '@vueuse/components'

// import { promiseTimeout } from '@vueuse/core'
import { layoutBoxed, mdAndSmaller, sideFixed, smAndSmaller } from '~/common/stores'

// const { t } = useI18n()
const { unloadCalendly } = useCalendly()
unloadCalendly()
// const router = useRouter()
// const { message } = useMessage()
const { width: windowWidth, height: windowHeight } = useWindowSize()

const popupVisible = ref(false)
const handle = ref<HTMLElement | null>(null)

// watch(isAuthenticated, (newVal, oldVal) => {
//   if (oldVal && !newVal)
//     router.push({ name: '/auth/login' })
// })
// const queryMe = gql`
//   query queryMe {
//     me {
//       nickname
//       role
//     }
//   }`

// try {
//   const { data, error } = await useQuery({
//     query: queryMe,
//   })
//   if (error.value) {
//     message.error('Error', `${error.value}`)
//     token.value = null
//     refreshToken.value = null
//     router.push({ name: '/auth/login' })
//   }

//   data.value && (currentUser.value = data.value.me)
// }
// catch (error) {
//   message.error('Error', `${error}`)
//   token.value = null
//   refreshToken.value = null
//   router.push({ name: '/auth/login' })
// }
// await promiseTimeout(120000)
</script>

<template>
  <div class="shadow-slate-2/25 dark:shadow-slate-8/25 shadow-md bg-light-1 dark:bg-dark-9 5xl:container mx-auto transition-width" :class="[layoutBoxed ? 'md:container' : 'w-full']">
    <a-layout class="font-sans relative !arco-theme-1">
      <AdminLayoutSider />
      <a-layout>
        <a-layout-header class="z-99 backdrop-blur backdrop-filter bg-white/75 dark:bg-black/75 fixed 5xl:container mx-auto w-full" :class="[layoutBoxed ? 'md:container' : 'w-full']">
          <AdminLayoutHeader />
        </a-layout-header>
        <a-layout class="flex flex-col min-h-[calc(100vh-3.625rem)] ml-0 !mt-14.5 transition-margin" :class="[sideFixed ? (smAndSmaller ? '!md:ml-12' : '!md:ml-60') : '!md:ml-12']">
          <a-layout-content class="grow-1 flex flex-auto flex-col">
            <RouterView />
          </a-layout-content>
          <a-layout-footer class="grow-0">
            <AdminLayoutFooter />
          </a-layout-footer>
        </a-layout>
      </a-layout>

      <Draggable
        storage-key="vueuse-draggable" storage-type="session"
        class="fixed z-1001" :initial-value="{ x: windowWidth - 150, y: windowHeight - 150 }" :prevent-default="true"
      >
        <div ref="handle">
          <span class="text-10px cursor-grab active:cursor-grabbing absolute z-102 top--5px left--5px w-5 h-5 rounded-full text-light-50 flex items-center justify-center bg-blue-700">
            <IconDragArrow />
          </span>
        </div>
        <a-trigger v-model:popupVisible="popupVisible" :trigger="[mdAndSmaller ? 'click' : 'hover']" position="top" class="cursor-grab dark:[--color-fill-2:black]">
          <div :class="`button-trigger ${popupVisible ? 'button-trigger-active' : ''}`">
            <span v-if="popupVisible" i-carbon-close />
            <span v-else i-carbon-overflow-menu-vertical />
          </div>
          <template #content>
            <a-menu
              :style="{ marginBottom: '-2px' }" mode="popButton" :tooltip-props="{ mini: true, position: 'left' }"
              show-collapse-button
            >
              <a-menu-item key="1">
                <template #icon>
                  <IconBug />
                </template>
                Bugs
              </a-menu-item>
              <a-menu-item key="2">
                <template #icon>
                  <IconBulb />
                </template>
                Ideas
              </a-menu-item>
            </a-menu>
          </template>
        </a-trigger>
      </Draggable>
    </a-layout>
  </div>
</template>

<style lang="less" scoped>
.button-trigger {
  @apply absolute cursor-pointer rounded-full z-101 items-center justify-center fixed text-sm flex h-40px w-40px text-zinc-100 bg-blue-600 shadow-md;
  transition: all 0.1s;
}
</style>
