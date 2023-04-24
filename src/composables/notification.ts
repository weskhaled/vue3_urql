import { Notification } from '@arco-design/web-vue'

export function useNotification() {
  const { $notification } = getCurrentInstance()?.appContext?.config?.globalProperties

  return {
    notification: $notification || Notification,
  }
}
