<script lang="ts" setup>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'
// import required modules
import { Navigation, Pagination } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
// import 'swiper/css/pagination'

export interface Props {
  sliders?: any[]
  options?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  sliders: () => [],
  options: () => ['navigation', 'pagination'],
})

// const { modelValue } = defineModels<{
//   modelValue: string
// }>()

const modules = computed(() => {
  const swiperModules = []
  props.options.includes('navigation') && (swiperModules.push(Navigation))
  props.options.includes('pagination') && (swiperModules.push(Pagination))
  return swiperModules
})
const slider = ref()
function onSwiper(swiper: any) {
  slider.value = swiper
}
const pagination = {
  clickable: true,
  renderBullet(index, className) {
    return `<span class="${className}">${index + 1}</span>`
  },
}
function onSlideChange() {
//   console.log('slide change')
}
</script>

<template>
  <Swiper
    :navigation="true" :pagination="pagination" :modules="modules"
    class="hero-slider" :slides-per-view="1" :space-between="0" @swiper="onSwiper"
    @slide-change="onSlideChange"
  >
    <SwiperSlide v-for="slide in sliders" :key="slide.id" class="bg-blue-300 flex h-full justify-center items-center">
      <UseImage :src="`${slide.urls.raw}&w=900&h=700&fit=crop`">
        <template #loading>
          Loading..
        </template>
        <template #error>
          Failed
        </template>
      </UseImage>
    </SwiperSlide>
  </Swiper>
</template>

<style lang="less">
.hero-slider>.swiper-wrapper>.swiper-slide>img {
  @apply w-full h-full object-cover;
}
.swiper-pagination {
    @apply absolute bottom-4 w-full text-center z-11;
    .swiper-pagination-bullet {
        @apply inline-block cursor-pointer text-white w-5 h-5 text-11px leading-3 p-1 bg-blue-800 hover:bg-blue-400 mx-1 rounded-full;
        &.swiper-pagination-bullet-active{
            @apply bg-blue-500;
        }
    }
}
</style>
