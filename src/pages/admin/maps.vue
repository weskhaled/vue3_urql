<script setup lang="ts">
import { Loader } from '@googlemaps/js-api-loader'

const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY

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
</script>

<template>
  <section class="mt--14.5 h-[calc(100vh-2.5rem)] relative overflow-hidden">
    <div class="absolute top-0 w-full h-full z-2 pointer-events-none shadow-zinc-6/40 dark:shadow-zinc-1/40 shadow-[inset_0_8px_8px_-8px_var(--un-shadow-color),inset_0_-8px_8px_-8px_var(--un-shadow-color)]" />
    <div id="maps" ref="mapRef" class="h-full z-1" />
  </section>
</template>

<route lang="yaml">
meta:
  layout: admin
  requiresAuth: true
  adminSidebar:
    title: Maps
    link: /admin/maps
    order: 2
    icon: i-carbon-choropleth-map
    childOf: null
    hidden: false
</route>
