<script setup lang="ts">
import { useArrayUnique, useFetch, useMemoize } from '@vueuse/core'
import { useFuse } from '@vueuse/integrations/useFuse'
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval'
// import { mdAndLarger, smAndSmaller } from '~/common/stores'
// definePage({
//   name: 'adminSocial',
//   path: '/admin/social',
//   // alias: ['/admin/social'],
//   meta: {
//     layout: 'admin',
//     requiresAuth: true,
//     menu: {
//       name: 'social',
//       icon: 'i-carbon-two-person-lift',
//       parent: null,
//       hidden: false,
//     },
//   },
// })
// const { t } = useI18n()
const { message } = useMessage()
// const { width: windowWidth } = useWindowSize()
// const router = useRouter()

const { data: radioStations, isFinished } = useIDBKeyval('radio-stations', [])

const mediaVolume: Ref<number> = useStorage('radio-volume', 50)

const audioRadioRef = ref<HTMLAudioElement | null>(null)
const inputSearchStation = ref('')
const stationsListRef = ref(null)
const stationsListIsFetching = ref(true)
const radioList: any = ref([])

const [showFavoriteList, toggleShowFavoriteList] = useToggle()
const [showStatiosList, toggleShowStatiosList] = useToggle()
const { state, next, prev } = useCycleList(radioList)
const { playing, currentTime, waiting, volume, muted } = useMediaControls(audioRadioRef)
const { results: resultsSearchStation } = useFuse(inputSearchStation, radioList, {
  fuseOptions: {
    keys: ['name', 'homepage'],
  },
  matchAllWhenSearchEmpty: false,
})
const stations = useMemoize(
  async (): Promise<any> =>
    useFetch('https://at1.api.radio-browser.info/json/stations/search?limit=2000&language=french&hidebroken=true&order=clickcount&reverse=true').get().json(),
)
watch(isFinished, (val) => {
  if (val)
    getStations()
})
async function getStations() {
  if (radioStations.value.length > 0) {
    radioList.value = radioStations.value
    stationsListIsFetching.value = false
    return
  }

  const { data, error } = await stations()

  if (error.value)
    return

  if (data.value) {
    radioList.value = useArrayUnique(data.value.filter(i => i.favicon), (a, b) => a.name.trim() === b.name.trim()).value.map((s, index) => ({ ...s, isFavorite: false, srcHasError: false, index }))
    radioStations.value = radioList.value
  }

  stationsListIsFetching.value = false
}

function formatDuration(seconds: number) {
  return new Date(1000 * seconds).toISOString().slice(14, 19)
}

const volumeValue = computed({
  get: () => mediaVolume.value,
  set: (value) => {
    mediaVolume.value = value
    volume.value = value / 100
  },
})
useEventListener(audioRadioRef, 'error', (e) => {
  playing.value = false

  const src = e?.target?.currentSrc
  if (!src)
    return

  const station = radioList.value.find(i => i.url_resolved === src)

  station && (station.srcHasError = true)
  message.error(`error in station ${e?.target?.error?.message}`)
})
watchThrottled(
  state,
  async (newVal, oldVal) => {
    if (newVal?.srcHasError) {
      playing.value = false
      return
    }

    if ((oldVal && newVal) && playing.value && !newVal.srcHasError) {
      playing.value = false
      const playPromise = audioRadioRef.value?.play()
      playPromise && (await playPromise.then(() => {
        playing.value = true
      }).catch(() => {
        playing.value = false
      }))
    }
  },
  { throttle: 1200 },
)
watchThrottled(
  resultsSearchStation,
  async (newVal, __oldVal) => {
    if (!newVal.length)
      return

    const { refIndex } = newVal[0]
    stationsListRef.value?.scrollTo(refIndex)
  },
  { throttle: 1000 })
// Change initial media properties
onMounted(() => {
  volume.value = mediaVolume.value / 100
  currentTime.value = 0
  // getStations()
})
</script>

<template>
  <CommonPageHeader
    class="mt--14.5 pt-14.5"
    bg-img="https://images.unsplash.com/photo-1645747103867-0669a7eff310?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    bg-img-dark="https://images.unsplash.com/photo-1617397578305-53a7feadd726?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2942&q=80"
  >
    <div container mx-auto px-1 lg:px-3 lg:max-w-2xl>
      <div class="bg-white dark:bg-dark-7 rounded-t-sm p-2 pb-2 sm:p-2 sm:pb-2 lg:p-2 xl:p-3 xl:pb-4 space-y-2 sm:space-y-3 lg:space-y-4 xl:space-y-5">
        <div class="flex items-center space-x-1">
          <div class="w-18 h-18 flex justify-center">
            <UseImage :src="state?.favicon">
              <template #loading>
                <span class="i-fluent-music-note-2-20-filled flex-none rounded-sm p-0 w-full h-full" />
              </template>

              <template #error>
                <span class="i-fluent-music-note-2-20-filled flex-none rounded-sm p-0 w-full h-full" />
              </template>
            </UseImage>
          </div>
          <div class="min-w-0 flex-auto space-y-1 font-semibold">
            <h2 class="text-slate-9 dark:text-slate-1 leading-6 truncate text-lg text-lg">
              {{ state?.name }}
            </h2>
            <a :href="state?.homepage" target="_blank" class="text-slate-6 dark:text-slate-4 text-xs truncate">
              {{ state?.homepage }}
            </a>
          </div>
          <div v-if="state">
            <a-button shape="circle" class="block !w-8 !h-8 lg:!w-12 lg:!h-12" type="text" @click="state.isFavorite = !state.isFavorite">
              <template #icon>
                <span v-if="state?.isFavorite" i-fluent-heart-16-filled class="text-red" />
                <span v-else i-fluent-heart-16-regular class="text-red" />
              </template>
            </a-button>
          </div>
          <audio ref="audioRadioRef" autoplay="false" :src="state?.url_resolved" class="hidden" />
        </div>
        <div class="space-y-0">
          <div class="relative flex justify-center">
            <div class="flex-none w-12 mr-1">
              <a-button class="flex items-center justify-center mx-auto" type="text" shape="circle" @click="() => muted = !muted">
                <template #icon>
                  <span v-if="muted" class="i-fluent-speaker-off-28-regular" />
                  <span v-else-if="volume < 0.05" class="i-fluent-speaker-0-16-regular" />
                  <span v-else-if="volume < 0.25" class="i-fluent-speaker-1-16-regular" />
                  <span v-else class="i-fluent-speaker-16-regular" />
                </template>
              </a-button>
            </div>
            <div class="flex-1 flex justify-center">
              <a-slider v-model:model-value="volumeValue" class="w-full" :min="0" :max="100" :default-value="volumeValue" :disabled="muted" :format-tooltip="(value) => `${Math.round((value / 100) * 100)}%`" />
            </div>
            <div flex-none w-12 flex items-center ml-1 justify-end text-right>
              {{ formatDuration(currentTime) }}
            </div>
          </div>
        </div>
      </div>
      <div class="stations-list bg-slate-1 dark:bg-dark-9 relative border-slate-2 dark:border-black overflow-hidden transition-all-230" :class="[showStatiosList ? 'h-361px border-t' : 'h-0']">
        <span v-if="stationsListIsFetching" class="absolute flex justify-center content-center w-full h-full bg-light/55 dark:bg-dark/55 backdrop-blur z-3">
          <span class="m-auto">
            <span class="mx-auto text-blue my-2 block w-8 h-8 i-line-md-loading-twotone-loop" />
          </span>
        </span>
        <div class="absolute top-0 w-full p-2 bg-white/40 dark:bg-dark/40 backdrop-blur b-b border-zinc-1/30 dark:border-zinc-9/30 shadow-black/5 shadow-sm z-2">
          <a-input-search v-model="inputSearchStation" :disabled="showFavoriteList" placeholder="Please enter something" allow-clear class="[--color-fill-2:rgba(255,255,255,0.5)] dark:[--color-fill-2:rgba(0,0,0,0.5)]">
            <template #prefix>
              <a-button
                type="text" shape="square" size="small" class="-ml-2.7"
              >
                <i i-carbon-reset block />
              </a-button>
            </template>
          </a-input-search>
        </div>
        <UseVirtualList ref="stationsListRef" :list="showFavoriteList ? radioList.filter(s => s.isFavorite) : radioList" :options="{ itemHeight: 65 }" height="360px" class="pt-12">
          <template #default="{ data, index }">
            <div
              flex items-center style="height: 65px" class="b-b border-dark-1/5 dark:border-light-1/5"
              :class="[state?.stationuuid === data?.stationuuid ? 'bg-blue-5/10' : '', data.srcHasError && 'bg-red-4/10', resultsSearchStation.some((item) => item.refIndex === data.index) ? 'opacity-100' : (inputSearchStation.length ? 'opacity-30' : 'opacity-100')]"
            >
              <a-list-item :key="index" class="px-4 [&_.arco-list-item-action>_li:not(:last-child)]:mr-1">
                <a-list-item-meta
                  :title="data.name"
                  class="[&_.arco-list-item-meta-content]:inline-grid [&_.arco-list-item-meta-content>div]:truncate"
                >
                  <template #description>
                    {{ data.homepage }}
                  </template>
                  <template #avatar>
                    <span class="w-14 h-14 flex p-1 justify-center content-center">
                      <UseImage :src="data.favicon" class="transition-all">
                        <template #loading>
                          <span class="i-line-md-loading-twotone-loop text-blue p-0 w-6 h-6 m-auto opacity-60" />
                        </template>

                        <template #error>
                          <span class="i-fluent-music-note-2-20-filled p-0 w-full h-full opacity-40" />
                        </template>
                      </UseImage>
                    </span>
                  </template>
                </a-list-item-meta>
                <template #actions>
                  <span v-if="data.srcHasError" w-full h-full flex items-center mr-1>
                    <span class="text-red" i-fluent-info-16-regular />
                  </span>
                  <a-button v-else shape="circle" size="small" type="text" @click="() => data.isFavorite = !data.isFavorite">
                    <template #icon>
                      <span v-if="data.isFavorite" i-fluent-heart-16-filled class="text-red" />
                      <span v-else i-fluent-heart-16-regular class="text-red" />
                    </template>
                  </a-button>
                  <a-button shape="circle" size="small" type="text" @click="() => state = data">
                    <template #icon>
                      <span v-if="(state.stationuuid === data.stationuuid) && playing" i-fluent-pause-12-filled />
                      <span v-else i-fluent-play-20-filled />
                    </template>
                  </a-button>
                </template>
              </a-list-item>
            </div>
          </template>
        </UseVirtualList>
      </div>
      <div class="bg-slate-50 text-slate-500 border-slate-2 dark:border-black b-t dark:bg-dark-8 dark:text-slate-200 rounded-b-sm flex items-center py-3 lg:py-0 relative z-4">
        <div class="flex-auto flex items-center justify-evenly">
          <a-button shape="circle" class="block !w-8 !h-8 lg:!w-12 lg:!h-12" type="text" aria-label="FavoriteList" @click="() => { toggleShowFavoriteList(); showFavoriteList ? stationsListRef?.scrollTo(0) : stationsListRef?.scrollTo(state.index) }">
            <template #icon>
              <span v-if="showFavoriteList" i-fluent-heart-16-filled class="" />
              <span v-else i-fluent-heart-16-regular class="" />
            </template>
          </a-button>
          <a-button shape="circle" class="block !w-8 !h-8 lg:!w-12 lg:!h-12" type="text" aria-label="Previous" @click="() => (prev() && stationsListRef?.scrollTo(state.index))">
            <template #icon>
              <span i-fluent-previous-16-regular class="" />
            </template>
          </a-button>
        </div>
        <a-button :disabled="!state || waiting" long class="dark:text-slate-1 flex-none -my-4 lg:-my-3 mx-auto !w-16 !h-16 lg:!w-20 lg:!h-20 rounded-full ring-1 ring-slate-900/5 shadow-sm flex items-center justify-center" type="primary" shape="circle" @click="async () => { (!waiting && (!audioRadioRef?.paused ? audioRadioRef?.pause() : (!state.srcHasError && await audioRadioRef?.play()))); stationsListRef?.scrollTo(state.index) }">
          <template v-if="waiting">
            <span i-line-md-loading-twotone-loop class="text-3xl" />
          </template>
          <template v-else>
            <span v-if="playing" i-carbon-pause-filled class="text-3xl" />
            <span v-else i-carbon-play-filled-alt class="text-3xl" />
          </template>
        </a-button>
        <div class="flex-auto flex items-center justify-evenly">
          <a-button shape="circle" class="block !w-8 !h-8 lg:!w-12 lg:!h-12 xl:block" type="text" aria-label="Next" @click="() => (next() && stationsListRef?.scrollTo(state.index))">
            <template #icon>
              <span i-fluent-next-16-regular class="" />
            </template>
          </a-button>
          <a-button shape="circle" class="block !w-8 !h-8 lg:!w-12 lg:!h-12" type="text" aria-label="List" @click="toggleShowStatiosList()">
            <template #icon>
              <span v-if="showStatiosList" i-fluent-text-bullet-list-dismiss-20-regular class="" />
              <span v-else i-fluent-text-bullet-list-ltr-20-filled class="" />
            </template>
          </a-button>
        </div>
      </div>
    </div>
  </CommonPageHeader>
  <div container mx-auto z-2 relative bg-light-1 dark:bg-dark-9>
    <main class="py-5 px-5">
      <div class="mx-auto grid grid-cols-1 lg:gap-x-20 lg:grid-cols-2">
        <div class="relative p-3 col-start-1 row-start-1 flex flex-col-reverse rounded-lg bg-gradient-to-t from-black/75 via-black/0 sm:bg-none sm:row-start-2 sm:p-0 lg:row-start-1">
          <h1 class="mt-1 text-lg font-semibold text-white sm:text-slate-900 md:text-2xl dark:sm:text-white">
            Beach House in Collingwood
          </h1>
          <p class="text-sm leading-4 font-medium text-white sm:text-slate-500 dark:sm:text-slate-400">
            Entire house
          </p>
        </div>
        <div class="grid gap-4 col-start-1 col-end-3 row-start-1 sm:mb-6 sm:grid-cols-4 lg:gap-6 lg:col-start-2 lg:row-end-6 lg:row-span-6 lg:mb-0">
          <img src="https://images.unsplash.com/photo-1598228723793-52759bba239c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80" alt="" class="w-full h-60 object-cover object-center rounded-sm sm:h-52 sm:col-span-2 lg:col-span-full" loading="lazy">
          <img src="https://images.unsplash.com/photo-1531169509526-f8f1fdaa4a67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80" alt="" class="hidden w-full h-52 object-cover rounded-sm sm:block sm:col-span-2 md:col-span-1 lg:row-start-2 lg:col-span-2 lg:h-32" loading="lazy">
          <img src="https://images.unsplash.com/photo-1571327952197-21484ebf6cd5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" alt="" class="hidden w-full h-52 object-cover rounded-sm md:block lg:row-start-2 lg:col-span-2 lg:h-32" loading="lazy">
        </div>
        <dl class="mt-4 text-xs font-medium flex items-center row-start-2 sm:mt-1 sm:row-start-3 md:mt-2.5 lg:row-start-2">
          <dt class="sr-only">
            Reviews
          </dt>
          <dd class="text-blue-600 flex items-center dark:text-blue-400 mr-3">
            <span i-carbon-star-filled />
            <span>4.89 <span class="text-slate-400 font-normal">(128)</span></span>
          </dd>
          <dt class="sr-only">
            Location
          </dt>
          <dd class="flex items-center">
            <span i-carbon-location-filled />
            Collingwood, Ontario
          </dd>
        </dl>
        <div class="mt-4 col-start-1 row-start-3 self-center sm:mt-0 sm:col-start-2 sm:row-start-2 sm:row-span-2 lg:mt-6 lg:col-start-1 lg:row-start-3 lg:row-end-4">
          <a-button type="primary" html-type="submit" class="group">
            Check availability
            <span w-full h-full flex items-center justify-center rounded-r-2px class="ml-2 -mr-[calc(1rem-1px)] px-2 bg-blue-9/20">
              <span class="transition-all group-hover:translate-x-15%" i-carbon-arrow-right />
            </span>
          </a-button>
        </div>
        <p class="mt-4 text-sm leading-6 col-start-1 sm:col-span-2 lg:mt-6 lg:row-start-4 lg:col-span-1 dark:text-slate-200">
          This sunny and spacious room is for those traveling light and looking for a comfy and cosy place to lay their head for a night or two. This beach house sits in a vibrant neighborhood littered with cafes, pubs, restaurants and supermarkets and is close to all the major attractions such as Edinburgh Castle and Arthur's Seat.
        </p>
      </div>
    </main>
  </div>
  <div relative h-180 flex items-center>
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
    <div class="h-full pointer-events-none w-full absolute top-0 bg-black right-0 bg-cover mix-blend-multiply dark:mix-blend-lighten dark:bg-top-center opacity-85 dark:rotate-180 bg-top-center bg-[url(https://images.unsplash.com/photo-1470016342826-876ea880d0be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80)] dark:bg-[url(https://images.unsplash.com/photo-1485673634125-0f3ae8fd3209?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80)]" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  requiresAuth: true
  adminSidebar:
    title: Radio
    link: /admin/radio
    order: 1
    icon: i-fluent-music-note-2-20-regular
    childOf: null
    hidden: false
</route>
