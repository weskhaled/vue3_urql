<script setup lang="ts">
// import { promiseTimeout } from '@vueuse/core'
import Event from './Event.vue'
import { mdAndLarger, mdAndSmaller, userLang } from '~/common/stores'

const { y: yMouse } = useMouse()
// const { dayjs } = useDayjs()

const coefficient = 1000 * 60 * 5

let cleanUp: () => void

const durationFromEventHeight = (height: number) => (+(Math.round(height - 2)) * 60 / 90) * 60000

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

  return `${hoursStr}:${minutesStr}:${secondsStr}`
}

function doDatesOverlap(start_1, end_1, start_2, end_2) {
  return Math.max(start_1, start_2) < Math.min(end_1, end_2)
}

const vHScrollContainerRef = ref<HTMLElement>()
const dayPerWeekWidth = ref<number>()
const daysPerWeekRef = ref<HTMLElement>()
const dragHandlerEventResizeRef = ref<HTMLElement>()
const dragHandlerEventMoveRef = ref<HTMLElement>()
const daysPerWeekWidth = ref<number>(0)
const selectedYear = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth())
const selectedDay = ref(new Date().getDate())

const { isOutside } = useMouseInElement(vHScrollContainerRef)

const mockedEvents = [
  {
    id: 1,
    title: 'Event 1',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 1, 10),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 2, 15),
    color: '#9d174d',
  },
  {
    id: 2,
    title: 'Event 2',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 1, 50),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 4, 15),
    color: '#0f766e',
  },
  {
    id: 3,
    title: 'Event 3',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2, 1, 5),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2, 14, 15),
    color: '#2563eb',
  },
  {
    id: 4,
    title: 'Event 4',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3, 3, 5),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3, 4, 15),
    color: '#6d28d9',
  },
]

const { width } = useElementSize(vHScrollContainerRef)
const { x, y, isScrolling, arrivedState, directions } = useScroll(vHScrollContainerRef)

// watchOnce(daysPerWeekRef, async (val) => {
//   if (val) {
//     dayPerWeekWidth.value = val.querySelector('.day:nth-child(1)')?.clientWidth || 0
//     val.querySelectorAll('.day').forEach((child) => {
//       daysPerWeekWidth.value += Number.parseInt(child.clientWidth, 10)
//     })
//   }
// })
const eventsInWeek = computed(() => {
  return mockedEvents.filter((event) => {
    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)
    const eventStartDay = eventStart.getDate()
    const eventEndDay = eventEnd.getDate()
    const eventStartMonth = eventStart.getMonth()
    const eventEndMonth = eventEnd.getMonth()
    const eventStartYear = eventStart.getFullYear()
    const eventEndYear = eventEnd.getFullYear()
    const selectedDate = new Date(selectedYear.value, selectedMonth.value, selectedDay.value)
    const selectedDateDay = selectedDate.getDate()
    const selectedDateMonth = selectedDate.getMonth()
    const selectedDateYear = selectedDate.getFullYear()

    return (
      (eventStartDay >= selectedDateDay && eventEndDay >= (mdAndLarger.value ? 7 : 2) && eventEndDay <= selectedDateDay + (mdAndLarger.value ? 7 : 2))
      && (eventStartMonth >= selectedDateMonth && eventEndMonth <= selectedDateMonth)
      && (eventStartYear >= selectedDateYear && eventEndYear <= selectedDateYear)
    )
  }).map(e => ({ ...e, height: Math.round((e.end.getTime() - e.start.getTime()) / 60000 * 90 / 60) }))
})

const eventsInSelectedWeek = day => eventsInWeek.value.filter(e => useDateFormat(e.start, 'YYYY-MM-DD', { locales: userLang.value }).value === useDateFormat(day, 'YYYY-MM-DD', { locales: userLang.value }).value)

const selectedEventRef = computed(() => {
  const targetClicked = dragHandlerEventMoveRef.value || dragHandlerEventResizeRef.value
  return targetClicked ? targetClicked.closest('.event') as HTMLElement : null
})

const selectedEventByRef = computed({
  get() {
    return selectedEventRef.value ? eventsInWeek.value.find(event => event.id === Number.parseInt(`${selectedEventRef.value?.dataset.event_id}`, 10)) : null
  },
  set(newValue) {
    if (!newValue)
      return

    const fundedEvent = eventsInWeek.value.find(event => event.id === newValue.id)
    if (fundedEvent) {
      fundedEvent.end = newValue?.end
      fundedEvent.height = newValue?.height
    }
  },
})

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

const daysInWeek = computed(() => {
  return Array.from({ length: mdAndLarger.value ? 7 : 2 }, (_, i) => useDateFormat(new Date(selectedYear.value, selectedMonth.value, selectedDay.value + (i - 0)), 'YYYY-MM-DD', { locales: userLang.value }).value)
})

const totalYearDays = computed(() => {
  const year = selectedYear.value
  return ((year % 4 === 0 && year % 100 > 0) || year % 400 === 0) ? 366 : 365
})

watch(dragHandlerEventResizeRef, (val) => {
  if (val && selectedEventRef.value && selectedEventByRef.value && typeof window !== 'undefined') {
    cleanUp = useEventListener(window, 'mousemove', () => {
      if (!selectedEventRef.value || !selectedEventByRef.value)
        return

      const { y: dragHandlerY, height } = useElementBounding(selectedEventRef)

      const { start } = selectedEventByRef.value || { start: new Date() }
      const durationFromEventLength = (+(Math.round(yMouse.value - useWindowScroll().y.value - (dragHandlerY.value - 2))) * 60 / 90) * 60000
      const eventDuration = new Date(Math.round(new Date(start.getTime() + durationFromEventLength).getTime() / coefficient) * coefficient).getTime() - start.getTime()
      selectedEventByRef.value.end = new Date(Math.round(new Date(start.getTime() + durationFromEventLength).getTime() / coefficient) * coefficient)
      selectedEventByRef.value.height = height.value
      selectedEventRef.value.style.setProperty('height', `${eventDuration / 60000 * 90 / 60}px`)
      selectedEventRef.value.classList.add('event--resizing')
      selectedEventRef.value.setAttribute('data-end', `${selectedEventByRef.value.end}`)
    })

    useEventListener(window, 'mouseup', () => {
      cleanUp()
      selectedEventRef.value?.classList.remove('event--resizing')
      dragHandlerEventResizeRef.value = undefined
    })
  }
})

watch(dragHandlerEventMoveRef, (val) => {
  if (val && selectedEventRef.value && selectedEventByRef.value && typeof document !== 'undefined') {
    cleanUp = useEventListener(document, 'mousemove', (e) => {
      if (!selectedEventRef.value || !selectedEventByRef.value)
        return

      vHScrollContainerRef.value?.classList.add('event--moving')
      const target = e.target as HTMLElement

      if (target) {
        const { day_col_time, day_index } = target?.dataset
        const { day_index: selectedEventDayIndex } = selectedEventRef.value?.dataset
        const { id } = selectedEventByRef.value
        if (day_col_time && id && day_index && selectedEventDayIndex) {
          const fundedEvent = eventsInWeek.value.find(event => event.id === id)
          if (fundedEvent) {
            selectedEventRef.value.style.setProperty('z-index', '99')
            const top = `${Math.round((+useDateFormat(new Date(day_col_time.replace('_', ' ')), 'H', { locales: userLang.value }).value * 90) + ((+useDateFormat(new Date(day_col_time.replace('_', ' ')), 'm', { locales: userLang.value }).value * 90) / 60))}px`
            selectedEventRef.value.style.setProperty('top', top)
            fundedEvent.start = new Date(day_col_time.replace('_', ' '))
            fundedEvent.end = new Date(fundedEvent.end.getTime() + (fundedEvent.start.getTime() - selectedEventByRef.value.start.getTime()))
            selectedEventByRef.value.start = new Date(day_col_time.replace('_', ' '))
            selectedEventByRef.value.end = new Date(selectedEventByRef.value.end.getTime() + (fundedEvent.start.getTime() - selectedEventByRef.value.start.getTime()))

            const eventDuration = new Date(Math.round(fundedEvent.start.getTime() - fundedEvent.end.getTime())).getTime()
            // fundedEvent.height = eventDuration / 60000 * 90 / 60
            // selectedEventRef.value.style.setProperty('height', `${eventDuration / 60000 * 90 / 60}px`)
            // console.log(eventDuration)
            // await nextTick()
            selectedEventRef.value.style.setProperty('width', '100%')
            selectedEventRef.value.style.setProperty('left', `calc(${(+day_index - +selectedEventDayIndex) * 100}% + ${(+day_index - +selectedEventDayIndex) * 8}px)`)
            // selectedEventRef.value.dataset.day_index = day_index
          }
        }
      }
    })

    useEventListener(document, 'mouseup', (e) => {
      cleanUp()
      const target = e.target as HTMLElement
      const { day_index } = target?.dataset
      if (
        !selectedEventRef.value
        || !selectedEventByRef.value
        || !target
        || !day_index
        || !selectedEventRef.value?.dataset.day_index
      )
        return

      // console.log(day_index)
      // console.log(selectedEventRef.value)
      selectedEventRef.value.dataset.day_index = day_index
      vHScrollContainerRef.value?.classList.remove('event--moving')
      dragHandlerEventMoveRef.value = undefined
    })
  }
})
watch(isOutside, (val) => {
  if (val && typeof cleanUp === 'function') {
    cleanUp()
    dragHandlerEventResizeRef.value = undefined
    dragHandlerEventMoveRef.value = undefined
  }
})
onMounted(() => {
  // const d = mockedEvents[0].start
  // console.log(dayjs(d).add(3, 'day').format('YYYY-MM-DD HH:mm:ss'))
})
</script>

<template>
  <div class="p-0 bg-slate-2 dark:bg-slate-7">
    <div class="flex flex-col">
      <div
        class="select-none border-b-1px border-zinc-4/25 bg-white/35 dark:bg-black/35 pt-4.5 flex flex-nowrap overflow-auto overflow-y-hidden snap-proximity snap-x w-auto items-center pb-3.5 text-3.2 text-center font-600"
      >
        <span
          v-for="year in years" :key="year"
          class="cursor-pointer snap-center block px-0.5 min-w-21 capitalize relative" @click="selectedYear = year"
        >
          <span
            v-if="year === selectedYear"
            class="absolute w-1 h-1 right-[calc(50%-0.25rem)] rounded-full bg-blue-5 bottom-0 mx-auto"
          />
          {{ year }}
        </span>
      </div>
      <div
        class="select-none border-b-1px border-zinc-4/15 bg-white/15 dark:bg-black/15 grid grid-cols-12 flex flex-nowrap w-full justify-between py-4 px-2 overflow-auto overflow-y-hidden items-center text-3 text-center font-600"
      >
        <a
          v-for="(month, index) in months" :key="month" href="javascript;"
          class="cursor-pointer px-1 w-auto capitalize relative"
          @click.prevent="selectedMonth = index, selectedDay = 1"
        >
          <span
            v-if="index === selectedMonth"
            class="absolute w-1 h-1 right-[calc(50%-0.25rem)] rounded-full bg-blue-5 bottom--1 mx-auto"
          />
          {{ month }}
        </a>
      </div>
      <h3 class="pl-4 text-2xl/12 capitalize font-semibold">
        {{ useDateFormat(selectedDate, 'MMMM YYYY, DD dddd', { locales: userLang }).value }}
      </h3>
    </div>
  </div>
  <div class="z-2 bg-light-1 dark:bg-dark-9 flex flex-col">
    <div
      class="z-9 select-none flex flex-nowrap bg-white dark:bg-black overflow-auto overflow-y-hidden snap-proximity snap-x items-center items-center text-3 text-center font-600"
    >
      <div
        v-for="(day, index) in days" :key="index" class="p-x1.5 py-2 pb-3 relative text-center snap-center"
        :class="{ 'pr-2': useDateFormat(day, 'ddd').value === (userLang === 'en-US' ? 'Sat' : 'Sun'), 'pl-2': useDateFormat(day, 'ddd').value === (userLang === 'en-US' ? 'Sun' : 'Sat'), 'bg-blue/10': +useDateFormat(day, 'D').value > selectedDay - 1 && +useDateFormat(day, 'D').value - selectedDay < (mdAndSmaller ? 2 : 7) }"
      >
        <div
          class="flex flex-col justify-center min-w-11 w-11 capitalize cursor-pointer"
          @click="() => (selectedDay = +useDateFormat(day, 'DD', { locales: userLang }).value, x = (vHScrollContainerRef.scrollWidth) - ((dayPerWeekWidth * 11) + 40), y = 0)"
        >
          <span class="font-light mb-1 text-slate-400 uppercase">
            {{ useDateFormat(day, 'ddd', { locales: userLang }).value }}
          </span>
          <span
            class="mx-auto p-1 w-6 h-6 flex items-center justify-center bg-blue-3/10 rounded-full inline-block"
            :class="{ 'bg-blue-5': +useDateFormat(day, 'DD', { locales: userLang }).value === selectedDay, 'border-1px border-blue-5': useDateFormat(new Date(), 'YYYY-MM-DD', { locales: userLang }).value === useDateFormat(day, 'YYYY-MM-DD', { locales: userLang }).value }"
          >
            {{ useDateFormat(day, 'DD', { locales: userLang }).value }}
          </span>
        </div>
        <span class="hidden absolute w-2 h-2 right-[calc(50%-0.25rem)] rounded-full bg-blue-5 bottom--0.75 mx-auto" />
        <span
          v-if="useDateFormat(day, 'ddd').value === (userLang === 'en-US' ? 'Sat' : 'Sun')"
          class="absolute w-1px h-4 bg-blue-5/70 top-[calc(50%-0.5rem)] right--0.5px"
        />
      </div>
    </div>
    <div class="border-t-0px border-gray-2/20 flex flex-auto relative">
      <div
        ref="vHScrollContainerRef"
        class="calendarVHScrollContainer ml-0 flex flex-nowrap flex-auto content-stretch items-stretch overflow-auto relative min-h-92 h-[calc(100vh-10.3rem)] overflow-auto"
      >
        <div class="time-fixed-side sticky flex flex-col min-w-11 w-11 z-10 left-0 mt-7.2 text-3">
          <span
            class="w-11 h-7.3 top--7.3 absolute left-0 border-b-1px bg-slate-2/30 dark:bg-slate-8/30 border-zinc-2/30 dark:border-zinc-6/30 border-r-1px backdrop-blur z-1"
          />
          <div
            v-for="time in Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' : ''}${i}`)" :key="time"
            class="min-h-90px text-center bg-slate-2/30 dark:bg-slate-8/30 backdrop-blur border-zinc-3/30 dark:border-zinc-6/30 border-r-1px"
          >
            <span
              class="block bg-white dark:bg-dark mt--3 text-2.6/3 p-1 sticky top-7"
              :class="{ hidden: time === '00' }"
            >
              {{ time }} {{ +time < 12 ? 'AM' : 'PM' }} </span>
          </div>
        </div>
        <div
          id="days-per-week" ref="daysPerWeekRef"
          class="w-full inline-flex relative before-z-4 min-h-0 min-w-0 flex-auto"
        >
          <div
            v-for="(dayPerWeek, dayIndex) in daysInWeek" :id="`date_id_${dayPerWeek}`" :key="dayIndex"
            class="day min-w-1/2 w-1/2 lg:min-w-1/7 lg:w-1/7 inline-table !h-auto"
          >
            <div class="h-auto w-full">
              <div class="px-0 flex-0 text-3.2/7 uppercase sticky top-0 z-9999 select-none">
                <span
                  v-if="dayIndex === 0"
                  class="w-11 h-7.2 top-0 absolute left--11 border-b-1px border-zinc-4/25 bg-light-5/85 dark:bg-dark-8/85"
                />
                <div class="px-2 bg-light-5/85 dark:bg-dark-8/85 border-b-1px border-zinc-4/25">
                  {{ useDateFormat(dayPerWeek, 'dddd, DD/MM', { locales: userLang }).value }}
                </div>
              </div>
              <div
                class="mx-1"
                :class="{ 'opacity-100': +useDateFormat(dayPerWeek, 'MM', { locales: userLang }).value !== selectedMonth + 1 }"
              >
                <div class="mx-auto w-full text-center bg-blue-5/2 relative px-1">
                  <Event
                    v-for="(event, indexEvent) in eventsInSelectedWeek(dayPerWeek)"
                    :id="`event_id_${event.id}`"
                    :key="event.id"
                    :event="event"
                    :data-day_index="dayIndex"
                    draggable="false"
                    :style="{
                      top: `${Math.round((+useDateFormat(new Date(event.start), 'H', { locales: userLang }).value * 90) + ((+useDateFormat(new Date(event.start), 'm', { locales: userLang }).value * 90) / 60))}px`,
                      zIndex: indexEvent + 1,
                      height: `${event.height}px`,
                      backgroundColor: event.color,
                      left: `${(100 / (eventsInSelectedWeek(dayPerWeek).filter(e => doDatesOverlap(new Date(event.start), new Date(event.end), new Date(e.start), new Date(e.end))).length * (eventsInSelectedWeek(dayPerWeek).some(e => doDatesOverlap(new Date(event.start), new Date(event.end), new Date(e.start), new Date(e.end))) && eventsInSelectedWeek(dayPerWeek).filter(e => doDatesOverlap(new Date(event.start), new Date(event.end), new Date(e.start), new Date(e.end))).findIndex(e => e.id === event.id) || 0)))}%`,
                      width: `${100 / (eventsInSelectedWeek(dayPerWeek).filter(e => doDatesOverlap(new Date(event.start), new Date(event.end), new Date(e.start), new Date(e.end))).length || 1)}%`,
                    }"
                    :data-event_id="event.id"
                    @mouse-down-handler-event-move="(e) => dragHandlerEventMoveRef = e.target"
                    @mouse-down-handler-event-resize="(e) => dragHandlerEventResizeRef = e.target"
                  />
                  <div
                    v-for="time in Array.from({ length: 24 }, (_, i) => i)" :key="time"
                    class="h-90px flex flex-col relative p-0"
                  >
                    <div
                      :data-day_index="dayIndex"
                      :data-day_col_time="useDateFormat(`${dayPerWeek} ${time}:00:00`, 'YYYY-MM-DD_HH:mm', { locales: userLang }).value"
                      class="border-b-1px border-blue-6/20 h-1/2 border-dashed"
                    >
                      <span />
                    </div>
                    <div
                      :data-day_index="dayIndex"
                      :data-day_col_time="useDateFormat(`${dayPerWeek} ${time}:30:00`, 'YYYY-MM-DD_HH:mm', { locales: userLang }).value"
                      class="border-b-1px border-blue-6/40 h-1/2" :class="{ '!border-b-0': time === 23 }"
                    >
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
.calendarVHScrollContainer {
  &.event--moving {
    .event {
      @apply !pointer-events-none transition-all-200;
    }
  }
}
</style>
