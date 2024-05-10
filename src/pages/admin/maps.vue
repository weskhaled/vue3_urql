<script setup lang="ts">
import { Loader } from '@googlemaps/js-api-loader'
import { userLang } from '~/common/stores'

const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY
const { message } = useMessage()
const [valueList, toggleList] = useToggle()
const rangeBudget = ref([10, 20])

const visibleImg = ref(false)
const currentImg = ref(0)
const srcListImgs = ref([])
const optionsPlace = ref([])
const optionsPlaceValue = ref([])
const loadingPlaces = ref(false)
const filters = reactive(
  {
    size: 24,
    from: 0,
    showAllModels: false,
    filterType: 'buy',
    propertyType: ['flat', 'loft', 'castle', 'townhouse'],
    minPrice: 0,
    maxPrice: 0,
    minRooms: 1,
    maxRooms: 3,
    page: 1,
    sortBy: 'relevance',
    sortOrder: 'desc',
    onTheMarket: [true],
    limit: 'glbrHfskJ?kpks@lkcQzyA?rzes@',
    newProperty: false,
    blurInfoType: ['disk', 'exact'],
  })
const url = computed(() => `https://www.bienici.com/realEstateAds.json?filters=${encodeURIComponent(JSON.stringify(
  {
    ...filters,
    from: (filters.page - 1) * filters.size,
    page: filters.page - 1,
    filterType: filters.filterType === 'rent' ? 'rent' : 'buy',
    newProperty: filters.filterType === 'new',
    // minPrice: (rangeBudget.value[0] < rangeBudget.value[1] ? rangeBudget.value[0] : rangeBudget.value[1]) * 2000,
    // maxPrice: (rangeBudget.value[0] > rangeBudget.value[1] ? rangeBudget.value[0] : rangeBudget.value[1]) * 2000,
    zoneIdsByTypes: { zoneIds: optionsPlaceValue.value.map(item => item.extra?.zoneIds) },
  },
))}`)
const { data, isFetching, error } = useFetch(url, { refetch: true }).json()
// watch(() => optionsPlaceValue.value, (newVal) => {
//   console.log('newVal', newVal.map(item => item.extra?.zoneIds))
// })
const loader = new Loader({
  apiKey: `${googleApiKey}`,
  version: 'weekly',
  libraries: ['places'],
})
function mapOptions(google) {
  return {
    // center: {
    //   lat: 48.9005423,
    //   lng: 2.3527788,
    // },
    zoom: 12.5,
    mapTypeControl: false,
    streetViewControl: false,
    center: new google.maps.LatLng(48.9005423, 2.3527788),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    fullscreenControl: false,
  }
}
const googleMapsApi = ref()
const mapRef = ref()
const gMaps = ref()

onMounted(() => {
  loader
    .load()
    .then((google) => {
      googleMapsApi.value = google
      gMaps.value = new google.maps.Map(mapRef.value, mapOptions(google))
    })
    .catch((e) => {
      message.error(e.message)
    })
})
const getPlacesMemoize = useMemoize(
  async (q: string): Promise<any> =>
    useFetch(`https://res.bienici.com/suggest.json?q=${q}`).get().json(),
)
async function handleSearch(value: string) {
  if (value.length < 2) {
    optionsPlace.value = []
    return
  }
  loadingPlaces.value = true
  const { data, error } = await getPlacesMemoize(value)
  loadingPlaces.value = false

  if (error.value)
    return

  optionsPlace.value = data.value?.map(item => ({
    value: item.id,
    label: item.name,
    extra: { postalCodes: item.postalCodes, zoneIds: item.zoneIds[0] },
  }))
}
</script>

<template>
  <section class="mt--14.5 h-[calc(100vh-2.55rem)] relative overflow-hidden">
    <!-- <div class="absolute top-0 w-full h-full z-2 pointer-events-none shadow-zinc-6/40 dark:shadow-zinc-1/40 shadow-[inset_0_8px_8px_-8px_var(--un-shadow-color),inset_0_-8px_8px_-8px_var(--un-shadow-color)]" /> -->
    <div id="maps" ref="mapRef" class="h-full z-1" />
    <div v-if="valueList" class="absolute w-full h-full backdrop-blur backdrop-filter bg-white/75 dark:bg-black/75 z-2 top-0" />
    <div class="flex flex-row-reverse absolute w-full h-full top-0">
      <div
        class="flex flex-col h-full pt-16 top-0 z-3 p-2 transition-all w-full"
        :class="[valueList ? 'md:w-2/2' : 'md:w-1/2']"
      >
        <div
          class="bg-white/95 flex-1 h-full dark:bg-dark-8/95 w-full rounded-1 overflow-hidden shadow-sm shadow-black/10 border-1px border-gray/25 relative"
        >
          <div class="header leading-6.5 bg-slate-1 dark:bg-dark-4 p-2 flex flex-none justify-between">
            <div class="text-3.5">
              {{ filters.filterType === 'rent' ? 'Location' : 'Achat' }} à&nbsp;
              <a-space v-if="optionsPlaceValue.length">
                <a-tag v-for="item in optionsPlaceValue" :key="item.value" size="small">
                  {{ item.label }}
                </a-tag>
              </a-space>
              <span v-else>France</span>
            </div>
            <div class="flex space-x-1 items-center">
              <a-button :type="valueList ? 'text' : 'primary'" size="mini" @click="toggleList()">
                <i class="i-carbon-choropleth-map mr-1" />
                Carte
              </a-button>
              <a-button :type="valueList ? 'primary' : 'text'" size="mini" @click="toggleList()">
                <i class="i-carbon-list mr-1" />
                Liste
              </a-button>
              <a-button type="text" size="mini">
                <i class="i-carbon-image mr-1" />
                Galerie
              </a-button>
            </div>
          </div>
          <div class="content w-full h-[calc(100%-2.65rem)] flex flex-col flex-1 overflow-auto">
            <div class="p-2 pb-0 flex-none">
              <div class="flex space-x-1">
                <a-select v-model="filters.filterType" class="w-2/6" placeholder="Votre projet" allow-clear :bordered="true">
                  <a-option value="rent">
                    Louer
                  </a-option>
                  <a-option value="buy">
                    Acheter
                  </a-option>
                  <a-option value="new">
                    Neuf
                  </a-option>
                </a-select>
                <a-select
                  v-model="optionsPlaceValue" class="w-4/6" placeholder="Saisissez une ville, un code postal ou un département" multiple
                  :scrollbar="true" allow-clear :bordered="true" :loading="loadingPlaces" :filter-option="false" :show-extra-options="false" @search="handleSearch"
                >
                  <a-option v-for="item of optionsPlace" :key="item.value" :value="item" :label="item.label" />
                </a-select>
              </div>
              <div class="flex mt-2 space-x-1">
                <a-select
                  class="w-1/4" :default-value="[]" placeholder="Type de bien" multiple :scrollbar="true"
                  allow-clear
                >
                  <a-option>Maison</a-option>
                  <a-option :tag-props="{ color: 'red' }">
                    Terrain
                  </a-option>
                  <a-option>Loft/atelier/surface</a-option>
                  <a-option>
                    Fonds de commerce
                  </a-option>
                  <a-option>Bâtiment/immeuble</a-option>
                  <a-option>Château</a-option>
                </a-select>
                <a-trigger trigger="click" show-arrow>
                  <a-button class="w-1/4">
                    <span :class="[valueList ? 'inline' : 'hidden']">
                      Budget: &nbsp;
                    </span>
                    <span class="text-3">
                      {{ Intl.NumberFormat(userLang, {
                        style: 'currency', currency: 'EUR',
                      }).format(Math.round((rangeBudget[0] / 50) * 10000)) }} - {{ Intl.NumberFormat(userLang, {
                        style:
                          'currency',
                        currency: 'EUR',
                      }).format(Math.round((rangeBudget[1] / 50) * 10000)) }}
                    </span>
                  </a-button>
                  <template #content>
                    <div class="demo-arrow p-2 w-80">
                      <div class="bg-gray/10 p-1 m--2 text-3.5/7 font-sans">
                        Budget
                      </div>
                      <div class="pt-4">
                        <a-slider
                          v-model="rangeBudget" :default-value="[10, 20]" range
                          :format-tooltip="(value) => `${Intl.NumberFormat(userLang, { style: 'currency', currency: 'EUR' }).format(Math.round((value / 50) * 10000))}`"
                        />
                      </div>
                    </div>
                  </template>
                </a-trigger>
                <a-trigger trigger="click" show-arrow>
                  <a-button class="w-1/4">
                    1 à 3 pièces
                  </a-button>
                  <template #content>
                    <div class="demo-arrow p-2 w-80">
                      <a-empty />
                    </div>
                  </template>
                </a-trigger>
                <a-trigger trigger="click" show-arrow>
                  <a-button class="w-1/4">
                    Surface
                  </a-button>
                  <template #content>
                    <div class="demo-arrow p-2 w-80">
                      <a-empty />
                    </div>
                  </template>
                </a-trigger>
              </div>
              <div class="flex justify-between py-2">
                <a-button type="outline" size="small" class="flex items-center px-1.5">
                  <span>
                    Afficher tous les critères
                  </span>
                  <span class="i-carbon-add w-4 h-5 ml-0.5" />
                </a-button>
                <a-button type="primary" status="danger" size="small" class="px-1.5">
                  <i class="i-carbon-notification mr-1" />
                  Créer une alerte
                </a-button>
              </div>
            </div>
            <div class="bg-white dark:bg-dark-4 flex-1">
              <div class="sticky z-3 top-0 backdrop-blur backdrop-filter bg-neutral-1/90 dark:bg-dark-7/90 shadow-sm shadow-[0_0_0_1px_var(--color-bg-3)]">
                <div class="flex items-center justify-between p-2">
                  <span>
                    {{ data && data?.total || 0 }} biens en France
                  </span>
                  <div class="flex items-center">
                    <span class="flex-none">
                      Trier par: &nbsp;
                    </span>
                    <a-select size="small" placeholder="Pertinence">
                      <a-option>Prix croissant</a-option>
                      <a-option>Prix décroissant</a-option>
                      <a-option>Surface croissante</a-option>
                      <a-option>Surface décroissante</a-option>
                    </a-select>
                  </div>
                </div>
              </div>
              <div class="p-2 pb-0 h-[calc(100%-6.3rem)] relative">
                <div v-if="data && !error && !isFetching" class="h-full">
                  <div class="grid grid-cols-1 gap-2" :class="[valueList ? 'md:grid-cols-4' : 'md:grid-cols-2']">
                    <div v-for="item in data.realEstateAds" :key="item.id">
                      <a-card class="bg-slate-1 dark:bg-black w-full [&>.arco-card-body]:p-2">
                        <template #actions>
                          <span class="icon-hover">
                            <IconThumbUp />
                          </span>
                          <span class="icon-hover">
                            <IconShareInternal />
                          </span>
                          <span class="icon-hover">
                            <IconMore />
                          </span>
                        </template>
                        <template #cover>
                          <a-carousel
                            :style="{
                              width: '100%',
                              height: '200px',
                            }" :auto-play="{ interval: 15000, hoverToPause: true }" indicator-type="dot"
                            show-arrow="hover" animation-name="fade"
                          >
                            <a-carousel-item v-for="(image, index) in item.photos" :key="image.url">
                              <img
                                :src="image.url" :style="{
                                  width: '100%',
                                }" @click="() => {
                                  srcListImgs = item.photos.map((image) => image.url)
                                  currentImg = index
                                  visibleImg = true
                                }"
                              >
                            </a-carousel-item>
                          </a-carousel>
                        </template>
                        <a-card-meta
                          :title="`Appartement ${item.roomsQuantity} pièce ${item.surfaceArea} m²`"
                          :description="`${item.price}€ par mois charges comprises`"
                        >
                          <template #avatar>
                            <div :style="{ display: 'flex', alignItems: 'center', color: '#1D2129' }">
                              <a-avatar :size="24" :style="{ marginRight: '8px' }">
                                <i class="i-carbon-location-filled" />
                              </a-avatar>
                              <a-typography-text>{{ item.postalCode }} {{ item.city }}</a-typography-text>
                            </div>
                          </template>
                        </a-card-meta>
                      </a-card>
                    </div>
                  </div>
                  <div class="flex justify-center py-3">
                    <a-button type="primary" status="danger" size="small" class="px-1.5">
                      <i class="i-carbon-notification mr-1" />
                      Créer une alerte pour cette recherche
                    </a-button>
                  </div>
                </div>
                <div v-if="error" class="h-full z-3">
                  <a-result status="404" :subtitle="error">
                    <template #extra>
                      <a-space>
                        <a-button size="mini" type="primary" @click="() => { filters.page = 1 }">
                          Back
                        </a-button>
                      </a-space>
                    </template>
                  </a-result>
                </div>
                <div v-if="isFetching" class="w-full bg-blue-3/5 h-full z-15 top-0 left-0">
                  <span class="flex justify-center content-center h-full">
                    <span class="m-auto">
                      <span class="mx-auto my-2 block w-8 h-8 i-line-md-loading-twotone-loop" />
                      Loading...
                    </span>
                  </span>
                </div>
                <div class="sticky bottom-0 border-t-1px border-dark/10 dark:border-gray-4/20 z-2 m--2 mt-0 flex justify-end items-center px-3 leading-14 bg-white dark:bg-dark-9">
                  <a-pagination v-model:current="filters.page" v-model:page-size="filters.size" class="flex items-center" :default-current="1" :total="data?.total || 0" size="small" :page-size-options="[24, 52, 100, 200]" :default-page-size="24" show-total show-page-size :disabled="isFetching" @page-size-change="() => { filters.page = 1 }" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <a-image-preview-group v-model:visible="visibleImg" v-model:current="currentImg" infinite :src-list="srcListImgs" />
</template>

<style>
.demo-arrow {
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  background-color: var(--color-bg-popup);
}
</style>

<route lang="yaml">
meta:
  layout: admin
  requiresAuth: true
  adminSidebar:
    title: Maps
    link: /admin/maps
    order: 2
    icon: i-fluent-globe-location-20-regular
    childOf: null
    hidden: false
</route>
