import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight, ArrowUp, Bot, BrainCircuit, Check, CheckCheck, CircleAlert, Clipboard,
  FileImage, Github, Globe2, ImagePlus, Link2, LoaderCircle, Palette, Plus, ExternalLink, RefreshCw,
  Send, ShieldCheck, Sparkles, WandSparkles, X
} from 'lucide-react'
import { components } from '../data/components'
import type { ToolId } from '../types'
import {
  prepareAtlasImage, suggestAtlasPatterns, composeAtlasPrompt, isGitHubLink, describeAtlasRequestError, parseAtlasLink, MAX_ATLAS_LINKS,
  type AtlasMode, type AtlasImage, type AtlasMessage, type AtlasReply, type SiteInfo, type GitHubRepositoryInfo, type AtlasLink, type AtlasReferenceSummary
} from '../lib/atlas-ai'

type Status = 'loading' | 'configured' | 'missing' | 'unavailable'
const SUGGESTIONS = {
  create: [
    'Quiero una web para una pollería con delivery y pedidos por WhatsApp.',
    'Diseña una tienda online elegante con carrito y catálogo.',
    'Quiero una aplicación para gestionar mis clases y horarios.'
  ],
  improve: [
    'Quiero que mi web se vea más moderna y futurista, sin perder funciones.',
    'Ayúdame a mejorar navegación, responsive y experiencia de compra.',
    'Mi web no está publicada: revisa mi repositorio GitHub y recomiéndame mejoras UI/UX.'
  ]
} satisfies Record<AtlasMode, string[]>

function StatusBanner({ status }: { status: Status }) {
  if(status === 'configured') return <div className="atlas-status online"><Check size={15}/> Clave de Groq detectada en Netlify. La conexión se comprobará al enviar una consulta.</div>
  if(status === 'loading') return <div className="atlas-status"><LoaderCircle size={15} className="atlas-spin"/> Comprobando conexión de Atlas IA…</div>
  if(status === 'missing') return <div className="atlas-status missing"><CircleAlert size={15}/> Falta GROQ_API_KEY en Netlify. El chat muestra recomendaciones locales y permite generar prompts sin IA.</div>
  return <div className="atlas-status missing"><CircleAlert size={15}/> La función de Netlify no responde en este entorno. Usa la vista local o ejecuta Netlify Dev.</div>
}

type AtlasIAProps = {
  selectedPatternIds: string[]
  onSelectedPatternIdsChange: (value: string[] | ((previous: string[]) => string[])) => void
  initialDraft?: string
}

export default function AtlasIA({ selectedPatternIds: selected, onSelectedPatternIdsChange: setSelected, initialDraft = '' }: AtlasIAProps) {
  const [mode,setMode] = useState<AtlasMode>('create')
  const [status,setStatus] = useState<Status>('loading')
  const [draft,setDraft] = useState(initialDraft)
  const [linkDraft,setLinkDraft] = useState('')
  const [links,setLinks] = useState<AtlasLink[]>([])
  const [photos,setPhotos] = useState<AtlasImage[]>([])
  const [colors,setColors] = useState<string[]>([])
  const [messages,setMessages] = useState<AtlasMessage[]>([])
  const [suggested,setSuggested] = useState<string[]>([])
  const [prompt,setPrompt] = useState('')
  const [tool,setTool] = useState<ToolId>('Codex')
  const [site,setSite] = useState<SiteInfo | null>(null)
  const [repository,setRepository] = useState<GitHubRepositoryInfo | null>(null)
  const [busy,setBusy] = useState(false)
  const [readingUrl,setReadingUrl] = useState<string | null>(null)
  const [notice,setNotice] = useState('')
  const [copied,setCopied] = useState(false)
  const fileRef=useRef<HTMLInputElement>(null)
  const conversationEnd=useRef<HTMLDivElement>(null)
  const promptRef=useRef<HTMLDivElement>(null)
  const intro = mode==='create'
    ? 'Describe tu idea y añade enlaces de inspiración, publicaciones o imágenes para orientar el diseño.'
    : 'Comparte enlaces a webs, GitHub o publicaciones, y sube capturas para mejorar el diseño sin perder funciones.'
  useEffect(()=>{
    const controller=new AbortController()
    fetch('/api/atlas/chat',{signal:controller.signal})
      .then(async result=>{
        if(!result.ok) throw new Error('not-available')
        const data=await result.json() as {configured?:boolean}
        setStatus(data.configured?'configured':'missing')
      })
      .catch(()=>{if(!controller.signal.aborted)setStatus('unavailable')})
    return ()=>controller.abort()
  },[])
  useEffect(()=>{conversationEnd.current?.scrollIntoView({behavior:'smooth',block:'end'})},[messages.length,busy])
  const reset=(preservePatterns = false)=>{
    setMessages([]);setPhotos([]);setSuggested([])
    if(!preservePatterns)setSelected([])
    setPrompt('');setSite(null);setRepository(null);setLinks([]);setLinkDraft('');setReadingUrl(null);setNotice('');setDraft('');setColors([])
    if(fileRef.current)fileRef.current.value=''
  }
  const chooseMode=(next:AtlasMode)=>{if(mode!==next){setMode(next);reset(true)}}
  const onFiles=async (input:FileList|null)=>{
    if(!input?.length)return
    const allowed=Math.max(0,3-photos.length)
    if(allowed===0){setNotice('Máximo tres imágenes por consulta. Elimina una para subir otra.');return}
    if(input.length>allowed)setNotice('Se cargarán solo las primeras '+allowed+' imágenes.')
    const added:AtlasImage[]=[]
    for(const file of Array.from(input).slice(0,allowed)){
      try{added.push(await prepareAtlasImage(file))}
      catch(e){setNotice(e instanceof Error?e.message:'No se pudo procesar una imagen.')}
    }
    setPhotos(prev=>[...prev,...added].slice(0,3))
    setColors(prev=>[...new Set([...prev,...added.flatMap(p=>p.palette)])].slice(0,6))
    if(fileRef.current)fileRef.current.value=''
  }
  const togglePattern=(id:string)=>{
    setSelected(prev=>prev.includes(id)?prev.filter(p=>p!==id):[...prev,id].slice(0,16))
    setPrompt('')
  }
  const copy=async(value:string)=>{
    try{await navigator.clipboard.writeText(value);setCopied(true);setTimeout(()=>setCopied(false),1600)}
    catch{setNotice('No se pudo copiar automáticamente. Selecciona el texto del prompt para copiarlo.')}
  }
  const addLink=()=>{
    try{
      const item=parseAtlasLink(linkDraft)
      if(links.some(link=>link.url===item.url)){setNotice('Este enlace ya está agregado.');return}
      if(links.length>=MAX_ATLAS_LINKS){setNotice('Puedes agregar hasta cuatro enlaces. Elimina uno para añadir otro.');return}
      setLinks(previous=>[...previous,item])
      setLinkDraft('')
      setNotice('')
    }catch(error){setNotice(error instanceof Error?error.message:'No se pudo agregar el enlace.')}
  }
  const readLink=async (item:AtlasLink):Promise<AtlasLink>=>{
    const github=isGitHubLink(item.url)
    try{
      const response=await fetch(github?'/api/atlas/github':'/api/atlas/inspect',{
        method:'POST',headers:{'content-type':'application/json'},
        body:JSON.stringify({url:item.url})
      })
      const data=await response.json() as {site?:SiteInfo;repository?:GitHubRepositoryInfo;error?:string}
      if(!response.ok)throw new Error(data.error||'No fue posible leer el enlace.')
      if(github&&data.repository)return {...item,status:'read',repository:data.repository,
        title:data.repository.name,description:data.repository.description,warning:data.repository.warning}
      if(data.site)return {...item,status:data.site.access==='limited'?'limited':'metadata',
        site:data.site,title:data.site.title,description:data.site.description,
        previewImage:data.site.previewImage,warning:data.site.warning}
      throw new Error('La plataforma no devolvió información pública.')
    }catch(error){
      return {...item,status:'limited',
        warning:(error instanceof Error?error.message:'No se pudo consultar el enlace.')+
        (item.kind==='social'?' Si quieres analizar el diseño, adjunta una captura de la publicación.':'')}
    }
  }
  const inspect=async(item:AtlasLink)=>{
    if(readingUrl||busy)return
    setReadingUrl(item.url);setNotice('')
    setLinks(previous=>previous.map(link=>link.url===item.url?{...link,status:'reading' as const}:link))
    const result=await readLink(item)
    setLinks(previous=>previous.map(link=>link.url===item.url?result:link))
    if(result.site)setSite(result.site)
    if(result.repository)setRepository(result.repository)
    setReadingUrl(null)
  }
  const removeLink=(removeUrl:string)=>{
    setLinks(previous=>previous.filter(item=>item.url!==removeUrl))
    // A stale primary reference must not appear in a later local prompt.
    setSite(null);setRepository(null)
  }
  const asSummary=(item:AtlasLink):AtlasReferenceSummary=>({
    url:item.url,kind:item.kind,platform:item.platform,
    status:item.status==='added'||item.status==='reading'?'link_only':item.status,
    title:item.title||'',description:item.description||'',
    previewImage:item.previewImage,repository:item.repository||null,
    warning:item.warning||'Enlace proporcionado, aún no se ha inspeccionado su contenido.'
  })
  const sameUrl=(a:string,b:string)=>a.replace(/\/$/,'')===b.replace(/\/$/,'')
  const mergeServerReferences=(items:AtlasLink[],results:AtlasReferenceSummary[]):AtlasLink[]=>items.map(item=>{
    const found=results.find(ref=>sameUrl(ref.url,item.url))
    return found?{...item,status:found.status,title:found.title,description:found.description,
      previewImage:found.previewImage,warning:found.warning,repository:found.repository||undefined}:item
  })
  const send=async(intent:'advise'|'prompt')=>{
    if(busy||readingUrl)return
    let selectedLinks=links
    if(linkDraft.trim()){
      try{
        const entered=parseAtlasLink(linkDraft)
        if(!selectedLinks.some(item=>item.url===entered.url)){
          if(selectedLinks.length>=MAX_ATLAS_LINKS)throw new Error('Máximo cuatro enlaces de referencia.')
          selectedLinks=[...selectedLinks,entered]
          setLinks(selectedLinks)
        }
        setLinkDraft('')
      }catch(error){
        setNotice(error instanceof Error?error.message:'Comprueba el enlace antes de enviar.')
        return
      }
    }
    const content=draft.trim()
    if(intent==='advise'&&!content&&!photos.length&&!selectedLinks.length){
      setNotice('Escribe tu idea, agrega un enlace o adjunta una imagen.')
      return
    }
    setNotice('');setCopied(false);setBusy(true)
    const userText=content||(
      intent==='prompt'?'Genera el prompt final según nuestra conversación.':
      photos.length?'Analiza estas imágenes y recomiéndame un diseño.':
      'Analiza mis enlaces y recomiéndame un diseño.'
    )
    const newMessage:AtlasMessage={role:'user',content:userText,attachments:photos.map(photo=>photo.name)}
    setMessages(previous=>[...previous,newMessage])
    try{
      // In local mode, inspect available metadata without involving Groq.
      // Social platforms may limit public HTML; never claim a visual review.
      let readyLinks=selectedLinks
      if(status!=='configured'&&readyLinks.some(item=>item.status==='added')){
        const checked=await Promise.all(readyLinks.map(item=>
          item.status==='added'?readLink(item):Promise.resolve(item)
        ))
        readyLinks=checked
        setLinks(checked)
      }
      const activeRepository=readyLinks.find(item=>item.repository)?.repository||repository
      const activeSite=readyLinks.find(item=>item.site)?.site||site
      const context=[
        ...messages.filter(item=>item.role==='user').map(item=>item.content),
        userText,...readyLinks.map(item=>item.url+' '+(item.title||'')+' '+(item.description||'')),
        ...(activeRepository?.files.map(file=>file.path)||[])
      ].join(' ')
      const localMatches=suggestAtlasPatterns(context,selected,7)
      const localIds=selected.length?selected:localMatches.map(item=>item.id)
      if(status!=='configured'){
        const summaries=readyLinks.map(asSummary)
        if(intent==='prompt'){
          setPrompt(composeAtlasPrompt(mode,context,localIds,tool,colors,activeSite,activeRepository,summaries))
          setSuggested(localIds)
          setMessages(previous=>[...previous,{
            role:'assistant',content:'Prompt local preparado para '+tool+'. Usé los enlaces disponibles y el catálogo de 406 patrones; no es una respuesta generada por IA.'
          }])
        }else{
          setSuggested(localIds)
          setMessages(previous=>[...previous,{
            role:'assistant',
            content:'Consulta local: agregaste '+readyLinks.length+' referencia(s) y '+photos.length+' imagen(es). Te recomiendo explorar '+
              localMatches.map(item=>item.name).join(', ')+
              '. Pulsa «Generar prompt» para incorporar estos enlaces. Para analizar capturas visualmente mediante IA, configura Groq.'
          }])
        }
      }else{
        const payload=JSON.stringify({
          mode,intent,message:userText,
          history:messages.slice(-10).map(item=>({role:item.role,content:item.content})),
          images:photos.map(photo=>photo.dataUrl),colors,
          sourceUrls:readyLinks.map(item=>item.url),selectedIds:localIds,tool
        })
        if(new TextEncoder().encode(payload).length>1_600_000)
          throw new Error('Hay demasiados datos adjuntos. Reduce las imágenes y vuelve a enviar.')
        const response=await fetch('/api/atlas/chat',{
          method:'POST',headers:{'content-type':'application/json'},body:payload,
          signal:typeof AbortSignal.timeout==='function'?AbortSignal.timeout(48_000):undefined
        })
        const answer=await response.json().catch(()=>null) as (AtlasReply & {error?:string}) | null
        if(!response.ok)
          throw new Error(answer?.error||'Atlas IA recibió un error HTTP '+response.status+'. Puedes reintentar con menos referencias.')
        if(!answer||typeof answer.reply!=='string')
          throw new Error('Netlify devolvió una respuesta inesperada. Reintenta o utiliza el prompt local.')
        setSuggested(answer.patternIds||[])
        if(answer.palette?.length)setColors(answer.palette)
        if(answer.site)setSite(answer.site)
        if(answer.repository)setRepository(answer.repository)
        if(answer.references?.length)setLinks(current=>mergeServerReferences(current,answer.references||[]))
        if(answer.websiteNotice)setNotice(answer.websiteNotice)
        if(intent==='prompt'){
          const summaries=answer.references?.length?answer.references:readyLinks.map(asSummary)
          setPrompt(answer.prompt||composeAtlasPrompt(mode,context,localIds,tool,colors,
            answer.site||activeSite,answer.repository||activeRepository,summaries))
        }
        setMessages(previous=>[...previous,{role:'assistant',content:answer.reply}])
      }
      setDraft('');setPhotos([])
      if(fileRef.current)fileRef.current.value=''
      if(intent==='prompt')setTimeout(()=>promptRef.current?.scrollIntoView({behavior:'smooth',block:'nearest'}),100)
    }catch(error){
      const detail=describeAtlasRequestError(error)
      const fallback=[...messages.filter(m=>m.role==='user').map(m=>m.content),userText].join(' ')
      const ids=selected.length?selected:suggestAtlasPatterns(fallback,[],7).map(item=>item.id)
      if(intent==='prompt'){
        setPrompt(composeAtlasPrompt(mode,fallback,ids,tool,colors,site,repository,selectedLinks.map(asSummary)))
      }
      setSuggested(ids)
      setMessages(previous=>[...previous,{
        role:'assistant',
        content:'No pude completar el análisis con Groq. '+detail+' Conservé tus imágenes y enlaces. Puedes reintentar o generar un prompt local.'
      }])
      setNotice(detail)
    }finally{setBusy(false)}
  }
  const generateLocal=()=>{
    let selectedLinks=links
    if(linkDraft.trim()){
      try{
        const entered=parseAtlasLink(linkDraft)
        if(!selectedLinks.some(link=>link.url===entered.url)){
          if(selectedLinks.length>=MAX_ATLAS_LINKS)throw new Error('Puedes agregar hasta cuatro enlaces.')
          selectedLinks=[...selectedLinks,entered]
          setLinks(selectedLinks)
        }
        setLinkDraft('')
      }catch(error){setNotice(error instanceof Error?error.message:'Verifica el enlace.');return}
    }
    const description=[...messages.filter(m=>m.role==='user').map(m=>m.content),draft,
      ...selectedLinks.map(item=>item.url+' '+(item.title||''))].join(' ').trim()
    const ids=selected.length?selected:suggestAtlasPatterns(description,[],7).map(i=>i.id)
    setPrompt(composeAtlasPrompt(mode,description,ids,tool,colors,site,repository,selectedLinks.map(asSummary)))
    setSuggested(ids);setNotice('Prompt generado localmente sin consumir cuota de IA.')
    setTimeout(()=>promptRef.current?.scrollIntoView({behavior:'smooth',block:'nearest'}),100)
  }
  const recommendations=[...components.filter(item=>selected.includes(item.id)),...components.filter(item=>suggested.includes(item.id)&&!selected.includes(item.id))].slice(0,16)

  return <section className="atlas-ai">
    <header className="atlas-ai-heading">
      <div className="atlas-ai-heading__symbol"><BrainCircuit size={27}/></div>
      <div><span className="atlas-ai-eyebrow">UIUX ATLAS · ASISTENTE DE DISEÑO</span><h1>Atlas <span>IA</span></h1><p>Convierte ideas y referencias en proyectos bien definidos.</p></div>
      <button type="button" className="atlas-ai-reset" onClick={()=>reset()} title="Iniciar conversación nueva"><RefreshCw size={16}/><span>Nueva conversación</span></button>
    </header>
    <StatusBanner status={status}/>
    {selected.length>0&&<div className="atlas-ai-imported"><Sparkles size={15}/><span><strong>{selected.length} {selected.length===1?'patrón listo':'patrones listos'} para tu proyecto.</strong> Ya puedes conversar y generar tu prompt aquí, sin usar otro constructor.</span></div>}
    <div className="atlas-ai-mode-grid" aria-label="Elegir objetivo de Atlas IA">
      <button type="button" className={'atlas-ai-mode'+(mode==='create'?' active':'')} aria-pressed={mode==='create'} onClick={()=>chooseMode('create')}>
        <span className="atlas-ai-mode__icon"><Sparkles size={22}/></span>
        <strong>Crear proyecto</strong><small>Inspírate con enlaces, publicaciones e imágenes</small>
        <ArrowRight size={17} className="atlas-ai-mode__arrow"/>
      </button>
      <button type="button" className={'atlas-ai-mode'+(mode==='improve'?' active':'')} aria-pressed={mode==='improve'} onClick={()=>chooseMode('improve')}>
        <span className="atlas-ai-mode__icon"><WandSparkles size={22}/></span>
        <strong>Mejorar proyecto</strong><small>Combina web, GitHub, publicaciones y capturas</small>
        <ArrowRight size={17} className="atlas-ai-mode__arrow"/>
      </button>
    </div>
    <div className="atlas-ai-workspace">
      <div className="atlas-ai-chat">
        <div className="atlas-ai-chat__title"><span><Bot size={18}/> Conversación · {mode==='create'?'Crear proyecto':'Mejorar proyecto'}</span><span className="atlas-ai-chat__local">{status==='configured'?'Groq · Qwen multimodal':'Modo local disponible'}</span></div>
        <div className="atlas-ai-messages" role="log" aria-live="polite" aria-label="Conversación de Atlas IA">
          {messages.length===0 && <div className="atlas-ai-welcome">
            <div className="atlas-ai-welcome__icon"><BrainCircuit size={25}/></div>
            <h2>{mode==='create'?'¿Qué proyecto tienes en mente?':'¿Qué quieres mejorar de tu web?'}</h2>
            <p>{intro}</p>
            <div className="atlas-ai-suggestions">
              {SUGGESTIONS[mode].map(item=><button type="button" key={item} onClick={()=>setDraft(item)}>{item}<ArrowRight size={14}/></button>)}
            </div>
          </div>}
          {messages.map((msg,index)=><div className={'atlas-ai-message '+(msg.role==='user'?'from-user':'from-ai')} key={index}>
            <div className="atlas-ai-message__avatar">{msg.role==='user'?'T':<BrainCircuit size={15}/>}</div>
            <div className="atlas-ai-message__body">
              <span>{msg.role==='user'?'Tú':'Atlas IA'}{msg.role==='assistant'&&status!=='configured'?' · sugerencia local':''}</span>
              <p>{msg.content}</p>
              {!!msg.attachments?.length&&<small><FileImage size={13}/> {msg.attachments.join(', ')}</small>}
            </div>
          </div>)}
          {busy&&<div className="atlas-ai-thinking"><LoaderCircle size={17} className="atlas-spin"/>{status==='configured'?'Analizando referencias y seleccionando patrones…':'Preparando recomendaciones locales…'}</div>}
          <div ref={conversationEnd}/>
        </div>
        <div className="atlas-ai-compose">
          <label className="atlas-ai-textarea-label" htmlFor="atlas-ai-text">¿Qué te gustaría diseñar o mejorar?</label>
          <textarea id="atlas-ai-text" rows={3} maxLength={2600} value={draft} onChange={event=>setDraft(event.target.value)}
            onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();void send('advise')}}}
            placeholder={mode==='create'?'Ej.: Diseña una web para mi negocio tomando estas referencias visuales…':'Ej.: Mejora la navegación y los colores sin romper las funcionalidades…'} disabled={busy}/>
          <div className="atlas-ai-reference-group" aria-label="Referencias por enlaces">
            <div className="atlas-ai-reference-heading"><span><Link2 size={17}/> Enlaces</span><small>{links.length}/{MAX_ATLAS_LINKS}</small></div>
            <p className="atlas-ai-reference-help"><strong>¿Cómo se agregan?</strong> Copia el enlace de una web, repositorio GitHub o publicación de Instagram, LinkedIn, Pinterest u otra página pública. Pégalo aquí y pulsa <strong>Agregar</strong>. Puedes incluir hasta cuatro enlaces distintos.</p>
            <div className="atlas-ai-link-entry">
              <input aria-label="Pega un enlace público de cualquier plataforma" inputMode="url" type="text"
                autoComplete="off" autoCapitalize="none" spellCheck={false}
                value={linkDraft} maxLength={700}
                onChange={event=>setLinkDraft(event.target.value)}
                onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();addLink()}}}
                disabled={busy||links.length>=MAX_ATLAS_LINKS}
                placeholder="https://instagram.com/p/... o cualquier web"/>
              <button type="button" onClick={addLink} disabled={busy||links.length>=MAX_ATLAS_LINKS||!linkDraft.trim()}><Plus size={15}/> Agregar</button>
            </div>
            <div className="atlas-ai-reference-types"><span>Web pública</span><span>GitHub</span><span>Instagram</span><span>LinkedIn</span><span>Otras</span></div>
            {links.length>0&&<div className="atlas-ai-link-list" aria-label="Enlaces agregados">{links.map(item=>
              <article className="atlas-ai-link-item" key={item.url}>
                <div className="atlas-ai-link-item__top">
                  <div className="atlas-ai-link-item__icon">{item.kind==='github'?<Github size={18}/>:item.kind==='social'?<Link2 size={17}/>:<Globe2 size={17}/>}</div>
                  <div className="atlas-ai-link-item__identity">
                    <strong>{item.platform}</strong>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" title={'Abrir '+item.url}>{item.url}<ExternalLink size={11}/></a>
                  </div>
                  <button type="button" className="atlas-ai-link-item__read" disabled={busy||Boolean(readingUrl)}
                    onClick={()=>void inspect(item)} aria-label={'Consultar información pública de '+item.platform}>
                    {readingUrl===item.url?<LoaderCircle size={16} className="atlas-spin"/>:item.status==='read'||item.status==='metadata'?<Check size={16}/>:<Globe2 size={16}/>}
                  </button>
                  <button type="button" className="atlas-ai-link-item__remove" disabled={busy} onClick={()=>removeLink(item.url)}
                    aria-label={'Quitar enlace '+item.url}><X size={16}/></button>
                </div>
                <div className="atlas-ai-link-item__status">
                  {item.status==='added'?'Enlace agregado · pulsa consultar para comprobar la información pública.':
                   item.status==='reading'?'Consultando la referencia…':
                   item.status==='read'?'Código público de GitHub consultado · no es una vista renderizada.':
                   item.status==='metadata'?'Metadatos o HTML públicos disponibles · no equivale a ver el diseño completo.':
                   'Lectura limitada · utiliza una captura para mostrar cómo se ve.'}
                </div>
                {!!item.title&&<div className="atlas-ai-link-item__title">{item.title}</div>}
                {!!item.description&&<p className="atlas-ai-link-item__description">{item.description.slice(0,175)}</p>}
                {!!item.previewImage&&<div className="atlas-ai-link-item__preview"><img src={item.previewImage}
                  loading="lazy" referrerPolicy="no-referrer" alt={'Miniatura pública asociada al enlace de '+item.platform}
                  onError={event=>{event.currentTarget.style.display='none'}}/>
                  <span>Miniatura pública del enlace; no es una captura verificada.</span></div>}
                {!!item.repository&&<details className="atlas-ai-link-item__files"><summary>{item.repository.files.length} archivos de interfaz consultados</summary>
                  <div>{item.repository.files.map(file=><code key={file.path}>{file.path}</code>)}</div></details>}
                {!!item.warning&&item.status==='limited'&&<p className="atlas-ai-link-item__warning">{item.warning}</p>}
                {item.kind==='social'&&<small className="atlas-ai-link-item__hint">Para analizar la apariencia exacta de esta publicación, añade una captura en «Imágenes».</small>}
              </article>
            )}</div>}
          </div>
          <div className="atlas-ai-reference-group" aria-label="Referencias visuales por imágenes">
            <div className="atlas-ai-reference-heading"><span><ImagePlus size={17}/> Imágenes</span><small>{photos.length}/3</small></div>
            <p className="atlas-ai-reference-help"><strong>¿Cómo se agregan?</strong> Pulsa «Agregar imágenes» y elige hasta tres capturas, logos, diseños o fotos de tu galería (JPG, PNG o WebP). Si una publicación social no puede leerse, sube su captura aquí.</p>
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" multiple hidden onChange={event=>void onFiles(event.target.files)}/>
            <button type="button" className="atlas-ai-attach-btn" disabled={busy||photos.length>=3}
              onClick={()=>fileRef.current?.click()}><ImagePlus size={17}/> Agregar imágenes <span>({photos.length}/3)</span></button>
            {!!photos.length&&<div className="atlas-ai-attachments" aria-label="Imágenes agregadas">
              {photos.map(photo=><div key={photo.id} className="atlas-ai-attachment">
                <img src={photo.dataUrl} alt={'Imagen agregada: '+photo.name}/>
                <span title={photo.name}>{photo.name}</span>
                <button type="button" aria-label={'Quitar imagen '+photo.name} onClick={()=>setPhotos(previous=>previous.filter(p=>p.id!==photo.id))}><X size={14}/></button>
              </div>)}
            </div>}
          </div>
          <div className="atlas-ai-compose__actions atlas-ai-compose__actions--send">
            <p><ShieldCheck size={14}/> Puedes combinar texto, enlaces e imágenes en una sola consulta.</p>
            <button type="button" className="atlas-ai-submit"
              disabled={busy||Boolean(readingUrl)||(!draft.trim()&&!photos.length&&!links.length&&!linkDraft.trim())}
              onClick={()=>void send('advise')}><span>Enviar</span>{busy?<LoaderCircle size={17} className="atlas-spin"/>:<ArrowUp size={18}/>}</button>
          </div>
        </div>
        {!!notice&&<div role="status" className="atlas-ai-notice"><CircleAlert size={15}/><span>{notice}</span><button aria-label="Cerrar aviso" type="button" onClick={()=>setNotice('')}><X size={14}/></button></div>}
        <p className="atlas-ai-privacy"><ShieldCheck size={14}/> Los enlaces se consultan solo cuando son públicos. Instagram y LinkedIn pueden restringir sus publicaciones: una miniatura o descripción no prueba que Atlas IA haya visto el diseño. Para un análisis visual real, adjunta capturas. Con Groq activo se envían tus mensajes, imágenes y fragmentos públicos relevantes. Nunca compartas credenciales.</p>
      </div>
      <aside className="atlas-ai-insights">
        <div className="atlas-ai-panel">
          <div className="atlas-ai-panel__title"><Palette size={17}/><strong>Colores de referencia</strong></div>
          <p>{colors.length?'Paleta aproximada detectada o sugerida. Pulsa un color para copiar su HEX.':'Sube un logo o una foto para extraer colores aproximados en tu navegador, sin utilizar IA.'}</p>
          <div className="atlas-ai-swatches">{colors.length?colors.map(hex=><button type="button" key={hex} title={'Copiar '+hex} onClick={()=>void copy(hex)}><span style={{background:hex}}/><small>{hex}</small></button>):<div className="atlas-ai-swatch-empty">Aquí aparecerán tus colores</div>}</div>
        </div>
        <div className="atlas-ai-panel">
          <div className="atlas-ai-panel__title"><Sparkles size={17}/><strong>Patrones recomendados</strong><span>{recommendations.length}</span></div>
          <p>Selecciona componentes para incluirlos en el prompt.</p>
          {!recommendations.length&&<div className="atlas-ai-pattern-empty">Las recomendaciones aparecerán después de tu primer mensaje.</div>}
          <div className="atlas-ai-patterns">{recommendations.map(item=><button type="button" key={item.id} className={selected.includes(item.id)?'active':''} onClick={()=>togglePattern(item.id)} title={item.description}><span>{item.name}</span>{selected.includes(item.id)?<Check size={15}/>:<span className="atlas-ai-pattern-plus">+</span>}</button>)}</div>
          {!!selected.length&&<button type="button" className="atlas-ai-clear" onClick={()=>{setSelected([]);setPrompt('')}}>Quitar selección ({selected.length})</button>}
        </div>
        <div className="atlas-ai-panel atlas-ai-prompt-settings" ref={promptRef}>
          <div className="atlas-ai-panel__title"><WandSparkles size={17}/><strong>Prompt profesional</strong></div>
          <label htmlFor="atlas-ai-target">Herramienta de desarrollo</label>
          <select id="atlas-ai-target" value={tool} onChange={e=>{setTool(e.target.value as ToolId);setPrompt('')}}>
            <option>Codex</option><option>Google AI Studio</option><option>Antigravity</option>
          </select>
          <button type="button" className="atlas-ai-generate" disabled={busy} onClick={()=>void send('prompt')}><Sparkles size={16}/>{status==='configured'?'Generar con Atlas IA':'Generar prompt local'}</button>
          {status==='configured'&&<button type="button" className="atlas-ai-local-btn" onClick={generateLocal} disabled={busy}>Generar sin gastar tokens</button>}
          {prompt&&<div className="atlas-ai-final"><label htmlFor="atlas-ai-result">Prompt generado</label><textarea id="atlas-ai-result" rows={12} readOnly value={prompt}/><button type="button" onClick={()=>void copy(prompt)}><Clipboard size={16}/>{copied?'Copiado':'Copiar prompt'} {copied?<CheckCheck size={14}/>:<Send size={14}/>}</button></div>}
          {!prompt&&<p className="atlas-ai-prompt-hint">El resultado incluirá estructura, UI/UX, funciones, patrones seleccionados, accesibilidad y pruebas. En modo mejorar, protegerá la lógica existente.</p>}
        </div>
      </aside>
    </div>
  </section>
}
