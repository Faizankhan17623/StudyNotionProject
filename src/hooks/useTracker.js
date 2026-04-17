import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { apiConnector } from "../services/apiConnector"
import { analyticsEndpoints } from "../services/apis"

const { HEARTBEAT_API, TRACK_PAGEVIEW_API } = analyticsEndpoints

// Returns or creates a unique session ID stored in sessionStorage
function getSessionId() {
  let id = sessionStorage.getItem("sn_session")
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36)
    sessionStorage.setItem("sn_session", id)
  }
  return id
}

export default function useTracker() {
  const location = useLocation()
  const { token } = useSelector((state) => state.auth)

  const sessionId = getSessionId()
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  // Log a page view on every route change
  useEffect(() => {
    apiConnector("POST", TRACK_PAGEVIEW_API, { page: location.pathname, sessionId }, headers).catch(
      () => {}
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  // Send heartbeat immediately and then every 60 seconds
  useEffect(() => {
    const send = () => {
      apiConnector("POST", HEARTBEAT_API, { sessionId }, headers).catch(() => {})
    }
    send()
    const interval = setInterval(send, 60 * 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])
}
