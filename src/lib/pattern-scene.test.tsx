import {describe,expect,it} from 'vitest'
import {renderToStaticMarkup} from 'react-dom/server'
import {components} from '../data/components'
import {categories} from '../types'
import {createPatternScene,resolveSceneKind,sceneGuides} from './pattern-scene'
import PatternVisual from '../components/PatternVisual'
import {specificDemoIds,hasSpecificDemo} from '../components/PatternDemo'
import {extendedDemoIds,hasExtendedDemo} from '../components/ExtendedPatternDemo'

describe('Catálogo visual — cobertura integral',()=>{
 it('genera una maqueta identificable para cada uno de los 406 patrones',()=>{
   expect(components).toHaveLength(406)
   const scenes=components.map(createPatternScene)
   expect(scenes).toHaveLength(406)
   expect(new Set(scenes.map(scene=>scene.id)).size).toBe(406)
   expect(scenes.every(scene=>scene.heading.length>0 && scene.feature.length>0)).toBe(true)
   expect(scenes.every(scene=>scene.kind in sceneGuides)).toBe(true)
 })
 it('utiliza composiciones semánticas en lugar de las 8 vistas genéricas antiguas',()=>{
   const variety=new Set(components.map(resolveSceneKind))
   expect(variety.size).toBeGreaterThanOrEqual(30)
   for(const category of categories) {
     const kinds=new Set(components.filter(c=>c.category===category.id).map(resolveSceneKind))
     expect(kinds.size).toBeGreaterThanOrEqual(4)
   }
   expect(resolveSceneKind(components.find(c=>c.id==='maps-geolocation-interactive-map')!)).toBe('map')
   expect(resolveSceneKind(components.find(c=>c.id==='product-card')!)).toBe('product')
   expect(resolveSceneKind(components.find(c=>c.id==='data-table')!)).toBe('table')
   expect(resolveSceneKind(components.find(c=>c.id==='hero-section')!)).toBe('hero')
 })
 it('renderiza una maqueta SVG por componente con nombre accesible y variante propia',()=>{
   for(const item of components) {
     const markup=renderToStaticMarkup(<PatternVisual item={item}/>)
     expect(markup).toContain('data-pattern="'+item.id+'"')
     expect(markup).toContain('data-scene="'+resolveSceneKind(item)+'"')
     expect(markup).toContain('<svg')
     expect(markup).toContain('<title>')
     expect(markup).toContain('Maqueta ilustrativa de '+item.name.replaceAll('&','&amp;'))
   }
 })
 it('mantiene las 24 demos anteriores y añade 22 demos nuevas, todas con IDs reales',()=>{
   expect(specificDemoIds).toHaveLength(24)
   expect(extendedDemoIds).toHaveLength(22)
   const ids=[...specificDemoIds,...extendedDemoIds]
   expect(ids).toHaveLength(46)
   expect(new Set(ids).size).toBe(46)
   for (const id of ids) {
     expect(components.some(component=>component.id===id)).toBe(true)
     expect(hasSpecificDemo(id)||hasExtendedDemo(id)).toBe(true)
   }
   expect(hasSpecificDemo('hero-section')).toBe(false)
   expect(hasExtendedDemo('hero-section')).toBe(true)
   expect(hasExtendedDemo('fake-pattern')).toBe(false)
 })
})
