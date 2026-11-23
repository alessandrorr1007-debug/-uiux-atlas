import {describe,it} from 'node:test'
import assert from 'node:assert/strict'
import {
  MAX_REFERENCE_LINKS,normalizeReferenceUrls,referencePlatform,
  analyzePublicReferences,publicReferenceSummaries,referenceInputError
} from '../netlify/functions/lib/atlas-references.mjs'
import {extractPageInfo} from '../netlify/functions/lib/security.mjs'

const github='https://github.com/demo-project/ui-sample'
const instagram='https://www.instagram.com/p/Cabc123/'
const linkedin='https://www.linkedin.com/posts/demo-post_foo-123/'
const website='https://example.com/design'
const demoRepo={
  url:github,name:'ui-sample',owner:'demo-project',branch:'main',description:'Frontend de prueba',
  frameworks:['React'],fileCount:14,inspected:'source_code_only',truncated:false,
  warning:'Análisis estático',
  inspectedFiles:[{path:'src/App.tsx',kind:'interface',excerpt:'contenido de código que no debe volver al navegador'}]
}
const demoWebsite={
  url:website,title:'Referencia visual pública',description:'Landing de ejemplo',
  headings:['Ejemplo'],excerpt:'texto del documento',access:'metadata',
  previewImage:'https://images.example.com/p/preview.jpg',warning:'HTML público'
}

describe('Atlas IA · enlaces reunidos en una sola sección',()=>{
  it('acepta hasta cuatro plataformas públicas distintas con un campo común',()=>{
    const urls=normalizeReferenceUrls([github,instagram,linkedin,website])
    assert.equal(urls.length,MAX_REFERENCE_LINKS)
    assert.equal(urls[0],github)
    assert.equal(referencePlatform(instagram),'Instagram')
    assert.equal(referencePlatform(linkedin),'LinkedIn')
    assert.equal(referencePlatform(github),'GitHub')
    assert.equal(referencePlatform(website),'Web')
  })
  it('acepta enlaces del API anterior y detecta los pegados en el mensaje',()=>{
    assert.deepEqual(normalizeReferenceUrls(undefined,github),[github])
    const fromText=normalizeReferenceUrls(undefined,'','Mira '+instagram+' y '+github)
    assert.equal(fromText.length,2)
    assert.equal(normalizeReferenceUrls([instagram,instagram]).length,1)
  })
  it('rechaza más de cuatro enlaces, URLs HTTP e intentos de acceso interno',()=>{
    assert.throws(()=>normalizeReferenceUrls([github,instagram,linkedin,website,'https://behance.net/demo']),{message:'LINK_LIMIT'})
    for(const input of [
      'http://example.com','https://127.0.0.1/', 'https://localhost/',
      'https://example.com/?token=abc','https://github.com/demo/repo/issues',
      'https://user:password@example.com/'
    ])assert.throws(()=>normalizeReferenceUrls([input]),{message:'LINK_INVALID'})
    assert.equal(referenceInputError(new Error('LINK_LIMIT'))[0],400)
  })
  it('lee metadatos accesibles y distingue redes con lectura restringida',async()=>{
    const refs=await analyzePublicReferences([github,instagram,website],{
      inspectRepository:async()=>demoRepo,
      inspectWebsite:async(url)=>{
        if(url.includes('instagram.com'))throw new Error('URL_UNAVAILABLE')
        return demoWebsite
      }
    })
    assert.equal(refs.length,3)
    assert.equal(refs[0].status,'read')
    assert.equal(refs[1].status,'limited')
    assert.match(refs[1].warning,/captura/i)
    assert.equal(refs[2].status,'metadata')
    const summaries=publicReferenceSummaries(refs)
    assert.equal(summaries[0].repository.files[0].path,'src/App.tsx')
    assert.ok(!JSON.stringify(summaries).includes('contenido de código que no debe volver'))
    assert.equal(summaries[2].previewImage,'https://images.example.com/p/preview.jpg')
  })
  it('no hace inspecciones profundas de varios repositorios en la misma consulta',async()=>{
    let calls=0
    const refs=await analyzePublicReferences([github,'https://github.com/demo-project/other'],{
      inspectRepository:async()=>{calls++;return demoRepo}
    })
    assert.equal(calls,1)
    assert.equal(refs[0].status,'read')
    assert.equal(refs[1].status,'link_only')
    assert.match(refs[1].warning,/primer repositorio/i)
  })
  it('distingue miniaturas de metadatos de una revisión visual completa',()=>{
    const html='<title>Diseño público</title><meta property="og:image" content="https://cdn.example.com/p/preview.png">'+
      '<meta property="og:description" content="Una referencia visual"><h1>Presentación</h1>'
    const info=extractPageInfo(html,'https://example.com/design')
    assert.equal(info.previewImage,'https://cdn.example.com/p/preview.png')
    assert.equal(info.inspected,'html_only')
    assert.equal(info.access,'metadata')
    const unsafe=extractPageInfo('<title>Test</title><meta property="og:image" content="http://localhost:3000/private.png">','https://example.com/design')
    assert.equal(unsafe.previewImage,'')
  })
  it('advierte sobre publicaciones sociales sin contenido visual público',()=>{
    const login=extractPageInfo('<title>Sign in to LinkedIn</title><body>Sign in to LinkedIn</body>',
      'https://www.linkedin.com/posts/demo-post_foo-123')
    assert.equal(login.access,'limited')
    assert.match(login.warning,/captura/i)
  })
})
