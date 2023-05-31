<script setup lang="ts">
import { availableLocales } from '~/modules/i18n'
import { currentUser, refreshToken, sideFixed, sideHidden, token, userLang } from '~/common/stores'

// const { t } = useI18n()
const router = useRouter()
const { message } = useMessage()
const { isFullscreen, enter, exit, toggle: toggleFullscreen } = useFullscreen()

async function logout() {
  token.value = null
  refreshToken.value = null
  message.warning({ content: 'Loged out', showIcon: true, closable: true })
  await router.push({ name: 'auth-login' })
}
</script>

<template>
  <div class="flex items-center justify-between px-2 h-14.5 border-b border-zinc-3/30 dark:border-zinc-6/30 md:ml-12 [--primary-6:var(--gray-9)]">
    <div class="grow-0 flex items-center transition-width duration-300" :class="[sideFixed ? 'w-[calc(11.5rem-1px)]' : 'w-55']">
      <div class="flex md:hidden w-12 h-full items-center justify-center ml--2">
        <a-button size="small" type="text" @click="() => (sideHidden = false)">
          <template #icon>
            <span class="i-line-md-menu-fold-right" />
          </template>
        </a-button>
      </div>
      <a href="" class="" @click.prevent="router.push('/')">
        <span
          class="tracking-tight inline-block text-4/5 border-2px uppercase border-dark dark:border-light text-dark dark:text-light font-semibold py-1 px-2"
        >
          <span class="hidden sm:inline-block">
            <span class="font-light mr--1.3">
              WE
            </span>
            Brand
          </span>
          <span class="inline-block sm:hidden text-sm/4">
            <span class="font-light mr--1">W
            </span>B
          </span>
        </span>
      </a>
    </div>
    <div class="hidden md:flex items-center border-zinc-4/20 border-x px-2">
      <a-badge :count="9" dot :offset="[-22, 5]" class="[&>.arco-badge-custom-dot]:overflow-visible">
        <template #content>
          <span class="block h-1.5 w-1.5 pointer-events-none rounded-full bg-green-500 relative shadow-[0_0_0_1px_var(--color-bg-2)]">
            <span class="block absolute animate-ping inline-flex top--0.25 left--0.25 h-2 w-2 rounded-full bg-green-400 opacity-75" />
          </span>
        </template>
        <a-trigger trigger="click" show-arrow :popup-translate="[130, 5]" class="!fixed !top-12 [&_.arco-trigger-arrow]:bg-zinc-4/20">
          <a-button shape="circle" class="mr-4" size="small" type="text">
            <template #icon>
              <span i-carbon-earth-filled />
            </template>
          </a-button>
          <template #content>
            <div class="bg-white dark:bg-dark-9 min-w-75 rounded-2px shadow border-1px border-zinc-4/20">
              <div flex items-center justify-between p-2 class="border-b border-zinc-4/20 bg-zinc-4/5">
                <h3 class="text-3">
                  Notifications
                </h3>
                <a-button class="text-3" size="mini" type="text">
                  Read All
                </a-button>
              </div>
              <div class="relative min-h-45 overflow-hidden overflow-y-scroll flex">
                <a-empty class="flex justify-center flex-col" />
              </div>
            </div>
          </template>
        </a-trigger>
      </a-badge>
      <a-button shape="circle" class="mr-4" size="small" type="text">
        <template #icon>
          <span i-carbon-link />
        </template>
      </a-button>
      <a-button shape="circle" class="" size="small" type="text" @click.stop="async() => await toggleFullscreen()">
        <template #icon>
          <span :class="[isFullscreen ? 'i-carbon-screen' : 'i-carbon-center-to-fit']" />
        </template>
      </a-button>
    </div>
    <div class="grow-1 flex header-menu justify-end md:justify-between">
      <div class="hidden md:flex items-center px-2">
        <a-button class="px-2 hover:[--color-fill-2:transparent]" size="medium" type="text">
          <span i-carbon-search class="" />
          <span hidden lg:block lg:ml-1 text-xs>
            Type anywhere to <span font-semibold> Search</span>
          </span>
        </a-button>
      </div>
      <div class="flex items-center">
        <a-dropdown trigger="hover">
          <a-button class="px-2 mr-2" type="text">
            <span class="flex items-center">
              <span class="w-4 h-4 mr-1 inline-block leading-30px text-md i-carbon-globe" />
              {{ userLang }}
            </span>
          </a-button>
          <template #content>
            <a-doption
              v-for="lan in availableLocales" :key="lan"
              :class="{ '!bg-gray-100 !dark:bg-zinc-900': lan === userLang }" @click="userLang = lan"
            >
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-2 inline-block leading-30px">
                  <image
                    class="w-4 h-4"
                    :xlink:href="`https://api.iconify.design/circle-flags:${lan.split('-')[1].toLowerCase()}.svg`"
                  />
                </svg>
                <span class="min-w-12">
                  {{ lan }}
                </span>
              </span>
            </a-doption>
          </template>
        </a-dropdown>
        <a-tooltip content="Toggle Dark mode" position="br" mini>
          <a-button class="px-2" type="text" @click="toggleDark()">
            <template #icon>
              <span class="w-4 h-4 mx-1 block text-sm i-carbon-sun dark:i-carbon-moon" />
            </template>
          </a-button>
        </a-tooltip>
        <a-dropdown trigger="hover">
          <a-button class="px-2" type="text">
            <span class="flex items-center">
              <span class="w-4 h-4 mr-1 inline-block leading-30px text-sm i-carbon-user-avatar-filled" />
              <span hidden sm:inline-block>
                {{ `${currentUser?.nickname}` }}
              </span>
              <span class="w-3 h-3 ml-0.5 inline-block leading-30px text-sm i-carbon-chevron-down" />
            </span>
          </a-button>
          <template #content>
            <a-doption>
              <template #icon>
                <span class="w-5 h-5 inline-block leading-30px text-md i-carbon-user-avatar-filled" />
              </template>
              <template #default>
                Profile
              </template>
            </a-doption>
            <a-doption @click="logout()">
              <template #icon>
                <span class="w-5 h-5 inline-block leading-30px text-md i-carbon-logout" />
              </template>
              <template #default>
                Logout
              </template>
            </a-doption>
          </template>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
// :deep(.arco-menu-horizontal .arco-menu-inner) {
//   @apply !p-0;
// }
// .demo-arrow {
//   box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
//   padding: 10px;
//   width: 200px;
//   background-color: var(--color-bg-popup);
//   border-radius: 4px;
// }
</style>
