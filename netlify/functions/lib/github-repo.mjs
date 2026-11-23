/*
 * Read-only GitHub public repository inspection for Atlas IA.
 * Trust boundary: a URL can select owner/repository, but never an arbitrary
 * network host, file endpoint, credential or command to execute.
 */
const API='https://api.github.com'
const MAX_FILES=8
const MAX_TREE_BYTES=2_000_000
const MAX_BLOB_BYTES=110_000
const MAX_EXCERPT=1750
const MAX_TOTAL_EXCERPTS=10500
const repoCache=new Map()
const CACHE_MS=300_000
const UI_EXT=/\.(?:tsx|jsx|vue|svelte|html|css|scss|less|js|ts)$/i
const SKIP_PATH=/(^|\/)(?:\.git|\.github|node_modules|vendor|dist|build|coverage|public|assets|images|scripts|server|backend|api|functions|migrations|tests?|__tests__|fixtures|generated|ios|android)(\/|$)/i
const SKIP_NAME=/(?:^|\/)(?:\.env[^/]*|[^/]*\.lock|[^/]*\.map|[^/]*\.(?:pem|key|p12|pfx|crt)|[^/]*(?:secret|credential|private[_-]?key)[^/]*)$/i
const SENSITIVE_LINE=/(?:password|passwd|secret|credential|api[_-]?key|access[_-]?token|private[_-]?key|authorization|bearer\s|process\.env|import\.meta\.env|(?:['"\x60])sk-[A-Za-z0-9])/i

export function parseGitHubRepoUrl(input) {
  if(typeof input!=='string'||input.length>700)throw new Error('GITHUB_INVALID')
  let value
  try{value=new URL(input.trim())}catch{throw new Error('GITHUB_INVALID')}
  if(value.protocol!=='https:'||value.hostname.toLowerCase()!=='github.com'||value.username||value.password||value.port)throw new Error('GITHUB_INVALID')
  const parts=value.pathname.split('/').filter(Boolean)
  if(parts.length!==2||value.search)throw new Error('GITHUB_INVALID')
  const owner=parts[0]
  const name=parts[1].replace(/\.git$/i,'')
  if(!/^[a-zA-Z0-9-]{1,39}$/.test(owner)||owner.startsWith('-')||owner.endsWith('-')||
     !/^[a-zA-Z0-9_.-]{1,100}$/.test(name)||name==='.'||name==='..')throw new Error('GITHUB_INVALID')
  return {owner,name,url:'https://github.com/'+owner+'/'+name}
}

export function isGitHubRepoUrl(value){
  if(typeof value!=='string')return false
  try{return new URL(value.trim()).hostname.toLowerCase()==='github.com'}catch{return false}
}

export function rankUiFiles(tree){
  if(!Array.isArray(tree))return []
  const entries=[]
  for(const entry of tree) {
    if(!entry||entry.type!=='blob'||typeof entry.path!=='string'||entry.path.length>180||
       !/^[a-zA-Z0-9_\-./@ ]+$/.test(entry.path)||SKIP_PATH.test(entry.path)||SKIP_NAME.test(entry.path)||
       !/^[a-f0-9]{40,64}$/i.test(entry.sha||'')||entry.size>MAX_BLOB_BYTES||
       (entry.path.split('/').length>9))continue
    const path=entry.path
    const file=path.split('/').at(-1)
    const isPackage=path==='package.json'||/^(?:frontend|client|web)\/package\.json$/.test(path)
    if(!isPackage&&!UI_EXT.test(path))continue
    if(/\.(?:ts|js)$/i.test(file)&&!/(?:App|page|layout|component|screen|view|header|navbar|footer|index|home|route|main|menu|card|navigation|button|form|dialog)/i.test(file))continue
    if(/\.min\./i.test(file))continue
    const uiDir=/(?:^|\/)(?:src|app|pages|components|styles|layouts|ui|views|screens)\//i.test(path)
    if(!isPackage&&!uiDir&&path.includes('/')&&!/^(?:frontend|client|web)\//.test(path))continue
    let score=isPackage?125:10
    if(/(?:^|\/)(?:App|app|page|layout|index|main)\.(?:tsx|jsx|vue|svelte|html)$/i.test(path))score+=110
    if(/(?:global|style|index|app|main|theme|tailwind).*\.(?:css|scss|less)$/i.test(file))score+=100
    else if(/\.(?:css|scss|less)$/i.test(file))score+=62
    if(/(?:^|\/)(?:src|app|pages|views|screens)\//i.test(path))score+=38
    if(/(?:^|\/)components\//i.test(path))score+=30
    if(/\.(?:tsx|jsx|vue|svelte)$/i.test(file))score+=26
    if(/(?:navbar|header|sidebar|hero|product|checkout|mobile|card|navigation)/i.test(file))score+=18
    score-=Math.max(0,path.split('/').length-3)*4
    entries.push({path,sha:entry.sha,size:entry.size||0,score,kind:isPackage?'dependencies':/\.(?:css|scss|less)$/i.test(path)?'styles':'interface'})
  }
  entries.sort((a,b)=>b.score-a.score||a.path.localeCompare(b.path))
  // Don't consume the entire allowance on one kind of file.
  const picked=[]
  const byKind={dependencies:0,styles:0,interface:0}
  for(const entry of entries){
    const cap=entry.kind==='dependencies'?1:entry.kind==='styles'?3:6
    if(byKind[entry.kind]>=cap)continue
    picked.push(entry);byKind[entry.kind]++
    if(picked.length===MAX_FILES)break
  }
  return picked
}

export function sanitizeExcerpt(source,max=MAX_EXCERPT) {
  return String(source)
    .split(/\r?\n/).slice(0,180)
    .filter(line=>!SENSITIVE_LINE.test(line))
    .join('\n')
    .replace(/(?:ghp_|github_pat_|sk-)[A-Za-z0-9_-]{8,}/g,'[credencial omitida]')
    .slice(0,max)
}

function frameworksFrom(packageText,files){
  const set=new Set()
  try{
    const pkg=JSON.parse(packageText||'{}')
    const deps={...(pkg.dependencies||{}),...(pkg.devDependencies||{})}
    if(deps.next)set.add('Next.js')
    else if(deps.react)set.add('React')
    if(deps.vue||deps.nuxt)set.add(deps.nuxt?'Nuxt':'Vue')
    if(deps.svelte||deps['@sveltejs/kit'])set.add('Svelte')
    if(deps.angular||deps['@angular/core'])set.add('Angular')
    if(deps.vite)set.add('Vite')
    if(deps.tailwindcss)set.add('Tailwind CSS')
  }catch{/* JSON untrusted or incomplete */}
  if(!set.size&&files.some(f=>f.path.endsWith('.html')))set.add('HTML/CSS')
  return [...set].slice(0,5)
}

async function readJsonBounded(response,limit) {
  if(!response.body)throw new Error('GITHUB_UNAVAILABLE')
  const reader=response.body.getReader()
  let bytes=0
  const parts=[]
  try {
    while(true){
      const {done,value}=await reader.read()
      if(done)break
      bytes+=value.length
      if(bytes>limit){await reader.cancel();throw new Error('GITHUB_TOO_LARGE')}
      parts.push(value)
    }
  }finally{try{reader.releaseLock()}catch{/* canceled */}}
  const buffer=new Uint8Array(bytes)
  let offset=0
  for(const p of parts){buffer.set(p,offset);offset+=p.length}
  try{return JSON.parse(new TextDecoder().decode(buffer))}catch{throw new Error('GITHUB_UNAVAILABLE')}
}

async function api(path,maxBytes,fetchImpl){
  const token=process.env.GITHUB_READ_TOKEN?.trim()
  const headers={
    accept:'application/vnd.github+json',
    'user-agent':'UIUX-Atlas-IA (public source code inspector)',
    'x-github-api-version':'2022-11-28'
  }
  if(token)headers.authorization='Bearer '+token
  let response
  try{
    response=await fetchImpl(API+path,{method:'GET',headers,redirect:'error',signal:AbortSignal.timeout(7500)})
  }catch{throw new Error('GITHUB_UNAVAILABLE')}
  if(response.status===404)return null
  if(response.status===403||response.status===429)throw new Error('GITHUB_RATE_LIMIT')
  if(!response.ok)throw new Error('GITHUB_UNAVAILABLE')
  return readJsonBounded(response,maxBytes)
}

export async function inspectPublicRepository(rawUrl,{fetchImpl=fetch}={}){
  const {owner,name,url}=parseGitHubRepoUrl(rawUrl)
  // Best-effort per-instance cache: avoids fetching the same public files twice
  // when someone previews a repository before asking Atlas IA for advice.
  const useCache=fetchImpl===fetch
  const cached=useCache?repoCache.get(url):null
  if(cached && Date.now()-cached.at<CACHE_MS)return cached.value
  const path='/repos/'+encodeURIComponent(owner)+'/'+encodeURIComponent(name)
  const info=await api(path,28_000,fetchImpl)
  if(!info||info.private!==false)throw new Error('GITHUB_PRIVATE')
  const branch=typeof info.default_branch==='string'?info.default_branch:''
  if(!branch||branch.length>170)throw new Error('GITHUB_UNAVAILABLE')
  const tree=await api(path+'/git/trees/'+encodeURIComponent(branch)+'?recursive=1',MAX_TREE_BYTES,fetchImpl)
  if(!tree||!Array.isArray(tree.tree))throw new Error('GITHUB_UNAVAILABLE')
  const relevant=rankUiFiles(tree.tree)
  if(!relevant.length)throw new Error('GITHUB_NO_FRONTEND')
  const files=[]
  let budget=MAX_TOTAL_EXCERPTS
  let packageText=''
  // Small, sequential requests bound both service use and overall context.
  for(const entry of relevant) {
    if(budget<220)break
    let data
    try {data=await api(path+'/git/blobs/'+entry.sha,MAX_BLOB_BYTES*2,fetchImpl)}
    catch(error){if(error?.message==='GITHUB_RATE_LIMIT')throw error;continue}
    if(!data||data.encoding!=='base64'||typeof data.content!=='string')continue
    const raw=Buffer.from(data.content.replace(/\s/g,''),'base64').toString('utf8')
    if(entry.kind==='dependencies')packageText=raw.slice(0,9000)
    const excerpt=sanitizeExcerpt(raw,Math.min(MAX_EXCERPT,budget))
    if(!excerpt.trim())continue
    budget-=excerpt.length
    files.push({path:entry.path,kind:entry.kind,excerpt})
  }
  if(!files.length)throw new Error('GITHUB_NO_FRONTEND')
  const frameworks=frameworksFrom(packageText,files)
  const warning='Análisis estático de archivos públicos: no ejecuta el proyecto ni confirma su aspecto visual, rendimiento o funcionamiento real. Para una auditoría visual adjunta capturas.'
  const result={
    url,owner,name,branch,description:String(info.description||'').slice(0,220),
    frameworks,fileCount:tree.tree.filter(x=>x.type==='blob').length,
    inspectedFiles:files,inspected:'source_code_only',truncated:Boolean(tree.truncated),
    warning:warning+(tree.truncated?' El árbol de GitHub está truncado: revisión parcial.':'')
  }
  if(useCache) {
    if(repoCache.size>24)repoCache.clear()
    repoCache.set(url,{at:Date.now(),value:result})
  }
  return result
}

export function publicRepositorySummary(repository){
  return {
    url:repository.url,name:repository.name,owner:repository.owner,branch:repository.branch,
    description:repository.description,frameworks:repository.frameworks,
    fileCount:repository.fileCount,
    files:repository.inspectedFiles.map(f=>({path:f.path,kind:f.kind})),
    inspected:repository.inspected,truncated:repository.truncated,warning:repository.warning
  }
}

export function githubPublicError(error){
  const code=error instanceof Error?error.message:''
  const map={
    GITHUB_INVALID:[400,'Pega un enlace HTTPS a la raíz de un repositorio: https://github.com/usuario/proyecto.'],
    GITHUB_PRIVATE:[422,'No se pudo acceder al repositorio públicamente. Los proyectos privados requieren autorización de lectura; por ahora puedes enviar capturas.'],
    GITHUB_UNAVAILABLE:[502,'GitHub no respondió o no permitió leer el repositorio. Inténtalo de nuevo.'],
    GITHUB_RATE_LIMIT:[429,'Se alcanzó un límite de consulta de GitHub. Inténtalo más tarde.'],
    GITHUB_TOO_LARGE:[422,'El repositorio contiene demasiados archivos para una revisión ligera. Comparte capturas o un proyecto más pequeño.'],
    GITHUB_NO_FRONTEND:[422,'No encontramos archivos de interfaz legibles en este repositorio. Puedes adjuntar capturas para pedir mejoras.']
  }
  return map[code]||[422,'No fue posible revisar el código de este repositorio.']
}
