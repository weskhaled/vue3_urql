import { useDateFormat } from '@vueuse/core'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import 'dayjs/locale/en'
import { userLang } from '~/common/stores'

export function useDayjs() {
  dayjs().format()

  function setLang(l: string) {
    dayjs.locale(l)
  }

  dayjs.locale(userLang.value === 'fr-FR' ? 'fr' : 'en')

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
