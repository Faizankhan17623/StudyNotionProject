import { useEffect, useState } from "react"
import { HiArrowUp } from "react-icons/hi"

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-8 z-50 rounded-full bg-yellow-50 p-3 text-richblack-900 shadow-lg transition-all duration-300 hover:bg-yellow-25 hover:scale-110"
      aria-label="Scroll to top"
    >
      <HiArrowUp size={20} />
    </button>
  )
}
