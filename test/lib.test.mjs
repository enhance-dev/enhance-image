import test from 'tape'

import { getVariantPaths, warmImages } from '../lib.mjs'

test('getVariantPaths', t => {
  const variantPaths = getVariantPaths({
    directory: '/public/images',
    widths: [1000, 500, 250],
    format: 'jxl',
    quality: 66,
    image: 'axol.png'
  })

  const expected = [
    '/transform/width_1000,format_jxl,quality_66/_public/images/axol.png',
    '/transform/width_500,format_jxl,quality_66/_public/images/axol.png',
    '/transform/width_250,format_jxl,quality_66/_public/images/axol.png',
  ]

  t.deepEqual(variantPaths, expected, 'formats paths for image variants correctly')
  t.end()
})

// test('warmImages', t => {
//   t.throws(
//     () => { warmImages({ directory: '/some/non/existant/directory', domain: 'https://example.org' }) },
//     'Throws an error if the directory doesn’t exist'
//   )
//   t.end()
// })
