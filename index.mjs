import { formatPath } from '@enhance/arc-image-plugin'
import config from '@architect/shared/enhance-image/image-config.mjs'

export default function EnhanceImage({ html, state }) {
  const { attrs } = state
  const {
    alt = '',
    src,
    sizes = '100vw',
    height,
    width,
  } = attrs

  const loadingStrategy = Object.keys(attrs).includes('priority') ? 'fetchpriority="high"' : 'loading="lazy"'

  // Generate a srcset for the source image using the image config
  const { widths, format, quality } = config
  const srcset = widths.map(width => {
    return `${formatPath({
      src,
      width,
      quality,
      format,
    })} ${width}w`
  }).join(', ')

  return html`
    <style>
      img {
        max-inline-size: 100%;
        block-size: auto;
      }
    </style>
    <img
      alt='${alt}'
      srcset='${srcset}'
      sizes='${sizes}'
      width='${width}'
      height='${height}'
      ${loadingStrategy}
    />
  `
}


