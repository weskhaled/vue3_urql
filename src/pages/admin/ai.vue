<!-- eslint-disable vue/one-component-per-file -->
<!-- eslint-disable quote-props -->
<script setup lang="ts">
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { mdAndSmaller } from '~/common/stores'
import { useTesseract } from '~/composables/tesseract'
import CodeMirror from '~/components/common/CodeMirror/CodeMirror.vue'

const { files, open, reset, onChange } = useFileDialog({ accept: '.png, .jpg, .jpeg, .gif, .bmp, .tiff, .tif', multiple: false })
const { message } = useMessage()
const { init: initRecognition, result, status } = useTesseract()
const windowContentRef = ref<HTMLElement>()
const windowLayoutSplit = useStorage('window-layout-split', 0)
const codemirrorRef = ref<HTMLElement>()
const userMessageRef = ref<HTMLElement>()
const conversationWrapperRef = ref<HTMLElement>()
const cm = computed(() => codemirrorRef.value?.cm)
const cmScrollDOM = computed(() => cm.value?.docView?.view?.scrollDOM)
const cmDocViewDOM = computed(() => cm.value?.docView?.dom)
const { y: yCmScrollDOM } = useScroll(cmScrollDOM, { behavior: 'smooth' })
const { height: heightCmScrollDOM } = useElementSize(cmDocViewDOM)
function fileToObjectUrl(file: File) {
  return URL.createObjectURL(file)
}

const codemirrorReadOnly = ref<boolean>(false)
const conversation = reactive<any>({
  history: [],
})

const fetchingFromAi = ref(false)
const userMessage = ref('')
const lastResponse = ref('')

const resultResponse = ref('')
const [valueNavEditor, toggleNavEditor] = useToggle()
const tabActiveKey = ref('1')

const tabs = shallowReactive([
  {
    key: '1',
    title: 'code_with.ai',
    icon: 'i-tabler-brand-openai',
    closable: false,
    props: {
      modelValue: resultResponse,
      codemirrorRef,
      codemirrorReadOnly,
      mode: 'tsx',
      wrapperClasses: 'min-h-35rem max-h-70vh h-70vh overflow-auto',
    },
    component: defineComponent({
      name: 'CodeEditor',
      props: ['modelValue', 'codemirrorRef', 'codemirrorReadOnly', 'mode', 'wrapperClasses'],
      setup(props) {
        return () =>
          h('div', { class: props.wrapperClasses }, [
            h(CodeMirror, {
              modelValue: props.modelValue,
              ref: props.codemirrorRef,
              readOnly: props.codemirrorReadOnly,
              mode: props.mode,
              class: 'flex flex-auto h-full w-full',
            }),
          ])
      },
    }),
  },
])
function handleAddTab(__event, file = File) {
  tabs.push({
    key: `${tabs.length + 1}`,
    title: `${file.name}`,
    icon: 'i-tabler-photo-filled',
    props: {
      file,
      wrapperClasses: 'min-h-35rem max-h-70vh h-70vh overflow-auto',
    },
    component: defineComponent({
      name: 'ImageViewer',
      props: ['file'],
      setup(props) {
        return () =>
          h('div', { class: 'min-h-35rem max-h-70vh h-70vh overflow-auto' }, [
            h('img', { src: fileToObjectUrl(props.file), class: 'max-h-full max-w-full m-auto' }),
          ])
      },
    }),
    closable: true,
  })
  nextTick(() => {
    tabActiveKey.value = `${tabs.length}`
  })
}
function handleDeleteTab(key: string, __event) {
  const tabIndex = tabs.findIndex(item => item.key === key)
  tabIndex > -1 && tabs.splice(tabIndex, 1)
  nextTick(() => {
    tabActiveKey.value = '1'
  })
}
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
const speechLang = ref('en-US')
const [valueSpeechRecognition, toggleSpeechRecognition] = useToggle()
const speech = useSpeechRecognition({
  lang: speechLang,
  continuous: true,
})
const textFromSpeech = ref('')
watch(speech.result, (val) => {
  if (val)
    textFromSpeech.value = val
})
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
// onChange(async (files) => {
//   result.value = ''
//   status.value = 'PENDING'
//   // if (files?.length) {
//   //   await initRecognition(files[0])
//   //   await nextTick()
//   //   userMessage.value += userMessage.value.length ? `\n${result.value}` : result.value
//   // }
// })
watch(mdAndSmaller, (val) => {
  windowLayoutSplit.value = val ? 0 : 0.3
}, { immediate: true })
function onSubmitToAI() {
  if (userMessage.value.length < 5) {
    message.error('Please enter at least 5 characters')
    return
  }

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
      tabActiveKey.value = '1'
      nextTick(() => {
        conversationWrapperRef.value?.scrollTo({
          top: conversationWrapperRef.value?.scrollHeight,
          behavior: 'smooth',
        })
      })
      resumeWatchHeightCmScroll()
      // eslint-disable-next-line no-console
      console.log('Connection Established', res)
    },
    onmessage(msg) {
      const { data } = msg
      if (data) {
        try {
          const text = JSON.parse(data).choices[0]?.delta?.content?.replace(/``/g, '// ')?.replace(/`/g, '')
          if (text)
            addChunkToEditor(text)
        }
        catch (err) {
          controller.abort()
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
</script>

<template>
  <CommonPageHeader
    class="mt--14.5 pt-14.5"
    bg-img="https://images.unsplash.com/photo-1687333517042-b1749fc15642?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    bg-img-dark="https://images.unsplash.com/photo-1655637389009-81207e99c3c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    :content-parallax="false"
  >
    <div mx-auto mt-2 class="min-h-[calc(100vh-9.25rem)]">
      <div class="rounded-sm overflow-hidden ring-1 ring-[var(--color-neutral-3)]">
        <div class="rounded-t-sm">
          <div
            class="py-2 items-center px-4 gap-8 flex justify-between w-full bg-light-1/90 dark:bg-dark-9/90 backdrop-blur"
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
          >
            <a-split v-model:size="windowLayoutSplit" min="280px" max="0.6" default-size="0.3" class="editor-split">
              <template #first>
                <nav
                  class="b-r-1px md:b-r-0 border-[var(--color-neutral-3)] h-full w-[calc(100%-3rem)] md:w-auto absolute md:relative h-full flex flex-col bg-light-1/85 dark:bg-dark-8/85 backdrop-blur z-9 transition-all !md:translate-x-0"
                  :class="[valueNavEditor ? 'translate-x-0' : 'translate-x--100%']"
                >
                  <div
                    class="h-9 b-b border-[var(--color-neutral-3)] bg-white dark:bg-black px-1 flex flex-none justify-between items-center"
                  >
                    <span class="text-zinc-7 dark:text-zinc-3 text-sm/9">
                      Conversation
                    </span>
                    <div flex>
                      <a-popconfirm
                        class="[&_.arco-popconfirm-popup-content]:p-1.2 ![&_.arco-popconfirm-popup-content]:rounded-2px ![&_.arco-popconfirm-body]:mb-1"
                        content="Are you sure delete conversation ?!" type="warning"
                        @ok="() => conversation.history = []"
                      >
                        <a-button
                          :disabled="!conversation.history.length" class="block" status="danger" type="primary"
                          size="mini"
                        >
                          <template #icon>
                            <span i-carbon-trash-can />
                          </template>
                        </a-button>
                      </a-popconfirm>
                      <a-button
                        class="block md:hidden ml-1" type="primary" size="mini"
                        @click="() => valueNavEditor = false"
                      >
                        <template #icon>
                          <span i-carbon-chevron-left />
                        </template>
                      </a-button>
                    </div>
                  </div>
                  <div class="flex-1 min-h-35rem max-h-70vh h-70vh overflow-auto">
                    <div class="flex flex-col justify-between h-full gap-0px relative">
                      <!-- comments -->
                      <div ref="conversationWrapperRef" class="p-2 px-3 flex flex-col space-y-4 overflow-y-auto">
                        <div
                          v-for="(item, index) in conversation.history" :key="index" class="flex gap-x-1"
                          :class="[item.speaker === 'human' ? 'flex-row' : 'flex-row-reverse']"
                        >
                          <div class="flex-none">
                            <span v-if="item.speaker === 'human'" class="bg-blue-6/60 p-1 rounded-1 flex items-center">
                              <span text-white i-tabler-user w-4 h-4 />
                            </span>
                            <span v-else class="bg-green-6/60 p-1 rounded-1 flex items-center">
                              <span text-white i-tabler-brand-openai w-4 h-4 />
                            </span>
                          </div>
                          <div flex-1>
                            <div
                              class="flex justify-between items-center mb-1"
                              :class="[item.speaker === 'human' ? 'flex-row' : 'flex-row-reverse']"
                            >
                              <span class="uppercase font-semibold">{{ item.speaker === 'human' ? 'Me' : 'Ai' }}</span>
                              <span class="text-xs opacity-70">{{ ((date) => `${useTimeAgo(new
                                Date(date)).value}`)(item.time) }}</span>
                            </div>
                            <div
                              class="relative group bg-white/40 dark:bg-black/40 p-1 rounded-1"
                              :class="[item.speaker === 'human' ? 'text-left rounded-tl-0' : 'text-right rounded-tr-0']"
                            >
                              <span
                                role="button"
                                class="absolute transition-all bg-white dark:bg-black p-0.5 flex items-center opacity-20 group-hover:opacity-80"
                                :class="[item.speaker === 'human' ? 'right-1' : 'left-1']"
                                @click="() => useClipboard().copy(item.text)"
                              >
                                <span
                                  w-4 h-4
                                  class="cursor-pointer i-carbon-document-attachment active:i-carbon-checkmark active:text-green"
                                />
                              </span>
                              <p class="overflow-hidden truncate whitespace-normal">
                                {{ item.text.substring(0, 120) }} {{ item.text.length > 120 ? '...' : '' }}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div v-if="fetchingFromAi" w-full flex>
                          <span i-line-md-downloading-loop mx-auto w-6 h-6 />
                        </div>
                      </div>
                      <!-- chat inputs -->
                      <div class="p-3.2 sticky bottom-0 bg-white dark:bg-black b-t-1px border-[var(--color-neutral-2)]">
                        <div w-full flex flex-col>
                          <div>
                            <a-textarea
                              ref="userMessageRef" v-model:model-value="userMessage" allow-clear
                              placeholder="Type your message here..." :auto-size="{
                                minRows: 2,
                                maxRows: 5,
                              }"
                            />
                          </div>
                          <div w-full flex justify-between items-center>
                            <a-dropdown-button size="small">
                              Tools
                              <template #icon>
                                <icon-down />
                              </template>
                              <template #content>
                                <a-doption
                                  @click="speech.isSupported.value ? (textFromSpeech = '', valueSpeechRecognition = true) : message.error('Not Supported')"
                                >
                                  <span flex items-center>
                                    <span i-carbon-microphone-filled mr-1 />
                                    Text from voice
                                  </span>
                                </a-doption>
                                <a-doption @click="open()">
                                  <span flex items-center>
                                    <span i-carbon-image mr-1 />
                                    Text from image
                                  </span>
                                </a-doption>
                                <a-doption class="!bg-red-1/10 !text-red-4">
                                  <span flex items-center>
                                    <span i-carbon-close mr-1 />
                                    Stop Response
                                  </span>
                                </a-doption>
                              </template>
                            </a-dropdown-button>
                            <a-button
                              :disabled="fetchingFromAi" type="primary" size="small" html-type="submit"
                              class="group" @click="onSubmitToAI"
                            >
                              Send
                              <span
                                w-full h-full flex items-center justify-center rounded-r-2px
                                class="ml-2 -mr-[calc(1rem-1px)] px-2 bg-blue-9/20"
                              >
                                <span class="transition-all group-hover:translate-x-15%" i-carbon-send />
                              </span>
                            </a-button>
                          </div>
                          <div v-if="valueSpeechRecognition" mt-1>
                            <div class="bg-light-3 dark:bg-dark-9 rounded-2px p-1">
                              <div class="flex text-center items-center">
                                <div>
                                  <a-select v-model:model-value="speechLang" size="mini" placeholder="Select lang...">
                                    <a-option value="en-US">
                                      🇺🇸 English
                                    </a-option>
                                    <a-option value="fr">
                                      🇫🇷 French
                                    </a-option>
                                  </a-select>
                                </div>
                                <div
                                  class="m--3 mb-1 mx-auto inline-block text-right justify-center p-1 rounded-full bg-white dark:bg-black"
                                >
                                  <a-button
                                    v-if="speech.isListening.value" status="danger" type="primary" shape="round"
                                    size="medium"
                                    @click="() => (speech.stop(), speech.result.value.length && (userMessage += userMessage.length ? `\n${speech.result.value}` : speech.result.value), speech.result.value = '', textFromSpeech = '')"
                                  >
                                    <template #icon>
                                      <span i-carbon-pause-filled />
                                    </template>
                                  </a-button>
                                  <a-button
                                    v-else status="success" type="primary" shape="round" size="medium"
                                    @click="speech.start()"
                                  >
                                    <template #icon>
                                      <span i-carbon-microphone-filled />
                                    </template>
                                  </a-button>
                                </div>
                                <div ml-auto flex items-center>
                                  <a-button
                                    class="mr-1 px-1" status="danger" type="secondary" size="mini"
                                    @click="speech.stop(), textFromSpeech = '', toggleSpeechRecognition()"
                                  >
                                    <span i-carbon-close />
                                  </a-button>
                                </div>
                              </div>
                              <div class="flex flex-col">
                                <a-textarea
                                  v-model:model-value="textFromSpeech" allow-clear :auto-size="{
                                    minRows: 1,
                                    maxRows: 1,
                                  }"
                                />
                              </div>
                            </div>
                          </div>
                          <div v-if="files?.length" mt-2>
                            <div class="bg-light-2 dark:bg-dark-9 rounded-2px p-1">
                              <div flex justify-between items-center>
                                <div flex items-center max-w-fit overflow-hidden>
                                  <span>
                                    <img :src="fileToObjectUrl(files[0])" alt="" class="w-12 h-12 mr-1">
                                  </span>
                                  <span truncate>
                                    {{ files[0].name }}
                                  </span>
                                </div>
                                <div flex items-center h-full>
                                  <a-button
                                    class="" status="success" type="text" size="mini" shape="round"
                                    @click="(event) => handleAddTab(event, files[0])"
                                  >
                                    <template #icon>
                                      <span i-tabler-eye />
                                    </template>
                                  </a-button>
                                  <a-button
                                    :loading="['LOADING', 'RUNNING'].includes(status)"
                                    type="text"
                                    shape="round" size="small"
                                    @click="async () => { await initRecognition(files[0]); status === 'SUCCESS' && (userMessage += userMessage.length ? `\n${result}` : result) }"
                                  >
                                    <template #icon>
                                      <span i-carbon-caret-right />
                                    </template>
                                  </a-button>
                                  <a-button
                                    class="mx-1 px-1" status="danger" type="secondary" size="mini"
                                    @click="reset()"
                                  >
                                    <span i-carbon-close />
                                  </a-button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </nav>
              </template>
              <!-- tabs -->
              <template #second>
                <div class="flex-grow w-full z-7 bg-light-1 dark:bg-dark-9">
                  <a-tabs
                    editable type="card" size="small" class="custom-tabs" :active-key="tabActiveKey" @tab-click="(key) => tabActiveKey = `${key}`" @delete="handleDeleteTab"
                  >
                    <template #extra>
                      <div class="px-1 flex items-center">
                        <a-button class="md:hidden" size="mini" type="primary" @click="toggleNavEditor()">
                          <template #icon>
                            <span i-carbon-list class="" />
                          </template>
                        </a-button>
                      </div>
                    </template>
                    <a-tab-pane v-for="tab in tabs" :key="tab.key" :closable="tab.closable">
                      <template #title>
                        <div class="flex items-center">
                          <span class="mr-1" :class="tab.icon" />
                          <span>{{ tab.title }}</span>
                        </div>
                      </template>
                      <div class="relative bg-white dark:bg-dark-950 dark:border-slate-900/50">
                        <component :is="tab.component" v-bind="tab.props" />
                      </div>
                    </a-tab-pane>
                  </a-tabs>
                </div>
              </template>
            </a-split>

            <div
              v-if="mdAndSmaller" class="absolute z-8 w-full h-full top-0 bg-light-8 dark:bg-black transition-all-320"
              :class="[valueNavEditor ? 'opacity-60' : 'opacity-0 invisible pointer-events-none']"
              @click="() => valueNavEditor = false"
            />
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

.editor-split {
  .arco-split-trigger.arco-split-trigger-vertical {
    @apply hidden md:block z-22;

    & .arco-split-trigger-icon-wrapper {

      &:hover::after,
      &:active::after {
        @apply !opacity-100;
      }

      @apply relative;

      &::after {
        @apply content-[''] absolute w-3px h-full top-0 left--1px bg-opacity-90 bg-blue-5 z-13 opacity-0 transition-opacity-120 delay-220;
      }

      @apply !w-1px;
    }
  }
}

.text-from-image-modal {
  .arco-modal-header {
    @apply !mb-2;
  }

  .arco-modal-body {
    @apply !p-2;
  }

  .arco-modal-footer {
    @apply p-2 !mt-1;
  }
}

.custom-tabs {
  .arco-tabs-nav {
    @apply !grid;
  }
  .arco-tabs-content {
    @apply p-0;
  }
  .arco-tabs-nav-extra {
    @apply !absolute right-0;
  }
  .arco-tabs-nav.arco-tabs-nav-horizontal {

    .arco-tabs-nav-tab-list {
      @apply !overflow-x-auto !overflow-y-hidden !mr-9 scrollbar scrollbar-track-color-dark-7 dark:scrollbar-track-color-dark-7 scrollbar-track-color-white scrollbar-h-1px scrollbar-radius-0 scrollbar-track-radius-0 scrollbar-thumb-radius-0;
    }
    // .arco-tabs-nav-extra {
    //   @apply !sticky right-0 bg-green;

    //   .arco-tabs-nav-add-btn {
    //     @apply !h-auto sticky right-0 bg-green;
    //   }
    // }

    .arco-tabs-nav-tab-list {
      @apply !transform-none;

      .arco-tabs-tab-title {
        @apply !leading-8.25;
      }
    }

    .arco-tabs-tab {
      @apply !rounded-0 !border-t-0 !border-x-1px;

      &:first-child {
        @apply !border-l-0;
      }

      &.arco-tabs-tab-active {
        // @apply shadow-[inset_0_2px_2px_-2px_blue-5];
        @apply shadow-blue-5 !border-b-white !dark:border-b-[#121212] border-b-1px;
        box-shadow: inset 0 2px 0px 0px var(--un-shadow-color);
      }
    }

    .arco-tabs-nav-tab {
      @apply w-full;
    }

    .arco-tabs-nav-add-btn {
      @apply !h-auto sticky right-0 bg-green;
    }
  }

  .arco-tabs-nav-button.arco-tabs-nav-button-left,
  .arco-tabs-nav-button.arco-tabs-nav-button-right {
    @apply !hidden;
  }

  .arco-tabs-nav-tab.arco-tabs-nav-tab-scroll {
    @apply !overflow-x-auto !overflow-y-hidden;
  }

  // [&_.arco-tabs-nav]:bg-light-2 [&_.arco-tabs-nav]:dark:bg-dark-9 [&_.arco-tabs-nav]:flex-row-reverse [&_.arco-tabs-nav]:md:flex-row [&_.arco-tabs-content]:p-0 ![&._.arco-tabs-nav]:before:h-0 [--border-radius-small:0px] [&_.arco-tabs-tab-title]:leading-8.5 ![&_.arco-tabs-tab]:py-0 ![&_.arco-tabs-tab]:mx-0px ![&_.arco-tabs-tab]:px-6px
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
