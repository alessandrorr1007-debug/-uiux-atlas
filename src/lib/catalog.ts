import type { ComponentInfo, CategoryId } from '../types'

export function normalizeText(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

export function filterComponents(items: ComponentInfo[], search: string, category: CategoryId | 'all', favoritesOnly: boolean, favorites: string[]) {
  const query = normalizeText(search)
  const favoriteSet = new Set(favorites)
  return items.filter(item =>
    (category === 'all' || item.category === category) &&
    (!favoritesOnly || favoriteSet.has(item.id)) &&
    (!query || normalizeText([item.name, item.description, item.useCase, item.category].join(' ')).includes(query))
  )
}
