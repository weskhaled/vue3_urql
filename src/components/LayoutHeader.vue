<script setup lang="ts">
import { availableLocales } from '~/modules/i18n'
import { currentUser, refreshToken, token, userLang } from '~/common/stores'
import { Message } from '~/composables/message'

const { t } = useI18n()
const router = useRouter()

const formatted = useDateFormat(useNow(), 'YYYY')

async function logout() {
  token.value = null
  refreshToken.value = null
  Message.info({ content: 'Logout', showIcon: true })
  await router.push('/login')
}
</script>

<template>
  <div class="flex items-center justify-between px-2">
    <div class="grow-full flex items-center">
      <span class="bg-dark-50 inline-block h-10 w-35 my-2" />
    </div>
    <div class="grow-0 header-menu">
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
