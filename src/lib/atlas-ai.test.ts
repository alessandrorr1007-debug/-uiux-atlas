import { describe, it, expect } from 'vitest'
import { components } from '../data/components'
import {
  suggestAtlasPatterns, composeAtlasPrompt, isGitHubLink,
  describeAtlasRequestError, ATLAS_IMAGE_DATA_URL_LIMIT, prepareAtlasImage,
  type SiteInfo, type GitHubRepositoryInfo
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
  it('identifica enlaces de GitHub sin confundir hosts similares',()=>{
    expect(isGitHubLink('https://github.com/demo/proyecto')).toBe(true)
    expect(isGitHubLink('https://github.com.evil.test/demo/proyecto')).toBe(false)
    expect(isGitHubLink('https://example.org/')).toBe(false)
  })
  it('crea un prompt local basado en los archivos inspeccionados de un repo público',()=>{
    const repository:GitHubRepositoryInfo={
      url:'https://github.com/demo/proyecto',owner:'demo',name:'proyecto',
      branch:'main',description:'Frontend React',frameworks:['React','Vite'],
      fileCount:120,
      files:[{path:'src/App.tsx',kind:'interface'},{path:'src/styles.css',kind:'styles'}],
      inspected:'source_code_only',truncated:false,
      warning:'Análisis estático de archivos públicos.'
    }
    const prompt=composeAtlasPrompt('improve','Moderniza la portada sin romperla',['hero-section'],'Codex',[],null,repository)
    expect(prompt).toContain('https://github.com/demo/proyecto')
    expect(prompt).toContain('src/App.tsx')
    expect(prompt).toContain('src/styles.css')
    expect(prompt).toContain('React')
    expect(prompt).toContain('no se ejecutó ni renderizó')
    expect(prompt).toContain('conserva estrictamente autenticación')
  })
  it('normaliza Failed to fetch y tiempos de espera sin revelar mensajes técnicos',()=>{
    expect(describeAtlasRequestError(new TypeError('Failed to fetch'))).toContain('Netlify')
    const timeout=new Error('The operation was aborted')
    timeout.name='TimeoutError'
    expect(describeAtlasRequestError(timeout)).toContain('tardó demasiado')
    expect(describeAtlasRequestError(new Error('Límite de Groq'))).toBe('Límite de Groq')
  })
  it('comprime capturas de forma adaptativa para enviar tres imágenes ligeras',async()=>{
    const oldDocument=globalThis.document
    const oldBitmap=globalThis.createImageBitmap
    let count=0
    let closed=false
    Object.defineProperty(globalThis,'createImageBitmap',{configurable:true,value:async()=>({
      width:1600,height:900,close:()=>{closed=true}
    })})
    Object.defineProperty(globalThis,'document',{configurable:true,value:{
      createElement:()=>{
        const canvas={width:0,height:0,
          getContext:()=>({fillStyle:'',fillRect:()=>{},drawImage:()=>{},getImageData:()=>({
            data:new Uint8ClampedArray([104,118,130,255])
          })}),
          toDataURL:()=>{count++;return 'data:image/jpeg;base64,'+'A'.repeat(canvas.width>800?330_000:180_000)}
        }
        return canvas
      }
    }})
    try{
      const fake={name:'captura.jpg',type:'image/jpeg',size:2_000_000} as File
      const processed=await prepareAtlasImage(fake)
      expect(processed.dataUrl.length).toBeLessThanOrEqual(ATLAS_IMAGE_DATA_URL_LIMIT)
      expect(processed.name).toBe('captura.jpg')
      expect(count).toBeGreaterThan(1)
      expect(closed).toBe(true)
      expect(processed.palette.length).toBeGreaterThan(0)
    }finally{
      Object.defineProperty(globalThis,'document',{configurable:true,value:oldDocument})
      Object.defineProperty(globalThis,'createImageBitmap',{configurable:true,value:oldBitmap})
    }
  })
})
