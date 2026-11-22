const PREFIX = 'uiux-atlas:'

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(PREFIX + key)
    return value ? JSON.parse(value) as T : fallback
  } catch {
    return fallback
  }
}

export function saveJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Local storage may be unavailable in private or restricted browsing.
  }
}
