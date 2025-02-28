<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { Mousewheel, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { isDark } from '~/composables/dark'
import 'swiper/css'

export interface Props {
  sliders?: any[]
  options?: { modules?: any[]; autoplay: any; containerClass?: string[] }
}

const props = withDefaults(defineProps<Props>(), {
  sliders: () => [],
  options: () => ({ modules: ['pagination'], autoplay: { delay: 350, waitForTransition: true }, grabCursor: true, containerClass: [] }),
})

const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndLarger = breakpoints.greater('sm')
const { counter, reset, pause, resume } = useInterval(props.options.autoplay.delay, { controls: true })
const modules = computed(() => {
  const swiperModules = [Mousewheel]
  props.options?.modules?.includes('navigation') && (swiperModules.push(Navigation))
  props.options?.modules?.includes('pagination') && (swiperModules.push(Pagination))
  return swiperModules
})
const sliderRef = ref()
const swiperSliderTarget = computed(() => sliderRef.value?.el)
const isHovered = useElementHover(swiperSliderTarget)
const activeSlideIndex = ref(0)
const progressWidth = ref(0)
const sliderWrapperRef = ref()
const sliderStyles: any = reactive({
  container: {
    top: '0px',
  },
  hederImage: {
    backgroundPosition: '50% 0',
  },
})
const sliderProgressPercent = useCssVar('--slider-progress-percent', sliderWrapperRef)
const { height: sliderHeight, top: sliderTop } = useElementBounding(sliderWrapperRef)
const sliderContainerIsVisible = useElementVisibility(sliderWrapperRef)
watch(progressWidth, (val) => {
  sliderProgressPercent.value = `${(37.6991 - (val * 37.6991)).toFixed(2)}`
})

function onSwiper(swiper: any) {
  sliderRef.value = swiper
}
watch(isHovered, (val) => {
  if (val) {
    reset()
    pause()
  }
  else {
    resume()
  }
})
watchThrottled(counter, (val) => {
  if (val === props.options.autoplay.delay)
    activeSlideIndex.value + 1 >= props.sliders.length ? sliderRef.value.slideTo(0) : sliderRef.value.slideNext()

  if (val >= props.options.autoplay.delay)
    reset()

  const percent = (val / props.options.autoplay.delay) * 100
  progressWidth.value = +((percent / 100)).toFixed(2)
}, { throttle: 10 })

const pagination = {
  clickable: true,
  renderBullet(index, className) {
    return `
    <span class="${className}" tabindex="0" role="button" aria-label="Go to slide ${index + 1}">
      <div role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="1" class="progress-circle-wrapper" style="width: 12px;height: 12px;"><svg viewBox="0 0 16 16" class="progress-circle-svg"><circle class="progress-circle-bg" fill="none" cx="8" cy="8" r="6" stroke-width="4"></circle><circle class="progress-circle-bar" fill="none" cx="8" cy="8" r="6" stroke-width="4" style="stroke-dasharray: 37.6991; stroke-dashoffset: var(--slider-progress-percent);"></circle></svg></div>
      <span class="tooltip-content"><span class="tooltip-text"><span class="tooltip-inner"><img src="${props.sliders[index]?.image.thumb}" class="img-responsive" style="width: 100%; height: 100%;"></span></span></span>
    </span>`
  },
}
function onSlideChange() {
  const { activeIndex } = sliderRef.value
  activeSlideIndex.value = activeIndex
}
watch(windowScrollY, (val) => {
  if (sliderContainerIsVisible.value) {
    const percentInView = sliderHeight.value + val + sliderTop.value - (val + sliderHeight.value)
    sliderStyles.container.top = `${1 - percentInView * 0.25}px`
    sliderStyles.container.opacity = `${((percentInView * 0.1) + 100)}%`
    sliderStyles.hederImage.backgroundPosition = `50% ${percentInView / 25}%`
  }
})
</script>

<template>
  <Swiper
    ref="sliderWrapperRef" :autoplay="options?.autoplay || false" :allow-touch-move="mdAndLarger" :loop="false"
    :navigation="sliders.length > 1 && options?.modules?.includes('navigation')"
    :pagination="sliders.length > 1 && options?.modules?.includes('pagination') ? pagination : false" :modules="modules"
    class="hero-slider bg-white dark:bg-black"
    :class="[options.grabCursor && '!cursor-grab active:!cursor-grabbing']"
    :slides-per-view="1" :space-between="0"
    :auto-height="false"
    :grab-cursor="true"
    :mousewheel="false"
    @swiper="onSwiper"
    @active-index-change="onSlideChange"
  >
    <SwiperSlide
      v-for="(slide, index) in sliders" :key="index" class="flex h-full relative"
    >
      <header class="justify-center items-center flex w-full">
        <div
          class="z-9 absolute top-0 right-0 w-full h-full bg-black opacity-10 bg-[length:2px_2px]"
          style="background-image: repeating-linear-gradient(45deg, black 25%, transparent 25%, transparent 75%, black 75%, black), repeating-linear-gradient(45deg, black 25%, white 25%, white 75%, black 75%, black);background-position: 0 0, 1px 1px"
        />
        <div
          class="z-9 absolute top-0 right-0 w-full h-full opacity-20"
          style="background: radial-gradient(circle at 55% 60%,#00aaff, #002aff, rgba(144,143,255,1))"
        />
        <div
          class="header-image opacity-70"
          :style="{ ...sliderStyles.hederImage, 'background-image': `url(${isDark ? (slide.image.screenDark || slide.image.screen) : slide.image.screen})` }"
        />
        <div
          class="header-image opacity-70"
          :style="{ ...sliderStyles.hederImage, 'background-image': `url('/img/tinypng.png')` }"
        />

        <div
          class="container mx-auto relative w-full z-10 relative transition-opacity transition-top-50 duration-0s px-8 top-0"
          :class="options.containerClass"
          :style="{ ...sliderStyles.container }"
        >
          <div
            v-show="index === activeSlideIndex"
            :class="{ animate__animated: index === activeSlideIndex }"
          >
            <component :is="slide.content" />
          </div>
        </div>
      </header>
    </SwiperSlide>
    <template v-if="sliders.length > 1">
      <div class="swiper-progressBar">
        <div class="swiper-bar transition-width-300" :style="{ width: `${progressWidth * 100}%` }" />
      </div>
      <nav class="nav-slit">
        <a class="prev" href="javascript:;" @click="activeSlideIndex < 1 ? sliderRef.slideTo(sliders.length) : sliderRef.slidePrev()">
          <span class="icon-wrap">
            <i class="icon i-carbon-chevron-left" />
          </span>
          <div class="">
            <h3 id="title-prev">{{ activeSlideIndex < 1 ? sliders[sliders.length - 1]?.title : sliders[activeSlideIndex
              - 1]?.title }}</h3>
            <img
              id="thumb-prev"
              :src="activeSlideIndex < 1 ? sliders[sliders.length - 1]?.image.thumb : sliders[activeSlideIndex - 1]?.image.thumb"
              alt="Previous thumb"
            >
          </div>
        </a>
        <a class="next" href="javascript:;" @click="activeSlideIndex + 1 >= sliders.length ? sliderRef.slideTo(0) : sliderRef.slideNext()">
          <span class="icon-wrap">
            <i class="icon i-carbon-chevron-right" />
          </span>
          <div class="">
            <h3 id="title-next">{{ activeSlideIndex + 1 >= sliders.length ? sliders[0]?.title : sliders[activeSlideIndex
              + 1]?.title }}</h3>
            <img
              id="thumb-next"
              :src="activeSlideIndex + 1 >= sliders.length ? sliders[0]?.image.thumb : sliders[activeSlideIndex + 1]?.image.thumb"
              alt="Next thumb"
            >
          </div>
        </a>
      </nav>
    </template>
  </Swiper>
</template>

<style lang="less">
.hero-slider {
  @apply bg-black;

  >.swiper-wrapper {
    // @apply !cursor-grab active:!cursor-grabbing;
    &>.swiper-slide>img {
      @apply w-full h-full object-cover;
    }
  }

  .header-image {
    @apply absolute w-full h-full z-0 !bg-cover bg-position-['50px'] left-0 top-0;
    background-position: 50% 0%;
  }

  .swiper-progressBar {
    @apply w-full absolute z-2 left-0 bottom-0 bg-black/50;

    .swiper-bar {
      @apply w-0 max-w-full h-4px bg-blue-7;
    }
  }

  nav.nav-slit {
    min-height: initial;
    background-color: transparent;

    a {
      @apply absolute outline-none block top-1/2 p-1 bg-white/90 dark:bg-black/90 text-black dark:text-white opacity-90 text-left z-55;
      transform: translateY(-50%);
      transition: all 0.4s ease;

      .icon-wrap {
        position: relative;
        display: block;
        padding: 2.55rem 0px;

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
        width: 8.5rem;
        height: 100%;
        background-color: #939a9f;
        transition: transform 0.3s 0.3s;
        perspective: 1000px;

        h3 {
          @apply absolute top-full m-0 py-.5 px-2 w-full bg-white/70 dark:bg-black color-black dark:color-white uppercase text-sm leading-8 font-semibold;
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
  @apply absolute bottom-8 w-full text-center z-11 right-1/2 md:right-4/5 transform translate-x-50% md:translate-x--0% py-2px px-5px rounded-xl w-auto bg-black/75;

  >span.swiper-pagination-bullet {
    @apply relative block float-left m-5px w-2 h-2 rounded-full transition-shadow duration-3 ease;

    &:before {
      @apply absolute content-[''] indent--999em top--1px left--1px w-[calc(100%+2px)] h-[calc(100%+2px)] bg-white outline-none rounded-full cursor-pointer;
    }

    &.swiper-pagination-bullet-active {
      --at-apply: opacity-100 bg-transparent shadow-white;
      // box-shadow: 0 0 0 2px white;

      &:before {
        @apply transform scale-35 bg-white hidden;
      }

      .progress-circle-wrapper {
        @apply !opacity-100;
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

  .progress-circle-wrapper {
    @apply absolute top--2px left--2px opacity-0 transition-opacity duration-200;
  }

  .progress-circle-svg {
    transform: rotate(-90deg);
  }

  .progress-circle-bar {
    stroke: rgba(255, 255, 255, 1);
  }

  .progress-circle-bg {
    stroke: rgba(255, 255, 255, 0.5)
  }
}
</style>
