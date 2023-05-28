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
    content: h('div', { class: 'text-left text-white max-w-xl px-2' }, [h('h1', { class: 'font-bold text-2rem md:text-3rem leading-tight ![--animate-delay:0.1s] animate__animated animate__slideInDown' }, 'Hi, I’am Khaled. Proffesional Developer based on Paris 👋'), h('p', { class: 'text-4 ![--animate-delay:0.15s] animate__delay-2s animate__animated animate__backInUp' }, 'Expert customer support team is all around the globe, ready and excited to help.')]),
    image: {
      screen: '/img/slider-1.jpg',
      thumb: '/img/slider-1.jpg',
    },
  },
  {
    title: '2/2',
    content: h('div', { class: 'text-left text-white max-w-xl px-2' }, [h('h1', { class: 'font-bold text-2rem md:text-3rem leading-tight ![--animate-delay:0.1s] animate__animated animate__slideInDown' }, 'Hi, I’am Khaled. Proffesional Developer based on Paris 👋'), h('p', { class: 'text-4 ![--animate-delay:0.15s] animate__delay-2s animate__animated animate__backInUp' }, 'Expert customer support team is all around the globe, ready and excited to help.')]),
    image: {
      screen: '/img/slider-2.jpg',
      thumb: '/img/slider-2.jpg',
    },
  },
])
</script>

<template>
  <div>
    <HeroSlider :grab-cursor="true" :options="{ modules: ['pagination'], autoplay: { delay: 30000 } }" class="h-80 min-h-400px" :sliders="sliders" />
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
          <dd class="text-indigo-600 flex items-center dark:text-indigo-400 mr-3">
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
  <div h-180 class="bg-cover mix-blend-multiply dark:mix-blend-lighten dark:bg-top-center dark:rotate-180 bg-top-center bg-[url(https://images.unsplash.com/photo-1470016342826-876ea880d0be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80)] dark:bg-[url(https://images.unsplash.com/photo-1485673634125-0f3ae8fd3209?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80)]" />
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
