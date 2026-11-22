import { describe, expect, it } from 'vitest'
import { categories } from '../types'
import { components } from '../data/components'
import { sectors } from '../data/sectors'
import { photoStyles, photoCategories } from '../data/photography'
import { auditCriteria } from '../data/audit'
import { specificDemoIds, hasSpecificDemo } from '../components/PatternDemo'
import { filterComponents, normalizeText } from './catalog'
import { buildPrompt } from './prompt'
import { buildSectorPrompt, buildAuditPrompt, buildPhotoPrompt } from './studio'

describe('UIUX Atlas v0.2 catalog', () => {
  it('preserves the original 80 stable IDs and adds unique patterns', () => {
    expect(components.length).toBeGreaterThan(80)
    expect(new Set(components.map(item => item.id)).size).toBe(components.length)
    for (const category of categories) {
      expect(components.filter(item => item.category === category.id).length).toBeGreaterThanOrEqual(10)
    }
  })
  it('includes 24 specific demos with matching patterns', () => {
    expect(specificDemoIds).toHaveLength(24)
    for (const id of specificDemoIds) {
      expect(components.some(item => item.id === id)).toBe(true)
      expect(hasSpecificDemo(id)).toBe(true)
    }
    expect(hasSpecificDemo('non-existent')).toBe(false)
  })
  it('supports accent insensitive search and favorite filtering', () => {
    expect(normalizeText('NAVEGACIÓN')).toBe('navegacion')
    expect(filterComponents(components, 'menú lateral', 'all', false, []).some(x=>x.id==='sidebar')).toBe(true)
    expect(filterComponents(components, '', 'navigation', true, ['sidebar','toast']).map(x=>x.id)).toEqual(['sidebar'])
  })
  it('has 12 original web presets and 8 app presets referencing valid components', () => {
    expect(sectors).toHaveLength(20)
    expect(sectors.filter(item => item.kind === 'web')).toHaveLength(12)
    expect(sectors.filter(item => item.kind === 'app')).toHaveLength(8)
    for (const item of sectors) {
      expect(item.components.every(id => components.some(c => c.id === id))).toBe(true)
      expect(buildSectorPrompt(item)).toContain(item.name)
    }
  })
  it('includes 54 original photographic descriptions in 6 categories', () => {
    expect(photoCategories).toHaveLength(6)
    expect(photoStyles).toHaveLength(54)
    for (const category of photoCategories) expect(photoStyles.filter(item => item.category === category)).toHaveLength(9)
    expect(buildPhotoPrompt('leche artesanal',photoStyles[0], '4:5', 'Fotografía realista')).toContain('leche artesanal')
  })
  it('has 12 errors and 10 criteria for an explicitly manual audit', () => {
    expect(auditCriteria.filter(i=>i.group==='errors')).toHaveLength(12)
    expect(auditCriteria.filter(i=>i.group==='principles')).toHaveLength(10)
    expect(buildAuditPrompt([])).toBe('')
    expect(buildAuditPrompt([auditCriteria[0]])).toContain(auditCriteria[0].title)
  })
  it('builds a six-part prompt while preserving functional restrictions', () => {
    const common = {tool:'Codex' as const,project:'Mi web',style:'Minimalista',theme:'Ambos' as const,keepLogic:true}
    const output = buildPrompt(components.slice(0,2),{...common,audience:'estudiantes',device:'Móvil y escritorio'})
    for (const term of ['Sidebar','Sticky Navbar','No modifiques autenticación','PARA QUIÉN','PANTALLA','estudiantes','Codex']) {
      expect(output).toContain(term)
    }
    expect(buildPrompt([], common)).toBe('')
  })
})
