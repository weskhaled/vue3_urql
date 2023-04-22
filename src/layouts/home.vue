<script setup lang="ts">
import { gql, useQuery } from '@urql/vue'
import { currentUser } from '~/common/stores'

// const { t } = useI18n()
// const router = useRouter()
// const { message } = useMessage()

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
    <a-layout-header class="shadow z-99 bg-light-50 dark:bg-dark-900">
      <LayoutHeader />
    </a-layout-header>
    <a-layout>
      <LayoutSider />
      <a-layout class="max-h-[calc(100vh-56px)] overscroll-y-auto !ml-12 !sm:ml-0">
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
