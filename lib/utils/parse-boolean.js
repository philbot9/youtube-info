module.exports = raw => {
  if (/^true$/i.test(raw)) {
    return true
  } else if (/^false$/i.test(raw)) {
    return false
  } else {
    return undefined
  }
}
