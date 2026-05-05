import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addItem, loadItems, updateItem } from '../store';

const MONEY_QUICK = [30, 100, 200, 500];
const TIME_QUICK  = [
  { label: '15分钟', val: 15 }, { label: '30分钟', val: 30 },
  { label: '1小时',  val: 60 }, { label: '2小时',  val: 120 },
];

export default function AddEdit() {
  const nav = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [desc, setDesc]       = useState('');
  const [money, setMoney]     = useState('');
  const [time, setTime]       = useState('');
  const [timeUnit, setUnit]   = useState('分钟');
  const textRef = useRef(null);

  useEffect(() => {
    if (isEdit) {
      const item = loadItems().find(i => i.id === id);
      if (item) {
        setDesc(item.description);
        setMoney(item.budgetMoney ? String(item.budgetMoney) : '');
        const t = item.budgetTime;
        if (t && t >= 60 && t % 60 === 0) { setTime(String(t / 60)); setUnit('小时'); }
        else { setTime(t ? String(t) : ''); setUnit('分钟'); }
      }
    }
    setTimeout(() => textRef.current?.focus(), 100);
  }, [id]);

  const timeInMin = () => {
    const n = Number(time);
    return timeUnit === '小时' ? n * 60 : n;
  };

  const valid = desc.trim().length > 0;

  const handleSave = () => {
    if (!valid) return;
    if (isEdit) {
      updateItem(id, { description: desc.trim(), budgetMoney: Number(money) || 0, budgetTime: timeInMin() });
    } else {
      const item = addItem(desc.trim(), Number(money) || 0, timeInMin());
      sessionStorage.setItem('newItemId', item.id);
    }
    nav('/');
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#F5EFE6' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4"
           style={{ borderBottom: '1px solid #E8DDD0', background: '#FFFBF5' }}>
        <button onClick={() => nav(-1)} className="text-sm" style={{ color: '#8C7A6A' }}>取消</button>
        <span className="text-base font-semibold" style={{ color: '#3D2B1F' }}>
          {isEdit ? '编辑烦恼' : '记一个烦恼'}
        </span>
        <button onClick={handleSave} disabled={!valid}
          className="text-sm font-semibold transition-opacity"
          style={{ color: valid ? '#E8935A' : '#C4B5A5', cursor: valid ? 'pointer' : 'default' }}>
          完成
        </button>
      </div>

      <div className="flex-1 px-4 py-5 flex flex-col gap-5">
        {/* Description */}
        <div className="rounded-2xl p-4" style={{ background: '#FFFBF5', border: '1px solid #E8DDD0' }}>
          <textarea ref={textRef} value={desc} onChange={e => setDesc(e.target.value.slice(0, 100))}
            rows={4} placeholder="什么让你烦？随手写下来"
            className="w-full resize-none text-base outline-none"
            style={{ background: 'transparent', color: '#3D2B1F' }} />
          <div className="text-right text-xs mt-1" style={{ color: '#8C7A6A' }}>{desc.length}/100</div>
        </div>

        {/* Budget */}
        <div className="rounded-2xl p-4 flex gap-4" style={{ background: '#FFFBF5', border: '1px solid #E8DDD0' }}>
          {/* Money */}
          <div className="flex-1">
            <label className="text-xs mb-1 block" style={{ color: '#8C7A6A' }}>最多花多少钱</label>
            <div className="flex items-center gap-1 border rounded-xl px-3 py-2" style={{ borderColor: '#E8DDD0' }}>
              <span style={{ color: '#8C7A6A' }}>¥</span>
              <input type="number" inputMode="numeric" value={money} onChange={e => setMoney(e.target.value)}
                placeholder="0" className="flex-1 w-full outline-none text-sm" style={{ background: 'transparent', color: '#3D2B1F' }} />
            </div>
            <div className="flex gap-2 flex-wrap mt-2">
              {MONEY_QUICK.map(v => (
                <button key={v} onClick={() => setMoney(String(v))}
                  className="text-xs px-2 py-1 rounded-lg border transition-colors"
                  style={{ borderColor: money === String(v) ? '#E8935A' : '#E8DDD0',
                           color: money === String(v) ? '#E8935A' : '#8C7A6A',
                           background: money === String(v) ? '#FFF3E0' : 'transparent' }}>
                  ¥{v}
                </button>
              ))}
            </div>
          </div>
          {/* Time */}
          <div className="flex-1">
            <label className="text-xs mb-1 block" style={{ color: '#8C7A6A' }}>最多花多少时间</label>
            <div className="flex items-center gap-1 border rounded-xl px-2 py-2" style={{ borderColor: '#E8DDD0' }}>
              <input type="number" inputMode="numeric" value={time} onChange={e => setTime(e.target.value)}
                placeholder="0" className="flex-1 w-12 outline-none text-sm" style={{ background: 'transparent', color: '#3D2B1F' }} />
              <select value={timeUnit} onChange={e => setUnit(e.target.value)}
                className="text-xs outline-none" style={{ background: 'transparent', color: '#8C7A6A' }}>
                <option>分钟</option>
                <option>小时</option>
              </select>
            </div>
            <div className="flex gap-2 flex-wrap mt-2">
              {TIME_QUICK.map(({ label, val }) => {
                const cur = timeInMin();
                return (
                  <button key={val} onClick={() => {
                    if (val < 60) { setTime(String(val)); setUnit('分钟'); }
                    else { setTime(String(val / 60)); setUnit('小时'); }
                  }}
                    className="text-xs px-2 py-1 rounded-lg border transition-colors"
                    style={{ borderColor: cur === val ? '#E8935A' : '#E8DDD0',
                             color: cur === val ? '#E8935A' : '#8C7A6A',
                             background: cur === val ? '#E8F5E9' : 'transparent' }}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
