import {json,sameOrigin,parseJson,takeRateLimit} from './lib/security.mjs'
import {inspectPublicRepository,publicRepositorySummary,githubPublicError} from './lib/github-repo.mjs'

export default async function handler(request,context={}){
  if(request.method!=='POST')return json({error:'Método no permitido.'},405,{allow:'POST'})
  if(!sameOrigin(request))return json({error:'Solicitud no autorizada desde otro origen.'},403)
  const limit=takeRateLimit('github',context.ip,3,60_000)
  if(!limit.ok)return json({error:'Límite temporal de lecturas GitHub alcanzado. Prueba más tarde.'},429,{'retry-after':String(limit.retryAfter)})
  try{
    const data=await parseJson(request,1800)
    const result=await inspectPublicRepository(data?.url)
    return json({repository:publicRepositorySummary(result)})
  }catch(error){
    if(error?.message==='PAYLOAD_TOO_LARGE')return json({error:'Solicitud demasiado larga.'},413)
    if(error?.message==='CONTENT_TYPE'||error?.message==='INVALID_JSON')return json({error:'Envía un enlace GitHub en formato JSON.'},400)
    const [status,message]=githubPublicError(error)
    return json({error:message},status)
  }
}

export const config = {path:'/api/atlas/github',rateLimit:{windowLimit:4,windowSize:60,aggregateBy:['ip','domain']}}
