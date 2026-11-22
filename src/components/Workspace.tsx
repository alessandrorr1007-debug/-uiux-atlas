import { useMemo, useState } from 'react'
import {
  ArrowRight, Check, CheckCircle2, CircleHelp, Clipboard, Image, Laptop,
  Layers3, Search, Smartphone, Sparkles, WandSparkles
} from 'lucide-react'
import { components } from '../data/components'
import { sectors, type SectorPreset } from '../data/sectors'
import { photoCategories, photoStyles, type PhotoStyle } from '../data/photography'
import { auditCriteria } from '../data/audit'
import { loadJSON, saveJSON } from '../lib/storage'
import { buildPhotoPrompt, buildAuditPrompt, buildSectorPrompt } from '../lib/studio'
import { specificDemoIds } from './PatternDemo'
import PatternDemo from './PatternDemo'

export type WorkspaceView = 'lab' | 'templates' | 'audit' | 'photo'
type Props = {
  view: WorkspaceView
  onUsePreset: (preset: SectorPreset) => void
  onCopy: (text: string) => void
}

const titles: Record<WorkspaceView, [string, string, string]> = {
  lab: ['Laboratorio interactivo', 'Prueba componentes antes de utilizarlos.', '24 DEMOS INDIVIDUALES'],
  templates: ['Plantillas por rubro', 'Estructuras adaptadas a diferentes negocios y aplicaciones.', '20 RUBROS'],
  audit: ['Auditoría UI/UX', 'Diagnóstico manual orientado a corregir problemas reales.', '22 CRITERIOS'],
  photo: ['Estudio fotográfico', 'Crea prompts originales de fotografía comercial.', '54 ESTILOS']
}

export default function Workspace({ view, onUsePreset, onCopy }: Props) {
  const [demoId, setDemoId] = useState<string>(specificDemoIds[0])
  const [sectorKind, setSectorKind] = useState<'all'|'web'|'app'>('all')
  const [sectorSearch, setSectorSearch] = useState('')
  const [auditStatus, setAuditStatus] = useState<Record<string,'pass'|'fix'>>(() => loadJSON('audit-status', {}))
  const [photoCategory, setPhotoCategory] = useState<string>(photoCategories[0])
  const [photoId, setPhotoId] = useState<string>(photoStyles[0].id)
  const [product, setProduct] = useState('')
  const [ratio, setRatio] = useState('1:1')
  const [background, setBackground] = useState('Fotografía realista')

  const currentDemo = components.find(component => component.id === demoId)
  const shownSectors = sectors.filter(item =>
    (sectorKind === 'all' || item.kind === sectorKind) &&
    (item.name.toLowerCase() + item.goal.toLowerCase()).includes(sectorSearch.toLowerCase())
  )
  const shownPhotos = photoStyles.filter(item => item.category === photoCategory)
  const selectedPhoto = shownPhotos.find(item => item.id === photoId) ?? shownPhotos[0]
  const pending = useMemo(() => auditCriteria.filter(item => auditStatus[item.id] === 'fix'), [auditStatus])
  const assessed = Object.keys(auditStatus).filter(id => auditCriteria.some(c => c.id === id)).length
  const photoPrompt = buildPhotoPrompt(product, selectedPhoto, ratio, background)

  const setAudit = (id:string, value:'pass'|'fix') => {
    setAuditStatus(previous => {
      const next = {...previous}
      if (next[id] === value) delete next[id]
      else next[id] = value
      saveJSON('audit-status', next)
      return next
    })
  }

  return <section className="workspace-page">
    <div className="workspace-heading"><div><span className="section-label"><span/>{titles[view][2]}</span><h1>{titles[view][0]}</h1><p>{titles[view][1]}</p></div><span className="workspace-version">ATLAS STUDIO · V0.2</span></div>

    {view === 'lab' && <div className="studio-lab">
      <div className="studio-list"><div className="studio-list-caption">SELECCIONA UN COMPONENTE</div>{specificDemoIds.map(id => {
        const component = components.find(item => item.id === id)
        if (!component) return null
        return <button key={id} className={demoId === id ? 'studio-list-item active' : 'studio-list-item'} onClick={() => setDemoId(id)}><span>{component.name}</span><ArrowRight size={14}/></button>
      })}</div>
      <div className="studio-lab-main"><div className="studio-lab-top"><span><Sparkles size={17}/> DEMOSTRACIÓN FUNCIONAL</span><span>{specificDemoIds.indexOf(demoId as typeof specificDemoIds[number])+1} / {specificDemoIds.length}</span></div><div className="studio-lab-stage"><PatternDemo key={demoId} id={demoId}/></div><div className="studio-lab-detail"><h2>{currentDemo?.name}</h2><p>{currentDemo?.description}</p><strong>Cuándo usarlo</strong><p>{currentDemo?.useCase}</p><div className="studio-note"><CheckCircle2 size={17}/>{currentDemo?.guidance}</div></div></div>
    </div>}

    {view === 'templates' && <><div className="workspace-toolbar"><div className="workspace-filter">{(['all','web','app'] as const).map(kind=><button key={kind} className={sectorKind === kind ? 'active':''} onClick={()=>setSectorKind(kind)}>{kind==='all'?'Todos':kind==='web'?'Sitios web':'Aplicaciones'}</button>)}</div><label className="workspace-search"><Search size={17}/><input aria-label="Buscar rubros" placeholder="Buscar rubro..." value={sectorSearch} onChange={e=>setSectorSearch(e.target.value)}/></label></div><div className="workspace-grid">{shownSectors.map(item=><article className="workspace-card" key={item.id}><span className="workspace-card-icon">{item.kind==='web'?<Laptop size={23}/>:<Smartphone size={23}/>}</span><div className="workspace-card-meta">{item.kind==='web'?'SITIO WEB':'APLICACIÓN MÓVIL'}</div><h2>{item.name}</h2><p>{item.goal}</p><div className="workspace-tags">{item.components.slice(0,3).map(component=><span key={component}>{components.find(c=>c.id===component)?.name??component}</span>)}</div><div className="workspace-card-actions"><button onClick={()=>onCopy(buildSectorPrompt(item))}><Clipboard size={15}/> Copiar base</button><button className="workspace-primary" onClick={()=>onUsePreset(item)}>Personalizar <ArrowRight size={15}/></button></div></article>)}</div>{shownSectors.length===0 && <p className="workspace-empty">No hay resultados para esa búsqueda.</p>}</>}

    {view === 'audit' && <><div className="audit-summary"><div><span>EVALUACIÓN MANUAL</span><strong>{assessed} / {auditCriteria.length}</strong><small>criterios revisados</small></div><div><span>MEJORAS IDENTIFICADAS</span><strong>{pending.length}</strong><small>recomendaciones pendientes</small></div><div className="audit-summary-action"><button className="primary-button" disabled={!pending.length} onClick={()=>onCopy(buildAuditPrompt(pending))}><Clipboard size={16}/> Copiar prompt de mejoras</button><p>No analiza webs automáticamente. Marca los criterios después de inspeccionar tu interfaz.</p></div></div>{(['errors','principles'] as const).map(group=><div className="audit-section" key={group}><h2>{group==='errors'?'12 errores frecuentes':'10 principios de experiencia comercial'}</h2><p>{group==='errors'?'Detecta prácticas que deterioran la experiencia.':'Evalúa claridad, confianza y facilidad de uso.'}</p><div className="audit-grid">{auditCriteria.filter(item=>item.group===group).map(item=><article key={item.id} className="audit-card"><div className="audit-card-head"><CircleHelp size={17}/><strong>{item.title}</strong></div><p>{item.detail}</p><small>{item.fix}</small><div className="audit-actions"><button className={auditStatus[item.id]==='pass'?'passed':''} aria-pressed={auditStatus[item.id]==='pass'} onClick={()=>setAudit(item.id,'pass')}><Check size={14}/> Cumple</button><button className={auditStatus[item.id]==='fix'?'fix':''} aria-pressed={auditStatus[item.id]==='fix'} onClick={()=>setAudit(item.id,'fix')}>Necesita mejora</button></div></article>)}</div></div>)}</>}

    {view === 'photo' && <div className="photo-workspace"><div className="photo-catalog"><div className="workspace-filter photo-filters">{photoCategories.map(item=><button key={item} className={photoCategory === item?'active':''} onClick={()=>{setPhotoCategory(item);const next=photoStyles.find(p=>p.category===item);if(next)setPhotoId(next.id)}}>{item}</button>)}</div><div className="photo-grid">{shownPhotos.map(style=><button className={selectedPhoto?.id===style.id?'photo-style active':'photo-style'} key={style.id} onClick={()=>setPhotoId(style.id)}><span className="photo-style-icon"><Image size={22}/></span><strong>{style.name}</strong><small>{style.framing}</small></button>)}</div></div><div className="photo-compose"><div className="studio-list-caption">PROMPT FOTOGRÁFICO</div><h2>{selectedPhoto?.name}</h2><p>Elige un estilo y describe el producto. Recibirás un prompt local para usar con la herramienta de imágenes que prefieras.</p><label className="field-label" htmlFor="photo-product">Producto a fotografiar</label><input id="photo-product" className="field" value={product} onChange={event=>setProduct(event.target.value)} maxLength={140} placeholder="Ej.: taza de café artesanal"/><label className="field-label" htmlFor="photo-ratio">Relación de aspecto</label><select id="photo-ratio" className="field" value={ratio} onChange={e=>setRatio(e.target.value)}><option>1:1</option><option>4:5</option><option>9:16</option><option>16:9</option></select><label className="field-label" htmlFor="photo-look">Acabado</label><select id="photo-look" className="field" value={background} onChange={e=>setBackground(e.target.value)}><option>Fotografía realista</option><option>Editorial premium</option><option>Catálogo minimalista</option></select><label className="field-label" htmlFor="photo-output">Resultado</label><textarea id="photo-output" className="prompt-readonly" readOnly rows={9} value={photoPrompt}/><button className="primary-button" disabled={!product.trim()} onClick={()=>onCopy(photoPrompt)}><Clipboard size={16}/> Copiar prompt</button><div className="studio-note"><Layers3 size={16}/> Solo genera texto: no utiliza API ni crea imágenes. Conserva la forma y los detalles reales del producto.</div></div></div>}
  </section>
}
