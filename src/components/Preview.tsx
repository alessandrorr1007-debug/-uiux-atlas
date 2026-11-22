import { useState } from 'react'
import {
  ArrowRight, Bell, Check, ChevronDown, CircleHelp, Folder, Home,
  LayoutDashboard, Minus, Plus, Search, Settings2, ShoppingBag, Sparkles
} from 'lucide-react'
import type { PreviewKind } from '../types'

type Props = { kind: PreviewKind; name: string; compact?: boolean }

export default function Preview({ kind, name, compact = false }: Props) {
  const [active, setActive] = useState('Inicio')
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(0)
  const [mode, setMode] = useState<'Semana' | 'Mes'>('Semana')
  const [enabled, setEnabled] = useState(true)
  const [notice, setNotice] = useState(false)
  const [claps, setClaps] = useState(12)

  return (
    <div className={`preview preview--${kind} ${compact ? 'preview--compact' : ''}`} aria-label={`Ejemplo interactivo de ${name}`}>
      {kind === 'navigation' && (
        <div className="demo-nav">
          <div className="demo-nav__rail">
            <span className="demo-nav__mark"><LayoutDashboard size={13}/></span>
            {([['Inicio', Home], ['Archivos', Folder], ['Ajustes', Settings2]] as const).map(([label, Icon]) => (
              <button key={label} type="button" className={active === label ? 'demo-nav__item active' : 'demo-nav__item'} onClick={() => setActive(label)} title={label} aria-label={label} aria-pressed={active === label}><Icon size={13} /></button>
            ))}
          </div>
          <div className="demo-nav__body">
            <div className="demo-line short" />
            <strong>{active}</strong>
            <div className="demo-nav__block"><div className="demo-line" /><div className="demo-line medium" /><div className="demo-line short" /></div>
            <div className="demo-nav__blocks"><span/><span/></div>
          </div>
        </div>
      )}
      {kind === 'layouts' && (
        <div className="demo-bento">
          <div className="demo-bento__large"><span className="tiny-label">WORKSPACE</span><strong>Diseña con claridad.</strong><div className="demo-line medium"/><div className="demo-line short"/><button type="button" aria-label="Activar tarjeta" onClick={() => setEnabled(x => !x)}><ArrowRight size={14} className={enabled ? '' : 'turned'} /></button></div>
          <div className="demo-bento__small"><Sparkles size={18}/><span>Ideas</span></div>
          <div className="demo-bento__bottom"><span>Components</span><span className="demo-dot"/><span>System</span></div>
        </div>
      )}
      {kind === 'data' && (
        <div className="demo-data">
          <div className="demo-data__top"><span>Actividad</span><button type="button" onClick={() => setMode(mode === 'Semana' ? 'Mes' : 'Semana')}>{mode} <ChevronDown size={11}/></button></div>
          <strong>{mode === 'Semana' ? '2,840' : '12,680'} <small>+18.6%</small></strong>
          <div className="demo-chart" aria-label="Gráfico de barras de demostración">
            {(mode === 'Semana' ? [32,58,44,80,54,91,69] : [42,73,56,86,66,82,97]).map((v, i) => <span key={i} style={{height: `${v}%`}} />)}
          </div>
        </div>
      )}
      {kind === 'forms' && (
        <div className="demo-form">
          <label htmlFor={`preview-input-${name.replace(/\W/g, '-')}`}>Nombre del proyecto</label>
          <input id={`preview-input-${name.replace(/\W/g, '-')}`} value={value} onChange={event => setValue(event.target.value)} placeholder="Mi proyecto" />
          <div className="demo-form__row"><span>Notificaciones</span><button type="button" className={enabled ? 'demo-switch enabled' : 'demo-switch'} onClick={() => setEnabled(x => !x)} role="switch" aria-checked={enabled} aria-label="Notificaciones"><span/></button></div>
          {value.length > 0 && <div className="demo-form__hint"><Check size={12}/> Guardado localmente en esta demostración</div>}
        </div>
      )}
      {kind === 'commerce' && (
        <div className="demo-product">
          <div className="demo-product__visual"><ShoppingBag size={27}/><span>ATLAS</span></div>
          <div className="demo-product__info"><span className="tiny-label">DEMO PRODUCT</span><strong>Kit de interfaz</strong><span className="demo-product__price">S/ 49.00</span><div className="demo-product__controls"><div className="qty-control"><button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Reducir cantidad"><Minus size={12}/></button><span>{qty}</span><button type="button" onClick={() => setQty(q => Math.min(99, q + 1))} aria-label="Aumentar cantidad"><Plus size={12}/></button></div><button type="button" className="demo-action" onClick={() => setAdded(n => n + qty)}>{added ? `Añadidos: ${added}` : 'Añadir'}</button></div></div>
        </div>
      )}
      {kind === 'feedback' && (
        <div className="demo-feedback"><span className="demo-feedback__eyebrow">NOTIFICACIONES</span><div className={notice ? 'demo-feedback__notice visible' : 'demo-feedback__notice'}><span className="demo-feedback__check"><Check size={14}/></span><span><strong>{notice ? '¡Cambios guardados!' : 'Listo para empezar'}</strong><small>{notice ? 'Tu acción se confirmó.' : 'Prueba la interacción.'}</small></span></div><button type="button" className="demo-action" onClick={() => setNotice(n => !n)}><Bell size={13}/> {notice ? 'Restablecer' : 'Mostrar aviso'}</button></div>
      )}
      {kind === 'motion' && (
        <div className="demo-motion"><span className="demo-motion__orbit one"/><span className="demo-motion__orbit two"/><div className="demo-motion__center"><Sparkles size={26}/></div><button type="button" onClick={() => setClaps(n => n + 1)}><span>✦</span> Interactuar <strong>{claps}</strong></button></div>
      )}
      {kind === 'content' && (
        <div className="demo-content"><div className="demo-content__header"><CircleHelp size={16}/><strong>Centro de ayuda</strong></div><button type="button" className="demo-content__question" onClick={() => setOpen(x => !x)} aria-expanded={open}>¿Cómo funciona el Atlas?<ChevronDown size={14} className={open ? 'rotate' : ''}/></button>{open && <p>Explora patrones, selecciona favoritos y crea un prompt listo para copiar.</p>}<button type="button" className="demo-content__search" onClick={() => setOpen(x => !x)}><Search size={13}/> Explorar respuestas <ArrowRight size={13}/></button></div>
      )}
    </div>
  )
}
