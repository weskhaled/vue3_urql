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
      title: '1/2',
      content: h('div', { class: 'text-left text-white max-w-xl ml-0' }, [h('h1', { class: 'font-bold text-2rem md:text-4rem leading-tight delay-0.5s animate__animated animate__slideInDown' }, 'Hi, I’am Khaled. Proffesional Developer based on Paris 👋'), h('p', { class: 'text-1rem animate__delay-0.5s animate__animated animate__backInUp' }, 'Expert customer support team is all around the globe, ready and excited to help.')]),
      image: {
        screen: '/img/slider-1.jpg',
        thumb: '/img/slider-1.jpg',
      },
    },
    {
      title: '2/2',
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
            <a-button class="!hover:bg-white/10" type="text" size="large" @click="toggleDark()">
              <template #icon>
                <span
                  class="w-6 h-6 mx-1 block text-lg i-line-md-moon-alt-to-sunny-outline-loop-transition dark:i-line-md-moon-twotone-alt-loop"
                />
              </template>
            </a-button>

            <a-button
              class="!hover:bg-white/10 ml-3" type="text" size="large"
              @click.stop="() => sourceTransition = (sourceTransition === 100 ? 0 : 100)"
            >
              <template #icon>
                <span i-line-md-grid-3-twotone class="w-6 h-6 mx-1 block text-lg" />
              </template>
            </a-button>
          </div>
        </div>

        <div
          class="flex transition-height top-20 w-full items-center justify-center bg-light-1/80 dark:bg-zinc-9/70 overflow-hidden"
          :class="{ 'b-t b-zinc-5/20': outputTransition === 100 }"
          :style="{ height: `${((windowHeight - (windowHeight > 500 ? 200 : 0)) * outputTransition) * 0.01}px` }"
        >
          <nav
            class="header-nav-mobile overflow-y-auto m-auto h-full w-full flex items-center justify-center flex-col text-center my-auto gap-4 md:text-3xl/10 text-xl font-semibold p-2"
          >
            <a href="" :class="[outputTransition > 0 ? 'animate__animated animate__fadeInLeft animate__delay-1s opacity-100' : 'duration-0.1s animate__animated animate__fadeOutUp opacity-0']" class="![--animate-delay:0.1s]">
              <span>
                Portfolio
              </span>
            </a>
            <a href="" :class="[outputTransition > 0 ? 'animate__animated animate__fadeInLeft animate__delay-1s opacity-100' : 'duration-0.1s animate__animated animate__fadeOutUp opacity-0']" class="![--animate-delay:0.15s]">
              <span>
                Blog
              </span>
            </a>
            <a href="" :class="[outputTransition > 0 ? 'animate__animated animate__fadeInLeft animate__delay-1s opacity-100' : 'duration-0.1s animate__animated animate__fadeOutUp opacity-0']" class="![--animate-delay:0.2s]">
              <span>
                Contact
              </span>
            </a>
            <a href="" :class="[outputTransition > 0 ? 'animate__animated animate__fadeInLeft animate__delay-1s opacity-100' : 'duration-0.1s animate__animated animate__fadeOutUp opacity-0']" class="![--animate-delay:0.25s]" @click.prevent="router.push('/admin')">
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
              <a-tabs size="large">
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
                      class="pb-5" :slides-per-view="4" :space-between="10" direction="horizontal" :mousewheel="true"
                      :free-mode="true" :grab-cursor="true" :scrollbar="{
                        hide: true,
                      }" :modules="[Scrollbar, Mousewheel, FreeMode]"
                    >
                      <SwiperSlide
                        v-for="(skill, index) in results" :key="index"
                        class="overflow-hidden cursor-pointer group relative backdrop-blur flex justify-center content-center bg-zinc-3/20 p-2 h-20 transition-all hover:(bg-zinc-4/40)"
                      >
                        <span
                          :class="`${skill.item.logo}`" block m-auto p-1 w-12 h-12 transition-all duration-0.2s origin-top
                          class="group-hover:(-translate-y-25% w-12 h-12)"
                        />
                        <span
                          absolute bottom-0 w-full font-mono text-center transition-all leading-4 flex p-2 justify-between
                          items-center
                          class="bg-white/80 dark:(bg-black/80 text-white) translate-y-full group-hover:translate-y-0"
                        >
                          <span>
                            {{ skill.item.title }}
                          </span>
                          <a-progress size="mini" :percent="skill.item.percent" />
                        </span>
                      </SwiperSlide>
                    </Swiper>
                  </div>
                </a-tab-pane>
                <a-tab-pane key="2" title="Client">
                  Content of Tab Panel 2
                </a-tab-pane>
                <a-tab-pane key="3" title="Utils">
                  Content of Tab Panel 3
                </a-tab-pane>
              </a-tabs>
            </div>
          </div>
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
      <section relative z-1>
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
      <footer block pb-px>
        <div class="footer-container py-4 relative z-1 bg-light-2 dark:bg-dark-8">
          <div class="container px-4 mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="">
                <section class="">
                  <h4
                    class="mb-3 uppercase font-semibold flex items-center gap-4 after:h-px after:flex-1 after:bg-zinc-5/20  after:content-['']"
                  >
                    TEXT WIDGET
                  </h4>
                  <div class="textwidget">
                    <span
                      class="inline-block text-lg/5 border-2px border-black dark:border-white font-semibold py-1 px-2"
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
                    class="mb-3 uppercase font-semibold flex items-center gap-4 after:h-px after:flex-1 after:bg-zinc-5/20  after:content-['']"
                  >
                    Latest News
                  </h4>
                  <div class="recent-posts">
                    <a v-for="post in [1, 2]" :key="post" href="#" class="media post mb-3 block">
                      <div class="float-left mr-2">
                        <img class="media-object" alt="" src="/img/forest.jpg" style="width: 70px; height: 60px;">
                      </div>
                      <div class="media-body">
                        <h4 class="media-heading">Top aligned media</h4>
                        <p>Cras sit amet nibh libero, in gravida nulla.</p>
                        <div class="date b-b border-zinc-5/50 text-right mt--3">
                          <span class="text-white bg-black dark:(text-black bg-zinc-1) ml-auto p-1  text-3/5">
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
                      class="mb-3 uppercase font-semibold flex items-center gap-4 after:h-px after:flex-1 after:bg-zinc-5/20  after:content-['']"
                    >
                      Get In Touch
                    </h4>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum commodi quas fuga, voluptatibus.
                    </p>
                    <div class="space10px" />
                    <div class="contact-info">
                      <i class="i-la-map-pin" /> Tunisia St. 14/05 Olivie Oriant City <br>
                      <i class="i-la-phone" />+ (216) 22 35 68 13 <br>
                      <i class="i-la-envelope" /> <a href="first.last@email.com">first.last@email.com</a>
                    </div>
                    <!-- /.widget -->
                    <div class="space10px" />
                    <div class="widget">
                      <h4
                        class="mb-3 uppercase font-semibold flex items-center gap-4 after:h-px after:flex-1 after:bg-zinc-5/20  after:content-['']"
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
                    class="mb-3 uppercase font-semibold flex items-center gap-4 after:h-px after:flex-1 after:bg-zinc-5/20  after:content-['']"
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
        <div class="copyrights bottom-0 z-0 w-auto bg-light-5 dark:bg-dark-9 b-t-px border-zinc-4/15">
          <div class="container mx-auto p-3">
            <div class="grid grid-cols-1 md:grid-cols-2">
              <p class="text-center md:text-left leading-8">
                Copyrights © 2014 All Rights Reserved by Young Inc.
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
    <a-back-top target-container="#wrapper">
      <a-button>UP</a-button>
    </a-back-top>
  </div>
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
    @apply bg-white dark:bg-dark;
    i {
      animation: toTopFromBottom 0.2s forwards;
    }
  }
}
.header-nav-mobile {
  >a {
    @apply block overflow-hidden min-w-full md:min-w-sm p-2;
    &:hover {
      @apply bg-white dark:bg-black block;
      >span {
        @apply block;
        animation: toTopFromBottom 0.2s forwards;
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
</style>

<route lang="yaml">
meta:
  layout: default
  requiresAuth: false
</route>
