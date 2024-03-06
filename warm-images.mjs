#!/usr/bin/env node

import { warmImages } from './lib.mjs'

function main(){
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

  warmImages({ directory, domain })
}

main()

