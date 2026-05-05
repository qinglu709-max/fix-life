import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { path: '/',       label: '清单', icon: '📋' },
  { path: '/today',  label: '今日', icon: '🎯' },
  { path: '/fixed',  label: '已修', icon: '✅' },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const nav = useNavigate();
  return (
    <nav style={{ background: '#FFFBF5', borderTop: '1px solid #E8DDD0' }}
         className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] flex z-40">
      {tabs.map(t => {
        const active = pathname === t.path;
        return (
          <button key={t.path} onClick={() => nav(t.path)}
            className="flex-1 flex flex-col items-center gap-0.5 py-2 text-xs transition-colors"
            style={{ color: active ? '#E8935A' : '#8C7A6A', fontWeight: active ? 600 : 400 }}>
            <span className="text-xl">{t.icon}</span>
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}
