<script setup lang="ts">
// const { t } = useI18n()

const formatted = useDateFormat(useNow(), 'YYYY')
</script>

<template>
  <nav text-xl text-center border-t-1px dark:border-zinc-8 p-2 flex justify-between class="border-zinc-4/30">
    <a-button type="outline" size="mini">
      <span class="flex items-center">
        <span class="w-3 h-3 mr-1 inline-block i-carbon-favorite-filled" />
        designed with love
      </span>
    </a-button>
    <span text-xs text-gray-500 leading-28px hidden sm:inline-block>
      Created by Weskhaled ⓒ Copyright {{ formatted }}
    </span>
  </nav>
</template>
