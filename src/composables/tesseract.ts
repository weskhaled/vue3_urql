import { createWorker } from 'tesseract.js'

export function useTesseract() {
  const lang = ref('fra')
  const result = ref('')
  const status = ref('INIT') as Ref<'INIT' | 'LOADING' | 'RUNNING' | 'SUCCESS' | 'ERROR'>

  function setLang(l: string) {
    lang.value = l
  }

  async function init(img: string | File, language: string = lang.value) {
    result.value = ''
    status.value = 'INIT'
    try {
      status.value = 'LOADING'
      const worker = await createWorker()
      await worker.loadLanguage(language)
      await worker.initialize(language)
      status.value = 'RUNNING'
      const { data: { text } } = await worker.recognize(img)
      await worker.terminate()
      result.value = text
      status.value = 'SUCCESS'
    }
    catch (e) {
      status.value = 'ERROR'
      result.value = ''
    }
  }

  return {
    init,
    setLang,
    status,
    result,
  }
}
