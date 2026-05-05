import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadItems, deleteItem } from '../store';
import BudgetTags from '../components/BudgetTags';

function SwipeCard({ item, onDelete, onEdit, isNew }) {
  const [swiped, setSwiped] = useState(false);
  const [exiting, setExiting] = useState(false);
  const startX = useRef(null);

  const handleDelete = () => {
    setExiting(true);
    setTimeout(() => onDelete(item.id), 260);
  };

  const onTouchStart = e => { startX.current = e.touches[0].clientX; };
  const onTouchEnd   = e => {
    if (startX.current === null) return;
    const dx = startX.current - e.changedTouches[0].clientX;
    if (dx > 50) setSwiped(true);
    if (dx < -20) setSwiped(false);
    startX.current = null;
  };

  return (
    <div className={`swipe-container rounded-2xl mb-3 ${isNew ? 'card-enter' : ''} ${exiting ? 'card-exit' : ''}`}>
      <div className="swipe-content" style={{ transform: swiped ? 'translateX(-80px)' : 'translateX(0)' }}
           onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div onClick={() => { if (!swiped) onEdit(item.id); else setSwiped(false); }}
             className="rounded-2xl p-4 border cursor-pointer active:scale-[0.99] transition-transform"
             style={{ background: '#FFFBF5', borderColor: '#E8DDD0' }}>
          <p className="font-semibold text-sm leading-snug line-clamp-2" style={{ color: '#3D2B1F' }}>
            {item.description}
          </p>
          <BudgetTags money={item.budgetMoney} time={item.budgetTime} />
        </div>
      </div>
      <div className="delete-btn-wrap" style={{ width: 72 }}>
        <button onClick={handleDelete}
          className="h-full w-full flex items-center justify-center rounded-r-2xl text-white text-sm font-medium"
          style={{ background: '#E53935' }}>
          删除
        </button>
      </div>
    </div>
  );
}

export default function List() {
  const [items, setItems] = useState([]);
  const [newId, setNewId]  = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const all = loadItems().filter(i => i.status === 'pending');
    setItems(all);
    const sid = sessionStorage.getItem('newItemId');
    if (sid) { setNewId(sid); sessionStorage.removeItem('newItemId'); }
  }, []);

  const pending = items.filter(i => i.status === 'pending');

  const handleDelete = (id) => {
    deleteItem(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Header */}
      <div className="flex items-center justify-center px-5 pt-12 pb-4 relative">
        <h1 className="text-xl font-bold" style={{ color: '#3D2B1F' }}>Fix Life</h1>
        {pending.length > 0 && (
          <span className="absolute right-5 top-12 text-xs font-bold text-white rounded-full w-5 h-5 flex items-center justify-center"
                style={{ background: '#E8935A' }}>
            {pending.length}
          </span>
        )}
      </div>

      {/* List */}
      <div className="flex-1 px-4">
        {pending.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-24 gap-3">
            <span className="text-6xl">🧹</span>
            <p className="text-lg font-semibold" style={{ color: '#3D2B1F' }}>生活还没有烦恼？</p>
            <p className="text-sm text-center" style={{ color: '#8C7A6A' }}>随手记下让你烦的小事，慢慢修掉它们</p>
            <button onClick={() => nav('/add')}
              className="mt-4 px-6 py-3 rounded-2xl text-white font-semibold text-sm active:scale-95 transition-transform"
              style={{ background: '#E8935A' }}>
              记第一个烦恼
            </button>
          </div>
        ) : (
          pending.map(item => (
            <SwipeCard key={item.id} item={item}
              isNew={item.id === newId}
              onDelete={handleDelete}
              onEdit={id => nav(`/edit/${id}`)} />
          ))
        )}
      </div>

      {/* FAB */}
      <div className="fixed bottom-20 right-1/2 translate-x-[calc(50%-16px)] flex flex-col items-center gap-1"
           style={{ right: 'calc(50% - 210px)' }}>
        <button onClick={() => nav('/add')}
          className="w-14 h-14 rounded-full text-white text-3xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          style={{ background: '#E8935A', boxShadow: '0 4px 16px rgba(232,147,90,0.4)' }}>
          +
        </button>
        <span className="text-xs" style={{ color: '#8C7A6A' }}>记一个烦恼</span>
      </div>
    </div>
  );
}
