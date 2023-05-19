// import { promiseTimeout } from '@vueuse/core'

export async function useIsotope() {
  // await promiseTimeout(3333200)
  let Isotope: any = null
  if (typeof window !== 'undefined')
    Isotope = await import('isotope-layout')

  return {
    Isotope: Isotope?.default || Isotope,
  }
}
