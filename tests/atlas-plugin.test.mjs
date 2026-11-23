import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)),'..')
const pluginRoot=resolve(root,'plugins/uiux-atlas')
const manifest=JSON.parse(readFileSync(resolve(pluginRoot,'plugin.json'),'utf8'))
const marketplace=JSON.parse(readFileSync(resolve(root,'.agents/plugins/marketplace.json'),'utf8'))
const skill=readFileSync(resolve(pluginRoot,'skills/uiux-atlas/SKILL.md'),'utf8')
const patterns=JSON.parse(readFileSync(resolve(pluginRoot,'skills/uiux-atlas/references/patterns.json'),'utf8'))

describe('UIUX Atlas: paquete portable de Skill y Plugin',()=>{
  it('declara un plugin con identidad y metadatos claros',()=>{
    assert.equal(manifest.name,'uiux-atlas')
    assert.match(manifest.version,/^\d+\.\d+\.\d+$/)
    assert.match(manifest.$schema,/agent-plugins\.org/)
    assert.equal(manifest.homepage,'https://uiux-atlas.netlify.app/')
    assert.ok(manifest.extensions?.['com.openai']?.interface?.displayName)
  })
  it('incluye un marketplace local cuyo origen existe',()=>{
    assert.equal(marketplace.plugins.length,1)
    assert.equal(marketplace.plugins[0].name,manifest.name)
    assert.equal(marketplace.plugins[0].source.source,'local')
    assert.equal(marketplace.plugins[0].source.path,'./plugins/uiux-atlas')
    assert.equal(marketplace.plugins[0].policy.installation,'AVAILABLE')
  })
  it('incluye un Skill válido con dos flujos y fuentes',()=>{
    assert.match(skill,/^---\nname: uiux-atlas\n/)
    assert.match(skill,/description:\s*>-/)
    assert.match(skill,/Crear proyecto desde cero/)
    assert.match(skill,/Mejorar proyecto existente/)
    assert.match(skill,/references\/patterns\.json/)
    assert.match(skill,/no garantiza|NO garantiza|no permite|no afirmes/i)
    assert.ok(readFileSync(resolve(pluginRoot,'skills/uiux-atlas/references/implementation-guidelines.md'),'utf8').includes('Plantilla de prompt técnico'))
  })
  it('empaca 406 patrones únicos válidos',()=>{
    assert.equal(patterns.length,406)
    assert.equal(new Set(patterns.map(p=>p.id)).size,406)
    assert.equal(new Set(patterns.map(p=>p.name.toLowerCase())).size,406)
    for(const item of patterns){
      assert.ok(item.id && typeof item.id==='string')
      assert.ok(item.name.length>3)
      assert.ok(item.description.length>9)
      assert.ok(item.useCase.length>8)
    }
  })
  it('coincide con el catálogo publicado del backend sin derivar nuevas identidades',async()=>{
    const {knowledge}=await import('../netlify/functions/lib/knowledge.mjs')
    assert.deepEqual(patterns,knowledge)
  })
})
