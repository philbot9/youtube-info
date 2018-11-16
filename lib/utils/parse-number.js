module.exports = raw => {
  if (!raw || typeof raw !== 'string') {
    return undefined
  }
  const cleaned = raw.replace(/[^\d]/g, '')
  const parsed = parseInt(cleaned, 10)

  return isNaN(parsed) ? undefined : parsed
}
