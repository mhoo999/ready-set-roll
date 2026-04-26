export default function SidebarLogo() {
  const text = 'READYSETROLL'

  return (
    <div className="flex flex-col items-center justify-center gap-1 px-2 select-none">
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="text-xs font-black tracking-widest leading-none"
          style={{
            color: i < 5 ? '#7C3AED' : i < 8 ? '#F5A623' : '#EC4899',
            writingMode: 'vertical-rl',
            textOrientation: 'upright',
            fontSize: '13px',
          }}
        >
          {char}
        </span>
      ))}
    </div>
  )
}
