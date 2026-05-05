const KEY = 'fixlife_items';

export function loadItems() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

export function saveItems(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addItem(desc, budgetMoney, budgetTime) {
  const items = loadItems();
  const item = {
    id: Date.now().toString(),
    description: desc,
    budgetMoney: Number(budgetMoney),
    budgetTime: Number(budgetTime),
    status: 'pending',
    createdAt: new Date().toISOString(),
    fixedAt: null,
    solution: null,
    actualMoney: null,
    actualTime: null,
  };
  saveItems([item, ...items]);
  return item;
}

export function updateItem(id, patch) {
  const items = loadItems().map(it => it.id === id ? { ...it, ...patch } : it);
  saveItems(items);
  return items;
}

export function deleteItem(id) {
  const items = loadItems().filter(it => it.id !== id);
  saveItems(items);
  return items;
}

export function fixItem(id, solution, actualMoney, actualTime) {
  return updateItem(id, {
    status: 'fixed',
    fixedAt: new Date().toISOString(),
    solution: solution || null,
    actualMoney: actualMoney ? Number(actualMoney) : null,
    actualTime: actualTime ? Number(actualTime) : null,
  });
}

export function getStats(items) {
  const fixed = items.filter(i => i.status === 'fixed');
  const totalMoney = fixed.reduce((s, i) => s + (i.actualMoney || 0), 0);
  const totalTime  = fixed.reduce((s, i) => s + (i.actualTime  || 0), 0);
  return { count: fixed.length, totalMoney, totalTime };
}

export function fmtTime(minutes) {
  if (!minutes) return '0分钟';
  if (minutes < 60) return `${minutes}分钟`;
  const h = Math.floor(minutes / 60), m = minutes % 60;
  return m ? `${h}h${m}m` : `${h}h`;
}

export function fmtAgo(isoStr) {
  const diff = Date.now() - new Date(isoStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return '今天';
  if (d === 1) return '昨天';
  if (d < 30)  return `${d}天前`;
  return new Date(isoStr).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
}
