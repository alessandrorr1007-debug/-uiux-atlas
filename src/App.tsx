import { lazy, Suspense, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import {
  ArrowRight, ArrowUpRight, Check, CheckCircle2, ChevronDown,
  Compass, Filter, Github, Heart, Layers3, LayoutDashboard, Menu,
  Moon, Plus, Search, Settings2, SlidersHorizontal, Sparkles, Sun, WandSparkles, BrainCircuit, X,
  type LucideIcon, BarChart3, ClipboardList, ShoppingBag, Bell, LayoutGrid, Type as TypeIcon
} from 'lucide-react'
import { categories, type CategoryId, type ComponentInfo } from './types'
import { components } from './data/components'
import { expansionFamilies } from './data/expansion'
import { filterComponents } from './lib/catalog'
import { loadJSON, saveJSON } from './lib/storage'
import PatternVisual from './components/PatternVisual'
import {resolveSceneKind,sceneGuides} from './lib/pattern-scene'
import ExtendedPatternDemo, {hasExtendedDemo} from './components/ExtendedPatternDemo'
import PatternDemo, { hasSpecificDemo } from './components/PatternDemo'
import type { SectorPreset } from './data/sectors'
import type { WorkspaceView } from './components/Workspace'
const Workspace = lazy(() => import('./components/Workspace'))
const AtlasIA = lazy(() => import('./components/AtlasIA'))

const categoryIcons: Record<string, LucideIcon> = {
  compass: Compass, layout: LayoutGrid, chart: BarChart3, form: ClipboardList,
  shopping: ShoppingBag, bell: Bell, sparkles: Sparkles, type: TypeIcon
}

const accents = [
  { id: 'violet', label: 'Lavanda', light: '#695b96', dark: '#c0b2dd' },
  { id: 'blue', label: 'Azul niebla', light: '#456f91', dark: '#a9c5df' },
  { id: 'mint', label: 'Salvia', light: '#3d7269', dark: '#a5d3c4' },
  { id: 'coral', label: 'Arcilla', light: '#925967', dark: '#ecc3bd' }
]

function CategoryIcon({ icon, size = 18 }: { icon: string; size?: number }) {
  const Icon = categoryIcons[icon] ?? Layers3
  return <Icon size={size}/>
}

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => loadJSON('theme', 'light'))
  const [accent, setAccent] = useState(() => loadJSON('accent', 'violet'))
  const [favorites, setFavorites] = useState<string[]>(() => loadJSON('favorites', []))
  const [promptIds, setPromptIds] = useState<string[]>(() => loadJSON('selection', []))
  const [category, setCategory] = useState<CategoryId | 'all'>('all')
  const [family, setFamily] = useState<string>('all')
  const [categoriesExpanded, setCategoriesExpanded] = useState(false)
  const [workspace, setWorkspace] = useState<'atlas' | WorkspaceView | 'ai'>('atlas')
  const [aiBrief, setAiBrief] = useState('')
  const [search, setSearch] = useState('')
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [visibleCount, setVisibleCount] = useState(12)
  const [selected, setSelected] = useState<ComponentInfo | null>(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [toast, setToast] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const chosen = accents.find(item => item.id === accent) ?? accents[0]
    document.documentElement.dataset.theme = theme
    document.documentElement.style.setProperty('--accent', theme === 'dark' ? chosen.dark : chosen.light)
    saveJSON('theme', theme)
    saveJSON('accent', accent)
  }, [theme, accent])
  useEffect(() => { saveJSON('favorites', favorites) }, [favorites])
  useEffect(() => { saveJSON('selection', promptIds) }, [promptIds])
  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setSelected(null); setSettingsOpen(false); setMobileNavOpen(false) }
      if (event.key === '/' && workspace === 'atlas' && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement) && !(event.target instanceof HTMLSelectElement)) {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', keyHandler)
    return () => window.removeEventListener('keydown', keyHandler)
  }, [workspace])
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2900)
    return () => window.clearTimeout(timer)
  }, [toast])
  useEffect(() => {
    document.body.classList.toggle('dialog-open', Boolean(selected || settingsOpen || mobileNavOpen))
    return () => document.body.classList.remove('dialog-open')
  }, [selected, settingsOpen, mobileNavOpen])

  const filtered = useMemo(
    () => filterComponents(components, search, category, onlyFavorites, favorites, family),
    [search, category, onlyFavorites, favorites, family]
  )
  const visible = filtered.slice(0, visibleCount)
  const activeCategory = categories.find(item => item.id === category)
  const activeFamily = expansionFamilies.find(item => item.id === family)

  const selectCategory = (value: CategoryId | 'all') => {
    setWorkspace('atlas')
    setCategory(value)
    setFamily('all')
    setVisibleCount(12)
    setMobileNavOpen(false)
  }
  const selectFamily = (value: string) => {
    setFamily(value)
    setCategory('all')
    setOnlyFavorites(false)
    setVisibleCount(12)
  }
  const changeSearch = (value: string) => {
    setSearch(value)
    setVisibleCount(12)
  }
  const toggleFavorite = (id: string) => {
    setFavorites(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  }
  const toggleSelection = (id: string) => {
    setPromptIds(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  }
  const copyText = async (value: string) => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard-unavailable')
      await navigator.clipboard.writeText(value)
      setToast('Prompt copiado al portapapeles')
    } catch {
      setToast('No se pudo copiar. Selecciona el texto del editor y cópialo manualmente.')
    }
  }
  const openAtlasWithSelection = (id?: string) => {
    if (id) setPromptIds(previous => previous.includes(id) ? previous : [...previous, id])
    setSelected(null)
    setAiBrief('')
    setWorkspace('ai')
    setMobileNavOpen(false)
  }
  const switchTheme = () => setTheme(current => current === 'dark' ? 'light' : 'dark')
  const openWorkspace = (value: WorkspaceView) => { setWorkspace(value); setMobileNavOpen(false) }
  const openAtlasAI = () => { setAiBrief(''); setSelected(null); setWorkspace('ai'); setMobileNavOpen(false) }
  const openLibrary = () => { setOnlyFavorites(false); setSearch(''); selectCategory('all') }
  const useSectorPreset = (preset: SectorPreset) => {
    setPromptIds(preset.components.filter(id => components.some(item => item.id === id)))
    setAiBrief(`Quiero diseñar ${preset.kind === 'app' ? 'una aplicación' : 'un sitio web'} para ${preset.name}. Público objetivo: ${preset.audience}. Objetivo: ${preset.goal}. Usa los patrones seleccionados y propón una estructura UI/UX profesional y accesible.`)
    setWorkspace('ai')
    setMobileNavOpen(false)
  }

  const sidebar = (
    <>
      <div className="brand"><div className="brand__icon"><Layers3 size={22} strokeWidth={2.25}/></div><div><strong>UIUX <span>Atlas</span></strong><small>Design intelligence</small></div></div>
      <div className="sidebar__section-title">EMPEZAR</div>
      <nav className="sidebar__nav" aria-label="Accesos principales">
        <button className={workspace==='ai'?'sidebar__link sidebar__link--primary active':'sidebar__link sidebar__link--primary'} onClick={openAtlasAI}>
          <BrainCircuit size={18}/><span>Atlas IA</span><em>Asesor</em>
        </button>
        <button className={workspace==='atlas' && category==='all' && family==='all' && !onlyFavorites?'sidebar__link active':'sidebar__link'} onClick={openLibrary}>
          <LayoutDashboard size={18}/><span>Biblioteca completa</span><em>{components.length}</em>
        </button>
      </nav>
      <div className="sidebar__section-title space-top">DICCIONARIO</div>
      <div className="sidebar__nav">
        <button className="sidebar__link sidebar__toggle" aria-expanded={categoriesExpanded} aria-controls="atlas-categories" onClick={()=>setCategoriesExpanded(open=>!open)}>
          <Layers3 size={18}/><span>Explorar categorías</span><ChevronDown className={categoriesExpanded?'sidebar__chevron expanded':'sidebar__chevron'} size={16}/>
        </button>
        {categoriesExpanded && <nav className="sidebar__category-list" id="atlas-categories" aria-label="Categorías de patrones">
          {categories.map(item => (
            <button key={item.id} className={workspace==='atlas' && category===item.id && !onlyFavorites?'sidebar__link active':'sidebar__link'} onClick={()=>{setOnlyFavorites(false);selectCategory(item.id)}}>
              <CategoryIcon icon={item.icon}/><span>{item.label}</span><em>{components.filter(c=>c.category===item.id).length}</em>
            </button>
          ))}
        </nav>}
      </div>
      <div className="sidebar__section-title space-top">HERRAMIENTAS DE DISEÑO</div>
      <div className="sidebar__nav">
        <button className={workspace==='lab'?'sidebar__link active':'sidebar__link'} onClick={()=>openWorkspace('lab')}><Sparkles size={18}/><span>Laboratorio interactivo</span><em>46</em></button>
        <button className={workspace==='templates'?'sidebar__link active':'sidebar__link'} onClick={()=>openWorkspace('templates')}><LayoutGrid size={18}/><span>Plantillas por rubro</span><em>20</em></button>
        <button className={workspace==='audit'?'sidebar__link active':'sidebar__link'} onClick={()=>openWorkspace('audit')}><CheckCircle2 size={18}/><span>Auditoría UI/UX</span><em>22</em></button>
        <button className={workspace==='photo'?'sidebar__link active':'sidebar__link'} onClick={()=>openWorkspace('photo')}><WandSparkles size={18}/><span>Estudio fotográfico</span><em>54</em></button>
      </div>
      <div className="sidebar__section-title space-top">MIS RECURSOS</div>
      <div className="sidebar__nav">
        <button className={workspace==='atlas' && onlyFavorites ? 'sidebar__link active' : 'sidebar__link'} onClick={() => { setOnlyFavorites(true); setSearch(''); selectCategory('all') }}><Heart size={18}/><span>Favoritos</span><em>{favorites.length}</em></button>
      </div>
      <div className="sidebar__bottom"><div className="sidebar__foot">ATLAS STUDIO <span>V 0.4.4</span></div></div>
    </>
  )

  return (
    <div className="app-shell">
      <aside className="sidebar">{sidebar}</aside>
      {mobileNavOpen && <div className="mobile-backdrop" onClick={() => setMobileNavOpen(false)}><aside className="sidebar sidebar--mobile" onClick={event => event.stopPropagation()}><button className="mobile-close icon-button" onClick={() => setMobileNavOpen(false)} aria-label="Cerrar menú"><X size={20}/></button>{sidebar}</aside></div>}
      <main className="main">
        <header className="topbar">
          <div className="topbar__left"><button className="icon-button menu-button" aria-label="Abrir menú" onClick={() => setMobileNavOpen(true)}><Menu size={20}/></button><span className="topbar__location"><span>UIUX Atlas</span><span className="location-slash">/</span><strong>{workspace === 'atlas' ? 'Biblioteca de diseño' : workspace === 'ai' ? 'Atlas IA' : ({lab:'Laboratorio',templates:'Plantillas',audit:'Auditoría',photo:'Fotografía'} as Record<WorkspaceView,string>)[workspace]}</strong></span></div>
          <div className="topbar__right"><button className="icon-button" aria-label="Cambiar tema" title="Alternar tema" onClick={switchTheme}>{theme === 'dark' ? <Sun size={19}/> : <Moon size={19}/>}</button><button className="icon-button" aria-label="Personalizar apariencia" title="Personalizar apariencia" onClick={() => setSettingsOpen(true)}><Settings2 size={19}/></button><a className="icon-button github-button" title="Ver repositorio en GitHub" aria-label="GitHub" href="https://github.com/alessandrorr1007-debug/-uiux-atlas" target="_blank" rel="noreferrer"><Github size={19}/></a><span className="topbar__avatar" aria-label="Atlas">A</span></div>
        </header>
        <div className="page">
          {workspace === 'atlas' ? <>
          <section className="hero">
            <div className="hero__content"><div className="eyebrow"><span className="eyebrow__spark"><Sparkles size={13}/></span> IDEAS CLARAS, INTERFACES MEJORES <span className="eyebrow__line"/></div><h1>Diseña con calma.<br/><span>Crea con intención.</span></h1><p>Un espacio para aprender UI/UX, elegir entre 406 patrones y convertir ideas en proyectos claros, sin complicaciones.</p><div className="hero__actions"><button className="primary-button" onClick={openAtlasAI}><BrainCircuit size={17}/> Explorar Atlas IA <ArrowUpRight size={16}/></button><button className="secondary-button" onClick={() => { searchRef.current?.focus(); searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }}>Ver los patrones <ArrowRight size={16}/></button></div><div className="hero__stats"><span><strong>{components.length}</strong> patrones UI/UX</span><span className="stat-divider"/><span><strong>24</strong> familias nuevas</span><span className="stat-divider"/><span><strong>46</strong> demos interactivas</span></div></div>
            <div className="hero__art" aria-hidden="true"><div className="hero__grid"/><div className="art-frame art-frame--back"><span className="art-dot"/><span className="art-line"/><div className="art-minigrid"><i/><i/><i/></div></div><div className="art-frame art-frame--front"><div className="art-window"><span/><span/><span/></div><div className="art-frame__title"><span className="art-diamond">✦</span> Design your next idea</div><div className="art-frame__graph"><span/><span/><span/><span/><span/><span/></div><div className="art-frame__cards"><div/><div/></div><div className="art-frame__bottom"><span/><span/></div></div><div className="hero__orbit hero__orbit--one"/><div className="hero__orbit hero__orbit--two"/></div>
          </section>
          <section className="start-paths" aria-label="Accesos rápidos">
            <button className="start-path" onClick={openLibrary}>
              <span className="start-path__icon"><Layers3 size={19}/></span>
              <span className="start-path__body"><strong>Descubre patrones</strong><small>Explora el diccionario y guarda tus favoritos.</small></span>
              <ArrowUpRight size={16}/>
            </button>
            <button className="start-path" onClick={openAtlasAI}>
              <span className="start-path__icon"><BrainCircuit size={19}/></span>
              <span className="start-path__body"><strong>Habla con Atlas IA</strong><small>Planea una web nueva o mejora la que ya tienes.</small></span>
              <ArrowUpRight size={16}/>
            </button>
            <button className="start-path" onClick={()=>openWorkspace('lab')}>
              <span className="start-path__icon"><Sparkles size={19}/></span>
              <span className="start-path__body"><strong>Prueba diseños</strong><small>Experimenta con ejemplos y herramientas.</small></span>
              <ArrowUpRight size={16}/>
            </button>
          </section>
          <section className="library" aria-labelledby="library-heading">
            <div className="section-heading"><div><div className="section-label"><span/> EXPLORAR EL DICCIONARIO</div><h2 id="library-heading">{onlyFavorites ? 'Tus favoritos' : activeFamily?.label ?? activeCategory?.label ?? 'Biblioteca de componentes'} <span className="count-pill">{filtered.length}</span></h2><p>Encuentra el componente adecuado por nombre, categoría o familia.</p></div><button className="text-button section-action" onClick={openAtlasAI}>Crear con Atlas IA <ArrowUpRight size={17}/></button></div>
            <div className="toolbar"><div className="search-box"><Search size={19}/><input ref={searchRef} type="search" value={search} onChange={event => changeSearch(event.target.value)} placeholder="Buscar un componente, patrón o concepto..." aria-label="Buscar componentes"/><kbd>/</kbd></div><button className={onlyFavorites ? 'toolbar-button active' : 'toolbar-button'} onClick={() => { setOnlyFavorites(value => !value); setCategory('all'); setFamily('all'); setVisibleCount(12) }}><Heart size={17} fill={onlyFavorites ? 'currentColor' : 'none'}/> Favoritos</button><div className="toolbar__label"><Filter size={16}/> {filtered.length} resultados</div></div>
            <div className="category-chips" aria-label="Filtrar por categoría"><button className={category === 'all' && family === 'all' && !onlyFavorites ? 'chip active' : 'chip'} onClick={() => { setOnlyFavorites(false); selectCategory('all') }}>Todos</button>{categories.map(cat => <button key={cat.id} className={category === cat.id && !onlyFavorites ? 'chip active' : 'chip'} onClick={() => { setOnlyFavorites(false); selectCategory(cat.id) }}>{cat.label}</button>)}</div>
            <div className="family-toolbar">
              <div className="family-toolbar__intro"><strong>Explorar familias especializadas</strong><span>24 familias nuevas · 12 patrones por familia · 288 incorporados</span></div>
              <label className="family-toolbar__selector" htmlFor="family-filter">
                <SlidersHorizontal size={16}/>
                <select id="family-filter" value={family} onChange={event => selectFamily(event.target.value)} aria-label="Filtrar por familia especializada">
                  <option value="all">Todas las familias (406 patrones)</option>
                  {categories.map(cat => (
                    <optgroup key={cat.id} label={cat.label}>
                      {expansionFamilies.filter(item => item.category === cat.id).map(item => <option key={item.id} value={item.id}>{item.label} · 12</option>)}
                    </optgroup>
                  ))}
                </select>
              </label>
              {family !== 'all' && <button className="family-toolbar__clear" onClick={() => selectFamily('all')}>Quitar filtro <X size={14}/></button>}
            </div>

            {filtered.length > 0 ? (
              <><div className="catalog-grid">{visible.map(item => {
                const fav = favorites.includes(item.id)
                const picked = promptIds.includes(item.id)
                return <article className="pattern-card" key={item.id}>
                  <div className="pattern-card__preview"><button type="button" className="pattern-card__preview-button" aria-label={'Ampliar ejemplo visual de '+item.name} onClick={()=>setSelected(item)}><PatternVisual item={item}/></button><span className={'pattern-card__type'+(hasSpecificDemo(item.id)||hasExtendedDemo(item.id)?' is-demo':'')}>{hasSpecificDemo(item.id)||hasExtendedDemo(item.id)?'DEMO PARA PROBAR':'MAQUETA INDIVIDUAL'}</span></div>
                  <div className="pattern-card__body"><div className="pattern-card__category"><span>{item.family ? expansionFamilies.find(c => c.id === item.family)?.label : categories.find(c => c.id === item.category)?.label}</span><button className={fav ? 'heart-button loved' : 'heart-button'} onClick={() => toggleFavorite(item.id)} aria-label={fav ? `Quitar ${item.name} de favoritos` : `Guardar ${item.name} en favoritos`} title="Favorito"><Heart size={17} fill={fav ? 'currentColor' : 'none'}/></button></div><button className="pattern-card__name" onClick={() => setSelected(item)}>{item.name} <ArrowUpRight size={17}/></button><p>{item.description}</p><div className="pattern-card__actions"><button className="pattern-card__detail" onClick={() => setSelected(item)}>Explorar patrón <ArrowRight size={14}/></button><button className={picked ? 'pattern-card__add selected' : 'pattern-card__add'} onClick={() => toggleSelection(item.id)} aria-label={picked ? `Quitar ${item.name} de la selección para Atlas IA` : `Seleccionar ${item.name} para Atlas IA`} title={picked ? 'Quitar de Atlas IA' : 'Seleccionar para Atlas IA'}>{picked ? <Check size={17}/> : <Plus size={17}/>}</button></div></div>
                </article>
              })}</div>{visibleCount < filtered.length && <div className="load-more"><button className="secondary-button" onClick={() => setVisibleCount(n => n + 12)}>Ver más patrones <ChevronDown size={17}/></button><span>Mostrando {visible.length} de {filtered.length}</span></div>}</>
            ) : <div className="empty-state"><div><Search size={27}/></div><h3>No encontramos componentes</h3><p>Prueba con otra palabra o elimina los filtros para ver la biblioteca completa.</p><button className="secondary-button" onClick={() => { setSearch(''); setOnlyFavorites(false); selectCategory('all') }}>Limpiar filtros <ArrowRight size={15}/></button></div>}
          </section>
          </> : workspace === 'ai' ? <Suspense fallback={<div className="workspace-loading" role="status">Cargando Atlas IA…</div>}><AtlasIA selectedPatternIds={promptIds} onSelectedPatternIdsChange={setPromptIds} initialDraft={aiBrief}/></Suspense> : <Suspense fallback={<div className="workspace-loading" role="status">Cargando estudio de diseño…</div>}><Workspace view={workspace} onUsePreset={useSectorPreset} onCopy={copyText}/></Suspense>}
          <footer className="footer"><span><Layers3 size={16}/> UIUX Atlas · Hecho para crear mejor</span><span>Biblioteca educativa · v0.4.4</span></footer>
        </div>
      </main>

      <div className={workspace==='atlas' && promptIds.length ? 'builder-dock visible' : 'builder-dock'} aria-live="polite"><div className="builder-dock__symbol"><WandSparkles size={19}/></div><div><strong>{promptIds.length} {promptIds.length === 1 ? 'componente seleccionado' : 'componentes seleccionados'}</strong><small>Llévalos a Atlas IA para diseñar tu proyecto</small></div><button className="dock-clear" onClick={() => setPromptIds([])}>Limpiar</button><button className="primary-button" onClick={() => openAtlasWithSelection()}>Abrir Atlas IA <ArrowRight size={16}/></button></div>

      {selected && <div className="overlay" onMouseDown={event => { if (event.target === event.currentTarget) setSelected(null) }}><section className="detail-panel" role="dialog" aria-modal="true" aria-labelledby="detail-title"><div className="panel-header"><div><span className="section-label">EXPLORADOR DE PATRONES</span><h2 id="detail-title">{selected.name}</h2></div><button className="icon-button" onClick={() => setSelected(null)} aria-label="Cerrar detalle"><X size={21}/></button></div><div className="panel-scroll"><div className="detail-preview"><PatternVisual item={selected} large/></div>
<div className="detail-label"><Sparkles size={14}/> MAQUETA INDIVIDUAL · {selected.family ? expansionFamilies.find(c => c.id === selected.family)?.label : categories.find(c => c.id === selected.category)?.label}</div>
<div className="detail-scene-caption"><strong>Así se representa:</strong> {sceneGuides[resolveSceneKind(selected)]} Ejemplo ilustrativo de interfaz, adaptado a este patrón; no es una captura de un sistema real.</div>
{(hasSpecificDemo(selected.id)||hasExtendedDemo(selected.id)) && <section className="detail-demo" aria-label={'Demostración interactiva de '+selected.name}>
  <div className="detail-demo__top"><span>PRUEBA EL COMPONENTE</span><small>Interacción local · sin datos reales</small></div>
  <div className="detail-demo__stage">{hasSpecificDemo(selected.id)?<PatternDemo key={selected.id} id={selected.id}/>:<ExtendedPatternDemo key={selected.id} id={selected.id}/>}</div>
</section>}<div className="detail-section"><h3>¿Qué es?</h3><p>{selected.description}</p></div><div className="detail-section"><h3>¿Cuándo usarlo?</h3><p>{selected.useCase}</p></div><div className="detail-note"><CheckCircle2 size={19}/><span><strong>Buena práctica</strong>{selected.guidance}</span></div></div><div className="panel-footer"><button className="secondary-button" onClick={() => toggleFavorite(selected.id)}><Heart size={17} fill={favorites.includes(selected.id) ? 'currentColor' : 'none'}/>{favorites.includes(selected.id) ? 'Guardado' : 'Favorito'}</button><button className="secondary-button" onClick={() => { toggleSelection(selected.id); setToast(promptIds.includes(selected.id) ? 'Quitado de la selección de Atlas IA' : 'Seleccionado para Atlas IA') }}>{promptIds.includes(selected.id) ? <Check size={17}/> : <Plus size={17}/>} {promptIds.includes(selected.id) ? 'Seleccionado' : 'Seleccionar'}</button><button className="primary-button" onClick={() => openAtlasWithSelection(selected.id)}><BrainCircuit size={16}/> Usar en Atlas IA</button></div></section></div>}

      {settingsOpen && <div className="overlay" onMouseDown={event => { if (event.target === event.currentTarget) setSettingsOpen(false) }}><section className="settings-panel" role="dialog" aria-modal="true" aria-labelledby="settings-title"><div className="panel-header"><div><span className="section-label">PERSONALIZACIÓN</span><h2 id="settings-title">Tu espacio, tu estilo</h2></div><button className="icon-button" onClick={() => setSettingsOpen(false)} aria-label="Cerrar ajustes"><X size={20}/></button></div><div className="settings-content"><label className="field-label">Apariencia</label><div className="theme-options"><button className={theme === 'dark' ? 'theme-option active' : 'theme-option'} onClick={() => setTheme('dark')}><Moon size={21}/> Noche suave</button><button className={theme === 'light' ? 'theme-option active' : 'theme-option'} onClick={() => setTheme('light')}><Sun size={21}/> Niebla suave</button></div><label className="field-label">Color de acento</label><div className="accent-picker">{accents.map(item => <button key={item.id} className={accent === item.id ? 'accent-option active' : 'accent-option'} onClick={() => setAccent(item.id)} title={item.label} aria-label={`Color ${item.label}`} aria-pressed={accent === item.id} style={{'--swatch': theme === 'dark' ? item.dark : item.light} as CSSProperties}>{accent === item.id && <Check size={17}/>}</button>)}</div><p className="settings-hint">El tema, tus favoritos y tu selección de patrones se guardan únicamente en este navegador.</p></div></section></div>}

      {toast && <div role="status" className="toast-message"><CheckCircle2 size={18}/>{toast}<button onClick={() => setToast('')} aria-label="Cerrar aviso"><X size={15}/></button></div>}
    </div>
  )
}

export default App
