import { Notification } from '@arco-design/web-vue'
import { type UserModule } from '~/types'
import '@arco-design/web-vue/es/notification/style/css.js'

export const install: UserModule = ({ app, isClient }) => {
  if (isClient)
    Notification._context = app._context
}
