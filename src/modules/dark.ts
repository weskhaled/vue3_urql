import { type UserModule } from '~/types'
import { isDark } from '~/composables/dark'

export const install: UserModule = ({ isClient }) => {
  if (isClient) {
    watch(isDark, (val: boolean) => {
      val ? document?.body.setAttribute('arco-theme', 'dark') : document?.body.removeAttribute('arco-theme')
    }, { immediate: true })
  }
}
