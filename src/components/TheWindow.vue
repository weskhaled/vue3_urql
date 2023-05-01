<script setup lang="ts">
let count = 5
const data = ref([
  {
    key: '1',
    title: 'Tab 1',
    content: 'Content of Tab Panel 1',
  },
  {
    key: '2',
    title: 'Tab 2',
    content: 'Content of Tab Panel 2',
  },
  {
    key: '3',
    title: 'Tab 3',
    content: 'Content of Tab Panel 3',
  },
  {
    key: '4',
    title: 'Tab 4',
    content: 'Content of Tab Panel 4',
  },
])

function handleAdd() {
  const number = count++
  data.value = data.value.concat({
    key: `${number}`,
    title: `New Tab ${number}`,
    content: `Content of New Tab Panel ${number}`,
  })
}
function handleDelete(key) {
  data.value = data.value.filter(item => item.key !== key)
}
</script>

<template>
  <div class="container-wide" data-local-scroll>
    <div class="row align-items-center">
      <div class="col-md-8 offset-md-2">
        <div class="windowscreen">
          <div class="screen">
            <!-- <div class="left-bar"></div> -->
            <div class="top-bar">
              <div class="buttons" />
            </div>
            <a-tabs
              class="bg-zinc-200 dark:bg-zinc-800 rounded-1"
              type="card" :editable="true" show-add-button auto-switch @add="handleAdd"
              @delete="handleDelete"
            >
              <a-tab-pane v-for="(item, index) of data" :key="item.key" :title="item.title" :closable="index !== 2">
                <div class="bg-white text-black dark:text-white dark:bg-zinc-900 pt-0 min-h-300px">
                  {{ item?.content }}
                </div>
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
  .arco-tabs-content {
    @apply pt-0;
  }
  .arco-tabs-nav {
    @apply pl-13;
  }
  overflow: hidden;
  width: 100%;

  .screen {
    position: relative;
    height: auto;
    border-radius: 3px 3px 0 0 !important;
    color: white;
  }

  .screen .top-bar {
    width: 100%;
    height: 30px;
    position: absolute;
    pointer-events: none;
    margin-top: 0;
    padding: 0;
    border-radius: 3px 3px 0 0 !important;
    z-index: 2;
    text-align: left;
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
</style>
