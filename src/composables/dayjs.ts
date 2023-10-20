import { useDateFormat } from '@vueuse/core'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import 'dayjs/locale/en'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'
import isBetween from 'dayjs/plugin/isBetween'
import { userLang } from '~/common/stores'

export function useDayjs() {
  dayjs().format()

  function setLang(l: string) {
    dayjs.locale(l)
  }

  dayjs.locale(userLang.value === 'fr-FR' ? 'fr' : 'en')
  dayjs.extend(duration)
  dayjs.extend(utc)
  dayjs.extend(isBetween)

  watch(userLang, (val) => {
    if (val === 'fr-FR')
      dayjs.locale('fr')

    else
      dayjs.locale('en')
  }, { immediate: true })

  return {
    dayjs: dayjs || useDateFormat,
    setLang,
  }
}
