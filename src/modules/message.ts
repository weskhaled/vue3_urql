import { Message } from '@arco-design/web-vue'
import { type UserModule } from '~/types'
import '@arco-design/web-vue/es/message/style/css.js'

export const install: UserModule = ({ app, isClient }) => {
  if (isClient) {
    Message.install(app)
    Message._context = app._context
  }
}
