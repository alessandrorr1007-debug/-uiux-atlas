import type { ReactNode } from 'react'
import type { ComponentInfo } from '../types'
import { createPatternScene, type SceneKind } from '../lib/pattern-scene'

const colors = {
  bg:'#F0F3F6', frame:'#FFFFFF', line:'#DAE2E9', text:'#31465C',
  muted:'#7B8DA0', accent:'#75679F', accentSoft:'#E4DEF2',
  blue:'#80A9C6', blueSoft:'#E3EFF6', sage:'#85B9A8', sageSoft:'#E2F0EB',
  gold:'#E5B984', goldSoft:'#F6ECD7', rose:'#C78F9D', roseSoft:'#F4E6EA'
}

function R({x,y,w,h,fill=colors.frame,rx=5,opacity=1,stroke}:{
  x:number;y:number;w:number;h:number;fill?:string;rx?:number;opacity?:number;stroke?:string
}) { return <rect x={x} y={y} width={Math.max(0,w)} height={Math.max(0,h)} fill={fill} rx={rx} opacity={opacity} stroke={stroke}/> }
function L({x,y,w,fill=colors.line,h=5}:{
  x:number;y:number;w:number;fill?:string;h?:number
}) { return <R x={x} y={y} w={w} h={h} rx={h/2} fill={fill}/> }
function Txt({x,y,children,color=colors.text,size=11,bold=false,anchor}:{
  x:number;y:number;children:ReactNode;color?:string;size?:number;bold?:boolean;anchor?:'middle'|'end'|'start'
}) {return <text x={x} y={y} fill={color} fontSize={size} fontWeight={bold?750:500} textAnchor={anchor} fontFamily="Inter,system-ui,sans-serif">{children}</text>}
function C({x,y,r=5,fill=colors.accent}: {x:number;y:number;r?:number;fill?:string}) {return <circle cx={x} cy={y} r={r} fill={fill}/>}
function Btn({x,y,w=75,text='Continuar',tone='accent'}:{
  x:number;y:number;w?:number;text?:string;tone?:'accent'|'muted'
}) {return <g><R x={x} y={y} w={w} h={21} rx={6} fill={tone==='accent'?colors.accent:colors.blueSoft}/>
  <Txt x={x+w/2} y={y+14} color={tone==='accent'?'white':colors.text} size={9} anchor="middle" bold>{text.slice(0,16)}</Txt></g>}
function Panel({children,x=19,y=51,w=322,h=120}:{
  children:ReactNode;x?:number;y?:number;w?:number;h?:number
}){return <g><R x={x} y={y} w={w} h={h} fill="#FFFFFF" rx={11} stroke={colors.line}/>{children}</g>}
function Chart({kind='bar',seed=5,x=38,y=79,w=280,h=73}:{
 kind?:'bar'|'line'|'donut'|'area';seed?:number;x?:number;y?:number;w?:number;h?:number
}){
 const values=Array.from({length:8},(_,i)=>Math.round(19+(((seed>>>((i%4)*6))+i*17)%70)))
 const points=values.map((v,i)=>[x+6+i*((w-20)/7),y+h-v*(h/110)] as const)
 return <g>
   {[0,1,2].map(i=><L key={i} x={x} y={y+13+i*21} w={w} h={1.5} fill={colors.line}/>)}
   {kind==='bar' && values.map((v,i)=><R key={i} x={x+8+i*w/8} y={y+h-v*.57} w={Math.max(7,w/10)} h={v*.57} rx={3} fill={i===seed%8?colors.accent:colors.blue}/>)}
   {kind==='line'&&<polyline points={points.map(([a,b])=>a+','+b).join(' ')} fill="none" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>}
   {kind==='area'&&<polygon points={points.map(([a,b])=>a+','+b).join(' ')+' '+(x+w-14)+','+(y+h)+' '+(x+6)+','+(y+h)} fill={colors.accentSoft} stroke={colors.accent} strokeWidth="2"/>}
   {kind==='donut'&& <g transform={'translate('+(x+w/2)+','+(y+h/2)+')'}><circle r={31} fill="none" stroke={colors.blueSoft} strokeWidth="16"/><circle r={31} fill="none" stroke={colors.accent} strokeWidth="16" strokeDasharray="114 196" transform="rotate(-90)"/><Txt x={0} y={4} anchor="middle" bold size={15}>72%</Txt></g>}
 </g>
}

function SceneBody({kind,variation,seed,feature,heading,supporting}:{
  kind:SceneKind;variation:number;seed:number;feature:string;heading:string;supporting:string
}){
 const accent=[colors.accent,colors.blue,colors.sage,colors.rose,colors.gold][variation]
 const value=30+variation*13
 const key=(text:string)=>text.length>27?text.slice(0,25)+'…':text
 if(kind==='sidebar')return <Panel>
   <R x={25} y={57} w={84+variation*4} h={108} fill={colors.blueSoft} rx={7}/>
   <Txt x={34} y={74} size={10} bold>Atlas</Txt>
   {['Inicio',feature.slice(0,10),'Ajustes'].map((s,i)=><g key={i}>
     {i===variation%3&&<R x={30} y={87+i*20} w={68} h={17} fill={colors.accentSoft}/>}
     <C x={39} y={96+i*20} r={3} fill={i===variation%3?colors.accent:colors.blue}/>
     <Txt x={47} y={99+i*20} size={7.8}>{s}</Txt></g>)}
   <Txt x={135} y={79} size={12} bold>{key(feature||'Panel')}</Txt>
   {[140,118,134].map((w,i)=><L key={i} x={135} y={90+i*14} w={w}/>)}
   <R x={135} y={138} w={94} h={21} fill={colors.sageSoft}/>
   <R x={238} y={138} w={85} h={21} fill={colors.blueSoft}/>
 </Panel>
 if(kind==='navbar'||kind==='tabs'||kind==='menu'||kind==='steps'||kind==='tree')return <Panel>
   {(kind==='tabs'||kind==='navbar')&&<g>
     <Txt x={35} y={73} bold size={10}>Atlas</Txt>
     {['Inicio',feature.slice(0,9),'Perfil'].map((x,i)=><g key={i}>
       <R x={109+i*70} y={60} w={65} h={22} fill={i===variation%3?colors.accentSoft:colors.bg}/>
       <Txt x={141+i*70} y={74} size={8} anchor="middle">{x}</Txt></g>)}
     <L x={37} y={95} w={128} h={8} fill={colors.blue}/>
     <L x={37} y={112} w={227}/><L x={37} y={125} w={180}/>
     <R x={37} y={140} w={119} h={20} fill={colors.sageSoft}/>
   </g>}
   {kind==='menu'&&<g>
     <R x={35} y={65} w={271} h={23} fill={colors.blueSoft}/>
     <Txt x={45} y={81} bold size={10}>{key(heading)}</Txt><Txt x={294} y={81} size={12}>⋮</Txt>
     <R x={171+variation*8} y={90} w={132-variation*8} h={66} fill={colors.frame} stroke={colors.line}/>
     {['Abrir','Compartir','Configuración'].map((s,i)=><g key={i}><C x={182+variation*8} y={102+i*18} r={3} fill={i===1?accent:colors.blue}/><Txt x={193+variation*8} y={105+i*18} size={8}>{s}</Txt></g>)}
   </g>}
   {kind==='steps'&&<g>
     <Txt x={35} y={71} size={11} bold>{feature} · Proceso</Txt>
     {[0,1,2,3].map((i)=><g key={i}><C x={60+i*72} y={100} r={12} fill={i<=variation%4?colors.accent:colors.line}/><Txt x={60+i*72} y={104} size={10} anchor="middle" color={i<=variation%4?'white':colors.text}>{i+1}</Txt>{i<3&&<L x={75+i*72} y={98} w={43} h={3}/>}</g>)}
     <L x={38} y={132} w={142}/><Btn x={240} y={137} w={82} text="Siguiente"/>
   </g>}
   {kind==='tree'&&<g><Txt x={36} y={71} bold size={10}>Estructura</Txt>
     {['▸ Inicio','▾ '+feature,'  ├ Contenido','  └ Ajustes'].map((s,i)=><g key={i}><R x={37+i*9} y={78+i*20} w={230-i*12} h={16} fill={i===1?colors.accentSoft:colors.frame}/><Txt x={42+i*9} y={90+i*20} size={10}>{s}</Txt></g>)}</g>}
 </Panel>
 if(kind==='search')return <Panel>
   <Txt x={36} y={70} bold size={11}>{key(heading)}</Txt>
   <R x={34} y={79} w={290} h={26} fill={colors.bg} rx={7} stroke={colors.line}/>
   <C x={47} y={91} r={5} fill="none"/><circle cx={47} cy={91} r={5} stroke={accent} strokeWidth={2} fill="none"/>
   <path d="M51 95 l5 5" stroke={accent} strokeWidth={2}/>
   <Txt x={64} y={95} size={9} color={colors.muted}>{feature||'Buscar'}...</Txt>
   {['Todos','Web','App'].map((s,i)=><g key={i}><R x={35+i*64} y={114} w={59} h={19} fill={i===variation%3?colors.accentSoft:colors.bg}/><Txt x={64+i*64} y={127} size={8} anchor="middle">{s}</Txt></g>)}
   {[36,36,36].map((x,i)=><g key={i}><C x={x+7} y={147+i*12} r={3} fill={i?colors.sage:accent}/><L x={x+20} y={144+i*12} w={230-i*27} h={5}/></g>)}
 </Panel>
 if(kind==='hero'||kind==='columns'||kind==='grid'||kind==='cards'||kind==='dashboard')return <Panel>
   {kind==='hero'&&<g>
     <Txt x={35} y={79} size={13} bold>{key(feature||'Diseña mejor')}</Txt>
     <Txt x={35} y={94} size={8} color={colors.muted}>Una experiencia a tu medida</Txt>
     <L x={35} y={106} w={117}/><L x={35} y={118} w={95}/>
     <Btn x={35} y={134} w={84} text="Descubrir"/>
     <R x={186} y={65} w={135} h={95} fill={colors.blueSoft} rx={12}/>
     {[0,1,2].map(i=><R key={i} x={206+i*24} y={122-i*11} w={20} h={27+i*11} fill={i===variation%3?colors.accent:colors.blue} rx={5}/>)}
     <C x={270} y={86} r={15} fill={colors.sageSoft}/>
   </g>}
   {kind==='columns'&&<g>
     {[0,1,2].slice(0,variation%2?2:3).map((i,_,a)=>{const w=(282-(a.length-1)*10)/a.length;return <g key={i}><R x={35+i*(w+10)} y={63} w={w} h={95} fill={i===0?colors.blueSoft:i===1?colors.accentSoft:colors.sageSoft} rx={7}/><L x={43+i*(w+10)} y={80} w={w*.62} h={6} fill={accent}/>{[0,1,2].map(q=><L key={q} x={43+i*(w+10)} y={98+q*14} w={w*.75-q*6} h={4} fill={colors.line}/>)}</g>})}
   </g>}
   {(kind==='grid'||kind==='cards')&&<g>
     {[0,1,2,3,4,5].slice(0,variation===4?4:6).map((i,_,list)=>{
       const cols=list.length===4?2:3,w=276/cols-8,x=35+(i%cols)*(w+10),y=62+Math.floor(i/cols)*(list.length===4?47:50)
       return <g key={i}><R x={x} y={y} w={w} h={list.length===4?41:43} fill={[colors.blueSoft,colors.accentSoft,colors.sageSoft,colors.goldSoft][(i+variation)%4]} rx={6}/><C x={x+13} y={y+13} r={5} fill={i%3===0?accent:colors.blue}/><L x={x+10} y={y+25} w={Math.max(27,w*.62)} h={5} fill={colors.frame}/><L x={x+10} y={y+33} w={Math.max(20,w*.35)} h={3} fill={colors.frame}/></g>
     })}
   </g>}
   {kind==='dashboard'&&<g>
     {[0,1,2].map(i=><g key={i}><R x={35+i*96} y={62} w={87} h={40} fill={[colors.blueSoft,colors.accentSoft,colors.sageSoft][(i+variation)%3]} rx={6}/><Txt x={44+i*96} y={78} size={7}>Métrica {i+1}</Txt><Txt x={44+i*96} y={94} size={14} bold>{(value+i*21)*12}</Txt></g>)}
     <Chart seed={seed} kind={variation%2?'line':'bar'} x={41} y={115} w={267} h={44}/>
   </g>}
 </Panel>
 if(kind==='chart'||kind==='heatmap'||kind==='table'||kind==='calendar'||kind==='kanban'||kind==='timeline'||kind==='map')return <Panel>
   <Txt x={35} y={69} bold size={10}>{key(heading)}</Txt>
   {kind==='chart'&&<Chart seed={seed} kind={/donut|pie|sunburst|gauge/i.test(heading)?'donut':variation%3===0?'area':variation%2?'line':'bar'} x={39} y={79} w={280} h={79}/>}
   {kind==='heatmap'&&Array.from({length:7*4},(_,i)=><R key={i} x={40+(i%7)*39} y={81+Math.floor(i/7)*20} w={34} h={15}
     fill={[colors.blueSoft,colors.sageSoft,colors.accentSoft,colors.accent,colors.blue,colors.sage][(seed+i*7+Math.floor(i/7)*5)%6]} rx={3}/>)}
   {kind==='table'&&<g><R x={37} y={79} w={278} h={19} fill={colors.blueSoft}/>{[0,1,2,3].map(i=><g key={i}>
     <R x={37} y={100+i*15} w={278} h={14} fill={i%2?colors.bg:colors.frame}/>
     <L x={44} y={104+i*15} w={68+(seed+i)%30} h={5} fill={colors.muted}/>
     <L x={161} y={104+i*15} w={70} h={5}/>
     <R x={258} y={103+i*15} w={45} h={8} fill={i%2?colors.sageSoft:colors.accentSoft} rx={4}/>
    </g>)}
    {[0,1,2].map(i=><Txt key={i} x={44+i*110} y={92} size={8} bold>{['Elemento','Detalle','Estado'][i]}</Txt>)}</g>}
   {kind==='calendar'&&<g>
     {['L','M','M','J','V','S','D'].map((s,i)=><Txt key={i} x={55+i*40} y={84} size={8} anchor="middle">{s}</Txt>)}
     {Array.from({length:28},(_,i)=><g key={i}><R x={37+(i%7)*40} y={91+Math.floor(i/7)*17} w={35} h={15} fill={i===(seed%27)?colors.accent:(i%7===6?colors.blueSoft:colors.bg)} rx={3}/><Txt x={49+(i%7)*40} y={102+Math.floor(i/7)*17} size={7} color={i===seed%27?'white':colors.text}>{i+1}</Txt></g>)}
   </g>}
   {kind==='kanban'&&['Pendiente','En curso','Hecho'].map((s,i)=><g key={i}><R x={36+i*95} y={77} w={88} h={82} fill={[colors.blueSoft,colors.accentSoft,colors.sageSoft][i]} rx={6}/><Txt x={43+i*95} y={90} size={8} bold>{s}</Txt>{[0,1,2].slice(0,(seed+i)%2+2).map((_,j)=><g key={j}><R x={42+i*95} y={99+j*17} w={75} h={14} fill="white" rx={4}/><L x={48+i*95} y={104+j*17} w={37+j*6} h={4} fill={accent}/></g>)}</g>)}
   {kind==='timeline'&&[0,1,2,3].map(i=><g key={i}>{i<3&&<R x={47} y={88+i*22} w={2} h={25} fill={colors.line}/>}<C x={48} y={90+i*22} r={5} fill={i===variation%4?accent:colors.blue}/><L x={66} y={87+i*22} w={185-i*23} h={6}/><L x={66} y={97+i*22} w={95+i*11} h={4} fill={colors.blueSoft}/></g>)}
   {kind==='map'&&<g>
     <R x={37} y={78} w={280} h={80} fill={colors.sageSoft}/>
     {[0,1,2,3].map(i=><path key={i} d={['M38 91 L316 130','M38 141 L316 96','M100 78 L180 158','M240 78 L179 159'][i]} fill="none" stroke="white" strokeWidth={8+i%2*3}/>)}
     <path d="M75 137 Q135 111 191 128 T276 93" fill="none" stroke={colors.accent} strokeWidth={3} strokeDasharray="6 4"/>
     {[0,1,2].map((i)=><g key={i}><C x={75+i*99} y={[136,128,94][i]} r={7} fill={i===variation%3?accent:colors.blue}/><C x={75+i*99} y={[136,128,94][i]} r={2} fill="white"/></g>)}
   </g>}
 </Panel>
 if(kind==='form'||kind==='choice'||kind==='slider'||kind==='upload'||kind==='auth')return <Panel>
   <Txt x={36} y={69} bold size={11}>{key(heading)}</Txt>
   {kind==='form'&&<g>
     {['Nombre','Correo'].map((s,i)=><g key={i}><Txt x={36} y={87+i*37} size={8}>{s}</Txt><R x={35} y={92+i*37} w={283} h={24} fill={colors.bg} rx={5} stroke={colors.line}/><L x={47} y={102+i*37} w={112+i*50} h={5}/></g>)}
     <Btn x={250} y={145} w={68} text="Guardar"/>
   </g>}
   {kind==='choice'&&<g>
     {['Opción A',feature||'Opción B','Opción C'].map((s,i)=><g key={i}>
       <R x={37} y={79+i*27} w={280} h={23} fill={i===variation%3?colors.accentSoft:colors.bg} rx={5}/>
       <C x={50} y={91+i*27} r={5} fill={i===variation%3?colors.accent:colors.frame}/><Txt x={66} y={95+i*27} size={9}>{s.slice(0,23)}</Txt>
       {i===variation%3&&<Txt x={290} y={95+i*27} size={11} color={colors.accent}>✓</Txt>}
       </g>)}
   </g>}
   {kind==='slider'&&<g>
     <Txt x={38} y={94} size={10}>Nivel</Txt><Txt x={315} y={94} size={10} anchor="end" bold>{value}%</Txt>
     <R x={39} y={113} w={269} h={6} fill={colors.line} rx={3}/>
     <R x={39} y={113} w={269*value/100} h={6} fill={accent} rx={3}/><C x={39+269*value/100} y={116} r={10} fill={colors.frame}/>
     <C x={39+269*value/100} y={116} r={7} fill={accent}/>
     <R x={39} y={142} w={113} h={14} fill={colors.blueSoft}/>
   </g>}
   {kind==='upload'&&<g><R x={37} y={79} w={277} h={76} fill={colors.blueSoft} rx={8} stroke={colors.blue}/>
     <path d="M173 105 v25 m-10-15 10-10 10 10" stroke={accent} strokeWidth={3} fill="none" strokeLinecap="round"/><Txt x={175} y={146} size={9} anchor="middle">Seleccionar archivo</Txt></g>}
   {kind==='auth'&&<g><R x={95} y={77} w={166} h={77} fill={colors.bg} rx={7}/>
     <Txt x={178} y={92} anchor="middle" size={9} bold>Verificar identidad</Txt>
     {[0,1,2,3].map(i=><R key={i} x={115+i*32} y={102} w={24} h={22} fill="white" stroke={i===variation%4?accent:colors.line}/>)}
     <Btn x={136} y={131} w={84} text="Continuar"/></g>}
 </Panel>
 if(kind==='product'||kind==='cart'||kind==='checkout'||kind==='pricing'||kind==='receipt'||kind==='offer')return <Panel>
   <Txt x={37} y={68} bold size={10}>{key(heading)}</Txt>
   {kind==='product'&&<g>
     <R x={37} y={77} w={115} h={81} fill={colors.sageSoft} rx={8}/><C x={96} y={108} r={22} fill={colors.sage}/><C x={93} y={102} r={10} fill={colors.blueSoft}/>
     <Txt x={169} y={89} bold size={11}>{key(feature)}</Txt><L x={170} y={99} w={133}/><L x={170} y={110} w={90}/>
     <Txt x={170} y={134} bold size={14}>S/ 49.00</Txt><Btn x={242} y={139} w={69} text="Añadir"/>
   </g>}
   {kind==='cart'&&<g>
     {[0,1].map(i=><g key={i}><R x={36} y={79+i*35} w={36} h={28} fill={i?colors.blueSoft:colors.sageSoft}/><L x={84} y={84+i*35} w={122} h={6}/><L x={84} y={95+i*35} w={68} h={4}/><Txt x={260} y={97+i*35} size={10} bold>{i?'× 2':'× 1'}</Txt></g>)}
     <L x={38} y={151} w={165}/><Txt x={315} y={158} size={12} anchor="end" bold>S/ 98</Txt>
   </g>}
   {kind==='checkout'&&<g>
     {[1,2,3].map((i)=><g key={i}><C x={65+(i-1)*103} y={91} r={13} fill={i<=variation%3+1?accent:colors.line}/><Txt x={65+(i-1)*103} y={95} size={10} color="white" anchor="middle">{i}</Txt></g>)}
     <Txt x={47} y={118} size={8}>Carrito</Txt><Txt x={151} y={118} size={8}>Entrega</Txt><Txt x={252} y={118} size={8}>Confirmar</Txt>
     <R x={39} y={134} w={189} h={20} fill={colors.bg}/><Btn x={238} y={134} w={81} text="Continuar"/>
   </g>}
   {kind==='pricing'&&[0,1,2].map(i=><g key={i}>
     <R x={36+i*97} y={79} w={90} h={78} fill={i===variation%3?colors.accentSoft:colors.blueSoft} rx={7}/>
     <Txt x={44+i*97} y={94} size={8} bold>{['Inicial','Pro','Equipo'][i]}</Txt>
     <Txt x={44+i*97} y={115} size={14} bold>S/ {9+i*15}</Txt>
     {[0,1].map(j=><L key={j} x={44+i*97} y={129+j*11} w={61-j*13} h={4}/>)}
   </g>)}
   {kind==='receipt'&&<g><R x={106} y={76} w={153} h={87} fill={colors.bg}/><Txt x={182} y={91} anchor="middle" bold size={10}>Resumen</Txt>
     {[0,1,2].map(i=><g key={i}><L x={118} y={102+i*14} w={67+i*7} h={5}/><Txt x={245} y={107+i*14} anchor="end" size={8}>S/ {i*12+9}</Txt></g>)}
     <L x={115} y={148} w={132} h={1}/><Txt x={245} y={158} anchor="end" bold size={9}>Total S/ 59</Txt></g>}
   {kind==='offer'&&<g><R x={41} y={79} w={274} h={76} fill={colors.accentSoft}/><C x={92} y={114} r={25} fill={accent}/><Txt x={92} y={119} size={13} color="white" anchor="middle" bold>-20%</Txt><Txt x={147} y={99} size={12} bold>{key(feature)}</Txt><L x={148} y={110} w={137}/><Btn x={149} y={123} w={102} text="Descubrir"/></g>}
 </Panel>
 if(kind==='alert'||kind==='progress'||kind==='status'||kind==='empty')return <Panel>
   <Txt x={35} y={68} bold size={11}>{key(heading)}</Txt>
   {kind==='alert'&&<g>
     <R x={37} y={79} w={279} h={55} fill={variation%2?colors.goldSoft:colors.sageSoft}/>
     <C x={57} y={100} r={11} fill={variation%2?colors.gold:colors.sage}/>
     <Txt x={57} y={104} anchor="middle" size={13} color="white" bold>!</Txt>
     <Txt x={77} y={97} size={11} bold>{variation%2?'Atención':'Acción completada'}</Txt>
     <Txt x={77} y={115} size={8}>{supporting.slice(0,43)}</Txt>
     <Btn x={239} y={140} w={77} text="Entendido"/>
   </g>}
   {kind==='progress'&&<g><Txt x={40} y={95} size={11}>Progreso de {feature}</Txt>
     <Txt x={312} y={96} size={11} anchor="end" bold>{value}%</Txt>
     <R x={40} y={110} w={271} h={13} fill={colors.blueSoft} rx={7}/>
     <R x={40} y={110} w={271*value/100} h={13} fill={accent} rx={7}/>
     <L x={40} y={138} w={114}/><L x={40} y={149} w={177} h={4}/></g>}
   {kind==='status'&&<g><C x={176} y={107} r={27} fill={colors.sageSoft}/>
     <Txt x={176} y={117} anchor="middle" size={28} color={colors.sage}>✓</Txt>
     <Txt x={176} y={152} size={11} bold anchor="middle">{feature||'Completado'}</Txt></g>}
   {kind==='empty'&&<g><R x={132} y={77} w={91} h={57} fill={colors.blueSoft}/><C x={175} y={101} r={15} fill={colors.accentSoft}/>
     <Txt x={175} y={113} size={20} anchor="middle">⌕</Txt><Txt x={178} y={148} size={9} anchor="middle">No hay resultados</Txt></g>}
 </Panel>
 if(kind==='canvas'||kind==='gesture'||kind==='motion')return <Panel>
   <Txt x={35} y={69} bold size={11}>{key(heading)}</Txt>
   {kind==='canvas'&&<g>
     {[0,1,2,3].map(i=><g key={i}><R x={44+(i%2)*150} y={80+Math.floor(i/2)*48} w={100} h={33} fill={[colors.blueSoft,colors.accentSoft,colors.sageSoft,colors.goldSoft][i]}/><C x={56+(i%2)*150} y={91+Math.floor(i/2)*48} r={4} fill={accent}/><L x={66+(i%2)*150} y={88+Math.floor(i/2)*48} w={53} h={5} fill={colors.frame}/></g>)}
     <path d="M144 97 L194 97 M94 113 L94 128 M244 113 L244 128" stroke={accent} strokeWidth={2} strokeDasharray="4 3" fill="none"/>
   </g>}
   {kind==='gesture'&&<g>
     <R x={103} y={79} w={146} h={78} fill={colors.blueSoft} rx={12}/>
     <R x={129+(variation-2)*9} y={87} w={94} h={64} fill={colors.frame} rx={8}/>
     <L x={146+(variation-2)*9} y={101} w={60} fill={accent}/>
     <L x={146+(variation-2)*9} y={116} w={50}/>
     <Txt x={175} y={145} anchor="middle" size={9}>⇆ Deslizar</Txt>
   </g>}
   {kind==='motion'&&<g>
     {[0,1,2,3].map(i=><g key={i}><R x={39+i*71} y={88+Math.abs((variation+i)%3-1)*10} w={53} h={49} fill={[colors.blueSoft,colors.accentSoft,colors.sageSoft,colors.goldSoft][i]} rx={9}/><C x={65+i*71} y={112+Math.abs((variation+i)%3-1)*10} r={11} fill={i===variation%4?accent:colors.blue}/></g>)}
     <path d="M46 151 Q175 135 299 151" fill="none" stroke={accent} strokeWidth={2} strokeDasharray="6 5"/>
   </g>}
 </Panel>
 return <Panel>
   <Txt x={36} y={70} bold size={11}>{key(heading)}</Txt>
   {kind==='article'&&<g>
     <R x={36} y={80} w={58} h={76} fill={colors.blueSoft}/>
     <L x={105} y={83} w={196} h={7} fill={accent}/>
     {[0,1,2,3,4].map(i=><L key={i} x={105} y={100+i*12} w={190-(i%3)*29} h={5}/>)}
   </g>}
   {kind==='editor'&&<g><R x={35} y={80} w={284} h={77} fill={colors.bg}/>
     <R x={36} y={81} w={282} h={17} fill={colors.blueSoft}/>
     <Txt x={44} y={93} size={10}>B  I  U   ·   ⌘  ⋮</Txt>
     {[0,1,2,3].map(i=><g key={i}><Txt x={42} y={110+i*13} size={8} color={colors.muted}>{i+1}</Txt><L x={57} y={105+i*13} w={190-i*19} h={5} fill={i%2?colors.sage:colors.accent}/></g>)}
   </g>}
   {kind==='media'&&<g><R x={38} y={79} w={279} h={70} fill={colors.blueSoft}/>
     <C x={175} y={114} r={22} fill={colors.frame}/>
     <path d="M169 102 L169 126 L188 114 Z" fill={accent}/>
     <R x={39} y={155} w={278} h={5} fill={colors.line}/>
     <R x={39} y={155} w={100+variation*28} h={5} fill={accent}/>
   </g>}
   {kind==='chat'&&<g>
     <R x={38} y={81} w={195} h={24} fill={colors.blueSoft}/>
     <Txt x={48} y={96} size={8}>¿Cómo puedo ayudarte?</Txt>
     <R x={125} y={110} w={192} h={24} fill={colors.accentSoft}/>
     <Txt x={135} y={125} size={8}>Una idea para {feature}.</Txt>
     <R x={38} y={140} w={279} h={21} fill={colors.bg}/>
     <Txt x={49} y={154} size={8}>Escribe un mensaje...</Txt><C x={299} y={150} r={7} fill={accent}/>
   </g>}
   {kind==='quiz'&&<g>
     <Txt x={38} y={86} size={10} bold>Selecciona la respuesta</Txt>
     {['Opción A','Opción B','Opción C'].map((s,i)=><g key={i}><R x={38} y={95+i*21} w={277} h={18} fill={i===variation%3?colors.accentSoft:colors.bg}/><C x={51} y={104+i*21} r={4} fill={i===variation%3?accent:colors.frame}/><Txt x={66} y={108+i*21} size={8}>{s}</Txt></g>)}
   </g>}
 </Panel>
}

export default function PatternVisual({item,large=false}:{
  item:ComponentInfo;large?:boolean
}){
  const scene=createPatternScene(item)
  return <div className={'pattern-visual'+(large?' pattern-visual--large':'')} data-pattern={scene.id} data-scene={scene.kind}>
    <svg viewBox="0 0 360 188" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={'Maqueta ilustrativa de '+item.name} preserveAspectRatio="xMidYMid meet">
      <title>{'Maqueta individual: '+item.name}</title>
      <R x={0} y={0} w={360} h={188} fill={colors.bg} rx={12}/>
      <R x={9} y={8} w={342} h={173} fill={colors.frame} rx={12} stroke={colors.line}/>
      <R x={9} y={8} w={342} h={34} fill="#F7F9FA" rx={12}/>
      <R x={9} y={30} w={342} h={13} fill="#F7F9FA" rx={0}/>
      <C x={26} y={25} r={4} fill={colors.rose}/>
      <C x={39} y={25} r={4} fill={colors.gold}/>
      <C x={52} y={25} r={4} fill={colors.sage}/>
      <Txt x={65} y={29} size={10} bold>{scene.heading}</Txt>
      <Txt x={337} y={29} size={8} color={colors.muted} anchor="end">{String((scene.seed%97)+1).padStart(2,'0')}</Txt>
      <SceneBody kind={scene.kind} variation={scene.variation} seed={scene.seed} feature={scene.feature} heading={scene.heading} supporting={scene.supporting}/>
      <R x={155} y={173} w={50} h={3} fill={colors.line} rx={2}/>
    </svg>
  </div>
}
