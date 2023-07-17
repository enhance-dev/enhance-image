const plugin = require('@enhance/arc-image-plugin')
const EnhanceImage = require('./enhance-image.mjs')

module.exports = plugin // export for arc plugin interface
exports = module.exports // ESM default export
exports.EnhanceImage = EnhanceImage // ESM named export for component

