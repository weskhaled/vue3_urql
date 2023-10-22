export function useCalendly() {
  let calendly: any = null

  const { load, unload } = useScriptTag(
    'https://assets.calendly.com/assets/external/widget.js',
    // on script tag loaded.
    () => {
      calendly = window?.Calendly
    }, { immediate: false },
  )
  const loadCalendly = async () => {
    if (typeof window === 'undefined')
      return

    // await import('https://assets.calendly.com/assets/external/widget.css')
    await load()
    calendly?.initBadgeWidget({ url: 'https://calendly.com/weskhaled', text: 'Schedule time with me', color: '#0069ff', textColor: '#ffffff', branding: false })
  }
  const unloadCalendly = () => {
    unload()
    // find the tag calendly-badge-widget in body and remove it
    const badge = document.querySelector('.calendly-badge-widget')
    badge?.remove()
  }

  return {
    loadCalendly,
    unloadCalendly,
  }
}
