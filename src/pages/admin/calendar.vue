<script setup lang="ts">
import { mdAndSmaller, userLang } from '~/common/stores'

const vHScrollContainerRef = ref<HTMLElement>()
const dayPerWeekWidth = ref<number>()
const daysPerWeekRef = ref<HTMLElement>()
const daysPerWeekWidth = ref<number>(0)
const selectedYear = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth())
const selectedDay = ref(new Date().getDate())

const { width } = useElementSize(vHScrollContainerRef)
const { x, y, isScrolling, arrivedState, directions } = useScroll(vHScrollContainerRef)

watchOnce(daysPerWeekRef, async (val) => {
  if (val) {
    await nextTick()
    dayPerWeekWidth.value = val.querySelector('.day:nth-child(1)')?.clientWidth || 0
    val.querySelectorAll('.day').forEach((child) => {
      daysPerWeekWidth.value += Number.parseInt(child.clientWidth, 10)
    })
  }
})

// watch(isScrolling, (val) => {
//   console.log('arrivedState', arrivedState)
//   console.log('dayPerWeekWidth', dayPerWeekWidth.value)
//   console.log('directions', directions)
//   console.log('isScrolling', val)
//   console.log('isScrolling X', x.value)
//   console.log('isScrolling Y', y.value)
//   console.log('width', width.value)
//   console.log('max width scroll: ', daysPerWeekWidth.value - width.value)
//   console.log('width', daysPerWeekWidth.value)
//   console.log('scrollWidth', vHScrollContainerRef.value.scrollWidth - width.value)
// })
const selectedDate = computed(() => {
  return new Date(selectedYear.value, selectedMonth.value, selectedDay.value)
})

const years = computed(() => {
  return Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 10 + i)
})

const months = computed(() => {
  return Array.from({ length: 12 }, (_, i) => useDateFormat(new Date().setMonth(i), 'MMMM', { locales: userLang.value }).value)
})

const days = computed(() => {
  return Array.from({ length: new Date(selectedYear.value, selectedMonth.value + 1, 0).getDate() }, (_, i) => new Date(selectedYear.value, selectedMonth.value, i + 1))
})

const totalYearDays = computed(() => {
  const year = selectedYear.value
  return ((year % 4 === 0 && year % 100 > 0) || year % 400 === 0) ? 366 : 365
})
</script>

<template>
  <CommonPageHeader
    class="mt--14.5 z-0"
    bg-img="https://images.unsplash.com/photo-1687894986611-c116bcb6a400?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    bg-img-dark="https://images.unsplash.com/photo-1687894986611-c116bcb6a400?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    :content-parallax="true"
  >
    <div class="p-0 m--4 mx--6 my--6">
      <div class="flex flex-col">
        <div class="select-none border-b-1px border-zinc-4/25 bg-white/35 dark:bg-black/35 pt-16.5 flex flex-nowrap overflow-auto overflow-y-hidden snap-proximity snap-x w-auto items-center pb-3.5 text-3.8 text-center font-600">
          <span v-for="year in years" :key="year" class="cursor-pointer snap-center block px-0.5 min-w-21 capitalize relative" @click="selectedYear = year">
            <span v-if="year === selectedYear" class="absolute w-2 h-2 right-[calc(50%-0.25rem)] rounded-full bg-blue-5 bottom-0 mx-auto" />
            {{ year }}
          </span>
        </div>
        <div class="select-none border-b-1px border-zinc-4/15 bg-white/15 dark:bg-black/15 grid grid-cols-12 flex flex-nowrap w-full justify-between pb-4 overflow-auto overflow-y-hidden items-center pt-3 text-3.5 text-center font-600">
          <a v-for="(month, index) in months" :key="month" href="javascript;" class="cursor-pointer px-1 w-auto capitalize relative" @click.prevent="selectedMonth = index, selectedDay = 1">
            <span v-if="index === selectedMonth" class="absolute w-2 h-2 right-[calc(50%-0.25rem)] rounded-full bg-blue-5 bottom--1 mx-auto" />
            {{ month }}
          </a>
        </div>
        <h3 class="pl-4 text-2xl/12 capitalize font-semibold">
          {{ useDateFormat(selectedDate, 'MMMM YYYY, DD dddd', { locales: userLang }).value }}
        </h3>
      </div>
    </div>
  </CommonPageHeader>
  <div class="z-2 relative !top-0 top-14.5 bg-light-1 dark:bg-dark-9 flex flex-col">
    <div class="select-none flex flex-nowrap bg-white dark:bg-dark overflow-auto overflow-y-hidden snap-proximity snap-x items-center items-center text-3 text-center font-600">
      <div v-for="(day, index) in days" :key="index" class="p-x1.5 py-2 pb-3 relative text-center snap-center" :class="{ 'pr-2': useDateFormat(day, 'ddd').value === (userLang === 'en-US' ? 'Sat' : 'Sun'), 'pl-2': useDateFormat(day, 'ddd').value === (userLang === 'en-US' ? 'Sun' : 'Sat'), 'bg-blue/10': +useDateFormat(day, 'D').value > selectedDay - 1 && +useDateFormat(day, 'D').value - selectedDay < (mdAndSmaller ? 2 : 7) }">
        <div class="flex flex-col justify-center min-w-11 w-11 capitalize cursor-pointer" @click="() => (selectedDay = +useDateFormat(day, 'DD', { locales: userLang }).value, x = (vHScrollContainerRef.scrollWidth) - ((dayPerWeekWidth * 11) + 40), y = 0)">
          <span class="font-light mb-1 text-slate-400 uppercase">
            {{ useDateFormat(day, 'ddd', { locales: userLang }).value }}
          </span>
          <span class="mx-auto p-1 w-6 h-6 flex items-center justify-center bg-blue-3/10 rounded-full inline-block" :class="{ 'bg-blue-5': +useDateFormat(day, 'DD', { locales: userLang }).value === selectedDay, 'border-1px border-blue-5': useDateFormat(new Date(), 'YYYY-MM-DD', { locales: userLang }).value === useDateFormat(day, 'YYYY-MM-DD', { locales: userLang }).value }">
            {{ useDateFormat(day, 'DD', { locales: userLang }).value }}
          </span>
        </div>
        <span class="hidden absolute w-2 h-2 right-[calc(50%-0.25rem)] rounded-full bg-blue-5 bottom--0.75 mx-auto" />
        <span v-if="useDateFormat(day, 'ddd').value === (userLang === 'en-US' ? 'Sat' : 'Sun')" class="absolute w-1px h-4 bg-blue-5/70 top-[calc(50%-0.5rem)] right--0.5px" />
      </div>
    </div>
    <div class="border-t-1px border-gray-2/20 flex flex-auto relative">
      <div ref="vHScrollContainerRef" class="ml-0 flex flex-nowrap flex-auto content-stretch items-stretch overflow-auto relative min-h-92 h-[calc(100vh-19.4rem)] overflow-auto">
        <div class="time-fixed-side sticky flex flex-col min-w-11 w-11 z-1 left-0 mt-7.2 text-3">
          <span class="w-11 h-7.3 top--7.3 absolute left-0 border-b-1px bg-slate-2/30 dark:bg-slate-8/30  border-zinc-2/30 dark:border-zinc-6/30 border-r-1px backdrop-blur z-1" />
          <div v-for="time in Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' : ''}${i}`)" :key="time" class="min-h-24 text-center bg-slate-2/30 dark:bg-slate-8/30 backdrop-blur border-zinc-3/30 dark:border-zinc-6/30 border-r-1px">
            <span class="block bg-white dark:bg-dark mt--3 text-2.6/3 p-1 sticky top-7" :class="{ hidden: time === '00' }">
              {{ time }} {{ +time < 12 ? 'AM' : 'PM' }}
            </span>
          </div>
        </div>
        <div id="days-per-week" ref="daysPerWeekRef" class="w-full inline-flex relative before-z-4 min-h-0 min-w-0 flex-auto">
          <div v-for="(daysPerWeek, index) in Array.from({ length: mdAndSmaller ? 2 : 7 }, (_, i) => useDateFormat(new Date(selectedYear, selectedMonth, selectedDay + (i - 0)), 'YYYY-MM-DD', { locales: userLang }).value)" :id="`date_id_${daysPerWeek}`" :key="index" class="day min-w-1/2 w-1/2 lg:min-w-1/7 lg:w-1/7 inline-table !h-auto">
            <div class="h-auto w-full">
              <div class="px-0 flex-0 text-3.2/7 uppercase sticky top-0 z-2">
                <span v-if="index === 0" class="w-11 h-7.3 top-0 absolute left--11 border-b-1px border-zinc-4/25 bg-light-5/85 dark:bg-dark-8/85" />
                <div class="px-2 bg-light-5/85 dark:bg-dark-8/85 border-b-1px border-zinc-4/25">
                  {{ useDateFormat(daysPerWeek, 'dddd, DD/MM', { locales: userLang }).value }}
                </div>
              </div>
              <div class="mx-1" :class="{ 'opacity-100': +useDateFormat(daysPerWeek, 'MM', { locales: userLang }).value !== selectedMonth + 1 }">
                <div class="mx-auto w-full text-center bg-blue-5/2">
                  <div v-for="time in Array.from({ length: 24 }, (_, i) => i)" :key="time" class="h-24 flex flex-col relative px-1">
                    <div class="border-b-1px border-blue-6/20 h-1/2 border-dashed">
                      <span />
                    </div>
                    <div class="border-b-1px border-blue-6/40 h-1/2" :class="{ '!border-b-0': time === 23 }">
                      <span />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div hidden>
    {{ useDateFormat(selectedDate, 'MMMM YYYY, DD dddd', { locales: userLang }).value }}
  </div>
</template>

<style lang="less">
</style>

<route lang="yaml">
meta:
  layout: admin
  requiresAuth: true
  adminSidebar:
    title: Calendar
    link: /admin/calendar
    order: 4
    icon: i-carbon-calendar
    childOf: null
    hidden: false
</route>
