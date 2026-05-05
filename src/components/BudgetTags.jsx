export default function BudgetTags({ money, time }) {
  return (
    <div className="flex gap-2 flex-wrap mt-1">
      {money > 0 && (
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: '#FFF3E0', color: '#854F0B' }}>
          ¥{money} 内
        </span>
      )}
      {time > 0 && (
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: '#E8F5E9', color: '#2E7D32' }}>
          {time < 60 ? `${time}分钟内` : `${Math.floor(time/60)}小时${time%60?`${time%60}分`:``}内`}
        </span>
      )}
    </div>
  );
}
