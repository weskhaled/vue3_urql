import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { useI18n } from 'vue-i18n'
import ThisForTest from '~/components/ThisForTest.vue'
import { userLang } from '~/common/stores'

vi.mock('vue-i18n')

useI18n.mockReturnValue({
  t: tKey => tKey,
})

vi.mock('@arco-design/web-vue', async () => {
  const Arco: any = await vi.importActual('@arco-design/web-vue/es')

  return { __esModule: true, ...Arco }
})

describe('TheCounter', async () => {
  it('should render', async () => {
    const wrapper = mount(ThisForTest, {
      global: {
        plugins: [],
      },
      // props: { modelValue: '10' },
    })
    const btn = wrapper.get('button.arco-btn')
    expect(btn.text()).toBe(`button.home - ${userLang.value} - 0`)
    await btn.trigger('click')
    expect(btn.text()).toBe(`button.home - ${userLang.value} - 1`)
    // console.log(btn.html())
    // expect(wrapper.text()).toContain('Secondary')
    // expect(wrapper.html()).toMatchSnapshot()
    // expect(wrapper.find('input').exists()).toBe(true)
  })
})
