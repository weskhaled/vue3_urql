<script setup lang="ts">
// const { t } = useI18n()

const formatted = useDateFormat(useNow(), 'YYYY')
</script>

<template>
  <nav text-xl text-center border-t-1px p-2 flex items-center justify-between relative z-2 backdrop-blur-2px class="dark:bg-dark-8/75 bg-white/75 border-zinc-2/40 dark:border-zinc-8/60">
    <a-button type="outline" size="mini">
      <span class="flex items-center">
        <span class="w-3 h-3 mr-1 inline-block i-carbon-favorite-filled" />
        designed with love
      </span>
    </a-button>
    <span text-xs text-gray-500 leading-21px hidden sm:inline-block>
      Created by Weskhaled ⓒ Copyright {{ formatted }}
    </span>
  </nav>
</template>
