<script setup lang="ts">
const { dayjs } = useDayjs()

const mockedEvents = useStorage('mockedEvents', {
  events: [
    {
      id: 1,
      title: 'loerem ipsum dolor sit amet, consectetur adipiscing elit',
      // start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 1, 10).toISOString(),
      start: dayjs().add(0, 'day').hour(2).minute(15).format('YYYY-MM-DD HH:mm:ss'),
      // end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 2, 15).toISOString(),
      end: dayjs().add(0, 'day').hour(4).minute(10).format('YYYY-MM-DD HH:mm:ss'),
      color: '#9d174d',
    },
    {
      id: 2,
      title: 'Event 2',
      start: dayjs().add(1, 'day').hour(3).minute(5).format('YYYY-MM-DD HH:mm:ss'),
      end: dayjs().add(1, 'day').hour(3).minute(55).format('YYYY-MM-DD HH:mm:ss'),
      color: '#0f766e',
    },
    {
      id: 3,
      title: 'Event 3',
      start: dayjs().add(2, 'day').hour(3).minute(25).format('YYYY-MM-DD HH:mm:ss'),
      end: dayjs().add(2, 'day').hour(5).minute(5).format('YYYY-MM-DD HH:mm:ss'),
      color: '#2563eb',
    },
    {
      id: 4,
      title: 'Event 4',
      start: dayjs().add(3, 'day').hour(9).minute(15).format('YYYY-MM-DD HH:mm:ss'),
      end: dayjs().add(3, 'day').hour(13).minute(0).format('YYYY-MM-DD HH:mm:ss'),
      color: '#6d28d9',
    },
  ],
})

const events = computed(() => mockedEvents.value.events)
function eventChanged(event: any) {
  if (!event)
    return

  const id = event.id
  const foundedEvent = mockedEvents.value.events.find((e: any) => e.id === id)

  if (foundedEvent) {
    foundedEvent.start = event.start
    // foundedEvent.end = event.end
    // if (event.duration)
    // console.log('event.duration', event.duration.format('HH:mm:ss'))
    // const duration = dayjs.duration(dayjs(event.end).diff(dayjs(event.start))).asSeconds()
    // console.log('duration', duration)
    // foundedEvent.end = dayjs(event.start).add(event.duration.seconds, 'second').format('YYYY-MM-DD HH:mm:ss')

    // else
    foundedEvent.end = event.end

    // event.duration ? (foundedEvent.end = dayjs(event.start).add(event.duration / 1000, 'second').format('YYYY-MM-DD HH:mm:ss')) : (foundedEvent.end = event.end)
  }
}
onMounted(() => {
  // console.log(dayjs('2023-10-15 02:15').subtract(5, 'minute').isBetween('2023-10-15 01:15', dayjs('2023-10-15 02:15')))
  // const today = dayjs()
  // console.log(dayjs().add(3, 'day').format('YYYY-MM-DD HH:mm:ss'))
})
</script>

<template>
  <CommonCalendar :events="events" @event-changed="eventChanged" />
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
