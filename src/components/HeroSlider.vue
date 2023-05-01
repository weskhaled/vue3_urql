<script lang="ts" setup>
import { Autoplay, Navigation, Pagination } from 'swiper'
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'
// Import Swiper styles
import 'swiper/css'

export interface Props {
  sliders?: any[]
  options?: { modules: any[]; autoplay: any }
}

const props = withDefaults(defineProps<Props>(), {
  sliders: () => [],
  options: () => ({ modules: ['pagination'], autoplay: { delay: 999999999, disableOnInteraction: false, pauseOnMouseEnter: true } }),
})
// const { modelValue } = defineModels<{
//   modelValue: string
// }>()
const { y: windowScrollY } = useWindowScroll()

const modules = computed(() => {
  const swiperModules = [Autoplay]
  props.options.modules.includes('navigation') && (swiperModules.push(Navigation))
  props.options.modules.includes('pagination') && (swiperModules.push(Pagination))
  return swiperModules
})
const sliderRef = ref()
const activeSlideIndex = ref(0)
const progresswidth = ref(0)
function onSwiper(swiper: any) {
  sliderRef.value = swiper
}
const pagination = {
  clickable: true,
  renderBullet(index, className) {
    return `<span class="${className}" tabindex="0" role="button" aria-label="Go to slide ${index + 1}"><span class="tooltip-content"><span class="tooltip-text"><span class="tooltip-inner"><img src="${props.sliders[index]?.image.thumb}" class="img-responsive" style="width: 100%; height: 100%;"></span></span></span></span>`
  },
}
function onSlideChange() {
  const { activeIndex } = sliderRef.value
  activeSlideIndex.value = activeIndex
}
</script>

<template>
  <Swiper
    :autoplay="options?.autoplay || false" :navigation="options.modules.includes('navigation')"
    :pagination="options.modules.includes('pagination') ? pagination : false" :modules="modules" class="hero-slider"
    :slides-per-view="1" :space-between="0" @swiper="onSwiper" @slide-change="onSlideChange"
    @autoplay-time-left="(s, time, progress) => progresswidth = 1 - progress"
    @mouse-over="() => sliderRef?.autoplay.pause()"
    @mouse-out="() => sliderRef?.autoplay.resume()"
  >
    <SwiperSlide v-for="(slide, index) in sliders" :key="slide.id" class="bg-blue-300 flex h-full justify-center items-center">
      <header>
        <div class="pattern pattern-1" />
        <div class="pattern back-35-g" />
        <div class="header-image" :style="{ 'background-image': `url(${slide.image.raw}&w=900&h=700&fit=crop)` }" />

        <div class="container">
          <div class="animate__delay-1s transition-opacity delay-0" :class="[index === activeSlideIndex ? `animate__animated ${slide.animationClasses}` : 'opacity-0']">
            <component :is="slide.content" />
          </div>
        </div>
      </header>
      <!-- <UseImage :src="`${slide.image.raw}&w=900&h=700&fit=crop`">
        <template #loading>
          Loading..
        </template>
        <template #error>
          Failed
        </template>
      </UseImage> -->
    </SwiperSlide>

    <div class="swiper-progressBar">
      <div class="swiper-bar" :style="{ width: `${progresswidth * 100}%` }" />
    </div>
    <nav class="nav-slit">
      <a
        class="prev" :class="[`${activeSlideIndex < 1 && '!opacity-20 pointer-events-none'}`]" href="javascript:;"
        @click="sliderRef.slidePrev()"
      >
        <span class="icon-wrap">
          <i class="icon i-carbon-chevron-left" />
        </span>
        <div>
          <h3 id="title-prev">{{ sliders[activeSlideIndex - 1]?.title }}</h3>
          <img id="thumb-prev" :src="sliders[activeSlideIndex - 1]?.image.thumb" alt="Previous thumb">
        </div>
      </a>
      <a
        class="next" :class="[`${activeSlideIndex + 1 >= sliders.length && '!opacity-20 pointer-events-none'}`]"
        href="javascript:;" @click="sliderRef.slideNext()"
      >
        <span class="icon-wrap">
          <i class="icon i-carbon-chevron-right" />
        </span>
        <div>
          <h3 id="title-next">{{ sliders[activeSlideIndex + 1]?.title }}</h3>
          <img id="thumb-next" :src="sliders[activeSlideIndex + 1]?.image.thumb" alt="Next thumb">
        </div>
      </a>
    </nav>
  </Swiper>
</template>

<style lang="less">
.hero-slider {
  >.swiper-wrapper>.swiper-slide>img {
    @apply w-full h-full object-cover;
  }
  .header-image {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    background-position: 50% 0%;
    background-size: cover !important;
  }
  .swiper-progressBar {
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    bottom: 0px;
    left: 0px;
    z-index: 2;

    .swiper-bar {
      width: 0%;
      max-width: 100%;
      height: 4px;
      background: #1f8cef;
    }
  }

  nav.nav-slit {
    min-height: initial;
    background-color: transparent;

    a {
      border: none;
      background-color: #000000;
      padding: 5px;
      color: #fff;
      opacity: 0.9;
      position: absolute;
      top: 50%;
      display: block;
      outline: none;
      text-align: left;
      z-index: 1000;
      transform: translateY(-50%);
      transition: all 0.4s ease;
      position: absolute;
      top: 50%;
      display: block;
      outline: none;
      text-align: left;
      z-index: 1000;
      transform: translateY(-50%);

      .icon-wrap {
        position: relative;
        display: block;
        padding: 3rem 0px;

        i.icon {
          font-size: 1rem;
          display: block;
          margin: 0 auto;
          transition: transform 0.3s 0.3s;
        }
      }

      &.prev {
        left: 0;
        padding-left: 5px;
      }

      &.next {
        right: 0;
        padding-right: 5px;
      }

      div {
        position: absolute;
        top: 0;
        width: 160px;
        height: 100%;
        background-color: #939a9f;
        transition: transform 0.3s 0.3s;
        perspective: 1000px;

        h3 {
          position: absolute;
          top: 100%;
          margin: 0;
          padding: 0 20px;
          width: 100%;
          background: #000;
          color: #fff;
          text-transform: uppercase;
          white-space: nowrap;
          letter-spacing: 1px;
          font-weight: 600;
          font-size: 12px;
          line-height: 30px;
          transition: transform 0.3s;
          transform: rotateX(-90deg);
          transform-origin: 50% 0;
          backface-visibility: hidden;
        }

        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      }

      &.prev div {
        left: 0;
        -webkit-transform: translateX(-100%);
        transform: translateX(-100%);
      }

      &.next div {
        right: 0;
        text-align: right;
        transform: translateX(100%);
      }

      &:hover {
        i {
          transition-delay: 0s;
        }

        h3 {
          transition-delay: 0.6s;
          transform: rotateX(0deg);
        }
      }

      &.prev:hover i {
        transform: translateX(-150%);
      }

      &.next:hover i {
        transform: translateX(150%);
      }

      &:hover div {
        transform: translateX(0);
      }
    }
  }
}

/* Awesome tooltip*/

/* Gap filler */
.swiper-pagination {
  @apply absolute bottom-4 w-full text-center z-11 left-1/2 py-2px px-5px transform translate-x--50% bottom-2 rounded-xl w-auto bg-black/75;

  >span.swiper-pagination-bullet {
    @apply relative block float-left m-5px w-2 h-2 rounded-full transition-shadow duration-3 ease;

    &:before {
      @apply absolute content-[''] indent--999em top--1px left--1px w-[calc(100%+2px)] h-[calc(100%+2px)] bg-white outline-none rounded-full cursor-pointer;
    }

    &.swiper-pagination-bullet-active {
      --at-apply: opacity-100 bg-transparent shadow-white;
      box-shadow: 0 0 0 2px white;

      &:before {
        @apply transform scale-35 bg-white;
      }
    }

    >.tooltip-content {
      @apply after:content-[''] bg-transparent absolute z-99 w-120px text-[#fff] opacity-0 ml--60px cursor-default pointer-events-none transition-opacity duration-300 delay-0.3s mr-0 mt-0 mb-2.5 left-2/4 bottom-full after:h-0 after:w-0 after:absolute after:pointer-events-none after:ml--5px after:border-t-white after:border-solid after:border-transparent after:border-5px after:left-2/4 after:-bottom-2.2;

      span {
        @apply block;
      }

      .tooltip-text {
        @apply overflow-hidden border-b-2px;
        transform: scale3d(0, 1, 1);
        transition: transform 0.3s 0.3s;

        .tooltip-inner {
          @apply max-w-inherit transition-transform duration-300 p-0 rounded-none bg-black;
          transform: translate3d(0, 100%, 0);

          img {
            opacity: .65;
          }
        }
      }
    }

    &:hover {
      .tooltip-content {
        @apply opacity-100 z-999 delay-0;

        .tooltip-text {
          @apply delay-0;
          transform: scale3d(1, 1, 1);

          .tooltip-inner {
            -webkit-transition-delay: 0.3s;
            transition-delay: 0.3s;
            transform: translate3d(0, 0, 0);
          }
        }
      }
    }
  }
}
</style>
