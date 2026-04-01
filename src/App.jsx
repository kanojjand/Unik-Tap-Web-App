import { useState, useEffect, useCallback } from "react";
import { sbFetch } from "./supabase.js";
import UniversityList from "./components/UniversityList.jsx";
import Favorites from "./components/Favorites.jsx";
import TabBar from "./components/TabBar.jsx";
import { useFavorites } from "./hooks/useFavorites.js";

/* ═══════════════════════════════════════
   UnikTap — User-facing App
   Connected to Supabase
   ═══════════════════════════════════════ */

const C = {
  navy: "#0a1628",
  navyMid: "#132038",
  blue: "#2d7ff9",
  blueLight: "#5b9dfc",
  bluePale: "#eef4ff",
  accent: "#6c5ce7",
  green: "#00b894",
  greenPale: "#e6faf5",
  orange: "#f39c12",
  orangeBg: "#fff8e7",
  red: "#e74c3c",
  redBg: "#fef0ed",
  bg: "#f5f7fb",
  card: "#ffffff",
  border: "#e8ecf2",
  t1: "#0f1d30",
  t2: "#4a5568",
  t3: "#8896a6",
  white: "#ffffff",
};

// ─── Components ───

function AppHeader({ title, onBack }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.navyMid}, ${C.navy})`,
      padding: "0 16px", height: 56,
      display: "flex", alignItems: "center", gap: 10,
      position: "sticky", top: 0, zIndex: 100,
    }}>
      {onBack && (
        <button onClick={onBack} style={{
          background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10,
          width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: C.white, fontSize: 17, flexShrink: 0,
        }}>←</button>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: `linear-gradient(135deg, ${C.blue}, ${C.accent})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, flexShrink: 0,
        }}>🎓</div>
        <span style={{
          color: C.white, fontWeight: 800, fontSize: 17,
          letterSpacing: "-0.01em",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{title || "UnikTap"}</span>
      </div>
    </div>
  );
}

function BottomNav({ active, onNavigate, badge }) {
  const items = [
    { key: "search", label: "Поиск", icon: "🔍" },
    { key: "apps", label: "Заявки", icon: "📋" },
    { key: "profile", label: "Профиль", icon: "👤" },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: C.white, borderTop: `1px solid ${C.border}`,
      display: "flex", height: 60, zIndex: 100,
      boxShadow: "0 -2px 12px rgba(0,0,0,0.04)",
      maxWidth: 430, margin: "0 auto",
    }}>
      {items.map(it => (
        <button key={it.key} onClick={() => onNavigate(it.key)} style={{
          flex: 1, border: "none", background: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 2, position: "relative",
        }}>
          <span style={{ fontSize: 20 }}>{it.icon}</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: active === it.key ? C.blue : C.t3 }}>{it.label}</span>
          {it.key === "apps" && badge > 0 && (
            <span style={{
              position: "absolute", top: 6, right: "calc(50% - 18px)",
              background: C.red, color: C.white, fontSize: 9, fontWeight: 700,
              borderRadius: 10, padding: "1px 5px", minWidth: 14, textAlign: "center",
            }}>{badge}</span>
          )}
          {active === it.key && (
            <div style={{
              position: "absolute", bottom: 0, left: "30%", right: "30%",
              height: 3, borderRadius: "3px 3px 0 0",
              background: `linear-gradient(90deg, ${C.blue}, ${C.accent})`,
            }} />
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Screens ───

function SearchScreen({ onSelectUni }) {
  const [unis, setUnis] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await sbFetch("universities?is_active=eq.true&order=sort_order.asc");
        setUnis(data);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  const filtered = unis.filter(u =>
    u.name.toLowerCase().includes(q.toLowerCase()) ||
    u.short_name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ padding: "16px 16px 8px" }}>
        <div style={{ fontSize: 14, color: C.t2, marginBottom: 10 }}>Найди свой университет в Шымкенте</div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
          padding: "10px 14px",
        }}>
          <span style={{ color: C.t3 }}>🔍</span>
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="Университет, специальность..."
            style={{ border: "none", outline: "none", flex: 1, fontSize: 14, color: C.t1, background: "transparent" }} />
        </div>
        <div style={{ fontSize: 12, color: C.t3, marginTop: 10 }}>
          {loading ? "Загрузка..." : `Все университеты (${filtered.length})`}
        </div>
      </div>
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(u => (
          <div key={u.id} onClick={() => onSelectUni(u)} style={{
            background: C.card, borderRadius: 14, padding: "16px 18px",
            border: `1px solid ${C.border}`, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 14,
            transition: "box-shadow 0.2s, transform 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(45,127,249,0.1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 12, background: C.bluePale,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, flexShrink: 0,
            }}>🎓</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.t1, lineHeight: 1.3 }}>{u.name}</div>
              <div style={{ fontSize: 12, color: C.t3, marginTop: 4, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span>📍 {u.city}</span>
                {u.dormitory && <span>🏠 Общежитие</span>}
              </div>
            </div>
            <div style={{
              background: u.ent_min >= 70 ? "#fff0e0" : C.bluePale,
              color: u.ent_min >= 70 ? "#e67e22" : C.blue,
              padding: "4px 10px", borderRadius: 8,
              fontSize: 12, fontWeight: 700, flexShrink: 0, whiteSpace: "nowrap",
            }}>ЕНТ ≥ {u.ent_min}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UniDetailScreen({ uni, onBack, onSelectFaculty }) {
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await sbFetch(`faculties?university_id=eq.${uni.id}&is_active=eq.true&order=sort_order.asc`);
      setFaculties(data);
    })();
  }, [uni.id]);

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{
        background: `linear-gradient(135deg, ${C.navyMid}, ${C.navy})`,
        padding: "24px 20px 28px", textAlign: "center",
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, margin: "0 auto 14px",
          background: "rgba(255,255,255,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30,
        }}>🎓</div>
        <div style={{ color: C.white, fontWeight: 800, fontSize: 17, lineHeight: 1.3 }}>{uni.name}</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 6 }}>г. {uni.city}</div>
      </div>

      <div style={{ padding: "20px 16px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
          КОНТАКТЫ И ССЫЛКИ
        </div>
        {[
          { icon: "📸", label: "Instagram", value: uni.instagram },
          { icon: "🌐", label: "Веб-сайт", value: uni.website },
          { icon: "📍", label: "Адрес", value: uni.address },
          { icon: "📞", label: "Приёмная комиссия", value: uni.phone },
          { icon: "🏠", label: "Общежитие", value: uni.dormitory ? "Доступно" : "Нет данных" },
        ].map((c, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "14px 0", borderBottom: i < 4 ? `1px solid ${C.border}` : "none",
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, background: C.bluePale,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0,
            }}>{c.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>{c.label}</div>
              <div style={{ fontSize: 12, color: C.t3 }}>{c.value || "—"}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "0 16px 20px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
          ФАКУЛЬТЕТЫ
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {faculties.map(f => (
            <div key={f.id} onClick={() => onSelectFaculty(f)} style={{
              background: C.card, borderRadius: 14, padding: "20px 14px",
              border: `1px solid ${C.border}`, cursor: "pointer", textAlign: "center",
              transition: "box-shadow 0.2s, transform 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(45,127,249,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.t1, lineHeight: 1.3 }}>{f.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FacultyScreen({ faculty, uni, onBack, onApply }) {
  const [specs, setSpecs] = useState([]);
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    (async () => {
      const [s, d] = await Promise.all([
        sbFetch(`specialties?faculty_id=eq.${faculty.id}&is_active=eq.true&order=sort_order.asc`),
        sbFetch(`required_documents?faculty_id=eq.${faculty.id}&order=sort_order.asc`),
      ]);
      setSpecs(s);
      setDocs(d);
    })();
  }, [faculty.id]);

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{
        background: `linear-gradient(135deg, ${C.navyMid}, ${C.navy})`,
        padding: "24px 20px 28px", textAlign: "center",
      }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>{faculty.icon}</div>
        <div style={{ color: C.white, fontWeight: 800, fontSize: 18, lineHeight: 1.3 }}>{faculty.name}</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 6 }}>{uni.short_name}</div>
      </div>
      <div style={{ padding: "20px 16px" }}>
        <div style={{
          background: C.bluePale, borderRadius: 12, padding: "14px 16px",
          display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
        }}>
          <span style={{ fontSize: 20 }}>📍</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>Адрес факультета</div>
            <div style={{ fontSize: 12, color: C.t2 }}>{faculty.address || uni.address}</div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
            СПЕЦИАЛЬНОСТИ
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {specs.map((s, i) => (
              <div key={s.id} style={{
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
                padding: "12px 14px", display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: `linear-gradient(135deg, ${C.blue}20, ${C.accent}20)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: C.blue, flexShrink: 0,
                }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 13, color: C.t1, fontWeight: 500 }}>{s.name}</span>
                  {s.tuition_price && (
                    <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{s.tuition_price.toLocaleString()} ₸/год</div>
                  )}
                </div>
                {s.grant_score && (
                  <span style={{ fontSize: 11, color: C.green, fontWeight: 700, background: C.greenPale, padding: "2px 8px", borderRadius: 6 }}>
                    Грант: {s.grant_score}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
            ДОКУМЕНТЫ ДЛЯ ПОСТУПЛЕНИЯ
          </div>
          <div style={{ background: "#fffbf0", border: "1px solid #f5e6c8", borderRadius: 12, padding: 16 }}>
            {docs.map((d, i) => (
              <div key={d.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "6px 0" }}>
                <span style={{ color: C.green, fontSize: 14, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 13, color: C.t1, lineHeight: 1.4 }}>
                  {d.name}
                  {d.note && <span style={{ color: C.t3, fontStyle: "italic" }}> ({d.note})</span>}
                  {!d.is_required && <span style={{ color: C.orange, fontSize: 11, marginLeft: 4 }}>необязательно</span>}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => onApply(specs)} style={{
          width: "100%", padding: 16,
          background: `linear-gradient(135deg, ${C.blue}, ${C.accent})`,
          color: C.white, border: "none", borderRadius: 14,
          fontSize: 15, fontWeight: 700, cursor: "pointer",
          boxShadow: `0 4px 20px ${C.blue}40`,
        }}>📝 Подать заявку</button>
      </div>
    </div>
  );
}

function ApplyFormScreen({ faculty, uni, specs, onBack, onSubmit }) {
  const [form, setForm] = useState({
    last_name: "", first_name: "", middle_name: "",
    birth_date: "", phone: "", email: "",
    specialty_id: specs[0]?.id || "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.last_name.trim()) e.last_name = true;
    if (!form.first_name.trim()) e.first_name = true;
    if (!form.birth_date) e.birth_date = true;
    if (!form.phone.trim()) e.phone = true;
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitting(true);
    try {
      await sbFetch("applications", {
        method: "POST",
        body: JSON.stringify({
          university_id: uni.id,
          faculty_id: faculty.id,
          specialty_id: form.specialty_id || null,
          last_name: form.last_name,
          first_name: form.first_name,
          middle_name: form.middle_name || null,
          birth_date: form.birth_date,
          phone: form.phone,
          email: form.email || null,
        }),
        prefer: "return=minimal",
      });
      const specName = specs.find(s => s.id == form.specialty_id)?.name || "";
      onSubmit({
        university: uni.short_name,
        faculty: faculty.name,
        specialty: specName,
        date: new Date().toLocaleDateString("ru-RU"),
      });
    } catch (e) {
      alert("Ошибка отправки: " + e.message);
    }
    setSubmitting(false);
  };

  const inp = (key) => ({
    width: "100%", padding: "12px 14px",
    border: `1.5px solid ${errors[key] ? C.red : C.border}`,
    borderRadius: 10, fontSize: 14, color: C.t1,
    boxSizing: "border-box", outline: "none",
    background: errors[key] ? C.redBg : C.white,
  });

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ padding: "20px 16px" }}>
        <div style={{
          background: C.bluePale, borderRadius: 12, padding: "14px 16px",
          marginBottom: 24, display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 20 }}>{faculty.icon}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>{faculty.name}</div>
            <div style={{ fontSize: 12, color: C.t3 }}>{uni.short_name}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.t2, marginBottom: 6, display: "block" }}>Фамилия *</label>
            <input style={inp("last_name")} value={form.last_name}
              onChange={e => { setForm({...form, last_name: e.target.value}); setErrors({...errors, last_name: false}); }}
              placeholder="Иванов" />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.t2, marginBottom: 6, display: "block" }}>Имя *</label>
            <input style={inp("first_name")} value={form.first_name}
              onChange={e => { setForm({...form, first_name: e.target.value}); setErrors({...errors, first_name: false}); }}
              placeholder="Иван" />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.t2, marginBottom: 6, display: "block" }}>Отчество</label>
            <input style={inp("middle_name")} value={form.middle_name}
              onChange={e => setForm({...form, middle_name: e.target.value})}
              placeholder="Иванович" />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.t2, marginBottom: 6, display: "block" }}>Дата рождения *</label>
            <input type="date" style={inp("birth_date")} value={form.birth_date}
              onChange={e => { setForm({...form, birth_date: e.target.value}); setErrors({...errors, birth_date: false}); }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.t2, marginBottom: 6, display: "block" }}>Телефон *</label>
            <input style={inp("phone")} value={form.phone}
              onChange={e => { setForm({...form, phone: e.target.value}); setErrors({...errors, phone: false}); }}
              placeholder="+7 7XX XXX XX XX" />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.t2, marginBottom: 6, display: "block" }}>Email</label>
            <input type="email" style={inp("email")} value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              placeholder="email@example.com" />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.t2, marginBottom: 6, display: "block" }}>Специальность</label>
            <select style={{ ...inp("specialty_id"), appearance: "auto" }} value={form.specialty_id}
              onChange={e => setForm({...form, specialty_id: e.target.value})}>
              {specs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        {Object.values(errors).some(Boolean) && (
          <div style={{
            background: C.redBg, borderRadius: 10, padding: "10px 14px",
            marginTop: 16, fontSize: 13, color: C.red,
          }}>Заполните обязательные поля *</div>
        )}

        <button onClick={handleSubmit} disabled={submitting} style={{
          width: "100%", padding: 16, marginTop: 20,
          background: `linear-gradient(135deg, ${C.green}, #00a884)`,
          color: C.white, border: "none", borderRadius: 14,
          fontSize: 15, fontWeight: 700, cursor: "pointer",
          boxShadow: `0 4px 20px ${C.green}40`,
          opacity: submitting ? 0.6 : 1,
        }}>
          {submitting ? "⏳ Отправка..." : "✅ Отправить заявку"}
        </button>
      </div>
    </div>
  );
}

function ApplicationsScreen({ applications }) {
  const st = {
    pending: { label: "На рассмотрении", bg: C.orangeBg, color: C.orange, icon: "⏳" },
    accepted: { label: "Принята", bg: C.greenPale, color: C.green, icon: "✅" },
    rejected: { label: "Отклонена", bg: C.redBg, color: C.red, icon: "❌" },
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ padding: "20px 16px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>
          МОИ ЗАЯВКИ ({applications.length})
        </div>
        {applications.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "50px 20px",
            background: C.card, borderRadius: 16, border: `1px solid ${C.border}`,
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.t1 }}>Заявок пока нет</div>
            <div style={{ fontSize: 13, color: C.t3, marginTop: 6 }}>Выберите факультет и подайте заявку</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {applications.map((app, i) => {
              const s = st[app.status] || st.pending;
              return (
                <div key={i} style={{
                  background: C.card, borderRadius: 14, padding: 16,
                  border: `1px solid ${C.border}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{app.university}</div>
                      <div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>{app.faculty}</div>
                    </div>
                    <span style={{
                      background: s.bg, color: s.color, padding: "4px 10px",
                      borderRadius: 8, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
                    }}>{s.icon} {s.label}</span>
                  </div>
                  <div style={{
                    display: "flex", gap: 16, fontSize: 12, color: C.t3,
                    borderTop: `1px solid ${C.border}`, paddingTop: 10,
                  }}>
                    <span>🎓 {app.specialty}</span>
                    <span>📅 {app.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function TelegramNotif({ app, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.55)", display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 200,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.white, borderRadius: 18, width: "min(340px, 88vw)",
        overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        <div style={{
          background: "linear-gradient(135deg, #0088cc, #00aced)",
          padding: "18px 20px", display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>✈️</div>
          <div>
            <div style={{ color: C.white, fontWeight: 700, fontSize: 14 }}>UnikTap Bot</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>@UnikTapBot</div>
          </div>
        </div>
        <div style={{ padding: "18px 20px" }}>
          <div style={{
            background: "#e3f2fd", borderRadius: "14px 14px 14px 4px",
            padding: "14px 16px", fontSize: 13, lineHeight: 1.6, color: C.t1,
          }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>✅ Заявка успешно подана!</div>
            <div>🏫 <strong>{app.university}</strong></div>
            <div>📋 {app.faculty}</div>
            <div>🎓 {app.specialty}</div>
            <div>📅 {app.date}</div>
          </div>
        </div>
        <div style={{ padding: "0 20px 18px", textAlign: "center" }}>
          <button onClick={onClose} style={{
            background: C.blue, color: C.white, border: "none", borderRadius: 10,
            padding: "10px 30px", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>Понятно</button>
        </div>
      </div>
    </div>
  );
}

function ProfileScreen() {
  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ padding: "20px 16px", textAlign: "center" }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%", background: C.bluePale,
          margin: "20px auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34,
        }}>👤</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.t1 }}>Профиль</div>
        <div style={{ fontSize: 13, color: C.t3, marginTop: 6 }}>Скоро здесь появится личный кабинет</div>
      </div>
    </div>
  );
}

// ─── Main App ───

export default function App() {
  const [tab, setTab] = useState("search");
  const [screen, setScreen] = useState({ type: "list" });
  const [applications, setApplications] = useState([]);
  const [notification, setNotification] = useState(null);
  const [unis, setUnis] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingUnis, setLoadingUnis] = useState(true);
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    (async () => {
      try {
        const data = await sbFetch("universities?is_active=eq.true&order=sort_order.asc");
        setUnis(data);
      } catch (e) {
        console.error(e);
      }
      setLoadingUnis(false);
    })();
  }, []);

  const pendingCount = applications.filter(a => a.status === "pending").length;
  const filteredUnis = unis.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.short_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNav = (key) => {
    setTab(key);
    setScreen({
      type:
        key === "search"
          ? "list"
          : key === "favorites"
            ? "favorites"
            : key === "apps"
              ? "applications"
              : "profile",
    });
  };

  const getTitle = () => {
    if (screen.type === "uniDetail") return screen.uni.short_name;
    if (screen.type === "faculty") return screen.faculty.name;
    if (screen.type === "applyForm") return "Подача заявки";
    if (screen.type === "favorites") return "Избранное";
    if (screen.type === "applications") return "Мои заявки";
    if (screen.type === "profile") return "Профиль";
    return "UnikTap";
  };

  const getBack = () => {
    if (screen.type === "uniDetail") return () => setScreen({ type: "list" });
    if (screen.type === "faculty") return () => setScreen({ type: "uniDetail", uni: screen.uni });
    if (screen.type === "applyForm") return () => setScreen({ type: "faculty", faculty: screen.faculty, uni: screen.uni });
    return null;
  };

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: C.bg, position: "relative" }}>
      <AppHeader title={getTitle()} onBack={getBack()} />

      {screen.type === "list" && (
        <>
          <div style={{ padding: "16px 16px 8px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "10px 14px",
              }}
            >
              <span style={{ color: C.t3 }}>🔍</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Университет, специальность..."
                style={{
                  border: "none",
                  outline: "none",
                  flex: 1,
                  fontSize: 14,
                  color: C.t1,
                  background: "transparent",
                }}
              />
            </div>
          </div>
          <UniversityList
            universities={filteredUnis}
            loading={loadingUnis}
            colors={C}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onSelectUni={(uni) => setScreen({ type: "uniDetail", uni })}
          />
        </>
      )}
      {screen.type === "favorites" && (
        <Favorites
          favorites={favorites}
          colors={C}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onSelectUni={(uni) => setScreen({ type: "uniDetail", uni })}
        />
      )}
      {screen.type === "uniDetail" && (
        <UniDetailScreen uni={screen.uni} onBack={getBack()}
          onSelectFaculty={f => setScreen({ type: "faculty", faculty: f, uni: screen.uni })} />
      )}
      {screen.type === "faculty" && (
        <FacultyScreen faculty={screen.faculty} uni={screen.uni} onBack={getBack()}
          onApply={specs => setScreen({ type: "applyForm", faculty: screen.faculty, uni: screen.uni, specs })} />
      )}
      {screen.type === "applyForm" && (
        <ApplyFormScreen faculty={screen.faculty} uni={screen.uni} specs={screen.specs}
          onBack={getBack()}
          onSubmit={appData => {
            const newApp = { ...appData, status: "pending" };
            setApplications(prev => [newApp, ...prev]);
            setNotification(newApp);
            setTab("apps");
            setScreen({ type: "applications" });
          }} />
      )}
      {screen.type === "applications" && <ApplicationsScreen applications={applications} />}
      {screen.type === "profile" && <ProfileScreen />}

      <TabBar
        active={tab}
        onNavigate={handleNav}
        badge={pendingCount}
        favoritesCount={favorites.length}
        colors={C}
      />
      {notification && <TelegramNotif app={notification} onClose={() => setNotification(null)} />}
    </div>
  );
}
