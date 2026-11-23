import {useState} from 'react'
import {AlertCircle,ArrowLeft,ArrowRight,CalendarDays,Check,ChevronDown,ChevronLeft,ChevronRight,Heart,Image,MapPin,Search,UploadCloud,X} from 'lucide-react'

export const extendedDemoIds=[
 'hero-section','pricing-table','calendar-view','search-field','filter-chips',
 'progress-bar','kanban-board','carousel','tooltip','popover','file-uploader',
 'product-gallery','checkout-steps','order-tracker','alert-banner','date-picker',
 'activity-feed','inline-validation','data-visualization-heatmap',
 'marketing-conversion-interactive-pricing-calculator','maps-geolocation-interactive-map',
 'education-interactive-quiz'
] as const

export function hasExtendedDemo(id:string):boolean {
 return (extendedDemoIds as readonly string[]).includes(id)
}
const tasks=['Diseñar portada','Revisar colores','Preparar versión móvil']
const categories=['Todos','Diseño','Desarrollo','Producto']
const products=['Interfaz azul','Kit lavanda','Estudio salvia']
const prices=[9,24,49]
const days=['L','M','M','J','V','S','D']
const activities=['Laura revisó el diseño','Marco añadió un comentario','El equipo aprobó la propuesta']

export default function ExtendedPatternDemo({id}:{id:string}){
 const [active,setActive]=useState(0)
 const [open,setOpen]=useState(false)
 const [checked,setChecked]=useState(false)
 const [progress,setProgress]=useState(45)
 const [query,setQuery]=useState('')
 const [choice,setChoice]=useState('Todos')
 const [notice,setNotice]=useState('')
 const [fileName,setFileName]=useState('')
 const [date,setDate]=useState('')
 const [isSaved,setIsSaved]=useState(false)
 const [cost,setCost]=useState(3)
 const [correct,setCorrect]=useState<number|null>(null)
 const [completed,setCompleted]=useState<string[]>([])
 const [pins,setPins]=useState(0)
 const toggleTask=(text:string)=>setCompleted(old=>old.includes(text)?old.filter(x=>x!==text):[...old,text])
 return <div className="pdx-demo" data-demo={id}>
 {id==='hero-section'&&<div className="pdx-hero">
  <span className="pdx-overline">ATLAS · LANDING PAGE</span><h3>Un proyecto que se siente tuyo.</h3>
  <p>Un mensaje claro, una propuesta de valor y una acción principal.</p>
  <div className="pdx-actions"><button className="pdx-primary" onClick={()=>setNotice('¡La CTA respondió correctamente!')}>Empezar <ArrowRight size={14}/></button><button onClick={()=>setOpen(x=>!x)}>{open?'Ocultar':'Ver'} beneficios</button></div>
  {open&&<p className="pdx-feedback">✓ Responsive · ✓ Accesible · ✓ Reutilizable</p>}
  {notice&&<small role="status">{notice}</small>}
 </div>}
 {id==='pricing-table'&&<div className="pdx-stack">
  <h3>Elige un plan de ejemplo</h3><div className="pdx-segments">{['Mensual','Anual'].map((v,i)=><button key={v} className={active===i?'active':''} onClick={()=>setActive(i)}>{v}</button>)}</div>
  <div className="pdx-prices">{['Inicial','Pro','Equipo'].map((v,i)=><button key={v} className={choice===v?'selected':''} onClick={()=>setChoice(v)}><small>{v}</small><strong>S/ {active?prices[i]*10:prices[i]}</strong><span>{active?'por año':'por mes'}</span>{choice===v&&<Check size={15}/>}</button>)}</div>
  <small>Valores ilustrativos, no planes comerciales.</small>
 </div>}
 {id==='calendar-view'&&<div className="pdx-stack"><div className="pdx-inline"><h3>Calendario · vista mensual</h3><button onClick={()=>setActive(i=>(i+1)%2)}>{active?'Diciembre':'Noviembre'} <ChevronDown size={15}/></button></div>
  <div className="pdx-calendar">{days.map((d,i)=><strong key={i}>{d}</strong>)}{Array.from({length:28},(_,i)=><button className={choice===String(i+1)?'selected':''} onClick={()=>setChoice(String(i+1))} key={i}>{i+1}</button>)}</div>
  <small>{Number(choice)>0?'Día '+choice+' seleccionado (demo).':'Pulsa una fecha para seleccionarla.'}</small>
 </div>}
 {id==='search-field'&&<div className="pdx-stack"><h3>Buscar componentes</h3><label className="pdx-search"><Search size={17}/><input placeholder="Escribe un componente..." value={query} onChange={e=>setQuery(e.target.value)}/></label>
  <div className="pdx-result">{['Hero Section','Product Card','Sidebar','Bento Grid','Tabs'].filter(x=>x.toLowerCase().includes(query.toLowerCase())).map(x=><button key={x} onClick={()=>setChoice(x)}>{x}<ArrowRight size={14}/></button>)}</div><small>Seleccionado: {choice}</small></div>}
 {id==='filter-chips'&&<div className="pdx-stack"><h3>Catálogo por categoría</h3><div className="pdx-chips">{categories.map(c=><button key={c} className={choice===c?'active':''} onClick={()=>setChoice(c)}>{c}</button>)}</div>
  <div className="pdx-list">{['Diseño del producto','Desarrollo frontend','Diseño responsive'].filter(x=>choice==='Todos'||x.toLowerCase().includes(choice.toLowerCase())).map(x=><div key={x}>{x}</div>)}</div></div>}
 {id==='progress-bar'&&<div className="pdx-stack"><h3>Avance de tu proyecto</h3><div className="pdx-inline"><span>Preparación</span><strong>{progress}%</strong></div>
  <div className="pdx-track"><span style={{width:progress+'%'}}/></div><input aria-label="Cambiar progreso" type="range" min={0} max={100} step={5} value={progress} onChange={e=>setProgress(Number(e.target.value))}/><small>Arrastra el control para cambiar el avance.</small></div>}
 {id==='kanban-board'&&<div className="pdx-stack"><h3>Panel de trabajo</h3><div className="pdx-kanban">{['Pendiente','Completado'].map((label,i)=><div key={label}><strong>{label}</strong>{tasks.filter(t=>completed.includes(t)===Boolean(i)).map(t=><button key={t} onClick={()=>toggleTask(t)}>{t}{i?<Check size={14}/>:<ArrowRight size={14}/>}</button>)}</div>)}</div><small>Haz clic en una tarea para moverla.</small></div>}
 {id==='carousel'&&<div className="pdx-stack"><h3>Galería de tarjetas</h3><div className="pdx-carousel"><button aria-label="Anterior" onClick={()=>setActive(v=>(v+2)%3)}><ChevronLeft size={19}/></button><div className="pdx-carousel-card"><span>0{active+1}</span><strong>{products[active]}</strong><p>Una tarjeta por vez, con navegación accesible.</p></div><button aria-label="Siguiente" onClick={()=>setActive(v=>(v+1)%3)}><ChevronRight size={19}/></button></div>
  <div className="pdx-dots">{products.map((p,i)=><button key={p} aria-label={'Ir a '+p} aria-pressed={active===i} className={active===i?'active':''} onClick={()=>setActive(i)}/>)}</div></div>}
 {id==='tooltip'&&<div className="pdx-stack"><h3>Ayuda contextual</h3><div className="pdx-tooltip-wrap"><button onFocus={()=>setOpen(true)} onBlur={()=>setOpen(false)} onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)}>¿Qué significa accesibilidad?</button>{open&&<div role="tooltip" className="pdx-tooltip">Facilitar el uso para todas las personas.</div>}</div><small>Prueba con el puntero o el teclado (Tab).</small></div>}
 {id==='popover'&&<div className="pdx-stack"><h3>Opciones adicionales</h3><div className="pdx-popover-wrap"><button className="pdx-primary" onClick={()=>setOpen(x=>!x)} aria-expanded={open}>Mostrar menú <ChevronDown size={15}/></button>{open&&<div className="pdx-popover">{['Guardar','Compartir','Cerrar'].map(t=><button key={t} onClick={()=>{setNotice('Elegiste '+t);setOpen(false)}}>{t}</button>)}</div>}</div><small role="status">{notice||'Selecciona una acción.'}</small></div>}
 {id==='file-uploader'&&<div className="pdx-stack"><h3>Selecciona un archivo local</h3><label className="pdx-drop"><UploadCloud size={25}/><span>{fileName||'Haz clic para elegir una imagen'}</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>setFileName(e.target.files?.[0]?.name||'')}/></label><small>No se envía nada a ningún servidor.</small></div>}
 {id==='product-gallery'&&<div className="pdx-stack"><h3>Vista del producto</h3><div className="pdx-product-display"><div className="pdx-product-icon"><Image size={34}/><strong>{products[active]}</strong></div><div><span>Producto ilustrativo</span><strong>S/ 49</strong><button aria-pressed={isSaved} onClick={()=>setIsSaved(x=>!x)}><Heart size={15} fill={isSaved?'currentColor':'none'}/> {isSaved?'Guardado':'Favorito'}</button></div></div><div className="pdx-thumbs">{products.map((p,i)=><button key={p} className={i===active?'active':''} onClick={()=>setActive(i)}>{i+1}</button>)}</div></div>}
 {id==='checkout-steps'&&<div className="pdx-stack"><h3>Flujo de compra ilustrativo</h3><div className="pdx-checkout-steps">{['Carrito','Entrega','Confirmar'].map((s,i)=><span key={s} className={i<=active?'active':''}>{i+1} · {s}</span>)}</div><div className="pdx-note">Paso {active+1}: {['revisar productos','elegir forma de entrega','comprobar el pedido'][active]}.</div><div className="pdx-actions"><button onClick={()=>setActive(s=>Math.max(0,s-1))} disabled={!active}><ArrowLeft size={14}/> Atrás</button><button className="pdx-primary" onClick={()=>setActive(s=>s===2?0:s+1)}>{active===2?'Reiniciar':'Siguiente'} <ArrowRight size={14}/></button></div><small>No se procesa ninguna compra real.</small></div>}
 {id==='order-tracker'&&<div className="pdx-stack"><h3>Seguimiento del pedido</h3><div className="pdx-timeline">{['Recibido','Preparando','En camino','Entregado'].map((s,i)=><button key={s} className={i<=active?'active':''} onClick={()=>setActive(i)}><span>{i<active?<Check size={14}/>:i+1}</span>{s}</button>)}</div><small>Estado de prueba: {['Recibido','Preparando','En camino','Entregado'][active]}.</small></div>}
 {id==='alert-banner'&&<div className="pdx-stack"><h3>Comunicado de estado</h3>{!checked&&<div className="pdx-alert" role="alert"><AlertCircle size={18}/><div><strong>Actualización disponible</strong><p>Se guardó un cambio de demostración.</p></div><button aria-label="Descartar aviso" onClick={()=>setChecked(true)}><X size={16}/></button></div>}<button className="pdx-primary" onClick={()=>setChecked(false)}>Mostrar aviso</button></div>}
 {id==='date-picker'&&<div className="pdx-stack"><h3>Elegir fecha</h3><label className="pdx-field">Fecha de reunión<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label><div className="pdx-note"><CalendarDays size={16}/> {date||'Selecciona una fecha'}</div></div>}
 {id==='activity-feed'&&<div className="pdx-stack"><h3>Actividad reciente</h3><div className="pdx-activity">{activities.slice(0,active+1).map((a,i)=><div key={a}><span>{i+1}</span>{a}</div>)}</div><button className="pdx-primary" onClick={()=>setActive(s=>(s+1)%3)}>Actualizar actividad</button><small>Todos los datos de esta demo son ficticios.</small></div>}
 {id==='inline-validation'&&<div className="pdx-stack"><h3>Validación en contexto</h3><label className="pdx-field">Correo electrónico<input type="email" value={query} placeholder="nombre@dominio.com" onChange={e=>setQuery(e.target.value)}/></label><p className={query.includes('@')&&query.includes('.')?'pdx-success':'pdx-error'}>{!query?'Escribe un correo de ejemplo.':query.includes('@')&&query.includes('.')?'✓ Formato válido.':'Incluye @ y un dominio.'}</p></div>}
 {id==='data-visualization-heatmap'&&<div className="pdx-stack"><h3>Mapa de calor</h3><div className="pdx-heatmap">{Array.from({length:35},(_,i)=><button key={i} aria-label={'Celda '+(i+1)} title={'Actividad ficticia: '+((i*13+active*7)%100)} className={'intensity-'+((i*13+active*7)%5)} onClick={()=>setNotice('Celda '+(i+1)+': dato de demostración')}/>)}</div><button className="pdx-primary" onClick={()=>setActive(s=>s+1)}>Cambiar conjunto de datos</button><small role="status">{notice||'Pasa el cursor sobre una celda.'}</small></div>}
 {id==='marketing-conversion-interactive-pricing-calculator'&&<div className="pdx-stack"><h3>Calculadora orientativa</h3><label className="pdx-field">Licencias: {cost}<input type="range" min={1} max={25} value={cost} onChange={e=>setCost(Number(e.target.value))}/></label><div className="pdx-cost">S/ {cost*12} <small>por mes (ejemplo)</small></div><p>Cálculo local, sin suscripciones reales.</p></div>}
 {id==='maps-geolocation-interactive-map'&&<div className="pdx-stack"><h3>Mapa esquemático de ubicaciones</h3><div className="pdx-map"><span className="pdx-road a"/><span className="pdx-road b"/>{['Local','Oficina','Entrega'].map((s,i)=><button style={{left:(18+i*28)+'%',top:(52-(i%2)*21)+'%'}} key={s} aria-label={'Elegir '+s} aria-pressed={pins===i} className={pins===i?'active':''} onClick={()=>setPins(i)}><MapPin size={17}/></button>)}</div><div className="pdx-note"><MapPin size={15}/> Punto elegido: {['Local','Oficina','Entrega'][pins]}</div><small>Es una ilustración, no un mapa geográfico real.</small></div>}
 {id==='education-interactive-quiz'&&<div className="pdx-stack"><h3>Pregunta de práctica</h3><p>¿Qué componente permite elegir entre varias vistas relacionadas?</p><div className="pdx-quiz">{['Modal','Tabs','Toast'].map((s,i)=><button key={s} className={correct===i?'selected':''} onClick={()=>setCorrect(i)}>{s}</button>)}</div>{correct!==null&&<small role="status">{correct===1?'✓ ¡Correcto! Tabs organiza vistas relacionadas.':'Prueba con otra opción.'}</small>}</div>}
 </div>
}
