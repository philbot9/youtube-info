module.exports = function (fn) {
  return function () {
    const args = Array.prototype.slice.call(arguments)
    const lastArg = args[args.length - 1]
    const cb = typeof lastArg === 'function' && lastArg

    if (!cb) {
      return fn.apply(this, args)
    }

    return fn
      .apply(this, args.slice(0, -1))
      .then(x => cb(null, x))
      .catch(e => cb(e))
  }
}
