import test from 'tape'

import { getVariants } from '../index.js'

const attrs = {
  alt: 'Axol',
  defaultwidth: '400',
  src: 'axol.jpg',
  variant1: '(min-width: 90em) 1200',
  variant2: '(min-width: 40em) 600',
  something: 'arbitrary',
}

test('getVariants', t => {
  const result = getVariants(attrs)

  const expected = [
    {
      media: '(min-width: 90em)',
      width: '1200',
    },
    {
      media: '(min-width: 40em)',
      width: '600',
    }
  ]

  t.deepEqual(result, expected, 'returns the expected data')
  t.end()
})
