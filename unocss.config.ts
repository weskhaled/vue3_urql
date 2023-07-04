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
import { presetScrollbar } from 'unocss-preset-scrollbar'

export default defineConfig({
  shortcuts: [
    ['arco-theme-1', '[--primary-6:0,150,255] [--border-radius-medium:0px] [--border-radius-medium:2px] [--border-radius-small:2px] dark:[--color-menu-dark-bg:#000000]'],
    ['arco-theme-2', '[--primary-6:59,130,246] [--border-radius-medium:2px] [--border-radius-medium:2px] [--border-radius-small:2px] dark:[--color-menu-light-bg:#000000]'],
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
      provider: 'google',
      fonts: {
        // these will extend the default theme
        sans: [
          {
            name: 'Figtree',
            // name: 'Montserrat',
            // name: 'DM Sans',
            // name: 'Work Sans',
            italic: true,
            weights: ['300', '400', '600', '700', '800'],
          },
        ],
        mono: ['Space Grotesk', 'Fira Code:400,700'],
        // custom ones
        script: [
          {
            name: 'Kaushan Script',
            italic: false,
            weights: ['400'],
            provider: 'google',
          },
        ],
        general: [
          {
            name: 'General Sans',
            italic: false,
            weights: ['300', '400', '500', '600', '700', '800'],
            provider: 'fontshare',
          },
        ],
      },
    }),
    presetScrollbar(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: 'prose prose-sm m-auto text-left h-screen opacity-20'.split(' '),
})
