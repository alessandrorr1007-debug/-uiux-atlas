import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight, ArrowUp, Bot, BrainCircuit, Check, CheckCheck, CircleAlert, Clipboard,
  FileImage, Github, Globe2, ImagePlus, Link2, LoaderCircle, Palette, RefreshCw,
  Send, ShieldCheck, Sparkles, WandSparkles, X
} from 'lucide-react'
import { components } from '../data/components'
import type { ToolId } from '../types'
import {
  prepareAtlasImage, suggestAtlasPatterns, composeAtlasPrompt, isGitHubLink,
  type AtlasMode, type AtlasImage, type AtlasMessage, type AtlasReply, type SiteInfo, type GitHubRepositoryInfo
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
  if(status === 'configured') return <div className="atlas-status online"><Check size={15}/> Clave de Groq configurada. Puedes enviar mensajes y analizar imágenes.</div>
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
  const [url,setUrl] = useState('')
  const [photos,setPhotos] = useState<AtlasImage[]>([])
  const [colors,setColors] = useState<string[]>([])
  const [messages,setMessages] = useState<AtlasMessage[]>([])
  const [suggested,setSuggested] = useState<string[]>([])
  const [prompt,setPrompt] = useState('')
  const [tool,setTool] = useState<ToolId>('Codex')
  const [site,setSite] = useState<SiteInfo | null>(null)
  const [repository,setRepository] = useState<GitHubRepositoryInfo | null>(null)
  const [busy,setBusy] = useState(false)
  const [inspecting,setInspecting] = useState(false)
  const [notice,setNotice] = useState('')
  const [copied,setCopied] = useState(false)
  const fileRef=useRef<HTMLInputElement>(null)
  const conversationEnd=useRef<HTMLDivElement>(null)
  const promptRef=useRef<HTMLDivElement>(null)
  const intro = mode==='create'
    ? 'Cuenta tu idea. Puedes escribir, adjuntar un logo o menú, o compartir una referencia visual.'
    : 'Comparte una web publicada, un repositorio GitHub público o capturas de tu proyecto todavía en desarrollo.'
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
    setPrompt('');setSite(null);setRepository(null);setNotice('');setDraft('');setUrl('');setColors([])
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
  const inspect=async()=>{
    if(!url.trim())return
    setInspecting(true);setNotice('')
    const github=isGitHubLink(url)
    try{
      const response=await fetch(github?'/api/atlas/github':'/api/atlas/inspect',{
        method:'POST',headers:{'content-type':'application/json'},
        body:JSON.stringify({url:url.trim()})
      })
      const data=await response.json() as {site?:SiteInfo;repository?:GitHubRepositoryInfo;error?:string}
      if(!response.ok)throw new Error(data.error||'No se pudo analizar el enlace.')
      if(github&&data.repository){
        setRepository(data.repository);setSite(null)
        setNotice('Repositorio público leído: '+data.repository.files.length+' archivos de interfaz. '+data.repository.warning)
      }else if(data.site){
        setSite(data.site);setRepository(null);setNotice(data.site.warning)
      }else throw new Error('El servicio no devolvió información legible.')
    }catch(error){
      setSite(null);setRepository(null)
      setNotice((error instanceof Error?error.message:'El enlace no es accesible.')+
        (github?' Para proyectos privados, adjunta capturas: no solicitamos claves ni contraseñas.':' Puedes adjuntar una captura.'))
    }finally{setInspecting(false)}
  }
  const send=async(intent:'advise'|'prompt')=>{
    if(busy)return
    const content=draft.trim()
    if(intent==='advise'&&!content&&!photos.length&&!url.trim()){setNotice('Escribe tu idea, adjunta una imagen o añade un enlace.');return}
    setNotice('');setCopied(false);setBusy(true)
    const userText=content||(
      intent==='prompt'?'Genera el prompt final según nuestra conversación.':
      photos.length?'Analiza mis imágenes y recomiéndame una propuesta de diseño.':
      'Analiza esta referencia y recomiéndame cómo diseñar mi proyecto.'
    )
    const newMessage:AtlasMessage={role:'user',content:userText,attachments:photos.map(photo=>photo.name)}
    setMessages(previous=>[...previous,newMessage])
    try{
      let activeRepository=repository
      const linkInMessage=userText.match(/https:\/\/github\.com\/[^\s<>"']+/i)?.[0]?.replace(/[.,;)]+$/,'')||''
      const repositoryLink=url.trim()||linkInMessage
      if(status!=='configured'&&isGitHubLink(repositoryLink)&&!activeRepository){
        try{
          const preview=await fetch('/api/atlas/github',{
            method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({url:repositoryLink})
          })
          const data=await preview.json() as {repository?:GitHubRepositoryInfo;error?:string}
          if(!preview.ok||!data.repository)throw new Error(data.error||'No fue posible leer el repositorio.')
          activeRepository=data.repository
          setRepository(data.repository);setSite(null)
        }catch(error){setNotice(error instanceof Error?error.message:'No se pudo acceder al repositorio público.')}
      }
      const context=[...messages.filter(item=>item.role==='user').map(item=>item.content),userText,activeRepository?.description||'',...(activeRepository?.files.map(f=>f.path)||[])].join(' ')
      const localMatches=suggestAtlasPatterns(context,selected,7)
      const localIds=selected.length?selected:localMatches.map(item=>item.id)
      if(status!=='configured'){
        if(intent==='prompt'){
          const result=composeAtlasPrompt(mode,context,localIds,tool,colors,site,activeRepository)
          setPrompt(result)
          setSuggested(localIds)
          setMessages(previous=>[...previous,{
            role:'assistant',content:'Prompt local preparado para '+tool+'. No es una respuesta de una IA: utiliza el catálogo de 406 patrones y tus selecciones.'
          }])
        }else{
          setSuggested(localIds)
          setMessages(previous=>[...previous,{
            role:'assistant',content:'Vista local sin API: te sugiero explorar '+localMatches.map(item=>item.name).join(', ')+
              '. Selecciona los que prefieras y pulsa «Generar prompt». Al configurar GROQ_API_KEY, aquí conversarás con Atlas IA y podrá interpretar tus imágenes.'
          }])
        }
      }else{
        const response=await fetch('/api/atlas/chat',{
          method:'POST',headers:{'content-type':'application/json'},
          body:JSON.stringify({
            mode,intent,message:userText,history:messages.slice(-10).map(m=>({role:m.role,content:m.content})),
            images:photos.map(photo=>photo.dataUrl),colors,sourceUrl:url.trim(),
            selectedIds:localIds,tool
          })
        })
        const answer=await response.json() as AtlasReply & {error?:string}
        if(!response.ok)throw new Error(answer.error||'El asistente no pudo completar la respuesta.')
        setSuggested(answer.patternIds||[])
        if(answer.palette?.length)setColors(answer.palette)
        if(answer.site){setSite(answer.site);setRepository(null)}
        if(answer.repository){setRepository(answer.repository);setSite(null)}
        if(answer.websiteNotice)setNotice(answer.websiteNotice)
        if(intent==='prompt'){
          setPrompt(answer.prompt||composeAtlasPrompt(mode,context,localIds,tool,colors,site,answer.repository||activeRepository))
        }
        setMessages(previous=>[...previous,{role:'assistant',content:answer.reply}])
      }
      setDraft('');setPhotos([])
      if(fileRef.current)fileRef.current.value=''
      if(intent==='prompt')setTimeout(()=>promptRef.current?.scrollIntoView({behavior:'smooth',block:'nearest'}),100)
    }catch(error){
      setMessages(previous=>[...previous,{role:'assistant',content:'No pude completar esta consulta. Puedes reintentar o utilizar la generación local de respaldo.'}])
      setNotice(error instanceof Error?error.message:'Fallo al consultar Atlas IA.')
    }finally{setBusy(false)}
  }
  const generateLocal=()=>{
    const description=[...messages.filter(m=>m.role==='user').map(m=>m.content),draft].join(' ').trim()
    const ids=selected.length?selected:suggestAtlasPatterns(description,[],7).map(i=>i.id)
    setPrompt(composeAtlasPrompt(mode,description,ids,tool,colors,site,repository))
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
        <strong>Crear proyecto</strong><small>De una idea y referencias a un diseño completo</small>
        <ArrowRight size={17} className="atlas-ai-mode__arrow"/>
      </button>
      <button type="button" className={'atlas-ai-mode'+(mode==='improve'?' active':'')} aria-pressed={mode==='improve'} onClick={()=>chooseMode('improve')}>
        <span className="atlas-ai-mode__icon"><WandSparkles size={22}/></span>
        <strong>Mejorar proyecto</strong><small>Analizar web o GitHub público, conservando las funciones</small>
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
          {!!photos.length&&<div className="atlas-ai-attachments">{photos.map(photo=><div key={photo.id} className="atlas-ai-attachment"><img src={photo.dataUrl} alt={'Adjunto: '+photo.name}/><span>{photo.name}</span><button type="button" aria-label={'Quitar '+photo.name} onClick={()=>setPhotos(prev=>prev.filter(p=>p.id!==photo.id))}><X size={14}/></button></div>)}</div>}
          <label className="atlas-ai-textarea-label" htmlFor="atlas-ai-text">Tu mensaje</label>
          <textarea id="atlas-ai-text" rows={3} maxLength={2600} value={draft} onChange={event=>setDraft(event.target.value)}
            onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();void send('advise')}}}
            placeholder={mode==='create'?'Ej.: Quiero una web moderna para mi pollería; aquí está mi menú…':'Ej.: Quiero mejorar el catálogo y el diseño móvil sin tocar los pedidos…'} disabled={busy}/>
          <div className="atlas-ai-compose__url">
            <Link2 size={16}/><input aria-label="Enlace público de GitHub o página web para analizar" type="url" value={url} maxLength={700}
              onChange={event=>{setUrl(event.target.value);setSite(null);setRepository(null)}} disabled={busy||inspecting} placeholder="https://github.com/usuario/proyecto o enlace web"/>
            <button type="button" disabled={!url.trim()||inspecting||busy} onClick={()=>void inspect()}>{inspecting?<LoaderCircle size={15} className="atlas-spin"/>:isGitHubLink(url)?<Github size={15}/>:<Globe2 size={15}/>}<span>{isGitHubLink(url)?'Analizar GitHub':'Leer web'}</span></button>
          </div>
          {!!site&&<div className="atlas-ai-site"><Check size={14}/><div><strong>{site.title||'Página pública leída'}</strong><small>HTML público, no inspección visual del sitio.</small></div></div>}
          {!!repository&&<div className="atlas-ai-repository">
            <div className="atlas-ai-repository__heading"><Github size={17}/><div><strong>{repository.owner}/{repository.name}</strong><small>Rama: {repository.branch} · {repository.frameworks.join(', ')||'Tecnología no identificada'}</small></div><Check size={15}/></div>
            <p>{repository.files.length} archivos relevantes consultados de {repository.fileCount} archivos del repositorio público. Revisión de código estática; no equivale a ver el diseño funcionando.</p>
            <div className="atlas-ai-repository__files" aria-label="Archivos revisados">{repository.files.map(file=><span key={file.path} title={file.path}>{file.path}</span>)}</div>
          </div>}
          <div className="atlas-ai-compose__actions">
            <div><input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" multiple hidden onChange={e=>void onFiles(e.target.files)}/>
              <button type="button" className="atlas-ai-attach-btn" disabled={busy||photos.length>=3} onClick={()=>fileRef.current?.click()} title="Subir imágenes, logos, menús o capturas"><ImagePlus size={17}/> <span>Imágenes {photos.length}/3</span></button>
            </div>
            <button type="button" className="atlas-ai-submit" disabled={busy||(!draft.trim()&&!photos.length&&!url.trim())} onClick={()=>void send('advise')}><span>Enviar</span>{busy?<LoaderCircle size={17} className="atlas-spin"/>:<ArrowUp size={18}/>}</button>
          </div>
        </div>
        {!!notice&&<div role="status" className="atlas-ai-notice"><CircleAlert size={15}/><span>{notice}</span><button aria-label="Cerrar aviso" type="button" onClick={()=>setNotice('')}><X size={14}/></button></div>}
        <p className="atlas-ai-privacy"><ShieldCheck size={14}/> GitHub: solo repositorios públicos; lectura parcial de código sin ejecutarlo. Sin Groq puedes consultar archivos y generar prompts locales. Con Groq activo, los fragmentos relevantes, mensajes e imágenes se envían al proveedor. No compartas secretos ni enlaces privados.</p>
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
