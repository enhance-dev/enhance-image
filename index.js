export const getVariants = (attrs) => Object
  .keys(attrs)
  .filter(key => key.startsWith('variant'))
  .reduce((variants, currentVariant) => {
    // Split the current variant attribute's value on the space following the closing media query parenthesis
    const [media, dimensions] = attrs[currentVariant].split(/(?<=\))\s/)
    const [width, height = ""] = dimensions.split(/\s/)
    return [...variants, { media: media.trim(), width: width.trim(), height: height.trim() }]
  }, [])

function getXY(focalpoint = "50,50") {
  return focalpoint.split(',')
}

function paramString({width, height, focalpoint, format, x, y, mark}) {
  const params = [`${format ? `format_${format},` : ''}width_${width}`]
  if (focalpoint && height) {
    params.push(`height_${height}`)
    params.push(`fit_cover`)
    params.push(`focus_point`)
    params.push(`x_${x}`)
    params.push(`y_${y}`)
    if (mark !== undefined) {
      params.push('mark_true')
    }
  }
  return params.join(`,`)
}

export default function EnhanceImage({ html, state }) {
  const { attrs } = state
  const { alt, defaultwidth, src, loading, focalpoint, format, mark, ...otherAttrs } = attrs

  const [x, y] = getXY(focalpoint)
  const variants = getVariants(otherAttrs)
  const getOptimizedSrc = (width, height) => `/transform/${paramString({width, height, focalpoint, format, x, y, mark})}${src}`
  const variantsMarkup = variants.map(variant => `<source media='${variant.media}' srcset='${getOptimizedSrc(variant.width, variant.height)}' />`).join('')
  const loadingAttr = loading ? `loading='${loading}'` : ''

  return html`
    <picture>
      ${variantsMarkup}
      <source srcset='${getOptimizedSrc(defaultwidth)}' />
      <img src='${src}' alt='${alt}' ${loadingAttr} />
    </picture>
  `
}

