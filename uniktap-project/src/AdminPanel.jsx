import { useState, useEffect, useCallback } from "react";
import { sbFetch, sbAuth, sbSignUp, setToken } from "./supabase.js";

/* ═══════════════════════════════════════════════════════════════
   UnikTap Admin Panel
   Supabase-connected CRUD for all tables
   ═══════════════════════════════════════════════════════════════ */

// ─── Styles ───
const font = "'Nunito', -apple-system, sans-serif";
const C = {
  bg: "#f0f2f5",
  sidebar: "#0a1628",
  sidebarHover: "#132038",
  card: "#ffffff",
  border: "#e2e8f0",
  blue: "#2d7ff9",
  blueLight: "#eef4ff",
  green: "#00b894",
  greenLight: "#e6faf5",
  orange: "#f39c12",
  orangeLight: "#fff8e7",
  red: "#e74c3c",
  redLight: "#fef0ed",
  t1: "#0f1d30",
  t2: "#4a5568",
  t3: "#8896a6",
  white: "#ffffff",
};

const btnStyle = (color, bg) => ({
  background: bg, color, border: "none", borderRadius: 8,
  padding: "8px 16px", fontSize: 13, fontWeight: 600,
  cursor: "pointer", fontFamily: font, transition: "opacity 0.2s",
});

const inputStyle = {
  width: "100%", padding: "10px 12px", border: `1.5px solid ${C.border}`,
  borderRadius: 8, fontSize: 13, fontFamily: font, outline: "none",
  boxSizing: "border-box", transition: "border-color 0.2s",
};

const labelStyle = {
  fontSize: 12, fontWeight: 600, color: C.t2, fontFamily: font,
  marginBottom: 4, display: "block",
};

// ─── LOGIN SCREEN ───
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login"); // login | signup

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        await sbSignUp(email, password);
        setMode("login");
        setError("✅ Аккаунт создан! Теперь войдите.");
        setLoading(false);
        return;
      }
      const data = await sbAuth(email, password);
      onLogin(data);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: `linear-gradient(135deg, ${C.sidebar}, #1a2a4a)`,
      display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font,
    }}>
      <div style={{
        background: C.card, borderRadius: 20, padding: "40px 36px",
        width: "min(400px, 90vw)", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🎓</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.t1 }}>UnikTap Admin</div>
          <div style={{ fontSize: 13, color: C.t3, marginTop: 4 }}>
            {mode === "login" ? "Войдите в панель управления" : "Создайте аккаунт"}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@email.com" type="email" />
          </div>
          <div>
            <label style={labelStyle}>Пароль</label>
            <input style={inputStyle} value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" type="password"
              onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </div>
        </div>

        {error && (
          <div style={{
            marginTop: 12, padding: "8px 12px", borderRadius: 8,
            background: error.startsWith("✅") ? C.greenLight : C.redLight,
            color: error.startsWith("✅") ? C.green : C.red,
            fontSize: 13, fontFamily: font,
          }}>{error}</div>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{
          ...btnStyle(C.white, C.blue), width: "100%", padding: "12px",
          marginTop: 18, fontSize: 15, opacity: loading ? 0.6 : 1,
        }}>
          {loading ? "⏳ Загрузка..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
        </button>

        <div style={{ textAlign: "center", marginTop: 14 }}>
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
            style={{ background: "none", border: "none", color: C.blue, fontSize: 13, cursor: "pointer", fontFamily: font }}>
            {mode === "login" ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL ───
function Modal({ title, onClose, children, width }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)", display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 1000,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.card, borderRadius: 16, width: width || "min(500px, 92vw)",
        maxHeight: "85vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }}>
        <div style={{
          padding: "18px 24px", borderBottom: `1px solid ${C.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          position: "sticky", top: 0, background: C.card, zIndex: 1, borderRadius: "16px 16px 0 0",
        }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.t1, fontFamily: font }}>{title}</span>
          <button onClick={onClose} style={{
            background: C.bg, border: "none", borderRadius: 8,
            width: 32, height: 32, cursor: "pointer", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

// ─── CONFIRM DIALOG ───
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <Modal title="Подтверждение" onClose={onCancel} width="min(380px, 90vw)">
      <p style={{ fontSize: 14, color: C.t2, fontFamily: font, margin: "0 0 20px" }}>{message}</p>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={btnStyle(C.t2, C.bg)}>Отмена</button>
        <button onClick={onConfirm} style={btnStyle(C.white, C.red)}>Удалить</button>
      </div>
    </Modal>
  );
}

// ─── GENERIC FORM FIELD ───
function FormField({ label, value, onChange, type, options, placeholder, required }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label} {required && <span style={{ color: C.red }}>*</span>}</label>
      {type === "select" ? (
        <select style={{ ...inputStyle, appearance: "auto" }} value={value} onChange={e => onChange(e.target.value)}>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={value || ""}
          onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      ) : type === "checkbox" ? (
        <input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)}
          style={{ width: 18, height: 18, cursor: "pointer" }} />
      ) : (
        <input style={inputStyle} type={type || "text"} value={value || ""}
          onChange={e => onChange(type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)}
          placeholder={placeholder} />
      )}
    </div>
  );
}

// ─── UNIVERSITIES SECTION ───
function UniversitiesSection() {
  const [unis, setUnis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | "new" | university object
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await sbFetch("universities?order=sort_order.asc");
      setUnis(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setForm({ name: "", short_name: "", city: "Шымкент", ent_min: 50, dormitory: false, phone: "", website: "", instagram: "", address: "", sort_order: 0, is_active: true });
    setEditing("new");
  };

  const openEdit = (uni) => {
    setForm({ ...uni });
    setEditing(uni);
  };

  const save = async () => {
    try {
      if (editing === "new") {
        await sbFetch("universities", {
          method: "POST",
          body: JSON.stringify(form),
          prefer: "return=minimal",
        });
      } else {
        await sbFetch(`universities?id=eq.${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(form),
          prefer: "return=minimal",
        });
      }
      setEditing(null);
      load();
    } catch (e) { alert("Ошибка: " + e.message); }
  };

  const remove = async () => {
    try {
      await sbFetch(`universities?id=eq.${deleting.id}`, { method: "DELETE" });
      setDeleting(null);
      load();
    } catch (e) { alert("Ошибка: " + e.message); }
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: C.t3, fontFamily: font }}>Загрузка...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, color: C.t1, fontFamily: font }}>Университеты</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: C.t3, fontFamily: font }}>{unis.length} записей</p>
        </div>
        <button onClick={openNew} style={btnStyle(C.white, C.blue)}>+ Добавить</button>
      </div>

      <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: font }}>
            <thead>
              <tr style={{ background: C.bg }}>
                {["ID", "Название", "Город", "ЕНТ", "Общежитие", "Активен", "Действия"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: C.t3, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {unis.map(u => (
                <tr key={u.id} style={{ borderTop: `1px solid ${C.border}` }}>
                  <td style={{ padding: "10px 14px", color: C.t3 }}>{u.id}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 600, color: C.t1, maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis" }}>{u.short_name}</td>
                  <td style={{ padding: "10px 14px", color: C.t2 }}>{u.city}</td>
                  <td style={{ padding: "10px 14px", color: C.t2 }}>{u.ent_min}</td>
                  <td style={{ padding: "10px 14px" }}>{u.dormitory ? "✅" : "❌"}</td>
                  <td style={{ padding: "10px 14px" }}>{u.is_active ? "✅" : "❌"}</td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                    <button onClick={() => openEdit(u)} style={{ ...btnStyle(C.blue, C.blueLight), marginRight: 6, padding: "5px 10px", fontSize: 12 }}>✏️</button>
                    <button onClick={() => setDeleting(u)} style={{ ...btnStyle(C.red, C.redLight), padding: "5px 10px", fontSize: 12 }}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <Modal title={editing === "new" ? "Новый университет" : `Редактировать: ${editing.short_name}`} onClose={() => setEditing(null)}>
          <FormField label="Полное название" value={form.name} onChange={v => setForm({...form, name: v})} required />
          <FormField label="Короткое название" value={form.short_name} onChange={v => setForm({...form, short_name: v})} required />
          <FormField label="Город" value={form.city} onChange={v => setForm({...form, city: v})} />
          <FormField label="Мин. балл ЕНТ" value={form.ent_min} onChange={v => setForm({...form, ent_min: v})} type="number" />
          <FormField label="Общежитие" value={form.dormitory} onChange={v => setForm({...form, dormitory: v})} type="checkbox" />
          <FormField label="Телефон" value={form.phone} onChange={v => setForm({...form, phone: v})} placeholder="+7 7XX XXX XX XX" />
          <FormField label="Веб-сайт" value={form.website} onChange={v => setForm({...form, website: v})} />
          <FormField label="Instagram" value={form.instagram} onChange={v => setForm({...form, instagram: v})} />
          <FormField label="Адрес" value={form.address} onChange={v => setForm({...form, address: v})} />
          <FormField label="Порядок сортировки" value={form.sort_order} onChange={v => setForm({...form, sort_order: v})} type="number" />
          <FormField label="Активен" value={form.is_active} onChange={v => setForm({...form, is_active: v})} type="checkbox" />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
            <button onClick={() => setEditing(null)} style={btnStyle(C.t2, C.bg)}>Отмена</button>
            <button onClick={save} style={btnStyle(C.white, C.blue)}>💾 Сохранить</button>
          </div>
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          message={`Удалить "${deleting.short_name}"? Все связанные факультеты, специальности и документы тоже будут удалены.`}
          onConfirm={remove}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

// ─── FACULTIES SECTION ───
function FacultiesSection() {
  const [unis, setUnis] = useState([]);
  const [selectedUni, setSelectedUni] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    (async () => {
      const data = await sbFetch("universities?order=sort_order.asc&select=id,short_name");
      setUnis(data);
      if (data.length > 0) setSelectedUni(data[0].id);
      setLoading(false);
    })();
  }, []);

  const loadFaculties = useCallback(async () => {
    if (!selectedUni) return;
    const data = await sbFetch(`faculties?university_id=eq.${selectedUni}&order=sort_order.asc`);
    setFaculties(data);
  }, [selectedUni]);

  useEffect(() => { loadFaculties(); }, [loadFaculties]);

  const openNew = () => {
    setForm({ university_id: selectedUni, name: "", icon: "📚", address: "", sort_order: 0, is_active: true });
    setEditing("new");
  };

  const openEdit = (f) => { setForm({ ...f }); setEditing(f); };

  const save = async () => {
    try {
      if (editing === "new") {
        await sbFetch("faculties", { method: "POST", body: JSON.stringify(form), prefer: "return=minimal" });
      } else {
        await sbFetch(`faculties?id=eq.${editing.id}`, { method: "PATCH", body: JSON.stringify(form), prefer: "return=minimal" });
      }
      setEditing(null);
      loadFaculties();
    } catch (e) { alert("Ошибка: " + e.message); }
  };

  const remove = async () => {
    try {
      await sbFetch(`faculties?id=eq.${deleting.id}`, { method: "DELETE" });
      setDeleting(null);
      loadFaculties();
    } catch (e) { alert("Ошибка: " + e.message); }
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: C.t3, fontFamily: font }}>Загрузка...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20, color: C.t1, fontFamily: font }}>Факультеты</h2>
        <button onClick={openNew} style={btnStyle(C.white, C.blue)}>+ Добавить</button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <select style={{ ...inputStyle, maxWidth: 350 }} value={selectedUni || ""} onChange={e => setSelectedUni(Number(e.target.value))}>
          {unis.map(u => <option key={u.id} value={u.id}>{u.short_name}</option>)}
        </select>
      </div>

      <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: font }}>
            <thead>
              <tr style={{ background: C.bg }}>
                {["ID", "Иконка", "Название", "Адрес", "Активен", "Действия"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: C.t3, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {faculties.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 30, textAlign: "center", color: C.t3, fontFamily: font }}>Нет факультетов</td></tr>
              ) : faculties.map(f => (
                <tr key={f.id} style={{ borderTop: `1px solid ${C.border}` }}>
                  <td style={{ padding: "10px 14px", color: C.t3 }}>{f.id}</td>
                  <td style={{ padding: "10px 14px", fontSize: 20 }}>{f.icon}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 600, color: C.t1 }}>{f.name}</td>
                  <td style={{ padding: "10px 14px", color: C.t2, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>{f.address}</td>
                  <td style={{ padding: "10px 14px" }}>{f.is_active ? "✅" : "❌"}</td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                    <button onClick={() => openEdit(f)} style={{ ...btnStyle(C.blue, C.blueLight), marginRight: 6, padding: "5px 10px", fontSize: 12 }}>✏️</button>
                    <button onClick={() => setDeleting(f)} style={{ ...btnStyle(C.red, C.redLight), padding: "5px 10px", fontSize: 12 }}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <Modal title={editing === "new" ? "Новый факультет" : `Редактировать: ${editing.name}`} onClose={() => setEditing(null)}>
          <FormField label="Название" value={form.name} onChange={v => setForm({...form, name: v})} required />
          <FormField label="Иконка (emoji)" value={form.icon} onChange={v => setForm({...form, icon: v})} placeholder="📚" />
          <FormField label="Адрес" value={form.address} onChange={v => setForm({...form, address: v})} />
          <FormField label="Порядок сортировки" value={form.sort_order} onChange={v => setForm({...form, sort_order: v})} type="number" />
          <FormField label="Активен" value={form.is_active} onChange={v => setForm({...form, is_active: v})} type="checkbox" />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
            <button onClick={() => setEditing(null)} style={btnStyle(C.t2, C.bg)}>Отмена</button>
            <button onClick={save} style={btnStyle(C.white, C.blue)}>💾 Сохранить</button>
          </div>
        </Modal>
      )}

      {deleting && <ConfirmDialog message={`Удалить факультет "${deleting.name}"?`} onConfirm={remove} onCancel={() => setDeleting(null)} />}
    </div>
  );
}

// ─── SPECIALTIES SECTION ───
function SpecialtiesSection() {
  const [unis, setUnis] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [selectedUni, setSelectedUni] = useState(null);
  const [selectedFac, setSelectedFac] = useState(null);
  const [specs, setSpecs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    (async () => {
      const data = await sbFetch("universities?order=sort_order.asc&select=id,short_name");
      setUnis(data);
      if (data.length > 0) setSelectedUni(data[0].id);
    })();
  }, []);

  useEffect(() => {
    if (!selectedUni) return;
    (async () => {
      const data = await sbFetch(`faculties?university_id=eq.${selectedUni}&order=sort_order.asc&select=id,name`);
      setFaculties(data);
      if (data.length > 0) setSelectedFac(data[0].id);
      else { setSelectedFac(null); setSpecs([]); }
    })();
  }, [selectedUni]);

  useEffect(() => {
    if (!selectedFac) { setSpecs([]); return; }
    (async () => {
      const data = await sbFetch(`specialties?faculty_id=eq.${selectedFac}&order=sort_order.asc`);
      setSpecs(data);
    })();
  }, [selectedFac]);

  const openNew = () => {
    setForm({ faculty_id: selectedFac, name: "", tuition_price: null, grant_score: null, sort_order: 0, is_active: true });
    setEditing("new");
  };

  const openEdit = (s) => { setForm({ ...s }); setEditing(s); };

  const save = async () => {
    try {
      const payload = { ...form };
      if (payload.tuition_price === "") payload.tuition_price = null;
      if (payload.grant_score === "") payload.grant_score = null;
      if (editing === "new") {
        await sbFetch("specialties", { method: "POST", body: JSON.stringify(payload), prefer: "return=minimal" });
      } else {
        await sbFetch(`specialties?id=eq.${editing.id}`, { method: "PATCH", body: JSON.stringify(payload), prefer: "return=minimal" });
      }
      setEditing(null);
      const data = await sbFetch(`specialties?faculty_id=eq.${selectedFac}&order=sort_order.asc`);
      setSpecs(data);
    } catch (e) { alert("Ошибка: " + e.message); }
  };

  const remove = async () => {
    try {
      await sbFetch(`specialties?id=eq.${deleting.id}`, { method: "DELETE" });
      setDeleting(null);
      const data = await sbFetch(`specialties?faculty_id=eq.${selectedFac}&order=sort_order.asc`);
      setSpecs(data);
    } catch (e) { alert("Ошибка: " + e.message); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20, color: C.t1, fontFamily: font }}>Специальности</h2>
        <button onClick={openNew} disabled={!selectedFac} style={{ ...btnStyle(C.white, C.blue), opacity: selectedFac ? 1 : 0.4 }}>+ Добавить</button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <select style={{ ...inputStyle, maxWidth: 250 }} value={selectedUni || ""} onChange={e => setSelectedUni(Number(e.target.value))}>
          {unis.map(u => <option key={u.id} value={u.id}>{u.short_name}</option>)}
        </select>
        <select style={{ ...inputStyle, maxWidth: 250 }} value={selectedFac || ""} onChange={e => setSelectedFac(Number(e.target.value))}>
          {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
      </div>

      <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: font }}>
            <thead>
              <tr style={{ background: C.bg }}>
                {["ID", "Название", "Цена (тг/год)", "Грант (балл)", "Действия"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: C.t3, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specs.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 30, textAlign: "center", color: C.t3, fontFamily: font }}>
                  {selectedFac ? "Нет специальностей" : "Выберите факультет"}
                </td></tr>
              ) : specs.map(s => (
                <tr key={s.id} style={{ borderTop: `1px solid ${C.border}` }}>
                  <td style={{ padding: "10px 14px", color: C.t3 }}>{s.id}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 600, color: C.t1 }}>{s.name}</td>
                  <td style={{ padding: "10px 14px", color: C.t2 }}>{s.tuition_price ? `${s.tuition_price.toLocaleString()} ₸` : "—"}</td>
                  <td style={{ padding: "10px 14px", color: C.t2 }}>{s.grant_score || "—"}</td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                    <button onClick={() => openEdit(s)} style={{ ...btnStyle(C.blue, C.blueLight), marginRight: 6, padding: "5px 10px", fontSize: 12 }}>✏️</button>
                    <button onClick={() => setDeleting(s)} style={{ ...btnStyle(C.red, C.redLight), padding: "5px 10px", fontSize: 12 }}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <Modal title={editing === "new" ? "Новая специальность" : `Редактировать: ${editing.name}`} onClose={() => setEditing(null)}>
          <FormField label="Название" value={form.name} onChange={v => setForm({...form, name: v})} required />
          <FormField label="Стоимость обучения (тг/год)" value={form.tuition_price} onChange={v => setForm({...form, tuition_price: v})} type="number" placeholder="510000" />
          <FormField label="Мин. балл для гранта" value={form.grant_score} onChange={v => setForm({...form, grant_score: v})} type="number" placeholder="75" />
          <FormField label="Порядок сортировки" value={form.sort_order} onChange={v => setForm({...form, sort_order: v})} type="number" />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
            <button onClick={() => setEditing(null)} style={btnStyle(C.t2, C.bg)}>Отмена</button>
            <button onClick={save} style={btnStyle(C.white, C.blue)}>💾 Сохранить</button>
          </div>
        </Modal>
      )}

      {deleting && <ConfirmDialog message={`Удалить специальность "${deleting.name}"?`} onConfirm={remove} onCancel={() => setDeleting(null)} />}
    </div>
  );
}

// ─── DOCUMENTS SECTION ───
function DocumentsSection() {
  const [unis, setUnis] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [selectedUni, setSelectedUni] = useState(null);
  const [selectedFac, setSelectedFac] = useState(null);
  const [docs, setDocs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    (async () => {
      const data = await sbFetch("universities?order=sort_order.asc&select=id,short_name");
      setUnis(data);
      if (data.length > 0) setSelectedUni(data[0].id);
    })();
  }, []);

  useEffect(() => {
    if (!selectedUni) return;
    (async () => {
      const data = await sbFetch(`faculties?university_id=eq.${selectedUni}&order=sort_order.asc&select=id,name`);
      setFaculties(data);
      if (data.length > 0) setSelectedFac(data[0].id);
      else { setSelectedFac(null); setDocs([]); }
    })();
  }, [selectedUni]);

  useEffect(() => {
    if (!selectedFac) { setDocs([]); return; }
    (async () => {
      const data = await sbFetch(`required_documents?faculty_id=eq.${selectedFac}&order=sort_order.asc`);
      setDocs(data);
    })();
  }, [selectedFac]);

  const openNew = () => {
    setForm({ faculty_id: selectedFac, name: "", is_required: true, note: "", sort_order: 0 });
    setEditing("new");
  };

  const save = async () => {
    try {
      const payload = { ...form };
      if (!payload.note) payload.note = null;
      if (editing === "new") {
        await sbFetch("required_documents", { method: "POST", body: JSON.stringify(payload), prefer: "return=minimal" });
      } else {
        await sbFetch(`required_documents?id=eq.${editing.id}`, { method: "PATCH", body: JSON.stringify(payload), prefer: "return=minimal" });
      }
      setEditing(null);
      const data = await sbFetch(`required_documents?faculty_id=eq.${selectedFac}&order=sort_order.asc`);
      setDocs(data);
    } catch (e) { alert("Ошибка: " + e.message); }
  };

  const remove = async () => {
    try {
      await sbFetch(`required_documents?id=eq.${deleting.id}`, { method: "DELETE" });
      setDeleting(null);
      const data = await sbFetch(`required_documents?faculty_id=eq.${selectedFac}&order=sort_order.asc`);
      setDocs(data);
    } catch (e) { alert("Ошибка: " + e.message); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20, color: C.t1, fontFamily: font }}>Документы</h2>
        <button onClick={openNew} disabled={!selectedFac} style={{ ...btnStyle(C.white, C.blue), opacity: selectedFac ? 1 : 0.4 }}>+ Добавить</button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <select style={{ ...inputStyle, maxWidth: 250 }} value={selectedUni || ""} onChange={e => setSelectedUni(Number(e.target.value))}>
          {unis.map(u => <option key={u.id} value={u.id}>{u.short_name}</option>)}
        </select>
        <select style={{ ...inputStyle, maxWidth: 250 }} value={selectedFac || ""} onChange={e => setSelectedFac(Number(e.target.value))}>
          {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
      </div>

      <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: font }}>
            <thead>
              <tr style={{ background: C.bg }}>
                {["Документ", "Обязателен", "Примечание", "Действия"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: C.t3, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {docs.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: 30, textAlign: "center", color: C.t3, fontFamily: font }}>Нет документов</td></tr>
              ) : docs.map(d => (
                <tr key={d.id} style={{ borderTop: `1px solid ${C.border}` }}>
                  <td style={{ padding: "10px 14px", fontWeight: 500, color: C.t1 }}>{d.name}</td>
                  <td style={{ padding: "10px 14px" }}>{d.is_required ? "✅ Да" : "⚪ Нет"}</td>
                  <td style={{ padding: "10px 14px", color: C.t3, fontStyle: d.note ? "italic" : "normal" }}>{d.note || "—"}</td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                    <button onClick={() => { setForm({...d}); setEditing(d); }} style={{ ...btnStyle(C.blue, C.blueLight), marginRight: 6, padding: "5px 10px", fontSize: 12 }}>✏️</button>
                    <button onClick={() => setDeleting(d)} style={{ ...btnStyle(C.red, C.redLight), padding: "5px 10px", fontSize: 12 }}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <Modal title={editing === "new" ? "Новый документ" : "Редактировать документ"} onClose={() => setEditing(null)}>
          <FormField label="Название документа" value={form.name} onChange={v => setForm({...form, name: v})} required />
          <FormField label="Обязателен" value={form.is_required} onChange={v => setForm({...form, is_required: v})} type="checkbox" />
          <FormField label="Примечание" value={form.note} onChange={v => setForm({...form, note: v})} placeholder="для юношей / если есть" />
          <FormField label="Порядок сортировки" value={form.sort_order} onChange={v => setForm({...form, sort_order: v})} type="number" />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
            <button onClick={() => setEditing(null)} style={btnStyle(C.t2, C.bg)}>Отмена</button>
            <button onClick={save} style={btnStyle(C.white, C.blue)}>💾 Сохранить</button>
          </div>
        </Modal>
      )}

      {deleting && <ConfirmDialog message={`Удалить документ "${deleting.name}"?`} onConfirm={remove} onCancel={() => setDeleting(null)} />}
    </div>
  );
}

// ─── APPLICATIONS SECTION ───
function ApplicationsSection() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      let query = "applications?order=created_at.desc&select=*,universities(short_name),faculties(name),specialties(name)";
      if (statusFilter !== "all") query += `&status=eq.${statusFilter}`;
      const data = await sbFetch(query);
      setApps(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, newStatus) => {
    try {
      await sbFetch(`applications?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
        prefer: "return=minimal",
      });
      load();
      if (viewing && viewing.id === id) setViewing({ ...viewing, status: newStatus });
    } catch (e) { alert("Ошибка: " + e.message); }
  };

  const statusBadge = (status) => {
    const map = {
      pending: { label: "На рассмотрении", bg: C.orangeLight, color: C.orange },
      accepted: { label: "Принята", bg: C.greenLight, color: C.green },
      rejected: { label: "Отклонена", bg: C.redLight, color: C.red },
      withdrawn: { label: "Отозвана", bg: C.bg, color: C.t3 },
    };
    const s = map[status] || map.pending;
    return (
      <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, fontFamily: font }}>
        {s.label}
      </span>
    );
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: C.t3, fontFamily: font }}>Загрузка...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, color: C.t1, fontFamily: font }}>Заявки</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: C.t3, fontFamily: font }}>{apps.length} записей</p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { key: "all", label: "Все" },
            { key: "pending", label: "⏳ Новые" },
            { key: "accepted", label: "✅ Принятые" },
            { key: "rejected", label: "❌ Отклонённые" },
          ].map(f => (
            <button key={f.key} onClick={() => setStatusFilter(f.key)} style={{
              ...btnStyle(statusFilter === f.key ? C.white : C.t2, statusFilter === f.key ? C.blue : C.bg),
              padding: "6px 12px", fontSize: 12,
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: font }}>
            <thead>
              <tr style={{ background: C.bg }}>
                {["Дата", "ФИО", "Университет", "Факультет", "Специальность", "Телефон", "Статус", "Действия"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: C.t3, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {apps.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: 30, textAlign: "center", color: C.t3, fontFamily: font }}>Нет заявок</td></tr>
              ) : apps.map(a => (
                <tr key={a.id} style={{ borderTop: `1px solid ${C.border}` }}>
                  <td style={{ padding: "10px 14px", color: C.t3, whiteSpace: "nowrap" }}>{new Date(a.created_at).toLocaleDateString("ru-RU")}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 600, color: C.t1, whiteSpace: "nowrap" }}>{a.last_name} {a.first_name}</td>
                  <td style={{ padding: "10px 14px", color: C.t2 }}>{a.universities?.short_name || "—"}</td>
                  <td style={{ padding: "10px 14px", color: C.t2 }}>{a.faculties?.name || "—"}</td>
                  <td style={{ padding: "10px 14px", color: C.t2 }}>{a.specialties?.name || "—"}</td>
                  <td style={{ padding: "10px 14px", color: C.t2, whiteSpace: "nowrap" }}>{a.phone}</td>
                  <td style={{ padding: "10px 14px" }}>{statusBadge(a.status)}</td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                    <button onClick={() => setViewing(a)} style={{ ...btnStyle(C.blue, C.blueLight), padding: "5px 10px", fontSize: 12 }}>👁️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewing && (
        <Modal title="Детали заявки" onClose={() => setViewing(null)} width="min(520px, 92vw)">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, fontSize: 13, fontFamily: font }}>
            <div><span style={{ color: C.t3 }}>Фамилия:</span><br/><strong>{viewing.last_name}</strong></div>
            <div><span style={{ color: C.t3 }}>Имя:</span><br/><strong>{viewing.first_name}</strong></div>
            <div><span style={{ color: C.t3 }}>Отчество:</span><br/><strong>{viewing.middle_name || "—"}</strong></div>
            <div><span style={{ color: C.t3 }}>Дата рождения:</span><br/><strong>{viewing.birth_date}</strong></div>
            <div><span style={{ color: C.t3 }}>Телефон:</span><br/><strong>{viewing.phone}</strong></div>
            <div><span style={{ color: C.t3 }}>Email:</span><br/><strong>{viewing.email || "—"}</strong></div>
            <div style={{ gridColumn: "1/-1" }}><span style={{ color: C.t3 }}>Университет:</span><br/><strong>{viewing.universities?.short_name || "—"}</strong></div>
            <div><span style={{ color: C.t3 }}>Факультет:</span><br/><strong>{viewing.faculties?.name || "—"}</strong></div>
            <div><span style={{ color: C.t3 }}>Специальность:</span><br/><strong>{viewing.specialties?.name || "—"}</strong></div>
            <div><span style={{ color: C.t3 }}>Дата подачи:</span><br/><strong>{new Date(viewing.created_at).toLocaleString("ru-RU")}</strong></div>
            <div><span style={{ color: C.t3 }}>Статус:</span><br/>{statusBadge(viewing.status)}</div>
          </div>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.t3, marginBottom: 10, fontFamily: font }}>ИЗМЕНИТЬ СТАТУС:</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => updateStatus(viewing.id, "pending")} style={btnStyle(C.orange, C.orangeLight)}>⏳ На рассмотрении</button>
              <button onClick={() => updateStatus(viewing.id, "accepted")} style={btnStyle(C.green, C.greenLight)}>✅ Принять</button>
              <button onClick={() => updateStatus(viewing.id, "rejected")} style={btnStyle(C.red, C.redLight)}>❌ Отклонить</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── MAIN APP ───
const SECTIONS = [
  { key: "universities", label: "Университеты", icon: "🏫" },
  { key: "faculties", label: "Факультеты", icon: "📂" },
  { key: "specialties", label: "Специальности", icon: "🎓" },
  { key: "documents", label: "Документы", icon: "📄" },
  { key: "applications", label: "Заявки", icon: "📋" },
];

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [section, setSection] = useState("universities");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!user) return <LoginScreen onLogin={(data) => setUser(data)} />;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: font, background: C.bg }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 240 : 60,
        background: C.sidebar,
        transition: "width 0.3s",
        display: "flex", flexDirection: "column",
        flexShrink: 0,
        position: "sticky", top: 0, height: "100vh",
      }}>
        <div style={{
          padding: sidebarOpen ? "20px 18px" : "20px 10px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #2d7ff9, #6c5ce7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, flexShrink: 0, cursor: "pointer",
          }} onClick={() => setSidebarOpen(!sidebarOpen)}>🎓</div>
          {sidebarOpen && (
            <div>
              <div style={{ color: C.white, fontWeight: 800, fontSize: 16 }}>UnikTap</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Админ-панель</div>
            </div>
          )}
        </div>

        <div style={{ padding: "12px 8px", flex: 1 }}>
          {SECTIONS.map(s => (
            <button key={s.key} onClick={() => setSection(s.key)} style={{
              display: "flex", alignItems: "center", gap: 10,
              width: "100%", padding: sidebarOpen ? "10px 12px" : "10px 8px",
              border: "none", borderRadius: 8, cursor: "pointer",
              background: section === s.key ? "rgba(45,127,249,0.15)" : "transparent",
              color: section === s.key ? "#5b9dfc" : "rgba(255,255,255,0.5)",
              fontSize: 13, fontWeight: 600, fontFamily: font,
              marginBottom: 2, transition: "all 0.2s",
              justifyContent: sidebarOpen ? "flex-start" : "center",
            }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              {sidebarOpen && s.label}
            </button>
          ))}
        </div>

        <div style={{
          padding: sidebarOpen ? "14px 18px" : "14px 8px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}>
          <button onClick={() => { setToken(null); setUser(null); }} style={{
            background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8,
            color: "rgba(255,255,255,0.4)", padding: sidebarOpen ? "8px 12px" : "8px",
            width: "100%", cursor: "pointer", fontSize: 12, fontFamily: font,
            display: "flex", alignItems: "center", gap: 8,
            justifyContent: sidebarOpen ? "flex-start" : "center",
          }}>
            <span>🚪</span>
            {sidebarOpen && "Выйти"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "24px 28px", maxWidth: 1200, overflow: "auto" }}>
        {section === "universities" && <UniversitiesSection />}
        {section === "faculties" && <FacultiesSection />}
        {section === "specialties" && <SpecialtiesSection />}
        {section === "documents" && <DocumentsSection />}
        {section === "applications" && <ApplicationsSection />}
      </div>
    </div>
  );
}
