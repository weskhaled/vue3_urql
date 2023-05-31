import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { availableLocales } from '~/modules/i18n'
import generatedRoutes from '~pages'

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
export const currentUser: Ref<any | null> = ref(null)

export const layoutBoxed: Ref<boolean> = useStorage('layout-boxed', false)
export const sideCollapsed: Ref<boolean> = useStorage('side-collapsed', false)
export const sideHidden: Ref<boolean> = useStorage('side-hidden', true)
export const sideFixed: Ref<boolean> = useStorage('side-fixed', false)

export const breakpoints = useBreakpoints(breakpointsTailwind)
export const mdAndLarger = breakpoints.greaterOrEqual('md')
export const smAndSmaller = breakpoints.smallerOrEqual('sm')
export const mdAndSmaller = breakpoints.smallerOrEqual('md')

export const menuItems = computed(() => {
  const groupedMenu = generatedRoutes.filter(r => r.meta?.adminSidebar).map(r => ({ routeName: r.name, requiresAuth: r.meta?.requiresAuth, path: r.path, ...r.meta?.adminSidebar })).reduce((result, currentValue) => {
  // If an array already present for key, push it to the array. Else create an array and push the object
    (result[currentValue.childOf] = result[currentValue.childOf] || []).push(
      currentValue,
    )
    // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
    return result
  }, {})
  return groupedMenu.null.map(pr => ({
    ...pr,
    children: groupedMenu[pr.routeName] ? ([{ ...{ ...pr, order: 0, childOf: pr.routeName } }, ...groupedMenu[pr.routeName]] || [{ ...{ ...pr, childOf: pr.routeName } }]).sort((a, b) => a.order - b.order) : undefined,
  })).sort((a, b) => a.order - b.order)
})
