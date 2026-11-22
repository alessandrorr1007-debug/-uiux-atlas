import { describe, expect, it } from 'vitest'
import { categories } from '../types'
import { components } from '../data/components'
import { filterComponents, normalizeText } from './catalog'
import { buildPrompt } from './prompt'

describe('UIUX Atlas catalog', () => {
  it('contains 80 distinct patterns in 8 categories', () => {
    expect(components).toHaveLength(80)
    expect(new Set(components.map(item => item.id)).size).toBe(80)
    for (const category of categories) {
      expect(components.filter(item => item.category === category.id)).toHaveLength(10)
    }
  })
  it('supports accent insensitive search', () => {
    expect(normalizeText('NAVEGACIÓN')).toBe('navegacion')
    expect(filterComponents(components, 'navegación', 'all', false, []).length).toBeGreaterThan(0)
    expect(filterComponents(components, 'Menú lateral', 'all', false, []).some(item => item.id === 'sidebar')).toBe(true)
  })
  it('filters category and favorites without mixing states', () => {
    const result = filterComponents(components, '', 'navigation', true, ['sidebar', 'toast'])
    expect(result.map(item => item.id)).toEqual(['sidebar'])
  })
  it('builds a useful prompt with safeguarding', () => {
    const output = buildPrompt(components.slice(0, 2), {
      tool: 'Codex',
      project: 'Mi web',
      style: 'Minimalista',
      theme: 'Ambos',
      keepLogic: true
    })
    expect(output).toContain('Sidebar')
    expect(output).toContain('Sticky Navbar')
    expect(output).toContain('No modifiques autenticación')
    expect(output).toContain('Codex')
    expect(buildPrompt([], { tool: 'Codex', project: '', style: '', theme: 'Claro', keepLogic: true })).toBe('')
  })
})
