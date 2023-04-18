<script setup lang="ts">
import { userLang } from '~/common/stores'

const { t } = useI18n()
const count = ref(0)
</script>

<template>
  <nav text-xl mt-6>
    <a-button @click="() => count++">
      {{ `${t('button.home')} - ${userLang} - ${count}` }}
    </a-button>
  </nav>
</template>
