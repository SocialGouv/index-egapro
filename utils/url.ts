// Build an URLSearchParams from an object.
export function makeUrlSearchParam(params: Record<string, string | string[]> = {}) {
  var searchParams = new URLSearchParams()

  const entries = Object.entries(params)

  for (const [key, value] of entries) {
    if (Array.isArray(value)) {
      for (const element of value) {
        if (value) searchParams.append(key, element)
      }
    } else {
      if (value) searchParams.set(key, value)
    }
  }

  return searchParams.toString()
}
