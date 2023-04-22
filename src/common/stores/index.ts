import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

export const userLang = useStorage('user-lang', useNavigatorLanguage().language || 'en-US')
export const token: Ref<string | null> = useStorage('token', null)
export const refreshToken: Ref<string | null> = useStorage('refreshToken', null)
export const isAuthenticated = computed(() => token.value && token.value?.length && refreshToken.value && refreshToken.value?.length)
// export const isAuthenticated = computed(() => token.value && token.value?.length)
export const currentUser: Ref<any | null> = ref(null)
export const sideCollapsed: Ref<boolean> = useStorage('side-collapsed', false)
export const breakpoints = useBreakpoints(breakpointsTailwind)
export const mdAndLarger = breakpoints.greater('md')
export const smAndSmaller = breakpoints.smallerOrEqual('sm')
