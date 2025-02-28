<script setup lang="ts">
const props = withDefaults(defineProps<{
  bgImg?: string
  bgImgDark?: string
  contentParallax?: boolean
}>(), {
  // here we have default values
  contentParallax: false,
})
const wrapperStyles: any = reactive({
  container: {
    top: '0px',
  },
  hederImage: {
    backgroundPosition: '50% 0',
  },
})

const wrapperRef = ref(null)
const defaultSlotWrappeIsVisible = useElementVisibility(wrapperRef)
const { height: defaultSlotWrapperHeight, top: defaultSlotWrapperTop } = useElementBounding(wrapperRef)

watch(windowScrollY, (val) => {
  if (defaultSlotWrappeIsVisible.value) {
    const percentInView = defaultSlotWrapperHeight.value + val + defaultSlotWrapperTop.value - (val + defaultSlotWrapperHeight.value)
    if (props.contentParallax) {
      wrapperStyles.container.top = `${1 - percentInView * 0.25}px`
      wrapperStyles.container.opacity = `${((percentInView * 0.1) + 100)}%`
    }
    wrapperStyles.hederImage.backgroundPosition = `50% ${percentInView * 0.25}px`
  }
})
</script>

<template>
  <div ref="wrapperRef" class="relative block px-2 md:px-6 bg-zinc-9/10 dark:bg-zinc-8/20 shadow-zinc-6/20 dark:shadow-zinc-5/20 shadow-[inset_0_8px_8px_-8px_var(--un-shadow-color),inset_0_-8px_8px_-8px_var(--un-shadow-color)]">
    <div
      class="opacity-60 z-0 absolute inset-0 w-full h-full bg-cover bg-fixed bg-center bg-no-repeat"
      :style="{ ...wrapperStyles.hederImage, backgroundImage: `url(${isDark ? (props.bgImgDark || props.bgImg) : props.bgImg})` }"
    />
    <div class="relative z-1" :style="{ ...wrapperStyles.container }">
      <slot />
    </div>
  </div>
</template>
