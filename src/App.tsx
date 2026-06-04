// @ts-nocheck
import { useState, useEffect } from "react";

const DARK_THEME = `
  :root {
    --color-background-primary: #1a1a2e;
    --color-background-secondary: #252538;
    --color-background-tertiary: #0f0f1e;
    --color-text-primary: #f0eefc;
    --color-text-secondary: #9896b0;
    --color-text-tertiary: #6a6880;
    --color-border-tertiary: rgba(43,191,191,0.12);
    --color-border-secondary: rgba(43,191,191,0.22);
    --color-border-primary: rgba(43,191,191,0.35);
    --hch-teal: #2BBFBF;
    --hch-orange: #F5A623;
    --hch-purple: #7B4FA6;
    --hch-blue: #2E86AB;
    --hch-dark: #4A4A4A;
    --font-sans: system-ui, -apple-system, sans-serif;
  }
  body {
    background: #0f0f1e;
    color: #f0eefc;
    margin: 0;
    font-family: system-ui, -apple-system, sans-serif;
  }
  input, select, textarea {
    background: #252538 !important;
    color: #f0eefc !important;
    border: 0.5px solid rgba(43,191,191,0.2) !important;
    border-radius: 8px;
    padding: 8px 12px;
    font-family: system-ui, -apple-system, sans-serif;
    outline: none;
  }
  input:focus, select:focus, textarea:focus {
    border-color: #2BBFBF !important;
    box-shadow: 0 0 0 2px rgba(43,191,191,0.15) !important;
  }
  button {
    background: #252538 !important;
    color: #f0eefc !important;
    border: 0.5px solid rgba(43,191,191,0.2) !important;
    border-radius: 8px;
    padding: 8px 14px;
    cursor: pointer;
    font-family: system-ui, -apple-system, sans-serif;
    transition: all 0.15s ease;
  }
  button:hover { border-color: #2BBFBF !important; color: #2BBFBF !important; }
  input::placeholder, textarea::placeholder { color: #6a6880 !important; }
  select option { background: #252538; color: #f0eefc; }
  * { box-sizing: border-box; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #0f0f1e; }
  ::-webkit-scrollbar-thumb { background: #2BBFBF; border-radius: 3px; }
`;

function InjectTheme() {
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "qm-dark-theme";
    style.textContent = DARK_THEME;
    if (!document.getElementById("qm-dark-theme")) document.head.appendChild(style);
    return () => { const el = document.getElementById("qm-dark-theme"); if (el) el.remove(); };
  }, []);
  return null;
}

const STORAGE_KEY = "qm_arbeitsmappe_v2";

const DEFAULT_PROJECTS = [
  { id: 1, name: "JSMD", qms: ["Betül", "Christian"], topics: ["AHT", "Fehlbearbeitung", "Callbesprechung", "Ticketbearbeitung", "Wording", "Bewertungsrate", "Prozess", "Speedtalk", "Silent Monitoring", "Side-by-Side", "Ticketupskill", "Schulung"] },
  { id: 2, name: "Shop24", qms: ["Betül", "Nadine"], topics: ["Callauswertung", "Fehlbearbeitung", "Wording", "Bestellaufnahme", "Speedtalk"] },
  { id: 3, name: "Fairafric", qms: ["Betül"], topics: ["Ticketbearbeitung", "Schulung", "Side-by-Side", "Speedtalk"] },
  { id: 4, name: "Blending", qms: ["Betül", "Christian", "Nadine"], topics: ["KVH", "Datenschutz", "AHT/NBZ", "Einwandbehandlung", "Begrüßung"] },
];

const DEFAULT_HANDBOOK = [
  { id: 1, phase: "1 · Vorbereitung", icon: "ti-clipboard-list", color: "purple", steps: ["Monitoringplan für die Woche erstellen (Prio 1 & 2 MA)", "Dialfire / Freshdesk öffnen – Calls & Tickets vorauswählen", "KPI-Daten des MA aus der Performanceliste ziehen (AHT, FCR, CSAT, Bewertungsrate)", "Letzte Coaching-Notiz lesen – gibt es offene Zielvereinbarungen?", "5 Calls + 5 Tickets pro MA vorbereiten (gemäß Monitoring-Formular)"] },
  { id: 2, phase: "2 · Auswertung Calls", icon: "ti-phone-call", color: "blue", steps: ["Calls einzeln abhören – Bewertungsformular ausfüllen", "Punkte notieren: Begrüßung, Datenschutz, Servicefragen, Verkauf, AHT/NBZ", "Call-IDs dokumentieren – direkte Verlinkung in Dokumentation", "Auffälligkeiten markieren: Fehlbearbeitung, Datenschutzverstoß, besonders positive Calls", "Bei < 75 % → automatisch als Coaching-Trigger markieren"] },
  { id: 3, phase: "3 · Auswertung Tickets", icon: "ti-ticket", color: "teal", steps: ["Tickets auf korrekte Rekategorisierung prüfen", "Wording / Rechtschreibung bewerten", "Prozesseinhaltung: richtige TBS, Kontakteintrag, Gruppe", "Ticket-AHT prüfen (Ziel < 6 Min)", "Fehlbearbeitungen mit Link in Dokumentation festhalten"] },
  { id: 4, phase: "4 · Feedback & Coaching", icon: "ti-messages", color: "amber", steps: ["Gesprächstermin mit MA vereinbaren (15–30 Min)", "Positives zuerst – mindestens 1 starkes Beispiel nennen", "Konkrete Fehlbearbeitung mit Call-ID / Ticket-ID zeigen", "Wording-Hilfe & Prozesserklärung (wo nötig Side-by-Side)", "Zielvereinbarung dokumentieren – nächsten Check-in Termin festlegen"] },
  { id: 5, phase: "5 · Dokumentation", icon: "ti-writing", color: "coral", steps: ["Coaching-Dokumentation im Maßnahmenblatt ausfüllen (Datum, Von, Bis, Thema)", "Ziel / Anmerkung konkret und messbar formulieren", "Fehlbearbeitungen mit FD-Link oder Call-ID hinterlegen", "Monitoring-Ergebnis in Monitoring-Sheet eintragen", "Eskalation an TL wenn nach 2 Coachings keine Verbesserung erkennbar"] },
];

const DEFAULT_STATE = { projects: DEFAULT_PROJECTS, activeProjectId: 1, monitorings: {}, coachings: {}, handbook: DEFAULT_HANDBOOK };

function loadState() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) }; } catch (e) {}
  return DEFAULT_STATE;
}
function saveState(state) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {} }

const CRITERIA_CALLS = [
  { key: "greeting", label: "Begrüßung / Name" }, { key: "hotline", label: "Korrekter Hotline-Name" },
  { key: "customer_name", label: "Namentliche Ansprache KD" }, { key: "politeness", label: "Höflichkeit (Bitte/Danke)" },
  { key: "empathy", label: "Empathie" }, { key: "goodbye", label: "Verabschiedung" },
  { key: "data_capture", label: "Korrekte Datenaufnahme" }, { key: "privacy", label: "Datenschutz eingehalten" },
  { key: "process", label: "Prozesseinhaltung" }, { key: "service_q", label: "Servicefragen gestellt" },
  { key: "sales", label: "Verkauf / KVH angesprochen" },
];

const CRITERIA_TICKETS = [
  { key: "categorization", label: "Rekategorisierung korrekt" }, { key: "wording", label: "Wording / Rechtschreibung" },
  { key: "process", label: "Prozesseinhaltung" }, { key: "contact_entry", label: "Kontakteintrag vorhanden" },
  { key: "aht", label: "Ticket-AHT < 6 Min" },
];

const GOALS_LIBRARY = [
  "Bewertungsrate auf mind. 35 % steigern", "AHT Call unter Ziel-AHT senken",
  "Servicefragen in ≥ 80 % der Calls ansprechen", "Ticket-AHT unter 6 Min bringen",
  "Datenschutzprotokoll lückenlos einhalten", "Fehlbearbeitungsrate auf 0 % in Folgewoche",
  "FCR auf mind. 90 % steigern", "Verkauf / KVH in mind. 30 % der qualifizierten Calls anbieten",
];

const TOPIC_COLORS = { AHT: "amber", Fehlbearbeitung: "red", Callbesprechung: "blue", Callauswertung: "blue", Ticketbearbeitung: "teal", Ticketupskill: "teal", Wording: "purple", Schulung: "green", "Silent Monitoring": "coral", "Side-by-Side": "coral", Speedtalk: "gray", KVH: "teal", Datenschutz: "red" };
const PHASE_COLORS = ["purple", "blue", "teal", "amber", "coral", "green", "gray"];
const PHASE_ICONS = ["ti-clipboard-list", "ti-phone-call", "ti-ticket", "ti-messages", "ti-writing", "ti-target", "ti-star", "ti-check"];

function downloadCSV(filename, rows) {
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = rows.map((r) => r.map(escape).join(";")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a");
  a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}

function Badge({ color, children }) {
  const colors = { purple: { bg: "rgba(123,79,166,0.15)", text: "#c49fe8" }, blue: { bg: "rgba(43,191,191,0.12)", text: "#2BBFBF" }, teal: { bg: "rgba(43,191,191,0.12)", text: "#2BBFBF" }, amber: { bg: "rgba(245,166,35,0.15)", text: "#F5A623" }, coral: { bg: "rgba(224,85,85,0.15)", text: "#e07070" }, green: { bg: "rgba(43,191,140,0.15)", text: "#2bbf8c" }, red: { bg: "rgba(224,85,85,0.15)", text: "#e07070" }, gray: { bg: "rgba(255,255,255,0.07)", text: "#9896b0" } };
  const c = colors[color] || colors.gray;
  return <span style={{ background: c.bg, color: c.text, fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 6, whiteSpace: "nowrap" }}>{children}</span>;
}

function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4, borderBottom: "0.5px solid var(--color-border-tertiary, #ddd)", marginBottom: 20 }}>
      {tabs.map((t) => (
        <button key={t.key} onClick={() => onChange(t.key)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 14px", fontSize: 14, fontWeight: active === t.key ? 500 : 400, color: active === t.key ? "#2BBFBF" : "var(--color-text-secondary, #9896b0)", borderBottom: active === t.key ? "2px solid #2BBFBF" : "2px solid transparent", marginBottom: -1 }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

function SettingsPanel({ projects, setProjects, onClose }) {
  const [editingProject, setEditingProject] = useState(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newQM, setNewQM] = useState("");
  const [newTopic, setNewTopic] = useState("");

  const addProject = () => { if (!newProjectName.trim()) return; setProjects([...projects, { id: Date.now(), name: newProjectName.trim(), qms: [], topics: [] }]); setNewProjectName(""); };
  const deleteProject = (id) => setProjects(projects.filter((p) => p.id !== id));
  const updateProject = (id, patch) => setProjects(projects.map((p) => p.id === id ? { ...p, ...patch } : p));
  const addQM = (id) => { if (!newQM.trim()) return; const proj = projects.find((p) => p.id === id); if (proj && !proj.qms.includes(newQM.trim())) updateProject(id, { qms: [...proj.qms, newQM.trim()] }); setNewQM(""); };
  const removeQM = (id, qm) => { const proj = projects.find((p) => p.id === id); if (proj) updateProject(id, { qms: proj.qms.filter((q) => q !== qm) }); };
  const addTopic = (id) => { if (!newTopic.trim()) return; const proj = projects.find((p) => p.id === id); if (proj && !proj.topics.includes(newTopic.trim())) updateProject(id, { topics: [...proj.topics, newTopic.trim()] }); setNewTopic(""); };
  const removeTopic = (id, topic) => { const proj = projects.find((p) => p.id === id); if (proj) updateProject(id, { topics: proj.topics.filter((t) => t !== topic) }); };
  const ep = editingProject ? projects.find((p) => p.id === editingProject) : null;

  return (
    <div style={{ background: "var(--color-background-primary, #fff)", border: "0.5px solid var(--color-border-tertiary, #ddd)", borderRadius: 12, padding: "16px 18px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <p style={{ fontSize: 15, fontWeight: 500, margin: 0, color: "var(--color-text-primary, #111)" }}>Projekte & QMs verwalten</p>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }} aria-label="Schließen"><i className="ti ti-x" style={{ fontSize: 18, color: "var(--color-text-secondary, #666)" }} aria-hidden="true" /></button>
      </div>
      {!editingProject ? (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {projects.map((p) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--color-background-secondary, #f5f5f5)", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary, #ddd)" }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary, #111)" }}>{p.name}</span>
                  <span style={{ fontSize: 12, color: "var(--color-text-secondary, #666)", marginLeft: 10 }}>{p.qms.length} QMs · {p.topics.length} Themen</span>
                </div>
                <button onClick={() => setEditingProject(p.id)} style={{ padding: "4px 12px", fontSize: 12, cursor: "pointer", borderRadius: 6, border: "0.5px solid var(--color-border-tertiary, #ddd)", background: "var(--color-background-primary, #fff)", color: "var(--color-text-secondary, #666)" }}><i className="ti ti-edit" style={{ fontSize: 13, marginRight: 4 }} aria-hidden="true" />Bearbeiten</button>
                <button onClick={() => deleteProject(p.id)} style={{ padding: "4px 8px", fontSize: 12, cursor: "pointer", borderRadius: 6, border: "0.5px solid var(--color-border-tertiary, #ddd)", background: "var(--color-background-primary, #fff)", color: "#e05555" }} aria-label="löschen"><i className="ti ti-trash" style={{ fontSize: 13 }} aria-hidden="true" /></button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addProject()} placeholder="Neues Projekt..." style={{ flex: 1 }} />
            <button onClick={addProject} style={{ padding: "0 16px", cursor: "pointer" }}><i className="ti ti-plus" style={{ fontSize: 14, marginRight: 4 }} aria-hidden="true" />Hinzufügen</button>
          </div>
        </>
      ) : ep ? (
        <>
          <button onClick={() => setEditingProject(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 0 12px", fontSize: 13, color: "var(--color-text-secondary, #666)", display: "flex", alignItems: "center", gap: 6 }}><i className="ti ti-arrow-left" style={{ fontSize: 14 }} aria-hidden="true" />Zurück</button>
          <div style={{ marginBottom: 14 }}><label style={{ fontSize: 12, color: "var(--color-text-secondary, #666)", display: "block", marginBottom: 4 }}>Projektname</label><input value={ep.name} onChange={(e) => updateProject(ep.id, { name: e.target.value })} style={{ width: "100%", boxSizing: "border-box" }} /></div>
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 8, color: "var(--color-text-primary, #111)" }}>QMs / Coaches</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>{ep.qms.map((q) => (<span key={q} style={{ display: "flex", alignItems: "center", gap: 4, background: "#E6F1FB", color: "#0C447C", fontSize: 13, padding: "4px 10px", borderRadius: 6 }}>{q}<button onClick={() => removeQM(ep.id, q)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1, color: "#2E86AB" }} aria-label="entfernen"><i className="ti ti-x" style={{ fontSize: 11 }} aria-hidden="true" /></button></span>))}</div>
            <div style={{ display: "flex", gap: 8 }}><input value={newQM} onChange={(e) => setNewQM(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addQM(ep.id)} placeholder="QM-Name..." style={{ flex: 1 }} /><button onClick={() => addQM(ep.id)} style={{ padding: "0 14px", cursor: "pointer", fontSize: 13 }}>Hinzufügen</button></div>
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 8, color: "var(--color-text-primary, #111)" }}>Coaching-Themen</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>{ep.topics.map((t) => (<span key={t} style={{ display: "flex", alignItems: "center", gap: 4, background: "#F1EFE8", color: "#444441", fontSize: 13, padding: "4px 10px", borderRadius: 6 }}>{t}<button onClick={() => removeTopic(ep.id, t)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1, color: "#5F5E5A" }} aria-label="entfernen"><i className="ti ti-x" style={{ fontSize: 11 }} aria-hidden="true" /></button></span>))}</div>
            <div style={{ display: "flex", gap: 8 }}><input value={newTopic} onChange={(e) => setNewTopic(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTopic(ep.id)} placeholder="Neues Thema..." style={{ flex: 1 }} /><button onClick={() => addTopic(ep.id)} style={{ padding: "0 14px", cursor: "pointer", fontSize: 13 }}>Hinzufügen</button></div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function HandbookSection({ handbook, setHandbook }) {
  const [open, setOpen] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
  const [newStep, setNewStep] = useState("");
  const [newPhaseName, setNewPhaseName] = useState("");

  const colorMap = { purple: "#534AB7", blue: "#2E86AB", teal: "#2BBFBF", amber: "#F5A623", coral: "#993C1D", green: "#3B6D11", gray: "#5F5E5A" };
  const bgMap = { purple: "rgba(123,79,166,0.15)", blue: "rgba(46,134,171,0.15)", teal: "rgba(43,191,191,0.15)", amber: "rgba(245,166,35,0.15)", coral: "rgba(224,85,85,0.15)", green: "rgba(43,191,140,0.15)", gray: "rgba(255,255,255,0.07)" };

  const updatePhase = (id, patch) => setHandbook(handbook.map((h) => h.id === id ? { ...h, ...patch } : h));
  const deletePhase = (id) => setHandbook(handbook.filter((h) => h.id !== id));
  const addStep = (id) => { if (!newStep.trim()) return; const ph = handbook.find((h) => h.id === id); if (ph) updatePhase(id, { steps: [...ph.steps, newStep.trim()] }); setNewStep(""); };
  const removeStep = (id, idx) => { const ph = handbook.find((h) => h.id === id); if (ph) updatePhase(id, { steps: ph.steps.filter((_, i) => i !== idx) }); };
  const editStep = (id, idx, val) => { const ph = handbook.find((h) => h.id === id); if (ph) { const steps = [...ph.steps]; steps[idx] = val; updatePhase(id, { steps }); } };
  const addPhase = () => { if (!newPhaseName.trim()) return; setHandbook([...handbook, { id: Date.now(), phase: newPhaseName.trim(), icon: "ti-star", color: "blue", steps: [] }]); setNewPhaseName(""); };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary, #666)", margin: 0 }}>Ablaufplan für den gesamten QM-Zyklus.</p>
        <button onClick={() => setEditMode(!editMode)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", fontSize: 12, cursor: "pointer", borderRadius: 7, border: "0.5px solid var(--color-border-secondary, #ccc)", background: editMode ? "#E6F1FB" : "var(--color-background-primary, #fff)", color: editMode ? "#0C447C" : "var(--color-text-secondary, #666)", fontWeight: editMode ? 500 : 400 }}>
          <i className={`ti ${editMode ? "ti-check" : "ti-edit"}`} style={{ fontSize: 13 }} aria-hidden="true" />{editMode ? "Fertig" : "Handbuch bearbeiten"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {handbook.map((s, i) => {
          const isOpen = open === i;
          const isEditing = editingPhase === s.id;
          return (
            <div key={s.id} style={{ border: "0.5px solid var(--color-border-tertiary, #ddd)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", width: "100%", background: isOpen ? bgMap[s.color] || "#f5f5f5" : "var(--color-background-primary, #fff)" }}>
                <button onClick={() => setOpen(isOpen ? null : i)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                  <span style={{ width: 32, height: 32, borderRadius: 8, background: bgMap[s.color] || "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><i className={`ti ${s.icon}`} style={{ fontSize: 16, color: colorMap[s.color] || "#666" }} aria-hidden="true" /></span>
                  {editMode && isEditing ? (
                    <input value={s.phase} onChange={(e) => updatePhase(s.id, { phase: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ flex: 1, fontSize: 14, fontWeight: 500 }} />
                  ) : (
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "var(--color-text-primary, #111)" }}>{s.phase}</span>
                  )}
                  <i className={`ti ti-chevron-${isOpen ? "up" : "down"}`} style={{ fontSize: 16, color: "var(--color-text-secondary, #666)" }} aria-hidden="true" />
                </button>
                {editMode && (
                  <div style={{ display: "flex", gap: 4, paddingRight: 12 }}>
                    <button onClick={() => setEditingPhase(isEditing ? null : s.id)} style={{ padding: "4px 8px", fontSize: 12, cursor: "pointer", borderRadius: 6, border: "0.5px solid var(--color-border-tertiary, #ddd)", background: isEditing ? "#E6F1FB" : "var(--color-background-primary, #fff)", color: isEditing ? "#0C447C" : "var(--color-text-secondary, #666)" }}>
                      <i className="ti ti-edit" style={{ fontSize: 12 }} aria-hidden="true" />
                    </button>
                    <select value={s.color} onChange={(e) => updatePhase(s.id, { color: e.target.value })} style={{ fontSize: 11, padding: "2px 4px", borderRadius: 6, border: "0.5px solid var(--color-border-tertiary, #ddd)" }}>
                      {PHASE_COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={s.icon} onChange={(e) => updatePhase(s.id, { icon: e.target.value })} style={{ fontSize: 11, padding: "2px 4px", borderRadius: 6, border: "0.5px solid var(--color-border-tertiary, #ddd)" }}>
                      {PHASE_ICONS.map((ic) => <option key={ic} value={ic}>{ic.replace("ti-", "")}</option>)}
                    </select>
                    <button onClick={() => deletePhase(s.id)} style={{ padding: "4px 8px", fontSize: 12, cursor: "pointer", borderRadius: 6, border: "0.5px solid var(--color-border-tertiary, #ddd)", background: "var(--color-background-primary, #fff)", color: "#e05555" }} aria-label="Phase löschen"><i className="ti ti-trash" style={{ fontSize: 12 }} aria-hidden="true" /></button>
                  </div>
                )}
              </div>
              {isOpen && (
                <div style={{ padding: "10px 16px 14px 60px" }}>
                  <ol style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
                    {s.steps.map((step, j) => (
                      <li key={j} style={{ fontSize: 14, color: "var(--color-text-primary, #111)", lineHeight: 1.6, display: "flex", alignItems: "flex-start", gap: 8 }}>
                        {editMode ? (
                          <>
                            <input value={step} onChange={(e) => editStep(s.id, j, e.target.value)} style={{ flex: 1, fontSize: 13 }} />
                            <button onClick={() => removeStep(s.id, j)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "#e05555", flexShrink: 0 }} aria-label="Schritt löschen"><i className="ti ti-trash" style={{ fontSize: 13 }} aria-hidden="true" /></button>
                          </>
                        ) : step}
                      </li>
                    ))}
                  </ol>
                  {editMode && (
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <input value={newStep} onChange={(e) => setNewStep(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addStep(s.id)} placeholder="Neuer Schritt..." style={{ flex: 1, fontSize: 13 }} />
                      <button onClick={() => addStep(s.id)} style={{ padding: "0 12px", fontSize: 13, cursor: "pointer" }}>+ Schritt</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editMode && (
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <input value={newPhaseName} onChange={(e) => setNewPhaseName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addPhase()} placeholder="Neue Phase hinzufügen..." style={{ flex: 1 }} />
          <button onClick={addPhase} style={{ padding: "0 16px", cursor: "pointer" }}><i className="ti ti-plus" style={{ fontSize: 14, marginRight: 4 }} aria-hidden="true" />Phase hinzufügen</button>
        </div>
      )}

      <div style={{ marginTop: 20, padding: "14px 16px", background: "var(--color-background-secondary, #f5f5f5)", borderRadius: 10, border: "0.5px solid var(--color-border-tertiary, #ddd)" }}>
        <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 8, color: "var(--color-text-primary, #111)" }}>Trigger-Schwellenwerte</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[["Call-Bewertung < 75 %", "coral", "→ Coaching-Pflicht"], ["Fehlbearbeitung (jede)", "red", "→ Speedtalk innerhalb 24 h"], ["Datenschutzverstoß", "red", "→ Sofortmaßnahme + TL"], ["Keine Verbesserung nach 2 Coachings", "amber", "→ Eskalation TL"], ["Bewertungsrate < 25 %", "amber", "→ Intensivbegleitung"], ["AHT > 150 % Ziel-AHT", "amber", "→ Side-by-Side + Silent"]].map(([label, color, action], i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}><Badge color={color}>{label}</Badge><span style={{ fontSize: 12, color: "var(--color-text-secondary, #666)", paddingTop: 3 }}>{action}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MonitoringForm({ saved, setSaved, projects }) {
  const [agentName, setAgentName] = useState("");
  const [projektId, setProjektId] = useState(projects[0]?.id || "");
  const [callDate, setCallDate] = useState(new Date().toISOString().split("T")[0]);
  const [callId, setCallId] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [callScores, setCallScores] = useState({});
  const [ticketScores, setTicketScores] = useState({});
  const [notes, setNotes] = useState("");

  useEffect(() => { if (projects.length > 0 && !projektId) setProjektId(projects[0].id); }, [projects]);

  const scoreOptions = ["ja", "nein", "/"];
  const toggle = (obj, setObj, key, val) => setObj({ ...obj, [key]: val });
  const calcPct = (scores, criteria) => { const vals = criteria.map((c) => scores[c.key]).filter((v) => v && v !== "/"); if (!vals.length) return null; return Math.round((vals.filter((v) => v === "ja").length / vals.length) * 100); };
  const pctColor = (p) => { if (p === null) return "gray"; if (p >= 90) return "green"; if (p >= 75) return "amber"; return "red"; };
  const cp = calcPct(callScores, CRITERIA_CALLS);
  const tp = calcPct(ticketScores, CRITERIA_TICKETS);
  const selectedProject = projects.find((p) => p.id == projektId);

  const saveEntry = () => {
    if (!agentName) return;
    setSaved([{ id: Date.now(), agentName, projektId, projektName: selectedProject?.name || "", callDate, callId, ticketId, callScores: { ...callScores }, ticketScores: { ...ticketScores }, notes, callPct: cp, ticketPct: tp, ts: new Date().toLocaleDateString("de-DE") }, ...saved]);
    setAgentName(""); setCallId(""); setTicketId(""); setCallScores({}); setTicketScores({}); setNotes("");
  };

  const exportCSV = () => {
    const header = ["Datum", "Agent/in", "Projekt", "Call-ID", "Ticket-ID", "Call %", "Ticket %", ...CRITERIA_CALLS.map((c) => c.label), ...CRITERIA_TICKETS.map((c) => c.label), "Notizen"];
    const rows = saved.map((s) => [s.callDate || s.ts, s.agentName, s.projektName || "", s.callId, s.ticketId, s.callPct ?? "", s.ticketPct ?? "", ...CRITERIA_CALLS.map((c) => s.callScores?.[c.key] ?? ""), ...CRITERIA_TICKETS.map((c) => s.ticketScores?.[c.key] ?? ""), s.notes]);
    downloadCSV(`monitoring_${new Date().toISOString().split("T")[0]}.csv`, [header, ...rows]);
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div><label style={{ fontSize: 12, color: "var(--color-text-secondary, #666)", display: "block", marginBottom: 4 }}>Agent/in</label><input value={agentName} onChange={(e) => setAgentName(e.target.value)} placeholder="Name" style={{ width: "100%", boxSizing: "border-box" }} /></div>
        <div>
          <label style={{ fontSize: 12, color: "var(--color-text-secondary, #666)", display: "block", marginBottom: 4 }}>Projekt</label>
          <select value={projektId} onChange={(e) => setProjektId(e.target.value)} style={{ width: "100%" }}>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div><label style={{ fontSize: 12, color: "var(--color-text-secondary, #666)", display: "block", marginBottom: 4 }}>Datum</label><input type="date" value={callDate} onChange={(e) => setCallDate(e.target.value)} style={{ width: "100%", boxSizing: "border-box" }} /></div>
        <div><label style={{ fontSize: 12, color: "var(--color-text-secondary, #666)", display: "block", marginBottom: 4 }}>Call-ID</label><input value={callId} onChange={(e) => setCallId(e.target.value)} placeholder="z.B. 2460398" style={{ width: "100%", boxSizing: "border-box" }} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}><p style={{ fontSize: 13, fontWeight: 500, margin: 0, color: "var(--color-text-primary, #111)" }}><i className="ti ti-phone-call" style={{ marginRight: 6, fontSize: 14 }} aria-hidden="true" />Call-Bewertung</p>{cp !== null && <Badge color={pctColor(cp)}>{cp} %</Badge>}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {CRITERIA_CALLS.map((c) => (
              <div key={c.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "var(--color-text-primary, #111)" }}>{c.label}</span>
                <div style={{ display: "flex", gap: 4 }}>{scoreOptions.map((opt) => (<button key={opt} onClick={() => toggle(callScores, setCallScores, c.key, opt)} style={{ padding: "2px 10px", fontSize: 12, border: "0.5px solid", borderRadius: 6, cursor: "pointer", background: callScores[c.key] === opt ? (opt === "ja" ? "#EAF3DE" : opt === "nein" ? "#FCEBEB" : "#F1EFE8") : "var(--color-background-primary, #fff)", color: callScores[c.key] === opt ? (opt === "ja" ? "#27500A" : opt === "nein" ? "#791F1F" : "#444441") : "var(--color-text-secondary, #666)", borderColor: callScores[c.key] === opt ? "transparent" : "var(--color-border-tertiary, #ddd)" }}>{opt}</button>))}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}><p style={{ fontSize: 13, fontWeight: 500, margin: 0, color: "var(--color-text-primary, #111)" }}><i className="ti ti-ticket" style={{ marginRight: 6, fontSize: 14 }} aria-hidden="true" />Ticket-Bewertung</p>{tp !== null && <Badge color={pctColor(tp)}>{tp} %</Badge>}</div>
          <input value={ticketId} onChange={(e) => setTicketId(e.target.value)} placeholder="Ticket-ID / Link" style={{ width: "100%", marginBottom: 10, boxSizing: "border-box" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {CRITERIA_TICKETS.map((c) => (
              <div key={c.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "var(--color-text-primary, #111)" }}>{c.label}</span>
                <div style={{ display: "flex", gap: 4 }}>{scoreOptions.map((opt) => (<button key={opt} onClick={() => toggle(ticketScores, setTicketScores, c.key, opt)} style={{ padding: "2px 10px", fontSize: 12, border: "0.5px solid", borderRadius: 6, cursor: "pointer", background: ticketScores[c.key] === opt ? (opt === "ja" ? "#EAF3DE" : opt === "nein" ? "#FCEBEB" : "#F1EFE8") : "var(--color-background-primary, #fff)", color: ticketScores[c.key] === opt ? (opt === "ja" ? "#27500A" : opt === "nein" ? "#791F1F" : "#444441") : "var(--color-text-secondary, #666)", borderColor: ticketScores[c.key] === opt ? "transparent" : "var(--color-border-tertiary, #ddd)" }}>{opt}</button>))}</div>
              </div>
            ))}
          </div>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Bemerkungen / Notizen..." rows={4} style={{ width: "100%", marginTop: 12, fontSize: 13, boxSizing: "border-box" }} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}><button onClick={saveEntry} style={{ padding: "8px 20px", fontSize: 14, background: "rgba(43,191,191,0.15) !important", borderColor: "#2BBFBF !important", color: "#2BBFBF !important" }}><i className="ti ti-device-floppy" style={{ marginRight: 6 }} aria-hidden="true" />Monitoring speichern</button></div>
      {saved.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <p style={{ fontSize: 13, fontWeight: 500, margin: 0, color: "var(--color-text-primary, #111)" }}>Gespeicherte Monitorings ({saved.length})</p>
            <button onClick={exportCSV} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", fontSize: 12, cursor: "pointer", borderRadius: 7, border: "0.5px solid var(--color-border-secondary, #ccc)", background: "var(--color-background-primary, #fff)", color: "var(--color-text-secondary, #666)" }}><i className="ti ti-download" style={{ fontSize: 13 }} aria-hidden="true" />Als CSV exportieren</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {saved.map((s) => (
              <div key={s.id} style={{ background: "var(--color-background-secondary, #f5f5f5)", border: "0.5px solid var(--color-border-tertiary, #ddd)", borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary, #111)" }}>{s.agentName}</span>
                  {s.projektName && <Badge color="blue">{s.projektName}</Badge>}
                  <span style={{ fontSize: 12, color: "var(--color-text-secondary, #666)", marginLeft: 8 }}>{s.callDate || s.ts}</span>
                  {s.callId && <span style={{ fontSize: 12, color: "var(--color-text-secondary, #666)", marginLeft: 8 }}>Call: {s.callId}</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {s.callPct !== null && s.callPct !== undefined && <Badge color={s.callPct >= 90 ? "green" : s.callPct >= 75 ? "amber" : "red"}>{s.callPct} %</Badge>}
                  {s.ticketPct !== null && s.ticketPct !== undefined && <Badge color={s.ticketPct >= 90 ? "green" : s.ticketPct >= 75 ? "amber" : "red"}>T: {s.ticketPct} %</Badge>}
                  <button onClick={() => setSaved(saved.filter((x) => x.id !== s.id))} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "#e05555" }} aria-label="löschen"><i className="ti ti-trash" style={{ fontSize: 13 }} aria-hidden="true" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CoachingDoc({ project, entries, setEntries, projects }) {
  const [form, setForm] = useState({ date: new Date().toISOString().split("T")[0], coach: "", agent: "", topic: "", doc: "", goal: "", projektId: project.id, projektName: project.name });
  const update = (k, v) => setForm({ ...form, [k]: v });

  const selectedProject = projects.find((p) => p.id == form.projektId) || project;

  const save = () => {
    if (!form.agent || !form.topic) return;
    setEntries([{ ...form, projektName: selectedProject.name, id: Date.now() }, ...entries]);
    setForm({ ...form, agent: "", topic: "", doc: "", goal: "", date: new Date().toISOString().split("T")[0] });
  };

  const exportCSV = () => {
    const header = ["Datum", "Coach", "Agent/in", "Projekt", "Thema", "Dokumentation", "Ziel"];
    const rows = entries.map((e) => [e.date, e.coach, e.agent, e.projektName || "", e.topic, e.doc, e.goal]);
    downloadCSV(`coaching_${project.name}_${new Date().toISOString().split("T")[0]}.csv`, [header, ...rows]);
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
        <div><label style={{ fontSize: 12, color: "var(--color-text-secondary, #666)", display: "block", marginBottom: 4 }}>Datum</label><input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} style={{ width: "100%", boxSizing: "border-box" }} /></div>
        <div><label style={{ fontSize: 12, color: "var(--color-text-secondary, #666)", display: "block", marginBottom: 4 }}>Coach</label><select value={form.coach} onChange={(e) => update("coach", e.target.value)} style={{ width: "100%" }}><option value="">– Coach wählen –</option>{selectedProject.qms.map((q) => <option key={q}>{q}</option>)}</select></div>
        <div><label style={{ fontSize: 12, color: "var(--color-text-secondary, #666)", display: "block", marginBottom: 4 }}>Agent/in</label><input value={form.agent} onChange={(e) => update("agent", e.target.value)} placeholder="Agent/in" style={{ width: "100%", boxSizing: "border-box" }} /></div>
        <div>
          <label style={{ fontSize: 12, color: "var(--color-text-secondary, #666)", display: "block", marginBottom: 4 }}>Projekt</label>
          <select value={form.projektId} onChange={(e) => update("projektId", e.target.value)} style={{ width: "100%" }}>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div><label style={{ fontSize: 12, color: "var(--color-text-secondary, #666)", display: "block", marginBottom: 4 }}>Thema</label><select value={form.topic} onChange={(e) => update("topic", e.target.value)} style={{ width: "100%" }}><option value="">– Thema wählen –</option>{selectedProject.topics.map((t) => <option key={t}>{t}</option>)}</select></div>
        <div><label style={{ fontSize: 12, color: "var(--color-text-secondary, #666)", display: "block", marginBottom: 4 }}>Ziel / Anmerkung</label><select value={form.goal} onChange={(e) => update("goal", e.target.value)} style={{ width: "100%" }}><option value="">– Ziel wählen –</option>{GOALS_LIBRARY.map((g) => <option key={g}>{g}</option>)}</select></div>
      </div>
      <div style={{ marginBottom: 10 }}><label style={{ fontSize: 12, color: "var(--color-text-secondary, #666)", display: "block", marginBottom: 4 }}>Dokumentation</label><textarea value={form.doc} onChange={(e) => update("doc", e.target.value)} rows={3} placeholder="z.B. Call ID 2460398 – Servicefragen nicht gestellt" style={{ width: "100%", fontSize: 13, boxSizing: "border-box" }} /></div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}><button onClick={save} style={{ padding: "8px 20px", fontSize: 14, background: "rgba(43,191,191,0.15) !important", borderColor: "#2BBFBF !important", color: "#2BBFBF !important" }}><i className="ti ti-plus" style={{ marginRight: 6 }} aria-hidden="true" />Eintrag hinzufügen</button></div>
      {entries.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <p style={{ fontSize: 13, fontWeight: 500, margin: 0, color: "var(--color-text-primary, #111)" }}>Coaching-Einträge ({entries.length})</p>
            <button onClick={exportCSV} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", fontSize: 12, cursor: "pointer", borderRadius: 7, border: "0.5px solid var(--color-border-secondary, #ccc)", background: "var(--color-background-primary, #fff)", color: "var(--color-text-secondary, #666)" }}><i className="ti ti-download" style={{ fontSize: 13 }} aria-hidden="true" />Als CSV exportieren</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {entries.map((e) => (
              <div key={e.id} style={{ background: "var(--color-background-primary, #fff)", border: "0.5px solid var(--color-border-tertiary, #ddd)", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: e.doc || e.goal ? 6 : 0, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary, #111)" }}>{e.agent}</span>
                  <span style={{ fontSize: 12, color: "var(--color-text-secondary, #666)" }}>{e.date}</span>
                  {e.coach && <span style={{ fontSize: 12, color: "var(--color-text-secondary, #666)" }}>· {e.coach}</span>}
                  {e.projektName && <Badge color="blue">{e.projektName}</Badge>}
                  <Badge color={TOPIC_COLORS[e.topic] || "gray"}>{e.topic}</Badge>
                  <div style={{ marginLeft: "auto" }}><button onClick={() => setEntries(entries.filter((x) => x.id !== e.id))} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "#e05555" }} aria-label="löschen"><i className="ti ti-trash" style={{ fontSize: 13 }} aria-hidden="true" /></button></div>
                </div>
                {e.doc && <p style={{ fontSize: 13, color: "var(--color-text-secondary, #666)", margin: "0 0 4px" }}>{e.doc}</p>}
                {e.goal && <div style={{ display: "flex", alignItems: "center", gap: 6 }}><i className="ti ti-target" style={{ fontSize: 13, color: "#2E86AB" }} aria-hidden="true" /><span style={{ fontSize: 12, color: "#2E86AB" }}>{e.goal}</span></div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function OverviewSection({ project, monitorings, coachings }) {
  const mon = monitorings[project.id] || [];
  const coa = coachings[project.id] || [];
  const now = new Date();
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay() + 1); weekStart.setHours(0,0,0,0);
  const monThisWeek = mon.filter((m) => { try { const d = new Date(m.callDate || ""); return d >= weekStart; } catch(e) { return false; } }).length;
  const openGoals = coa.filter((e) => e.goal && e.goal !== "").length;
  const errors = coa.filter((e) => e.topic === "Fehlbearbeitung").length;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[[String(monThisWeek), "Monitorings diese Woche", "ti-eye", "#2E86AB"], [String(coa.length), "Coachings gesamt", "ti-messages", "#2BBFBF"], [String(openGoals), "Einträge mit Ziel", "ti-target", "#F5A623"], [String(errors), "Fehlbearbeitungen", "ti-alert-triangle", "#e05555"]].map(([value, label, icon, color], i) => (
          <div key={i} style={{ background: "var(--color-background-secondary, #f5f5f5)", borderRadius: 10, padding: "14px 16px" }}>
            <i className={`ti ${icon}`} style={{ fontSize: 18, color, marginBottom: 8, display: "block" }} aria-hidden="true" />
            <p style={{ fontSize: 22, fontWeight: 500, margin: "0 0 4px", color: "var(--color-text-primary, #111)" }}>{value}</p>
            <p style={{ fontSize: 12, color: "var(--color-text-secondary, #666)", margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "var(--color-background-primary, #fff)", border: "0.5px solid var(--color-border-tertiary, #ddd)", borderRadius: 10, padding: "14px 16px", marginBottom: 14 }}>
        <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 10, color: "var(--color-text-primary, #111)" }}>Team – {project.name}</p>
        {project.qms.length === 0 ? <p style={{ fontSize: 13, color: "var(--color-text-secondary, #666)", margin: 0 }}>Noch keine QMs hinterlegt.</p> : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {project.qms.map((q) => (
              <div key={q} style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--color-background-secondary, #f5f5f5)", borderRadius: 8, padding: "8px 12px" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(43,191,191,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: "#2BBFBF" }}>{q.slice(0, 2).toUpperCase()}</div>
                <span style={{ fontSize: 13, color: "var(--color-text-primary, #111)" }}>{q}</span>
                <span style={{ fontSize: 12, color: "var(--color-text-secondary, #666)" }}>{coa.filter((e) => e.coach === q).length} Coachings</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ background: "var(--color-background-primary, #fff)", border: "0.5px solid var(--color-border-tertiary, #ddd)", borderRadius: 10, padding: "14px 16px", marginBottom: 14 }}>
        <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 10, color: "var(--color-text-primary, #111)" }}>Monitoring-Rhythmus (Richtwerte)</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[["Prio 1 MA", "3–5 Calls + 3–5 Tickets / Monat", "purple"], ["Prio 2 MA", "2–3 Calls + 2–3 Tickets / Monat", "blue"], ["Newbies (erste 3 Monate)", "5 Calls + 5 Tickets / Monat", "teal"], ["Nach Fehlbearbeitung", "Intensivmonitoring 2× pro Woche", "red"]].map(([label, desc, color], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}><Badge color={color}>{label}</Badge><span style={{ fontSize: 13, color: "var(--color-text-secondary, #666)" }}>{desc}</span></div>
          ))}
        </div>
      </div>
      <div style={{ background: "var(--color-background-primary, #fff)", border: "0.5px solid var(--color-border-tertiary, #ddd)", borderRadius: 10, padding: "14px 16px" }}>
        <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 10, color: "var(--color-text-primary, #111)" }}>Bewertungsgrundlage</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[["Gesprächsatmosphäre (Begrüßung, Empathie, Verabschiedung)", "35 %"], ["Prozesseinhaltung & Datenschutz", "30 %"], ["Servicefragen & Verkauf / KVH", "20 %"], ["AHT / NBZ im Zielbereich", "15 %"]].map(([label, pct], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < 3 ? "0.5px solid var(--color-border-tertiary, #ddd)" : "none" }}>
              <span style={{ fontSize: 13, color: "var(--color-text-primary, #111)" }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary, #111)" }}>{pct}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function QMTool() {
  const initial = loadState();
  const [projects, setProjects] = useState(initial.projects);
  const [activeProjectId, setActiveProjectId] = useState(initial.activeProjectId);
  const [section, setSection] = useState("overview");
  const [showSettings, setShowSettings] = useState(false);
  const [monitorings, setMonitorings] = useState(initial.monitorings || {});
  const [coachings, setCoachings] = useState(initial.coachings || {});
  const [handbook, setHandbook] = useState(initial.handbook || DEFAULT_HANDBOOK);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  useEffect(() => { saveState({ projects, activeProjectId, monitorings, coachings, handbook }); }, [projects, activeProjectId, monitorings, coachings, handbook]);

  const getSaved = (id) => monitorings[id] || [];
  const setSaved = (id, val) => setMonitorings({ ...monitorings, [id]: Array.isArray(val) ? val : val(getSaved(id)) });
  const getEntries = (id) => coachings[id] || [];
  const setEntries = (id, val) => setCoachings({ ...coachings, [id]: Array.isArray(val) ? val : val(getEntries(id)) });

  const sectionTabs = [{ key: "overview", label: "Übersicht" }, { key: "handbook", label: "Handbuch & Ablauf" }, { key: "monitoring", label: "Monitoring-Formular" }, { key: "coaching", label: "Coaching-Dokumentation" }];

  return (
    <div style={{ padding: "1.5rem 2rem 3rem", fontFamily: "var(--font-sans, system-ui, sans-serif)", minHeight: "100vh" }}>
      <InjectTheme />
      <h2 style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", margin: 0 }}>QM-Arbeitsmappe</h2>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div><p style={{ fontSize: 20, fontWeight: 500, margin: "0 0 4px", color: "#2BBFBF", letterSpacing: "-0.3px" }}>QM-Arbeitsmappe</p><p style={{ fontSize: 14, color: "var(--color-text-secondary, #9896b0)", margin: 0 }}>Hey Contact Heroes · Qualitätsmanagement</p></div>
        <button onClick={() => setShowSettings(!showSettings)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", fontSize: 13, cursor: "pointer", borderRadius: 8, border: "0.5px solid var(--color-border-secondary, #ccc)", background: showSettings ? "rgba(43,191,191,0.12)" : "var(--color-background-primary, #1a1a2e)", color: showSettings ? "#2BBFBF" : "var(--color-text-secondary, #9896b0)", fontWeight: showSettings ? 500 : 400 }}><i className="ti ti-settings" style={{ fontSize: 15 }} aria-hidden="true" />Projekte bearbeiten</button>
      </div>
      {showSettings && <SettingsPanel projects={projects} setProjects={setProjects} onClose={() => setShowSettings(false)} />}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {projects.map((p) => (
          <button key={p.id} onClick={() => { setActiveProjectId(p.id); setSection("overview"); }} style={{ padding: "6px 16px", fontSize: 13, borderRadius: 8, cursor: "pointer", border: "0.5px solid", background: activeProject && activeProject.id === p.id ? "var(--color-background-secondary, #f5f5f5)" : "var(--color-background-primary, #fff)", color: activeProject && activeProject.id === p.id ? "var(--color-text-primary, #111)" : "var(--color-text-secondary, #666)", borderColor: activeProject && activeProject.id === p.id ? "var(--color-border-primary, #999)" : "var(--color-border-tertiary, #ddd)", fontWeight: activeProject && activeProject.id === p.id ? 500 : 400 }}>
            {p.name}
            {(monitorings[p.id]?.length || 0) + (coachings[p.id]?.length || 0) > 0 && <span style={{ marginLeft: 6, fontSize: 11, background: "#E6F1FB", color: "#0C447C", padding: "1px 6px", borderRadius: 10 }}>{(monitorings[p.id]?.length || 0) + (coachings[p.id]?.length || 0)}</span>}
          </button>
        ))}
      </div>
      {activeProject && (
        <div style={{ background: "var(--color-background-primary, #fff)", border: "0.5px solid var(--color-border-tertiary, #ddd)", borderRadius: 12, padding: "16px 18px" }}>
          <TabBar tabs={sectionTabs} active={section} onChange={setSection} />
          {section === "overview" && <OverviewSection project={activeProject} monitorings={monitorings} coachings={coachings} />}
          {section === "handbook" && <HandbookSection handbook={handbook} setHandbook={setHandbook} />}
          {section === "monitoring" && <MonitoringForm saved={getSaved(activeProject.id)} setSaved={(val) => setSaved(activeProject.id, val)} projects={projects} />}
          {section === "coaching" && <CoachingDoc project={activeProject} entries={getEntries(activeProject.id)} setEntries={(val) => setEntries(activeProject.id, val)} projects={projects} />}
        </div>
      )}
    </div>
  );
}
