import { useState } from "react";

// ─── Color tokens ───────────────────────────────────────────────
const C = {
  bg: "#FFF8F4",
  card: "#FFFFFF",
  border: "#FFD9C7",
  primary: "#FB5607",
  primaryLight: "#FFF0E6",
  primaryMid: "#FFE8DC",
  text: "#1A1A1A",
  textSub: "#888888",
  textMuted: "#BBBBBB",
  tagMoney: { bg: "#FFF3CC", color: "#8A6000" },
  tagTime: { bg: "#FFE8DC", color: "#C04000" },
  green: { bg: "#EAFAF2", color: "#1A7A4A" },
  yellow: "#FFBE0B",
};

// ─── Sample data ─────────────────────────────────────────────────
const INIT_PENDING = [
  { id: 1, title: "Can never find my keys, waste 5 min every morning", money: 20, time: 30 },
  { id: 2, title: "Bathroom light too dim, can't see well when getting ready", money: 40, time: 60 },
  { id: 3, title: "Charging cable too short, have to hunch over to charge", money: 15, time: 10 },
  { id: 4, title: "Never know what to eat for lunch, spend too long deciding", money: 0, time: 20 },
  { id: 5, title: "Desk cables are a mess, stresses me out every day", money: 25, time: 45 },
];

const INIT_FIXED = [
  { id: 10, title: "Charging cable too short", solution: "Bought a 2m cable", money: 12, time: 5, ago: "3 days ago" },
  { id: 11, title: "Couldn't find important files", solution: "Created folder system", money: 0, time: 20, ago: "1 week ago" },
  { id: 12, title: "Always losing track of socks", solution: "Got a drawer organizer", money: 18, time: 10, ago: "2 weeks ago" },
];

// ─── Helpers ─────────────────────────────────────────────────────
function fmtTime(min) {
  if (!min || min === 0) return "No time limit";
  if (min < 60) return `${min} min max`;
  return `${min / 60}h max`;
}
function fmtMoney(n) {
  if (!n || n === 0) return "Free";
  return `$${n} max`;
}

// ─── Shared components ───────────────────────────────────────────
function Tag({ children, style }) {
  return (
    <span style={{
      fontSize: 11, padding: "3px 10px", borderRadius: 10,
      fontWeight: 500, ...style,
    }}>{children}</span>
  );
}

function MoneyTag({ money }) {
  return <Tag style={{ background: C.tagMoney.bg, color: C.tagMoney.color }}>{fmtMoney(money)}</Tag>;
}
function TimeTag({ time }) {
  return <Tag style={{ background: C.tagTime.bg, color: C.tagTime.color }}>{fmtTime(time)}</Tag>;
}

function PrimaryBtn({ children, onClick, disabled, style }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: "100%", padding: "15px", borderRadius: 18, border: "none",
      background: disabled ? C.border : C.primary,
      color: "#fff", fontSize: 15, fontWeight: 700,
      cursor: disabled ? "default" : "pointer",
      letterSpacing: 0.2, transition: "opacity .15s", ...style,
    }}>{children}</button>
  );
}

function GhostBtn({ children, onClick, style }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", padding: "12px", borderRadius: 18,
      border: `1.5px solid ${C.border}`, background: "transparent",
      color: C.primary, fontSize: 14, fontWeight: 600,
      cursor: "pointer", ...style,
    }}>{children}</button>
  );
}

// ─── Bottom Nav ──────────────────────────────────────────────────
const NAV_ITEMS = [
  { key: "today", label: "Today", icon: "⚡" },
  { key: "pending", label: "Pending", icon: "📋" },
  { key: "fixed", label: "Fixed", icon: "✓" },
  { key: "settings", label: "Settings", icon: "⚙" },
];

function BottomNav({ active, setActive, pendingCount }) {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%",
      transform: "translateX(-50%)",
      width: "100%", maxWidth: 390,
      background: "#fff",
      borderTop: `1px solid ${C.border}`,
      display: "flex", justifyContent: "space-around",
      padding: "8px 0 20px",
      zIndex: 50,
    }}>
      {NAV_ITEMS.map(({ key, label, icon }) => (
        <button key={key} onClick={() => setActive(key)} style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 3, background: "none", border: "none",
          color: active === key ? C.primary : C.textMuted,
          cursor: "pointer", position: "relative", padding: "4px 12px",
          fontSize: 10, fontWeight: active === key ? 600 : 400,
        }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          {label}
          {key === "pending" && pendingCount > 0 && (
            <div style={{
              position: "absolute", top: 0, right: 8,
              width: 16, height: 16, borderRadius: "50%",
              background: C.primary, color: "#fff",
              fontSize: 9, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{pendingCount}</div>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Page: Today's Fix ───────────────────────────────────────────
function TodayPage({ pending, onFixed }) {
  const [picked, setPicked] = useState(null);
  const [showDone, setShowDone] = useState(false);
  const [solution, setSolution] = useState("");
  const [actualMoney, setActualMoney] = useState("");
  const [actualTime, setActualTime] = useState("");
  const [celebrating, setCelebrating] = useState(null);
  const [shaking, setShaking] = useState(false);

  function pickRandom() {
    if (pending.length === 0) return;
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
    const pool = picked ? pending.filter(i => i.id !== picked.id) : pending;
    const src = pool.length > 0 ? pool : pending;
    setPicked(src[Math.floor(Math.random() * src.length)]);
    setShowDone(false);
    setSolution(""); setActualMoney(""); setActualTime("");
  }

  function handleFixed() {
    if (!picked) return;
    const result = {
      ...picked,
      solution: solution || "Sorted it out",
      money: Number(actualMoney) || picked.money,
      time: Number(actualTime) || picked.time,
      ago: "Just now",
    };
    setCelebrating(result);
    onFixed(picked.id, result);
    setPicked(null);
    setShowDone(false);
  }

  if (celebrating) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 6 }}>
          Fixed it!
        </div>
        <div style={{ fontSize: 14, color: C.textSub, marginBottom: 28 }}>
          Your life just got a little better
        </div>
        <div style={{
          background: C.card, borderRadius: 20, border: `1px solid ${C.border}`,
          padding: "20px", marginBottom: 24,
        }}>
          <div style={{ fontSize: 13, color: C.textSub, marginBottom: 6, textDecoration: "line-through" }}>
            {celebrating.title}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 16 }}>
            ✓ {celebrating.solution}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.primary }}>${celebrating.money}</div>
              <div style={{ fontSize: 11, color: C.textSub }}>spent</div>
            </div>
            <div style={{ width: 1, background: C.border }} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.primary }}>{celebrating.time}m</div>
              <div style={{ fontSize: 11, color: C.textSub }}>time</div>
            </div>
          </div>
        </div>
        <PrimaryBtn onClick={() => setCelebrating(null)}>
          Back to Home
        </PrimaryBtn>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px 20px 100px" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.text, letterSpacing: "-0.5px" }}>
          Today's Fix
        </div>
        <div style={{ fontSize: 13, color: C.textSub, marginTop: 2 }}>
          One small fix a day keeps the frustration away
        </div>
      </div>

      {pending.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎊</div>
          <div style={{ fontSize: 17, fontWeight: 600, color: C.text, marginBottom: 8 }}>
            All caught up!
          </div>
          <div style={{ fontSize: 13, color: C.textSub }}>
            Add more annoyances to keep fixing
          </div>
        </div>
      ) : !picked ? (
        <div style={{ textAlign: "center", padding: "48px 0 32px" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎰</div>
          <div style={{ fontSize: 17, fontWeight: 600, color: C.text, marginBottom: 8 }}>
            Ready to fix something?
          </div>
          <div style={{ fontSize: 13, color: C.textSub, marginBottom: 32 }}>
            Tap below to randomly pick one annoyance to fix today
          </div>
          <PrimaryBtn
            onClick={pickRandom}
            style={{ animation: shaking ? "shake .5s" : "none" }}
          >
            Fix One Thing Today ⚡
          </PrimaryBtn>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 8, fontSize: 12, color: C.textSub }}>
            Today's randomly picked annoyance
          </div>
          <div style={{
            background: C.card, borderRadius: 20,
            border: `1.5px solid ${C.primary}`,
            padding: "20px", marginBottom: 16, textAlign: "center",
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔧</div>
            <div style={{
              fontSize: 16, fontWeight: 600, color: C.text,
              lineHeight: 1.4, marginBottom: 14,
            }}>
              {picked.title}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
              <MoneyTag money={picked.money} />
              <TimeTag time={picked.time} />
            </div>
          </div>

          {!showDone ? (
            <>
              <PrimaryBtn onClick={() => setShowDone(true)} style={{ marginBottom: 10 }}>
                Fix It! 💪
              </PrimaryBtn>
              <GhostBtn onClick={pickRandom}>Pick a different one</GhostBtn>
            </>
          ) : (
            <div style={{
              background: C.card, borderRadius: 20,
              border: `1px solid ${C.border}`, padding: "20px",
            }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 16 }}>
                How did you fix it?
              </div>
              <textarea
                placeholder="Briefly describe your solution (optional)"
                value={solution}
                onChange={e => setSolution(e.target.value)}
                style={{
                  width: "100%", background: C.bg, border: `1px solid ${C.border}`,
                  borderRadius: 14, padding: "12px 14px", fontSize: 13,
                  color: C.text, resize: "none", height: 80,
                  outline: "none", fontFamily: "inherit", marginBottom: 12,
                }}
              />
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: C.textSub, marginBottom: 5 }}>Actual cost ($)</div>
                  <input type="number" placeholder={`$${picked.money}`} value={actualMoney}
                    onChange={e => setActualMoney(e.target.value)}
                    style={{
                      width: "100%", background: C.bg, border: `1px solid ${C.border}`,
                      borderRadius: 12, padding: "10px 12px", fontSize: 13,
                      color: C.text, outline: "none", fontFamily: "inherit",
                    }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: C.textSub, marginBottom: 5 }}>Actual time (min)</div>
                  <input type="number" placeholder={`${picked.time}`} value={actualTime}
                    onChange={e => setActualTime(e.target.value)}
                    style={{
                      width: "100%", background: C.bg, border: `1px solid ${C.border}`,
                      borderRadius: 12, padding: "10px 12px", fontSize: 13,
                      color: C.text, outline: "none", fontFamily: "inherit",
                    }} />
                </div>
              </div>
              <PrimaryBtn onClick={handleFixed} style={{ marginBottom: 8 }}>
                Mark as Fixed ✓
              </PrimaryBtn>
              <GhostBtn onClick={() => setShowDone(false)}>Cancel</GhostBtn>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Page: Pending ───────────────────────────────────────────────
function PendingPage({ items, onAdd, onDelete }) {
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [money, setMoney] = useState("");
  const [time, setTime] = useState("");

  function handleAdd() {
    if (!title.trim()) return;
    onAdd({ id: Date.now(), title, money: Number(money) || 0, time: Number(time) || 0 });
    setTitle(""); setMoney(""); setTime("");
    setShowAdd(false);
  }

  return (
    <div style={{ padding: "16px 20px 100px", position: "relative" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.text, letterSpacing: "-0.5px" }}>
          Pending
        </div>
        <div style={{ fontSize: 13, color: C.textSub, marginTop: 2 }}>
          {items.length} annoyance{items.length !== 1 ? "s" : ""} waiting to be fixed
        </div>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🧹</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 6 }}>
            Nothing here yet
          </div>
          <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.6 }}>
            Start tracking the small things<br />that bother you every day
          </div>
        </div>
      ) : (
        items.map(item => (
          <div key={item.id} style={{
            background: C.card, borderRadius: 16,
            border: `1px solid ${C.border}`,
            padding: "14px 16px", marginBottom: 10,
          }}>
            <div style={{
              fontSize: 14, fontWeight: 500, color: C.text,
              lineHeight: 1.4, marginBottom: 10,
            }}>
              {item.title}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 6 }}>
                <MoneyTag money={item.money} />
                <TimeTag time={item.time} />
              </div>
              <button onClick={() => onDelete(item.id)} style={{
                background: "none", border: "none", color: C.textMuted,
                cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "0 4px",
              }}>×</button>
            </div>
          </div>
        ))
      )}

      {/* FAB */}
      <button onClick={() => setShowAdd(true)} style={{
        position: "fixed", bottom: 90, right: "calc(50% - 175px)",
        width: 52, height: 52, borderRadius: "50%",
        background: C.primary, border: "none", color: "#fff",
        fontSize: 26, cursor: "pointer", boxShadow: "0 4px 16px rgba(251,86,7,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 40,
      }}>+</button>

      {/* Add modal */}
      {showAdd && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          zIndex: 100,
        }} onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div style={{
            background: C.bg, borderRadius: "24px 24px 0 0",
            padding: "24px 20px 48px", width: "100%", maxWidth: 390,
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: 20,
            }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: C.text }}>
                Add an Annoyance
              </div>
              <button onClick={() => setShowAdd(false)} style={{
                background: "none", border: "none", fontSize: 22,
                color: C.textSub, cursor: "pointer",
              }}>×</button>
            </div>

            <textarea autoFocus
              placeholder="What's been bothering you?"
              value={title} onChange={e => setTitle(e.target.value)}
              style={{
                width: "100%", background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 14, padding: "12px 14px", fontSize: 14,
                color: C.text, resize: "none", height: 90,
                outline: "none", fontFamily: "inherit", marginBottom: 12,
              }} />

            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: C.textSub, marginBottom: 5 }}>Max budget ($)</div>
                <input type="number" placeholder="$ 50" value={money}
                  onChange={e => setMoney(e.target.value)}
                  style={{
                    width: "100%", background: C.card, border: `1px solid ${C.border}`,
                    borderRadius: 12, padding: "10px 12px", fontSize: 13,
                    color: C.text, outline: "none", fontFamily: "inherit",
                  }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: C.textSub, marginBottom: 5 }}>Max time (min)</div>
                <input type="number" placeholder="30" value={time}
                  onChange={e => setTime(e.target.value)}
                  style={{
                    width: "100%", background: C.card, border: `1px solid ${C.border}`,
                    borderRadius: 12, padding: "10px 12px", fontSize: 13,
                    color: C.text, outline: "none", fontFamily: "inherit",
                  }} />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: C.textSub, marginBottom: 8 }}>Quick budget</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["$10","$30","$50","$100"].map(v => (
                  <button key={v} onClick={() => setMoney(v.slice(1))} style={{
                    padding: "4px 12px", borderRadius: 12,
                    border: `1px solid ${C.border}`,
                    background: money === v.slice(1) ? C.primary : C.primaryLight,
                    color: money === v.slice(1) ? "#fff" : C.primary,
                    fontSize: 12, cursor: "pointer",
                  }}>{v}</button>
                ))}
                {[["15 min","15"],["30 min","30"],["1 hour","60"],["2 hours","120"]].map(([label, val]) => (
                  <button key={val} onClick={() => setTime(val)} style={{
                    padding: "4px 12px", borderRadius: 12,
                    border: `1px solid ${C.border}`,
                    background: time === val ? C.primary : C.primaryLight,
                    color: time === val ? "#fff" : C.primary,
                    fontSize: 12, cursor: "pointer",
                  }}>{label}</button>
                ))}
              </div>
            </div>

            <PrimaryBtn onClick={handleAdd} disabled={!title.trim()}>Done</PrimaryBtn>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page: Fixed ─────────────────────────────────────────────────
function FixedPage({ items }) {
  const totalMoney = items.reduce((s, i) => s + (i.money || 0), 0);
  const totalTime = items.reduce((s, i) => s + (i.time || 0), 0);

  return (
    <div style={{ padding: "16px 20px 100px" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.text, letterSpacing: "-0.5px" }}>
          Fixed
        </div>
        <div style={{ fontSize: 13, color: C.textSub, marginTop: 2 }}>
          Your life improvements so far
        </div>
      </div>

      {/* Stats card */}
      <div style={{
        background: C.card, borderRadius: 20,
        border: `1px solid ${C.border}`, padding: "20px",
        marginBottom: 20, textAlign: "center",
      }}>
        <div style={{ fontSize: 36, fontWeight: 800, color: C.primary, marginBottom: 4 }}>
          {items.length}
        </div>
        <div style={{ fontSize: 13, color: C.textSub, marginBottom: 16 }}>
          annoyance{items.length !== 1 ? "s" : ""} eliminated
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 0 }}>
          {[
            { label: "Total spent", value: `$${totalMoney}` },
            { label: "Total time", value: totalTime < 60 ? `${totalTime}m` : `${(totalTime/60).toFixed(1)}h` },
          ].map((stat, i) => (
            <div key={i} style={{ flex: 1, padding: "0 12px", borderLeft: i > 0 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: C.textSub }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <div style={{ fontSize: 13, color: C.textSub }}>
            No fixes yet — go fix something today!
          </div>
        </div>
      ) : (
        items.map(item => (
          <div key={item.id} style={{
            background: C.card, borderRadius: 16,
            border: `1px solid #F0EDE8`, padding: "14px 16px", marginBottom: 10,
            display: "flex", alignItems: "flex-start", gap: 12,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%",
              background: C.green.bg, display: "flex",
              alignItems: "center", justifyContent: "center",
              flexShrink: 0, marginTop: 1,
            }}>
              <div style={{
                width: 9, height: 6,
                borderLeft: `2px solid ${C.green.color}`,
                borderBottom: `2px solid ${C.green.color}`,
                transform: "rotate(-45deg) translateY(-1px)",
              }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 13, fontWeight: 500, color: C.text,
                textDecoration: "line-through", opacity: 0.45, marginBottom: 4,
              }}>{item.title}</div>
              {item.solution && (
                <div style={{ fontSize: 12, color: C.textSub, marginBottom: 3 }}>
                  ✓ {item.solution}
                </div>
              )}
              <div style={{ fontSize: 11, color: C.textMuted }}>
                ${item.money || 0} · {item.time || 0}min · {item.ago}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── Page: Settings ──────────────────────────────────────────────
function SettingsPage() {
  const [notifTime, setNotifTime] = useState("09:00");
  const [currency, setCurrency] = useState("USD");

  function Row({ label, children }) {
    return (
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 0", borderBottom: `1px solid #F5F0EC`,
      }}>
        <div style={{ fontSize: 14, color: C.text }}>{label}</div>
        {children}
      </div>
    );
  }

  function Section({ title, children }) {
    return (
      <div style={{
        background: C.card, borderRadius: 16,
        border: `1px solid ${C.border}`, padding: "0 16px", marginBottom: 16,
      }}>
        <div style={{ fontSize: 11, color: C.textSub, padding: "12px 0 4px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {title}
        </div>
        {children}
      </div>
    );
  }

  return (
    <div style={{ padding: "16px 20px 100px" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.text, letterSpacing: "-0.5px" }}>
          Settings
        </div>
      </div>

      <Section title="Notifications">
        <Row label="Daily reminder time">
          <input type="time" value={notifTime} onChange={e => setNotifTime(e.target.value)}
            style={{
              border: `1px solid ${C.border}`, borderRadius: 10,
              padding: "6px 10px", fontSize: 13, color: C.text,
              background: C.bg, outline: "none",
            }} />
        </Row>
      </Section>

      <Section title="Preferences">
        <Row label="Currency">
          <select value={currency} onChange={e => setCurrency(e.target.value)}
            style={{
              border: `1px solid ${C.border}`, borderRadius: 10,
              padding: "6px 10px", fontSize: 13, color: C.text,
              background: C.bg, outline: "none",
            }}>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CNY">CNY (¥)</option>
          </select>
        </Row>
      </Section>

      <Section title="Fix Life Plus">
        <Row label="Upgrade to Plus">
          <button style={{
            background: C.primary, border: "none", borderRadius: 12,
            padding: "6px 16px", color: "#fff", fontSize: 13,
            fontWeight: 600, cursor: "pointer",
          }}>$1.99 / mo</button>
        </Row>
        <Row label="Restore purchase">
          <button style={{
            background: "none", border: `1px solid ${C.border}`,
            borderRadius: 12, padding: "6px 16px",
            color: C.primary, fontSize: 13, cursor: "pointer",
          }}>Restore</button>
        </Row>
      </Section>

      <Section title="About">
        <Row label="Version"><span style={{ fontSize: 13, color: C.textSub }}>1.0.0</span></Row>
        <Row label="Rate Fix Life">
          <span style={{ fontSize: 16 }}>⭐</span>
        </Row>
      </Section>
    </div>
  );
}

// ─── Root App ────────────────────────────────────────────────────
export default function FixLife() {
  const [tab, setTab] = useState("today");
  const [pending, setPending] = useState(INIT_PENDING);
  const [fixed, setFixed] = useState(INIT_FIXED);

  function handleAdd(item) {
    setPending(prev => [item, ...prev]);
  }
  function handleDelete(id) {
    setPending(prev => prev.filter(i => i.id !== id));
  }
  function handleFixed(id, result) {
    setPending(prev => prev.filter(i => i.id !== id));
    setFixed(prev => [result, ...prev]);
  }

  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      display: "flex", justifyContent: "center",
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: 390, position: "relative" }}>
        {tab === "today"    && <TodayPage pending={pending} onFixed={handleFixed} />}
        {tab === "pending"  && <PendingPage items={pending} onAdd={handleAdd} onDelete={handleDelete} />}
        {tab === "fixed"    && <FixedPage items={fixed} />}
        {tab === "settings" && <SettingsPage />}
        <BottomNav active={tab} setActive={setTab} pendingCount={pending.length} />
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input:focus, textarea:focus, select:focus { border-color: #FB5607 !important; }
        button:active { opacity: 0.82; transform: scale(0.98); }
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-6px)}
          40%{transform:translateX(6px)}
          60%{transform:translateX(-4px)}
          80%{transform:translateX(4px)}
        }
      `}</style>
    </div>
  );
}
