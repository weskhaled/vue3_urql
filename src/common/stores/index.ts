import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { availableLocales } from '~/modules/i18n'

function getLanguage() {
  const { language: navigatorLanguage } = useNavigatorLanguage()
  if (!navigatorLanguage.value)
    return 'en-US'
  if ((navigatorLanguage.value.split('-')[1]) && availableLocales.includes(navigatorLanguage.value))
    return navigatorLanguage.value

  if ((!navigatorLanguage.value.split('-')[1]) && availableLocales.map(l => l.split('-')[0]).includes(navigatorLanguage.value))
    return availableLocales[availableLocales.map(l => l.split('-')[0]).findIndex(l => l === navigatorLanguage.value)] || 'en-US'

  return 'en-US'
}
export const userLang = useStorage('user-lang', getLanguage())
export const token: Ref<string | null> = useStorage('token', null)
export const refreshToken: Ref<string | null> = useStorage('refreshToken', null)
export const isAuthenticated = computed(() => token.value && token.value?.length && refreshToken.value && refreshToken.value?.length)
// export const isAuthenticated = computed(() => token.value && token.value?.length)
export const currentUser: Ref<any | null> = ref(null)
export const sideCollapsed: Ref<boolean> = useStorage('side-collapsed', false)
export const breakpoints = useBreakpoints(breakpointsTailwind)
export const mdAndLarger = breakpoints.greater('md')
export const smAndSmaller = breakpoints.smallerOrEqual('sm')
