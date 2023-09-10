<script setup lang="ts">
</script>

<template>
  <CommonCalendar />
</template>

<style lang="less">

</style>

<route lang="yaml">
meta:
  layout: admin
  requiresAuth: true
  adminSidebar:
    title: Calendar
    link: /admin/calendar
    order: 4
    icon: i-carbon-calendar
    childOf: null
    hidden: false
</route>
