<script setup lang="ts">
export interface Props {
  event?: Ref<any>
  lang?: string
}
const props = withDefaults(defineProps<Props>(), {
  event: () => ref({}),
  lang: () => 'en-US',
})
defineEmits(['mouseDownHandlerEventMove', 'mouseDownHandlerEventResize'])

function toHHMMSS(sec_num: number) {
  const hours = Math.floor(sec_num / 3600)
  const minutes = Math.floor((sec_num - (hours * 3600)) / 60)
  const seconds = sec_num - (hours * 3600) - (minutes * 60)

  let hoursStr = hours.toString()
  let minutesStr = minutes.toString()
  let secondsStr = seconds.toString()

  if (hours < 10)
    hoursStr = `0${hours}`
  if (minutes < 10)
    minutesStr = `0${minutes}`
  if (seconds < 10)
    secondsStr = `0${seconds}`

  return `${hoursStr}h:${minutesStr}m`
}
// watch(() => props.event, (event) => {
//   console.log('event', event)
// })
</script>

<template>
  <div
    :key="event.id"
    class="event opacity-95 select-none cursor-pointer !absolute top--1px mx-0 px-0 rounded-2px w-[calc(100%-0rem)] overflow-hidden !min-h-22.5px left-0 [&_.arco-resizebox-trigger-icon]:my--4px [&_.arco-resizebox-trigger-icon-wrapper]:bg-blue-9 [&_.arco-icon]:text-white"
  >
    <div class="flex items-center justify-center h-full" :style="{ backgroundColor: props.event.color }">
      <div
        class="flex flex-col text-left text-3/4 w-full select-none overflow-auto h-full justify-between"
      >
        <div class="">
          <div class="bg-black/20 text-white p-1.2">
            <p :title="props.event.title" class="capitalize text-3.5 leading-5 line-clamp-2 mb-1">
              {{ props.event.title }}
            </p>
            <div class="event--date-from-to text-right text-md/4">
              {{ ((start) => useDateFormat(new Date(start), 'HH:mm', {
                locales: props.lang,
              }).value)(props.event.start) }}
              - {{ ((end) => useDateFormat(end, 'HH:mm', { locales: props.lang }).value)(props.event.end) }}
            </div>
          </div>
        </div>
        <div class="text-center mb-1">
          <span class="font-mono text-2.3/3 p-0.3 px-0.7 inline-block bg-dark-7 text-white rounded-1px">
            <span>{{ toHHMMSS(Math.round((props.event.height) * 3600 / 90)) }}</span>
          </span>
        </div>
      </div>
      <div
        class="w-5 h-5 rounded-bl-2px bg-slate-2/50 hover:bg-slate-3 active:bg-slate-3 transition-all delay-0s absolute top-0 right-0 flex items-center cursor-grab active:cursor-grabbing"
        @mousedown="(e) => $emit('mouseDownHandlerEventMove', e)"
      >
        <span i-fluent-drag-20-regular class="w-3.5 h-3.5 mx-auto !text-dark-5" />
      </div>
      <div
        class="w-full h-1 bg-slate-2/50 hover:bg-slate-3 active:bg-slate-3 transition-all delay-0.3s absolute bottom-0 flex items-center cursor-s-resize"
        @mousedown="(e) => $emit('mouseDownHandlerEventResize', e)"
      >
        <span i-fluent-line-horizontal-1-20-filled class="w-4 h-1 mx-auto !text-dark-5" />
      </div>
    </div>
  </div>
</template>

<style lang="less">
</style>
