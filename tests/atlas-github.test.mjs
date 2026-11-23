import {describe,it} from 'node:test'
import assert from 'node:assert/strict'
import {
 parseGitHubRepoUrl,isGitHubRepoUrl,rankUiFiles,sanitizeExcerpt,inspectPublicRepository,
 publicRepositorySummary,githubPublicError
} from '../netlify/functions/lib/github-repo.mjs'
import github from '../netlify/functions/atlas-github.mjs'
import chat from '../netlify/functions/atlas-chat.mjs'

const SHA={pkg:'a'.repeat(40),app:'b'.repeat(40),style:'c'.repeat(40),api:'d'.repeat(40),env:'e'.repeat(40)}
const tree=[
 {path:'package.json',type:'blob',sha:SHA.pkg,size:240},
 {path:'src/App.tsx',type:'blob',sha:SHA.app,size:1200},
 {path:'src/styles.css',type:'blob',sha:SHA.style,size:1800},
 {path:'server/api.ts',type:'blob',sha:SHA.api,size:1200},
 {path:'.env.production',type:'blob',sha:SHA.env,size:100},
 {path:'node_modules/react/index.js',type:'blob',sha:'f'.repeat(40),size:200},
 {path:'public/logo.png',type:'blob',sha:'9'.repeat(40),size:1000}
]
const content={
 [SHA.pkg]:JSON.stringify({dependencies:{react:'^19.0.0',next:'^15.0.0'},devDependencies:{tailwindcss:'^4.0.0'}}),
 [SHA.app]:'export function App(){return <main><h1>Mi proyecto</h1><button>Comprar</button></main>}\nconst password="secret-not-for-llm"',
 [SHA.style]:':root { --color-primary: #8899cc; }\n.page { display: grid; grid-template-columns: 1fr 2fr; }',
 [SHA.api]:'const apiKey="must-not-read";',
 [SHA.env]:'GROQ_API_KEY=never-read'
}
function response(value,status=200){return new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json'}})}
function mockGithubFetch(url,options){
 assert.ok(String(url).startsWith('https://api.github.com/repos/demo-owner/demo-app'),'Only official public API is used')
 assert.equal(options.method,'GET')
 assert.equal(options.redirect,'error')
 if(url.endsWith('/repos/demo-owner/demo-app'))return Promise.resolve(response({private:false,default_branch:'main',description:'Web de ejemplo'}))
 if(url.includes('/git/trees/main?recursive=1'))return Promise.resolve(response({tree,truncated:false}))
 const sha=String(url).split('/').at(-1)
 if(content[sha])return Promise.resolve(response({encoding:'base64',content:Buffer.from(content[sha]).toString('base64'),size:content[sha].length}))
 return Promise.resolve(response({message:'Not found'},404))
}
const fixtureUrl='https://github.com/demo-owner/demo-app'

describe('Atlas IA · integración segura con repositorios públicos de GitHub',()=>{
 it('acepta solo la raíz de un repositorio público HTTPS en github.com',()=>{
   assert.deepEqual(parseGitHubRepoUrl('https://github.com/demo-owner/demo-app.git'),
     {owner:'demo-owner',name:'demo-app',url:fixtureUrl})
   assert.equal(isGitHubRepoUrl(fixtureUrl),true)
   assert.equal(isGitHubRepoUrl('https://github.com.evil.test/demo/repo'),false)
   const invalid=[
     'http://github.com/demo/repo','https://github.com.evil.com/demo/repo',
     'https://user:pass@github.com/demo/repo','https://github.com/demo/repo/issues',
     'https://github.com/demo/repo?access_token=abc','https://127.0.0.1/demo/repo',
     'https://github.com/demo/','https://github.com/demo/..'
   ]
   for(const value of invalid)assert.throws(()=>parseGitHubRepoUrl(value),value)
 })
 it('selecciona archivos de UI sin backend ni secretos',()=>{
   const files=rankUiFiles(tree)
   assert.ok(files.some(f=>f.path==='src/App.tsx'))
   assert.ok(files.some(f=>f.path==='src/styles.css'))
   assert.ok(files.some(f=>f.path==='package.json'))
   assert.ok(files.every(f=>!f.path.includes('.env')&&!f.path.includes('api.ts')&&!f.path.includes('node_modules')))
   assert.equal(files.length,3)
   assert.ok(!sanitizeExcerpt(content[SHA.app]).includes('secret-not-for-llm'))
   assert.equal(sanitizeExcerpt('const apiKey="test-secret";\nfunction Ui() {}').trim(),'function Ui() {}')
 })
 it('inspecciona código permitido, reporta tecnologías y no envía código al navegador',async()=>{
   const result=await inspectPublicRepository(fixtureUrl,{fetchImpl:mockGithubFetch})
   assert.equal(result.inspected,'source_code_only')
   assert.equal(result.fileCount,7)
   assert.equal(result.inspectedFiles.length,3)
   assert.deepEqual(result.frameworks,['Next.js','Tailwind CSS'])
   assert.match(result.warning,/no ejecuta/)
   assert.ok(result.inspectedFiles.every(x=>!x.excerpt.includes('secret-not-for-llm')))
   const browser=publicRepositorySummary(result)
   assert.equal(browser.files.length,3)
   assert.ok(browser.files.every(file=>!('excerpt' in file)))
   assert.ok(!JSON.stringify(browser).includes('secret-not-for-llm'))
 })
 it('bloquea repositorios privados y errores sin revelar credenciales',async()=>{
   await assert.rejects(
     inspectPublicRepository(fixtureUrl,{fetchImpl:async()=>response({private:true,default_branch:'main'})}),
     {message:'GITHUB_PRIVATE'}
   )
   await assert.rejects(
     inspectPublicRepository(fixtureUrl,{fetchImpl:async()=>response({message:'Not found'},404)}),
     {message:'GITHUB_PRIVATE'}
   )
   assert.equal(githubPublicError(new Error('GITHUB_PRIVATE'))[0],422)
   assert.equal(githubPublicError(new Error('GITHUB_RATE_LIMIT'))[0],429)
 })
 it('impide solicitudes cruzadas y URLs inválidas en el endpoint de Netlify',async()=>{
   const url='https://uiux-atlas.netlify.app/api/atlas/github'
   const rogue=await github(new Request(url,{method:'POST',headers:{origin:'https://sitio-intruso.com','content-type':'application/json'},body:JSON.stringify({url:fixtureUrl})}),{ip:'198.51.100.100'})
   assert.equal(rogue.status,403)
   const invalid=await github(new Request(url,{method:'POST',headers:{origin:'https://uiux-atlas.netlify.app','content-type':'application/json'},body:JSON.stringify({url:'https://example.org'})}),{ip:'198.51.100.101'})
   assert.equal(invalid.status,400)
 })
 it('envía a Groq solo extractos acotados de archivos UI públicos y devuelve metadatos seguros',async()=>{
   const old=process.env.GROQ_API_KEY
   const original=globalThis.fetch
   process.env.GROQ_API_KEY='test-groq-fake'
   let groqCount=0
   let captured=null
   globalThis.fetch=async (uri,options)=>{
     if(String(uri).startsWith('https://api.github.com/'))return mockGithubFetch(String(uri),options)
     assert.equal(uri,'https://api.groq.com/openai/v1/chat/completions')
     groqCount++
     captured=JSON.parse(options.body)
     return response({choices:[{message:{content:JSON.stringify({
       reply:'El archivo src/App.tsx puede ganar una jerarquía visual más clara.',
       patternIds:['hero-section','bento-grid'],palette:[],prompt:''
     })}}]})
   }
   try{
     const request=new Request('https://uiux-atlas.netlify.app/api/atlas/chat',{
       method:'POST',headers:{origin:'https://uiux-atlas.netlify.app','content-type':'application/json'},
       body:JSON.stringify({mode:'improve',intent:'advise',message:'Mejora mi interfaz sin tocar lógica de pagos.',sourceUrl:fixtureUrl,images:[],tool:'Codex'})
     })
     const reply=await chat(request,{ip:'198.51.100.102'})
     assert.equal(reply.status,200)
     const payload=await reply.json()
     assert.equal(payload.repository.url,fixtureUrl)
     assert.equal(payload.repository.inspected,'source_code_only')
     assert.equal(groqCount,1)
     const system=captured.messages[0].content
     assert.ok(system.includes('src/App.tsx'))
     assert.ok(system.includes('src/styles.css'))
     assert.ok(!system.includes('secret-not-for-llm'))
     assert.ok(!JSON.stringify(payload).includes('secret-not-for-llm'))
   }finally{
     globalThis.fetch=original
     if(old===undefined)delete process.env.GROQ_API_KEY
     else process.env.GROQ_API_KEY=old
   }
 })
 it('consulta en paralelo archivos de interfaz respetando el límite de concurrencia',async()=>{
   let active=0,maximum=0
   const limited=async (url,options)=>{
     if(String(url).includes('/git/blobs/')){
       active+=1
       maximum=Math.max(maximum,active)
       await new Promise(resolve=>setTimeout(resolve,5))
       active-=1
     }
     return mockGithubFetch(url,options)
   }
   const result=await inspectPublicRepository(fixtureUrl,{fetchImpl:limited})
   assert.equal(result.inspectedFiles.length,3)
   assert.ok(maximum>1,'Debe leer varios blobs al mismo tiempo')
   assert.ok(maximum<=4,'El número de lecturas simultáneas debe estar acotado')
 })
})
