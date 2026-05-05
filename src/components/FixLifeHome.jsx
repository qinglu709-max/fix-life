import { useState } from "react";

const ITEMS = [
  { id: 1, title: "Can never find my keys — spend 5 min searching every morning", money: 50, time: 30 },
  { id: 2, title: "Bathroom light is too dim for putting on makeup", money: 200, time: 60 },
  { id: 3, title: "Charging cable is too short, have to crouch on the floor", money: 30, time: 10 },
  { id: 4, title: "Always spend 20 min deciding what to eat for lunch", money: 0, time: 20 },
  { id: 5, title: "Cable clutter on my desk drives me crazy", money: 80, time: 45 },
];

const FIXED = [
  { id: 10, title: "Charging cable too short", solution: "Bought a 6-foot cable", money: 12, time: 5, ago: "3 days ago" },
  { id: 11, title: "Couldn't find important files", solution: "Created a folder system", money: 0, time: 20, ago: "1 week ago" },
  { id: 12, title: "Always losing track of socks", solution: "Got a drawer organizer", money: 18, time: 10, ago: "2 weeks ago" },
];

function formatTime(min) {
  if (min < 60) return `${min} min max`;
  return `${min / 60} hr max`;
}

export default function FixLifeHome() {
  const [tab, setTab]         = useState("pending");
  const [items, setItems]     = useState(ITEMS);
  const [showAdd, setShowAdd] = useState(false);
  const [picked, setPicked]   = useState(null);   // today's randomly picked item
  const [newTitle, setNewTitle] = useState("");
  const [newMoney, setNewMoney] = useState("");
  const [newTime, setNewTime]   = useState("");

  function handleAdd() {
    if (!newTitle.trim()) return;
    setItems([
      { id: Date.now(), title: newTitle, money: Number(newMoney) || 0, time: Number(newTime) || 0 },
      ...items,
    ]);
    setNewTitle("");
    setNewMoney("");
    setNewTime("");
    setShowAdd(false);
  }

  function handleDelete(id) {
    setItems(items.filter((i) => i.id !== id));
    if (picked?.id === id) setPicked(null);
  }

  function handleTodayFix() {
    if (items.length === 0) return;
    const random = items[Math.floor(Math.random() * items.length)];
    setPicked(random);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fff8f4",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: "24px 16px",
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 390,
        background: "#fff8f4",
        minHeight: "100vh",
        position: "relative",
      }}>

        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 0 16px",
        }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.5px" }}>
              Fix Life
            </div>
            <div style={{ fontSize: 13, color: "#999", marginTop: 2 }}>
              Small fixes, better life
            </div>
          </div>
          <div style={{
            background: "#FFE8DC",
            borderRadius: 12,
            padding: "4px 12px",
            fontSize: 13,
            color: "#fb5607",
            fontWeight: 600,
          }}>
            {items.length} pending
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[["pending", "Pending"], ["fixed", `Fixed  ${FIXED.length}`]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                padding: "7px 16px",
                borderRadius: 20,
                border: tab === key ? "none" : "1px solid #FFD9C7",
                background: tab === key ? "#fb5607" : "transparent",
                color: tab === key ? "#fff" : "#fb5607",
                fontSize: 13,
                fontWeight: tab === key ? 600 : 400,
                cursor: "pointer",
                transition: "all .15s",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Pending list */}
        {tab === "pending" && (
          <>
            {/* Today's Pick banner */}
            <div style={{
              background: "#FFF0E6",
              borderRadius: 16,
              padding: "12px 16px",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 12,
              border: "1px solid #FFD9C7",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "#fb5607",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, flexShrink: 0,
              }}>⚡</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginBottom: 2 }}>
                  Today's Pick
                </div>
                <div style={{ fontSize: 12, color: "#888" }}>
                  Tap the button below to start fixing
                </div>
              </div>
            </div>

            {/* Cards */}
            {items.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🧹</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", marginBottom: 6 }}>
                  No annoyances yet
                </div>
                <div style={{ fontSize: 13, color: "#999", lineHeight: 1.6 }}>
                  Start tracking the small things<br />that bother you
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: picked?.id === item.id ? "#FFF0E6" : "#fff",
                    borderRadius: 16,
                    border: picked?.id === item.id ? "1.5px solid #fb5607" : "1px solid #FFD9C7",
                    padding: "14px 16px",
                    marginBottom: 10,
                    cursor: "pointer",
                    transition: "transform .15s, box-shadow .15s, background .2s",
                    position: "relative",
                  }}
                  onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
                  onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  {picked?.id === item.id && (
                    <div style={{
                      position: "absolute", top: -1, right: 12,
                      background: "#fb5607", color: "#fff",
                      fontSize: 10, fontWeight: 700,
                      padding: "2px 8px", borderRadius: "0 0 8px 8px",
                      letterSpacing: 0.3,
                    }}>
                      TODAY'S PICK
                    </div>
                  )}
                  <div style={{
                    fontSize: 14, fontWeight: 500, color: "#1a1a1a",
                    lineHeight: 1.45, marginBottom: 10,
                  }}>
                    {item.title}
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <span style={{
                        fontSize: 11, padding: "3px 10px", borderRadius: 10,
                        background: "#FFF3CC", color: "#8a6000", fontWeight: 500,
                      }}>
                        {item.money === 0 ? "Free" : `$${item.money} max`}
                      </span>
                      <span style={{
                        fontSize: 11, padding: "3px 10px", borderRadius: 10,
                        background: "#FFE8DC", color: "#c04000", fontWeight: 500,
                      }}>
                        {formatTime(item.time)}
                      </span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                      style={{
                        background: "none", border: "none", color: "#ccc",
                        cursor: "pointer", fontSize: 16, padding: "0 4px",
                        lineHeight: 1,
                      }}
                    >×</button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* Fixed list */}
        {tab === "fixed" && (
          <>
            <div style={{
              background: "#fff",
              borderRadius: 16,
              border: "1px solid #FFD9C7",
              padding: "16px",
              marginBottom: 16,
              textAlign: "center",
            }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#fb5607", marginBottom: 4 }}>
                {FIXED.length} fixed
              </div>
              <div style={{ fontSize: 13, color: "#999", marginBottom: 12 }}>annoyances eliminated</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a" }}>
                    ${FIXED.reduce((s, i) => s + i.money, 0)}
                  </div>
                  <div style={{ fontSize: 11, color: "#999" }}>Total spent</div>
                </div>
                <div style={{ width: 1, background: "#FFD9C7" }} />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a" }}>
                    {Math.round(FIXED.reduce((s, i) => s + i.time, 0) / 60 * 10) / 10}h
                  </div>
                  <div style={{ fontSize: 11, color: "#999" }}>Total time</div>
                </div>
              </div>
            </div>

            {FIXED.map((item) => (
              <div key={item.id} style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid #F0EDE8",
                padding: "14px 16px",
                marginBottom: 10,
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: "#EAFAF2", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: 1,
                }}>
                  <div style={{
                    width: 9, height: 6,
                    borderLeft: "2px solid #1A7A4A",
                    borderBottom: "2px solid #1A7A4A",
                    transform: "rotate(-45deg) translateY(-1px)",
                  }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 500, color: "#1a1a1a",
                    textDecoration: "line-through", opacity: 0.45, marginBottom: 4,
                  }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>
                    {item.solution} · ${item.money} · {item.time} min · {item.ago}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Add modal */}
        {showAdd && (
          <div style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "flex-end",
            justifyContent: "center",
            zIndex: 100,
          }}
            onClick={() => setShowAdd(false)}
          >
            <div style={{
              background: "#fff8f4",
              borderRadius: "24px 24px 0 0",
              padding: "24px 20px 40px",
              width: "100%",
              maxWidth: 390,
            }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: 20,
              }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a" }}>Add an Annoyance</div>
                <button onClick={() => setShowAdd(false)} style={{
                  background: "none", border: "none", fontSize: 13,
                  color: "#999", cursor: "pointer", fontFamily: "inherit",
                }}>Cancel</button>
              </div>

              <textarea
                autoFocus
                placeholder="What's been bothering you?"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                style={{
                  width: "100%", background: "#fff", border: "1px solid #FFD9C7",
                  borderRadius: 14, padding: "12px 14px", fontSize: 14,
                  color: "#1a1a1a", resize: "none", height: 80,
                  outline: "none", fontFamily: "inherit", marginBottom: 12,
                }}
              />

              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "#999", marginBottom: 6 }}>Max budget ($)</div>
                  <input
                    type="number"
                    placeholder="50"
                    value={newMoney}
                    onChange={e => setNewMoney(e.target.value)}
                    style={{
                      width: "100%", background: "#fff", border: "1px solid #FFD9C7",
                      borderRadius: 12, padding: "10px 12px", fontSize: 14,
                      color: "#1a1a1a", outline: "none", fontFamily: "inherit",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "#999", marginBottom: 6 }}>Max time (minutes)</div>
                  <input
                    type="number"
                    placeholder="30"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    style={{
                      width: "100%", background: "#fff", border: "1px solid #FFD9C7",
                      borderRadius: 12, padding: "10px 12px", fontSize: 14,
                      color: "#1a1a1a", outline: "none", fontFamily: "inherit",
                    }}
                  />
                </div>
              </div>

              {/* Quick tags */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: "#999", marginBottom: 8 }}>Quick budget</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {[["$10", "10"], ["$30", "30"], ["$50", "50"], ["$100", "100"]].map(([label, val]) => (
                    <button key={val} onClick={() => setNewMoney(val)} style={{
                      padding: "4px 12px", borderRadius: 12, border: "1px solid #FFD9C7",
                      background: newMoney === val ? "#fb5607" : "#FFF0E6",
                      color: newMoney === val ? "#fff" : "#fb5607",
                      fontSize: 12, cursor: "pointer",
                    }}>{label}</button>
                  ))}
                  {[["15 min", "15"], ["30 min", "30"], ["1 hour", "60"], ["2 hours", "120"]].map(([label, val]) => (
                    <button key={val} onClick={() => setNewTime(val)} style={{
                      padding: "4px 12px", borderRadius: 12, border: "1px solid #FFD9C7",
                      background: newTime === val ? "#fb5607" : "#FFF0E6",
                      color: newTime === val ? "#fff" : "#fb5607",
                      fontSize: 12, cursor: "pointer",
                    }}>{label}</button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAdd}
                disabled={!newTitle.trim()}
                style={{
                  width: "100%", padding: "14px", borderRadius: 16,
                  background: newTitle.trim() ? "#fb5607" : "#FFD9C7",
                  border: "none", color: "#fff", fontSize: 15,
                  fontWeight: 600, cursor: newTitle.trim() ? "pointer" : "default",
                  transition: "background .15s",
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        {tab === "pending" && (
          <div style={{
            position: "sticky", bottom: 0,
            background: "linear-gradient(to top, #fff8f4 80%, transparent)",
            paddingTop: 16, paddingBottom: 8,
          }}>
            <button
              onClick={handleTodayFix}
              style={{
                width: "100%", padding: "15px",
                borderRadius: 18, border: "none",
                background: "#fb5607", color: "#fff",
                fontSize: 15, fontWeight: 700,
                cursor: "pointer", letterSpacing: 0.2,
              }}
            >
              Fix One Thing Today ⚡
            </button>

            <button
              onClick={() => setShowAdd(true)}
              style={{
                width: "100%", padding: "12px",
                borderRadius: 18, border: "1.5px solid #FFD9C7",
                background: "transparent", color: "#fb5607",
                fontSize: 14, fontWeight: 600,
                cursor: "pointer", marginTop: 8,
              }}
            >
              + Add a new annoyance
            </button>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input:focus, textarea:focus { border-color: #fb5607 !important; }
        button:active { opacity: 0.85; }
      `}</style>
    </div>
  );
}
