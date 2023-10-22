<script setup>
const { loadCalendly, unloadCalendly } = useCalendly()

onMounted(async () => {
  await loadCalendly()
})
</script>

<template>
  <RouterView />
</template>
