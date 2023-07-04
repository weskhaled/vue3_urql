<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
import { MenuItem, SubMenu } from '@arco-design/web-vue'
import { isDark } from '~/composables/dark'

// import '@arco-design/web-vue/es/menu-item/style/css.js'
import { layoutBoxed, mdAndLarger, mdAndSmaller, menuItems, sideCollapsed, sideFixed, sideHidden, smAndSmaller } from '~/common/stores'
import generatedRoutes from '~pages'

// const { t } = useI18n()
// const { message } = useMessage()
const router = useRouter()
const route = useRoute()

const visibleDrawer = ref(false)

async function onClickMenuItem(key) {
  sideHidden.value = true
  return await router.push(key)
}
const selectedKeysSider = ref<string[]>([])
const openKeySider = ref<string[]>([])
onMounted(() => {
  const activeMenu = generatedRoutes.find(gr => gr.path === route.path)?.path as string
  const openedMenu = menuItems.value.filter(r => r.children).map(cr => cr.children).flat().find(gr => gr.path === route.path)?.childOf as string
  activeMenu && selectedKeysSider.value.push(`${activeMenu}`)
  openedMenu && openKeySider.value.push(`/${openedMenu}`)
})
watch(mdAndSmaller, (val) => {
  val && (sideCollapsed.value = false)
}, { immediate: true })
</script>

<template>
  <a-layout-sider
    v-on-click-outside="() => sideHidden = true"
    hide-trigger
    :theme="isDark ? 'dark' : 'light'" :width="sideFixed ? 240 : 260" collapsible :default-collapsed="sideCollapsed"
    :collapsed="sideCollapsed" :class="[sideFixed ? (smAndSmaller ? '!fixed' : '!fixed') : '!fixed', sideHidden ? 'translate-x--100%' : 'translate-x-0']"
    class="z-101 !transition-transform-250 !md:transition-width-150 !md:translate-x-0 [--color-menu-light-bg:rgba(255,255,255,1)] [--color-menu-dark-bg:rgba(0,0,0,1)] !shadow-sm [&>.arco-layout-sider-children]:overflow-hidden"
    @mouseenter="() => mdAndLarger && (sideCollapsed = false)"
    @mouseleave="() => mdAndLarger && !sideFixed && ((sideCollapsed = true) && (visibleDrawer = false))"
  >
    <div class="h-14.5 bg-light-5 relative dark:bg-dark-9 flex items-center justify-end border-b-1px b-r-1px border-zinc-5/10 dark:border-zinc-5/10 relative z-2">
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
          <a-button class="block md:hidden" size="small" type="text" @click="() => (sideHidden = true)">
            <template #icon>
              <span class="i-line-md-menu-fold-left" />
            </template>
          </a-button>
        </div>
      </div>
    </div>
    <div id="parentNode" class="bg-[var(--color-menu-light-bg)] dark:bg-[var(--color-menu-dark-bg)] border-r border-light-7 dark:border-dark-6 relative z-1 !w-auto">
      <a-menu
        :default-open-keys="openKeySider"
        :default-selected-keys="selectedKeysSider"
        class="menu-side-nav !bg-transparent"
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
          <div class="h-full flex items-center flex-col text-center min-h-18 justify-center bg-slate-5/10">
            <span leading-4 text-xs mb-2>Boxed layout</span>
            <a-switch v-model:model-value="layoutBoxed" checked-color="rgb(var(--primary-6))" unchecked-color="rgb(var(--primary-6))" size="small">
              <template #checked-icon>
                <icon-check />
              </template>
              <template #unchecked-icon>
                <icon-close />
              </template>
            </a-switch>
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
  <div class="fixed block md:hidden w-screen h-screen top-0 z-100 bg-black/70 transition-all" :class="[sideHidden ? 'invisible opacity-0 pointer-events-none' : 'visible opacity-100']" />
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
