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

export default function EnhanceImage({ html, state }) {
  const { attrs } = state
  const { alt, defaultwidth, src, loading, focalpoint, mark, ...otherAttrs } = attrs

  const [x, y] = getXY(focalpoint)
  const variants = getVariants(otherAttrs)
  const getOptimizedSrc = (width, height) => `/transform${src}?width=${width}${focalpoint && height ? `&height=${height}&fit=cover&focus=point&x=${x}&y=${y}${mark !== undefined ? `&mark` : ''}` : ''}`
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

