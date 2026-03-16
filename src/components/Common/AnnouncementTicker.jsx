const MESSAGE =
  "🚀  Backend is currently closed until further changes are done — exciting new features & updates are on the way! Stay tuned.  •  "

// Repeat the message so the ticker never shows a gap
const REPEATED = MESSAGE.repeat(6)

function AnnouncementTicker() {
  return (
    <div
      className="w-full overflow-hidden bg-yellow-400 py-2 text-richblack-900"
      aria-label="Site announcement"
    >
      <div
        className="whitespace-nowrap text-sm font-semibold"
        style={{ animation: "ticker-scroll 30s linear infinite" }}
      >
        {REPEATED}
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

export default AnnouncementTicker
