import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadItems, getStats, fmtTime, fmtAgo } from '../store';

export default function Fixed() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => { setItems(loadItems()); }, []);

  const fixed = items.filter(i => i.status === 'fixed')
                     .sort((a, b) => new Date(b.fixedAt) - new Date(a.fixedAt));
  const stats = getStats(items);

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-xl font-bold text-center" style={{ color: '#3D2B1F' }}>已修复</h1>
      </div>

      {/* Stats card */}
      {fixed.length > 0 && (
        <div className="mx-4 rounded-3xl p-5 mb-4"
             style={{ background: '#FFFBF5', border: '1.5px solid #E8DDD0' }}>
          <h2 className="text-2xl font-bold text-center mb-1" style={{ color: '#3D2B1F' }}>
            修复了 {stats.count} 个烦恼
          </h2>
          <p className="text-sm text-center mb-4" style={{ color: '#8C7A6A' }}>生活正在悄悄变好 🌱</p>
          <div className="flex justify-around">
            <div className="text-center">
              <div className="text-xl font-bold" style={{ color: '#E8935A' }}>¥{stats.totalMoney}</div>
              <div className="text-xs mt-1" style={{ color: '#8C7A6A' }}>总花费</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold" style={{ color: '#E8935A' }}>
                {fmtTime(stats.totalTime)}
              </div>
              <div className="text-xs mt-1" style={{ color: '#8C7A6A' }}>总时间</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold" style={{ color: '#E8935A' }}>{stats.count}</div>
              <div className="text-xs mt-1" style={{ color: '#8C7A6A' }}>已消灭</div>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="flex-1 px-4">
        {fixed.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 gap-3">
            <span className="text-6xl">🌱</span>
            <p className="text-lg font-semibold" style={{ color: '#3D2B1F' }}>还没有修复记录</p>
            <p className="text-sm" style={{ color: '#8C7A6A' }}>今天去解决第一个烦恼吧</p>
            <button onClick={() => nav('/today')}
              className="mt-4 px-6 py-3 rounded-2xl text-white font-semibold text-sm active:scale-95 transition-transform"
              style={{ background: '#E8935A' }}>
              去今日修复
            </button>
          </div>
        ) : (
          fixed.map(item => (
            <div key={item.id} className="rounded-2xl p-4 mb-3 flex gap-3"
                 style={{ background: '#FFFBF5', border: '1px solid #E8DDD0' }}>
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
                   style={{ background: '#E1F5EE' }}>
                <span style={{ color: '#0F6E56', fontSize: 16 }}>✓</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-snug" style={{ color: '#3D2B1F' }}>
                  {item.description}
                </p>
                {item.solution && (
                  <p className="text-xs mt-1 line-clamp-2" style={{ color: '#8C7A6A' }}>
                    {item.solution}
                  </p>
                )}
                <div className="flex gap-3 mt-2 flex-wrap">
                  {item.actualMoney != null && (
                    <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: '#FFF3E0', color: '#854F0B' }}>
                      ¥{item.actualMoney}
                    </span>
                  )}
                  {item.actualTime != null && (
                    <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: '#E8F5E9', color: '#2E7D32' }}>
                      {fmtTime(item.actualTime)}
                    </span>
                  )}
                  <span className="text-xs" style={{ color: '#C4B5A5' }}>
                    {fmtAgo(item.fixedAt)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
