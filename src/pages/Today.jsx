import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadItems, fixItem, getStats } from '../store';
import BudgetTags from '../components/BudgetTags';

const EMOJIS = ['🔧','🛠️','💡','🪛','🔑','🧹','🪴','🪟','🛁','🪑','📦','🔌','💊','🧴','🗂️'];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function StarBurst({ onDone }) {
  const stars = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    angle: (i / 18) * 360,
    dist: 80 + Math.random() * 80,
    color: pick(['#E8935A','#FFD700','#FF6B6B','#4CAF50','#64B5F6','#CE93D8']),
    size: 8 + Math.random() * 8,
    delay: Math.random() * 0.2,
  }));
  useEffect(() => { const t = setTimeout(onDone, 900); return () => clearTimeout(t); }, []);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {stars.map(s => {
        const rad = (s.angle * Math.PI) / 180;
        return (
          <div key={s.id} className="absolute star" style={{
            '--tx': `${Math.cos(rad) * s.dist}px`,
            '--ty': `${Math.sin(rad) * s.dist}px`,
            animationDelay: `${s.delay}s`,
            width: s.size, height: s.size,
            borderRadius: '50%', background: s.color,
          }} />
        );
      })}
    </div>
  );
}

function FixSheet({ item, onClose, onFixed }) {
  const [solution, setSolution] = useState('');
  const [money, setMoney]       = useState('');
  const [time, setTime]         = useState('');

  const submit = () => {
    onFixed(item.id, solution, money, time);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(61,43,31,0.4)' }} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] rounded-t-3xl p-6 sheet-enter"
           style={{ background: '#FFFBF5' }}
           onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: '#E8DDD0' }} />
        <h2 className="text-lg font-bold mb-4 text-center" style={{ color: '#3D2B1F' }}>太棒了！怎么解决的？</h2>
        <textarea value={solution} onChange={e => setSolution(e.target.value)}
          placeholder="简单描述一下（选填）" rows={3}
          className="w-full rounded-xl p-3 text-sm resize-none outline-none mb-4"
          style={{ background: '#F5EFE6', border: '1px solid #E8DDD0', color: '#3D2B1F' }} />
        <div className="flex gap-3 mb-5">
          <div className="flex-1">
            <label className="text-xs mb-1 block" style={{ color: '#8C7A6A' }}>实际花费</label>
            <div className="flex items-center border rounded-xl px-3 py-2" style={{ borderColor: '#E8DDD0' }}>
              <span className="text-sm mr-1" style={{ color: '#8C7A6A' }}>¥</span>
              <input type="number" inputMode="numeric" value={money} onChange={e => setMoney(e.target.value)}
                placeholder="0" className="flex-1 outline-none text-sm" style={{ background: 'transparent', color: '#3D2B1F' }} />
            </div>
          </div>
          <div className="flex-1">
            <label className="text-xs mb-1 block" style={{ color: '#8C7A6A' }}>实际用时（分钟）</label>
            <input type="number" inputMode="numeric" value={time} onChange={e => setTime(e.target.value)}
              placeholder="0"
              className="w-full border rounded-xl px-3 py-2 text-sm outline-none"
              style={{ borderColor: '#E8DDD0', background: 'transparent', color: '#3D2B1F' }} />
          </div>
        </div>
        <button onClick={submit}
          className="w-full py-4 rounded-2xl text-white font-bold text-base active:scale-[0.97] transition-transform"
          style={{ background: '#E8935A' }}>
          标记已完成 ✓
        </button>
      </div>
    </div>
  );
}

function Celebration({ fixedCount, stats, onContinue }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 fade-in">
      <span className="text-7xl mb-4">🎉</span>
      <h2 className="text-2xl font-bold mb-2" style={{ color: '#3D2B1F' }}>又修了一个！</h2>
      <p className="text-sm mb-8" style={{ color: '#8C7A6A' }}>你已经消灭了 {fixedCount} 个生活烦恼</p>
      <div className="w-full rounded-2xl p-5 flex justify-around mb-8"
           style={{ background: '#FFFBF5', border: '1px solid #E8DDD0' }}>
        <div className="text-center">
          <div className="text-xl font-bold" style={{ color: '#E8935A' }}>¥{stats.totalMoney}</div>
          <div className="text-xs mt-1" style={{ color: '#8C7A6A' }}>总花费</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold" style={{ color: '#E8935A' }}>
            {stats.totalTime < 60 ? `${stats.totalTime}m` : `${(stats.totalTime/60).toFixed(1)}h`}
          </div>
          <div className="text-xs mt-1" style={{ color: '#8C7A6A' }}>总时间</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold" style={{ color: '#E8935A' }}>{stats.count}</div>
          <div className="text-xs mt-1" style={{ color: '#8C7A6A' }}>已消灭</div>
        </div>
      </div>
      <button onClick={onContinue}
        className="w-full py-4 rounded-2xl text-white font-bold text-base active:scale-[0.97] transition-transform"
        style={{ background: '#E8935A' }}>
        继续
      </button>
    </div>
  );
}

export default function Today() {
  const nav = useNavigate();
  const [items, setItems]       = useState([]);
  const [current, setCurrent]   = useState(null);
  const [emoji, setEmoji]       = useState('🔧');
  const [showSheet, setSheet]   = useState(false);
  const [bursting, setBurst]    = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [stats, setStats]       = useState(null);

  const pending = items.filter(i => i.status === 'pending');

  const drawRandom = (pool) => {
    if (!pool.length) { setCurrent(null); return; }
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    setCurrent(chosen);
    setEmoji(pick(EMOJIS));
  };

  useEffect(() => {
    const all = loadItems();
    setItems(all);
    drawRandom(all.filter(i => i.status === 'pending'));
  }, []);

  const handleFixed = (id, solution, money, time) => {
    const updated = fixItem(id, solution, money, time);
    setItems(updated);
    setBurst(true);
  };

  const handleBurstDone = () => {
    setBurst(false);
    const all = loadItems();
    setStats(getStats(all));
    setCelebrate(true);
  };

  const handleContinue = () => {
    setCelebrate(false);
    const all = loadItems();
    setItems(all);
    drawRandom(all.filter(i => i.status === 'pending'));
  };

  return (
    <div className="flex flex-col min-h-screen pb-20" style={{ background: '#F5EFE6' }}>
      {bursting && <StarBurst onDone={handleBurstDone} />}

      {/* Header */}
      <div className="px-5 pt-12 pb-3">
        <h1 className="text-xl font-bold text-center" style={{ color: '#3D2B1F' }}>今日修复</h1>
        <p className="text-sm text-center mt-1" style={{ color: '#8C7A6A' }}>在你的预算范围内随机抽到了</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {celebrate && stats ? (
          <Celebration fixedCount={stats.count} stats={stats} onContinue={handleContinue} />
        ) : current ? (
          <div className="w-full fade-in">
            {/* Big card */}
            <div className="rounded-3xl p-6 mb-5 text-center"
                 style={{ background: '#FFFBF5', border: '1px solid #E8DDD0', boxShadow: '0 4px 24px rgba(61,43,31,0.08)' }}>
              <div className="text-5xl mb-4">{emoji}</div>
              <p className="text-lg font-bold mb-3 leading-snug" style={{ color: '#3D2B1F' }}>{current.description}</p>
              <div className="flex justify-center">
                <BudgetTags money={current.budgetMoney} time={current.budgetTime} />
              </div>
            </div>

            {/* Buttons */}
            <button onClick={() => setSheet(true)}
              className="w-full py-4 rounded-2xl text-white font-bold text-base mb-3 active:scale-[0.97] transition-transform"
              style={{ background: '#E8935A' }}>
              搞定它！
            </button>
            <button onClick={() => drawRandom(pending.filter(i => i.id !== current.id))}
              className="w-full py-3 rounded-2xl font-medium text-sm active:scale-[0.97] transition-transform"
              style={{ border: '1.5px solid #E8935A', color: '#E8935A', background: 'transparent' }}>
              换一个
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">✨</div>
            <p className="text-lg font-semibold mb-2" style={{ color: '#3D2B1F' }}>烦恼都修完了！</p>
            <p className="text-sm" style={{ color: '#8C7A6A' }}>去记新的烦恼吧</p>
            <button onClick={() => nav('/add')}
              className="mt-6 px-6 py-3 rounded-2xl text-white font-semibold text-sm active:scale-95 transition-transform"
              style={{ background: '#E8935A' }}>
              记一个烦恼
            </button>
          </div>
        )}
      </div>

      {/* Bottom hint */}
      {!celebrate && pending.length > 0 && (
        <div className="text-center pb-2 text-xs" style={{ color: '#8C7A6A' }}>
          你还有 {pending.length} 个烦恼等待修复
        </div>
      )}

      {showSheet && current && (
        <FixSheet item={current} onClose={() => setSheet(false)} onFixed={handleFixed} />
      )}
    </div>
  );
}
