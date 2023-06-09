<script setup lang="ts">
import { useArrayUnique, useFetch, useMemoize } from '@vueuse/core'
import { useRouteQuery } from '@vueuse/router'
import { useFuse } from '@vueuse/integrations/useFuse'
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval'
// import { mdAndLarger, smAndSmaller } from '~/common/stores'
// const { t } = useI18n()
// const { width: windowWidth } = useWindowSize()
// const router = useRouter()
const { message } = useMessage()
const stationUrlResolvedQuery = useRouteQuery('station-url-resolved', null, { transform: String })
const { data: radioStationsIDB, isFinished: isFinishedRadioStations } = useIDBKeyval('radio-stations', [])
const { data: savedStationsIDB, isFinished: isFinishedSavedStations } = useIDBKeyval('saved-stations', [])

const mediaVolume: Ref<number> = useStorage('radio-volume', 50)
const selectedCountry: Ref<string> = useStorage('selected-country', 'FR')

const countries = ref([{
  value: 'FR',
  label: '🇫🇷 France',
  other: '🇫🇷',
}, {
  value: 'GB',
  label: '🇬🇧 United Kingdom',
  other: '🇬🇧',
}])
const audioRadioRef = ref<HTMLAudioElement | null>(null)
const inputSearchStation = ref('')
const stationsListRef = ref(null)
const stationsListIsFetching = ref(true)
const [playPauseMedia, togglePlayPauseMedia] = useToggle()
const [showFavoriteList, toggleShowFavoriteList] = useToggle()
const [showStatiosList, toggleShowStatiosList] = useToggle()
const listStationToShow = computed(() => {
  return showFavoriteList.value ? savedStationsIDB.value : radioStationsIDB.value
})
const { state, next, prev } = useCycleList(listStationToShow)
const { playing, currentTime, waiting, volume, muted } = useMediaControls(audioRadioRef)
const { results: resultsSearchStation } = useFuse(inputSearchStation, listStationToShow, {
  fuseOptions: {
    keys: ['name', 'homepage'],
  },
  matchAllWhenSearchEmpty: false,
})
const stations = useMemoize(
  async (countrycode = 'FR'): Promise<any> =>
    useFetch(`https://at1.api.radio-browser.info/json/stations/search?limit=2000&countrycode=${countrycode}&hidebroken=true&order=clickcount&reverse=true`).get().json(),
)
watch(isFinishedRadioStations, async (val) => {
  if (val) {
    if (radioStationsIDB.value.length === 0) {
      getStations(selectedCountry.value)
    }
    else {
      stationsListIsFetching.value = false
      await nextTick()
      if (stationUrlResolvedQuery.value) {
        const station = radioStationsIDB.value.find(i => i.url_resolved === stationUrlResolvedQuery.value)
        if (station)
          state.value = station
      }
    }
  }
})
async function getStations(countrycode = 'FR') {
  stationsListIsFetching.value = true
  const { data, error } = await stations(countrycode)

  if (error.value)
    return

  if (data.value)
    radioStationsIDB.value = useArrayUnique(data.value.filter(i => i.favicon), (a, b) => a.name.trim() === b.name.trim()).value.map((s, index) => ({ ...s, isFavorite: false, srcHasError: false, index }))

  stationsListIsFetching.value = false
  await nextTick()
  if (stationUrlResolvedQuery.value) {
    const station = radioStationsIDB.value.find(i => i.url_resolved === stationUrlResolvedQuery.value)
    if (station)
      state.value = station
  }
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
  playPauseMedia.value = false

  const src = e?.target?.currentSrc
  if (!src)
    return

  const station = radioStationsIDB.value.find(i => i.url_resolved === src)

  station && (station.srcHasError = true)
  message.error(`error in station ${e?.target?.error?.message}`)
})

watchThrottled(
  state,
  async (newVal, __oldVal) => {
    stationUrlResolvedQuery.value = newVal.url_resolved
    if (!playPauseMedia.value) {
      playing.value = false
      return
    }

    if (newVal) {
      await nextTick()
      inputSearchStation.value = ''
      const playPromise = audioRadioRef.value?.play()
      playPromise && (playPromise.then(() => {
        newVal.srcHasError = false
        playing.value = true
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

    await nextTick()
    const { refIndex } = newVal[0]
    stationsListRef.value?.scrollTo(refIndex)
  },
  { throttle: 1000 },
)
watchThrottled(
  selectedCountry,
  async (newVal, __oldVal) => {
    getStations(newVal)
  },
  { throttle: 1000 },
)
watchThrottled(
  playPauseMedia,
  async (newVal) => {
    if (newVal) {
      await nextTick()
      const playPromise = audioRadioRef.value?.play()
      playPromise && (playPromise.then(() => {
        state.value.srcHasError = false
        stationUrlResolvedQuery.value = newVal.url_resolved
      }))
    }
    else {
      audioRadioRef.value?.pause()
    }
  },
  { throttle: 200 },
)
// Change initial media properties
onMounted(async () => {
  volume.value = mediaVolume.value / 100
  currentTime.value = 0
  playing.value = false
})
</script>

<template>
  <div>
    <div
      class="bg-white dark:bg-dark-7 rounded-t-sm p-2 pb-2 sm:p-2 sm:pb-2 lg:p-2 xl:p-3 xl:pb-4 space-y-2 sm:space-y-3 lg:space-y-4 xl:space-y-5"
    >
      <div class="flex items-center space-x-1">
        <div
          class="w-18 h-18 flex justify-center flex-none"
          @click="() => { state && (showStatiosList = true, stationsListRef?.scrollTo(state.index)) }"
        >
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
          <div flex>
            <a :href="state?.homepage" target="_blank" class="text-slate-6 dark:text-slate-4 text-xs truncate">
              <span>
                {{ state?.homepage }}
              </span>
            </a>
          </div>
        </div>
        <div v-if="state">
          <span v-if="state.srcHasError" w-full h-full flex items-center mr-1>
            <span class="text-red" i-fluent-info-16-regular />
          </span>
          <a-button
            v-else shape="circle" size="small" type="text"
            @click="() => { savedStationsIDB.some((i) => i.stationuuid === state.stationuuid) ? (savedStationsIDB = savedStationsIDB.filter((i) => i.stationuuid !== state.stationuuid)) : savedStationsIDB.push(state) }"
          >
            <template #icon>
              <span
                v-if="savedStationsIDB.some((i) => i.stationuuid === state.stationuuid)"
                i-fluent-heart-16-filled class="text-red"
              />
              <span v-else i-fluent-heart-16-regular class="text-red" />
            </template>
          </a-button>
        </div>
        <audio ref="audioRadioRef" :src="state?.url_resolved" class="hidden" />
      </div>
      <div class="space-y-0">
        <div class="relative flex justify-center">
          <div class="flex-none w-12 mr-1">
            <a-button
              class="flex items-center justify-center mx-auto" type="text" shape="circle"
              @click="() => muted = !muted"
            >
              <template #icon>
                <span v-if="muted" class="i-fluent-speaker-off-28-regular" />
                <span v-else-if="volume < 0.05" class="i-fluent-speaker-0-16-regular" />
                <span v-else-if="volume < 0.25" class="i-fluent-speaker-1-16-regular" />
                <span v-else class="i-fluent-speaker-16-regular" />
              </template>
            </a-button>
          </div>
          <div class="flex-1 flex justify-center">
            <a-slider
              v-model:model-value="volumeValue" class="w-full" :min="0" :max="100"
              :default-value="volumeValue" :disabled="muted"
              :format-tooltip="(value) => `${Math.round((value / 100) * 100)}%`"
            />
          </div>
          <div flex-none w-12 flex items-center ml-1 justify-end text-right>
            {{ formatDuration(currentTime) }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="stations-list bg-slate-1 dark:bg-dark-9 relative border-slate-2 dark:border-black overflow-hidden transition-all-230"
      :class="[showStatiosList ? 'h-361px border-t' : 'h-0']"
    >
      <span
        v-if="stationsListIsFetching"
        class="absolute flex justify-center content-center w-full h-full bg-light/55 dark:bg-dark/55 backdrop-blur z-3"
      >
        <span class="m-auto">
          <span class="mx-auto text-blue my-2 block w-8 h-8 i-line-md-loading-twotone-loop" />
        </span>
      </span>
      <div
        class="absolute top-0 w-full p-2 bg-white/40 dark:bg-dark/40 backdrop-blur b-b border-zinc-1/30 dark:border-zinc-9/30 shadow-black/5 shadow-sm z-2"
      >
        <div class="flex w-full space-x-1">
          <a-select
            v-if="!showFavoriteList"
            v-model:model-value="selectedCountry" :scrollbar="false" class="w-1/3" :options="countries"
            placeholder="Please select ..."
          />
          <a-input-search
            v-model="inputSearchStation"
            placeholder="Please enter something" allow-clear
            class="w-3/3 [--color-fill-2:rgba(255,255,255,0.5)] dark:[--color-fill-2:rgba(0,0,0,0.5)]"
          >
            <template #prefix>
              <a-button type="text" shape="square" size="small" class="-ml-2.7">
                <i i-carbon-reset block />
              </a-button>
            </template>
          </a-input-search>
        </div>
      </div>
      <UseVirtualList
        ref="stationsListRef" :list="listStationToShow" :options="{ itemHeight: 65 }" height="360px"
        class="pt-12"
      >
        <template #default="{ data, index }">
          <div
            flex items-center style="height: 65px" class="b-b border-dark-1/5 dark:border-light-1/5"
            :class="[state?.stationuuid === data?.stationuuid ? 'bg-blue-5/10' : '', data.srcHasError && 'bg-red-4/10', resultsSearchStation.some((item) => item.refIndex === data.index) ? 'opacity-100' : (inputSearchStation.length ? 'opacity-60' : 'opacity-100')]"
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
                        <span
                          class="i-line-md-loading-twotone-loop text-blue p-0 w-6 h-6 m-auto opacity-60"
                        />
                      </template>

                      <template #error>
                        <span
                          class="i-fluent-music-note-2-20-filled p-0 w-full h-full opacity-40"
                        />
                      </template>
                    </UseImage>
                  </span>
                </template>
              </a-list-item-meta>
              <template #actions>
                <span v-if="data.srcHasError" w-full h-full flex items-center mr-1>
                  <span class="text-red" i-fluent-info-16-regular />
                </span>
                <a-button
                  v-else shape="circle" size="small" type="text"
                  @click="() => { !showFavoriteList ? (savedStationsIDB.some((i) => i.stationuuid === data.stationuuid) ? (savedStationsIDB = savedStationsIDB.filter((i) => i.stationuuid !== data.stationuuid)) : savedStationsIDB.push(data)) : (savedStationsIDB = savedStationsIDB.filter((i) => i.stationuuid !== data.stationuuid)) }"
                >
                  <template #icon>
                    <span
                      v-if="savedStationsIDB.some((i) => i.stationuuid === data.stationuuid)"
                      i-fluent-heart-16-filled class="text-red"
                    />
                    <span v-else i-fluent-heart-16-regular class="text-red" />
                  </template>
                </a-button>
                <a-button shape="circle" size="small" type="text" @click="() => state = data">
                  <template #icon>
                    <span
                      v-if="state?.stationuuid === data.stationuuid && waiting"
                      i-line-md-loading-twotone-loop class="text-sm"
                    />
                    <template v-else>
                      <a-button
                        shape="circle" size="small" type="text"
                        @click="() => state?.stationuuid === data.stationuuid ? togglePlayPauseMedia() : playPauseMedia = true"
                      >
                        <span
                          v-if="(state?.stationuuid === data.stationuuid) && playPauseMedia"
                          i-fluent-pause-12-filled
                        />
                        <span v-else i-fluent-play-20-filled />
                      </a-button>
                    </template>
                  </template>
                </a-button>
              </template>
            </a-list-item>
          </div>
        </template>
      </UseVirtualList>
    </div>
    <div
      class="bg-slate-50 text-slate-500 border-slate-2 dark:border-black b-t dark:bg-dark-8 dark:text-slate-200 rounded-b-sm flex items-center py-3 lg:py-0 relative z-4"
    >
      <div class="flex-auto flex items-center justify-evenly">
        <a-button
          shape="circle" class="block !w-8 !h-8 lg:!w-12 lg:!h-12" type="text" aria-label="FavoriteList"
          @click="async () => { inputSearchStation = ''; showStatiosList = true; toggleShowFavoriteList(); await nextTick(); (showFavoriteList ? stationsListRef?.scrollTo(0) : stationsListRef?.scrollTo(state.index)) }"
        >
          <template #icon>
            <span v-if="showFavoriteList" i-fluent-search-20-regular class="" />
            <span v-else i-fluent-clipboard-heart-20-filled class="" />
          </template>
        </a-button>
        <a-button
          shape="circle" class="block !w-8 !h-8 lg:!w-12 lg:!h-12" type="text" aria-label="Previous"
          @click="async () => { prev(); await nextTick(); stationsListRef?.scrollTo(state.index) }"
        >
          <template #icon>
            <span i-fluent-previous-16-regular class="" />
          </template>
        </a-button>
      </div>
      <a-button
        :disabled="!state || waiting" long
        class="dark:text-slate-1 flex-none -my-4 lg:-my-3 mx-auto !w-16 !h-16 lg:!w-20 lg:!h-20 rounded-full ring-1 ring-slate-900/5 shadow-sm flex items-center justify-center"
        type="primary" shape="circle"
        @click="async () => { (!waiting && togglePlayPauseMedia()); stationsListRef?.scrollTo(state.index) }"
      >
        <template v-if="waiting">
          <span i-line-md-loading-twotone-loop class="text-3xl" />
        </template>
        <template v-else>
          <span v-if="playPauseMedia" i-carbon-pause-filled class="text-3xl" />
          <span v-else i-carbon-play-filled-alt class="text-3xl" />
        </template>
      </a-button>
      <div class="flex-auto flex items-center justify-evenly">
        <a-button
          shape="circle" class="block !w-8 !h-8 lg:!w-12 lg:!h-12 xl:block" type="text" aria-label="Next"
          @click="async () => { next(); await nextTick(); stationsListRef?.scrollTo(state.index) }"
        >
          <template #icon>
            <span i-fluent-next-16-regular class="" />
          </template>
        </a-button>
        <a-button
          shape="circle" class="block !w-8 !h-8 lg:!w-12 lg:!h-12" type="text" aria-label="List"
          @click="toggleShowStatiosList()"
        >
          <template #icon>
            <span v-if="showStatiosList" i-fluent-text-bullet-list-dismiss-20-regular class="" />
            <span v-else i-fluent-text-bullet-list-ltr-20-filled class="" />
          </template>
        </a-button>
      </div>
    </div>
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
