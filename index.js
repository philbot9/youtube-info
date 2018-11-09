const R = require('ramda')
const withCallback = require('./lib/utils/with-callback')

module.exports = R.map(withCallback, {
  video: require('./lib/video')
})
