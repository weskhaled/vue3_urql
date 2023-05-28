<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
import { MenuItem, SubMenu } from '@arco-design/web-vue'
import { isDark } from '~/composables/dark'
// import '@arco-design/web-vue/es/menu-item/style/css.js'
import { mdAndLarger, menuItems, sideCollapsed, sideFixed, smAndSmaller } from '~/common/stores'
import generatedRoutes from '~pages'

// const { t } = useI18n()
// const { message } = useMessage()
const router = useRouter()
const route = useRoute()

const visibleDrawer = ref(false)

function onCollapse(val, type) {
  sideCollapsed.value = val
  !val && (visibleDrawer.value = false)
}

async function onClickMenuItem(key) {
  await router.push(key)
}
const selectedKeysSider = ref<string[]>([])
const openKeySider = ref<string[]>([])
onMounted(() => {
  const activeMenu = generatedRoutes.find(gr => gr.path === route.path)?.path as string
  const openedMenu = menuItems.value.filter(r => r.children).map(cr => cr.children).flat().find(gr => gr.path === route.path)?.childOf as string
  activeMenu && selectedKeysSider.value.push(`${activeMenu}`)
  openedMenu && openKeySider.value.push(`/${openedMenu}`)
})
</script>

<template>
  <a-layout-sider
    v-on-click-outside="() => smAndSmaller && ((sideCollapsed = true) && (visibleDrawer = false))"
    hide-trigger
    :theme="isDark ? 'dark' : 'light'" :width="sideFixed ? 240 : 260" collapsible :default-collapsed="sideCollapsed"
    :collapsed="sideCollapsed" :class="[sideFixed ? (smAndSmaller ? '!fixed' : '!fixed') : '!fixed']" class="z-100 !duration-450 [--color-menu-light-bg:#fafafa] [--color-menu-dark-bg:#010101] border-r border-light-7 dark:border-dark-6 !shadow-sm [&>.arco-layout-sider-children]:overflow-hidden"
    @mouseenter="() => !smAndSmaller && (sideCollapsed = false)"
    @mouseleave="() => !sideFixed && ((sideCollapsed = true) && (visibleDrawer = false))"
  >
    <div class="h-14.5 bg-zinc-1 relative dark:bg-dark-9 flex items-center justify-end border-b-1px border-zinc-5/10 dark:border-zinc-5/10 relative z-2">
      <div flex px-2.5 flex-1 justify-between :class="sideCollapsed && mdAndLarger && 'duration-300 translate-x--12'">
        <div flex items-center>
          <a href="" :class="sideCollapsed ? 'invisible opacity-0' : 'delay-100 visible opacity-100'" class="transition-opacity duration-300 inline-block grow-1 mr-auto" @click.prevent="router.push('/')">
            <span
              class="tracking-tight inline-block text-4/5 border-2px uppercase border-black dark:border-white font-semibold py-1 px-2"
            >
              <span class="hidden sm:inline-block">
                <span class="font-light mr--1.3">
                  WE
                </span>
                Brand
              </span>
              <span class="inline-block sm:hidden">
                <span class="font-light mr--1">W
                </span>B
              </span>
            </span>
          </a>
        </div>
        <div flex items-center justify-center>
          <a-button shape="circle" type="text" size="mini" class="mr-1" @click="() => visibleDrawer = !visibleDrawer">
            <span :class="[visibleDrawer ? 'i-carbon-chevron-up' : 'i-carbon-chevron-down']" />
          </a-button>
          <a-button shape="circle" class="hidden md:block" size="small" type="text" @click="() => sideFixed = !sideFixed">
            <template #icon>
              <span :class="[!sideFixed ? 'i-carbon-radio-button' : 'i-carbon-radio-button-checked']" />
            </template>
          </a-button>
          <a-button class="block md:hidden" size="small" type="text" @click="() => (sideCollapsed = !sideCollapsed, (sideCollapsed && (visibleDrawer = false)))">
            <template #icon>
              <span :class="[!sideCollapsed ? 'i-carbon-side-panel-close-filled' : 'i-carbon-side-panel-open-filled']" />
            </template>
          </a-button>
        </div>
      </div>
    </div>
    <div id="parentNode" relative z-1>
      <a-menu
        :default-open-keys="openKeySider"
        :default-selected-keys="selectedKeysSider"
        class="menu-side-nav"
        @menu-item-click="onClickMenuItem"
      >
        <component :is="parent.children ? SubMenu : MenuItem" v-for="parent in menuItems" :key="parent.path">
          <template v-if="parent.children" #icon>
            <span :class="parent.parentIcon || parent.icon" class="inline-block arco-icon" />
          </template>
          <template v-if="parent.children" #title>
            <span>{{ parent.parentTitle }}</span>
          </template>
          <template v-if="parent.children">
            <component :is="MenuItem" v-for="child in parent.children" :key="child.path" class="admin-sider-menu">
              <span>
                <span :class="child.icon" class="inline-block arco-icon" />
                <span>{{ child.title }}</span>
              </span>
            </component>
          </template>
          <template v-else>
            <span :class="parent.icon" class="inline-block arco-icon" />
            <span>{{ parent.title }}</span>
          </template>
        </component>
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
    :unmount-on-close="true"
    class="[&>.arco-drawer>.arco-drawer-body]:p-0 dark:[--color-bg-3:rgba(0,0,0,1)]"
    @cancel="() => visibleDrawer = false"
  >
    <div p-2>
      <div class="grid grid-flow-col grid-rows-2 grid-cols-3 gap-1">
        <div>
          <div class="h-full flex items-center min-h-18 justify-center bg-slate">
            <a-button size="mini" type="primary" shape="circle">
              <icon-plus />
            </a-button>
          </div>
        </div>
        <div class="col-start-2">
          <div class="h-full flex items-center min-h-18 justify-center bg-slate">
            <a-button size="mini" type="primary" shape="circle">
              <icon-plus />
            </a-button>
          </div>
        </div>
        <div class="col-start-3 col-span-1">
          <div class="h-full flex items-center min-h-18 justify-center bg-slate">
            <a-button size="mini" type="primary" shape="circle">
              <icon-plus />
            </a-button>
          </div>
        </div>
        <div class="row-start-2 col-start-1 col-span-3">
          <div class="h-full flex items-center min-h-18 justify-center bg-slate">
            <a-button size="mini" type="primary" shape="circle">
              <icon-plus />
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<style scoped lang="less">
.menu-side-nav {
  // @apply [--color-menu-light-bg:black];
  height: calc(100vh - 3.625rem);
}

.arco-layout-sider-has-trigger {
  @apply flex flex-col border-none p-0;
}

:deep(.arco-layout-sider-children) {
  height: unset !important;
}
</style>
