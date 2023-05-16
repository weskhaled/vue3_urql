<script setup lang="ts">
import { useFuse } from '@vueuse/integrations/useFuse'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { vOnClickOutside } from '@vueuse/components'
import { FreeMode, Mousewheel, Scrollbar } from 'swiper'
import 'swiper/css/scrollbar'
// Import Swiper styles
// import 'swiper/css'

import { createApi } from 'unsplash-js'
import TheWindow from '~/components/TheWindow.vue'

const windowHeight = useWindowSize().height
const inputSkillsSearch = ref('')
const { y: wrapperY } = useScroll(typeof window !== 'undefined' ? window : null, { behavior: 'smooth' })
const { notification } = useNotification()
const router = useRouter()
const photos: Ref<any[]> = ref([])
const sourceTransition = ref(0)

const outputTransition = useTransition(sourceTransition, {
  duration: 200,
})

const unsplash = createApi({ accessKey: 'KnusTYrUWihWRDFXPuFh7CWbKy50hwk62obIIsLRH6c' })
unsplash.search.getPhotos({
  query: 'space',
  page: 1,
  perPage: 3,
  orientation: 'landscape',
  color: isDark.value ? 'black' : 'blue',
}).then((result) => {
  if (result.errors) {
    // handle error here
    return
  }

  // extract total and results array from response
  const { results } = result.response

  // handle success here
  const animations = ['animate__slideInDown', 'animate__bounce', 'animate__backInRight', 'animate__backInLeft', 'animate__fadeInUp']
  photos.value = [
    {
      title: '1 / 2',
      content: h('div', { class: 'text-left text-white max-w-xl ml-0' }, [h('h1', { class: 'font-bold text-2rem md:text-4rem leading-tight ![--animate-delay:0.1s] animate__animated animate__slideInDown' }, 'Hi, I’am Khaled. Proffesional Developer based on Paris 👋'), h('p', { class: 'text-1rem ![--animate-delay:0.15s] animate__delay-2s animate__animated animate__backInUp' }, 'Expert customer support team is all around the globe, ready and excited to help.')]),
      image: {
        screen: '/img/slider-1.jpg',
        thumb: '/img/slider-1.jpg',
      },
    },
    {
      title: '2 / 2',
      content: h(TheWindow, { class: 'delay-0s animate__animated animate__slideInDown' }),
      image: {
        screen: '/img/slider-2.jpg',
        thumb: '/img/slider-2.jpg',
      },
    },
    ...results.map((r, index) => ({
      title: `${index + 1} / ${results.length}`,
      content: index === 1 ? h(TheWindow, { class: `delay-0s animate__animated ${animations[index]}` }) : h('div', { class: 'text-left text-white max-w-xl ml-0' }, [h('h1', { class: `font-bold text-2rem md:text-4rem leading-tight delay-0.5s animate__animated ${animations[index]}` }, 'Hi, I’am Khaled. Proffesional Developer based on Paris 👋'), h('p', { class: 'text-1rem animate__delay-0.5s animate__animated animate__backInUp' }, 'Expert customer support team is all around the globe, ready and excited to help.')]),
      image: {
        full: r.urls.full,
        raw: r.urls.raw,
        screen: `${r.urls.raw}&w=900&h=700&fit=crop`,
        thumb: `${r.urls.thumb}`,
      },
    })),
  ]
})

const skills = ref(
  [
    {
      title: 'Vuejs',
      logo: 'i-logos-vue',
      tags: ['frontend', 'js', 'ts'],
      percent: 0.8,
    },
    {
      title: 'Html5',
      logo: 'i-logos-html-5',
      tags: ['frontend', 'ui/ux', 'html'],
      percent: 0.9,
    },
    {
      title: 'css3',
      logo: 'i-logos-css-3',
      tags: ['frontend', 'ui/ux', 'css'],
      percent: 0.85,
    },
    {
      title: 'Figma',
      logo: 'i-logos-figma',
      tags: ['frontend', 'ui/ux'],
      percent: 0.6,
    },
    {
      title: 'Tailwindcss',
      logo: 'i-logos-tailwindcss-icon',
      tags: ['frontend', 'ui/ux', 'css'],
      percent: 0.8,
    },
    {
      title: 'Sass',
      logo: 'i-logos-sass',
      tags: ['frontend', 'ui/ux', 'css'],
      percent: 0.7,
    },
    {
      title: 'less',
      logo: 'i-logos-less',
      tags: ['frontend', 'ui/ux', 'css'],
      percent: 0.7,
    },
    {
      title: 'Nodejs',
      logo: 'i-logos-nodejs-icon',
      tags: ['backend', 'js', 'ts'],
      percent: 0.7,
    },
    {
      title: 'graphql',
      logo: 'i-logos-graphql',
      tags: ['frontend', 'backend', 'js', 'ts'],
      percent: 0.8,
    },
    {
      title: 'vueUse',
      logo: 'i-logos-vueuse',
      tags: ['frontend', 'js', 'ts'],
      percent: 0.9,
    },
    {
      title: 'VSCode',
      logo: 'i-logos-visual-studio-code',
      tags: ['frontend', 'backend', 'js', 'ts', 'editor'],
      percent: 0.9,
    },
    {
      title: 'Angular',
      logo: 'i-logos-angular-icon',
      tags: ['frontend', 'js', 'ts'],
      percent: 0.7,
    },
    {
      title: 'unocss',
      logo: 'i-logos-unocss',
      tags: ['frontend', 'css', 'sass'],
      percent: 0.8,
    },
    {
      title: 'Axios',
      logo: 'i-logos-axios',
      tags: ['frontend', 'backend', 'js', 'ts'],
      percent: 0.8,
    },
    {
      title: 'Nestjs',
      logo: 'i-logos-nestjs',
      tags: ['backend', 'js', 'ts'],
      percent: 0.75,
    },
    {
      title: 'postgresql',
      logo: 'i-logos-postgresql',
      tags: ['backend', 'database'],
      percent: 0.7,
    },
    {
      title: 'postman',
      logo: 'i-logos-postman',
      tags: ['backend', 'test', 'api'],
      percent: 0.6,
    },
    {
      title: 'aws-amplify',
      logo: 'i-logos-aws-amplify',
      tags: ['backend', 'js', 'ts', 'graphql'],
      percent: 0.6,
    },
    {
      title: 'aws-lambda',
      logo: 'i-logos-aws-lambda',
      tags: ['backend', 'js', 'ts', 'lambda', 'aws'],
      percent: 0.55,
    },
    {
      title: 'aws-s3',
      logo: 'i-logos-aws-s3',
      tags: ['backend', 'js', 'ts', 's3', 'aws'],
      percent: 0.6,
    },
    {
      title: 'docker',
      logo: 'i-logos-docker-icon',
      tags: ['backend', 'frontend', 'docker'],
      percent: 0.6,
    },
  ])
const { results } = useFuse(inputSkillsSearch, skills, {
  fuseOptions: {
    keys: ['title', 'tags'],
  },
  matchAllWhenSearchEmpty: true,
})
</script>

<template>
  <div bg-cover bg-fixed class="bg-[url(/img/bg-blur.jpg)] bg-opacity-50">
    <div id="wrapper" class="arco-theme-2 relative container-full mx-auto shadow-xl">
      <header
        v-on-click-outside="() => sourceTransition = 0" class="home-header relative"
        :class="{ scrolled: (windowScrollY > 200) }"
      >
        <div class="header-container">
          <div class="header-left">
            <a class="header-logo" href="#">
              <!-- <span i-logos-streamlit h-6 w-15 block /> -->
              <span block absolute top-0 flex items-center relative>
                <svg h-10 w-10 viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M291.034 320.468V178.92H356.386V420H262.45L212.892 258.13L172.91 420H112.643L12 133H78.4664L146.737 319.091L184.308 165.831H243.542L291.034 320.468Z"
                    fill="currentColor"
                  />
                  <path
                    d="M290.788 92H357.013V197.083C368.571 192.492 381.132 189.974 394.264 189.974C451.412 189.974 497.738 237.654 497.738 296.469V420H431.515V296.469C431.515 275.296 414.837 258.13 394.264 258.13C373.699 258.13 357.026 275.279 357.013 296.44V420H290.788V92Z"
                    fill="currentColor"
                  />
                  <path d="M435.262 188.112V92H499V188.112H435.262Z" fill="currentColor" />
                </svg>
              </span>
            </a>
          </div>
          <div class="header-center" />
          <div
            class="header-right"
            :class="(windowScrollY > 200) ? '[--primary-6:0,0,0] md:dark:[--primary-6:255,255,255]' : '[--primary-6:0,0,0] md:[--primary-6:255,255,255] dark:[--primary-6:255,255,255]'"
          >
            <a-button class="!hover:bg-zinc-6/30" type="text" size="large" @click.stop="router.push('/auth/login')">
              <template #icon>
                <span class="w-5 h-5 mx-1 block text-lg i-line-md-account" />
              </template>
            </a-button>

            <a-button class="!hover:bg-zinc-6/30 ml-2" type="text" size="large" @click="toggleDark()">
              <template #icon>
                <span
                  class="w-5 h-5 mx-1 block text-lg i-line-md-moon-alt-to-sunny-outline-loop-transition dark:i-line-md-moon-twotone-alt-loop"
                />
              </template>
            </a-button>

            <a-button
              class="!hover:bg-zinc-6/30 ml-2" type="text" size="large"
              @click.stop="async () => sourceTransition = (sourceTransition === 100 ? 0 : 100)"
            >
              <template #icon>
                <span i-line-md-grid-3 class="w-5 h-5 mx-1 block text-lg" />
              </template>
            </a-button>
          </div>
        </div>

        <div
          class="flex transition-height top-20 w-full items-center justify-center bg-light-1/80 dark:bg-zinc-9/70 overflow-hidden"
          :class="{ 'b-t b-zinc-5/20': outputTransition > 0 }"
          :style="{ height: `${((windowHeight - (windowHeight > 500 ? 200 : 0)) * outputTransition) * 0.01}px` }"
        >
          <nav
            class="header-nav-mobile overflow-y-auto m-auto h-full w-full flex items-center justify-center flex-col text-center my-auto gap-4 md:text-3xl/10 text-xl font-semibold p-1"
          >
            <a
              href=""
              :class="[outputTransition === 100 ? 'animate__animated animate__fadeInLeft animate__delay-1s opacity-100' : '![--animate-delay:0.1s] animate__delay-1s duration-0.1s animate__animated animate__fadeOutUp opacity-0']"
              class="![--animate-delay:0.1s]"
            >
              <span>
                Portfolio
              </span>
            </a>
            <a
              href=""
              :class="[outputTransition === 100 ? 'animate__animated animate__fadeInLeft animate__delay-1s opacity-100' : '![--animate-delay:0.15s] animate__delay-1s duration-0.1s animate__animated animate__fadeOutUp opacity-0']"
              class="![--animate-delay:0.15s]"
            >
              <span>
                Blog
              </span>
            </a>
            <a
              href=""
              :class="[outputTransition === 100 ? 'animate__animated animate__fadeInLeft animate__delay-1s opacity-100' : '![--animate-delay:0.2s] animate__delay-1s duration-0.1s animate__animated animate__fadeOutUp opacity-0']"
              class="![--animate-delay:0.2s]"
            >
              <span>
                Contact
              </span>
            </a>
            <a
              href="javascript:;"
              :class="[outputTransition === 100 ? 'animate__animated animate__fadeInLeft animate__delay-1s opacity-100' : '![--animate-delay:0.25s] animate__delay-1s duration-0.1s animate__animated animate__fadeOutUp opacity-0']"
              class="![--animate-delay:0.25s]" @click.prevent="router.push('/auth/login')"
            >
              <span>
                Admin
              </span>
            </a>
          </nav>
        </div>
      </header>
      <section class="relative font-sans">
        <HeroSlider :grab-cursor="true" class="h-[calc(100vh-8rem)] min-h-400px" :sliders="photos" />
      </section>
      <section class="relative">
        <div class="bg-white dark:bg-black">
          <div class="container mx-auto px-4">
            <div
              class="p-5 rounded-2px pt-1 bg-white/80 dark:bg-zinc-9/70 backdrop-blur max-w-xl relative -mt-5 md:-mt-20 z-2 ml-auto m-auto md:mr-0 border-zinc-5/10 border shadow-sm shadow-black/3"
            >
              <button
                class="w-10 h-10 justify-center content-center absolute flex top--6 left--6 bg-blue-6/90 hover:bg-blue-7/90 active:(bg-blue-7/80 border-blue-8) transition-all block z-2 border border-blue-8/20 backdrop-blur"
              >
                <span i-carbon-arrow-down block text-white text-sm m-auto leading-8 class="icon-shadow" />
              </button>
              <a-tabs size="large" default-active-key="2">
                <a-tab-pane key="1" title="Tech">
                  <div>
                    <a-input-search v-model="inputSkillsSearch" placeholder="Please enter something" allow-clear>
                      <template #prefix>
                        <a-button
                          type="text" shape="square" size="small" class="-ml-2.7" @click="notification.success({
                            id: 'your_id',
                            title: 'Success',
                            content: 'Update success!',
                            duration: -1,
                            closable: true,
                          })"
                        >
                          <i i-carbon-add block />
                        </a-button>
                      </template>
                    </a-input-search>
                  </div>
                  <div class="pt-4">
                    <Swiper
                      class="pb-5" :slides-per-view="4" :space-between="10" direction="horizontal"
                      :mousewheel="true" :free-mode="true" :grab-cursor="true" :scrollbar="{
                        hide: true,
                      }" :modules="[Scrollbar, Mousewheel, FreeMode]"
                    >
                      <SwiperSlide
                        v-for="(skill, index) in results" :key="index"
                        class="overflow-hidden cursor-pointer group relative backdrop-blur flex justify-center content-center bg-zinc-3/20 p-2 h-20 transition-all hover:(bg-zinc-4/40)"
                      >
                        <span
                          :class="`${skill.item.logo}`" block m-auto p-1 w-12 h-12 transition-all duration-0.2s
                          origin-top class="group-hover:(-translate-y-25% w-12 h-12)"
                        />
                        <span
                          absolute bottom-0 w-full font-mono text-center transition-all leading-4 flex p-2
                          justify-between items-center
                          class="bg-white/80 dark:(bg-black/80 text-white) translate-y-full group-hover:translate-y-0"
                        >
                          <span>
                            {{ skill.item.title }}
                          </span>
                          <a-progress class="hidden md:block" size="mini" :percent="skill.item.percent" />
                        </span>
                      </SwiperSlide>
                    </Swiper>
                  </div>
                </a-tab-pane>
                <a-tab-pane key="2" title="Clients">
                  <div>
                    <Swiper
                      class="pb-5" :slides-per-view="2" :space-between="10" direction="horizontal"
                      :mousewheel="true" :free-mode="true" :grab-cursor="true" :scrollbar="{
                        hide: true,
                      }" :modules="[Scrollbar, Mousewheel, FreeMode]"
                    >
                      <SwiperSlide
                        class="overflow-hidden flex items-center cursor-pointer group relative backdrop-blur flex justify-center content-center bg-zinc-3/20 p-2 h-20 transition-all hover:(bg-zinc-4/40)"
                      >
                        <div>
                          <span
                            class="inline-block text-4/5 border-2px border-black dark:border-white font-semibold py-1 px-2"
                          >
                            <span class="font-light">
                              WE</span>BRAND
                          </span>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide
                        class="overflow-hidden flex items-center cursor-pointer group relative backdrop-blur flex justify-center content-center bg-zinc-3/20 p-2 h-20 transition-all hover:(bg-zinc-4/40)"
                      >
                        <div>
                          <span class="uppercase inline-block text-4/6 py-1 px-2 font-semibold">
                            <span font-light>First</span>Design
                          </span>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide
                        class="overflow-hidden flex items-center cursor-pointer group relative backdrop-blur flex justify-center content-center bg-zinc-3/20 p-2 h-20 transition-all hover:(bg-zinc-4/40)"
                      >
                        <div>
                          <span class="uppercase inline-block text-3/5 py-1 px-2 relative">
                            <span
                              i-carbon-deployment-unit-presentation inline-block text-8 absolute
                              class="top--1.5 left--4"
                            />
                            ALAIS D'OPTIQUE
                          </span>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide
                        class="overflow-hidden flex items-center cursor-pointer group relative backdrop-blur flex justify-center content-center bg-zinc-3/20 p-2 h-20 transition-all hover:(bg-zinc-4/40)"
                      >
                        <div>
                          <sup class="text-1.5 top--3">Tunisian</sup>
                          <span text-xl>
                            <span
                              font-light
                              style="-webkit-text-fill-color: transparent;background: -webkit-linear-gradient( 120deg, #00aaff 30%, #00eeff );-webkit-background-clip: text;"
                            >Aero</span>
                            <span
                              font-500
                              style="-webkit-text-fill-color: transparent;background: -webkit-linear-gradient( 120deg, #ff8c00 20%, #ffdd00 );-webkit-background-clip: text;"
                            >DAY</span>
                          </span>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide
                        class="overflow-hidden flex items-center cursor-pointer group relative backdrop-blur flex justify-center content-center bg-zinc-3/20 p-2 h-20 transition-all hover:(bg-zinc-4/40)"
                      >
                        <div>
                          <span text-xl>
                            <span
                              font-mono inline font-bold text-6
                              style="-webkit-text-fill-color: transparent;background: -webkit-linear-gradient( 45deg, #0037ff 50%, #008cff );-webkit-background-clip: text;"
                            >Core.AI</span>
                            <sup class="uppercase text-5.1 text-blue-7">+</sup>
                          </span>
                        </div>
                      </SwiperSlide>
                    </swiper>
                  </div>
                </a-tab-pane>
              </a-tabs>
            </div>
          </div>
        </div>
      </section>
      <section bg-white dark:bg-black relative z-1>
        <div class="container max-w-3xl mx-auto p-4 mx">
          <UseElementVisibility v-slot="{ isVisible }">
            <div flex items-center mb-3>
              <a-avatar
                :size="32"
                :class="[isVisible ? 'animate__animated animate__fadeInUp animate__delay-0s opacity-100' : 'opacity-0']"
              >
                <img
                  alt="avatar"
                  src="https://weskhaled.vercel.app/assets/img/photos/developer/avatar-sm.jpg"
                >
              </a-avatar>
              <span
                id="typed" ml-2 text-lg inline-block font-light
                :class="[isVisible ? 'animate__animated animate__fadeInRight animate__delay-0s opacity-100' : 'opacity-0']"
              >
                Here you will find my resume...
              </span>
            </div>
          </UseElementVisibility>
          <div py-4>
            <h3 class="text-lg font-semibold md:text-3xl/10 mb-3 font-script">
              I'm Khaled, 33 years old Full-Stack JS/TS developer based in Paris.
            </h3>
            <p class="text-xl/10 font-mono mb-2">
              Hard-working, designer and developer offering excellent work ethic, enthusiasm and adaptability with
              experience in graphic design, frontend, backend and AWS development.
            </p>
            <h3
              class="my-8 text-xl font-semibold flex items-center gap-4 before:h-px before:flex-1 before:bg-zinc-4/20  before:content-[''] after:h-px after:flex-1 after:bg-zinc-4/20  after:content-['']"
            >
              Skills & Abilities
            </h3>
            <div max-w-lg mx-auto mb-20>
              <div mb-4>
                <span text-xs block mb--3>HTML & CSS</span>
                <a-progress
                  :percent="0.95" :color="{
                    '0%': 'rgb(var(--primary-6))',
                    '100%': 'rgb(var(--success-6))',
                  }"
                />
              </div>
              <div mb-4>
                <span text-xs block mb--3>NodeJs</span>
                <a-progress
                  :percent="0.8" :color="{
                    '0%': 'rgb(var(--primary-6))',
                    '100%': 'rgb(var(--success-6))',
                  }"
                />
              </div>
              <div mb-4>
                <span text-xs block mb--3>VueJs</span>
                <a-progress
                  :percent="0.9" :color="{
                    '0%': 'rgb(var(--primary-6))',
                    '100%': 'rgb(var(--success-6))',
                  }"
                />
              </div>
              <div mb-4>
                <span text-xs block mb--3>Angular</span>
                <a-progress
                  :percent="0.85" :color="{
                    '0%': 'rgb(var(--primary-6))',
                    '100%': 'rgb(var(--success-6))',
                  }"
                />
              </div>
              <div mb-4>
                <span text-xs block mb--3>Figma</span>
                <a-progress
                  :percent="0.75" :color="{
                    '0%': 'rgb(var(--primary-6))',
                    '100%': 'rgb(var(--success-6))',
                  }"
                />
              </div>
            </div>
            <h3
              class="my-8 text-xl font-semibold flex items-center gap-4 before:h-px before:flex-1 before:bg-zinc-4/20  before:content-[''] after:h-px after:flex-1 after:bg-zinc-4/20  after:content-['']"
            >
              Jobs & Education
            </h3>
            <div>
              <a-timeline mode="alternate" label-position="relative">
                <a-timeline-item label="2012">
                  L3 – Développement des SI
                  <span block font-mono text-xs>
                    Institut Sup. Technologie, Tunisie
                  </span>
                </a-timeline-item>
                <a-timeline-item label="2015" label-position="same">
                  M2 – Master en logiciels libres
                  <span block font-mono text-xs>
                    Institut Sup. Informatique, Tunisie
                  </span>
                </a-timeline-item>
                <a-timeline-item label="2014-09 / 2016-02" position="bottom">
                  Junior Front-end Developer
                  <span block font-mono text-xs>
                    DevFuture
                  </span>
                </a-timeline-item>
                <a-timeline-item label="2016-02 / 2019-01" label-position="same">
                  Front-end Developer
                  <span block font-mono text-xs>
                    Peaksource
                  </span>
                </a-timeline-item>
                <a-timeline-item label="2019-01 / 2021-05" label-position="same">
                  Full-Stack Js/Ts Developer
                  <span block font-mono text-xs>
                    Sclable Business Solutions<span class="bg-zinc-4/30 px-0.3">GmbH</span>
                  </span>
                </a-timeline-item>
                <a-timeline-item label="2021-05 / 2022-06" label-position="same">
                  Full-Stack Js/Ts, AWS Developer
                  <span block font-mono text-xs>
                    Ticketchainer
                  </span>
                </a-timeline-item>
                <a-timeline-item label="2022-06 / Current" label-position="same">
                  <template #dot>
                    <span class="h-1.5 w-1.5 rounded-full bg-blue-500 relative">
                      <span
                        class="absolute animate-ping inline-flex top--0.25 left--0.25 h-2 w-2 rounded-full bg-sky-400 opacity-75"
                      />
                    </span>
                  </template>
                  Full-Stack Js/Ts Developer
                  <span block font-mono text-xs>
                    SOFTEAM
                  </span>
                </a-timeline-item>
              </a-timeline>
            </div>
          </div>
        </div>
      </section>
      <section shadow-inner>
        <div class="container md:max-w-2xl mx-auto py-12 relative">
          <div
            class="absolute top--10 -left-10 w-100 h-100 bg-blue-3 rounded-full mix-blend-multiply filter blur-xl opacity-35 z--0 animate-blob"
          />
          <div
            class="absolute top-0 -right-5 w-100 h-100 bg-teal-3 rounded-full mix-blend-multiply filter blur-xl opacity-35 z--0 animate-blob animation-delay-2000"
          />
          <div
            class="absolute -bottom-8 left-32 w-100 h-100 bg-cyan-2 rounded-full mix-blend-multiply filter blur-xl opacity-35 z--0 animate-blob animation-delay-4000"
          />
          <UseElementVisibility v-slot="{ isVisible }">
            <div :class="[isVisible ? 'animate__animated animate__fadeInUp opacity-100' : 'opacity-0']" class="bg-zinc-1/40 border-1px border-zinc-1/20 dark:bg-zinc-9/40 backdrop-blur px-4 py-8 rounded-2px">
              <h3
                class="my-1 mb-8 text-xl font-semibold flex items-center gap-4 before:h-px before:flex-1 before:bg-zinc-3/20  before:content-[''] after:h-px after:flex-1 after:bg-zinc-3/20  after:content-['']"
              >
                Technologies & Frameworks
              </h3>
              <ul class="flex space-x-4 text-4xl items-center justify-center overflow-auto [&>li]:grayscale hover:[&>li]:grayscale-0 hover:[&>li]:cursor-pointer">
                <li class="transition-all">
                  <i i-logos-vue />
                </li>
                <li class="">
                  <i i-logos-nodejs />
                </li>
                <li class="">
                  <i i-logos-nestjs />
                </li>
                <li class="">
                  <i i-logos-typescript-icon />
                </li>
                <li class="">
                  <i i-logos-graphql />
                </li>
                <li class="">
                  <i i-logos-tailwindcss-icon />
                </li>
                <li class="">
                  <i i-logos-aws-s3 />
                </li>
                <li class="">
                  <i i-logos-aws-lambda />
                </li>
                <li class="">
                  <i i-logos-aws-amplify />
                </li>
              </ul>
            </div>
          </UseElementVisibility>
        </div>
      </section>
      <section container-full mx-auto relative z-1 bg-white dark:bg-black>
        <div class="container mx-auto px-4">
          <article class="prose mx-auto lg:prose-xl">
            <h1 m-0>
              Garlic bread with cheese: What the science tells us
            </h1>
            <p>
              For years parents have espoused the health benefits of eating garlic bread with cheese to their
              children, with the food earning such an iconic status in our culture that kids will often dress
              up as warm, cheesy loaf for Halloween.
            </p>
            <p>
              But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases
              springing up around the country.
            </p>
            <p>
              For years parents have espoused the health benefits of eating garlic bread with cheese to their
              children, with the food earning such an iconic status in our culture that kids will often dress
              up as warm, cheesy loaf for Halloween.
            </p>
            <p>
              But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases
              springing up around the country.
            </p>
            <p>
              For years parents have espoused the health benefits of eating garlic bread with cheese to their
              children, with the food earning such an iconic status in our culture that kids will often dress
              up as warm, cheesy loaf for Halloween.
            </p>
            <p>
              But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases
              springing up around the country.
            </p>
            <p>
              For years parents have espoused the health benefits of eating garlic bread with cheese to their
              children, with the food earning such an iconic status in our culture that kids will often dress
              up as warm, cheesy loaf for Halloween.
            </p>
            <p>
              But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases
              springing up around the country.
            </p>
            <p>
              For years parents have espoused the health benefits of eating garlic bread with cheese to their
              children, with the food earning such an iconic status in our culture that kids will often dress
              up as warm, cheesy loaf for Halloween.
            </p>
            <p>
              But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases
              springing up around the country.
            </p>
            <p>
              For years parents have espoused the health benefits of eating garlic bread with cheese to their
              children, with the food earning such an iconic status in our culture that kids will often dress
              up as warm, cheesy loaf for Halloween.
            </p>
            <p>
              But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases
              springing up around the country.
            </p>
            <!-- ... -->
          </article>
        </div>
        <div class="mx-auto max-w-lg">
          <TheWindow class="shadow-md shadow-dark-50/10" />
        </div>
        <div class="relative font-sans">
          <HeroSlider :grab-cursor="true" class="h-[calc(50vh)] min-h-500px" :sliders="photos" />
        </div>
      </section>
      <section relative z-1 class="bg-white/5 dark:bg-zinc-9/30 backdrop-blur">
        <p>
          But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases
          springing up around the country.
        </p>
        <p>
          For years parents have espoused the health benefits of eating garlic bread with cheese to their
          children, with the food earning such an iconic status in our culture that kids will often dress
          up as warm, cheesy loaf for Halloween.
        </p>
        <p>
          But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases
          springing up around the country.
        </p>
        <p>
          But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases
          springing up around the country.
        </p>
        <p>
          But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases
          springing up around the country.
        </p>
        <p>
          But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases
          springing up around the country.
        </p>
        <p>
          For years parents have espoused the health benefits of eating garlic bread with cheese to their
          children, with the food earning such an iconic status in our culture that kids will often dress
          up as warm, cheesy loaf for Halloween.
        </p>
        <p>
          But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases
          springing up around the country.
        </p>
        <p>
          For years parents have espoused the health benefits of eating garlic bread with cheese to their
          children, with the food earning such an iconic status in our culture that kids will often dress
          up as warm, cheesy loaf for Halloween.
        </p>
        <p>
          But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases
          springing up around the country.
        </p>
        <p>
          For years parents have espoused the health benefits of eating garlic bread with cheese to their
          children, with the food earning such an iconic status in our culture that kids will often dress
          up as warm, cheesy loaf for Halloween.
        </p>
        <p>
          But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases
          springing up around the country.
        </p>
        <p>
          For years parents have espoused the health benefits of eating garlic bread with cheese to their
          children, with the food earning such an iconic status in our culture that kids will often dress
          up as warm, cheesy loaf for Halloween.
        </p>
        <p>
          But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases
          springing up around the country.
        </p>
        <p>
          For years parents have espoused the health benefits of eating garlic bread with cheese to their
          children, with the food earning such an iconic status in our culture that kids will often dress
          up as warm, cheesy loaf for Halloween.
        </p>
        <p>
          But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases
          springing up around the country.
        </p>
        <p>
          For years parents have espoused the health benefits of eating garlic bread with cheese to their
          children, with the food earning such an iconic status in our culture that kids will often dress
          up as warm, cheesy loaf for Halloween.
        </p>
        <p>
          But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases
          springing up around the country.
        </p>
        <p>
          For years parents have espoused the health benefits of eating garlic bread with cheese to their
          children, with the food earning such an iconic status in our culture that kids will often dress
          up as warm, cheesy loaf for Halloween.
        </p>
        <p>
          But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases
          springing up around the country.
        </p>
      </section>
      <footer block pb-0px>
        <div class="footer-container py-4 relative z-1 bg-light-2 dark:bg-dark-8">
          <div class="container px-4 mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="">
                <section class="">
                  <h4
                    class="my-2 uppercase font-semibold flex items-center gap-4 after:h-px after:flex-1 after:bg-zinc-5/20  after:content-['']"
                  >
                    TEXT WIDGET
                  </h4>
                  <div class="textwidget">
                    <span
                      class="inline-block text-4/5 border-2px uppercase border-black dark:border-white font-semibold py-1 px-2"
                    ><span
                      class="font-light"
                    >WES</span>Khaled</span>
                    <div class="my-2" />
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                      industry's standard dummy text ever since the 1500s.
                    </p>
                  </div>
                </section>
              </div>
              <div class="">
                <section class="widget">
                  <h4
                    class="my-2 uppercase font-semibold flex items-center gap-4 after:h-px after:flex-1 after:bg-zinc-5/20  after:content-['']"
                  >
                    Latest News
                  </h4>
                  <div class="recent-posts">
                    <a v-for="post in [1, 2]" :key="post" href="#" class="media post mb-2 block">
                      <div class="float-left mr-2">
                        <img class="media-object" alt="" src="/img/forest.jpg" style="width: 70px; height: 60px;">
                      </div>
                      <div class="media-body">
                        <h4 class="media-heading">Top aligned media</h4>
                        <p>Cras sit amet nibh libero, in gravida nulla.</p>
                        <div class="date b-b border-zinc-5/50 text-right">
                          <span class="text-white bg-black dark:(text-black bg-zinc-1) p-.7  text-3/3">
                            January 29, 2015
                          </span>
                        </div>
                      </div>
                    </a>
                  </div>
                </section>
              </div>
              <div class="">
                <section class="widget">
                  <div class="">
                    <h4
                      class="my-2 uppercase font-semibold flex items-center gap-4 after:h-px after:flex-1 after:bg-zinc-5/20  after:content-['']"
                    >
                      Get In Touch
                    </h4>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum commodi quas fuga, voluptatibus.
                    </p>
                    <div class="space10px" />
                    <div class="contact-info">
                      <i class="i-la-map-pin" /> France, Paris <br>
                      <i class="i-la-phone" />+ (216) 22 35 68 13 <br>
                      <i class="i-la-envelope" /> <a href="mailto:weskhaled@gmail.com">weskhaled@gmail.com</a>
                    </div>
                    <!-- /.widget -->
                    <div class="space10px" />
                    <div class="widget">
                      <h4
                        class="my-2 uppercase font-semibold flex items-center gap-4 after:h-px after:flex-1 after:bg-zinc-5/20  after:content-['']"
                      >
                        Newsletter
                      </h4>
                      <form id="newsletter" class="input-group" role="form">
                        <a-input placeholder="Please enter something" allow-clear>
                          <template #append>
                            <a-button class="mx--3">
                              <i class="i-la-envelope" />
                            </a-button>
                          </template>
                        </a-input>
                      </form>
                    </div>
                    <!-- /.widget -->
                  </div>
                </section>
              </div>
              <div class="">
                <section class="widget">
                  <h4
                    class="my-2 uppercase font-semibold flex items-center gap-4 after:h-px after:flex-1 after:bg-zinc-5/20  after:content-['']"
                  >
                    tags
                  </h4>
                  <div class="tags">
                    <a-space wrap>
                      <a-tag
                        v-for="(color, index) of [
                          'orangered',
                          'orange',
                          'gold',
                          'lime',
                          'green',
                          'cyan',
                          'blue',
                          'arcoblue',
                          'purple',
                          'pinkpurple',
                          'magenta',
                        ]" :key="index" :color="color" bordered
                      >
                        {{ color }}
                      </a-tag>
                    </a-space>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
        <div class="copyrights bottom-0 z-0 w-full bg-light-5 dark:bg-dark-9 b-t-px border-zinc-4/15">
          <div class="container mx-auto p-3">
            <div class="grid grid-cols-1 md:grid-cols-2">
              <p class="text-center md:text-left leading-8">
                Copyrights © 2023 All Rights Reserved by Young Inc.
              </p>
              <div class="text-center md:text-left">
                <div
                  class="social-icons flex space-x-2 items-center justify-center md:justify-end text-center md:text-right text-xl"
                >
                  <a href="#" class="social-icon">
                    <i class="i-la-facebook-f" />
                  </a>
                  <a href="#" class="social-icon">
                    <i class="i-la-twitter" />
                  </a>
                  <a href="#" class="social-icon">
                    <i class="i-la-pinterest" />
                  </a>
                  <a href="#" class="social-icon">
                    <i class="i-la-github" />
                  </a>
                  <a href="#" class="social-icon">
                    <i class="i-la-linkedin-in" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
  <a-button
    :class="[windowScrollY < 200 && 'translate-y-[calc(100%+50px)]']" type="primary" shape="circle"
    class="transition-all translate-y-0 fixed right-15 bottom-10 z-5" @click="wrapperY = 0"
  >
    <i i-carbon-arrow-up class="" />
  </a-button>
</template>

<style lang="less" scoped>
:deep(.arco-notification) {
  padding: 4px;
}

header.home-header {
  @apply top-0 left-0 right-0 z-50 md:transition-all w-full z-10 transition-all transform md:fixed border-b border-zinc-100/20 dark:border-zinc-700/50 bg-zinc-6/20 dark:bg-black/30;

  .header-container {
    @apply px-4 container mx-auto flex justify-between items-center transition-all font-sans text-sm md:text-4 font-semibold py-1 md:py-8 md:pb-6;

    .header-center {
      @apply hidden md: block;

      nav.header-nav {
        >a {
          @apply mx-2 md:mx-4 transition-color text-zinc-9 md:text-zinc-200 hover:(text-light-500) dark:text-zinc-1;
        }
      }
    }

    .header-left {
      @apply flex justify-center text-zinc-9 md:text-light-700 dark:text-light-700;
    }

    .header-right {
      @apply flex justify-center text-zinc-9 md:text-light-700 dark:text-light-700;
    }
  }

  &.scrolled {
    @apply md:bg-light-900/50 dark:bg-dark-900/80 shadow-sm shadow-dark-50/5 backdrop-blur;

    .header-container {
      @apply py-2;

      .header-center {
        nav.header-nav {
          >a {
            @apply text-zinc-700 dark:text-zinc-3;
          }
        }
      }

      .header-left {
        @apply text-dark-700 dark:text-zinc-3;
      }

      .header-right {
        @apply md:text-dark-700 dark:text-zinc-3;
      }
    }
  }
}

.icon-shadow {
  text-shadow: rgb(0, 153, 230) 1px 1px, rgb(0, 153, 231) 2px 2px, rgb(0, 154, 231) 3px 3px, rgb(0, 154, 232) 4px 4px, rgb(0, 154, 232) 5px 5px, rgb(0, 155, 233) 6px 6px, rgb(0, 155, 233) 7px 7px, rgb(0, 155, 234) 8px 8px, rgb(0, 156, 234) 9px 9px, rgb(0, 156, 235) 10px 10px, rgb(0, 156, 235) 11px 11px, rgb(0, 157, 236) 12px 12px, rgb(0, 157, 236) 13px 13px, rgb(0, 157, 237) 14px 14px, rgb(0, 158, 237) 15px 15px, rgb(0, 158, 238) 16px 16px, rgb(0, 158, 238) 17px 17px, rgb(0, 159, 239) 18px 18px, rgb(0, 159, 239) 19px 19px, rgb(0, 159, 240) 20px 20px, rgb(0, 160, 240) 21px 21px, rgb(0, 160, 241) 22px 22px, rgb(0, 160, 241) 23px 23px, rgb(0, 161, 242) 24px 24px, rgb(0, 161, 242) 25px 25px, rgb(0, 161, 243) 26px 26px, rgb(0, 162, 243) 27px 27px, rgb(0, 162, 244) 28px 28px, rgb(0, 162, 244) 29px 29px, rgb(0, 163, 245) 30px 30px, rgb(0, 163, 245) 31px 31px, rgb(0, 163, 246) 32px 32px, rgb(0, 164, 246) 33px 33px, rgb(0, 164, 247) 34px 34px, rgb(0, 164, 247) 35px 35px, rgb(0, 165, 248) 36px 36px, rgb(0, 165, 248) 37px 37px, rgb(0, 165, 249) 38px 38px, rgb(0, 166, 249) 39px 39px, rgb(0, 166, 250) 40px 40px, rgb(0, 166, 250) 41px 41px, rgb(0, 167, 251) 42px 42px, rgb(0, 167, 251) 43px 43px, rgb(0, 167, 252) 44px 44px, rgb(0, 168, 252) 45px 45px, rgb(0, 168, 253) 46px 46px, rgb(0, 168, 253) 47px 47px, rgb(0, 169, 254) 48px 48px, rgb(0, 169, 254) 49px 49px, rgb(0, 170, 255) 50px 50px;
}

footer .social-icon {
  @apply w-8 h-8 border-2px border-zinc-5/20 rounded-2px overflow-hidden text-3.5 flex items-center justify-center;

  &:hover {
    @apply bg-white dark: bg-dark;

    i {
      animation: toTopFromBottom 0.2s forwards;
    }
  }
}

.header-nav-mobile {
  >a {
    @apply block overflow-hidden min-w-full md:min-w-sm p-1 transition-all;

    &:hover {
      @apply bg-white/75 dark:bg-black/75 block;

      >span {
        @apply block;
        animation: toTopFromBottom 0.3s forwards;
      }
    }
  }
}

@keyframes toTopFromBottom {
  49% {
    transform: translateY(-100%);
  }

  50% {
    opacity: 0;
    transform: translateY(100%);
  }

  51% {
    opacity: 1;
  }
}
.animate-blob {
    animation: blob 7s cubic-bezier(0,0,.2,1) infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }

  33% {
    transform: translate(30px, -50px) scale(1.1);
  }

  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }

  100% {
    transform: tranlate(0px, 0px) scale(1);
  }
}

:deep(.arco-timeline-item-dot-custom) {
  background-color: transparent;
}
</style>

<route lang="yaml">
meta:
  layout: default
  requiresAuth: false
</route>
