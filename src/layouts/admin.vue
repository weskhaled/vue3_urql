<script setup lang="ts">
import { gql, useQuery } from '@urql/vue'
import { UseDraggable as Draggable } from '@vueuse/components'
import { currentUser, isAuthenticated } from '~/common/stores'

// const { t } = useI18n()
const router = useRouter()
const { message } = useMessage()
const { width: windowWidth, height: windowHeight } = useWindowSize()

const popupVisible = ref(false)
const handle = ref<HTMLElement | null>(null)

watch(isAuthenticated, (newVal, oldVal) => {
  if (oldVal && !newVal)
    router.push({ name: 'auth-login' })
})
const queryMe = gql`
  query queryMe {
    me {
      nickname
      role
    }
  }`

const { data, error } = await useQuery({
  query: queryMe,
})
data.value && (currentUser.value = data.value.me)
error.value && (message.error('Error', `${error.value}`))
</script>

<template>
  <a-layout class="layout-demo h-full font-sans relative !arco-theme-1">
    <a-layout-header class="shadow z-99 bg-light-50 dark:bg-dark-900">
      <LayoutHeader />
    </a-layout-header>
    <a-layout>
      <LayoutSider />
      <a-layout class="max-h-[calc(100vh-58px)] overscroll-y-auto !ml-12 !sm:ml-0">
        <a-layout-content class="">
          <RouterView />
        </a-layout-content>
        <a-layout-footer>
          <LayoutFooter />
        </a-layout-footer>
      </a-layout>
    </a-layout>

    <a-trigger v-model:popupVisible="popupVisible" :trigger="['click', 'hover']" position="top">
      <Draggable
        storage-key="vueuse-draggable" storage-type="session"
        class="fixed h-42px w-40px" :initial-value="{ x: windowWidth - 150, y: windowHeight - 150 }" :prevent-default="true"
        :handle="handle"
      >
        <div ref="handle">
          <span class="text-10px cursor-grab active:cursor-grabbing absolute z-102 top--5px left--5px w-5 h-5 rounded-full text-light-50 flex items-center justify-center bg-blue-700">
            <IconDragArrow />
          </span>
        </div>
        <div :class="`button-trigger ${popupVisible ? 'button-trigger-active' : ''}`">
          <IconClose v-if="popupVisible" />
          <IconMessage v-else />
        </div>
      </Draggable>
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
  </a-layout>
</template>

<style lang="less" scoped>
.button-trigger {
  @apply absolute cursor-pointer rounded-full z-100 items-center justify-center fixed text-sm flex h-40px w-40px text-zinc-100 bg-blue-600 shadow-md;
  transition: all 0.1s;
}
/* .arco-trigger-popup {
  @apply !ml-20px;
} */
:deep(.body) {
}
</style>
