import { useState } from 'react'
import { ArrowRight, Bell, Check, ChevronDown, ChevronLeft, ChevronRight, Heart, Menu, Minus, Plus, Search, ShoppingCart, X } from 'lucide-react'

// Demos educativas: estados locales y controles reales; no simulan servicios externos.
export const specificDemoIds = [
  'sidebar','sticky-navbar','bottom-navigation','mega-menu','breadcrumbs','tabs',
  'command-palette','pagination','bento-grid','stat-cards','data-table',
  'text-input','select-dropdown','toggle-switch','checkbox-group','form-wizard',
  'product-card','cart-drawer','quantity-selector','toast','modal','accordion',
  'segmented-control','bottom-sheet'
] as const

export function hasSpecificDemo(id: string): boolean {
  return (specificDemoIds as readonly string[]).includes(id)
}

const navItems = ['Inicio', 'Proyectos', 'Ajustes']
const dataRows = [
  { name: 'Interfaz móvil', status: 'Activo' },
  { name: 'Rediseño web', status: 'Revisión' },
  { name: 'Componentes', status: 'Activo' }
]

export default function PatternDemo({ id }: { id: string }) {
  const [active, setActive] = useState('Inicio')
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(1)
  const [saved, setSaved] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [alert, setAlert] = useState('')
  const [step, setStep] = useState(1)
  const [sort, setSort] = useState(false)
  const [checked, setChecked] = useState<string[]>([])
  const [category, setCategory] = useState('Todo')
  const [cart, setCart] = useState(0)

  const toggleCheck = (name: string) => setChecked(current =>
    current.includes(name) ? current.filter(item => item !== name) : [...current, name]
  )

  return <div className="specific-demo">
    {id === 'sidebar' && <div className="sd-shell"><nav className="sd-side" aria-label="Menú de demostración">{navItems.map(item => <button key={item} className={active === item ? 'sd-active' : ''} onClick={() => setActive(item)}>{item}</button>)}</nav><div className="sd-main"><span className="sd-subtitle">PANEL</span><h3>{active}</h3><p>La sección activa modifica el contenido.</p><div className="sd-fake-row"/><div className="sd-fake-row"/></div></div>}

    {id === 'sticky-navbar' && <div className="sd-scroll"><nav className="sd-sticky"><strong>Atlas</strong>{['Inicio','Funciones','Contacto'].map(item => <button key={item} className={active === item ? 'sd-active' : ''} onClick={() => setActive(item)}>{item}</button>)}</nav><div className="sd-scroll-inner"><p>Desplázate dentro de este panel para comprobar que la navegación permanece visible.</p><div className="sd-scroll-filler">01 — Explorar</div><div className="sd-scroll-filler">02 — Descubrir</div><div className="sd-scroll-filler">03 — Crear</div></div></div>}

    {id === 'bottom-navigation' && <div className="sd-phone"><div><strong>{active}</strong><p>Selecciona una pestaña inferior.</p><div className="sd-fake-row"/></div><nav aria-label="Navegación inferior">{['Inicio','Cursos','Perfil'].map(item => <button key={item} className={active === item ? 'sd-active' : ''} onClick={() => setActive(item)}>{item}</button>)}</nav></div>}

    {id === 'mega-menu' && <div className="sd-menu"><div className="sd-topnav"><strong>Atlas</strong><button onClick={() => setOpen(!open)} aria-expanded={open}>Explorar <ChevronDown size={15}/></button><button onClick={() => setActive('Recursos')}>Recursos</button></div>{open ? <div className="sd-mega"><div><strong>Diseño</strong><p>Layouts</p><p>Componentes</p></div><div><strong>Desarrollo</strong><p>React</p><p>Accesibilidad</p></div><div><strong>Destacado</strong><p>Generador de prompts</p></div></div> : <p>Abre el menú desplegable para ver tres columnas.</p>}{active==='Recursos' && <small>Sección de recursos seleccionada.</small>}</div>}

    {id === 'breadcrumbs' && <div className="sd-stack"><nav className="sd-breadcrumbs" aria-label="Ruta actual">{['Inicio','Catálogo','Detalle'].slice(0,page+1).map((item,i) => <span key={item}>{i>0 && '/'}<button onClick={() => setPage(i===0?1:i)}>{item}</button></span>)}</nav><h3>{page===1?'Catálogo':'Detalle'}</h3><button className="sd-btn" onClick={() => setPage(page===1?2:1)}>Cambiar profundidad <ArrowRight size={14}/></button></div>}

    {id === 'tabs' && <div className="sd-stack"><div className="sd-tabs" role="tablist" aria-label="Vistas">{['Resumen','Archivos','Actividad'].map(item => <button key={item} role="tab" aria-selected={active===item} className={active===item ? 'sd-active' : ''} onClick={() => setActive(item)}>{item}</button>)}</div><div role="tabpanel" className="sd-panel"><strong>{active}</strong><p>Contenido de la pestaña seleccionada.</p></div></div>}

    {id === 'command-palette' && <div className="sd-stack"><label className="sd-label">Buscar comando</label><div className="sd-input-icon"><Search size={16}/><input aria-label="Buscar comandos" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Prueba: diseño, abrir..."/></div><div className="sd-results">{['Abrir proyecto','Cambiar diseño','Crear componente','Ver documentación'].filter(v=>v.toLowerCase().includes(query.toLowerCase())).map(item=><button key={item} onClick={()=>{setActive(item);setQuery('')}}>{item}<ArrowRight size={13}/></button>)}</div><small>Última acción: {active}</small></div>}

    {id === 'pagination' && <div className="sd-stack"><h3>Resultados · Página {page}</h3><div className="sd-grid"><div>Elemento {(page-1)*3+1}</div><div>Elemento {(page-1)*3+2}</div><div>Elemento {(page-1)*3+3}</div></div><div className="sd-actions"><button disabled={page===1} onClick={()=>setPage(p=>p-1)} aria-label="Anterior"><ChevronLeft size={16}/></button>{[1,2,3].map(n=><button key={n} className={page===n?'sd-active':''} aria-current={page===n?'page':undefined} onClick={()=>setPage(n)}>{n}</button>)}<button disabled={page===3} onClick={()=>setPage(p=>p+1)} aria-label="Siguiente"><ChevronRight size={16}/></button></div></div>}

    {id === 'bento-grid' && <div className="sd-stack"><div className="sd-bento"><button className="sd-bento-large" onClick={()=>setActive('Principal')}>Tarjeta principal <ArrowRight size={15}/></button><button onClick={()=>setActive('Ideas')}>Ideas</button><button onClick={()=>setActive('Estadísticas')}>Métricas</button></div><small>Seleccionada: {active}</small></div>}

    {id === 'stat-cards' && <div className="sd-stack"><div className="sd-tabs">{['Semana','Mes'].map(v=><button key={v} className={active===v?'sd-active':''} onClick={()=>setActive(v)}>{v}</button>)}</div><div className="sd-metrics"><div><small>Visitas</small><strong>{active==='Mes'?'12 480':'2 120'}</strong></div><div><small>Conversiones</small><strong>{active==='Mes'?'380':'94'}</strong></div></div><small>Valores de demostración, no métricas reales.</small></div>}

    {id === 'data-table' && <div className="sd-stack"><button className="sd-btn" onClick={()=>setSort(!sort)}>Ordenar por nombre <ChevronDown size={14}/></button><table className="sd-table"><thead><tr><th>Proyecto</th><th>Estado</th></tr></thead><tbody>{[...dataRows].sort((a,b)=>sort?a.name.localeCompare(b.name):0).map(row=><tr key={row.name}><td>{row.name}</td><td>{row.status}</td></tr>)}</tbody></table></div>}

    {id === 'text-input' && <div className="sd-stack"><label className="sd-label" htmlFor="sd-input-name">Nombre del proyecto</label><input id="sd-input-name" className="sd-input" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Escribe tu proyecto" maxLength={60}/><p>{query ? `Vista previa: ${query}` : 'Escribe para mostrar una vista previa.'}</p></div>}

    {id === 'select-dropdown' && <div className="sd-stack"><label className="sd-label" htmlFor="sd-select">Categoría</label><select id="sd-select" className="sd-input" value={category} onChange={e=>setCategory(e.target.value)}><option>Todo</option><option>Navegación</option><option>Formularios</option><option>Animaciones</option></select><p>Mostrando: <strong>{category}</strong></p></div>}

    {id === 'toggle-switch' && <div className="sd-stack"><div className="sd-inline"><span>Modo de notificaciones</span><button role="switch" aria-checked={enabled} className={enabled?'sd-switch on':'sd-switch'} onClick={()=>setEnabled(v=>!v)}><span/></button></div><p>{enabled?'Activado':'Desactivado'}</p></div>}

    {id === 'checkbox-group' && <fieldset className="sd-stack"><legend>Selecciona tus intereses</legend>{['Diseño UI','Desarrollo web','Animaciones'].map(item=><label key={item} className="sd-check"><input type="checkbox" checked={checked.includes(item)} onChange={()=>toggleCheck(item)}/>{item}</label>)}<small>{checked.length} seleccionados</small></fieldset>}

    {id === 'form-wizard' && <div className="sd-stack"><div className="sd-steps">{[1,2,3].map(n=><span key={n} className={step>=n?'on':''}>{n}</span>)}</div><h3>{['','Datos básicos','Preferencias','Confirmar'][step]}</h3><p>Etapa {step} de 3</p><div className="sd-actions"><button onClick={()=>setStep(s=>Math.max(1,s-1))} disabled={step===1}>Atrás</button><button className="sd-btn" onClick={()=>setStep(s=>s===3?1:s+1)}>{step===3?'Reiniciar':'Continuar'}</button></div></div>}

    {id === 'product-card' && <div className="sd-product"><div className="sd-product-image">UI</div><div><small>PRODUCTO DE EJEMPLO</small><h3>Kit de interfaces</h3><p>S/ 49.00</p><div className="sd-actions"><button className="sd-btn" onClick={()=>setCart(n=>n+1)}><ShoppingCart size={14}/> Añadir {cart>0?`(${cart})`:''}</button><button onClick={()=>setSaved(v=>!v)} aria-pressed={saved} aria-label="Favorito"><Heart fill={saved?'currentColor':'none'} size={17}/></button></div></div></div>}

    {id === 'cart-drawer' && <div className="sd-stack"><button className="sd-btn" onClick={()=>setOpen(true)}><ShoppingCart size={15}/> Abrir carrito</button><p>Carrito local de demostración: {count} unidad(es)</p>{open && <div className="sd-drawer"><button className="sd-close" onClick={()=>setOpen(false)} aria-label="Cerrar carrito"><X size={16}/></button><h3>Tu carrito</h3><p>Kit de interfaces</p><div className="sd-actions"><button onClick={()=>setCount(n=>Math.max(1,n-1))}><Minus size={14}/></button>{count}<button onClick={()=>setCount(n=>n+1)}><Plus size={14}/></button></div><p>Subtotal: S/ {count*49}.00</p><button className="sd-btn" onClick={()=>{setOpen(false);setAlert('Simulación terminada: no se procesó ningún pago.')}}>Continuar (demo)</button></div>}{alert && <small role="status">{alert}</small>}</div>}

    {id === 'quantity-selector' && <div className="sd-stack"><h3>Cantidad</h3><div className="sd-actions"><button disabled={count===1} onClick={()=>setCount(n=>Math.max(1,n-1))} aria-label="Reducir"><Minus size={16}/></button><strong>{count}</strong><button disabled={count===20} onClick={()=>setCount(n=>Math.min(20,n+1))} aria-label="Aumentar"><Plus size={16}/></button></div><p>Subtotal de prueba: S/ {count*8}.00</p></div>}

    {id === 'toast' && <div className="sd-stack"><button className="sd-btn" onClick={()=>setAlert('¡Acción confirmada correctamente!')}><Bell size={15}/> Mostrar aviso</button>{alert && <div className="sd-alert" role="status"><Check size={15}/>{alert}<button onClick={()=>setAlert('')} aria-label="Cerrar aviso"><X size={14}/></button></div>}</div>}

    {id === 'modal' && <div className="sd-stack"><button className="sd-btn" onClick={()=>setOpen(true)}>Abrir diálogo</button>{open && <div className="sd-modal"><div role="dialog" aria-modal="true" aria-label="Confirmar acción"><h3>¿Guardar cambios?</h3><p>Demostración local, sin datos externos.</p><div className="sd-actions"><button onClick={()=>setOpen(false)}>Cancelar</button><button className="sd-btn" onClick={()=>{setOpen(false);setAlert('Guardado simulado')}}>Confirmar</button></div></div></div>}{alert && <small role="status">{alert}</small>}</div>}

    {id === 'accordion' && <div className="sd-stack"><button className="sd-accordion" aria-expanded={open} onClick={()=>setOpen(v=>!v)}>¿Para qué sirve este componente?<ChevronDown size={16}/></button>{open && <p>Permite consultar información extensa sin sobrecargar la página.</p>}<button className="sd-accordion" aria-expanded={enabled} onClick={()=>setEnabled(v=>!v)}>¿Es accesible?<ChevronDown size={16}/></button>{enabled && <p>Debe funcionar con teclado y anunciar su estado expandido.</p>}</div>}

    {id === 'segmented-control' && <div className="sd-stack"><div className="sd-segments">{['Mensual','Anual'].map(item=><button key={item} className={active===item?'sd-active':''} onClick={()=>setActive(item)}>{item}</button>)}</div><h3>{active==='Anual'?'S/ 90 al año':'S/ 10 al mes'}</h3><p>Valores ilustrativos; no son planes comerciales.</p></div>}

    {id === 'bottom-sheet' && <div className="sd-stack"><button className="sd-btn" onClick={()=>setOpen(true)}><Menu size={15}/> Mostrar opciones</button>{open && <div className="sd-sheet"><div className="sd-sheet-handle"/><div className="sd-inline"><strong>Opciones</strong><button aria-label="Cerrar opciones" onClick={()=>setOpen(false)}><X size={15}/></button></div>{['Compartir','Guardar','Cancelar'].map(item=><button className="sd-sheet-option" key={item} onClick={()=>{setOpen(false);setAlert(`Opción seleccionada: ${item}`)}}>{item}</button>)}</div>}{alert && <small role="status">{alert}</small>}</div>}
  </div>
}
