<script setup lang="ts">
import { createApi } from 'unsplash-js'
import TheWindow from '~/components/TheWindow.vue'
// import { Button, Space } from '@arco-design/web-vue'
// import '@arco-design/web-vue/es/button/style/css.js'
// import '@arco-design/web-vue/es/space/style/css.js'

const { notification } = useNotification()
const router = useRouter()
const photos = ref([])

const unsplash = createApi({ accessKey: 'KnusTYrUWihWRDFXPuFh7CWbKy50hwk62obIIsLRH6c' })
unsplash.search.getPhotos({
  query: 'Architecture',
  page: 1,
  perPage: 5,
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
  photos.value = results.map((r, index) => ({
    title: `${index + 1} / ${results.length}`,
    content: index === 1 ? h(TheWindow, { class: `delay-0s animate__animated ${animations[index]}` }) : h('div', { class: 'text-left text-white max-w-lg ml-0' }, [h('h1', { class: `font-bold text-2rem md:text-4rem leading-tight delay-0.5s animate__animated ${animations[index]}` }, 'How can we help you today?'), h('p', { class: 'text-1rem animate__delay-0.5s animate__animated animate__backInUp' }, 'Expert customer support team is all around the globe, ready and excited to help.')]),
    // animationClasses: animations[index],
    image: {
      full: r.urls.full,
      raw: r.urls.raw,
      screen: `${r.urls.raw}&w=900&h=700&fit=crop`,
      thumb: `${r.urls.thumb}`,
    },
  }))
})

onMounted(() => {
  // notification.info({
  //   id: 'onMountedNotif',
  //   title: 'Notification',
  //   content: 'This is a notification!',
  //   duration: 0,
  //   closable: true,
  //   footer: () => h(Space, {}, () => [
  //     h(Button, { size: 'mini', type: 'primary', onClick: () => notification.remove('onMountedNotif') }, () => 'Ok'),
  //     h(Button, { size: 'mini', type: 'secondary', onClick: () => { router.push('/admin') } }, () => 'Go To Admin'),
  //   ]),
  // })
})
</script>

<template>
  <header
    class="home-header top-0 left-0 right-0 z-50 md:transition-all w-full z-10 transition-all transform md:fixed"
    :class="{ 'bg-white/50 dark:bg-dark-900/80 shadow-sm shadow-dark-50/5 backdrop-blur': (windowScrollY > 200) }"
  >
    <div
      class="header-container px-2 container mx-auto flex justify-between items-center transition-all font-sans text-sm md:text-xl font-semibold"
      :class="[windowScrollY > 200 ? 'py-4' : 'py-10']"
    >
      <div class="header-left">
        <a class="header-logo" href="#"><img
          class="header-pic"
          :src="`http://ui8-kalli.herokuapp.com/kalli/img/kalli-${isDark ? 'white' : 'black'}.svg`" width="56" alt="Kalli"
        ></a>
      </div>
      <div class="header-center">
        <nav class="header-nav">
          <a
            class="mx-3 transition-color text-dark-700 hover:(text-dark-200) dark:text-light-200 dark:hover:(text-light-400)"
            href=""
          >Portfolio</a>
          <a
            class="mx-3 transition-color text-dark-700 hover:(text-dark-200) dark:text-light-200 dark:hover:(text-light-400)"
            href=""
          >About</a>
          <a
            class="mx-3 transition-color text-dark-700 hover:(text-dark-200) dark:text-light-200 dark:hover:(text-light-400)"
            href=""
          >Contact</a>
          <a
            class="mx-3 transition-color text-dark-700 hover:(text-dark-200) dark:text-light-200 dark:hover:(text-light-400)"
            href="" @click.prevent="router.push('/admin')"
          >Admin</a>
        </nav>
      </div>
      <div class="header-right flex justify-center text-black dark:text-white">
        <button class="header-action" data-menu-open="">
          <svg class="icon fill-current w-5 h-5 icon-grid" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17">
            <path
              d="M1.5 14c.8 0 1.5.7 1.5 1.5S2.3 17 1.5 17 0 16.3 0 15.5.7 14 1.5 14zm14 0c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5.7-1.5 1.5-1.5zm-7 0c.8 0 1.5.7 1.5 1.5S9.3 17 8.5 17 7 16.3 7 15.5 7.7 14 8.5 14zm-7-7C2.3 7 3 7.7 3 8.5S2.3 10 1.5 10 0 9.3 0 8.5.7 7 1.5 7zm14 0c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5S14 9.3 14 8.5 14.7 7 15.5 7zm-7 0c.8 0 1.5.7 1.5 1.5S9.3 10 8.5 10 7 9.3 7 8.5 7.7 7 8.5 7zm-7-7C2.3 0 3 .7 3 1.5S2.3 3 1.5 3 0 2.3 0 1.5.7 0 1.5 0zm14 0c.8 0 1.5.7 1.5 1.5S16.3 3 15.5 3 14 2.3 14 1.5 14.7 0 15.5 0zm-7 0c.8 0 1.5.7 1.5 1.5S9.3 3 8.5 3 7 2.3 7 1.5 7.7 0 8.5 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  </header>
  <div class="relative font-sans">
    <HeroSlider :grab-cursor="true" class="h-[calc(100vh-8rem)] min-h-400px" :sliders="photos" />
  </div>
  <div class="container mx-auto">
    <article class="prose lg:prose-xl">
      <h1>Garlic bread with cheese: What the science tells us</h1>
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
</template>

<style lang="less">
.arco-notification {
  padding: 8px;
}
</style>

<route lang="yaml">
meta:
  layout: default
  requiresAuth: false
</route>
