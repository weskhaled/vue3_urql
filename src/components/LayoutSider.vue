<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
import { isDark } from '~/composables/dark'
import { sideCollapsed, smAndSmaller } from '~/common/stores'

// const { t } = useI18n()
// const router = useRouter()
const { message } = useMessage()

function onCollapse(val, type) {
  const content = type === 'responsive' ? 'Trigger Responsive Contraction' : 'Click to trigger contraction'
  message.info({
    content,
    duration: 2000,
  })
  sideCollapsed.value = val
}

function onClickMenuItem(key) {
  message.info({ content: `You select ${key}`, showIcon: true })
}
</script>

<template>
  <a-layout-sider
    v-on-click-outside="() => smAndSmaller && (sideCollapsed = true)"
    :theme="isDark ? 'dark' : 'light'" :width="230" collapsible :default-collapsed="sideCollapsed"
    :collapsed="sideCollapsed" class="!absolute !sm:relative z-98"
    @collapse="onCollapse"
  >
    <a-menu
      class="menu-side-nav"
      @menu-item-click="onClickMenuItem"
    >
      <a-menu-item key="0_1" disabled>
        <IconHome />
        Menu 1
      </a-menu-item>
      <a-menu-item key="0_2">
        <IconCalendar />
        Menu 2
      </a-menu-item>
      <a-sub-menu key="1">
        <template #title>
          <span>
            <IconCalendar />
            Navigation 1
          </span>
        </template>
        <a-menu-item key="1_1">
          Menu 1
        </a-menu-item>
        <a-menu-item key="1_2">
          Menu 2
        </a-menu-item>
        <a-sub-menu key="2" title="Navigation 2">
          <a-menu-item key="2_1">
            Menu 1
          </a-menu-item>
          <a-menu-item key="2_2">
            Menu 2
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="3" title="Navigation 3">
          <a-menu-item key="3_1">
            Menu 1
          </a-menu-item>
          <a-menu-item key="3_2">
            Menu 2
          </a-menu-item>
          <a-menu-item key="3_3">
            Menu 3
          </a-menu-item>
        </a-sub-menu>
      </a-sub-menu>
      <a-sub-menu key="4">
        <template #title>
          <span>
            <IconCalendar />
            Navigation 4
          </span>
        </template>
        <a-menu-item key="4_1">
          Menu 1
        </a-menu-item>
        <a-menu-item key="4_2">
          Menu 2
        </a-menu-item>
        <a-menu-item key="4_3">
          Menu 3
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
    <!-- trigger -->
    <template #trigger="{ collapsed }">
      <span v-if="collapsed" class="w-4 h-4 mr-2 inline-block leading-30px text-md i-line-md-menu-fold-right" />
      <span v-else class="w-4 h-4 mr-2 inline-block leading-30px text-md i-line-md-menu-unfold-left" />
    </template>
  </a-layout-sider>
</template>

<style scoped lang="less">
.menu-side-nav {
  // @apply h-[calc(80px+8px)];
  height: calc(100vh - 106px);
}

.arco-layout-sider-has-trigger {
  padding: 0;
  @apply flex flex-col;
}

:deep(.arco-layout-sider-children) {
  height: unset !important;
}

:deep(.arco-layout-sider-trigger) {
  @apply !bg-slate-100 !dark:bg-gray-900;
}
</style>
