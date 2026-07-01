// @ts-nocheck
import { useState, useEffect } from "react";

const STORAGE_KEY = "qm_v15";
const ADMIN_PIN = "hch2024";
const SESSION_KEY = "qm_role";

// ── AUTH ───────────────────────────────────────────────────────────────────
function useAuth() {
  const [role, setRole] = useState(() => { try { return sessionStorage.getItem(SESSION_KEY)||"none"; } catch { return "none"; } });
  const login = (pin) => { if(pin===ADMIN_PIN){ sessionStorage.setItem(SESSION_KEY,"admin"); setRole("admin"); return true; } return false; };
  const loginUser = () => { sessionStorage.setItem(SESSION_KEY,"user"); setRole("user"); };
  const logout = () => { sessionStorage.removeItem(SESSION_KEY); setRole("none"); };
  return { role, isAdmin:role==="admin", isLoggedIn:role!=="none", login, loginUser, logout };
}

// ── THEME ──────────────────────────────────────────────────────────────────
const DARK_THEME = `
  :root{--bg:#0f0f1e;--bg2:#1a1a2e;--bg3:#252538;--bg4:#2e2e48;--text:#f0eefc;--text2:#9896b0;--text3:#6a6880;--teal:#2BBFBF;--orange:#F5A623;--purple:#7B4FA6;--blue:#2E86AB;--red:#e05555;--green:#2bbf8c;--border:rgba(43,191,191,0.15);--border2:rgba(43,191,191,0.25);}
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,sans-serif;min-height:100vh;}
  input,select,textarea{background:var(--bg3)!important;color:var(--text)!important;border:0.5px solid var(--border)!important;border-radius:8px;padding:7px 11px;font-family:inherit;font-size:13px;width:100%;outline:none;transition:border-color 0.15s;}
  input:focus,select:focus,textarea:focus{border-color:var(--teal)!important;box-shadow:0 0 0 2px rgba(43,191,191,0.12)!important;}
  input::placeholder,textarea::placeholder{color:var(--text3)!important;}
  select option{background:var(--bg3);color:var(--text);}
  button{background:var(--bg3);color:var(--text2);border:0.5px solid var(--border);border-radius:8px;padding:7px 14px;cursor:pointer;font-family:inherit;font-size:13px;transition:all 0.15s;}
  button:hover{border-color:var(--teal);color:var(--teal);}
  ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:var(--bg);}::-webkit-scrollbar-thumb{background:var(--teal);border-radius:3px;}
  a{color:var(--blue);text-decoration:none;}a:hover{text-decoration:underline;}
`;

function InjectTheme() {
  useEffect(() => {
    let el = document.getElementById("qm-theme");
    if(!el){el=document.createElement("style");el.id="qm-theme";document.head.appendChild(el);}
    el.textContent = DARK_THEME;
    return ()=>{const e=document.getElementById("qm-theme");if(e)e.remove();};
  },[]);
  return null;
}

// ── CONSTANTS ──────────────────────────────────────────────────────────────
const CM = {teal:"var(--teal)",blue:"var(--blue)",orange:"var(--orange)",purple:"#c49fe8",green:"var(--green)",red:"var(--red)",gray:"var(--text3)"};
const BM = {teal:"rgba(43,191,191,0.12)",blue:"rgba(46,134,171,0.12)",orange:"rgba(245,166,35,0.12)",purple:"rgba(123,79,166,0.15)",green:"rgba(43,191,140,0.12)",red:"rgba(224,85,85,0.12)",gray:"rgba(255,255,255,0.05)"};

const KPI_ROWS = ["Forecast","Incoming Volume","Erreichbarkeit","Servicelevel","FCR","CSAT","ASAT","Bewertungsrate","AHT Telefonie","Callcoding"];
const KPI_UMSATZ = ["Warenkorb Ziel","Warenkorb IST","Ø Warenkorb Ziel","Ø Warenkorb IST","CR Ziel","CR IST"];
const MONTHS = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];

const DEFAULT_TYPES = {
  call:{key:"call",label:"Call",icon:"ti-phone-call",color:"teal",criteria:[{key:"greeting",label:"Begrüßung / Name"},{key:"hotline",label:"Korrekter Hotline-Name"},{key:"customer_name",label:"Namentliche Ansprache KD"},{key:"politeness",label:"Höflichkeit (Bitte/Danke)"},{key:"empathy",label:"Empathie"},{key:"goodbye",label:"Verabschiedung"},{key:"privacy",label:"Datenschutz eingehalten"},{key:"process",label:"Prozesseinhaltung"},{key:"service_q",label:"Servicefragen gestellt"},{key:"sales",label:"Verkauf / KVH angesprochen"}]},
  ticket:{key:"ticket",label:"Ticket",icon:"ti-ticket",color:"purple",criteria:[{key:"categorization",label:"Rekategorisierung korrekt"},{key:"wording",label:"Wording / Rechtschreibung"},{key:"process",label:"Prozesseinhaltung"},{key:"contact_entry",label:"Kontakteintrag vorhanden"},{key:"aht",label:"Ticket-AHT < 6 Min"}]},
  mail:{key:"mail",label:"Mail",icon:"ti-mail",color:"blue",criteria:[{key:"subject",label:"Betreff korrekt"},{key:"salutation",label:"Anrede korrekt"},{key:"wording",label:"Wording / Rechtschreibung"},{key:"content",label:"Inhalt vollständig"},{key:"process",label:"Prozesseinhaltung"},{key:"signature",label:"Signatur vorhanden"}]},
  chat:{key:"chat",label:"Chat",icon:"ti-message",color:"orange",criteria:[{key:"greeting",label:"Begrüßung"},{key:"response_time",label:"Antwortzeit ok"},{key:"wording",label:"Wording / Rechtschreibung"},{key:"process",label:"Prozesseinhaltung"},{key:"empathy",label:"Empathie / Ton"},{key:"goodbye",label:"Verabschiedung"}]},
};

const GOALS = ["Bewertungsrate auf mind. 35 % steigern","AHT Call unter Ziel-AHT senken","Servicefragen in ≥ 80 % der Calls ansprechen","Ticket-AHT unter 6 Min bringen","Datenschutzprotokoll lückenlos einhalten","Fehlbearbeitungsrate auf 0 % in Folgewoche","FCR auf mind. 90 % steigern","Verkauf / KVH in mind. 30 % der qualifizierten Calls anbieten","Wording & Rechtschreibung verbessern","Empathie & Gesprächsführung stärken","Prozesseinhaltung auf 100 % steigern"];

const TOPIC_COLORS = {AHT:"orange",Fehlbearbeitung:"red",Callbesprechung:"blue",Callauswertung:"blue",Ticketbearbeitung:"teal",Wording:"purple",Schulung:"green","Silent Monitoring":"orange","Side-by-Side":"orange",Speedtalk:"gray",KVH:"teal",Datenschutz:"red"};

const DEF_SB = {kampagnenId:"",stand:"",projekttyp:"",servicezeiten:"",abrechnung:"",hintergrund:"",teamGroesse:"",fte:"",hardware:"",apIntern:"",apExtern:"",kpis:"",forecast:"",stoszeiten:"",blending:"",kommunikation:"",risiken:"",chancen:"",schritte:"",notizen:"",links:[],kpiData:{},kpiUmsatzData:{},kpiZiele:{}};

const DEF_HANDBOOK = [
  {id:1,phase:"1 · Vorbereitung",icon:"ti-clipboard-list",color:"teal",steps:["Monitoringplan für die Woche erstellen (Prio 1 & 2 MA)","Dialfire / Freshdesk öffnen – Calls & Tickets vorauswählen","KPI-Daten des MA aus der Performanceliste ziehen (AHT, FCR, CSAT)","Letzte Coaching-Notiz lesen – offene Zielvereinbarungen?","Calls / Tickets / Mails pro MA vorbereiten"]},
  {id:2,phase:"2 · Auswertung",icon:"ti-search",color:"blue",steps:["Calls abhören / Tickets lesen / Mails prüfen","Bewertungsformular ausfüllen, alle Kriterien","IDs dokumentieren – Verlinkung in Dokumentation","Auffälligkeiten markieren: Fehlbearbeitung, Datenschutz, Positives","Bei < 75 % → Coaching-Trigger markieren"]},
  {id:3,phase:"3 · Feedback & Coaching",icon:"ti-messages",color:"orange",steps:["Gesprächstermin vereinbaren (15–30 Min)","Positives zuerst – mind. 1 starkes Beispiel","Konkrete Fehlbearbeitung mit ID zeigen","Wording-Hilfe & Prozesserklärung","SMART-Zielvereinbarung dokumentieren"]},
  {id:4,phase:"4 · Dokumentation",icon:"ti-writing",color:"green",steps:["Coaching-Dokumentation ausfüllen","Ziel messbar und terminiert formulieren","Fehlbearbeitungen mit Link hinterlegen","Monitoring-Ergebnis eintragen","Eskalation an TL wenn nach 2 Coachings keine Verbesserung"]},
];

const DEF_TRIGGERS = [
  {id:1,label:"Bewertung < 75 %",color:"red",action:"Coaching-Pflicht"},
  {id:2,label:"Fehlbearbeitung (jede)",color:"red",action:"Speedtalk innerhalb 24 h"},
  {id:3,label:"Datenschutzverstoß",color:"red",action:"Sofortmaßnahme + TL"},
  {id:4,label:"Keine Verbesserung nach 2 Coachings",color:"orange",action:"Eskalation TL"},
  {id:5,label:"Bewertungsrate < 25 %",color:"orange",action:"Intensivbegleitung"},
  {id:6,label:"AHT > 150 % Ziel",color:"orange",action:"Side-by-Side + Silent"},
];

const DEF_PROJECTS = [
  {id:1,name:"JSMD",qms:["Betül","Christian"],topics:["AHT","Fehlbearbeitung","Callbesprechung","Ticketbearbeitung","Wording","Bewertungsrate","Prozess","Speedtalk","Silent Monitoring","Side-by-Side","Schulung"],monTypes:{call:{active:true,extra:[]},ticket:{active:true,extra:[]},mail:{active:false,extra:[]},chat:{active:false,extra:[]}},steckbrief:{...DEF_SB,projekttyp:"Inbound + Ticket",servicezeiten:"Mo-Fr 08:00-18:00",kpis:"AHT, Bewertungsrate, FCR"}},
  {id:2,name:"Shop24",qms:["Betül","Nadine"],topics:["Callauswertung","Fehlbearbeitung","Wording","Bestellaufnahme","Speedtalk"],monTypes:{call:{active:true,extra:[{key:"order",label:"Bestellaufnahme korrekt"}]},ticket:{active:false,extra:[]},mail:{active:true,extra:[]},chat:{active:false,extra:[]}},steckbrief:{...DEF_SB,projekttyp:"Inbound + Mail"}},
  {id:3,name:"Fairafric",qms:["Betül"],topics:["Ticketbearbeitung","Schulung","Side-by-Side","Speedtalk"],monTypes:{call:{active:false,extra:[]},ticket:{active:true,extra:[{key:"product",label:"Produktkenntnisse korrekt"}]},mail:{active:true,extra:[]},chat:{active:false,extra:[]}},steckbrief:{...DEF_SB,projekttyp:"Ticket + Mail"}},
  {id:4,name:"Blending",qms:["Betül","Christian","Nadine"],topics:["KVH","Datenschutz","AHT/NBZ","Einwandbehandlung","Begrüßung"],monTypes:{call:{active:true,extra:[{key:"kvh",label:"KVH angesprochen"},{key:"objection",label:"Einwandbehandlung"}]},ticket:{active:false,extra:[]},mail:{active:false,extra:[]},chat:{active:false,extra:[]}},steckbrief:{...DEF_SB,projekttyp:"Inbound Call"}},
];

const DEF_STATE = {projects:DEF_PROJECTS,activeProjectId:1,monitorings:{},coachings:{},handbook:DEF_HANDBOOK,triggers:DEF_TRIGGERS};

function loadState() { try{const r=localStorage.getItem(STORAGE_KEY);if(r)return{...DEF_STATE,...JSON.parse(r)};}catch(e){} return DEF_STATE; }
function saveState(s) { try{localStorage.setItem(STORAGE_KEY,JSON.stringify(s));}catch(e){} }
function dlCSV(filename,rows) { const esc=v=>`"${String(v??"").replace(/"/g,'""')}"`;const blob=new Blob(["\uFEFF"+rows.map(r=>r.map(esc).join(";")).join("\n")],{type:"text/csv;charset=utf-8;"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;a.click(); }

// ── UI ATOMS ───────────────────────────────────────────────────────────────
function Badge({color,children,sm}){const bg=BM[color]||BM.gray,text=CM[color]||"var(--text3)";return <span style={{background:bg,color:text,fontSize:sm?11:12,fontWeight:500,padding:sm?"2px 7px":"3px 10px",borderRadius:6,whiteSpace:"nowrap",display:"inline-block"}}>{children}</span>;}
function Card({children,style}){return <div style={{background:"var(--bg2)",border:"0.5px solid var(--border)",borderRadius:10,padding:"14px 16px",...style}}>{children}</div>;}
function Stat({value,label,icon,color,sub}){return <Card style={{display:"flex",flexDirection:"column",gap:4}}><div style={{display:"flex",justifyContent:"space-between"}}><i className={`ti ${icon}`} style={{fontSize:18,color}}/>{sub&&<span style={{fontSize:11,color:"var(--text3)"}}>{sub}</span>}</div><p style={{fontSize:26,fontWeight:600,color,margin:0,lineHeight:1}}>{value}</p><p style={{fontSize:12,color:"var(--text2)",margin:0}}>{label}</p></Card>;}
function MiniBar({data,color}){const max=Math.max(...data.map(d=>d.value),1);return <div style={{display:"flex",flexDirection:"column",gap:6}}>{data.map((d,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:12,color:"var(--text2)",width:140,flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.label}</span><div style={{flex:1,background:"var(--bg3)",borderRadius:4,height:14,overflow:"hidden"}}><div style={{width:`${(d.value/max)*100}%`,height:"100%",background:color||"var(--teal)",borderRadius:4,minWidth:d.value>0?4:0}}/></div><span style={{fontSize:12,color:"var(--text)",width:22,textAlign:"right"}}>{d.value}</span></div>)}</div>;}

function Tabs({tabs,active,onChange}){return <div style={{display:"flex",gap:2,borderBottom:"0.5px solid var(--border)",marginBottom:20,overflowX:"auto"}}>{tabs.map(t=><button key={t.key} onClick={()=>onChange(t.key)} style={{background:"none",border:"none",borderBottom:active===t.key?"2px solid var(--teal)":"2px solid transparent",borderRadius:0,color:active===t.key?"var(--teal)":"var(--text2)",fontWeight:active===t.key?500:400,padding:"8px 14px",marginBottom:-1,whiteSpace:"nowrap"}}>{t.label}</button>)}</div>;}

function ScoreBtn({scores,setScores,k,opt}){const active=scores[k]===opt;return <button onClick={()=>setScores({...scores,[k]:opt})} style={{padding:"2px 9px",fontSize:12,background:active?(opt==="ja"?"rgba(43,191,140,0.2)":opt==="nein"?"rgba(224,85,85,0.2)":"var(--bg4)"):"var(--bg3)",color:active?(opt==="ja"?"var(--green)":opt==="nein"?"var(--red)":"var(--text2)"):"var(--text3)",borderColor:active?"transparent":"var(--border)"}}>{opt}</button>;}

// ── LOGIN ──────────────────────────────────────────────────────────────────
function LoginScreen({onLogin,onUser}){
  const [pin,setPin]=useState("");const [err,setErr]=useState(false);const [show,setShow]=useState(false);
  const try_=()=>{if(onLogin(pin)){setErr(false);}else{setErr(true);setPin("");setTimeout(()=>setErr(false),2000);}};
  return <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div style={{width:"100%",maxWidth:380,background:"var(--bg2)",border:"0.5px solid var(--border)",borderRadius:16,padding:32}}>
      <div style={{textAlign:"center",marginBottom:28}}><div style={{width:52,height:52,borderRadius:14,background:"rgba(43,191,191,0.12)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><i className="ti ti-shield-check" style={{fontSize:26,color:"var(--teal)"}}/></div><p style={{fontSize:20,fontWeight:600,color:"var(--teal)",margin:"0 0 4px"}}>QM-Arbeitsmappe</p><p style={{fontSize:13,color:"var(--text3)",margin:0}}>Hey Contact Heroes · Qualitätsmanagement</p></div>
      <div style={{marginBottom:14}}><label style={{fontSize:12,color:"var(--text3)",display:"block",marginBottom:6}}>Admin-PIN</label><div style={{position:"relative"}}><input type={show?"text":"password"} value={pin} onChange={e=>setPin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&try_()} placeholder="PIN eingeben..." autoFocus/><button onClick={()=>setShow(!show)} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"var(--text3)",padding:4}}><i className={`ti ${show?"ti-eye-off":"ti-eye"}`} style={{fontSize:14}}/></button></div>{err&&<p style={{fontSize:12,color:"var(--red)",margin:"6px 0 0"}}>Falscher PIN</p>}</div>
      <button onClick={try_} style={{width:"100%",background:"rgba(43,191,191,0.15)",borderColor:"var(--teal)",color:"var(--teal)",padding:"10px",fontSize:14,fontWeight:500,marginBottom:10}}><i className="ti ti-login" style={{marginRight:6}}/>Als Admin anmelden</button>
      <div style={{display:"flex",alignItems:"center",gap:10,margin:"14px 0"}}><div style={{flex:1,height:"0.5px",background:"var(--border)"}}/><span style={{fontSize:12,color:"var(--text3)"}}>oder</span><div style={{flex:1,height:"0.5px",background:"var(--border)"}}/></div>
      <button onClick={onUser} style={{width:"100%",padding:"10px",fontSize:14,color:"var(--text2)"}}><i className="ti ti-user" style={{marginRight:6}}/>Als QM / Teamleiter öffnen</button>
      <div style={{marginTop:18,padding:"10px 12px",background:"var(--bg3)",borderRadius:8,border:"0.5px solid var(--border)"}}><p style={{fontSize:11,color:"var(--text3)",margin:0,lineHeight:1.5}}><i className="ti ti-info-circle" style={{marginRight:4,color:"var(--blue)"}}/><strong style={{color:"var(--text2)"}}>Admin:</strong> Vollzugriff – Projekte, Handbuch, Steckbrief, KPIs.<br/><strong style={{color:"var(--text2)"}}>QM / Teamleiter:</strong> Monitorings & Coachings einpflegen.</p></div>
    </div>
  </div>;
}

// ── HANDBOOK ───────────────────────────────────────────────────────────────
function HandbookSection({handbook,setHandbook,triggers,setTriggers,isAdmin}){
  const [open,setOpen]=useState(null);
  const [editMode,setEditMode]=useState(false);
  const [newStep,setNewStep]=useState("");
  const [newPhase,setNewPhase]=useState("");
  const COLORS=["teal","blue","purple","orange","green","red","gray"];
  const ICONS=["ti-clipboard-list","ti-phone-call","ti-ticket","ti-messages","ti-writing","ti-target","ti-star","ti-search","ti-users","ti-chart-bar"];
  const upd=(id,p)=>setHandbook(handbook.map(h=>h.id===id?{...h,...p}:h));
  const addStep=(id)=>{if(!newStep.trim())return;const h=handbook.find(x=>x.id===id);if(h)upd(id,{steps:[...h.steps,newStep.trim()]});setNewStep("");};
  const rmStep=(id,i)=>{const h=handbook.find(x=>x.id===id);if(h)upd(id,{steps:h.steps.filter((_,j)=>j!==i)});};
  const edStep=(id,i,v)=>{const h=handbook.find(x=>x.id===id);if(h){const s=[...h.steps];s[i]=v;upd(id,{steps:s});}};

  return <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <p style={{fontSize:14,color:"var(--text2)"}}>QM-Ablaufplan</p>
      {isAdmin&&<button onClick={()=>setEditMode(!editMode)} style={{background:editMode?"rgba(43,191,191,0.15)":"var(--bg3)",borderColor:editMode?"var(--teal)":"var(--border)",color:editMode?"var(--teal)":"var(--text2)",display:"flex",alignItems:"center",gap:6}}><i className={`ti ${editMode?"ti-check":"ti-edit"}`}/>{editMode?"Fertig":"Bearbeiten"}</button>}
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {handbook.map((s,i)=>{
        const isOpen=open===i;
        return <div key={s.id} style={{border:`0.5px solid ${isOpen?CM[s.color]||"var(--teal)":"var(--border)"}`,borderRadius:10,overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"center",background:isOpen?BM[s.color]||"var(--bg3)":"var(--bg2)"}}>
            <button onClick={()=>setOpen(isOpen?null:i)} style={{flex:1,background:"none",border:"none",borderRadius:0,display:"flex",alignItems:"center",gap:10,padding:"11px 14px",color:"var(--text)",justifyContent:"flex-start"}}>
              <span style={{width:28,height:28,borderRadius:7,background:BM[s.color]||"var(--bg3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><i className={`ti ${s.icon}`} style={{fontSize:14,color:CM[s.color]||"var(--teal)"}}/></span>
              {(editMode&&isAdmin)?<input value={s.phase} onChange={e=>upd(s.id,{phase:e.target.value})} onClick={ev=>ev.stopPropagation()} style={{flex:1,fontWeight:500}}/>:<span style={{flex:1,fontSize:14,fontWeight:500}}>{s.phase}</span>}
              <i className={`ti ti-chevron-${isOpen?"up":"down"}`} style={{fontSize:13,color:"var(--text3)"}}/>
            </button>
            {(editMode&&isAdmin)&&<div style={{display:"flex",gap:4,paddingRight:10}}>
              <select value={s.color} onChange={e=>upd(s.id,{color:e.target.value})} style={{width:75,fontSize:11,padding:"3px 6px"}}>{COLORS.map(c=><option key={c} value={c}>{c}</option>)}</select>
              <select value={s.icon} onChange={e=>upd(s.id,{icon:e.target.value})} style={{width:90,fontSize:11,padding:"3px 6px"}}>{ICONS.map(ic=><option key={ic} value={ic}>{ic.replace("ti-","")}</option>)}</select>
              <button onClick={()=>setHandbook(handbook.filter(h=>h.id!==s.id))} style={{color:"var(--red)",padding:"3px 8px",fontSize:12}}><i className="ti ti-trash" style={{fontSize:11}}/></button>
            </div>}
          </div>
          {isOpen&&<div style={{padding:"10px 14px 14px 52px",background:"var(--bg2)"}}>
            <ol style={{paddingLeft:18,display:"flex",flexDirection:"column",gap:7}}>
              {s.steps.map((step,j)=><li key={j} style={{fontSize:13,color:"var(--text2)",lineHeight:1.6}}>
                {(editMode&&isAdmin)?<div style={{display:"flex",alignItems:"center",gap:6}}><input value={step} onChange={e=>edStep(s.id,j,e.target.value)} style={{flex:1}}/><button onClick={()=>rmStep(s.id,j)} style={{background:"none",border:"none",color:"var(--red)",padding:"2px 6px",flexShrink:0}}><i className="ti ti-x" style={{fontSize:11}}/></button></div>:step}
              </li>)}
            </ol>
            {(editMode&&isAdmin)&&<div style={{display:"flex",gap:8,marginTop:8}}><input value={newStep} onChange={e=>setNewStep(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){addStep(s.id);}}}/><button onClick={()=>addStep(s.id)}>+ Schritt</button></div>}
          </div>}
        </div>;
      })}
    </div>
    {(editMode&&isAdmin)&&<div style={{display:"flex",gap:8,marginTop:10}}><input value={newPhase} onChange={e=>setNewPhase(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newPhase.trim()){setHandbook([...handbook,{id:Date.now(),phase:newPhase.trim(),icon:"ti-star",color:"teal",steps:[]}]);setNewPhase("");}}} placeholder="Neue Phase..."/><button onClick={()=>{if(newPhase.trim()){setHandbook([...handbook,{id:Date.now(),phase:newPhase.trim(),icon:"ti-star",color:"teal",steps:[]}]);setNewPhase("");}}>+ Phase</button></div>}

    <div style={{marginTop:18,padding:"14px 16px",background:"var(--bg3)",borderRadius:10,border:"0.5px solid var(--border)"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <p style={{fontSize:13,fontWeight:500,color:"var(--orange)",margin:0}}>Trigger-Schwellenwerte</p>
        {isAdmin&&<button onClick={()=>setTriggers([...triggers,{id:Date.now(),label:"Neuer Trigger",color:"orange",action:"Maßnahme"}])} style={{fontSize:11,padding:"3px 10px",color:"var(--orange)",borderColor:"rgba(245,166,35,0.3)"}}>+ Trigger</button>}
      </div>
      {isAdmin&&<div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:10}}>
        {triggers.map((t,i)=><div key={t.id} style={{display:"flex",alignItems:"center",gap:8}}>
          <input value={t.label} onChange={e=>{const tr=[...triggers];tr[i]={...tr[i],label:e.target.value};setTriggers(tr);}} style={{width:180,fontSize:12,padding:"3px 8px"}}/>
          <select value={t.color} onChange={e=>{const tr=[...triggers];tr[i]={...tr[i],color:e.target.value};setTriggers(tr);}} style={{width:80,fontSize:11,padding:"3px 6px"}}>{["red","orange","teal","blue","purple","green","gray"].map(c=><option key={c} value={c}>{c}</option>)}</select>
          <span style={{fontSize:12,color:"var(--text3)"}}>→</span>
          <input value={t.action} onChange={e=>{const tr=[...triggers];tr[i]={...tr[i],action:e.target.value};setTriggers(tr);}} style={{flex:1,fontSize:12,padding:"3px 8px"}}/>
          <button onClick={()=>setTriggers(triggers.filter(x=>x.id!==t.id))} style={{background:"none",border:"none",color:"var(--red)",padding:"2px 6px"}}><i className="ti ti-x" style={{fontSize:12}}/></button>
        </div>)}
      </div>}
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {triggers.map(t=><div key={t.id} style={{display:"flex",alignItems:"center",gap:6}}><Badge color={t.color} sm>{t.label}</Badge><span style={{fontSize:11,color:"var(--text3)"}}>{t.action}</span></div>)}
      </div>
    </div>
  </div>;
}

// ── MONITORING ─────────────────────────────────────────────────────────────
}
function MonitoringSection({saved,setSaved,projects}){
  const [agentName,setAgentName]=useState("");
  const [qm,setQm]=useState("");
  const [pid,setPid]=useState(projects[0]?.id||"");
  const [date,setDate]=useState(new Date().toISOString().split("T")[0]);
  const [scores,setScores]=useState({});
  const [ids,setIds]=useState({});
  const [notes,setNotes]=useState("");

  useEffect(()=>{if(projects.length>0&&!pid)setPid(projects[0].id);},[projects]);

  const sel=projects.find(p=>p.id==pid)||projects[0];
  const activeTypes=Object.entries(sel?.monTypes||{}).filter(([,c])=>c.active).map(([k])=>k);

  const getCriteria=(tk)=>{const tc=sel?.monTypes?.[tk];return[...(tc?.customBase||DEFAULT_TYPES[tk]?.criteria||[]),...(tc?.extra||[])];};
  const calcPct=(tk)=>{const cr=getCriteria(tk);const sc=scores[tk]||{};const vals=cr.map(c=>sc[c.key]).filter(v=>v&&v!=="/");return vals.length>0?Math.round(vals.filter(v=>v==="ja").length/vals.length*100):null;};

  const ready=agentName&&qm&&activeTypes.length>0;
  const missing=[];if(!agentName)missing.push("Agent/in");if(!qm)missing.push("QM / TL");

  const save=()=>{
    if(!ready)return;
    const typePcts={};activeTypes.forEach(t=>{typePcts[t]=calcPct(t);});
    const vals=Object.values(typePcts).filter(v=>v!==null);
    const overall=vals.length>0?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):null;
    setSaved([{id:Date.now(),agentName,qm,pid,pName:sel?.name||"",date,scores:{...scores},ids:{...ids},typePcts,overall,notes,activeTypes:[...activeTypes]},...saved]);
    setAgentName("");setQm("");setScores({});setIds({});setNotes("");
  };

  const pColor=p=>p>=90?"green":p>=75?"orange":"red";

  return <div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:16}}>
      <div><label style={{fontSize:12,color:"var(--text3)",display:"block",marginBottom:4}}>Agent/in <span style={{color:"var(--orange)"}}>*</span></label><input value={agentName} onChange={e=>setAgentName(e.target.value)} placeholder="Name" style={{borderColor:agentName?undefined:"rgba(245,166,35,0.3)"}}/></div>
      <div><label style={{fontSize:12,color:"var(--text3)",display:"block",marginBottom:4}}>QM / TL <span style={{color:"var(--orange)"}}>*</span></label><select value={qm} onChange={e=>setQm(e.target.value)} style={{borderColor:qm?undefined:"rgba(245,166,35,0.3)"}}><option value="">– wählen –</option>{(sel?.qms||[]).map(q=><option key={q}>{q}</option>)}</select></div>
      <div><label style={{fontSize:12,color:"var(--text3)",display:"block",marginBottom:4}}>Projekt</label><select value={pid} onChange={e=>{setPid(e.target.value);setScores({});setIds({});}}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
      <div><label style={{fontSize:12,color:"var(--text3)",display:"block",marginBottom:4}}>Datum</label><input type="date" value={date} onChange={e=>setDate(e.target.value)}/></div>
    </div>

    <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
      <span style={{fontSize:12,color:"var(--text3)"}}>Aktive Typen:</span>
      {activeTypes.map(t=><Badge key={t} color={DEFAULT_TYPES[t]?.color||"gray"}><i className={`ti ${DEFAULT_TYPES[t]?.icon||"ti-file"}`} style={{marginRight:4,fontSize:11}}/>{DEFAULT_TYPES[t]?.label}</Badge>)}
      {activeTypes.length===0&&<Badge color="red">Keine aktiv — in Einstellungen konfigurieren</Badge>}
    </div>

    <div style={{display:"grid",gridTemplateColumns:activeTypes.length===1?"1fr":activeTypes.length===2?"1fr 1fr":"repeat(auto-fit,minmax(280px,1fr))",gap:14,marginBottom:14}}>
      {activeTypes.map(tk=>{
        const td=DEFAULT_TYPES[tk];const tc=sel?.monTypes?.[tk];
        const criteria=[...(tc?.customBase||td?.criteria||[]),...(tc?.extra||[])];
        const sc=scores[tk]||{};
        const pct=calcPct(tk);
        return <div key={tk} style={{background:"var(--bg3)",border:`0.5px solid ${CM[td?.color]||"var(--teal)"}`,borderRadius:10,padding:"14px 16px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{width:28,height:28,borderRadius:7,background:BM[td?.color]||"var(--bg4)",display:"flex",alignItems:"center",justifyContent:"center"}}><i className={`ti ${td?.icon||"ti-file"}`} style={{fontSize:14,color:CM[td?.color]||"var(--teal)"}}/></span><span style={{fontSize:13,fontWeight:500,color:"var(--text)"}}>{td?.label}</span></div>
            {pct!==null&&<Badge color={pColor(pct)}>{pct} %</Badge>}
          </div>
          <input value={ids[tk]||""} onChange={e=>setIds({...ids,[tk]:e.target.value})} placeholder={`${td?.label}-ID / Link`} style={{marginBottom:10}}/>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {criteria.map(c=><div key={c.key} style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:12,color:"var(--text2)",flex:1}}>{c.label}</span>
              <div style={{display:"flex",gap:3}}>{["ja","nein","/"].map(opt=><ScoreBtn key={opt} scores={sc} setScores={v=>setScores({...scores,[tk]:v})} k={c.key} opt={opt}/>)}</div>
            </div>)}
          </div>
        </div>;
      })}
    </div>

    <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Bemerkungen / Notizen..." rows={3} style={{marginBottom:12}}/>

    <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:10}}>
      {missing.length>0&&<span style={{fontSize:12,color:"var(--text3)"}}>Pflichtfelder: {missing.map((m,i)=><span key={m} style={{color:"var(--orange)"}}>{m}{i<missing.length-1?", ":""}</span>)}</span>}
      {ready&&<button onClick={save} style={{background:"rgba(43,191,191,0.15)",borderColor:"var(--teal)",color:"var(--teal)",padding:"8px 20px"}}><i className="ti ti-device-floppy" style={{marginRight:6}}/>Monitoring speichern</button>}
    </div>

    {saved.length>0&&<div style={{marginTop:20}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <p style={{fontSize:13,fontWeight:500,color:"var(--text)"}}>Gespeicherte Monitorings ({saved.length})</p>
        <button onClick={()=>{const h=["Datum","Agent/in","QM/TL","Projekt","Gesamt %","Notizen"];const r=saved.map(s=>[s.date,s.agentName,s.qm,s.pName,s.overall??"",s.notes]);dlCSV(`monitoring_${new Date().toISOString().split("T")[0]}.csv`,[h,...r]);}} style={{fontSize:12,display:"flex",alignItems:"center",gap:6}}><i className="ti ti-download" style={{fontSize:13}}/>CSV</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {saved.map(s=><div key={s.id} style={{background:"var(--bg3)",border:"0.5px solid var(--border)",borderRadius:8,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
          <div style={{flex:1}}><span style={{fontSize:13,fontWeight:500,color:"var(--text)"}}>{s.agentName}</span>{s.qm&&<span style={{fontSize:12,color:"var(--text3)",marginLeft:6}}>· {s.qm}</span>}<Badge color="teal" sm>{s.pName}</Badge><span style={{fontSize:12,color:"var(--text3)",marginLeft:8}}>{s.date}</span></div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            {(s.activeTypes||[]).map(t=>s.typePcts?.[t]!=null&&<Badge key={t} color={pColor(s.typePcts[t])} sm>{DEFAULT_TYPES[t]?.label}: {s.typePcts[t]}%</Badge>)}
            {s.overall!=null&&<Badge color={pColor(s.overall)}>Ø {s.overall}%</Badge>}
            <button onClick={()=>setSaved(saved.filter(x=>x.id!==s.id))} style={{background:"none",border:"none",color:"var(--red)",padding:"2px 6px"}}><i className="ti ti-trash" style={{fontSize:13}}/></button>
          </div>
        </div>)}
      </div>
    </div>}
  </div>;
}

// ── COACHING ───────────────────────────────────────────────────────────────
function CoachingSection({project,entries,setEntries,projects}){
  const empty={date:new Date().toISOString().split("T")[0],coach:"",agent:"",topic:"",doc:"",goal:"",smart_s:"",smart_m:"",smart_a:"",smart_r:"",smart_t:"",pid:project.id,pName:project.name};
  const [form,setForm]=useState(empty);
  const upd=(k,v)=>setForm(prev=>({...prev,[k]:v}));
  const sel=projects.find(p=>p.id==form.pid)||project;
  const smartDone=form.smart_s&&form.smart_m&&form.smart_a&&form.smart_r&&form.smart_t;
  const ready=form.coach&&form.agent&&form.topic&&form.goal&&smartDone;
  const missing=[];if(!form.coach)missing.push("Coach");if(!form.agent)missing.push("Agent/in");if(!form.topic)missing.push("Thema");if(!form.goal)missing.push("Hauptziel");if(!smartDone)missing.push("SMART vollständig");

  const save=()=>{if(!ready)return;setEntries([{...form,pName:sel.name,id:Date.now()},...entries]);setForm({...empty,pid:form.pid,coach:form.coach,date:form.date});};

  const SMART=[
    {l:"S",q:"Spezifisch — Was genau soll verbessert werden?",sub:"Welches konkrete Verhalten wurde beobachtet?",ph:"z.B. Servicefragen werden aktuell nur in 2 von 5 Calls gestellt. Ziel: mind. 4 von 5.",c:"var(--teal)",bc:"rgba(43,191,191,0.2)",k:"smart_s"},
    {l:"M",q:"Messbar — Woran erkennen wir den Erfolg?",sub:"Welche Kennzahl / welchen Wert wollen wir erreichen?",ph:"z.B. Bewertung Servicefragen steigt von 40 % auf mind. 80 % im nächsten Monitoring.",c:"var(--blue)",bc:"rgba(46,134,171,0.2)",k:"smart_m"},
    {l:"A",q:"Attraktiv — Warum ist dieses Ziel wichtig?",sub:"Was motiviert den Agenten? Welchen Mehrwert hat das Ziel?",ph:"z.B. Höhere CSAT, bessere Gesamtbewertung — Grundlage für Entwicklungsgespräch Q3.",c:"#c49fe8",bc:"rgba(123,79,166,0.2)",k:"smart_a"},
    {l:"R",q:"Realistisch — Ist das Ziel erreichbar?",sub:"Welche Unterstützung / Ressourcen stehen zur Verfügung?",ph:"z.B. Ja — Servicefragen wurden in Schulung behandelt, Fragekatalog liegt vor.",c:"var(--orange)",bc:"rgba(245,166,35,0.2)",k:"smart_r"},
    {l:"T",q:"Terminiert — Bis wann soll das Ziel erreicht sein?",sub:"Wann ist das nächste Follow-up / Monitoring geplant?",ph:"z.B. Bis KW 28 — nächstes Monitoring in 2 Wochen. Follow-up am [Datum].",c:"var(--green)",bc:"rgba(43,191,140,0.2)",k:"smart_t"},
  ];

  return <div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:12}}>
      <div><label style={{fontSize:12,color:"var(--text3)",display:"block",marginBottom:4}}>Datum</label><input type="date" value={form.date} onChange={e=>upd("date",e.target.value)}/></div>
      <div><label style={{fontSize:12,color:"var(--text3)",display:"block",marginBottom:4}}>Coach <span style={{color:"var(--orange)"}}>*</span></label><select value={form.coach} onChange={e=>upd("coach",e.target.value)} style={{borderColor:form.coach?undefined:"rgba(245,166,35,0.3)"}}><option value="">– Coach –</option>{sel.qms.map(q=><option key={q}>{q}</option>)}</select></div>
      <div><label style={{fontSize:12,color:"var(--text3)",display:"block",marginBottom:4}}>Agent/in <span style={{color:"var(--orange)"}}>*</span></label><input value={form.agent} onChange={e=>upd("agent",e.target.value)} placeholder="Agent/in" style={{borderColor:form.agent?undefined:"rgba(245,166,35,0.3)"}}/></div>
      <div><label style={{fontSize:12,color:"var(--text3)",display:"block",marginBottom:4}}>Projekt</label><select value={form.pid} onChange={e=>upd("pid",e.target.value)}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
      <div><label style={{fontSize:12,color:"var(--text3)",display:"block",marginBottom:4}}>Thema <span style={{color:"var(--orange)"}}>*</span></label><select value={form.topic} onChange={e=>upd("topic",e.target.value)} style={{borderColor:form.topic?undefined:"rgba(245,166,35,0.3)"}}><option value="">– Thema –</option>{sel.topics.map(t=><option key={t}>{t}</option>)}</select></div>
      <div><label style={{fontSize:12,color:"var(--text3)",display:"block",marginBottom:4}}>Hauptziel <span style={{color:"var(--orange)"}}>*</span></label><select value={form.goal} onChange={e=>upd("goal",e.target.value)} style={{borderColor:form.goal?undefined:"rgba(245,166,35,0.3)"}}><option value="">– Ziel –</option>{GOALS.map(g=><option key={g}>{g}</option>)}</select></div>
    </div>

    {/* SMART — immer sichtbar */}
    <div style={{background:"var(--bg3)",border:"0.5px solid rgba(43,191,191,0.3)",borderRadius:12,padding:"16px 18px",marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{display:"flex",gap:3}}>{SMART.map(({l,k,c})=><span key={l} style={{width:26,height:26,borderRadius:7,background:form[k]?"rgba(43,191,191,0.2)":"var(--bg4)",border:`1px solid ${form[k]?c:"var(--border)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:form[k]?c:"var(--text3)",transition:"all 0.2s"}}>{l}</span>)}</div>
          <p style={{fontSize:13,fontWeight:600,color:"var(--teal)",margin:0}}>SMART-Zielvereinbarung <span style={{color:"var(--orange)",fontWeight:400}}>*</span></p>
        </div>
        <span style={{fontSize:11,color:smartDone?"var(--green)":"var(--text3)"}}>{["smart_s","smart_m","smart_a","smart_r","smart_t"].filter(k=>form[k]).length}/5</span>
      </div>
      {SMART.map(({l,q,sub,ph,c,bc,k})=><div key={l} style={{marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
          <span style={{width:22,height:22,borderRadius:6,background:form[k]?bc:"var(--bg4)",border:`1px solid ${form[k]?c:"var(--border)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:c,flexShrink:0}}>{l}</span>
          <div><p style={{fontSize:12,fontWeight:500,color:"var(--text)",margin:0}}>{q}</p><p style={{fontSize:11,color:"var(--text3)",margin:0}}>{sub}</p></div>
        </div>
        <textarea value={form[k]} onChange={e=>upd(k,e.target.value)} rows={2} placeholder={ph} style={{borderColor:form[k]?"var(--border)":"rgba(245,166,35,0.25)"}}/>
      </div>)}
    </div>

    <div style={{marginBottom:12}}><label style={{fontSize:12,color:"var(--text3)",display:"block",marginBottom:4}}>Dokumentation <span style={{fontSize:11,color:"var(--text3)",fontStyle:"italic"}}>(Beobachtungen, Call-IDs, Ticket-Links)</span></label><textarea value={form.doc} onChange={e=>upd("doc",e.target.value)} rows={3} placeholder="z.B. Call ID 2460398 – Servicefragen nicht gestellt. Agent zeigt gute Empathie."/></div>

    <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:10}}>
      {missing.length>0&&<span style={{fontSize:12,color:"var(--text3)"}}>Pflichtfelder: {missing.map((m,i)=><span key={m} style={{color:"var(--orange)"}}>{m}{i<missing.length-1?", ":""}</span>)}</span>}
      {ready&&<button onClick={save} style={{background:"rgba(43,191,191,0.15)",borderColor:"var(--teal)",color:"var(--teal)",padding:"8px 20px"}}><i className="ti ti-plus" style={{marginRight:6}}/>Eintrag hinzufügen</button>}
    </div>

    {entries.length>0&&<div style={{marginTop:20}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <p style={{fontSize:13,fontWeight:500,color:"var(--text)"}}>Coaching-Einträge ({entries.length})</p>
        <button onClick={()=>{const h=["Datum","Coach","Agent/in","Projekt","Thema","Hauptziel","S","M","A","R","T","Dokumentation"];const r=entries.map(e=>[e.date,e.coach,e.agent,e.pName||"",e.topic,e.goal,e.smart_s||"",e.smart_m||"",e.smart_a||"",e.smart_r||"",e.smart_t||"",e.doc]);dlCSV(`coaching_${project.name}_${new Date().toISOString().split("T")[0]}.csv`,[h,...r]);}} style={{fontSize:12,display:"flex",alignItems:"center",gap:6}}><i className="ti ti-download" style={{fontSize:13}}/>CSV</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {entries.map(e=><div key={e.id} style={{background:"var(--bg3)",border:"0.5px solid var(--border)",borderRadius:10,padding:"12px 14px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
            <span style={{fontSize:13,fontWeight:500,color:"var(--text)"}}>{e.agent}</span>
            <span style={{fontSize:12,color:"var(--text3)"}}>{e.date}</span>
            {e.coach&&<span style={{fontSize:12,color:"var(--text3)"}}>· {e.coach}</span>}
            <Badge color="teal" sm>{e.pName}</Badge>
            <Badge color={TOPIC_COLORS[e.topic]||"gray"} sm>{e.topic}</Badge>
            <div style={{marginLeft:"auto"}}><button onClick={()=>setEntries(entries.filter(x=>x.id!==e.id))} style={{background:"none",border:"none",color:"var(--red)",padding:"2px 6px"}}><i className="ti ti-trash" style={{fontSize:13}}/></button></div>
          </div>
          {e.goal&&<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><i className="ti ti-target" style={{fontSize:13,color:"var(--teal)"}}/><span style={{fontSize:12,color:"var(--teal)",fontWeight:500}}>{e.goal}</span></div>}
          {(e.smart_s||e.smart_t)&&<div style={{paddingLeft:19,display:"flex",flexDirection:"column",gap:3,marginBottom:6}}>
            {["smart_s","smart_m","smart_a","smart_r","smart_t"].filter(k=>e[k]).map(k=>{const l=k.replace("smart_","").toUpperCase();const colors={smart_s:"var(--teal)",smart_m:"var(--blue)",smart_a:"#c49fe8",smart_r:"var(--orange)",smart_t:"var(--green)"};return <div key={k} style={{display:"flex",gap:6}}><span style={{fontSize:10,fontWeight:700,color:colors[k],width:12,flexShrink:0,marginTop:2}}>{l}</span><span style={{fontSize:12,color:"var(--text2)",lineHeight:1.5}}>{e[k]}</span></div>;})}
          </div>}
          {e.doc&&<p style={{fontSize:12,color:"var(--text3)",margin:0}}>{e.doc}</p>}
        </div>)}
      </div>
    </div>}
  </div>;
}

// ── AGENT OVERVIEW ─────────────────────────────────────────────────────────
function AgentModal({name,monitorings,coachings,projects,onClose}){
  const allMon=Object.entries(monitorings).flatMap(([pid,items])=>(items||[]).filter(m=>m.agentName===name).map(m=>({...m,pName:projects.find(p=>p.id==pid)?.name||m.pName||""})));
  const allCoa=Object.entries(coachings).flatMap(([pid,items])=>(items||[]).filter(e=>e.agent===name).map(e=>({...e,pName:projects.find(p=>p.id==pid)?.name||e.pName||""})));
  allMon.sort((a,b)=>new Date(b.date||0)-new Date(a.date||0));
  allCoa.sort((a,b)=>new Date(b.date||0)-new Date(a.date||0));
  const avgPcts=allMon.filter(m=>m.overall!=null);
  const avg=avgPcts.length>0?Math.round(avgPcts.reduce((s,m)=>s+m.overall,0)/avgPcts.length):null;
  const topicCounts={};allCoa.forEach(e=>{if(e.topic)topicCounts[e.topic]=(topicCounts[e.topic]||0)+1;});
  const topTopics=Object.entries(topicCounts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([label,value])=>({label,value}));

  return <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.75)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
    <div style={{background:"var(--bg2)",border:"0.5px solid var(--border2)",borderRadius:14,width:"100%",maxWidth:860,maxHeight:"90vh",overflow:"auto",padding:24}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:"rgba(43,191,191,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:600,color:"var(--teal)"}}>{name.slice(0,2).toUpperCase()}</div>
          <div><p style={{fontSize:18,fontWeight:600,color:"var(--teal)",margin:0}}>{name}</p><p style={{fontSize:12,color:"var(--text3)",margin:0}}>{allMon.length} Monitorings · {allCoa.length} Coachings</p></div>
        </div>
        <button onClick={onClose} style={{background:"none",border:"none",color:"var(--text2)",padding:6}}><i className="ti ti-x" style={{fontSize:20}}/></button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
        <Card><i className="ti ti-eye" style={{fontSize:16,color:"var(--teal)",marginBottom:6,display:"block"}}/><p style={{fontSize:22,fontWeight:600,color:"var(--teal)",margin:0}}>{allMon.length}</p><p style={{fontSize:12,color:"var(--text2)",margin:0}}>Monitorings</p></Card>
        <Card><i className="ti ti-messages" style={{fontSize:16,color:"var(--blue)",marginBottom:6,display:"block"}}/><p style={{fontSize:22,fontWeight:600,color:"var(--blue)",margin:0}}>{allCoa.length}</p><p style={{fontSize:12,color:"var(--text2)",margin:0}}>Coachings</p></Card>
        <Card><i className="ti ti-star" style={{fontSize:16,color:"var(--orange)",marginBottom:6,display:"block"}}/><p style={{fontSize:22,fontWeight:600,color:"var(--orange)",margin:0}}>{avg!==null?`${avg}%`:"–"}</p><p style={{fontSize:12,color:"var(--text2)",margin:0}}>Ø Bewertung</p></Card>
      </div>
      {topTopics.length>0&&<Card style={{marginBottom:14}}><p style={{fontSize:13,fontWeight:500,color:"var(--teal)",marginBottom:10}}>Top Themen</p><MiniBar data={topTopics} color="var(--orange)"/></Card>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div><p style={{fontSize:13,fontWeight:500,color:"var(--teal)",marginBottom:8}}>Monitorings</p>
          {allMon.length===0?<p style={{fontSize:13,color:"var(--text3)"}}>Keine</p>:<div style={{display:"flex",flexDirection:"column",gap:6}}>
            {allMon.map(m=><div key={m.id} style={{background:"var(--bg3)",border:"0.5px solid var(--border)",borderRadius:8,padding:"9px 12px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><Badge color="teal" sm>{m.pName}</Badge><span style={{fontSize:11,color:"var(--text3)"}}>{m.date}</span>{m.qm&&<span style={{fontSize:11,color:"var(--text3)"}}>· {m.qm}</span>}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{(m.activeTypes||[]).map(t=>m.typePcts?.[t]!=null&&<Badge key={t} color={m.typePcts[t]>=90?"green":m.typePcts[t]>=75?"orange":"red"} sm>{DEFAULT_TYPES[t]?.label}: {m.typePcts[t]}%</Badge>)}{m.overall!=null&&<Badge color={m.overall>=90?"green":m.overall>=75?"orange":"red"}>Ø {m.overall}%</Badge>}</div>
            </div>)}
          </div>}
        </div>
        <div><p style={{fontSize:13,fontWeight:500,color:"var(--teal)",marginBottom:8}}>Coachings & SMART-Ziele</p>
          {allCoa.length===0?<p style={{fontSize:13,color:"var(--text3)"}}>Keine</p>:<div style={{display:"flex",flexDirection:"column",gap:6}}>
            {allCoa.map(e=><div key={e.id} style={{background:"var(--bg3)",border:"0.5px solid var(--border)",borderRadius:8,padding:"9px 12px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}><Badge color="teal" sm>{e.pName}</Badge><span style={{fontSize:11,color:"var(--text3)"}}>{e.date}</span>{e.coach&&<span style={{fontSize:11,color:"var(--text3)"}}>· {e.coach}</span>}<Badge color={TOPIC_COLORS[e.topic]||"gray"} sm>{e.topic}</Badge></div>
              {e.goal&&<p style={{fontSize:12,color:"var(--teal)",margin:"0 0 3px",fontWeight:500}}><i className="ti ti-target" style={{marginRight:4,fontSize:11}}/>{e.goal}</p>}
              {e.smart_s&&<p style={{fontSize:11,color:"var(--text3)",margin:"0 0 2px"}}><span style={{color:"var(--teal)",fontWeight:700}}>S</span> {e.smart_s.slice(0,80)}{e.smart_s.length>80?"…":""}</p>}
              {e.smart_t&&<p style={{fontSize:11,color:"var(--text3)",margin:0}}><span style={{color:"var(--green)",fontWeight:700}}>T</span> {e.smart_t}</p>}
            </div>)}
          </div>}
        </div>
      </div>
    </div>
  </div>;
}

// ── OVERVIEW ───────────────────────────────────────────────────────────────
function OverviewSection({project,monitorings,coachings,projects}){
  const [selAgent,setSelAgent]=useState(null);
  const mon=monitorings[project.id]||[];
  const coa=coachings[project.id]||[];
  const now=new Date();
  const wkStart=new Date(now);wkStart.setDate(now.getDate()-now.getDay()+1);wkStart.setHours(0,0,0,0);
  const moStart=new Date(now.getFullYear(),now.getMonth(),1);
  const inW=d=>{try{return new Date(d)>=wkStart;}catch{return false;}};
  const inM=d=>{try{return new Date(d)>=moStart;}catch{return false;}};
  const monW=mon.filter(m=>inW(m.date)).length;
  const monM=mon.filter(m=>inM(m.date)).length;
  const coaW=coa.filter(e=>inW(e.date)).length;
  const coaM=coa.filter(e=>inM(e.date)).length;
  const errM=coa.filter(e=>e.topic==="Fehlbearbeitung"&&inM(e.date)).length;
  const scored=mon.filter(m=>inM(m.date)&&m.overall!=null);
  const avg=scored.length>0?Math.round(scored.reduce((s,m)=>s+m.overall,0)/scored.length):null;
  const topicCounts={};coa.filter(e=>inM(e.date)).forEach(e=>{if(e.topic)topicCounts[e.topic]=(topicCounts[e.topic]||0)+1;});
  const topTopics=Object.entries(topicCounts).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([label,value])=>({label,value}));
  const recentCoa=[...coa].sort((a,b)=>new Date(b.date||0)-new Date(a.date||0)).slice(0,5);
  const recentMon=[...mon].sort((a,b)=>new Date(b.date||0)-new Date(a.date||0)).slice(0,4);
  const allAgents=[...new Set([...mon.map(m=>m.agentName),...coa.map(e=>e.agent)].filter(Boolean))].sort();
  const report=`Projekt: ${project.name} | ${now.toLocaleDateString("de-DE",{month:"long",year:"numeric"})}\n\n${monM} Monitorings und ${coaM} Coachings im aktuellen Monat.${avg!=null?` Ø Bewertung: ${avg} %.`:""} ${errM>0?`${errM} Fehlbearbeitung(en) dokumentiert.`:"Keine Fehlbearbeitungen."}\n\nSchwerpunktthemen: ${topTopics.slice(0,3).map(t=>t.label).join(", ")||"–"}.\n\nNächste Schritte: Intensivierung der Maßnahmen zu den identifizierten Schwerpunkten.`;
  const [copied,setCopied]=useState(false);

  return <div style={{display:"flex",flexDirection:"column",gap:14}}>
    {selAgent&&<AgentModal name={selAgent} monitorings={monitorings} coachings={coachings} projects={projects} onClose={()=>setSelAgent(null)}/>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
      <Stat value={monW} label="Monitorings diese Woche" icon="ti-eye" color="var(--teal)" sub={`${monM} im Monat`}/>
      <Stat value={coaW} label="Coachings diese Woche" icon="ti-messages" color="var(--blue)" sub={`${coaM} im Monat`}/>
      <Stat value={avg!=null?`${avg}%`:"–"} label="Ø Bewertung (Monat)" icon="ti-star" color="var(--orange)" sub={`${scored.length} bewertet`}/>
      <Stat value={errM} label="Fehlbearbeitungen" icon="ti-alert-triangle" color="var(--red)" sub={`${coa.filter(e=>e.topic==="Fehlbearbeitung").length} gesamt`}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <Card><p style={{fontSize:13,fontWeight:500,color:"var(--teal)",marginBottom:12}}>Top Themen · {now.toLocaleDateString("de-DE",{month:"long"})}</p>{topTopics.length===0?<p style={{fontSize:13,color:"var(--text3)"}}>Noch keine Einträge.</p>:<MiniBar data={topTopics} color="var(--teal)"/>}</Card>
      <Card><p style={{fontSize:13,fontWeight:500,color:"var(--teal)",marginBottom:12}}>Letzte Coachings</p>{recentCoa.length===0?<p style={{fontSize:13,color:"var(--text3)"}}>Noch keine</p>:<div style={{display:"flex",flexDirection:"column",gap:6}}>{recentCoa.map(e=><div key={e.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:"var(--bg3)",borderRadius:7}}><div style={{flex:1}}><span style={{fontSize:13,fontWeight:500,color:"var(--text)"}}>{e.agent}</span>{e.coach&&<span style={{fontSize:11,color:"var(--text3)",marginLeft:6}}>· {e.coach}</span>}</div><Badge color={TOPIC_COLORS[e.topic]||"gray"} sm>{e.topic}</Badge><span style={{fontSize:11,color:"var(--text3)"}}>{e.date}</span></div>)}</div>}</Card>
    </div>
    {allAgents.length>0&&<Card><p style={{fontSize:13,fontWeight:500,color:"var(--teal)",marginBottom:10}}>Agenten · Klicken für Details</p><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{allAgents.map(name=>{const aMon=mon.filter(m=>m.agentName===name);const aCoa=coa.filter(e=>e.agent===name);const last=aMon[0];return <button key={name} onClick={()=>setSelAgent(name)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",background:"var(--bg3)",border:"0.5px solid var(--border)",borderRadius:10,cursor:"pointer",textAlign:"left"}}><div style={{width:32,height:32,borderRadius:"50%",background:"rgba(43,191,191,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,color:"var(--teal)",flexShrink:0}}>{name.slice(0,2).toUpperCase()}</div><div><p style={{fontSize:13,fontWeight:500,color:"var(--text)",margin:0}}>{name}</p><p style={{fontSize:11,color:"var(--text3)",margin:0}}>{aMon.length} Mon · {aCoa.length} Coa{last?.overall!=null?` · Ø ${last.overall}%`:""}</p></div><i className="ti ti-chevron-right" style={{fontSize:13,color:"var(--text3)",marginLeft:4}}/></button>;})}</div></Card>}
    {recentMon.length>0&&<Card><p style={{fontSize:13,fontWeight:500,color:"var(--teal)",marginBottom:10}}>Letzte Monitorings</p><div style={{display:"flex",flexDirection:"column",gap:6}}>{recentMon.map(m=><div key={m.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:"var(--bg3)",borderRadius:7}}><span style={{fontSize:13,fontWeight:500,color:"var(--text)",flex:1}}>{m.agentName}</span><div style={{display:"flex",gap:6}}>{(m.activeTypes||[]).map(t=>m.typePcts?.[t]!=null&&<Badge key={t} color={m.typePcts[t]>=90?"green":m.typePcts[t]>=75?"orange":"red"} sm>{DEFAULT_TYPES[t]?.label}: {m.typePcts[t]}%</Badge>)}{m.overall!=null&&<Badge color={m.overall>=90?"green":m.overall>=75?"orange":"red"}>Ø {m.overall}%</Badge>}</div><span style={{fontSize:11,color:"var(--text3)"}}>{m.date}</span></div>)}</div></Card>}
    <Card><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}><p style={{fontSize:13,fontWeight:500,color:"var(--teal)",margin:0}}>AG-Reporting <span style={{fontSize:11,color:"var(--text3)",fontWeight:400}}>automatisch</span></p><button onClick={()=>{navigator.clipboard.writeText(report);setCopied(true);setTimeout(()=>setCopied(false),2000);}} style={{background:copied?"rgba(43,191,191,0.15)":"var(--bg3)",borderColor:copied?"var(--teal)":"var(--border)",color:copied?"var(--teal)":"var(--text2)",fontSize:12,display:"flex",alignItems:"center",gap:6}}><i className={`ti ${copied?"ti-check":"ti-copy"}`}/>{copied?"Kopiert!":"Kopieren"}</button></div><textarea readOnly value={report} rows={5} style={{fontSize:13,lineHeight:1.6,resize:"none",color:"var(--text2)"}}/></Card>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <Card><p style={{fontSize:13,fontWeight:500,color:"var(--teal)",marginBottom:10}}>Team – {project.name}</p>{project.qms.length===0?<p style={{fontSize:13,color:"var(--text3)"}}>Noch keine QMs.</p>:<div style={{display:"flex",flexWrap:"wrap",gap:8}}>{project.qms.map(q=><div key={q} style={{display:"flex",alignItems:"center",gap:8,background:"var(--bg3)",borderRadius:8,padding:"7px 11px"}}><div style={{width:26,height:26,borderRadius:"50%",background:"rgba(43,191,191,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:600,color:"var(--teal)"}}>{q.slice(0,2).toUpperCase()}</div><div><p style={{fontSize:13,margin:0,color:"var(--text)"}}>{q}</p><p style={{fontSize:11,margin:0,color:"var(--text3)"}}>{coa.filter(e=>e.coach===q).length} Coachings</p></div></div>)}</div>}</Card>
      <Card><p style={{fontSize:13,fontWeight:500,color:"var(--teal)",marginBottom:10}}>Monitoring-Typen aktiv</p><div style={{display:"flex",flexDirection:"column",gap:6}}>{Object.entries(project.monTypes||{}).map(([k,cfg])=><div key={k} style={{display:"flex",alignItems:"center",gap:8}}><i className={`ti ${DEFAULT_TYPES[k]?.icon||"ti-file"}`} style={{fontSize:14,color:cfg.active?CM[DEFAULT_TYPES[k]?.color]||"var(--teal)":"var(--text3)"}}/><span style={{fontSize:13,color:cfg.active?"var(--text)":"var(--text3)"}}>{DEFAULT_TYPES[k]?.label}</span>{cfg.active?<Badge color={DEFAULT_TYPES[k]?.color||"teal"} sm>Aktiv</Badge>:<span style={{fontSize:11,color:"var(--text3)"}}>Inaktiv</span>}</div>)}</div></Card>
    </div>
  </div>;
}

// ── KPI TABLE ──────────────────────────────────────────────────────────────
function KpiTable({title,icon,color,rows,data,ziele,onData,onZiel,isAdmin}){
  const [view,setView]=useState("monat");
  const gv=(row,col)=>data?.[`${row}__${col}`]??"";
  const gz=(row)=>ziele?.[row]??"";
  const sv=(row,col,val)=>onData({...data,[`${row}__${col}`]:val});
  const sz=(row,val)=>onZiel({...ziele,[row]:val});
  const pColor=(val,ziel)=>{if(!val||!ziel)return"var(--text)";const v=parseFloat(val.replace(",",".").replace("%",""));const z=parseFloat(ziel.replace(",",".").replace("%",""));if(isNaN(v)||isNaN(z))return"var(--text)";return v>=z?"var(--green)":v>=z*0.9?"var(--orange)":"var(--red)";};
  return <div style={{marginBottom:16}}>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
      <span style={{width:26,height:26,borderRadius:7,background:BM[color]||"var(--bg4)",display:"flex",alignItems:"center",justifyContent:"center"}}><i className={`ti ${icon}`} style={{fontSize:13,color:CM[color]||"var(--teal)"}}/></span>
      <p style={{fontSize:13,fontWeight:500,color:CM[color]||"var(--teal)",margin:0}}>{title}</p>
      <div style={{display:"flex",gap:4,marginLeft:"auto"}}>
        {["monat","ziel"].map(v=><button key={v} onClick={()=>setView(v)} style={{fontSize:11,padding:"3px 10px",background:view===v?BM[color]||"rgba(43,191,191,0.12)":"var(--bg3)",borderColor:view===v?CM[color]||"var(--teal)":"var(--border)",color:view===v?CM[color]||"var(--teal)":"var(--text3)"}}>{v==="monat"?"Monatswerte":"Zielwerte"}</button>)}
      </div>
    </div>
    <div style={{overflowX:"auto"}}>
      <table style={{borderCollapse:"collapse",width:"100%",fontSize:12}}>
        <thead><tr>
          <th style={{padding:"5px 10px",textAlign:"left",color:"var(--text3)",fontWeight:500,borderBottom:"0.5px solid var(--border)",minWidth:160,position:"sticky",left:0,background:"var(--bg3)",zIndex:1}}>KPI</th>
          {view==="monat"?MONTHS.map(m=><th key={m} style={{padding:"5px 8px",textAlign:"center",color:"var(--text3)",fontWeight:500,borderBottom:"0.5px solid var(--border)",minWidth:52}}>{m}</th>):<th style={{padding:"5px 10px",textAlign:"left",color:"var(--text3)",fontWeight:500,borderBottom:"0.5px solid var(--border)",minWidth:200}}>Zielwert</th>}
        </tr></thead>
        <tbody>{rows.map((row,ri)=><tr key={row} style={{background:ri%2===0?"var(--bg4)":"var(--bg3)"}}>
          <td style={{padding:"5px 10px",color:"var(--text2)",fontWeight:500,borderBottom:"0.5px solid rgba(255,255,255,0.04)",position:"sticky",left:0,background:ri%2===0?"var(--bg4)":"var(--bg3)",zIndex:1}}>{row}</td>
          {view==="monat"?MONTHS.map(m=>{const val=gv(row,m);const ziel=gz(row);return <td key={m} style={{padding:"3px 4px",borderBottom:"0.5px solid rgba(255,255,255,0.04)",textAlign:"center"}}>{isAdmin?<input value={val} onChange={e=>sv(row,m,e.target.value)} style={{width:46,padding:"2px 4px",fontSize:11,textAlign:"center",background:"transparent",border:"0.5px solid transparent",color:pColor(val,ziel)}} onFocus={e=>e.target.style.borderColor="var(--teal)"} onBlur={e=>e.target.style.borderColor="transparent"}/>:<span style={{fontSize:11,color:pColor(val,ziel)}}>{val||"–"}</span>}</td>;}):
          <td style={{padding:"4px 8px",borderBottom:"0.5px solid rgba(255,255,255,0.04)"}}>{isAdmin?<input value={gz(row)} onChange={e=>sz(row,e.target.value)} placeholder="z.B. ≥ 90 %" style={{width:"100%",fontSize:12}}/>:<span style={{fontSize:12,color:gz(row)?"var(--teal)":"var(--text3)"}}>{gz(row)||"–"}</span>}</td>}
        </tr>)}</tbody>
      </table>
    </div>
  </div>;
}

// ── STECKBRIEF ─────────────────────────────────────────────────────────────
function SteckbriefSection({project,onUpdate,isAdmin}){
  const [local,setLocal]=useState({...DEF_SB,...(project.steckbrief||{})});
  const [editMode,setEditMode]=useState(false);
  const [sbTab,setSbTab]=useState("info");
  const [newLabel,setNewLabel]=useState("");
  const [newUrl,setNewUrl]=useState("");

  useEffect(()=>{setLocal({...DEF_SB,...(project.steckbrief||{})});},[project.id]);

  const ae=isAdmin&&editMode;
  const upd=(k,v)=>setLocal(prev=>({...prev,[k]:v}));
  const save=(k,v)=>{const u={...local,[k]:v};setLocal(u);onUpdate({steckbrief:u});};
  const saveAll=()=>onUpdate({steckbrief:local});

  const F=({label,fk,multi,ph})=><div style={{marginBottom:12}}>
    <label style={{fontSize:12,color:"var(--text3)",display:"block",marginBottom:4}}>{label}</label>
    {ae?multi?<textarea value={local[fk]||""} onChange={e=>upd(fk,e.target.value)} onBlur={e=>save(fk,e.target.value)} rows={3} placeholder={ph||label} style={{width:"100%"}}/>:<input value={local[fk]||""} onChange={e=>upd(fk,e.target.value)} onBlur={e=>save(fk,e.target.value)} placeholder={ph||label}/>:<p style={{fontSize:13,color:local[fk]?"var(--text)":"var(--text3)",margin:0,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{local[fk]||"–"}</p>}
  </div>;

  const Sec=({title,icon,color,children})=><div style={{background:"var(--bg3)",border:`0.5px solid ${CM[color]||"var(--border)"}`,borderRadius:10,padding:"14px 16px",marginBottom:12}}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><span style={{width:28,height:28,borderRadius:7,background:BM[color]||"var(--bg4)",display:"flex",alignItems:"center",justifyContent:"center"}}><i className={`ti ${icon}`} style={{fontSize:14,color:CM[color]||"var(--teal)"}}/></span><p style={{fontSize:13,fontWeight:500,color:CM[color]||"var(--teal)",margin:0}}>{title}</p></div>
    {children}
  </div>;

  const addLink=()=>{if(!newUrl.trim())return;const u={...local,links:[...(local.links||[]),{id:Date.now(),label:newLabel.trim()||newUrl.trim(),url:newUrl.trim()}]};setLocal(u);onUpdate({steckbrief:u});setNewLabel("");setNewUrl("");};
  const rmLink=(id)=>{const u={...local,links:(local.links||[]).filter(l=>l.id!==id)};setLocal(u);onUpdate({steckbrief:u});};

  const updKpi=(data)=>{const u={...local,kpiData:data};setLocal(u);onUpdate({steckbrief:u});};
  const updUmsatz=(data)=>{const u={...local,kpiUmsatzData:data};setLocal(u);onUpdate({steckbrief:u});};
  const updZiel=(data)=>{const u={...local,kpiZiele:data};setLocal(u);onUpdate({steckbrief:u});};

  return <div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <p style={{fontSize:16,fontWeight:600,color:"var(--teal)",margin:0}}>{project.name}</p>
        {local.projekttyp&&<span style={{fontSize:11,color:"var(--text3)",background:"var(--bg3)",padding:"2px 8px",borderRadius:6}}>{local.projekttyp}</span>}
      </div>
      <div style={{display:"flex",gap:8}}>
        {["info","kpi"].map(t=><button key={t} onClick={()=>setSbTab(t)} style={{fontSize:12,padding:"5px 14px",background:sbTab===t?"rgba(43,191,191,0.15)":"var(--bg3)",borderColor:sbTab===t?"var(--teal)":"var(--border)",color:sbTab===t?"var(--teal)":"var(--text2)"}}>
          <i className={`ti ${t==="info"?"ti-file-description":"ti-chart-bar"}`} style={{marginRight:4,fontSize:12}}/>{t==="info"?"Steckbrief":"KPI-Übersicht"}
        </button>)}
        {isAdmin&&<button onClick={()=>{if(editMode)saveAll();setEditMode(!editMode);}} style={{background:editMode?"rgba(43,191,191,0.15)":"var(--bg3)",borderColor:editMode?"var(--teal)":"var(--border)",color:editMode?"var(--teal)":"var(--text2)",display:"flex",alignItems:"center",gap:6}}>
          <i className={`ti ${editMode?"ti-check":"ti-edit"}`}/>{editMode?"Fertig":"Bearbeiten"}
        </button>}
      </div>
    </div>

    {sbTab==="kpi"&&<div>
      <KpiTable title={`Projekt-KPIs ${new Date().getFullYear()}`} icon="ti-chart-bar" color="teal" rows={KPI_ROWS} data={local.kpiData||{}} ziele={local.kpiZiele||{}} onData={updKpi} onZiel={updZiel} isAdmin={isAdmin}/>
      <KpiTable title={`Umsatz ${new Date().getFullYear()}`} icon="ti-coins" color="orange" rows={KPI_UMSATZ} data={local.kpiUmsatzData||{}} ziele={local.kpiZiele||{}} onData={updUmsatz} onZiel={updZiel} isAdmin={isAdmin}/>
    </div>}

    {sbTab==="info"&&<div>
      {/* Quick tiles */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
        {[{label:"Kampagnen-ID",fk:"kampagnenId",icon:"ti-hash",color:"teal"},{label:"Stand",fk:"stand",icon:"ti-calendar",color:"blue"},{label:"Projekttyp",fk:"projekttyp",icon:"ti-tag",color:"purple"},{label:"Servicezeiten",fk:"servicezeiten",icon:"ti-clock",color:"orange"}].map(({label,fk,icon,color})=><div key={fk} style={{background:"var(--bg3)",border:`0.5px solid ${CM[color]||"var(--border)"}`,borderRadius:9,padding:"11px 13px"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}><i className={`ti ${icon}`} style={{fontSize:13,color:CM[color]||"var(--teal)"}}/><span style={{fontSize:11,color:"var(--text3)"}}>{label}</span></div>
          {ae?<input value={local[fk]||""} onChange={e=>upd(fk,e.target.value)} onBlur={e=>save(fk,e.target.value)} placeholder={label} style={{fontSize:12,padding:"4px 8px"}}/>:<p style={{fontSize:13,fontWeight:500,color:local[fk]?"var(--text)":"var(--text3)",margin:0}}>{local[fk]||"–"}</p>}
        </div>)}
      </div>

      {/* Links */}
      <Sec title="Links & Ressourcen" icon="ti-link" color="blue">
        {(local.links||[]).length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>{(local.links||[]).map(l=><div key={l.id} style={{display:"flex",alignItems:"center",gap:6,background:"var(--bg4)",borderRadius:8,padding:"6px 12px",border:"0.5px solid var(--border)"}}><i className="ti ti-external-link" style={{fontSize:12,color:"var(--blue)"}}/><a href={l.url} target="_blank" rel="noopener noreferrer" style={{fontSize:13,color:"var(--blue)",fontWeight:500}}>{l.label}</a>{ae&&<button onClick={()=>rmLink(l.id)} style={{background:"none",border:"none",color:"var(--red)",padding:"1px 4px"}}><i className="ti ti-x" style={{fontSize:11}}/></button>}</div>)}</div>}
        {ae&&<div style={{display:"grid",gridTemplateColumns:"1fr 2fr auto",gap:8,alignItems:"center"}}><input value={newLabel} onChange={e=>setNewLabel(e.target.value)} placeholder="Bezeichnung" style={{fontSize:12}}/><input value={newUrl} onChange={e=>setNewUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addLink()} placeholder="https://..." style={{fontSize:12}}/><button onClick={addLink} style={{fontSize:12,padding:"5px 14px",background:"rgba(46,134,171,0.15)",borderColor:"var(--blue)",color:"var(--blue)",whiteSpace:"nowrap"}}>+ Link</button></div>}
        {(local.links||[]).length===0&&!ae&&<p style={{fontSize:13,color:"var(--text3)",margin:0}}>Noch keine Links. Im Bearbeiten-Modus hinzufügen.</p>}
      </Sec>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div>
          <Sec title="Projektübersicht" icon="ti-file-description" color="teal"><F label="Hintergrund" fk="hintergrund" multi ph="Aufbau, Ziele, Kontext..."/><F label="Abrechnung" fk="abrechnung" multi ph="z.B. 0,58€/Min..."/></Sec>
          <Sec title="KPIs, Forecast & Stoßzeiten" icon="ti-chart-bar" color="orange"><F label="Wichtige KPIs" fk="kpis" multi ph="z.B. AHT < 6 Min, FCR > 90 %..."/><F label="Forecast & Auslastung" fk="forecast" multi/><F label="Stoßzeiten" fk="stoszeiten" ph="z.B. 10:00–12:00 & 14:00–16:00"/><F label="Blending" fk="blending" ph="z.B. Check24 Möbel"/></Sec>
          <Sec title="Risiken & Chancen" icon="ti-alert-triangle" color="red"><F label="Risiken & Maßnahmen" fk="risiken" multi/><F label="Chancen" fk="chancen" multi/></Sec>
        </div>
        <div>
          <Sec title="Agenten & Hardware" icon="ti-users" color="blue"><F label="Teamgröße & FTE" fk="teamGroesse" ph="z.B. 8 Agenten, 6,5 FTE"/><F label="FTE-Ziel" fk="fte" ph="z.B. Ziel: 50 FTE"/><F label="Hardware" fk="hardware" ph="z.B. Linux, Yubikey..."/></Sec>
          <Sec title="Organisation" icon="ti-sitemap" color="purple"><F label="Ansprechpartner intern" fk="apIntern" multi/><F label="Ansprechpartner extern" fk="apExtern" multi/><F label="Kommunikationswege" fk="kommunikation" ph="z.B. Slack + E-Mail..."/></Sec>
          <Sec title="Nächste Schritte" icon="ti-list-check" color="green"><F label="Deadlines & Kernarbeit" fk="schritte" multi/><F label="Notizen" fk="notizen" multi/></Sec>
        </div>
      </div>
    </div>}
  </div>;
}

// ── SETTINGS ───────────────────────────────────────────────────────────────
function SettingsPanel({projects,setProjects,onClose}){
  const [editing,setEditing]=useState(null);
  const [newName,setNewName]=useState("");
  const [newQM,setNewQM]=useState("");
  const [newTopic,setNewTopic]=useState("");
  const [newCrit,setNewCrit]=useState({});
  const addP=()=>{if(!newName.trim())return;setProjects([...projects,{id:Date.now(),name:newName.trim(),qms:[],topics:[],monTypes:{call:{active:true,extra:[]},ticket:{active:true,extra:[]},mail:{active:false,extra:[]},chat:{active:false,extra:[]}},steckbrief:{...DEF_SB}}]);setNewName("");};
  const delP=(id)=>setProjects(projects.filter(p=>p.id!==id));
  const updP=(id,patch)=>setProjects(projects.map(p=>p.id===id?{...p,...patch}:p));
  const ep=editing?projects.find(p=>p.id===editing):null;
  const getBase=(tk)=>ep?.monTypes?.[tk]?.customBase||DEFAULT_TYPES[tk]?.criteria||[];
  const updBase=(tk,cr)=>updP(ep.id,{monTypes:{...ep.monTypes,[tk]:{...ep.monTypes[tk],customBase:cr}}});
  const TYPES=["call","ticket","mail","chat"];

  return <div style={{background:"var(--bg2)",border:"0.5px solid var(--border)",borderRadius:12,padding:"16px 18px",marginBottom:16}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
      <p style={{fontSize:15,fontWeight:500,color:"var(--teal)"}}>Projekte verwalten</p>
      <button onClick={onClose} style={{background:"none",border:"none",color:"var(--text2)"}}><i className="ti ti-x" style={{fontSize:18}}/></button>
    </div>
    {!editing?<>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
        {projects.map(p=>{const at=Object.entries(p.monTypes||{}).filter(([,c])=>c.active).map(([k])=>DEFAULT_TYPES[k]?.label||k);return <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"var(--bg3)",borderRadius:8,border:"0.5px solid var(--border)"}}>
          <div style={{flex:1}}><span style={{fontSize:14,fontWeight:500,color:"var(--text)"}}>{p.name}</span><span style={{fontSize:12,color:"var(--text3)",marginLeft:10}}>{p.qms.length} QMs · {at.join(", ")||"keine Typen"}</span></div>
          <button onClick={()=>setEditing(p.id)} style={{fontSize:12}}><i className="ti ti-edit" style={{fontSize:12,marginRight:4}}/>Bearbeiten</button>
          <button onClick={()=>delP(p.id)} style={{color:"var(--red)",fontSize:12}}><i className="ti ti-trash" style={{fontSize:12}}/></button>
        </div>;})}
      </div>
      <div style={{display:"flex",gap:8}}><input value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addP()} placeholder="Neues Projekt..."/><button onClick={addP} style={{flexShrink:0}}>+ Hinzufügen</button></div>
    </>:ep?<>
      <button onClick={()=>setEditing(null)} style={{background:"none",border:"none",color:"var(--text2)",display:"flex",alignItems:"center",gap:6,marginBottom:14}}><i className="ti ti-arrow-left" style={{fontSize:14}}/>Zurück</button>
      <div style={{marginBottom:12}}><label style={{fontSize:12,color:"var(--text3)",display:"block",marginBottom:4}}>Projektname</label><input value={ep.name} onChange={e=>updP(ep.id,{name:e.target.value})}/></div>
      <div style={{marginBottom:14}}>
        <p style={{fontSize:13,fontWeight:500,color:"var(--text)",marginBottom:8}}>QMs / Coaches</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>{ep.qms.map(q=><span key={q} style={{display:"flex",alignItems:"center",gap:4,background:"rgba(43,191,191,0.12)",color:"var(--teal)",fontSize:13,padding:"4px 10px",borderRadius:6}}>{q}<button onClick={()=>updP(ep.id,{qms:ep.qms.filter(x=>x!==q)})} style={{background:"none",border:"none",color:"var(--teal)",padding:0}}><i className="ti ti-x" style={{fontSize:11}}/></button></span>)}</div>
        <div style={{display:"flex",gap:8}}><input value={newQM} onChange={e=>setNewQM(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newQM.trim()){updP(ep.id,{qms:[...ep.qms,newQM.trim()]});setNewQM("");}}} placeholder="QM-Name..."/><button onClick={()=>{if(newQM.trim()){updP(ep.id,{qms:[...ep.qms,newQM.trim()]});setNewQM("");}}} style={{flexShrink:0}}>+</button></div>
      </div>
      <div style={{marginBottom:14}}>
        <p style={{fontSize:13,fontWeight:500,color:"var(--text)",marginBottom:8}}>Coaching-Themen</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>{ep.topics.map(t=><span key={t} style={{display:"flex",alignItems:"center",gap:4,background:"var(--bg4)",color:"var(--text2)",fontSize:13,padding:"4px 10px",borderRadius:6}}>{t}<button onClick={()=>updP(ep.id,{topics:ep.topics.filter(x=>x!==t)})} style={{background:"none",border:"none",color:"var(--text3)",padding:0}}><i className="ti ti-x" style={{fontSize:11}}/></button></span>)}</div>
        <div style={{display:"flex",gap:8}}><input value={newTopic} onChange={e=>setNewTopic(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newTopic.trim()){updP(ep.id,{topics:[...ep.topics,newTopic.trim()]});setNewTopic("");}}} placeholder="Neues Thema..."/><button onClick={()=>{if(newTopic.trim()){updP(ep.id,{topics:[...ep.topics,newTopic.trim()]});setNewTopic("");}}} style={{flexShrink:0}}>+</button></div>
      </div>
      <div>
        <p style={{fontSize:13,fontWeight:500,color:"var(--teal)",marginBottom:12}}>Monitoring-Typen & Kriterien</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {TYPES.map(tk=><TypeCard key={tk} tk={tk} ep={ep} updP={updP} newCrit={newCrit} setNewCrit={setNewCrit} getBase={getBase} updBase={updBase}/>)}
        </div>
      </div>
    </>:null}
  </div>;
}

// ── ROOT ───────────────────────────────────────────────────────────────────
export default function QMTool(){
  const {role,isAdmin,isLoggedIn,login,loginUser,logout}=useAuth();
  const initial=loadState();
  const [projects,setProjects]=useState(initial.projects);
  const [activeId,setActiveId]=useState(initial.activeProjectId);
  const [section,setSection]=useState("overview");
  const [showSettings,setShowSettings]=useState(false);
  const [monitorings,setMonitorings]=useState(initial.monitorings||{});
  const [coachings,setCoachings]=useState(initial.coachings||{});
  const [handbook,setHandbook]=useState(initial.handbook||DEF_HANDBOOK);
  const [triggers,setTriggers]=useState(initial.triggers||DEF_TRIGGERS);

  const active=projects.find(p=>p.id===activeId)||projects[0];
  useEffect(()=>{saveState({projects,activeProjectId:activeId,monitorings,coachings,handbook,triggers});},[projects,activeId,monitorings,coachings,handbook,triggers]);

  const getSaved=id=>monitorings[id]||[];
  const setSaved=(id,val)=>setMonitorings(prev=>({...prev,[id]:Array.isArray(val)?val:val(getSaved(id))}));
  const getEntries=id=>coachings[id]||[];
  const setEntries=(id,val)=>setCoachings(prev=>({...prev,[id]:Array.isArray(val)?val:val(getEntries(id))}));

  const tabs=[{key:"overview",label:"Übersicht"},{key:"steckbrief",label:"Projektsteckbrief"},{key:"handbook",label:"Handbuch & Ablauf"},{key:"monitoring",label:"Monitoring-Formular"},{key:"coaching",label:"Coaching-Dokumentation"}];

  if(!isLoggedIn)return <><InjectTheme/><LoginScreen onLogin={login} onUser={loginUser}/></>;

  return <div style={{minHeight:"100vh",background:"var(--bg)",paddingBottom:60}}>
    <InjectTheme/>
    <div style={{background:"var(--bg2)",borderBottom:"0.5px solid var(--border)",padding:"13px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:30,height:30,borderRadius:8,background:"rgba(43,191,191,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ti ti-shield-check" style={{fontSize:15,color:"var(--teal)"}}/></div>
        <div><p style={{fontSize:15,fontWeight:600,color:"var(--teal)",margin:0}}>QM-Arbeitsmappe</p><p style={{fontSize:11,color:"var(--text3)",margin:0}}>Hey Contact Heroes · Qualitätsmanagement</p></div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:isAdmin?"rgba(245,166,35,0.15)":"rgba(43,191,191,0.12)",color:isAdmin?"var(--orange)":"var(--teal)",fontWeight:500}}><i className={`ti ${isAdmin?"ti-crown":"ti-user"}`} style={{marginRight:4,fontSize:11}}/>{isAdmin?"Admin":"QM / Teamleiter"}</span>
        <button onClick={logout} style={{background:"none",border:"none",color:"var(--text3)",padding:"3px 6px",fontSize:12}} title="Abmelden"><i className="ti ti-logout" style={{fontSize:14}}/></button>
        {isAdmin&&<button onClick={()=>setShowSettings(!showSettings)} style={{background:showSettings?"rgba(43,191,191,0.15)":"var(--bg3)",borderColor:showSettings?"var(--teal)":"var(--border)",color:showSettings?"var(--teal)":"var(--text2)",display:"flex",alignItems:"center",gap:6}}><i className="ti ti-settings" style={{fontSize:14}}/>Projekte bearbeiten</button>}
      </div>
    </div>
    <div style={{padding:"18px 28px"}}>
      {showSettings&&<SettingsPanel projects={projects} setProjects={setProjects} onClose={()=>setShowSettings(false)}/>}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
        {projects.map(p=>{const total=(monitorings[p.id]?.length||0)+(coachings[p.id]?.length||0);const isAct=active&&active.id===p.id;return <button key={p.id} onClick={()=>{setActiveId(p.id);setSection("overview");}} style={{padding:"5px 14px",background:isAct?"rgba(43,191,191,0.12)":"var(--bg2)",borderColor:isAct?"var(--teal)":"var(--border)",color:isAct?"var(--teal)":"var(--text2)",fontWeight:isAct?500:400}}>{p.name}{total>0&&<span style={{marginLeft:5,fontSize:11,background:"rgba(43,191,191,0.15)",color:"var(--teal)",padding:"1px 5px",borderRadius:10}}>{total}</span>}</button>;})}
      </div>
      {active&&<div style={{background:"var(--bg2)",border:"0.5px solid var(--border)",borderRadius:12,padding:"16px 20px"}}>
        <Tabs tabs={tabs} active={section} onChange={setSection}/>
        {section==="overview"&&<OverviewSection project={active} monitorings={monitorings} coachings={coachings} projects={projects}/>}
        {section==="steckbrief"&&<SteckbriefSection project={active} onUpdate={patch=>setProjects(projects.map(p=>p.id===active.id?{...p,...patch}:p))} isAdmin={isAdmin}/>}
        {section==="handbook"&&<HandbookSection handbook={handbook} setHandbook={setHandbook} triggers={triggers} setTriggers={setTriggers} isAdmin={isAdmin}/>}
        {section==="monitoring"&&<MonitoringSection saved={getSaved(active.id)} setSaved={val=>setSaved(active.id,val)} projects={projects}/>}
        {section==="coaching"&&<CoachingSection project={active} entries={getEntries(active.id)} setEntries={val=>setEntries(active.id,val)} projects={projects}/>}
      </div>}
    </div>
  </div>;
}
      
