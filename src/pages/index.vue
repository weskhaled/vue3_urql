<script setup lang="ts">
import { Button, Space } from '@arco-design/web-vue'
import { createApi } from 'unsplash-js'
import '@arco-design/web-vue/es/button/style/css.js'
import '@arco-design/web-vue/es/space/style/css.js'

const { notification } = useNotification()
const router = useRouter()
const { y: windowScrollY } = useWindowScroll()
const photos = ref([])

const unsplash = createApi({ accessKey: 'KnusTYrUWihWRDFXPuFh7CWbKy50hwk62obIIsLRH6c' })
unsplash.search.getPhotos({
  query: 'architecture',
  page: 1,
  perPage: 10,
  orientation: 'landscape',
  color: isDark.value ? 'black' : 'white',
}).then((result) => {
  // if (result.errors) {
  //   // handle error here
  //   console.log('error occurred: ', result.errors[0])
  // }
  // else {
  const feed = result.response

  // extract total and results array from response
  const { total, results } = feed

  // handle success here
  // console.log(`received ${results.length} photos out of ${total}`)
  // console.log('first photo: ', results[0])
  photos.value = results
  // }
})

onMounted(() => {
  notification.info({
    title: 'Notification',
    content: 'This is a notification!',
    duration: 0,
    closable: true,
    footer: () => h(Space, {}, () => [
      h(Button, { size: 'mini', type: 'primary', onClick: () => notification.remove() }, () => 'Ok'),
      h(Button, { size: 'mini', type: 'secondary', onClick: () => { router.push('/admin') } }, () => 'Go To Admin'),
    ]),
  })
})
</script>

<template>
  <header class="header fixed top-0 w-full z-10 transition-all" :class="{ 'bg-white shadow-md shadow-dark-50/5': (windowScrollY > 200) }">
    <div class="header-container container mx-auto flex justify-between items-center px-4 transition-all" :class="[windowScrollY > 200 ? 'py-4' : 'py-10']">
      <div class="header-left">
        <a class="header-logo" href="#"><img
          class="header-pic"
          src="http://ui8-kalli.herokuapp.com/kalli/img/kalli-black.svg" width="56" alt="Kalli"
        ></a>
      </div>
      <div class="header-center">
        <nav class="header-nav font-sans text-lg font-semibold">
          <a class="mx-3" href="">Portfolio</a>
          <a class="mx-3" href="">About</a>
          <a class="mx-3" href="">Contact</a>
          <a class="mx-3" href="" @click.prevent="router.push('/admin')">Admin</a>
        </nav>
      </div>
      <div class="header-right block text-black">
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
  <div class="min-h-[calc(100vh-200px)] relative font-sans">
    <HeroSlider :grab-cursor="true" class="h-[calc(80vh)]" :sliders="photos" />
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
