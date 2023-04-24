export function useMessage() {
  const { $message } = getCurrentInstance()?.appContext?.config?.globalProperties

  return {
    message: $message || console,
  }
}
