export const getVariants = (attrs) => Object
  .keys(attrs)
  .filter(key => key.startsWith('variant'))
  .reduce((variants, currentVariant) => {
    // Split the current variant attribute's value on the space following the closing media query parenthesis
    const [media, width] = attrs[currentVariant].split(/(?<=\))\s/)
    return [...variants, { media: media.trim(), width: width.trim() }]
  }, [])

export default function EnhanceImage({ html, state }) {
  const { attrs } = state
  const { alt, defaultwidth, src, loading, ...otherAttrs } = attrs

  const variants = getVariants(otherAttrs)
  const getOptimizedSrc = width => `/transform/_public/${src}?width=${width}`
  const variantsMarkup = variants.map(variant => `<source media='${variant.media}' srcset='${getOptimizedSrc(variant.width)}' />`).join('')
  const loadingAttr = loading ? `loading='${loading}'` : ''
  
  return html`
    <picture>
      ${variantsMarkup}
      <source srcset='${getOptimizedSrc(defaultwidth)}' />
      <img src='/_public/${src}' alt='${alt}' ${loadingAttr} />
    </picture>
  `
}

