<script setup lang="ts">

</script>

<template>
  <CommonPageHeader
    class="!grid h-full !p-0"
    bg-img="https://images.unsplash.com/photo-1687333517042-b1749fc15642?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    bg-img-dark="https://images.unsplash.com/photo-1655637389009-81207e99c3c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    :content-parallax="false"
  >
    <div class="h-full flex">
      <CommonCodeAI />
    </div>
  </CommonPageHeader>
</template>

<style lang="less">
</style>

<route lang="yaml">
meta:
  layout: admin
  requiresAuth: true
  adminSidebar:
    title: Code.AI
    link: /admin/ai
    order: 3
    icon: i-tabler-brand-openai
    childOf: null
    hidden: false
</route>
