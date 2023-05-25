<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
import { isDark } from '~/composables/dark'
import { sideCollapsed, sideFixed, smAndSmaller } from '~/common/stores'

// const { t } = useI18n()
// const router = useRouter()
const { message } = useMessage()

const visibleDrawer = ref(false)

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
    v-on-click-outside="() => smAndSmaller && ((sideCollapsed = true) && (visibleDrawer = false))"
    hide-trigger
    :theme="isDark ? 'dark' : 'light'" :width="sideFixed ? 240 : 260" collapsible :default-collapsed="sideCollapsed"
    :collapsed="sideCollapsed" :class="[sideFixed ? (smAndSmaller ? '!absolute' : '!relative') : '!absolute']" class="z-98 [--color-menu-dark-bg:rgba(0,0,0,1)]"
    @collapse="onCollapse"
    @mouseenter="() => !smAndSmaller && (sideCollapsed = false)"
    @mouseleave="() => !sideFixed && ((sideCollapsed = true) && (visibleDrawer = false))"
  >
    <div class="h-12 bg-zinc-1 dark:bg-dark-9 flex items-center justify-end border-b-1px border-zinc-5/10 dark:border-zinc-5/10 relative z-2">
      <div grow-1 pl-2 flex items-center justify-between>
        <a-button type="outline" size="mini" class="hidden mr-1">
          Primary
        </a-button>
        <a-button shape="circle" type="text" size="mini" class="mr-1" @click="() => visibleDrawer = !visibleDrawer">
          <span :class="[visibleDrawer ? 'i-carbon-chevron-up' : 'i-carbon-chevron-down']" />
        </a-button>
      </div>
      <div min-w-12 flex items-center justify-center>
        <a-button shape="circle" class="hidden md:block" size="small" type="text" @click="() => sideFixed = !sideFixed">
          <template #icon>
            <span :class="[!sideFixed ? 'i-carbon-radio-button' : 'i-carbon-radio-button-checked']" />
          </template>
        </a-button>
        <a-button class="block md:hidden" size="small" type="text" @click="() => sideCollapsed = !sideCollapsed">
          <template #icon>
            <span :class="[!sideCollapsed ? 'i-carbon-side-panel-close-filled' : 'i-carbon-side-panel-open-filled']" />
          </template>
        </a-button>
      </div>
    </div>
    <div id="parentNode" relative z-1>
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
    </div>
  </a-layout-sider>
  <a-drawer
    popup-container="#parentNode"
    :visible="visibleDrawer"
    height="90%"
    placement="top"
    :header="false"
    :footer="false"
    class="[&>.arco-drawer>.arco-drawer-body]:p-0 dark:[--color-bg-3:rgba(0,0,0,1)]"
    @cancel="() => visibleDrawer = false"
  >
    <div>
      You can customize modal body text by the current situation. This modal
      will be closed immediately once you press the OK button.
    </div>
  </a-drawer>
</template>

<style scoped lang="less">
.menu-side-nav {
  // @apply [--color-menu-light-bg:black];
  height: calc(100vh - 106px);
}

.arco-layout-sider-has-trigger {
  @apply flex flex-col border-none p-0;
}

:deep(.arco-layout-sider-children) {
  height: unset !important;
}

:deep(.arco-layout-sider-trigger) {
  @apply !bg-light-6 !dark:bg-dark-6;
}
</style>
