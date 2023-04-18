<script setup lang="ts">
const { t, availableLocales, locale } = useI18n()

const formatted = useDateFormat(useNow(), 'YYYY')
</script>

<template>
  <nav text-xl mt-3 text-center border-t-1px border-gray-100 dark:border-zinc-800 p-2 flex justify-between>
    <a-button type="outline" size="small">
      <span class="flex items-center">
        <span class="w-4 h-4 mr-1 inline-block i-carbon-favorite-filled" />
        designed with love
      </span>
    </a-button>
    <span text-xs text-gray-500 leading-28px>
      created by weskhaled ⓒ Copyright {{ formatted }}
    </span>
  </nav>
</template>
