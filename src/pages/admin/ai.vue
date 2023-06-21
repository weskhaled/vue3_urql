<script setup lang="ts">
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { mdAndSmaller } from '~/common/stores'
import { useTesseract } from '~/composables/tesseract'

const { init, result, status } = useTesseract()
const codemirrorRef = ref<HTMLElement>()
const codemirrorReadOnly = ref<boolean>(false)
const conversation = reactive({
  history: [
    { speaker: 'human', text: 'Hello!' },
  ],
})

const textFromImg = ref('')
const resultResponse = ref('')
const [valueNavEditor, toggleNavEditor] = useToggle()
const file = shallowRef()
const url = useObjectUrl(file)

async function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files
  file.value = (files && files.length > 0) ? files[0] : undefined
  await init(file.value)
  textFromImg.value = result.value
}
// const running = computed(() => workerStatus.value === 'RUNNING')

const treeData = [
  {
    title: 'Trunk 1',
    key: '0-0',
    children: [
      {
        title: 'Trunk 1-0',
        key: '0-0-0',
        children: [
          { title: 'leaf', key: '0-0-0-0' },
          {
            title: 'leaf',
            key: '0-0-0-1',
            children: [{ title: 'leaf', key: '0-0-0-1-0' }],
          },
          { title: 'leaf', key: '0-0-0-2' },
        ],
      },
      {
        title: 'Trunk 1-1',
        key: '0-0-1',
      },
      {
        title: 'Trunk 1-2',
        key: '0-0-2',
        children: [
          { title: 'leaf', key: '0-0-2-0' },
          {
            title: 'leaf',
            key: '0-0-2-1',
          },
        ],
      },
    ],
  },
  {
    title: 'Trunk 2',
    key: '0-1',
  },
  {
    title: 'Trunk 3',
    key: '0-2',
    children: [
      {
        title: 'Trunk 3-0',
        key: '0-2-0',
        children: [
          { title: 'leaf', key: '0-2-0-0' },
          { title: 'leaf', key: '0-2-0-1' },
        ],
      },
    ],
  },
]

function onSubmit() {
  resultResponse.value = ''
  const newConversation = {
    history: [
      ...conversation.history,
      { speaker: 'human', text: textFromImg.value },
    ],
  }
  const controller = new AbortController()
  const paramsObj = {
    conversation: newConversation,
    temperature: 0.7,
  }
  fetchEventSource('/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paramsObj),
    openWhenHidden: true,
    signal: controller.signal,
    async onopen(res) {
      // eslint-disable-next-line no-console
      console.log('Connection Established', res)
    },
    onmessage(msg) {
      const { data } = msg
      if (data) {
        codemirrorReadOnly.value = true
        try {
          const text = JSON.parse(data).choices[0].delta.content?.replace(/`/g, '')
          if (text) {
            resultResponse.value += text
            conversation.history = newConversation.history
          }
        }
        catch (err) {
          // eslint-disable-next-line no-console
          console.log(`Failed to parse data: ${data}`)
        }
      }
    },
    onclose() {
      codemirrorReadOnly.value = false
      // eslint-disable-next-line no-console
      console.log('Connection Closed by the Server')
    },
    onerror(err) {
      // eslint-disable-next-line no-console
      console.log('There was an error from the Server!', err)
    },
  })
}
</script>

<template>
  <CommonPageHeader
    class="mt--14.5 pt-14.5"
    bg-img="https://images.unsplash.com/photo-1533497197926-c9e810dcea9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    :content-parallax="false"
  >
    <div container mx-auto z-2 relative>
      <h2 class="text-lg uppercase">
        test
      </h2>
      <main class="py-5 px-5 bg-light-1 dark:bg-dark-9">
        <input type="file" @change="onFileChange">
        <div>
          <img :src="url" alt="">
        </div>
        <textarea v-model="textFromImg" w-full />
        <div>
          <a-button type="primary" size="large" @click="onSubmit">
            Send to AI
          </a-button>
        </div>
      </main>
    </div>
    <div container mx-auto mt-2>
      <div class="rounded-sm overflow-hidden ring-1 ring-[var(--color-neutral-3)]">
        <div
          class="rounded-t-sm"
        >
          <div
            class="py-2 items-center px-4 gap-8 flex justify-between w-full bg-light-3 dark:bg-dark-9"
          >
            <div class="flex items-center">
              <div class="w-2.5 h-2.5 rounded-full bg-[#EC6A5F]" />
              <div class="ml-1.5 w-2.5 h-2.5 rounded-full bg-[#F4BF50]" />
              <div class="ml-1.5 w-2.5 h-2.5 rounded-full bg-[#61C454]" />
            </div>
            <div class="flex justify-end">
              <a-button type="text" size="mini">
                <template #icon>
                  <span i-carbon-overflow-menu-horizontal w-5 h-5 />
                </template>
              </a-button>
            </div>
          </div>
          <div class="overflow-hidden w-full h-auto flex-auto min-h-58 flex min-h-0 b-t border-[var(--color-neutral-3)] relative">
            <nav class="b-r border-[var(--color-neutral-3)] min-w-1/2 md:min-w-2/12 absolute md:relative h-full flex flex-col bg-light-1/85 dark:bg-dark-8/85 backdrop-blur z-9 transition-all !md:translate-x-0" :class="[valueNavEditor ? 'translate-x-0' : 'translate-x--100%']">
              <div class="h-9 flex b-b border-[var(--color-neutral-3)] bg-white/35 dark:bg-black/35 text-zinc-7 dark:text-zinc-3 text-sm/9 px-1 flex flex-none justify-between items-center">
                Explorer
                <a-button class="block md:hidden" type="primary" size="mini" @click="() => valueNavEditor = false">
                  <template #icon>
                    <span i-carbon-chevron-left />
                  </template>
                </a-button>
              </div>
              <div class="flex-grow">
                <a-tree
                  :default-selected-keys="['0-0-1']"
                  :data="treeData"
                  show-line
                  class="overflow-auto !px-3 h-80vh"
                />
              </div>
            </nav>
            <div v-if="mdAndSmaller" class="absolute z-8 w-full h-full top-0 bg-light-8 dark:bg-black transition-all-320" :class="[valueNavEditor ? 'opacity-60' : 'opacity-0 invisible pointer-events-none']" @click="() => valueNavEditor = false" />
            <div class="flex-grow w-full z-7 bg-light-1 dark:bg-dark-9">
              <a-tabs type="line" size="small" class="w-full [&_.arco-tabs-nav]:bg-light-2 [&_.arco-tabs-nav]:dark:bg-dark-9 [&_.arco-tabs-nav]:flex-row-reverse [&_.arco-tabs-nav]:md:flex-row [&_.arco-tabs-content]:p-0 ![&._.arco-tabs-nav]:before:h-0 [--border-radius-small:0px] [&_.arco-tabs-tab-title]:leading-8.5 ![&_.arco-tabs-tab]:py-0 ![&_.arco-tabs-tab]:mx-2px  ![&_.arco-tabs-tab]:px-14px">
                <template v-if="mdAndSmaller" #extra>
                  <div class="px-1 flex items-center md:hidden">
                    <a-button size="mini" type="primary" @click="toggleNavEditor()">
                      <template #icon>
                        <span i-carbon-list class="" />
                      </template>
                    </a-button>
                  </div>
                </template>
                <a-tab-pane key="1" title="Tab 1">
                  <div
                    class="relative bg-white dark:bg-dark-950 dark:border-slate-900/50"
                  >
                    <div class="h-80vh max-h-[80vh] overflow-auto">
                      <CommonCodeMirrorCodeMirror ref="codemirrorRef" v-model="resultResponse" :read-only="codemirrorReadOnly" mode="js" class="flex flex-auto h-full" />
                    </div>
                  </div>
                </a-tab-pane>
              </a-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  </CommonPageHeader>
  <div relative h-180 flex z-3 bg-white dark:bg-black items-center>
    <div container px-4 mx-auto relative z-1 text-center>
      <div class="relative inline-block px-6 py-4 bg-zinc-9/1 dark:bg-zinc-1/1 backdrop-blur backdrop-filter border border-zinc-4/20">
        <div
          class="opacity-5 grayscale absolute inset-0 w-full h-full bg-cover bg-fixed bg-center bg-no-repeat bg-[url(/img/slider-3.avif)]"
        />
        <button
          class="w-10 h-10 justify-center content-center absolute flex top--6 left--6 bg-blue-6/90 hover:bg-blue-7/90 active:(bg-blue-7/80 border-blue-8) transition-all block z-2 border border-blue-8/20 backdrop-blur"
        >
          <span i-carbon-ibm-watson-machine-learning block text-white text-sm m-auto leading-8 class="icon-shadow" />
        </button>
        <h2
          class="text-2xl/10 md:text-6xl/20 inline font-extrabold capitalize fill-transparent bg-gradient-to-r from-slate-7 dark:from-slate-1 to-purple-4 dark:to-purple-1 bg-clip-text"
          style="-webkit-text-fill-color: transparent;"
        >
          think big <span font-thin>
            start small!
          </span>
        </h2>
      </div>
    </div>
    <div class="h-full pointer-events-none w-full absolute top-0 bg-black right-0 bg-cover mix-blend-multiply dark:mix-blend-lighten dark:bg-top-center opacity-85 bg-top-center bg-[url(https://images.unsplash.com/photo-1470016342826-876ea880d0be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80)] dark:bg-[url(https://images.unsplash.com/photo-1617722694908-9be1092d1bc2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80)]" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  requiresAuth: true
  adminSidebar:
    title: AI
    link: /admin/ai
    order: 3
    icon: i-carbon-assembly-cluster
    childOf: null
    hidden: false
</route>
