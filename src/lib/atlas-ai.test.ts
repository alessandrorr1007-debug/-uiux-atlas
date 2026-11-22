import { describe, it, expect } from 'vitest'
import { components } from '../data/components'
import {
  suggestAtlasPatterns, composeAtlasPrompt,
  type SiteInfo
} from './atlas-ai'

describe('Atlas IA: asesor y generación sin API',()=>{
  it('preserva el diccionario de 406 patrones como base de conocimiento',()=>{
    expect(components).toHaveLength(406)
    expect(new Set(components.map(item=>item.id)).size).toBe(406)
  })
  it('recomienda comercio y entrega al mencionar una pollería',()=>{
    const result=suggestAtlasPatterns('Quiero hacer una web de pollería con delivery y carrito',[],8)
    expect(result.some(item=>item.id==='product-card')).toBe(true)
    expect(result.some(item=>item.id==='cart-drawer')).toBe(true)
    expect(result.length).toBeLessThanOrEqual(8)
  })
  it('recomienda patrones futuristas y respeta la selección del usuario',()=>{
    const result=suggestAtlasPatterns('Quiero algo futurista y premium',['glassmorphism'],7)
    expect(result.map(x=>x.id)).toContain('glassmorphism')
    expect(result.map(x=>x.id)).toContain('bento-grid')
  })
  it('genera un prompt completo de creación con colores y herramienta',()=>{
    const output=composeAtlasPrompt('create','Pollería con pedidos por WhatsApp',['product-card','cart-drawer'],'Codex',['#AA2200','#111111'])
    expect(output).toContain('Codex')
    expect(output).toContain('Pollería')
    expect(output).toContain('Product Card')
    expect(output).toContain('Cart Drawer')
    expect(output).toContain('#AA2200')
    expect(output).toContain('Ejecuta pruebas')
  })
  it('genera un prompt de rediseño que preserva el funcionamiento',()=>{
    const site:SiteInfo={url:'https://example.org',title:'Web existente',description:'Menú',warning:'Solo HTML'}
    const output=composeAtlasPrompt('improve','Mejorar catálogo',['bento-grid'],'Google AI Studio',[],site)
    expect(output).toContain('conserva estrictamente autenticación')
    expect(output).toContain('https://example.org')
    expect(output).toContain('Bento Grid')
    expect(output).toContain('HTML preliminar')
  })
})
