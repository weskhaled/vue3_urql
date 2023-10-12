<script setup lang="ts">
import { useArrayUnique, useFetch, useMemoize } from '@vueuse/core'
import { useRouteQuery } from '@vueuse/router'
import { useFuse } from '@vueuse/integrations/useFuse'
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval'
import { useSortable } from '@vueuse/integrations/useSortable'

// import { mdAndLarger, smAndSmaller } from '~/common/stores'
// const { t } = useI18n()
// const router = useRouter()
const { message } = useMessage()
const stationUrlResolvedQuery = useRouteQuery('station', null)
const countryUrlResolvedQuery = useRouteQuery('country', null)
const { data: radioStationsIDB, isFinished: isFinishedRadioStations } = useIDBKeyval('radio-stations', [])
const { data: savedStationsIDB } = useIDBKeyval('saved-stations', [])

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
},
{
  label: '🇹🇳 Tunisia',
  value: 'TN',
  other: 93,
}])
const audioRadioRef = ref<HTMLAudioElement | null>(null)
const wrapperFavoriteList = ref<HTMLElement | null>(null)
const inputSearchStation = ref('')
const stationsListRef = ref(null)
const stationsListIsFetching = ref(true)
const [playPauseMedia, togglePlayPauseMedia] = useToggle()
const [showFavoriteList, toggleShowFavoriteList] = useToggle()
const [showStatiosList, toggleShowStatiosList] = useToggle()
const stationInPlay = ref()

// const { state, next, prev } = useCycleList(playList)
const { history, undo, redo, last, canRedo, canUndo, commit } = useManualRefHistory(stationInPlay)

const { playing, currentTime, waiting, volume, muted, buffered, duration } = useMediaControls(audioRadioRef)

const { results: resultsSearchStation } = useFuse(inputSearchStation, useSorted(radioStationsIDB, (a, b) => a.isFavorite - b.isFavorite, { dirty: true }), {
  fuseOptions: {
    keys: ['name', 'homepage', 'tags'],
  },
  matchAllWhenSearchEmpty: true,
})
const { results: resultsSearchFavoriteStation } = useFuse(inputSearchStation, savedStationsIDB, {
  fuseOptions: {
    keys: ['name', 'homepage', 'tags'],
  },
  matchAllWhenSearchEmpty: true,
})
useSortable(wrapperFavoriteList, resultsSearchFavoriteStation, {
  handle: '.handle',
  onUpdate: async (e) => {
    const parent = useParentElement(e.item).value

    parent?.querySelectorAll('.station').forEach((el, index) => {
      const station = savedStationsIDB.value.find(i => i.stationuuid === el.dataset.stationuuid)
      station && (station.order = index)
    })
  },
})
const getStationsMemoize = useMemoize(
  async (baseURL = 'at1.api.radio-browser.info', countrycode = 'FR'): Promise<any> =>
    useFetch(`https://${baseURL}/json/stations/search?limit=2000&countrycode=${countrycode}&hidebroken=true&order=clickcount&reverse=true`).get().json(),
)
const getCountriesMemoize = useMemoize(
  async (): Promise<any> =>
    useFetch('/all-api/countries').get().json(),
)
watch(isFinishedRadioStations, async (val) => {
  if (val) {
    const country = countryUrlResolvedQuery.value !== null ? countryUrlResolvedQuery.value : selectedCountry.value
    if (radioStationsIDB.value.length === 0 || (country !== selectedCountry.value)) {
      getStations(country)
      selectedCountry.value = country
    }
    else {
      stationsListIsFetching.value = false
      await nextTick()
      if (stationUrlResolvedQuery.value) {
        const station = radioStationsIDB.value.find(i => i.stationuuid === stationUrlResolvedQuery.value)
        if (station)
          stationInPlay.value = station
      }
      else {
        stationInPlay.value = radioStationsIDB.value[0]
      }
    }
  }
})
async function getStations(countryCode = 'FR') {
  stationsListIsFetching.value = true
  let baseURL = 'at1.api.radio-browser.info'
  const { data: dataServers, error: errorServers } = await useFetch('/all-api/servers').get().json()
  if (dataServers.value && !errorServers.value) {
    const hosts = dataServers.value.map(s => s.name)
    if (hosts.length)
      baseURL = hosts[Math.floor(Math.random() * hosts.length)]
  }
  const { data, error } = await getStationsMemoize(baseURL, countryCode)

  if (error.value)
    return

  if (data.value)
    radioStationsIDB.value = useArrayUnique(data.value, (a, b) => a.name.trim() === b.name.trim()).value.map((s, index) => ({ ...s, isFavorite: false, srcHasError: false, index, order: index }))

  stationsListIsFetching.value = false
  await nextTick()
  if (stationUrlResolvedQuery.value !== null) {
    const station = radioStationsIDB.value.find(i => i.stationuuid === stationUrlResolvedQuery.value)
    if (station)
      stationInPlay.value = station
  }
  else {
    stationInPlay.value = radioStationsIDB.value[0]
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

  if (!stationInPlay.value)
    return

  const station = radioStationsIDB.value.find(i => i.stationuuid === stationInPlay.value.stationuuid)

  station && (station.srcHasError = true)
  message.error(`error in station ${e?.target?.error?.message}`)
})

watchThrottled(
  stationInPlay,
  async (newVal, __oldVal) => {
    if (!playPauseMedia.value) {
      playing.value = false
      return
    }

    if (newVal) {
      await nextTick()
      const playPromise = audioRadioRef.value?.play()
      playPromise && (playPromise.then(() => {
        stationUrlResolvedQuery.value = newVal.stationuuid
        countryUrlResolvedQuery.value = newVal.countrycode
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
    stationsListRef.value?.scrollTo(0)
  },
  { throttle: 1000 },
)
watchThrottled(
  selectedCountry,
  async (newVal) => {
    newVal && getStations(newVal)
  },
  { throttle: 1000 },
)
watchThrottled(
  playPauseMedia,
  async (val) => {
    if (val) {
      await nextTick()
      const playPromise = audioRadioRef.value?.play()
      playPromise && (playPromise.then(() => {
        stationUrlResolvedQuery.value = stationInPlay.value.stationuuid
        countryUrlResolvedQuery.value = stationInPlay.value.countrycode
        stationInPlay.value.srcHasError = false
        playing.value = true
      }))
    }
    else {
      audioRadioRef.value?.pause()
    }
  },
  { throttle: 200 },
)
async function getCountries() {
  const { data: dataCountries, error: errorCountries } = await getCountriesMemoize()
  if (dataCountries.value && !errorCountries.value)
    countries.value = dataCountries.value.map((c: any) => ({ label: c.name, value: c.iso_3166_1, count: c.stationcount }))
}
// Change initial media properties
onMounted(async () => {
  volume.value = mediaVolume.value / 100
  currentTime.value = 0
  playing.value = false
  getCountries()
})
</script>

<template>
  <div>
    <div
      class="bg-white dark:bg-dark-7 rounded-t-sm p-2 pb-2 sm:p-2 sm:pb-2 lg:p-2 xl:p-3 xl:pb-4 space-y-2 sm:space-y-3 lg:space-y-4 xl:space-y-5"
    >
      <div class="flex items-center space-x-2">
        <div
          class="w-18 h-18 flex justify-center flex-none"
          @click="() => { !showFavoriteList && stationInPlay && (showStatiosList = true, stationsListRef?.scrollTo(stationInPlay?.index)) }"
        >
          <UseImage :src="stationInPlay?.favicon">
            <template #loading>
              <span class="i-line-md-loading-twotone-loop flex-none rounded-sm p-0 w-full h-full text-blue-7 w-5 h-5 m-auto" />
            </template>

            <template #error>
              <span class="i-carbon-radio flex-none rounded-sm p-0 w-full h-full text-blue" />
            </template>
          </UseImage>
        </div>
        <div class="min-w-0 flex-auto space-y-1 font-semibold relative h-18 flex flex-col justify-center">
          <h2 class="text-slate-9 dark:text-slate-1 truncate text-lg lg:text-3xl">
            {{ stationInPlay?.name }}
          </h2>
          <div flex>
            <a :href="stationInPlay?.homepage" target="_blank" class="text-slate-6 dark:text-slate-4 text-xs truncate">
              <span>
                {{ stationInPlay?.homepage }}
              </span>
            </a>
          </div>
        </div>
        <div v-if="stationInPlay">
          <span v-if="stationInPlay.srcHasError" w-full h-full flex items-center mr-1>
            <span class="text-red" i-fluent-info-16-regular />
          </span>
          <a-button
            v-else shape="circle" size="small" type="text"
            @click="() => { savedStationsIDB.some((i) => i.stationuuid === stationInPlay.stationuuid) ? (savedStationsIDB = savedStationsIDB.filter((i) => i.stationuuid !== stationInPlay.stationuuid)) : savedStationsIDB.push(stationInPlay) }"
          >
            <template #icon>
              <span
                v-if="savedStationsIDB.some((i) => i.stationuuid === stationInPlay.stationuuid)"
                i-fluent-heart-16-filled class="text-red"
              />
              <span v-else i-fluent-heart-16-regular class="text-red" />
            </template>
          </a-button>
        </div>
      </div>
      <audio ref="audioRadioRef" controls="true" :src="stationInPlay?.url_resolved" class="hidden flex-none" />
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
          <div class="flex-1 flex justify-center relative">
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
      :class="[showStatiosList ? 'h-360px border-t-0' : 'h-0']"
    >
      <div
        class="absolute z-13 top-0 w-full p-2 bg-white/40 dark:bg-dark/40 backdrop-blur b-b border-zinc-1/30 dark:border-zinc-9/30 shadow-black/5 shadow-sm"
      >
        <div class="flex justify-end w-full space-x-1 [--color-fill-2:rgba(255,255,255,0.5)] dark:[--color-fill-2:rgba(0,0,0,0.5)]">
          <a-select
            v-if="!showFavoriteList"
            v-model:model-value="selectedCountry"
            allow-search
            :scrollbar="false" class="w-2/6" :options="countries"
            placeholder="Please select ..."
          />
          <div class="flex items-center space-x-2" :class="[showFavoriteList ? 'w-6/6' : 'w-4/6']">
            <div v-if="showFavoriteList" flex-none flex items-center>
              <a-button
                shape="circle" class="block w-6 h-6 mr-1" type="text" aria-label="FavoriteList"
                @click="async () => { inputSearchStation = ''; showStatiosList = true; toggleShowFavoriteList(); await nextTick(); (!showFavoriteList && (stationsListRef?.scrollTo(stationInPlay?.index))) }"
              >
                <template #icon>
                  <span i-fluent-arrow-left-16-filled class="" />
                </template>
              </a-button>
              <h4 class="uppercase text-xs/7 font-bold">
                My Favorite
              </h4>
            </div>
            <a-input-search
              v-model="inputSearchStation"
              :disabled="!showFavoriteList && stationsListIsFetching"
              class="transition-width-320"
              :placeholder="showFavoriteList ? 'Search in Favorite' : 'Search ...'" allow-clear
            />
          </div>
        </div>
      </div>
      <div class="flex w-full overflow-hidden relative z-9">
        <span
          v-if="stationsListIsFetching"
          class="absolute flex justify-center content-center w-full h-full bg-light/55 dark:bg-dark/55 backdrop-blur z-2"
        >
          <span class="m-auto">
            <span class="mx-auto text-blue my-2 block w-8 h-8 i-line-md-loading-twotone-loop" />
          </span>
        </span>
        <div class="w-full flex-none transition-all-230 relative z-1" :class="[showFavoriteList ? '-translate-x-[calc(10%)]' : 'translate-x-0']">
          <UseVirtualList
            ref="stationsListRef" :list="resultsSearchStation" :options="{ itemHeight: 65 }" height="360px"
            class="pt-12"
          >
            <template #default="{ data, index }">
              <div
                flex items-center style="height: 65px" class="b-b border-dark-1/5 dark:border-light-1/5"
                :class="[stationInPlay?.stationuuid === data.item.stationuuid ? 'bg-blue-5/5' : '', data.item.srcHasError && 'bg-red-4/10']"
              >
                <a-list-item :key="index" class="px-2 [&_.arco-list-item-action>_li:not(:last-child)]:mr-1">
                  <a-list-item-meta
                    :title="data.item.name"
                    class="[&_.arco-list-item-meta-content]:inline-grid [&_.arco-list-item-meta-content>div]:truncate"
                  >
                    <template #description>
                      {{ data.item.homepage }}
                    </template>
                    <template #avatar>
                      <span class="w-14 h-14 flex p-1 justify-center content-center">
                        <UseImage :src="data.item.favicon" class="transition-all">
                          <template #loading>
                            <span
                              class="i-line-md-loading-twotone-loop text-blue p-0 w-6 h-6 m-auto opacity-60"
                            />
                          </template>

                          <template #error>
                            <span
                              class="i-carbon-radio p-0 w-full h-full opacity-40"
                            />
                          </template>
                        </UseImage>
                      </span>
                    </template>
                  </a-list-item-meta>
                  <template #actions>
                    <span v-if="data.item.srcHasError" w-full h-full flex items-center mr-1>
                      <span class="text-red" i-fluent-info-16-regular />
                    </span>
                    <a-button
                      v-else shape="circle" size="small" type="text"
                      @click="() => { !showFavoriteList ? (savedStationsIDB.some((i) => i.stationuuid === data.item.stationuuid) ? (savedStationsIDB = savedStationsIDB.filter((i) => i.stationuuid !== data.item.stationuuid)) : savedStationsIDB.push({ ...data.item, order: savedStationsIDB.length })) : (savedStationsIDB = savedStationsIDB.filter((i) => i.stationuuid !== data.item.stationuuid)) }"
                    >
                      <template #icon>
                        <span
                          v-if="savedStationsIDB.some((i) => i.stationuuid === data.item.stationuuid)"
                          i-fluent-heart-16-filled class="text-red"
                        />
                        <span v-else i-fluent-heart-16-regular class="text-red" />
                      </template>
                    </a-button>
                    <a-button :disabled="stationInPlay?.stationuuid === data.item.stationuuid && waiting" shape="circle" size="small" type="text" @click="async() => { stationInPlay?.stationuuid === data.item.stationuuid ? togglePlayPauseMedia() : (stationInPlay = data.item, commit(), await nextTick(), playPauseMedia = true) }">
                      <template #icon>
                        <span
                          v-if="stationInPlay?.stationuuid === data.item.stationuuid && waiting"
                          i-line-md-loading-twotone-loop class="text-sm"
                        />
                        <template v-else>
                          <span
                            v-if="(stationInPlay?.stationuuid === data.item.stationuuid) && playPauseMedia"
                            i-fluent-pause-12-filled
                          />
                          <span v-else i-fluent-play-20-filled />
                        </template>
                      </template>
                    </a-button>
                  </template>
                </a-list-item>
              </div>
            </template>
          </UseVirtualList>
        </div>
        <div class="relative z-4 bg-light-1 dark:bg-dark-9 shadow-md w-[calc(100%-2rem)] flex-none transition-all-230 overflow-y-auto overflow-x-hidden h-360px" :class="[showFavoriteList ? '-translate-x-[calc(100%)]' : 'translate-x-[calc(100%)]']">
          <div v-if="!resultsSearchFavoriteStation.length" class="flex items-center justify-center w-full h-full">
            <a-empty>
              <template #image>
                <icon-exclamation-circle-fill />
              </template>
              No Favorite yet, you can add!
            </a-empty>
          </div>
          <div ref="wrapperFavoriteList" class="pt-12">
            <div
              v-for="data in (resultsSearchFavoriteStation.sort((a, b) => a.item.order - b.item.order))" :key="data.refIndex" :data-stationuuid="data.item.stationuuid" :data-order="data.item.order"
              flex items-center style="height: 65px" class="station b-b border-dark-1/5 dark:border-light-1/5 bg-light-1 dark:bg-dark-9"
              :class="[stationInPlay?.stationuuid === data.item.stationuuid ? '!bg-blue-5/5' : '', data?.item?.srcHasError && '!bg-red-4/10']"
            >
              <a-list-item class="px-2 [&_.arco-list-item-action>_li:not(:last-child)]:mr-1">
                <a-list-item-meta
                  :title="data.item?.name"
                  class="[&_.arco-list-item-meta-content]:inline-grid [&_.arco-list-item-meta-content>div]:truncate"
                >
                  <template #description>
                    {{ data.item?.homepage }}
                  </template>
                  <template #avatar>
                    <span class="w-14 h-14 flex p-1 justify-center content-center">
                      <UseImage :src="data.item?.favicon" class="transition-all">
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
                  <span v-if="data.item?.srcHasError" w-full h-full flex items-center mr-1>
                    <span class="text-red" i-fluent-info-16-regular />
                  </span>
                  <span class="handle" w-full h-full flex items-center mr-1>
                    <span class="text-blue" i-fluent-text-direction-horizontal-left-20-regular />
                  </span>
                  <a-button
                    shape="circle" size="small" type="text"
                    @click="() => { !showFavoriteList ? (savedStationsIDB.some((i) => i.stationuuid === data.item?.stationuuid) ? (savedStationsIDB = savedStationsIDB.filter((i) => i.stationuuid !== data.item?.stationuuid)) : savedStationsIDB.push(data.item)) : (savedStationsIDB = savedStationsIDB.filter((i) => i.stationuuid !== data.item?.stationuuid)) }"
                  >
                    <template #icon>
                      <span
                        v-if="savedStationsIDB.some((i) => i.stationuuid === data.item?.stationuuid)"
                        i-fluent-heart-16-filled class="text-red"
                      />
                      <span v-else i-fluent-heart-16-regular class="text-red" />
                    </template>
                  </a-button>
                  <a-button :disabled="stationInPlay?.stationuuid === data.item?.stationuuid && waiting" shape="circle" size="small" type="text" @click="async() => { stationInPlay?.stationuuid === data.item?.stationuuid ? togglePlayPauseMedia() : (stationInPlay = data.item, commit(), await nextTick(), playPauseMedia = true) }">
                    <template #icon>
                      <span
                        v-if="stationInPlay?.stationuuid === data.item?.stationuuid && waiting"
                        i-line-md-loading-twotone-loop class="text-sm"
                      />
                      <template v-else>
                        <span
                          v-if="(stationInPlay?.stationuuid === data.item?.stationuuid) && playPauseMedia"
                          i-fluent-pause-12-filled
                        />
                        <span v-else i-fluent-play-20-filled />
                      </template>
                    </template>
                  </a-button>
                </template>
              </a-list-item>
            </div>
          </div>
        </div>
        <div class="absolute z-3 w-full h-full top-0 bg-black transition-all-320" :class="[showFavoriteList ? 'opacity-60' : 'opacity-0 invisible pointer-events-none']" @click="() => showFavoriteList = false" />
      </div>
    </div>
    <div
      class="bg-slate-50 text-slate-500 border-slate-2 dark:border-black b-t dark:bg-dark-8 dark:text-slate-200 rounded-b-sm flex items-center py-2 lg:py-1 relative z-15"
    >
      <div class="flex-auto flex items-center justify-evenly">
        <a-button
          shape="circle" class="block !w-8 !h-8 lg:!w-10 lg:!h-10" type="text" aria-label="FavoriteList"
          @click="async () => { inputSearchStation = ''; showStatiosList = true; toggleShowFavoriteList(); await nextTick(); (!showFavoriteList && (stationsListRef?.scrollTo(stationInPlay?.index))) }"
        >
          <template #icon>
            <span v-if="showFavoriteList" i-carbon-search class="" />
            <span v-else i-fluent-clipboard-heart-20-regular class="" />
          </template>
        </a-button>
        <a-button
          shape="circle" class="block !w-8 !h-8 lg:!w-10 lg:!h-10" type="text" aria-label="Previous" :disabled="history.length <= 2 || !canUndo"
          @click="async () => { undo(); inputSearchStation = ''; await nextTick(); stationsListRef?.scrollTo(stationInPlay?.index) }"
        >
          <template #icon>
            <span i-carbon-undo class="" />
          </template>
        </a-button>
      </div>
      <a-button
        :disabled="!stationInPlay || waiting" long
        class="dark:text-slate-1 flex-none -my-4 lg:-my-3 mx-auto !w-16 !h-16 lg:!w-18 lg:!h-18 rounded-full ring-1 ring-slate-900/5 shadow-sm flex items-center justify-center"
        type="primary" shape="circle"
        @click="async () => { (!waiting && togglePlayPauseMedia()); stationsListRef?.scrollTo(stationInPlay?.index) }"
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
          shape="circle" class="block !w-8 !h-8 lg:!w-10 lg:!h-10 xl:block" type="text" aria-label="Next" :disabled="!canRedo"
          @click="async () => { redo(); inputSearchStation = ''; await nextTick(); stationsListRef?.scrollTo(stationInPlay?.index) }"
        >
          <template #icon>
            <span i-carbon-redo class="" />
          </template>
        </a-button>
        <a-button
          shape="circle" class="block !w-8 !h-8 lg:!w-10 lg:!h-10" type="text" aria-label="List"
          @click="() => { showFavoriteList = false; toggleShowStatiosList() }"
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
