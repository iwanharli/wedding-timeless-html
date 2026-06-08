export function getPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj)
}

export function setPath(obj, path, value) {
  const keys = path.split('.')
  const result = Array.isArray(obj) ? [...obj] : { ...obj }
  let cursor = result
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    const next = cursor[key]
    cursor[key] = Array.isArray(next) ? [...next] : { ...next }
    cursor = cursor[key]
  }
  cursor[keys[keys.length - 1]] = value
  return result
}
