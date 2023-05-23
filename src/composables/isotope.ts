import type { IsotopeOptions } from 'isotope-layout'

export function useIsotope(elementRef: Ref<HTMLElement | null>, options: Ref<IsotopeOptions>) {
  const isotope: any = ref(null)
  watch(() => elementRef.value, async (val) => {
    if (typeof window === 'undefined' || !val)
      return

    const Isotope = (await import('isotope-layout')).default
    isotope.value = new Isotope(val, options.value)
  })
  return {
    isotope,
  }
}
