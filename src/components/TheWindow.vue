<script setup lang="ts">
let count = 5
const data = ref([
  {
    key: '1',
    title: 'App.vue',
    lang: 'vue',
    content: `<div class="flex font-sans">
  <div class="flex-none w-56 relative">
    <img src="/kids-jumpsuit.jpg" alt="" class="absolute inset-0 w-full h-full object-cover rounded-lg" loading="lazy" />
  </div>
</div>`,
  },
  {
    key: '2',
    title: 'main.css',
    lang: 'css',
    content: `.screen .top-bar .buttons:before {
    left: -12px;
    background-color: #dc2510;
}
.screen .top-bar .buttons:after {
    left: 12px;
    background-color: #5ec3af;
}`,
  },
])

function handleAdd() {
  const number = count++
  data.value = data.value.concat({
    key: `${number}`,
    title: `New Tab ${number}`,
    lang: 'html',
    content: `Content of New Tab Panel ${number}`,
  })
}
function handleDelete(key) {
  data.value = data.value.filter(item => item.key !== key)
}
</script>

<template>
  <div class="container mx-auto min-w-xs max-w-lg" data-local-scroll>
    <div class="row align-items-center">
      <div class="col-md-8 offset-md-2">
        <div class="windowscreen">
          <div class="screen">
            <!-- <div class="left-bar"></div> -->
            <div class="top-bar">
              <div class="buttons" />
            </div>
            <a-tabs
              size="mini" class="bg-zinc-200 dark:bg-zinc-800" type="line" :editable="true" show-add-button
              auto-switch @add="handleAdd" @delete="handleDelete"
            >
              <a-tab-pane v-for="(item, index) of data" :key="item.key" :title="item.title" :closable="index !== 2">
                <UseElementSize v-slot="{ height }">
                  <div class="bg-white text-black dark:text-white dark:bg-zinc-900 pt-0 h-400px">
                    <CommonCodeMirror
                      v-model="item.content" :mode="item.lang || 'text'" class="relative"
                      :style="{ height: `${height}px` }"
                    />
                  </div>
                </UseElementSize>
              </a-tab-pane>
            </a-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
/*window screen*/
.windowscreen {
  @apply border-1px border-zinc-300/30 rounded-1 overflow-hidden;

  .arco-tabs-content {
    @apply pt-0;
  }

  .arco-tabs-nav-size-mini.arco-tabs-nav-type-line .arco-tabs-tab {
    @apply !font-400;
    &:hover {
      @apply !font-400;
    }
  }

  .arco-tabs-nav {
    @apply pl-12;
  }

  .screen {
    position: relative;
  }

  .screen .top-bar {
    width: 100%;
    height: 32px;
    position: absolute;
    pointer-events: none;
    margin-top: 0;
    padding: 0;
    border-radius: 3px 3px 0 0;
    text-align: left;
    // @apply border-1px border-t-zinc-300/50 z-1;
    @apply rounded-0 z-1;
  }

  .screen .top-bar .buttons {
    position: absolute;
    width: 8px;
    height: 8px;
    top: 50%;
    margin-top: -4px;
    background: #ffc42b;
    border-radius: 50% !important;
    left: 22px;
  }

  .screen .top-bar .buttons:after,
  .screen .top-bar .buttons:before {
    position: absolute;
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .screen .top-bar .buttons:before {
    left: -12px;
    background-color: #dc2510;
  }

  .screen .top-bar .buttons:after {
    left: 12px;
    background-color: #5ec3af;
  }
}

.arco-tabs-type-card>.arco-tabs-content {
  border: none;
}
</style>
