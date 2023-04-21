<script setup lang="ts">
import {
  IconCalendar,
  IconHome,
} from '@arco-design/web-vue/es/icon'
import { gql, useQuery } from '@urql/vue'
import { isDark } from '~/composables/dark'
import { currentUser, sideCollapsed } from '~/common/stores'

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

const queryMe = gql`
  query queryMe {
    me {
      nickname
      role
    }
  }`
await useQuery({
  query: queryMe,
}).then(({ data }) => (data?.value && (currentUser.value = data.value?.me)))
</script>

<template>
  <a-layout class="layout-demo h-full">
    <a-layout-header class="shadow z-10 bg-light-50 dark:bg-dark-900">
      <LayoutHeader />
    </a-layout-header>
    <a-layout>
      <a-layout-sider
        :theme="isDark ? 'dark' : 'light'" :width="230" collapsible :default-collapsed="sideCollapsed"
        :collapsed="sideCollapsed" @collapse="onCollapse"
      >
        <a-menu
          :default-open-keys="['1']" :default-selected-keys="['0_2']" class="menu-side-nav"
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
      <a-layout class="max-h-[calc(100vh-56px)] overscroll-y-auto">
        <a-layout-content class="p-3">
          <RouterView />
        </a-layout-content>
        <a-layout-footer>
          <LayoutFooter />
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<style scoped lang="less">
.menu-side-nav {
  // @apply h-[calc(80px+8px)];
  height: calc(100vh - 104px);
}

.arco-layout-sider-has-trigger {
  padding: 0;
}

:deep(.arco-layout-sider-children) {
  height: unset !important;
  ;
}

:deep(.arco-layout-sider-trigger) {
  @apply !bg-slate-100 !dark: bg-gray-700;
}

// .header-menu :deep(){
//   @apply flex justify-end;
// }
</style>
