import type { ComponentInfo, CategoryId } from '../types'
import { expansionFamilies } from '../data/expansion'

export function normalizeText(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

const familyLabels = new Map(expansionFamilies.map(family => [family.id, family.label]))

export function filterComponents(
  items: ComponentInfo[],
  search: string,
  category: CategoryId | 'all',
  favoritesOnly: boolean,
  favorites: string[],
  family: string = 'all'
): ComponentInfo[] {
  const query = normalizeText(search)
  const favoriteSet = new Set(favorites)
  return items.filter(item => (
    (category === 'all' || item.category === category) &&
    (family === 'all' || item.family === family) &&
    (!favoritesOnly || favoriteSet.has(item.id)) &&
    (!query || normalizeText([
      item.name,
      item.description,
      item.useCase,
      item.category,
      item.family ?? '',
      item.family ? familyLabels.get(item.family) ?? '' : ''
    ].join(' ')).includes(query))
  ))
}
