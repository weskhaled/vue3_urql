<script setup lang="ts">
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
// const { message } = useMessage()
// const { width: windowWidth } = useWindowSize()
// const router = useRouter()
const sliders: Ref<any[]> = ref([
  {
    title: '1/2',
    content: h('div', { class: 'text-left max-w-3xl pt-14.5 mt-6' }, [h('p', { class: 'text-4 ![--animate-delay:0.15s] animate__delay-1s animate__animated animate__fadeInUp' }, 'This is just a cover'), h('h1', { class: 'mb-2 font-bold text-lg md:text-2xl leading-tight ![--animate-delay:0.1s] animate__delay-2s animate__animated animate__slideInUp' }, 'Welcome to Page Test')]),
    image: {
      screen: 'https://images.unsplash.com/photo-1645747103867-0669a7eff310?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      screenDark: 'https://images.unsplash.com/photo-1649778457108-4e9a88b5d726?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      thumb: '',
    },
  },
])
</script>

<template>
  <div mt--14.5>
    <HeroSlider :grab-cursor="true" :options="{ modules: [], autoplay: false, containerClass: ['mt-auto !px-5'] }" class="h-auto" :sliders="sliders" />
  </div>
  <div container mx-auto>
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
  <div relative h-180 flex items-center mb--10.25>
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
          class="text-2xl/10 md:text-5xl/20 inline font-extrabold capitalize fill-transparent bg-gradient-to-r from-slate-7 dark:from-slate-1 to-purple-4 dark:to-purple-1 bg-clip-text"
          style="-webkit-text-fill-color: transparent;"
        >
          think big <span font-thin>
            start small!
          </span>
        </h2>
      </div>
    </div>
    <div
      class="h-full pointer-events-none w-full absolute top-0 bg-black right-0 bg-cover mix-blend-multiply dark:mix-blend-lighten opacity-85 dark:rotate-180 bg-top-center
    bg-[url(https://images.unsplash.com/photo-1470016342826-876ea880d0be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80)]
    dark:bg-[url(https://images.unsplash.com/photo-1485673634125-0f3ae8fd3209?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80)]"
    />
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  requiresAuth: true
  adminSidebar:
    title: Boxed
    link: /admin/boxed
    order: 0
    icon: i-carbon-layers
    childOf: admin
    hidden: false
</route>
