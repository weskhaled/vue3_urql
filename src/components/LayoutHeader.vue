<script setup lang="ts">
import { availableLocales } from '~/modules/i18n'
import { currentUser, refreshToken, token, userLang } from '~/common/stores'

// const { t } = useI18n()
const router = useRouter()
const { message } = useMessage()

async function logout() {
  token.value = null
  refreshToken.value = null
  message.warning({ content: 'Loged out', showIcon: true, closable: true })
  await router.push({ name: 'auth-login' })
}
</script>

<template>
  <div class="flex items-center justify-between px-2 dark:[--color-menu-light-bg:#0f0f0f]">
    <div class="grow-0 flex items-center">
      <span class="bg-dark-50 inline-block h-10 w-10 sm:w-35 my-2" />
    </div>
    <div class="grow-1 flex header-menu justify-end">
      <div>
        <a-menu
          mode="horizontal"
          theme="light"
        >
          <a-sub-menu key="0">
            <template #icon>
              <IconApps />
            </template>
            <template #title>
              Navigation 1
            </template>
            <a-menu-item key="0_0">
              Menu 1
            </a-menu-item>
            <a-menu-item key="0_1">
              Menu 2
            </a-menu-item>
            <a-menu-item key="0_2">
              Menu 3
            </a-menu-item>
            <a-menu-item key="0_3">
              Menu 4
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="1">
            <template #icon>
              <IconBug />
            </template>
            <template #title>
              Navigation 2
            </template>
            <a-menu-item key="1_0">
              Menu 1
            </a-menu-item>
            <a-menu-item key="1_1">
              Menu 2
            </a-menu-item>
            <a-menu-item key="1_2">
              Menu 3
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="2">
            <template #icon>
              <IconBulb />
            </template>
            <template #title>
              Navigation 3
            </template>
            <a-menu-item key="2_0">
              Menu 1
            </a-menu-item>
            <a-menu-item key="2_1">
              Menu 2
            </a-menu-item>
            <a-sub-menu key="2_2" title="Navigation 4">
              <a-menu-item key="2_2_0">
                Menu 1
              </a-menu-item>
              <a-menu-item key="2_2_1">
                Menu 2
              </a-menu-item>
            </a-sub-menu>
          </a-sub-menu>
        </a-menu>
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
              <span class="w-4 h-4 mr-1 inline-block leading-30px text-sm i-carbon-user-avatar" />
              {{ `${currentUser?.nickname}` }}
              <span class="w-3 h-3 ml-0.5 inline-block leading-30px text-sm i-carbon-chevron-down" />
            </span>
          </a-button>
          <template #content>
            <a-doption>
              <template #icon>
                <span class="w-5 h-5 mr-1 inline-block leading-30px text-md i-carbon-user-avatar" />
              </template>
              <template #default>
                Profile
              </template>
            </a-doption>
            <a-doption @click="logout()">
              <template #icon>
                <span class="w-5 h-5 mr-1 inline-block leading-30px text-md i-carbon-logout" />
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
</style>
