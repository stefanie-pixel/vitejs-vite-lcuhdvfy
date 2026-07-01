// @ts-nocheck
import { useState, useEffect } from "react";

const STORAGE_KEY = "qm_arbeitsmappe_v7";

const DARK_THEME = `
  :root {
    --bg:#0f0f1e;--bg2:#1a1a2e;--bg3:#252538;--bg4:#2e2e48;
    --text:#f0eefc;--text2:#9896b0;--text3:#6a6880;
    --teal:#2BBFBF;--orange:#F5A623;--purple:#7B4FA6;--blue:#2E86AB;
    --red:#e05555;--green:#2bbf8c;
    --border:rgba(43,191,191,0.15);--border2:rgba(43,191,191,0.25);
  }
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,sans-serif;min-height:100vh;}
  input,select,textarea{background:var(--bg3)!important;color:var(--text)!important;border:0.5px solid var(--border)!important;border-radius:8px;padding:7px 11px;font-family:inherit;font-size:13px;width:100%;outline:none;transition:border-color 0.15s;}
  input:focus,select:focus,textarea:focus{border-color:var(--teal)!important;box-shadow:0 0 0 2px rgba(43,191,191,0.12)!important;}
  input::placeholder,textarea::placeholder{color:var(--text3)!important;}
  select option{background:var(--bg3);color:var(--text);}
  button{background:var(--bg3);color:var(--text2);border:0.5px solid var(--border);border-radius:8px;padding:7px 14px;cursor:pointer;font-family:inherit;font-size:13px;transition:all 0.15s;}
  button:hover{border-color:var(--teal);color:var(--teal);}
  ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:var(--bg);}::-webkit-scrollbar-thumb{background:var(--teal);border-radius:3px;}
`;


// ── AUTH ───────────────────────────────────────────────────────────────────
const ADMIN_PIN = "!!hch2026";   // ← Admin-PIN hier ändern
const SESSION_KEY = "qm_role";

function useAuth() {
  const [role, setRole] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) || "none"; } catch { return "none"; }
  });
  const login = (pin) => {
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem(SESSION_KEY, "admin");
      setRole("admin");
      return true;
    }
    return false;
  };
  const loginUser = () => {
    sessionStorage.setItem(SESSION_KEY, "user");
    setRole("user");
  };
  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setRole("none");
  };
  return { role, isAdmin: role === "admin", isLoggedIn: role !== "none", login, loginUser, logout };
}

function LoginScreen({ onLogin, onEnterAsUser }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const tryLogin = () => {
    if (onLogin(pin)) { setError(false); }
    else { setError(true); setPin(""); setTimeout(() => setError(false), 2000); }
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ width:"100%", maxWidth:380, background:"var(--bg2)", border:"0.5px solid var(--border)", borderRadius:16, padding:32 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:"rgba(43,191,191,0.12)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
            <i className="ti ti-shield-check" style={{ fontSize:26, color:"var(--teal)" }} aria-hidden="true" />
          </div>
          <p style={{ fontSize:20, fontWeight:600, color:"var(--teal)", margin:"0 0 4px" }}>QM-Arbeitsmappe</p>
          <p style={{ fontSize:13, color:"var(--text3)", margin:0 }}>Hey Contact Heroes · Qualitätsmanagement</p>
        </div>

        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, color:"var(--text3)", display:"block", marginBottom:6 }}>Admin-PIN (für PMs & QM-Lead)</label>
          <div style={{ position:"relative" }}>
            <input
              type={showPin ? "text" : "password"}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && tryLogin()}
              placeholder="PIN eingeben..."
              style={{ paddingRight:40, borderColor: error ? "var(--red) !important" : undefined }}
              autoFocus
            />
            <button onClick={() => setShowPin(!showPin)} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"var(--text3)", padding:4 }}>
              <i className={`ti ${showPin ? "ti-eye-off" : "ti-eye"}`} style={{ fontSize:14 }} aria-hidden="true" />
            </button>
          </div>
          {error && <p style={{ fontSize:12, color:"var(--red)", margin:"6px 0 0" }}>Falscher PIN — bitte nochmal versuchen.</p>}
        </div>

        <button onClick={tryLogin} style={{ width:"100%", background:"rgba(43,191,191,0.15)", borderColor:"var(--teal)", color:"var(--teal)", padding:"10px", fontSize:14, fontWeight:500, marginBottom:10 }}>
          <i className="ti ti-login" style={{ marginRight:6 }} aria-hidden="true" />Als Admin anmelden
        </button>

        <div style={{ display:"flex", alignItems:"center", gap:10, margin:"14px 0" }}>
          <div style={{ flex:1, height:"0.5px", background:"var(--border)" }} />
          <span style={{ fontSize:12, color:"var(--text3)" }}>oder</span>
          <div style={{ flex:1, height:"0.5px", background:"var(--border)" }} />
        </div>

        <button onClick={onEnterAsUser} style={{ width:"100%", padding:"10px", fontSize:14, color:"var(--text2)" }}>
          <i className="ti ti-user" style={{ marginRight:6 }} aria-hidden="true" />Als QM / Teamleiter öffnen
        </button>

        <div style={{ marginTop:18, padding:"10px 12px", background:"var(--bg3)", borderRadius:8, border:"0.5px solid var(--border)" }}>
          <p style={{ fontSize:11, color:"var(--text3)", margin:0, lineHeight:1.5 }}>
            <i className="ti ti-info-circle" style={{ marginRight:4, color:"var(--blue)" }} aria-hidden="true" />
            <strong style={{ color:"var(--text2)" }}>Admin:</strong> Vollzugriff — Projekte, Handbuch, Steckbrief bearbeiten.<br />
            <strong style={{ color:"var(--text2)" }}>QM / Teamleiter:</strong> Monitorings & Coachings einpflegen.
          </p>
        </div>
      </div>
    </div>
  );
}

function RoleBadge({ role, onLogout }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <span style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background: role==="admin" ? "rgba(245,166,35,0.15)" : "rgba(43,191,191,0.12)", color: role==="admin" ? "var(--orange)" : "var(--teal)", fontWeight:500 }}>
        <i className={`ti ${role==="admin" ? "ti-crown" : "ti-user"}`} style={{ marginRight:4, fontSize:11 }} aria-hidden="true" />
        {role==="admin" ? "Admin" : "QM / Teamleiter"}
      </span>
      <button onClick={onLogout} style={{ background:"none", border:"none", color:"var(--text3)", padding:"3px 6px", fontSize:12 }} title="Abmelden">
        <i className="ti ti-logout" style={{ fontSize:14 }} aria-hidden="true" />
      </button>
    </div>
  );
}

function InjectTheme() {
  useEffect(() => {
    let el = document.getElementById("qm-theme");
    if (!el) { el = document.createElement("style"); el.id = "qm-theme"; document.head.appendChild(el); }
    el.textContent = DARK_THEME;
    return () => { const e = document.getElementById("qm-theme"); if (e) e.remove(); };
  }, []);
  return null;
}

// ── DEFAULT MONITORING TYPES ───────────────────────────────────────────────
const DEFAULT_TYPES = {
  call: {
    key: "call", label: "Call", icon: "ti-phone-call", color: "teal",
    criteria: [
      { key: "greeting", label: "Begrüßung / Name" },
      { key: "hotline", label: "Korrekter Hotline-Name" },
      { key: "customer_name", label: "Namentliche Ansprache KD" },
      { key: "politeness", label: "Höflichkeit (Bitte/Danke)" },
      { key: "empathy", label: "Empathie" },
      { key: "goodbye", label: "Verabschiedung" },
      { key: "privacy", label: "Datenschutz eingehalten" },
      { key: "process", label: "Prozesseinhaltung" },
      { key: "service_q", label: "Servicefragen gestellt" },
      { key: "sales", label: "Verkauf / KVH angesprochen" },
    ]
  },
  ticket: {
    key: "ticket", label: "Ticket", icon: "ti-ticket", color: "purple",
    criteria: [
      { key: "categorization", label: "Rekategorisierung korrekt" },
      { key: "wording", label: "Wording / Rechtschreibung" },
      { key: "process", label: "Prozesseinhaltung" },
      { key: "contact_entry", label: "Kontakteintrag vorhanden" },
      { key: "aht", label: "Ticket-AHT < 6 Min" },
    ]
  },
  mail: {
    key: "mail", label: "Mail", icon: "ti-mail", color: "blue",
    criteria: [
      { key: "subject", label: "Betreff korrekt" },
      { key: "salutation", label: "Anrede korrekt" },
      { key: "wording", label: "Wording / Rechtschreibung" },
      { key: "content", label: "Inhalt vollständig & korrekt" },
      { key: "process", label: "Prozesseinhaltung" },
      { key: "signature", label: "Signatur vorhanden" },
    ]
  },
  chat: {
    key: "chat", label: "Chat", icon: "ti-message", color: "orange",
    criteria: [
      { key: "greeting", label: "Begrüßung" },
      { key: "response_time", label: "Antwortzeit ok" },
      { key: "wording", label: "Wording / Rechtschreibung" },
      { key: "process", label: "Prozesseinhaltung" },
      { key: "empathy", label: "Empathie / Ton" },
      { key: "goodbye", label: "Verabschiedung" },
    ]
  },
};

const GOALS_LIBRARY = [
  "Bewertungsrate auf mind. 35 % steigern","AHT Call unter Ziel-AHT senken",
  "Servicefragen in ≥ 80 % der Calls ansprechen","Ticket-AHT unter 6 Min bringen",
  "Datenschutzprotokoll lückenlos einhalten","Fehlbearbeitungsrate auf 0 % in Folgewoche",
  "FCR auf mind. 90 % steigern","Verkauf / KVH in mind. 30 % der qualifizierten Calls anbieten",
];

const TOPIC_COLORS = {
  AHT:"orange",Fehlbearbeitung:"red",Callbesprechung:"blue",Callauswertung:"blue",
  Ticketbearbeitung:"teal",Ticketupskill:"teal",Wording:"purple",Schulung:"green",
  "Silent Monitoring":"orange","Side-by-Side":"orange",Speedtalk:"gray",KVH:"teal",Datenschutz:"red",
};


// ── PROJECT STECKBRIEF ─────────────────────────────────────────────────────
const DEFAULT_STECKBRIEF = {
  kampagnenId: "",
  stand: "",
  projekttyp: "",
  servicezeiten: "",
  abrechnung: "",
  hintergrund: "",
  teamGroesse: "",
  fte: "",
  hardware: "",
  ansprechpartnerIntern: "",
  ansprechpartnerExtern: "",
  kpis: "",
  forecast: "",
  stoszeiten: "",
  blending: "",
  kommunikation: "",
  risiken: "",
  chancen: "",
  naechsteSchritte: "",
  notizen: "",
};

const DEFAULT_PROJECTS = [
  { id:1, name:"JSMD", qms:["Betül","Christian"], topics:["AHT","Fehlbearbeitung","Callbesprechung","Ticketbearbeitung","Wording","Bewertungsrate","Prozess","Speedtalk","Silent Monitoring","Side-by-Side","Ticketupskill","Schulung"],
    monitoringTypes:{ call:{ active:true, extraCriteria:[] }, ticket:{ active:true, extraCriteria:[] }, mail:{ active:false, extraCriteria:[] }, chat:{ active:false, extraCriteria:[] } }, steckbrief:{ ...DEFAULT_STECKBRIEF, projekttyp:'Inbound + Ticket', servicezeiten:'Mo-Fr 08:00-18:00', kpis:'AHT, Bewertungsrate, FCR' } },
  { id:2, name:"Shop24", qms:["Betül","Nadine"], topics:["Callauswertung","Fehlbearbeitung","Wording","Bestellaufnahme","Speedtalk"],
    monitoringTypes:{ call:{ active:true, extraCriteria:[{ key:"order_capture", label:"Bestellaufnahme korrekt" }] }, ticket:{ active:false, extraCriteria:[] }, mail:{ active:true, extraCriteria:[] }, chat:{ active:false, extraCriteria:[] } }, steckbrief:{ ...DEFAULT_STECKBRIEF, projekttyp:'Inbound + Mail', servicezeiten:'Mo-So 00:00-23:59', abrechnung:'2,10€ pro Bestellung', kpis:'AHT 3:30 Min, Zusatzverkaufsquote 30%' } },
  { id:3, name:"Fairafric", qms:["Betül"], topics:["Ticketbearbeitung","Schulung","Side-by-Side","Speedtalk"],
    monitoringTypes:{ call:{ active:false, extraCriteria:[] }, ticket:{ active:true, extraCriteria:[{ key:"product", label:"Produktkenntnisse korrekt" }] }, mail:{ active:true, extraCriteria:[] }, chat:{ active:false, extraCriteria:[] } }, steckbrief:{ ...DEFAULT_STECKBRIEF, projekttyp:'Ticket + Mail', servicezeiten:'Mo-Fr 08:00-17:00', kpis:'Ticketqualität, Wording' } },
  { id:4, name:"Blending", qms:["Betül","Christian","Nadine"], topics:["KVH","Datenschutz","AHT/NBZ","Einwandbehandlung","Begrüßung"],
    monitoringTypes:{ call:{ active:true, extraCriteria:[{ key:"kvh", label:"KVH angesprochen" },{ key:"objection", label:"Einwandbehandlung" }] }, ticket:{ active:false, extraCriteria:[] }, mail:{ active:false, extraCriteria:[] }, chat:{ active:false, extraCriteria:[] } }, steckbrief:{ ...DEFAULT_STECKBRIEF, projekttyp:'Inbound Call', kpis:'KVH 30%, Datenschutz, AHT/NBZ' } },
];

const DEFAULT_HANDBOOK = [
  { id:1, phase:"1 · Vorbereitung", icon:"ti-clipboard-list", color:"teal", steps:["Monitoringplan für die Woche erstellen (Prio 1 & 2 MA)","Dialfire / Freshdesk öffnen – Calls & Tickets vorauswählen","KPI-Daten des MA aus der Performanceliste ziehen (AHT, FCR, CSAT, Bewertungsrate)","Letzte Coaching-Notiz lesen – gibt es offene Zielvereinbarungen?","Calls / Tickets / Mails pro MA vorbereiten (je nach aktivem Typ)"] },
  { id:2, phase:"2 · Auswertung", icon:"ti-search", color:"blue", steps:["Calls abhören / Tickets lesen / Mails prüfen – Bewertungsformular ausfüllen","Punkte notieren: alle Kriterien des jeweiligen Typs","IDs dokumentieren – direkte Verlinkung in Dokumentation","Auffälligkeiten markieren: Fehlbearbeitung, Datenschutzverstoß, positive Beispiele","Bei < 75 % → automatisch als Coaching-Trigger markieren"] },
  { id:3, phase:"3 · Feedback & Coaching", icon:"ti-messages", color:"orange", steps:["Gesprächstermin mit MA vereinbaren (15–30 Min)","Positives zuerst – mindestens 1 starkes Beispiel nennen","Konkrete Fehlbearbeitung mit ID zeigen","Wording-Hilfe & Prozesserklärung (wo nötig Side-by-Side)","Zielvereinbarung dokumentieren – nächsten Check-in Termin festlegen"] },
  { id:4, phase:"4 · Dokumentation", icon:"ti-writing", color:"green", steps:["Coaching-Dokumentation ausfüllen (Datum, Von, Bis, Thema)","Ziel / Anmerkung konkret und messbar formulieren","Fehlbearbeitungen mit Link oder ID hinterlegen","Monitoring-Ergebnis in Monitoring-Sheet eintragen","Eskalation an TL wenn nach 2 Coachings keine Verbesserung erkennbar"] },
];

const DEFAULT_TRIGGERS = [
  { label:"Bewertung < 75 %", color:"red", action:"Coaching-Pflicht" },
  { label:"Fehlbearbeitung (jede)", color:"red", action:"Speedtalk innerhalb 24 h" },
  { label:"Datenschutzverstoß", color:"red", action:"Sofortmaßnahme + TL" },
  { label:"Keine Verbesserung nach 2 Coachings", color:"orange", action:"Eskalation TL" },
  { label:"Bewertungsrate < 25 %", color:"orange", action:"Intensivbegleitung" },
  { label:"AHT > 150 % Ziel-AHT", color:"orange", action:"Side-by-Side + Silent" },
];
const DEFAULT_STATE = { projects:DEFAULT_PROJECTS, activeProjectId:1, monitorings:{}, coachings:{}, handbook:DEFAULT_HANDBOOK, triggers:DEFAULT_TRIGGERS };
function loadState() { try { const r=localStorage.getItem(STORAGE_KEY); if(r) { const parsed=JSON.parse(r); return {...DEFAULT_STATE,...parsed, triggers: parsed.triggers||DEFAULT_TRIGGERS}; } } catch(e){} return DEFAULT_STATE; }
function saveState(s) { try { localStorage.setItem(STORAGE_KEY,JSON.stringify(s)); } catch(e){} }
function downloadCSV(filename,rows) { const esc=(v)=>`"${String(v??"").replace(/"/g,'""')}"`; const csv=rows.map((r)=>r.map(esc).join(";")).join("\n"); const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"})); a.download=filename; a.click(); }

// ── HELPERS ────────────────────────────────────────────────────────────────
const COLOR_MAP = { teal:"var(--teal)", blue:"var(--blue)", orange:"var(--orange)", purple:"#c49fe8", green:"var(--green)", red:"var(--red)", gray:"var(--text3)" };
const BG_MAP = { teal:"rgba(43,191,191,0.12)", blue:"rgba(46,134,171,0.12)", orange:"rgba(245,166,35,0.12)", purple:"rgba(123,79,166,0.15)", green:"rgba(43,191,140,0.12)", red:"rgba(224,85,85,0.12)", gray:"rgba(255,255,255,0.05)" };

function Badge({ color, children, small }) {
  const bg = BG_MAP[color]||BG_MAP.gray; const text = COLOR_MAP[color]||"var(--text3)";
  return <span style={{ background:bg, color:text, fontSize:small?11:12, fontWeight:500, padding:small?"2px 7px":"3px 10px", borderRadius:6, whiteSpace:"nowrap", display:"inline-block" }}>{children}</span>;
}
function Card({ children, style }) { return <div style={{ background:"var(--bg2)", border:"0.5px solid var(--border)", borderRadius:10, padding:"14px 16px", ...style }}>{children}</div>; }
function StatCard({ value, label, icon, color, sub }) {
  return (
    <Card style={{ display:"flex", flexDirection:"column", gap:4 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <i className={`ti ${icon}`} style={{ fontSize:18, color }} aria-hidden="true" />
        {sub&&<span style={{ fontSize:11, color:"var(--text3)" }}>{sub}</span>}
      </div>
      <p style={{ fontSize:26, fontWeight:600, color, margin:0, lineHeight:1 }}>{value}</p>
      <p style={{ fontSize:12, color:"var(--text2)", margin:0 }}>{label}</p>
    </Card>
  );
}
function MiniBar({ data, color }) {
  const max = Math.max(...data.map((d)=>d.value),1);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      {data.map((d,i)=>(
        <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:12, color:"var(--text2)", width:140, flexShrink:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.label}</span>
          <div style={{ flex:1, background:"var(--bg3)", borderRadius:4, height:14, overflow:"hidden" }}>
            <div style={{ width:`${(d.value/max)*100}%`, height:"100%", background:color||"var(--teal)", borderRadius:4, minWidth:d.value>0?4:0 }} />
          </div>
          <span style={{ fontSize:12, color:"var(--text)", width:22, textAlign:"right" }}>{d.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── AGENT OVERVIEW ─────────────────────────────────────────────────────────
function AgentOverview({ agentName, monitorings, coachings, projects, onClose }) {
  // Collect all monitorings and coachings for this agent across all projects
  const allMon = Object.entries(monitorings).flatMap(([pid, items]) =>
    (items||[]).filter((m) => m.agentName === agentName).map((m) => ({
      ...m, projektName: projects.find((p) => p.id == pid)?.name || m.projektName || pid
    }))
  ).sort((a,b) => new Date(b.callDate||0) - new Date(a.callDate||0));

  const allCoa = Object.entries(coachings).flatMap(([pid, items]) =>
    (items||[]).filter((e) => e.agent === agentName).map((e) => ({
      ...e, projektName: projects.find((p) => p.id == pid)?.name || e.projektName || pid
    }))
  ).sort((a,b) => new Date(b.date||0) - new Date(a.date||0));

  const avgPct = allMon.filter((m) => m.overallPct != null);
  const avg = avgPct.length > 0 ? Math.round(avgPct.reduce((s,m) => s+m.overallPct,0)/avgPct.length) : null;
  const topicCounts = {};
  allCoa.forEach((e) => { if(e.topic) topicCounts[e.topic] = (topicCounts[e.topic]||0)+1; });
  const topTopics = Object.entries(topicCounts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([label,value])=>({label,value}));

  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.7)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"var(--bg2)", border:"0.5px solid var(--border2)", borderRadius:14, width:"100%", maxWidth:860, maxHeight:"90vh", overflow:"auto", padding:24 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:"rgba(43,191,191,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:600, color:"var(--teal)" }}>{agentName.slice(0,2).toUpperCase()}</div>
            <div>
              <p style={{ fontSize:18, fontWeight:600, color:"var(--teal)", margin:0 }}>{agentName}</p>
              <p style={{ fontSize:12, color:"var(--text3)", margin:0 }}>{allMon.length} Monitorings · {allCoa.length} Coachings</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"var(--text2)", padding:6 }} aria-label="Schließen"><i className="ti ti-x" style={{ fontSize:20 }} /></button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
          <Card><i className="ti ti-eye" style={{ fontSize:16, color:"var(--teal)", marginBottom:6, display:"block" }} /><p style={{ fontSize:22, fontWeight:600, color:"var(--teal)", margin:0 }}>{allMon.length}</p><p style={{ fontSize:12, color:"var(--text2)", margin:0 }}>Monitorings gesamt</p></Card>
          <Card><i className="ti ti-messages" style={{ fontSize:16, color:"var(--blue)", marginBottom:6, display:"block" }} /><p style={{ fontSize:22, fontWeight:600, color:"var(--blue)", margin:0 }}>{allCoa.length}</p><p style={{ fontSize:12, color:"var(--text2)", margin:0 }}>Coachings gesamt</p></Card>
          <Card><i className="ti ti-star" style={{ fontSize:16, color:"var(--orange)", marginBottom:6, display:"block" }} /><p style={{ fontSize:22, fontWeight:600, color:"var(--orange)", margin:0 }}>{avg !== null ? `${avg}%` : "–"}</p><p style={{ fontSize:12, color:"var(--text2)", margin:0 }}>Ø Bewertung</p></Card>
        </div>

        {topTopics.length > 0 && (
          <Card style={{ marginBottom:14 }}>
            <p style={{ fontSize:13, fontWeight:500, color:"var(--teal)", marginBottom:10 }}>Top Coaching-Themen</p>
            <MiniBar data={topTopics} color="var(--orange)" />
          </Card>
        )}

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
            <p style={{ fontSize:13, fontWeight:500, color:"var(--teal)", marginBottom:8 }}>Monitorings</p>
            {allMon.length === 0 ? <p style={{ fontSize:13, color:"var(--text3)" }}>Noch keine Monitorings.</p> : (
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {allMon.map((m) => (
                  <div key={m.id} style={{ background:"var(--bg3)", border:"0.5px solid var(--border)", borderRadius:8, padding:"9px 12px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                      <Badge color="teal" small>{m.projektName}</Badge>
                      <span style={{ fontSize:11, color:"var(--text3)" }}>{m.callDate}</span>
                      {m.qm && <span style={{ fontSize:11, color:"var(--text3)" }}>· {m.qm}</span>}
                    </div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {(m.activeTypes||["call","ticket"]).map((t) => m.typePcts?.[t] != null && (
                        <Badge key={t} color={m.typePcts[t]>=90?"green":m.typePcts[t]>=75?"orange":"red"} small>{DEFAULT_TYPES[t]?.label||t}: {m.typePcts[t]}%</Badge>
                      ))}
                      {m.overallPct != null && <Badge color={m.overallPct>=90?"green":m.overallPct>=75?"orange":"red"}>Ø {m.overallPct}%</Badge>}
                      {/* Legacy support */}
                      {!m.typePcts && m.callPct != null && <Badge color={m.callPct>=90?"green":m.callPct>=75?"orange":"red"} small>Call: {m.callPct}%</Badge>}
                    </div>
                    {m.notes && <p style={{ fontSize:12, color:"var(--text3)", margin:"4px 0 0", fontStyle:"italic" }}>{m.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <p style={{ fontSize:13, fontWeight:500, color:"var(--teal)", marginBottom:8 }}>Coachings</p>
            {allCoa.length === 0 ? <p style={{ fontSize:13, color:"var(--text3)" }}>Noch keine Coachings.</p> : (
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {allCoa.map((e) => (
                  <div key={e.id} style={{ background:"var(--bg3)", border:"0.5px solid var(--border)", borderRadius:8, padding:"9px 12px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:e.doc||e.goal?4:0, flexWrap:"wrap" }}>
                      <Badge color="teal" small>{e.projektName}</Badge>
                      <span style={{ fontSize:11, color:"var(--text3)" }}>{e.date}</span>
                      {e.coach && <span style={{ fontSize:11, color:"var(--text3)" }}>· {e.coach}</span>}
                      <Badge color={TOPIC_COLORS[e.topic]||"gray"} small>{e.topic}</Badge>
                    </div>
                    {e.goal && <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:2 }}><i className="ti ti-target" style={{ fontSize:12, color:"var(--teal)" }} /><span style={{ fontSize:12, color:"var(--teal)" }}>{e.goal}{e.goalSub ? ` · ${e.goalSub}` : ""}</span></div>}
                    {e.doc && <p style={{ fontSize:12, color:"var(--text3)", margin:0 }}>{e.doc}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display:"flex", gap:2, borderBottom:"0.5px solid var(--border)", marginBottom:20, overflowX:"auto" }}>
      {tabs.map((t)=>(
        <button key={t.key} onClick={()=>onChange(t.key)} style={{ background:"none", border:"none", borderBottom:active===t.key?"2px solid var(--teal)":"2px solid transparent", borderRadius:0, color:active===t.key?"var(--teal)":"var(--text2)", fontWeight:active===t.key?500:400, padding:"8px 14px", marginBottom:-1, whiteSpace:"nowrap" }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── SCORE BUTTON ───────────────────────────────────────────────────────────
function ScoreBtn({ scores, setScores, ckey, opt }) {
  const active = scores[ckey]===opt;
  return (
    <button onClick={()=>setScores({...scores,[ckey]:opt})} style={{ padding:"2px 9px", fontSize:12,
      background:active?(opt==="ja"?"rgba(43,191,140,0.2)":opt==="nein"?"rgba(224,85,85,0.2)":"var(--bg4)"):"var(--bg3)",
      color:active?(opt==="ja"?"var(--green)":opt==="nein"?"var(--red)":"var(--text2)"):"var(--text3)",
      borderColor:active?"transparent":"var(--border)" }}>{opt}</button>
  );
}

// ── TYPE PANEL (single monitoring type) ────────────────────────────────────
function TypePanel({ typeKey, typeDef, projectTypeCfg, scores, setScores, idValue, setIdValue, label }) {
  const criteria = [...(typeDef?.criteria||[]), ...(projectTypeCfg?.extraCriteria||[])];
  const vals = criteria.map((c)=>scores[c.key]).filter((v)=>v&&v!="/");
  const pct = vals.length>0 ? Math.round((vals.filter((v)=>v==="ja").length/vals.length)*100) : null;
  const pctColor = pct===null?"gray":pct>=90?"green":pct>=75?"orange":"red";

  return (
    <div style={{ background:"var(--bg3)", border:`0.5px solid ${COLOR_MAP[typeDef?.color]||"var(--border)"}`, borderRadius:10, padding:"14px 16px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ width:28, height:28, borderRadius:7, background:BG_MAP[typeDef?.color]||"var(--bg4)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <i className={`ti ${typeDef?.icon||"ti-file"}`} style={{ fontSize:14, color:COLOR_MAP[typeDef?.color]||"var(--teal)" }} aria-hidden="true" />
          </span>
          <span style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>{label||typeDef?.label}</span>
        </div>
        {pct!==null&&<Badge color={pctColor}>{pct} %</Badge>}
      </div>
      <input value={idValue} onChange={(e)=>setIdValue(e.target.value)} placeholder={`${typeDef?.label}-ID / Link`} style={{ marginBottom:10 }} />
      <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
        {criteria.map((c)=>(
          <div key={c.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:12, color:"var(--text2)", flex:1 }}>{c.label}</span>
            <div style={{ display:"flex", gap:3 }}>
              {["ja","nein","/"].map((opt)=><ScoreBtn key={opt} scores={scores} setScores={setScores} ckey={c.key} opt={opt} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MONITORING FORM ────────────────────────────────────────────────────────
function MonitoringForm({ saved, setSaved, projects }) {
  const [agentName, setAgentName] = useState("");
  const [qm, setQm] = useState("");
  const [projektId, setProjektId] = useState(projects[0]?.id||"");
  const [callDate, setCallDate] = useState(new Date().toISOString().split("T")[0]);
  const [scores, setScores] = useState({});
  const [ids, setIds] = useState({});
  const [notes, setNotes] = useState("");

  useEffect(()=>{ if(projects.length>0&&!projektId) setProjektId(projects[0].id); },[projects]);

  const selProject = projects.find((p)=>p.id==projektId)||projects[0];
  const activeTypes = Object.entries(selProject?.monitoringTypes||{}).filter(([,cfg])=>cfg.active).map(([key])=>key);

  const getScores = (typeKey) => scores[typeKey]||{};
  const setTypeScores = (typeKey, val) => setScores({...scores,[typeKey]:val});
  const getId = (typeKey) => ids[typeKey]||"";
  const setId = (typeKey, val) => setIds({...ids,[typeKey]:val});

  const calcPct = (typeKey) => {
    const cfg = selProject?.monitoringTypes?.[typeKey];
    const criteria = [...(DEFAULT_TYPES[typeKey]?.criteria||[]),...(cfg?.extraCriteria||[])];
    const sc = getScores(typeKey);
    const vals = criteria.map((c)=>sc[c.key]).filter((v)=>v&&v!="/");
    return vals.length>0 ? Math.round((vals.filter((v)=>v==="ja").length/vals.length)*100) : null;
  };

  const saveEntry = () => {
    if(!agentName) return;
    const typePcts = {};
    activeTypes.forEach((t)=>{ typePcts[t] = calcPct(t); });
    const avgPct = Object.values(typePcts).filter((v)=>v!==null);
    const overallPct = avgPct.length>0 ? Math.round(avgPct.reduce((a,b)=>a+b,0)/avgPct.length) : null;
    setSaved([{ id:Date.now(), agentName, qm, projektId, projektName:selProject?.name||"", callDate, scores:{...scores}, ids:{...ids}, typePcts, overallPct, notes, ts:new Date().toLocaleDateString("de-DE"), activeTypes:[...activeTypes] }, ...saved]);
    setAgentName(""); setQm(""); setScores({}); setIds({}); setNotes("");
  };

  const exportCSV = () => {
    const header = ["Datum","Agent/in","Projekt","Typen","Gesamt %","Notizen",...activeTypes.map((t)=>`${DEFAULT_TYPES[t]?.label||t} %`)];
    const rows = saved.map((s)=>[s.callDate||s.ts, s.agentName, s.projektName||"", (s.activeTypes||[]).join("+"), s.overallPct??"", s.notes, ...(s.activeTypes||[]).map((t)=>s.typePcts?.[t]??"")]);
    downloadCSV(`monitoring_${new Date().toISOString().split("T")[0]}.csv`,[header,...rows]);
  };

  return (
    <div>
      {/* Meta row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12, marginBottom:16 }}>
        <div><label style={{ fontSize:12, color:"var(--text3)", display:"block", marginBottom:4 }}>Agent/in</label><input value={agentName} onChange={(e)=>setAgentName(e.target.value)} placeholder="Name" /></div>
        <div><label style={{ fontSize:12, color:"var(--text3)", display:"block", marginBottom:4 }}>QM / TL</label>
          <select value={qm} onChange={(e)=>setQm(e.target.value)}>
            <option value="">– QM/TL wählen –</option>
            {(selProject?.qms||[]).map((q)=><option key={q} value={q}>{q}</option>)}
          </select>
        </div>
        <div><label style={{ fontSize:12, color:"var(--text3)", display:"block", marginBottom:4 }}>Projekt</label>
          <select value={projektId} onChange={(e)=>{ setProjektId(e.target.value); setScores({}); setIds({}); }}>
            {projects.map((p)=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div><label style={{ fontSize:12, color:"var(--text3)", display:"block", marginBottom:4 }}>Datum</label><input type="date" value={callDate} onChange={(e)=>setCallDate(e.target.value)} /></div>
      </div>

      {/* Active types info */}
      <div style={{ display:"flex", gap:8, marginBottom:16, alignItems:"center", flexWrap:"wrap" }}>
        <span style={{ fontSize:12, color:"var(--text3)" }}>Aktive Typen für {selProject?.name}:</span>
        {activeTypes.length===0 ? <Badge color="red">Keine aktiv — in Einstellungen konfigurieren</Badge> :
          activeTypes.map((t)=><Badge key={t} color={DEFAULT_TYPES[t]?.color||"gray"}><i className={`ti ${DEFAULT_TYPES[t]?.icon||"ti-file"}`} style={{ marginRight:4, fontSize:11 }} aria-hidden="true" />{DEFAULT_TYPES[t]?.label||t}</Badge>)}
      </div>

      {/* Type panels */}
      {activeTypes.length>0 && (
        <div style={{ display:"grid", gridTemplateColumns:activeTypes.length===1?"1fr":activeTypes.length===2?"1fr 1fr":"repeat(auto-fit,minmax(280px,1fr))", gap:14, marginBottom:14 }}>
          {activeTypes.map((typeKey)=>(
            <TypePanel key={typeKey} typeKey={typeKey} typeDef={DEFAULT_TYPES[typeKey]} projectTypeCfg={selProject?.monitoringTypes?.[typeKey]} scores={getScores(typeKey)} setScores={(v)=>setTypeScores(typeKey,v)} idValue={getId(typeKey)} setIdValue={(v)=>setId(typeKey,v)} />
          ))}
        </div>
      )}

      <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Bemerkungen / Notizen zum gesamten Monitoring..." rows={3} style={{ marginBottom:12 }} />

      <div style={{ display:"flex", justifyContent:"flex-end" }}>
        <button onClick={saveEntry} style={{ background:"rgba(43,191,191,0.15)", borderColor:"var(--teal)", color:"var(--teal)", padding:"8px 20px" }}>
          <i className="ti ti-device-floppy" style={{ marginRight:6 }} aria-hidden="true" />Monitoring speichern
        </button>
      </div>

      {/* Saved list */}
      {saved.length>0&&(
        <div style={{ marginTop:20 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
            <p style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>Gespeicherte Monitorings ({saved.length})</p>
            <button onClick={exportCSV} style={{ fontSize:12, display:"flex", alignItems:"center", gap:6 }}><i className="ti ti-download" style={{ fontSize:13 }} aria-hidden="true" />CSV Export</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {saved.map((s)=>(
              <div key={s.id} style={{ background:"var(--bg3)", border:"0.5px solid var(--border)", borderRadius:8, padding:"10px 14px", display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ flex:1 }}>
                  <span style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>{s.agentName}</span>
                  {s.projektName&&<Badge color="teal" small>{s.projektName}</Badge>}
                  <span style={{ fontSize:12, color:"var(--text3)", marginLeft:8 }}>{s.callDate||s.ts}</span>
                  {s.qm && <span style={{ fontSize:12, color:"var(--text3)", marginLeft:6 }}>· {s.qm}</span>}
                  {(s.activeTypes||[]).map((t)=><span key={t} style={{ marginLeft:6 }}><i className={`ti ${DEFAULT_TYPES[t]?.icon||"ti-file"}`} style={{ fontSize:11, color:COLOR_MAP[DEFAULT_TYPES[t]?.color]||"var(--text3)" }} aria-hidden="true" /></span>)}
                </div>
                <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                  {(s.activeTypes||[]).map((t)=>s.typePcts?.[t]!=null&&(
                    <Badge key={t} color={s.typePcts[t]>=90?"green":s.typePcts[t]>=75?"orange":"red"} small>
                      {DEFAULT_TYPES[t]?.label||t}: {s.typePcts[t]}%
                    </Badge>
                  ))}
                  {s.overallPct!=null&&<Badge color={s.overallPct>=90?"green":s.overallPct>=75?"orange":"red"}>Ø {s.overallPct}%</Badge>}
                  <button onClick={()=>setSaved(saved.filter((x)=>x.id!==s.id))} style={{ background:"none", border:"none", color:"var(--red)", padding:"2px 6px" }} aria-label="löschen"><i className="ti ti-trash" style={{ fontSize:13 }} aria-hidden="true" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── MONITORING TYPE CONFIGURATOR ───────────────────────────────────────────
function TypeConfigurator({ project, onUpdate }) {
  const [newExtra, setNewExtra] = useState({});
  const types = ["call","ticket","mail","chat"];
  const cfg = project.monitoringTypes || {};

  const toggle = (typeKey) => {
    const cur = cfg[typeKey]||{ active:false, extraCriteria:[] };
    onUpdate({ monitoringTypes:{ ...cfg, [typeKey]:{ ...cur, active:!cur.active } } });
  };
  const addExtra = (typeKey) => {
    const label = (newExtra[typeKey]||"").trim(); if(!label) return;
    const cur = cfg[typeKey]||{ active:true, extraCriteria:[] };
    onUpdate({ monitoringTypes:{ ...cfg, [typeKey]:{ ...cur, extraCriteria:[...(cur.extraCriteria||[]),{ key:`extra_${typeKey}_${Date.now()}`, label }] } } });
    setNewExtra({...newExtra,[typeKey]:""});
  };
  const rmExtra = (typeKey, key) => {
    const cur = cfg[typeKey]||{ active:true, extraCriteria:[] };
    onUpdate({ monitoringTypes:{ ...cfg, [typeKey]:{ ...cur, extraCriteria:(cur.extraCriteria||[]).filter((c)=>c.key!==key) } } });
  };

  return (
    <div style={{ marginTop:16 }}>
      <p style={{ fontSize:13, fontWeight:500, color:"var(--teal)", marginBottom:12 }}>Monitoring-Typen & Kriterien · {project.name}</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {types.map((typeKey)=>{
          const td = DEFAULT_TYPES[typeKey]; const tc = cfg[typeKey]||{ active:false, extraCriteria:[] };
          return (
            <div key={typeKey} style={{ background:"var(--bg4)", borderRadius:10, padding:"12px 14px", border:`0.5px solid ${tc.active?COLOR_MAP[td?.color]||"var(--teal)":"var(--border)"}`, transition:"border-color 0.2s" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <i className={`ti ${td?.icon||"ti-file"}`} style={{ fontSize:15, color:tc.active?COLOR_MAP[td?.color]||"var(--teal)":"var(--text3)" }} aria-hidden="true" />
                  <span style={{ fontSize:13, fontWeight:500, color:tc.active?"var(--text)":"var(--text3)" }}>{td?.label||typeKey}</span>
                </div>
                <button onClick={()=>toggle(typeKey)} style={{ padding:"4px 12px", fontSize:12, background:tc.active?"rgba(43,191,191,0.15)":"var(--bg3)", borderColor:tc.active?"var(--teal)":"var(--border)", color:tc.active?"var(--teal)":"var(--text3)" }}>
                  {tc.active?"✓ Aktiv":"Inaktiv"}
                </button>
              </div>
              {tc.active&&(
                <>
                  <div style={{ fontSize:11, color:"var(--text3)", marginBottom:6 }}>{td?.criteria?.length||0} Basis-Kriterien</div>
                  {(tc.extraCriteria||[]).length>0&&(
                    <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:8 }}>
                      {(tc.extraCriteria||[]).map((c)=>(
                        <div key={c.key} style={{ display:"flex", alignItems:"center", gap:6, background:"var(--bg3)", borderRadius:6, padding:"4px 8px" }}>
                          <span style={{ flex:1, fontSize:12, color:"var(--text2)" }}>+ {c.label}</span>
                          <button onClick={()=>rmExtra(typeKey,c.key)} style={{ background:"none", border:"none", color:"var(--red)", padding:"1px 4px" }}><i className="ti ti-x" style={{ fontSize:11 }} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display:"flex", gap:6 }}>
                    <input value={newExtra[typeKey]||""} onChange={(e)=>setNewExtra({...newExtra,[typeKey]:e.target.value})} onKeyDown={(e)=>e.key==="Enter"&&addExtra(typeKey)} placeholder="Zusatzkriterium..." style={{ fontSize:12 }} />
                    <button onClick={()=>addExtra(typeKey)} style={{ flexShrink:0, padding:"4px 10px", fontSize:12 }}>+</button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── COACHING DOC ───────────────────────────────────────────────────────────
function CoachingDoc({ project, entries, setEntries, projects }) {
  const [form, setForm] = useState({ date:new Date().toISOString().split("T")[0], coach:"", agent:"", topic:"", doc:"", goal:"", goalSub:"", projektId:project.id, projektName:project.name });
  const upd = (k,v) => setForm({...form,[k]:v});
  const sel = projects.find((p)=>p.id==form.projektId)||project;

  const save = () => {
    if(!form.agent||!form.topic) return;
    setEntries([{...form,projektName:sel.name,id:Date.now()},...entries]);
    setForm({...form,agent:"",topic:"",doc:"",goal:"",date:new Date().toISOString().split("T")[0]});
  };
  const exportCSV = () => {
    const header=["Datum","Coach","Agent/in","Projekt","Thema","Dokumentation","Ziel"];
    const rows=entries.map((e)=>[e.date,e.coach,e.agent,e.projektName||"",e.topic,e.doc,e.goal]);
    downloadCSV(`coaching_${project.name}_${new Date().toISOString().split("T")[0]}.csv`,[header,...rows]);
  };

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:10, marginBottom:12 }}>
        <div><label style={{ fontSize:12, color:"var(--text3)", display:"block", marginBottom:4 }}>Datum</label><input type="date" value={form.date} onChange={(e)=>upd("date",e.target.value)} /></div>
        <div><label style={{ fontSize:12, color:"var(--text3)", display:"block", marginBottom:4 }}>Coach</label><select value={form.coach} onChange={(e)=>upd("coach",e.target.value)}><option value="">– Coach –</option>{sel.qms.map((q)=><option key={q}>{q}</option>)}</select></div>
        <div><label style={{ fontSize:12, color:"var(--text3)", display:"block", marginBottom:4 }}>Agent/in</label><input value={form.agent} onChange={(e)=>upd("agent",e.target.value)} placeholder="Agent/in" /></div>
        <div><label style={{ fontSize:12, color:"var(--text3)", display:"block", marginBottom:4 }}>Projekt</label><select value={form.projektId} onChange={(e)=>upd("projektId",e.target.value)}>{projects.map((p)=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
        <div><label style={{ fontSize:12, color:"var(--text3)", display:"block", marginBottom:4 }}>Thema</label><select value={form.topic} onChange={(e)=>upd("topic",e.target.value)}><option value="">– Thema –</option>{sel.topics.map((t)=><option key={t}>{t}</option>)}</select></div>
        <div><label style={{ fontSize:12, color:"var(--text3)", display:"block", marginBottom:4 }}>Hauptziel</label><select value={form.goal} onChange={(e)=>upd("goal",e.target.value)}><option value="">– Ziel wählen –</option>{GOALS_LIBRARY.map((g)=><option key={g}>{g}</option>)}</select></div>
      </div>
      {form.goal && (
        <div style={{ marginBottom:10 }}>
          <label style={{ fontSize:12, color:"var(--text3)", display:"block", marginBottom:4 }}>Ziel-Unterpunkt <span style={{ color:"var(--text3)", fontStyle:"italic" }}>(optional)</span></label>
          <input value={form.goalSub} onChange={(e)=>upd("goalSub",e.target.value)} placeholder="z.B. Konkret: Servicefragen in mind. 3 von 5 Calls ansprechen" />
        </div>
      )}
      <div style={{ marginBottom:10 }}><label style={{ fontSize:12, color:"var(--text3)", display:"block", marginBottom:4 }}>Dokumentation</label><textarea value={form.doc} onChange={(e)=>upd("doc",e.target.value)} rows={3} placeholder="z.B. Call ID 2460398 – Servicefragen nicht gestellt" /></div>
      <div style={{ display:"flex", justifyContent:"flex-end" }}>
        <button onClick={save} style={{ background:"rgba(43,191,191,0.15)", borderColor:"var(--teal)", color:"var(--teal)", padding:"8px 20px" }}>
          <i className="ti ti-plus" style={{ marginRight:6 }} aria-hidden="true" />Eintrag hinzufügen
        </button>
      </div>
      {entries.length>0&&(
        <div style={{ marginTop:20 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
            <p style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>Coaching-Einträge ({entries.length})</p>
            <button onClick={exportCSV} style={{ fontSize:12, display:"flex", alignItems:"center", gap:6 }}><i className="ti ti-download" style={{ fontSize:13 }} aria-hidden="true" />CSV Export</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {entries.map((e)=>(
              <div key={e.id} style={{ background:"var(--bg3)", border:"0.5px solid var(--border)", borderRadius:10, padding:"12px 14px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:e.doc||e.goal?6:0, flexWrap:"wrap" }}>
                  <span style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>{e.agent}</span>
                  <span style={{ fontSize:12, color:"var(--text3)" }}>{e.date}</span>
                  {e.coach&&<span style={{ fontSize:12, color:"var(--text3)" }}>· {e.coach}</span>}
                  {e.projektName&&<Badge color="teal" small>{e.projektName}</Badge>}
                  <Badge color={TOPIC_COLORS[e.topic]||"gray"} small>{e.topic}</Badge>
                  <div style={{ marginLeft:"auto" }}><button onClick={()=>setEntries(entries.filter((x)=>x.id!==e.id))} style={{ background:"none", border:"none", color:"var(--red)", padding:"2px 6px" }} aria-label="löschen"><i className="ti ti-trash" style={{ fontSize:13 }} aria-hidden="true" /></button></div>
                </div>
                {e.doc&&<p style={{ fontSize:13, color:"var(--text3)", margin:"0 0 4px" }}>{e.doc}</p>}
                {e.goal&&<div style={{ display:"flex", alignItems:"flex-start", gap:6 }}><i className="ti ti-target" style={{ fontSize:13, color:"var(--teal)", marginTop:1 }} aria-hidden="true" /><div><span style={{ fontSize:12, color:"var(--teal)" }}>{e.goal}</span>{e.goalSub&&<p style={{ fontSize:12, color:"var(--text3)", margin:"2px 0 0" }}>↳ {e.goalSub}</p>}</div></div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


// ── PROJEKT STECKBRIEF ─────────────────────────────────────────────────────
function SteckbriefSection({ project, onUpdate, isAdmin }) {
  const sb = project.steckbrief || { ...DEFAULT_STECKBRIEF };
  const [editMode, setEditMode] = useState(false);
  const actualEditMode = isAdmin && editMode;
  const upd = (k, v) => onUpdate({ steckbrief: { ...sb, [k]: v } });

  const Field = ({ label, fieldKey, multiline, placeholder }) => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 4 }}>{label}</label>
      {actualEditMode ? (
        multiline
          ? <textarea value={sb[fieldKey]||""} onChange={(e)=>upd(fieldKey,e.target.value)} rows={3} placeholder={placeholder||label} style={{ width:"100%" }} />
          : <input value={sb[fieldKey]||""} onChange={(e)=>upd(fieldKey,e.target.value)} placeholder={placeholder||label} />
      ) : (
        <p style={{ fontSize: 13, color: sb[fieldKey] ? "var(--text)" : "var(--text3)", margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
          {sb[fieldKey] || "–"}
        </p>
      )}
    </div>
  );

  const Section = ({ title, icon, color, children }) => (
    <div style={{ background: "var(--bg3)", border: `0.5px solid ${COLOR_MAP[color]||"var(--border)"}`, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ width: 28, height: 28, borderRadius: 7, background: BG_MAP[color]||"var(--bg4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i className={`ti ${icon}`} style={{ fontSize: 14, color: COLOR_MAP[color]||"var(--teal)" }} aria-hidden="true" />
        </span>
        <p style={{ fontSize: 13, fontWeight: 500, color: COLOR_MAP[color]||"var(--teal)", margin: 0 }}>{title}</p>
      </div>
      {children}
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 16, fontWeight: 600, color: "var(--teal)", margin: 0 }}>{project.name}</p>
          {sb.projekttyp && <p style={{ fontSize: 12, color: "var(--text3)", margin: 0 }}>{sb.projekttyp}</p>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {isAdmin && <button onClick={() => setEditMode(!editMode)} style={{ background: editMode ? "rgba(43,191,191,0.15)" : "var(--bg3)", borderColor: editMode ? "var(--teal)" : "var(--border)", color: editMode ? "var(--teal)" : "var(--text2)", display: "flex", alignItems: "center", gap: 6 }}>
            <i className={`ti ${editMode ? "ti-check" : "ti-edit"}`} aria-hidden="true" />{editMode ? "Fertig" : "Bearbeiten"}
          </button>}
        </div>
      </div>

      {/* Quick info row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 14 }}>
        {[
          { label: "Kampagnen-ID", key: "kampagnenId", icon: "ti-hash", color: "teal" },
          { label: "Stand", key: "stand", icon: "ti-calendar", color: "blue" },
          { label: "Projekttyp", key: "projekttyp", icon: "ti-tag", color: "purple" },
          { label: "Servicezeiten", key: "servicezeiten", icon: "ti-clock", color: "orange" },
        ].map(({ label, key, icon, color }) => (
          <div key={key} style={{ background: "var(--bg3)", border: `0.5px solid ${COLOR_MAP[color]||"var(--border)"}`, borderRadius: 9, padding: "11px 13px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
              <i className={`ti ${icon}`} style={{ fontSize: 13, color: COLOR_MAP[color]||"var(--teal)" }} aria-hidden="true" />
              <span style={{ fontSize: 11, color: "var(--text3)" }}>{label}</span>
            </div>
            {actualEditMode
              ? <input value={sb[key]||""} onChange={(e)=>upd(key,e.target.value)} placeholder={label} style={{ fontSize: 12, padding: "4px 8px" }} />
              : <p style={{ fontSize: 13, fontWeight: 500, color: sb[key] ? "var(--text)" : "var(--text3)", margin: 0 }}>{sb[key] || "–"}</p>
            }
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <Section title="Projektübersicht" icon="ti-file-description" color="teal">
            <Field label="Hintergrund & Ausgangssituation" fieldKey="hintergrund" multiline placeholder="Aufbau, Ziele, Kontext..." />
            <Field label="Abrechnungsmodalitäten" fieldKey="abrechnung" multiline placeholder="z.B. 0,58€/Min, Schulungen 25€/h..." />
          </Section>
          <Section title="KPIs, Forecast & Stoßzeiten" icon="ti-chart-bar" color="orange">
            <Field label="Wichtige KPIs" fieldKey="kpis" multiline placeholder="z.B. AHT < 6 Min, FCR > 90%, CSAT..." />
            <Field label="Forecast & Auslastung" fieldKey="forecast" multiline placeholder="z.B. Prognose 3 Monate, 92% Auslastung..." />
            <Field label="Stoßzeiten" fieldKey="stoszeiten" placeholder="z.B. 10:00-12:00 & 14:00-16:00" />
            <Field label="Blending mit anderen Projekten" fieldKey="blending" placeholder="z.B. Check24 Möbel" />
          </Section>
          <Section title="Risiken, Chancen & Besonderheiten" icon="ti-alert-triangle" color="red">
            <Field label="Identifizierte Risiken & Maßnahmen" fieldKey="risiken" multiline placeholder="z.B. technische Integrationsprobleme..." />
            <Field label="Chancen des Projekts" fieldKey="chancen" multiline placeholder="z.B. Skalierungspotenzial durch Forecasts..." />
          </Section>
        </div>
        <div>
          <Section title="Agenten & Hardware" icon="ti-users" color="blue">
            <Field label="Teamgröße & FTE" fieldKey="teamGroesse" placeholder="z.B. 8 Agenten, 6,5 FTE" />
            <Field label="FTE-Ziel" fieldKey="fte" placeholder="z.B. Ziel: 50 FTE" />
            <Field label="Hardware & Technik" fieldKey="hardware" placeholder="z.B. Linux, Windows, Yubikey..." />
          </Section>
          <Section title="Organisation & Verantwortlichkeiten" icon="ti-sitemap" color="purple">
            <Field label="Ansprechpartner intern" fieldKey="ansprechpartnerIntern" multiline placeholder="z.B. Yvonne Grundmann, Pascal..." />
            <Field label="Ansprechpartner extern" fieldKey="ansprechpartnerExtern" multiline placeholder="z.B. Jörn Bergner (QM), Peter Micka..." />
            <Field label="Kommunikationswege" fieldKey="kommunikation" placeholder="z.B. Slack + E-Mail, Teams..." />
          </Section>
          <Section title="Zusammenfassung & Nächste Schritte" icon="ti-list-check" color="green">
            <Field label="Kernarbeit & wichtige Deadlines" fieldKey="naechsteSchritte" multiline placeholder="z.B. Go-Live 03.03., Hypercare bis 16.03..." />
            <Field label="Notizen & Besonderheiten" fieldKey="notizen" multiline placeholder="Freie Notizen..." />
          </Section>
        </div>
      </div>
    </div>
  );
}

// ── OVERVIEW ───────────────────────────────────────────────────────────────
function OverviewSection({ project, monitorings, coachings, projects }) {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const mon = monitorings[project.id]||[];
  const coa = coachings[project.id]||[];
  const now = new Date();
  const weekStart = new Date(now); weekStart.setDate(now.getDate()-now.getDay()+1); weekStart.setHours(0,0,0,0);
  const monthStart = new Date(now.getFullYear(),now.getMonth(),1);
  const inWeek = (d) => { try { return new Date(d)>=weekStart; } catch { return false; } };
  const inMonth = (d) => { try { return new Date(d)>=monthStart; } catch { return false; } };

  const monW = mon.filter((m)=>inWeek(m.callDate)).length;
  const monM = mon.filter((m)=>inMonth(m.callDate)).length;
  const coaW = coa.filter((e)=>inWeek(e.date)).length;
  const coaM = coa.filter((e)=>inMonth(e.date)).length;
  const errM = coa.filter((e)=>e.topic==="Fehlbearbeitung"&&inMonth(e.date)).length;
  const scoredM = mon.filter((m)=>inMonth(m.callDate)&&m.overallPct!=null);
  const avgPct = scoredM.length>0 ? Math.round(scoredM.reduce((s,m)=>s+m.overallPct,0)/scoredM.length) : null;

  const topicCounts = {};
  coa.filter((e)=>inMonth(e.date)).forEach((e)=>{ if(e.topic) topicCounts[e.topic]=(topicCounts[e.topic]||0)+1; });
  const topTopics = Object.entries(topicCounts).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([label,value])=>({label,value}));

  const recentCoa = [...coa].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5);
  const recentMon = [...mon].sort((a,b)=>new Date(b.callDate||0)-new Date(a.callDate||0)).slice(0,4);

  const [copied,setCopied] = useState(false);
  const report = `Projekt: ${project.name} | ${now.toLocaleDateString("de-DE",{month:"long",year:"numeric"})}\n\n${monM} Monitorings und ${coaM} Coachings im aktuellen Monat.${avgPct!=null?` Ø Bewertung: ${avgPct} %.`:""} ${errM>0?`${errM} Fehlbearbeitung(en) dokumentiert.`:"Keine Fehlbearbeitungen dokumentiert."}\n\nSchwerpunktthemen: ${topTopics.slice(0,3).map((t)=>t.label).join(", ")||"–"}.\n\nNächste Schritte: Intensivierung der Maßnahmen zu den identifizierten Schwerpunkten. Follow-up-Termine sind vereinbart.`;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
        <StatCard value={monW} label="Monitorings diese Woche" icon="ti-eye" color="var(--teal)" sub={`${monM} im Monat`} />
        <StatCard value={coaW} label="Coachings diese Woche" icon="ti-messages" color="var(--blue)" sub={`${coaM} im Monat`} />
        <StatCard value={avgPct!=null?`${avgPct}%`:"–"} label="Ø Bewertung (Monat)" icon="ti-star" color="var(--orange)" sub={`${scoredM.length} bewertet`} />
        <StatCard value={errM} label="Fehlbearbeitungen (Monat)" icon="ti-alert-triangle" color="var(--red)" sub={`${coa.filter((e)=>e.topic==="Fehlbearbeitung").length} gesamt`} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Card>
          <p style={{ fontSize:13, fontWeight:500, color:"var(--teal)", marginBottom:12 }}>Top Themen · {now.toLocaleDateString("de-DE",{month:"long"})}</p>
          {topTopics.length===0 ? <p style={{ fontSize:13, color:"var(--text3)" }}>Noch keine Einträge.</p> : <MiniBar data={topTopics} color="var(--teal)" />}
        </Card>
        <Card>
          <p style={{ fontSize:13, fontWeight:500, color:"var(--teal)", marginBottom:12 }}>Letzte Coachings</p>
          {recentCoa.length===0 ? <p style={{ fontSize:13, color:"var(--text3)" }}>Noch keine Einträge.</p> : (
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {recentCoa.map((e)=>(
                <div key={e.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", background:"var(--bg3)", borderRadius:7 }}>
                  <div style={{ flex:1 }}>
                    <span style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>{e.agent}</span>
                    {e.coach&&<span style={{ fontSize:11, color:"var(--text3)", marginLeft:6 }}>· {e.coach}</span>}
                  </div>
                  <Badge color={TOPIC_COLORS[e.topic]||"gray"} small>{e.topic}</Badge>
                  <span style={{ fontSize:11, color:"var(--text3)" }}>{e.date}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Agent Overview Modal */}
      {selectedAgent && <AgentOverview agentName={selectedAgent} monitorings={monitorings} coachings={coachings} projects={projects} onClose={()=>setSelectedAgent(null)} />}

      {/* Clickable Agent List */}
      {(() => {
        const allAgents = [...new Set([
          ...mon.map((m)=>m.agentName),
          ...coa.map((e)=>e.agent)
        ].filter(Boolean))].sort();
        if (allAgents.length === 0) return null;
        return (
          <Card>
            <p style={{ fontSize:13, fontWeight:500, color:"var(--teal)", marginBottom:10 }}>Agenten · klicken für Details</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {allAgents.map((name)=>{
                const agentMon = mon.filter((m)=>m.agentName===name);
                const agentCoa = coa.filter((e)=>e.agent===name);
                const lastMon = agentMon[0];
                const pctColor = lastMon?.overallPct != null ? (lastMon.overallPct>=90?"var(--green)":lastMon.overallPct>=75?"var(--orange)":"var(--red)") : "var(--text3)";
                return (
                  <button key={name} onClick={()=>setSelectedAgent(name)} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 14px", background:"var(--bg3)", border:"0.5px solid var(--border)", borderRadius:10, cursor:"pointer", textAlign:"left" }}>
                    <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(43,191,191,0.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:600, color:"var(--teal)", flexShrink:0 }}>{name.slice(0,2).toUpperCase()}</div>
                    <div>
                      <p style={{ fontSize:13, fontWeight:500, color:"var(--text)", margin:0 }}>{name}</p>
                      <p style={{ fontSize:11, color:"var(--text3)", margin:0 }}>{agentMon.length} Mon · {agentCoa.length} Coa{lastMon?.overallPct != null ? <span style={{ color:pctColor }}> · Ø {lastMon.overallPct}%</span> : ""}</p>
                    </div>
                    <i className="ti ti-chevron-right" style={{ fontSize:13, color:"var(--text3)", marginLeft:4 }} aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </Card>
        );
      })()}

      {recentMon.length>0&&(
        <Card>
          <p style={{ fontSize:13, fontWeight:500, color:"var(--teal)", marginBottom:10 }}>Letzte Monitorings</p>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {recentMon.map((m)=>(
              <div key={m.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", background:"var(--bg3)", borderRadius:7 }}>
                <span style={{ fontSize:13, fontWeight:500, color:"var(--text)", flex:1 }}>{m.agentName}</span>
                <div style={{ display:"flex", gap:4 }}>
                  {(m.activeTypes||[]).map((t)=>(
                    <span key={t}><i className={`ti ${DEFAULT_TYPES[t]?.icon||"ti-file"}`} style={{ fontSize:12, color:COLOR_MAP[DEFAULT_TYPES[t]?.color]||"var(--text3)" }} title={DEFAULT_TYPES[t]?.label} aria-hidden="true" /></span>
                  ))}
                </div>
                {(m.activeTypes||[]).map((t)=>m.typePcts?.[t]!=null&&<Badge key={t} color={m.typePcts[t]>=90?"green":m.typePcts[t]>=75?"orange":"red"} small>{DEFAULT_TYPES[t]?.label}: {m.typePcts[t]}%</Badge>)}
                {m.overallPct!=null&&<Badge color={m.overallPct>=90?"green":m.overallPct>=75?"orange":"red"}>Ø {m.overallPct}%</Badge>}
                <span style={{ fontSize:11, color:"var(--text3)" }}>{m.callDate}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
          <p style={{ fontSize:13, fontWeight:500, color:"var(--teal)" }}>AG-Reporting <span style={{ fontSize:11, color:"var(--text3)", fontWeight:400 }}>automatisch generiert</span></p>
          <button onClick={()=>{ navigator.clipboard.writeText(report); setCopied(true); setTimeout(()=>setCopied(false),2000); }} style={{ background:copied?"rgba(43,191,191,0.15)":"var(--bg3)", borderColor:copied?"var(--teal)":"var(--border)", color:copied?"var(--teal)":"var(--text2)", fontSize:12, display:"flex", alignItems:"center", gap:6 }}>
            <i className={`ti ${copied?"ti-check":"ti-copy"}`} aria-hidden="true" />{copied?"Kopiert!":"Kopieren"}
          </button>
        </div>
        <textarea readOnly value={report} rows={5} style={{ fontSize:13, lineHeight:1.6, resize:"none", color:"var(--text2)" }} />
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Card>
          <p style={{ fontSize:13, fontWeight:500, color:"var(--teal)", marginBottom:10 }}>Team – {project.name}</p>
          {project.qms.length===0 ? <p style={{ fontSize:13, color:"var(--text3)" }}>Noch keine QMs.</p> : (
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {project.qms.map((q)=>(
                <div key={q} style={{ display:"flex", alignItems:"center", gap:8, background:"var(--bg3)", borderRadius:8, padding:"7px 11px" }}>
                  <div style={{ width:26, height:26, borderRadius:"50%", background:"rgba(43,191,191,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:600, color:"var(--teal)" }}>{q.slice(0,2).toUpperCase()}</div>
                  <div><p style={{ fontSize:13, margin:0, color:"var(--text)" }}>{q}</p><p style={{ fontSize:11, margin:0, color:"var(--text3)" }}>{coa.filter((e)=>e.coach===q).length} Coachings</p></div>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card>
          <p style={{ fontSize:13, fontWeight:500, color:"var(--teal)", marginBottom:10 }}>Aktive Monitoring-Typen</p>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {Object.entries(project.monitoringTypes||{}).map(([key,cfg])=>(
              <div key={key} style={{ display:"flex", alignItems:"center", gap:8 }}>
                <i className={`ti ${DEFAULT_TYPES[key]?.icon||"ti-file"}`} style={{ fontSize:14, color:cfg.active?COLOR_MAP[DEFAULT_TYPES[key]?.color]||"var(--teal)":"var(--text3)" }} aria-hidden="true" />
                <span style={{ fontSize:13, color:cfg.active?"var(--text)":"var(--text3)" }}>{DEFAULT_TYPES[key]?.label||key}</span>
                {cfg.active ? <Badge color={DEFAULT_TYPES[key]?.color||"teal"} small>Aktiv</Badge> : <span style={{ fontSize:11, color:"var(--text3)" }}>Inaktiv</span>}
                {cfg.active&&(cfg.extraCriteria||[]).length>0&&<span style={{ fontSize:11, color:"var(--text3)" }}>+ {cfg.extraCriteria.length} Zusatz</span>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── HANDBOOK ───────────────────────────────────────────────────────────────
function HandbookSection({ handbook, setHandbook, triggers, setTriggers }) {
  const [open,setOpen] = useState(null);
  const [editMode,setEditMode] = useState(false);
  const [newStep,setNewStep] = useState("");
  const [newPhase,setNewPhase] = useState("");
  const COLORS=["teal","blue","purple","orange","green","red","gray"];
  const ICONS=["ti-clipboard-list","ti-phone-call","ti-ticket","ti-messages","ti-writing","ti-target","ti-star","ti-search","ti-users","ti-chart-bar"];
  const upd=(id,p)=>setHandbook(handbook.map((h)=>h.id===id?{...h,...p}:h));
  const addStep=(id,s)=>{ if(!s.trim()) return; const h=handbook.find((x)=>x.id===id); if(h) upd(id,{steps:[...h.steps,s.trim()]}); };
  const rmStep=(id,i)=>{ const h=handbook.find((x)=>x.id===id); if(h) upd(id,{steps:h.steps.filter((_,j)=>j!==i)}); };
  const edStep=(id,i,v)=>{ const h=handbook.find((x)=>x.id===id); if(h){ const s=[...h.steps]; s[i]=v; upd(id,{steps:s}); } };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <p style={{ fontSize:14, color:"var(--text2)" }}>QM-Ablaufplan · bearbeitbar</p>
        {isAdmin && <button onClick={()=>setEditMode(!editMode)} style={{ background:editMode?"rgba(43,191,191,0.15)":"var(--bg3)", borderColor:editMode?"var(--teal)":"var(--border)", color:editMode?"var(--teal)":"var(--text2)", display:"flex", alignItems:"center", gap:6 }}>
          <i className={`ti ${editMode?"ti-check":"ti-edit"}`} aria-hidden="true" />{editMode?"Fertig":"Bearbeiten"}
        </button>}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {handbook.map((s,i)=>{
          const isOpen=open===i;
          return (
            <div key={s.id} style={{ border:`0.5px solid ${isOpen?COLOR_MAP[s.color]||"var(--teal)":"var(--border)"}`, borderRadius:10, overflow:"hidden" }}>
              <div style={{ display:"flex", alignItems:"center", background:isOpen?BG_MAP[s.color]||"var(--bg3)":"var(--bg2)" }}>
                <button onClick={()=>setOpen(isOpen?null:i)} style={{ flex:1, background:"none", border:"none", borderRadius:0, display:"flex", alignItems:"center", gap:10, padding:"11px 14px", color:"var(--text)", justifyContent:"flex-start" }}>
                  <span style={{ width:28, height:28, borderRadius:7, background:BG_MAP[s.color]||"var(--bg3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <i className={`ti ${s.icon}`} style={{ fontSize:14, color:COLOR_MAP[s.color]||"var(--teal)" }} aria-hidden="true" />
                  </span>
                  {editMode&&isAdmin ? <input value={s.phase} onChange={(e)=>upd(s.id,{phase:e.target.value})} onClick={(ev)=>ev.stopPropagation()} style={{ flex:1, fontWeight:500 }} /> : <span style={{ flex:1, fontSize:14, fontWeight:500 }}>{s.phase}</span>}
                  <i className={`ti ti-chevron-${isOpen?"up":"down"}`} style={{ fontSize:13, color:"var(--text3)" }} aria-hidden="true" />
                </button>
                {editMode&&isAdmin&&(
                  <div style={{ display:"flex", gap:4, paddingRight:10 }}>
                    <select value={s.color} onChange={(e)=>upd(s.id,{color:e.target.value})} style={{ width:75, fontSize:11, padding:"3px 6px" }}>{COLORS.map((c)=><option key={c} value={c}>{c}</option>)}</select>
                    <select value={s.icon} onChange={(e)=>upd(s.id,{icon:e.target.value})} style={{ width:90, fontSize:11, padding:"3px 6px" }}>{ICONS.map((ic)=><option key={ic} value={ic}>{ic.replace("ti-","")}</option>)}</select>
                    <button onClick={()=>setHandbook(handbook.filter((h)=>h.id!==s.id))} style={{ color:"var(--red)", padding:"3px 8px", fontSize:12 }} aria-label="löschen"><i className="ti ti-trash" style={{ fontSize:11 }} /></button>
                  </div>
                )}
              </div>
              {isOpen&&(
                <div style={{ padding:"10px 14px 14px 52px", background:"var(--bg2)" }}>
                  <ol style={{ paddingLeft:18, display:"flex", flexDirection:"column", gap:7 }}>
                    {s.steps.map((step,j)=>(
                      <li key={j} style={{ fontSize:13, color:"var(--text2)", lineHeight:1.6, display:"flex", alignItems:"center", gap:8 }}>
                        {editMode ? (<><input value={step} onChange={(e)=>edStep(s.id,j,e.target.value)} style={{ flex:1 }} /><button onClick={()=>rmStep(s.id,j)} style={{ background:"none", border:"none", color:"var(--red)", padding:"1px 5px" }}><i className="ti ti-x" style={{ fontSize:11 }} /></button></>) : step}
                      </li>
                    ))}
                  </ol>
                  {editMode&&isAdmin&&(<div style={{ display:"flex", gap:8, marginTop:8 }}><input value={newStep} onChange={(e)=>setNewStep(e.target.value)} onKeyDown={(e)=>{ if(e.key==="Enter"){addStep(s.id,newStep);setNewStep("");} }} placeholder="Neuer Schritt..." /><button onClick={()=>{addStep(s.id,newStep);setNewStep("");}}>+ Schritt</button></div>)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {editMode&&isAdmin&&(<div style={{ display:"flex", gap:8, marginTop:10 }}><input value={newPhase} onChange={(e)=>setNewPhase(e.target.value)} onKeyDown={(e)=>{ if(e.key==="Enter"&&newPhase.trim()){setHandbook([...handbook,{id:Date.now(),phase:newPhase.trim(),icon:"ti-star",color:"teal",steps:[]}]);setNewPhase("");} }} placeholder="Neue Phase..." /><button onClick={()=>{ if(newPhase.trim()){setHandbook([...handbook,{id:Date.now(),phase:newPhase.trim(),icon:"ti-star",color:"teal",steps:[]}]);setNewPhase("");} }}>+ Phase</button></div>)}
      <div style={{ marginTop:18, padding:"14px 16px", background:"var(--bg3)", borderRadius:10, border:"0.5px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
          <p style={{ fontSize:13, fontWeight:500, color:"var(--orange)", margin:0 }}>Trigger-Schwellenwerte</p>
          {isAdmin && <button onClick={()=>setTriggers([...triggers,{label:"Neuer Trigger",color:"orange",action:"Maßnahme"}])} style={{ fontSize:11, padding:"3px 10px", color:"var(--orange)", borderColor:"rgba(245,166,35,0.3)" }}>+ Trigger</button>}
        </div>
        {isAdmin && <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:10 }}>
          {(triggers||[]).map((t,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <input value={t.label} onChange={(e)=>{ const tr=[...triggers]; tr[i]={...tr[i],label:e.target.value}; setTriggers(tr); }} style={{ width:180, fontSize:12, padding:"3px 8px" }} />
              <select value={t.color} onChange={(e)=>{ const tr=[...triggers]; tr[i]={...tr[i],color:e.target.value}; setTriggers(tr); }} style={{ width:80, fontSize:11, padding:"3px 6px" }}>
                {["red","orange","teal","blue","purple","green","gray"].map((c)=><option key={c} value={c}>{c}</option>)}
              </select>
              <span style={{ fontSize:12, color:"var(--text3)" }}>→</span>
              <input value={t.action} onChange={(e)=>{ const tr=[...triggers]; tr[i]={...tr[i],action:e.target.value}; setTriggers(tr); }} style={{ flex:1, fontSize:12, padding:"3px 8px" }} />
              <button onClick={()=>setTriggers(triggers.filter((_,j)=>j!==i))} style={{ background:"none", border:"none", color:"var(--red)", padding:"2px 6px" }}><i className="ti ti-x" style={{ fontSize:12 }} /></button>
            </div>
          ))}
        </div>}
        <div style={{ marginTop:10, display:"flex", flexWrap:"wrap", gap:6 }}>
          {(triggers||[]).map((t,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
              <Badge color={t.color} small>{t.label}</Badge>
              <span style={{ fontSize:11, color:"var(--text3)" }}>{t.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SETTINGS PANEL ─────────────────────────────────────────────────────────
function SettingsPanel({ projects, setProjects, onClose }) {
  const [editing,setEditing] = useState(null);
  const [newName,setNewName] = useState("");
  const [newQM,setNewQM] = useState("");
  const [newTopic,setNewTopic] = useState("");
  const addP=()=>{ if(!newName.trim()) return; setProjects([...projects,{ id:Date.now(), name:newName.trim(), qms:[], topics:[], monitoringTypes:{ call:{active:true,extraCriteria:[]}, ticket:{active:true,extraCriteria:[]}, mail:{active:false,extraCriteria:[]}, chat:{active:false,extraCriteria:[]} }, steckbrief:{...DEFAULT_STECKBRIEF} }]); setNewName(""); };
  const delP=(id)=>setProjects(projects.filter((p)=>p.id!==id));
  const updP=(id,patch)=>setProjects(projects.map((p)=>p.id===id?{...p,...patch}:p));
  const ep=editing?projects.find((p)=>p.id===editing):null;

  return (
    <div style={{ background:"var(--bg2)", border:"0.5px solid var(--border)", borderRadius:12, padding:"16px 18px", marginBottom:16 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <p style={{ fontSize:15, fontWeight:500, color:"var(--teal)" }}>Projekte & Typen verwalten</p>
        <button onClick={onClose} style={{ background:"none", border:"none", color:"var(--text2)" }} aria-label="Schließen"><i className="ti ti-x" style={{ fontSize:18 }} aria-hidden="true" /></button>
      </div>
      {!editing ? (
        <>
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:14 }}>
            {projects.map((p)=>{
              const activeT=Object.entries(p.monitoringTypes||{}).filter(([,c])=>c.active).map(([k])=>DEFAULT_TYPES[k]?.label||k);
              return (
                <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"var(--bg3)", borderRadius:8, border:"0.5px solid var(--border)" }}>
                  <div style={{ flex:1 }}>
                    <span style={{ fontSize:14, fontWeight:500, color:"var(--text)" }}>{p.name}</span>
                    <span style={{ fontSize:12, color:"var(--text3)", marginLeft:10 }}>{p.qms.length} QMs · {activeT.join(", ")||"keine Typen"}</span>
                  </div>
                  <button onClick={()=>setEditing(p.id)} style={{ fontSize:12 }}><i className="ti ti-edit" style={{ fontSize:12, marginRight:4 }} />Bearbeiten</button>
                  <button onClick={()=>delP(p.id)} style={{ color:"var(--red)", fontSize:12 }} aria-label="löschen"><i className="ti ti-trash" style={{ fontSize:12 }} /></button>
                </div>
              );
            })}
          </div>
          <div style={{ display:"flex", gap:8 }}><input value={newName} onChange={(e)=>setNewName(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&addP()} placeholder="Neues Projekt..." /><button onClick={addP} style={{ flexShrink:0 }}>+ Hinzufügen</button></div>
        </>
      ) : ep ? (
        <>
          <button onClick={()=>setEditing(null)} style={{ background:"none", border:"none", color:"var(--text2)", display:"flex", alignItems:"center", gap:6, marginBottom:14 }}><i className="ti ti-arrow-left" style={{ fontSize:14 }} />Zurück</button>
          <div style={{ marginBottom:12 }}><label style={{ fontSize:12, color:"var(--text3)", display:"block", marginBottom:4 }}>Projektname</label><input value={ep.name} onChange={(e)=>updP(ep.id,{name:e.target.value})} /></div>
          <div style={{ marginBottom:14 }}>
            <p style={{ fontSize:13, fontWeight:500, color:"var(--text)", marginBottom:8 }}>QMs / Coaches</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:8 }}>{ep.qms.map((q)=>(<span key={q} style={{ display:"flex", alignItems:"center", gap:4, background:"rgba(43,191,191,0.12)", color:"var(--teal)", fontSize:13, padding:"4px 10px", borderRadius:6 }}>{q}<button onClick={()=>updP(ep.id,{qms:ep.qms.filter((x)=>x!==q)})} style={{ background:"none", border:"none", color:"var(--teal)", padding:0 }}><i className="ti ti-x" style={{ fontSize:11 }} /></button></span>))}</div>
            <div style={{ display:"flex", gap:8 }}><input value={newQM} onChange={(e)=>setNewQM(e.target.value)} onKeyDown={(e)=>{ if(e.key==="Enter"&&newQM.trim()){updP(ep.id,{qms:[...ep.qms,newQM.trim()]});setNewQM("");} }} placeholder="QM-Name..." /><button onClick={()=>{ if(newQM.trim()){updP(ep.id,{qms:[...ep.qms,newQM.trim()]});setNewQM("");} }}>+</button></div>
          </div>
          <div style={{ marginBottom:14 }}>
            <p style={{ fontSize:13, fontWeight:500, color:"var(--text)", marginBottom:8 }}>Coaching-Themen</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:8 }}>{ep.topics.map((t)=>(<span key={t} style={{ display:"flex", alignItems:"center", gap:4, background:"var(--bg4)", color:"var(--text2)", fontSize:13, padding:"4px 10px", borderRadius:6 }}>{t}<button onClick={()=>updP(ep.id,{topics:ep.topics.filter((x)=>x!==t)})} style={{ background:"none", border:"none", color:"var(--text3)", padding:0 }}><i className="ti ti-x" style={{ fontSize:11 }} /></button></span>))}</div>
            <div style={{ display:"flex", gap:8 }}><input value={newTopic} onChange={(e)=>setNewTopic(e.target.value)} onKeyDown={(e)=>{ if(e.key==="Enter"&&newTopic.trim()){updP(ep.id,{topics:[...ep.topics,newTopic.trim()]});setNewTopic("");} }} placeholder="Neues Thema..." /><button onClick={()=>{ if(newTopic.trim()){updP(ep.id,{topics:[...ep.topics,newTopic.trim()]});setNewTopic("");} }}>+</button></div>
          </div>
          <TypeConfigurator project={ep} onUpdate={(patch)=>updP(ep.id,patch)} />
        </>
      ) : null}
    </div>
  );
}

// ── ROOT ───────────────────────────────────────────────────────────────────
export default function QMTool() {
  const { role, isAdmin, isLoggedIn, login, loginUser, logout } = useAuth();
  const initial = loadState();
  const [projects,setProjects] = useState(initial.projects);
  const [activeProjectId,setActiveProjectId] = useState(initial.activeProjectId);
  const [section,setSection] = useState("overview");
  const [showSettings,setShowSettings] = useState(false);
  const [monitorings,setMonitorings] = useState(initial.monitorings||{});
  const [coachings,setCoachings] = useState(initial.coachings||{});
  const [handbook,setHandbook] = useState(initial.handbook||DEFAULT_HANDBOOK);
  const [triggers,setTriggers] = useState(initial.triggers||DEFAULT_TRIGGERS);

  const activeProject = projects.find((p)=>p.id===activeProjectId)||projects[0];
  useEffect(()=>{ saveState({projects,activeProjectId,monitorings,coachings,handbook,triggers}); },[projects,activeProjectId,monitorings,coachings,handbook,triggers]);

  const getSaved=(id)=>monitorings[id]||[];
  const setSaved=(id,val)=>setMonitorings((prev)=>({...prev,[id]:Array.isArray(val)?val:val(getSaved(id))}));
  const getEntries=(id)=>coachings[id]||[];
  const setEntries=(id,val)=>setCoachings((prev)=>({...prev,[id]:Array.isArray(val)?val:val(getEntries(id))}));

  const tabs=[{key:"overview",label:"Übersicht"},{key:"steckbrief",label:"Projektsteckbrief"},{key:"handbook",label:"Handbuch & Ablauf"},{key:"monitoring",label:"Monitoring-Formular"},{key:"coaching",label:"Coaching-Dokumentation"}];

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", paddingBottom:60 }}>
      <InjectTheme />
      {!isLoggedIn && <LoginScreen onLogin={login} onEnterAsUser={loginUser} />}
      {isLoggedIn && <>
      <div style={{ background:"var(--bg2)", borderBottom:"0.5px solid var(--border)", padding:"13px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:"rgba(43,191,191,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <i className="ti ti-shield-check" style={{ fontSize:15, color:"var(--teal)" }} aria-hidden="true" />
          </div>
          <div>
            <p style={{ fontSize:15, fontWeight:600, color:"var(--teal)", margin:0 }}>QM-Arbeitsmappe</p>
            <p style={{ fontSize:11, color:"var(--text3)", margin:0 }}>Hey Contact Heroes · Qualitätsmanagement</p>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <RoleBadge role={role} onLogout={logout} />
          {isAdmin && <button onClick={()=>setShowSettings(!showSettings)} style={{ background:showSettings?"rgba(43,191,191,0.15)":"var(--bg3)", borderColor:showSettings?"var(--teal)":"var(--border)", color:showSettings?"var(--teal)":"var(--text2)", display:"flex", alignItems:"center", gap:6 }}>
            <i className="ti ti-settings" style={{ fontSize:14 }} aria-hidden="true" />Projekte bearbeiten
          </button>}
        </div>
      </div>

      <div style={{ padding:"18px 28px" }}>
        {showSettings&&<SettingsPanel projects={projects} setProjects={setProjects} onClose={()=>setShowSettings(false)} />}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
          {projects.map((p)=>{
            const total=(monitorings[p.id]?.length||0)+(coachings[p.id]?.length||0);
            const isActive=activeProject&&activeProject.id===p.id;
            return (
              <button key={p.id} onClick={()=>{ setActiveProjectId(p.id); setSection("overview"); }} style={{ padding:"5px 14px", background:isActive?"rgba(43,191,191,0.12)":"var(--bg2)", borderColor:isActive?"var(--teal)":"var(--border)", color:isActive?"var(--teal)":"var(--text2)", fontWeight:isActive?500:400 }}>
                {p.name}{total>0&&<span style={{ marginLeft:5, fontSize:11, background:"rgba(43,191,191,0.15)", color:"var(--teal)", padding:"1px 5px", borderRadius:10 }}>{total}</span>}
              </button>
            );
          })}
        </div>
        {activeProject&&(
          <div style={{ background:"var(--bg2)", border:"0.5px solid var(--border)", borderRadius:12, padding:"16px 20px" }}>
            <TabBar tabs={tabs} active={section} onChange={setSection} />
            {section==="overview"&&<OverviewSection project={activeProject} monitorings={monitorings} coachings={coachings} projects={projects} />}
            {section==="steckbrief"&&<SteckbriefSection project={activeProject} onUpdate={(patch)=>setProjects(projects.map((p)=>p.id===activeProject.id?{...p,...patch}:p))} isAdmin={isAdmin} />}
            {section==="handbook"&&<HandbookSection handbook={handbook} setHandbook={setHandbook} triggers={triggers} setTriggers={setTriggers} isAdmin={isAdmin} />}
            {section==="monitoring"&&<MonitoringForm saved={getSaved(activeProject.id)} setSaved={(val)=>setSaved(activeProject.id,val)} projects={projects} />}
            {section==="coaching"&&<CoachingDoc project={activeProject} entries={getEntries(activeProject.id)} setEntries={(val)=>setEntries(activeProject.id,val)} projects={projects} />}
          </div>
        )}
      </div>
    </>}
    </div>
  );
}
