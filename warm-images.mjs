#!/usr/bin/env node

import tiny from 'tiny-json-http'
import sandbox from '@architect/sandbox'
import fs from 'fs'
import path from 'path'

import defaults from './defaults.mjs'

const imageTypes = [
  '.avif',
  '.gif',
  '.jpeg',
  '.jpg',
  '.jxl',
  '.png',
  '.webp'
]

async function warmImages(){
  // Argument --domain, i.e. http://localhost:3333 
  // Checks for --custom and if it has a value
  const domainIndex = process.argv.indexOf('--domain')
  let domainValue
  if ( domainIndex > -1) { domainValue = process.argv[domainIndex + 1] }
  const domain = domainValue || 'http://localhost:3333'

  // Argument --directory, i.e. /public/images
  // The directory to scan for image files for prewarming
  const directoryIndex = process.argv.indexOf('--directory')
  let directoryValue
  if (directoryIndex > -1) directoryValue = process.argv[directoryIndex + 1]
  if (directoryValue && !directoryValue.startsWith('/public')) {
    console.error('@enhance/image warm: --directory value must start with "/public"')
    process.exit(1)
  }
  const directory = directoryValue || '/public'

  // 1. Run sandbox to generate static.json — we need this to access the fingerprinted filenames of the images later on
  const baseDir = process.cwd()
  await sandbox.start({cwd:baseDir})
  await sandbox.end()

  // 2. Get image paths from the specified directory (recursive)
  const directoryPath = path.join(process.cwd(), directory)

  let directoryContents = ''

  try {
    directoryContents = fs.readdirSync(directoryPath, { recursive: true })
  } catch (e) {
    console.error('@enhance/image warm: Directory specified with --directory option can’t be found in your project')
    throw e
  }

  const images = directoryContents.filter(file =>
    imageTypes.includes(path.extname(file).toLowerCase())
  )
  
  // 3. Get transform options from project's Preflight, if it exists; otherwise fall back to default options.
  const preflightPath = path.join(process.cwd(), 'app', 'preflight.mjs')
  const hasPreflight = fs.existsSync(preflightPath)

  let config = {}

  if (hasPreflight) {
    const { default: preflight } = await import(preflightPath)
    const preflightResponse = await preflight({ req: ''})
    const { plugins: { '@enhance/image': { transform } } } = preflightResponse
    config = transform
  }

  const {
    widths = defaults.widths,
    format = defaults.format,
    quality = defaults.quality
  } = config

  // 4. Map over `widths` to create transform options for each image in `images`
  const getVariantPaths = file => widths.map(width => `/transform/width_${width},format_${format},quality_${quality}${path.join(directoryValue.replace('/public', '/_public'), file)}`)
  const variantPaths = images.map(image => getVariantPaths(image)).flat()

  // 5. Use static.json to search and replace names in `variantPaths` w/ fingerprinted names
  const manifestFile = fs.readFileSync(path.join(process.cwd(), 'public','static.json'))
  const manifest = JSON.parse(manifestFile)

  function replaceEvery (str, mapObj) {
    function escapeRegExp (string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') 
    }
    const re = new RegExp(Object.keys(mapObj).map(i => escapeRegExp(i)).join('|'), 'gi')

    return str.replace(re, function (matched) {
      return mapObj[matched]
    })
  }

  const variantsWithFingerprints = variantPaths.map(variant => replaceEvery(variant, manifest))
  console.log(variantsWithFingerprints.length, " Images found to warm")

  // 6. Use tiny json to request each transformed image in batches
  const target = variantsWithFingerprints.slice()
  while (target.length){
    console.time('Batch Time')
    const batch = target.splice(0,10)
    await Promise.allSettled(batch.map(image=>
      tiny.get({url:domain+image})

    ))
    console.timeEnd('Batch Time')
    console.log("warmed batch:", batch)
  }
}

warmImages()

