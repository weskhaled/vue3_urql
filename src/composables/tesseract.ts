import { createWorker } from 'tesseract.js'

export function useTesseract() {
  const lang = ref('fra')
  const result = ref('')
  const status = ref('LOADING') as Ref<'LOADING' | 'RECOGNIZING' | 'DONE'>

  function setLang(l: string) {
    lang.value = l
  }

  async function init(img: string | File, language: string = lang.value) {
    status.value = 'LOADING'
    const worker = await createWorker()
    await worker.loadLanguage(language)
    await worker.initialize(language)
    status.value = 'RECOGNIZING'
    const { data: { text } } = await worker.recognize(img)
    status.value = 'DONE'
    await worker.terminate()
    result.value = text
  }

  return {
    init,
    setLang,
    status,
    result,
  }
}
