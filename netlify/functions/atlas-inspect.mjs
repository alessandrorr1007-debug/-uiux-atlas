import { json, sameOrigin, parseJson, takeRateLimit, inspectPublicUrl, publicError } from './lib/security.mjs'

export default async function handler(request, context = {}) {
  if (request.method !== 'POST') return json({error:'Método no permitido.'},405,{allow:'POST'})
  if (!sameOrigin(request)) return json({error:'Solicitud no autorizada desde otro origen.'},403)
  const limit=takeRateLimit('inspect',context.ip,8,60_000)
  if (!limit.ok) return json({error:'Demasiados análisis. Inténtalo más tarde.'},429,{'retry-after':String(limit.retryAfter)})
  try {
    const body=await parseJson(request,3000)
    const site=await inspectPublicUrl(body?.url)
    return json({site})
  } catch(error) {
    const [status,message]=publicError(error)
    return json({error:message},status)
  }
}

export const config = { path: '/api/atlas/inspect', rateLimit: {windowLimit:10,windowSize:60,aggregateBy:['ip','domain']} }
