import enhance from '@enhance/ssr'
import test from 'tape'

import EnhanceImage from '../index.js'

function Head() {
  return `
    <!DOCTYPE html>
    <head></head>
  `
}

const strip = str => str.replace(/\r?\n|\r|\s\s+/g, '')

test('enhance-image', t => {
  const html = enhance({
    elements: {
      'enhance-image': EnhanceImage
    }
  })

  const result = html`
    ${Head()}
    <enhance-image
      src='axol.jpg'
      alt='Axol'
      defaultwidth='400'
      variant1='(min-width: 90em) 1200'
      variant2='(min-width: 40em) 600'
      loading='lazy'
    ></enhance-image>
  `

  const expected = `
    <!DOCTYPE html>
    <html>
    <head>
    </head>
    <body>
      <enhance-image src="axol.jpg" alt="Axol" defaultwidth="400" variant1="(min-width: 90em) 1200" variant2="(min-width: 40em) 600" loading="lazy">
        <picture>
          <source media="(min-width: 90em)" srcset="/transform/_public/axol.jpg?width=1200">
          <source media="(min-width: 40em)" srcset="/transform/_public/axol.jpg?width=600">
          <source srcset="/transform/_public/axol.jpg?width=400">
          <img src="/_public/axol.jpg" alt="Axol" loading="lazy">
        </picture>
      </enhance-image>
    </body>
    </html>
  `

  t.equal(strip(result), strip(expected), 'returns the expected markup')
  t.end()
})

