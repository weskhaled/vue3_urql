import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['arco-theme-1', '[--primary-6:0,150,255] [--border-radius-medium:0px] [--border-radius-medium:0] [--border-radius-small:0] dark:[--color-menu-light-bg:#0f0f0f]'],
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-700 text-white cursor-pointer hover:bg-teal-800 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetTypography(),
    presetWebFonts({
      // provider: 'google',
      fonts: {
        // these will extend the default theme
        sans: 'Montserrat',
        mono: ['Fira Code', 'Fira Mono:400,700'],
        // custom ones
        script: [
          {
            name: 'Kaushan Script',
            italic: false,
            weights: ['400'],
            provider: 'google',
          },
        ],
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: 'prose prose-sm m-auto text-left'.split(' '),
})
