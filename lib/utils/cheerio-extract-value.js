module.exports = ($e, attribute, transform) => {
  const value = $e && $e.length ? $e.attr(attribute) || undefined : undefined
  return value && transform ? transform(value) : value
}
