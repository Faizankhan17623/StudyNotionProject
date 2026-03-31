const MESSAGE =
  "🚨 Developer realized AWS isn't free (who knew?!). Backend taking a sabbatical until this broke coder gets a job. AWS says 'Pay me' — developer says '😐'. Send coffee & prayers! 🙏 Updates coming... probably... maybe... if money happens! 💸  •  "

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
