export default function EnhanceImage({ html, state }) {
  const { attrs } = state
  const { alt, defaultwidth, src } = attrs

  const variants = Object
    .keys(attrs)
    .filter(key => key.startsWith('variant'))
    .reduce((variants, currentVariant) => {
      // Split the current variant attribute's value on the space following the closing media query parenthesis
      const [media, width] = attrs[currentVariant].split(/(?<=\))\s/)
      return [...variants, { media, width }]
    }, [])

  const getOptimizedSrc = width => `/transform/_public/${src}?width=${width}`
  const variantsMarkup = variants.map(variant => `<source media='${variant.media}' srcset='${getOptimizedSrc(variant.width)}' />`).join(' ')
  
  return html`
    <picture>
      ${variantsMarkup}
      <source srcset='${getOptimizedSrc(defaultwidth)}' />
      <img src='/_public/${src}' alt='${alt}' />
    </picture>
  `
}

