import { defaults } from './lib.mjs'

export default function EnhanceImage({ html, state }) {
  const { attrs, store } = state
  const {
    alt = '',
    src,
    sizes = '100vw',
    height,
    width,
    loading = 'eager',
    fetchpriority = 'auto',
  } = attrs
  const { plugins = {} } = store
  const { '@enhance/image': imageConfig = {} } = plugins
  const { transform = {} } = imageConfig
  const {
    widths = defaults.widths,
    format = defaults.format,
    quality = defaults.quality,
  } = transform

  function formatPath ({
    src,
    width,
    quality,
    format,
  }) {
    const widthParam = `width_${width}`
    const qualityParam = quality ? `quality_${quality}` : ''
    const formatParam = format ? `format_${format}` : ''

    // Build the full transform path
    const transforms =
      [ widthParam, qualityParam, formatParam ]
        .reduce((result, opt) => {
          return opt ? `${result},${opt}` : result
        }, '')
        .replace(',', '') // Strip the leading comma

    return `/transform/${transforms}${src}`
  }

  // Generate a srcset for the source image using the image config
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
      loading='${loading}'
      fetchpriority='${fetchpriority}'
      srcset='${srcset}'
      sizes='${sizes}'
      src='${src}'
      alt='${alt}'
      width='${width}'
      height='${height}'
    />
  `
}

