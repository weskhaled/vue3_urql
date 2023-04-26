import { type UserModule } from '~/types'
import { isAuthenticated } from '~/common/stores'

export const install: UserModule = ({ isClient, router }) => {
  if (isClient) {
    router.beforeEach((to, __from, next) => {
      const { meta } = to
      if (meta.requiresAuth && !isAuthenticated.value)
        next({ name: 'auth-login' })
      else next()
    })
  }
}
