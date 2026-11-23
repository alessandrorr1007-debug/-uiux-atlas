import { lookup } from 'node:dns/promises'
import https from 'node:https'
import { isIP } from 'node:net'

const buckets = new Map()
const MAX_HTML_BYTES = 180_000

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...headers }
  })
}

export function sameOrigin(request) {
  const origin = request.headers.get('origin')
  if (!origin || request.headers.get('sec-fetch-site') === 'cross-site') return false
  try { return new URL(origin).origin === new URL(request.url).origin } catch { return false }
}

export async function parseJson(request, maxBytes = 1_700_000) {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) throw new Error('CONTENT_TYPE')
  const declared = Number(request.headers.get('content-length') || 0)
  if (declared > maxBytes) throw new Error('PAYLOAD_TOO_LARGE')
  const reader = request.body?.getReader()
  if (!reader) throw new Error('BODY_REQUIRED')
  let size = 0
  const chunks = []
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.length
      if (size > maxBytes) { await reader.cancel(); throw new Error('PAYLOAD_TOO_LARGE') }
      chunks.push(value)
    }
    const all = new Uint8Array(size)
    let cursor = 0
    for (const chunk of chunks) { all.set(chunk,cursor); cursor += chunk.length }
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(all))
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof TypeError) throw new Error('INVALID_JSON')
    throw error
  } finally { try { reader.releaseLock() } catch { /* reader might have been canceled */ } }
}

export function takeRateLimit(kind, ip, max, windowMs) {
  const now = Date.now()
  const key = kind + ':' + String(ip || 'unknown').slice(0,80)
  if (buckets.size > 10000) {
    for (const [k,v] of buckets) if (v.until < now) buckets.delete(k)
  }
  const current = buckets.get(key)
  if (!current || current.until <= now) { buckets.set(key,{count:1,until:now + windowMs}); return { ok:true } }
  if (current.count >= max) return {ok:false,retryAfter:Math.ceil((current.until - now)/1000)}
  current.count += 1
  return {ok:true}
}

// Prevent SSRF: HTTPS/443 only, DNS hostnames only, reject reserved IPs,
// pin the validated public IPv4 to the actual TLS request, and validate redirects.
export function validatePublicUrl(input) {
  if (typeof input !== 'string' || input.length > 700 || input.trim().length < 9) throw new Error('URL_INVALID')
  let url
  try { url = new URL(input.trim()) } catch { throw new Error('URL_INVALID') }
  if (url.protocol !== 'https:' || url.username || url.password || (url.port && url.port !== '443')) throw new Error('URL_UNSAFE')
  const host = url.hostname.toLowerCase()
  if (isIP(host) || host.indexOf('.') === -1 || host.endsWith('.local') || host.endsWith('.localhost') ||
    host.endsWith('.internal') || host.endsWith('.test') || host.endsWith('.invalid') || host.endsWith('.onion') ||
    host.includes('..') || host.length > 253 || !/^[a-z0-9.-]+$/.test(host)) throw new Error('URL_UNSAFE')
  if (/(?:^|[?&])(token|key|password|secret|session|auth|code)=/i.test(url.search)) throw new Error('URL_UNSAFE')
  url.hash = ''
  return url
}

export function isPublicIPv4(ip) {
  if (!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(ip)) return false
  const n = ip.split('.').map(Number)
  if (n.some(v=>v>255)) return false
  const [a,b,c] = n
  if (a === 0 || a === 10 || a === 127 || a >= 224) return false
  if (a === 100 && b >= 64 && b <= 127) return false
  if (a === 169 && b === 254) return false
  if (a === 172 && b >= 16 && b <= 31) return false
  if (a === 192 && (b === 0 || b === 168 || (b === 88 && c === 99))) return false
  if (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) return false
  if (a === 203 && b === 0 && c === 113) return false
  return true
}

async function resolvePublic(host) {
  const answers = await lookup(host,{family:4,all:true,verbatim:true})
  if (!answers.length || answers.some(a=>!isPublicIPv4(a.address))) throw new Error('URL_UNSAFE')
  return answers[0].address
}

function fetchPinned(url, publicIP) {
  return new Promise((resolve,reject)=>{
    const req = https.request(url, {
      method:'GET',
      lookup: (_host,_options,cb)=>cb(null,publicIP,4),
      headers:{
        'user-agent':'UIUX-Atlas-IA/1.0 (+https://uiux-atlas.netlify.app/)',
        accept:'text/html, text/plain;q=0.8',
        'accept-encoding':'identity'
      },
      timeout:6500
    },res=>{
      const status=res.statusCode || 0
      if ([301,302,303,307,308].includes(status)) {
        const location=res.headers.location
        res.resume()
        return resolve({redirect:location})
      }
      if (status<200 || status>=300) {res.resume();return reject(new Error('URL_UNAVAILABLE'))}
      const type=String(res.headers['content-type']||'').toLowerCase()
      if (!type.includes('text/html') && !type.includes('text/plain')) {res.resume();return reject(new Error('URL_UNSUPPORTED'))}
      let bytes=0
      const chunks=[]
      res.on('data',part=>{
        bytes+=part.length
        if (bytes>MAX_HTML_BYTES) { res.destroy(new Error('URL_TOO_LARGE')); return }
        chunks.push(part)
      })
      res.on('end',()=>resolve({html:Buffer.concat(chunks).toString('utf8'), finalUrl:url.toString()}))
      res.on('error',reject)
    })
    req.on('timeout',()=>req.destroy(new Error('URL_TIMEOUT')))
    req.on('error',reject)
    req.end()
  })
}

const decode = str=>String(str).replace(/&(?:amp|lt|gt|quot|apos|nbsp|#39|#x27);/gi,key=>({
  '&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'",'&nbsp;':' ','&#39;':"'",'&#x27;':"'"
})[key.toLowerCase()] ?? ' ')
const cleanText = html=>decode(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ')
 .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ')
 .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi,' ')
 .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi,' ')
 .replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim())

export function extractPageInfo(html, url) {
  const title=cleanText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||'').slice(0,160)
  const metas=[...html.matchAll(/<meta\b[^>]*>/gi)].map(x=>x[0])
  const getMeta=name=>{
    const tag=metas.find(x=>new RegExp('(?:name|property)\\s*=\\s*["\\\']'+name+'["\\\']','i').test(x))
    return tag ? decode(tag.match(/\bcontent\s*=\s*(?:"([^"]*)"|'([^']*)')/i)?.[1]||tag.match(/\bcontent\s*=\s*'([^']*)'/i)?.[1]||'').slice(0,330) : ''
  }
  const description=getMeta('description')||getMeta('og:description')
  // An optional public Open Graph thumbnail, not a rendered screenshot.
  // Reject data, private networks, unsafe ports and secret-bearing URLs.
  const rawPreview=getMeta('og:image')||getMeta('twitter:image')
  let previewImage=''
  if(rawPreview) {
    try { previewImage=validatePublicUrl(new URL(rawPreview,url).toString()).toString().slice(0,700) }
    catch { /* No safe public thumbnail declared */ }
  }
  const headings=[...html.matchAll(/<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/gi)].map(x=>cleanText(x[1]).slice(0,130)).filter(Boolean).slice(0,14)
  const body=cleanText(html).slice(0,4500)
  const socialHost=/(instagram\.com|facebook\.com|linkedin\.com|tiktok\.com)/i.test(new URL(url).hostname)
  const loginShell=/log in to instagram|inicia sesi[oó]n|login • instagram|sign in to linkedin|join linkedin|log in to tiktok/i
  const blocked=socialHost &&
    (!body || loginShell.test(title+' '+body.slice(0,450)) || (!description && headings.length===0 && body.length<160))
  return {
    url, title, description, headings, excerpt:body, previewImage,
    inspected:'html_only', access:blocked?'limited':'metadata',
    warning:blocked
      ? 'La plataforma parece restringir la lectura pública. Sube una captura de la publicación para analizar colores y diseño.'
      : 'Lectura de HTML público: no equivale a una auditoría visual, del CSS o de flujos privados.'
  }
}

export async function inspectPublicUrl(rawUrl) {
  let url = validatePublicUrl(rawUrl)
  for (let redirect=0;redirect<3;redirect++) {
    const publicIP = await resolvePublic(url.hostname)
    const result=await fetchPinned(url,publicIP)
    if (result.redirect) {
      url=validatePublicUrl(new URL(result.redirect,url).toString())
      continue
    }
    return extractPageInfo(result.html,result.finalUrl)
  }
  throw new Error('URL_REDIRECT_LIMIT')
}

export function publicError(error) {
  const code=error instanceof Error ? error.message : ''
  const mapping={
    CONTENT_TYPE:[415,'Envía los datos en formato JSON.'],
    PAYLOAD_TOO_LARGE:[413,'La solicitud supera el límite. Reduce las imágenes o el historial.'],
    INVALID_JSON:[400,'Los datos enviados no son válidos.'],
    BODY_REQUIRED:[400,'La solicitud está vacía.'],
    URL_INVALID:[400,'Introduce una URL HTTPS válida.'],
    URL_UNSAFE:[400,'La dirección no es una página web pública permitida.'],
    URL_UNAVAILABLE:[422,'No se pudo acceder públicamente a esa página. Puedes subir una captura.'],
    URL_UNSUPPORTED:[422,'Este enlace no ofrece contenido HTML público para analizar. Sube una captura.'],
    URL_TOO_LARGE:[422,'La página devuelve demasiado contenido. Sube una captura.'],
    URL_TIMEOUT:[504,'La página tardó demasiado. Prueba con una captura.'],
    URL_REDIRECT_LIMIT:[422,'El enlace tiene demasiadas redirecciones.']
  }
  return mapping[code] || [422,'No se pudo leer la página. Puedes adjuntar una captura para continuar.']
}
