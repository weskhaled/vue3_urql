<script setup lang="ts">
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { mdAndSmaller } from '~/common/stores'
import { useTesseract } from '~/composables/tesseract'

const { init, result, status } = useTesseract()
const windowContentRef = ref<HTMLElement>()
const codemirrorRef = ref<HTMLElement>()
const userMessageRef = ref<HTMLElement>()
const conversationWrapperRef = ref<HTMLElement>()
const cm = computed(() => codemirrorRef.value?.cm)
const cmScrollDOM = computed(() => cm.value?.docView?.view?.scrollDOM)
const cmDocViewDOM = computed(() => cm.value?.docView?.dom)
const { y: yCmScrollDOM } = useScroll(cmScrollDOM, { behavior: 'smooth' })
const { height: heightCmScrollDOM } = useElementSize(cmDocViewDOM)

const codemirrorReadOnly = ref<boolean>(false)
const conversation = reactive<any>({
  history: [],
})

const fetchingFromAi = ref(false)
const userMessage = ref('')
const lastResponse = ref('')

const resultResponse = ref('')
const [valueNavEditor, toggleNavEditor] = useToggle()

const { pause: pauseWatchHeightCmScroll, resume: resumeWatchHeightCmScroll } = watchPausable(
  heightCmScrollDOM,
  (val) => {
    if (codemirrorReadOnly.value) {
      const height = Number((val + 8).toFixed(2))
      yCmScrollDOM.value = height
    }
  },
)
pauseWatchHeightCmScroll()
async function addChunkToEditor(chunk: string) {
  lastResponse.value += chunk
  if (cm.value) {
    cm.value.focus()
    // await nextTick()
    cm.value.dispatch({
      changes: {
        from: cm.value.state.doc.length,
        insert: chunk,
      },
    })
    await nextTick()
    cm.value.dispatch({
      selection: { anchor: cm.value.state.doc.length },
    })
  }
}

function onSubmitToAI() {
  const newConversation = {
    history: [
      ...conversation.history,
      { speaker: 'human', text: userMessage.value, time: useNow().value },
    ],
  }
  conversation.history = [
    ...newConversation.history,
  ]
  userMessage.value = ''
  const controller = new AbortController()
  const paramsObj = {
    conversation: newConversation,
    temperature: 0.7,
  }
  // resultResponse.value = ''
  fetchEventSource('/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paramsObj),
    openWhenHidden: true,
    signal: controller.signal,
    async onopen(res) {
      valueNavEditor.value = false
      fetchingFromAi.value = true
      lastResponse.value = ''
      if (resultResponse.value.length > 0)
        resultResponse.value += '\n//AI Response:\n'

      codemirrorReadOnly.value = true
      resumeWatchHeightCmScroll()
      // eslint-disable-next-line no-console
      console.log('Connection Established', res)
    },
    onmessage(msg) {
      const { data } = msg
      if (data) {
        try {
          const text = JSON.parse(data).choices[0]?.delta?.content?.replace(/``/g, '// code ')?.replace(/`/g, '')
          if (text)
            addChunkToEditor(text)
        }
        catch (err) {
          // eslint-disable-next-line no-console
          console.log(`Failed to parse data: ${data}`)
        }
      }
    },
    onclose() {
      fetchingFromAi.value = false
      conversation.history = [
        ...newConversation.history,
        {
          speaker: 'bot',
          text: lastResponse.value,
          time: useNow().value,
        },
      ]
      pauseWatchHeightCmScroll()
      nextTick(() => {
        userMessageRef.value?.focus()
        conversationWrapperRef.value?.scrollTo({
          top: conversationWrapperRef.value?.scrollHeight,
          behavior: 'smooth',
        })
      })
      codemirrorReadOnly.value = false
      // eslint-disable-next-line no-console
      console.log('Connection Closed by the Server')
    },
    onerror(err) {
      fetchingFromAi.value = false
      // eslint-disable-next-line no-console
      console.log('There was an error from the Server!', err)
    },
  })
}

async function customRequest(option) {
  const { onProgress, onError, onSuccess, fileItem } = option

  onProgress(0.01)
  watch(status, (val) => {
    if (val === 'INIT')
      onProgress(0.1)

    else if (val === 'LOADING')
      onProgress(0.2)

    else if (val === 'RECOGNIZING')
      onProgress(0.6)
  })
  await init(fileItem.file)
  if (status.value === 'DONE') {
    userMessage.value = result.value
    onProgress(1)
    onSuccess(true)
  }

  return false
}
// function adjustLayout(position, event) {
//   console.log(position)
//   console.log(event)
// }
</script>

<template>
  <CommonPageHeader
    class="mt--14.5 pt-14.5"
    bg-img="https://images.unsplash.com/photo-1533497197926-c9e810dcea9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    :content-parallax="false"
  >
    <div container mx-auto mt-2 class="min-h-[calc(100vh-9.25rem)]">
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
          <div
            ref="windowContentRef"
            class="overflow-hidden w-full h-full min-h-0 b-t border-[var(--color-neutral-3)] relative md:grid"
            style="
            grid-template-columns: 0.7fr 1.3fr;
            "
          >
            <nav class="b-r border-[var(--color-neutral-3)] h-full w-[calc(100%-3rem)] md:w-auto absolute md:relative h-full flex flex-col bg-light-1/85 dark:bg-dark-8/85 backdrop-blur z-9 transition-all !md:translate-x-0" :class="[valueNavEditor ? 'translate-x-0' : 'translate-x--100%']">
              <div class="h-9 b-b border-[var(--color-neutral-3)] bg-white/35 dark:bg-black/35 px-1 flex flex-none justify-between items-center">
                <span class="text-zinc-7 dark:text-zinc-3 text-sm/9">
                  Conversation
                </span>
                <div flex>
                  <a-popconfirm class="[&_.arco-popconfirm-popup-content]:p-1.2 ![&_.arco-popconfirm-popup-content]:rounded-2px ![&_.arco-popconfirm-body]:mb-1" content="Are you sure delete conversation ?!" type="warning" @ok="() => conversation.history = []">
                    <a-button :disabled="!conversation.history.length" class="block" status="danger" type="primary" size="mini">
                      <template #icon>
                        <span i-carbon-trash-can />
                      </template>
                    </a-button>
                  </a-popconfirm>
                  <a-button class="block md:hidden ml-1" type="primary" size="mini" @click="() => valueNavEditor = false">
                    <template #icon>
                      <span i-carbon-chevron-left />
                    </template>
                  </a-button>
                </div>
              </div>
              <div ref="conversationWrapperRef" class="flex-1 h-full h-35rem max-h-70vh overflow-auto">
                <div class="p-2 px-3 [&_.arco-comment-avatar]:mr-1 [&_.arco-comment-avatar]:cursor-auto">
                  <a-comment
                    v-for="(item, index) in conversation.history" :key="index"
                    class="overflow-hidden"
                    align="right"
                  >
                    <template #content>
                      <p class="overflow-hidden inline">
                        {{ item.text.substring(0, 120) }}{{ item.text.length > 120 ? '...' : '' }}
                      </p>
                      <span role="button" class="cursor-pointer i-carbon-document-attachment active:i-carbon-checkmark active:text-blue" @click="() => useClipboard().copy(item.text)" />
                    </template>
                    <template #datetime>
                      <!-- <span class="text-xs">{{ useDateFormat(item.time, 'HH:mm:ss').value }}</span> -->
                      <span class="text-xs">{{ ((date) => `${useTimeAgo(new Date(date)).value}`)(item.time) }}</span>
                    </template>
                    <template #author>
                      <span class="uppercase font-semibold">{{ item.speaker === 'human' ? 'Me' : 'Ai' }}</span>
                    </template>
                    <template #avatar>
                      <span v-if="item.speaker === 'human'" class="bg-blue-6/60 p-1 rounded-1 flex items-center">
                        <span text-white i-tabler-user w-4 h-4 />
                      </span>
                      <span v-else class="bg-green-6/60 p-1 rounded-1 flex items-center">
                        <span text-white i-tabler-brand-openai w-4 h-4 />
                      </span>
                    </template>
                  </a-comment>
                  <a-comment
                    align="right"
                  >
                    <template #avatar>
                      <span class="bg-blue-6/60 p-1 rounded-1 flex items-center">
                        <span text-white i-tabler-user w-4 h-4 />
                      </span>
                    </template>
                    <template #actions>
                      <div w-full block justify-between items-center>
                        <a-button :disabled="fetchingFromAi" type="primary" size="small" html-type="submit" class="group float-right" @click="onSubmitToAI">
                          Send
                          <span w-full h-full flex items-center justify-center rounded-r-2px class="ml-2 -mr-[calc(1rem-1px)] px-2 bg-blue-9/20">
                            <span class="transition-all group-hover:translate-x-15%" i-carbon-send />
                          </span>
                        </a-button>
                        <a-upload :custom-request="customRequest" :show-remove-button="true" :show-retry-button="false" list-type="picture" class="[&_.arco-upload-list-item-name]:max-w-25 md:[&_.arco-upload-list-item-name]:max-w-75 ![&_.arco-upload-list-item-content]:p-1" size="small" :auto-upload="false" :multiple="false">
                          <template #upload-button>
                            <a-button type="outline" size="small">
                              <span i-carbon-scan-alt mr-1 />
                              <span class="hidden md:block">
                                Text From Image
                              </span>
                            </a-button>
                          </template>
                        </a-upload>
                      </div>
                    </template>
                    <template #content>
                      <a-textarea
                        ref="userMessageRef"
                        v-model:model-value="userMessage"
                        allow-clear
                        :auto-size="{
                          minRows: 2,
                        }"
                      />
                    </template>
                  </a-comment>
                </div>
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
                <a-tab-pane key="1" title="code_with.ai">
                  <template #title>
                    <div class="flex items-center">
                      <span class="mr-1" i-tabler-brand-openai />
                      <span>code.ai</span>
                    </div>
                  </template>
                  <div
                    class="relative bg-white dark:bg-dark-950 dark:border-slate-900/50"
                  >
                    <div class="h-35rem max-h-70vh overflow-auto">
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
</template>

<style lang="less">
.arco-upload-list-item-content {
  @apply items-initial justify-between;
  .arco-upload-list-item-name {
    @apply mr-auto;
  }
  .arco-upload-progress {
    @apply flex h-inherit items-center justify-center w-12 m--1 ml-0 bg-blue-9 rounded-r-2px;
    background-color: var(--color-neutral-2);
  }
}
</style>

<route lang="yaml">
meta:
  layout: admin
  requiresAuth: true
  adminSidebar:
    title: Code With AI
    link: /admin/ai
    order: 3
    icon: i-tabler-brand-openai
    childOf: null
    hidden: false
</route>
