import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import chat from '../netlify/functions/atlas-chat.mjs'
import inspect from '../netlify/functions/atlas-inspect.mjs'
import { knowledge, searchPatterns, getPatterns } from '../netlify/functions/lib/knowledge.mjs'
import { validatePublicUrl, isPublicIPv4, extractPageInfo, sameOrigin, parseJson } from '../netlify/functions/lib/security.mjs'

const url='https://uiux-atlas.netlify.app/api/atlas/chat'
const makePost=(body,origin='https://uiux-atlas.netlify.app')=>new Request(url,{
  method:'POST',headers:{'content-type':'application/json','origin':origin},body:JSON.stringify(body)
})

describe('Backend de Atlas IA (sin llamar a proveedores externos)',()=>{
  it('indexa exactamente los 406 patrones',()=>{
    assert.equal(knowledge.length,406)
    assert.equal(new Set(knowledge.map(x=>x.id)).size,406)
    assert.ok(searchPatterns('Quiero una pollería moderna con delivery').some(x=>x.id==='product-card'))
    assert.equal(getPatterns(['sidebar','sidebar','inventado']).length,1)
  })
  it('valida enlaces y bloquea destinos SSRF',()=>{
    assert.equal(validatePublicUrl('https://ejemplo.com/menu').hostname,'ejemplo.com')
    for(const bad of ['http://ejemplo.com','https://localhost/','https://127.0.0.1/','https://192.168.1.1/','https://example.com:8080/','https://user:pass@example.com/','https://example.com?token=abc','https://internal.local/'])
      assert.throws(()=>validatePublicUrl(bad))
    assert.equal(isPublicIPv4('8.8.8.8'),true)
    for(const ip of ['127.0.0.1','10.0.0.5','172.16.8.7','192.168.1.1','169.254.169.254','100.64.1.1','203.0.113.12'])
      assert.equal(isPublicIPv4(ip),false)
  })
  it('inspecciona HTML sin ejecutar contenido ni afirmar lectura visual',()=>{
    const input='<html><head><title>Restaurante</title><meta name="description" content="Pollos y platos"></head><body><script>let secret="x"</script><h1>Nuestra carta</h1><p>Pollo a la brasa</p></body></html>'
    const info=extractPageInfo(input,'https://example.org')
    assert.equal(info.title,'Restaurante')
    assert.equal(info.description,'Pollos y platos')
    assert.deepEqual(info.headings,['Nuestra carta'])
    assert.ok(!info.excerpt.includes('secret'))
    assert.equal(info.inspected,'html_only')
    assert.match(info.warning,/HTML público/)
  })
  it('bloquea origen cruzado y respuestas no autorizadas',async()=>{
    const request=makePost({mode:'create',intent:'advise',message:'hola'},'https://otro-dominio.com')
    assert.equal(sameOrigin(request),false)
    const response=await chat(request,{ip:'198.51.100.1'})
    assert.equal(response.status,403)
    const inspectResponse=await inspect(makePost({url:'https://example.org'},'https://otro-dominio.com'),{ip:'198.51.100.2'})
    assert.equal(inspectResponse.status,403)
  })
  it('informa con precisión cuando no se configuró la clave',async()=>{
    const old=process.env.GROQ_API_KEY
    delete process.env.GROQ_API_KEY
    try{
      const status=await chat(new Request(url),{})
      assert.equal(status.status,200)
      const details=await status.json()
      assert.equal(details.configured,false)
      assert.equal(details.catalog,406)
      const response=await chat(makePost({mode:'create',intent:'advise',message:'Hola'}),{ip:'198.51.100.3'})
      assert.equal(response.status,503)
      assert.equal((await response.json()).code,'NOT_CONFIGURED')
    }finally{if(old===undefined)delete process.env.GROQ_API_KEY;else process.env.GROQ_API_KEY=old}
  })
  it('envía el chat e imágenes a Groq solo cuando hay clave y sanitiza la respuesta',async()=>{
    const oldKey=process.env.GROQ_API_KEY
    const originalFetch=globalThis.fetch
    process.env.GROQ_API_KEY='fake-local-test-key'
    let called=0
    let captured
    globalThis.fetch=async(address,options)=>{
      called++
      assert.equal(address,'https://api.groq.com/openai/v1/chat/completions')
      assert.equal(options.headers.authorization,'Bearer fake-local-test-key')
      captured=JSON.parse(options.body)
      return new Response(JSON.stringify({choices:[{message:{content:JSON.stringify({
        reply:'Te recomiendo un Hero y catálogo.',
        patternIds:['hero-section','product-card','id-no-permitido'],
        palette:['#AA2200','color-inválido'],
        prompt:''
      })}}]}),{status:200,headers:{'content-type':'application/json'}})
    }
    try{
      const response=await chat(makePost({
        mode:'create',intent:'advise',message:'Pollería con carrito',
        selectedIds:['product-card'],images:['data:image/jpeg;base64,AAAA'],colors:['#AA2200'],tool:'Codex'
      }),{ip:'198.51.100.4'})
      assert.equal(response.status,200)
      const result=await response.json()
      assert.equal(called,1)
      assert.equal(captured.model,'qwen/qwen3.8-27b')
      assert.equal(captured.messages.at(-1).content.length,2)
      assert.deepEqual(result.patternIds,['hero-section','product-card'])
      assert.deepEqual(result.palette,['#AA2200'])
      assert.equal(result.prompt,'')
    }finally{
      globalThis.fetch=originalFetch
      if(oldKey===undefined)delete process.env.GROQ_API_KEY;else process.env.GROQ_API_KEY=oldKey
    }
  })
})
