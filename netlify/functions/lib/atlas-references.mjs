import {inspectPublicUrl,validatePublicUrl,publicError} from './security.mjs'
import {isGitHubRepoUrl,parseGitHubRepoUrl,inspectPublicRepository,publicRepositorySummary,githubPublicError} from './github-repo.mjs'

export const MAX_REFERENCE_LINKS=4

export function referencePlatform(value){
  let hostname=''
  try{hostname=new URL(value).hostname.toLowerCase().replace(/^www\./,'')}catch{return 'Web'}
  if(hostname==='github.com')return 'GitHub'
  if(hostname==='instagram.com')return 'Instagram'
  if(hostname==='linkedin.com'||hostname==='lnkd.in')return 'LinkedIn'
  if(hostname==='pinterest.com'||hostname==='pin.it')return 'Pinterest'
  if(hostname==='behance.net')return 'Behance'
  if(hostname==='dribbble.com')return 'Dribbble'
  if(hostname==='tiktok.com')return 'TikTok'
  if(hostname==='facebook.com'||hostname==='fb.com')return 'Facebook'
  return 'Web'
}

export function normalizeReferenceUrls(sourceUrls,legacyUrl='',message=''){
  const candidates=Array.isArray(sourceUrls)&&sourceUrls.length?sourceUrls
    :typeof legacyUrl==='string'&&legacyUrl.trim()?[legacyUrl]
    :(typeof message==='string'?Array.from(message.matchAll(/https:\/\/[^\s<>"']+/gi)).map(x=>x[0].replace(/[.,;)\]]+$/,'')):[])
  if(candidates.length>MAX_REFERENCE_LINKS)throw new Error('LINK_LIMIT')
  const unique=new Set()
  for(const candidate of candidates){
    if(typeof candidate!=='string'||candidate.length>700)throw new Error('LINK_INVALID')
    let value
    if(isGitHubRepoUrl(candidate)){
      try{value=parseGitHubRepoUrl(candidate).url}catch{throw new Error('LINK_INVALID')}
    }else{
      try{value=validatePublicUrl(candidate).toString()}catch{throw new Error('LINK_INVALID')}
    }
    unique.add(value)
  }
  return [...unique]
}

const LIMIT_GITHUB='Para mantener la consulta rápida, solo se lee el código del primer repositorio; los demás quedan como referencias de enlace.'
const SOCIAL_NOTE='El contenido visual de publicaciones sociales puede estar restringido. Si no aparece una imagen pública, adjunta una captura para que Atlas IA pueda analizar el diseño.'

export async function analyzePublicReferences(urls,{
  inspectWebsite=inspectPublicUrl,
  inspectRepository=inspectPublicRepository
}={}){
  let firstGitHub=false
  const tasks=urls.slice(0,MAX_REFERENCE_LINKS).map(async url=>{
    const platform=referencePlatform(url)
    if(platform==='GitHub'){
      if(firstGitHub)return {url,platform,kind:'github',status:'link_only',warning:LIMIT_GITHUB}
      firstGitHub=true
      try{
        const repository=await inspectRepository(url)
        return {url,platform,kind:'github',status:'read',repository,warning:repository.warning}
      }catch(error){
        return {url,platform,kind:'github',status:'limited',warning:githubPublicError(error)[1]}
      }
    }
    const kind=platform==='Web'?'web':'social'
    try{
      const site=await inspectWebsite(url)
      const hasInfo=Boolean(site.title||site.description||site.headings?.length||site.previewImage)
      const limited=site.access==='limited'||!hasInfo
      return {url,platform,kind,status:limited?'limited':'metadata',
        site,warning:(limited?site.warning||'No se pudo extraer información pública.':site.warning)+
          (kind==='social'?' '+SOCIAL_NOTE:'')}
    }catch(error){
      return {url,platform,kind,status:'limited',
        warning:publicError(error)[1]+(kind==='social'?' '+SOCIAL_NOTE:'')}
    }
  })
  // Parallel reads avoid an unnecessary waterfall before calling the model.
  return Promise.all(tasks)
}

export function publicReferenceSummaries(references){
  return references.map(reference=>({
    url:reference.url,
    kind:reference.kind,
    platform:reference.platform,
    status:reference.status,
    title:reference.site?.title||reference.repository?.name||'',
    description:reference.site?.description||reference.repository?.description||'',
    previewImage:reference.site?.previewImage||'',
    repository:reference.repository?publicRepositorySummary(reference.repository):null,
    warning:reference.warning
  }))
}

export function referenceInputError(error){
  const code=error instanceof Error?error.message:''
  if(code==='LINK_LIMIT')return [400,'Agrega como máximo cuatro enlaces de referencia.']
  if(code==='LINK_INVALID')return [400,'Cada enlace debe ser una URL pública HTTPS válida, sin credenciales.']
  return [400,'No fue posible procesar los enlaces de referencia.']
}
