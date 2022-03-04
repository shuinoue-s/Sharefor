function randomString() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let randStr = ''
  for (let i = 0; i < 8; i++) {
    randStr += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return randStr
}

export default randomString