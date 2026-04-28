import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Chart, registerables } from "chart.js"
import { Bar, Pie } from "react-chartjs-2"
import {
  HiOutlineCurrencyRupee,
  HiOutlineUsers,
  HiOutlineAcademicCap,
  HiOutlineTrendingUp,
  HiOutlineEye,
  HiOutlineGlobe,
} from "react-icons/hi"

import { apiConnector } from "../../../../services/apiConnector"
import { adminEndpoints, analyticsEndpoints } from "../../../../services/apis"

Chart.register(...registerables)

const BRAND_COLORS = [
  "rgba(255, 214, 10, 0.85)",
  "rgba(6, 214, 160, 0.85)",
  "rgba(239, 71, 111, 0.85)",
  "rgba(17, 138, 178, 0.85)",
  "rgba(255, 159, 28, 0.85)",
]

const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      ticks: { color: "#AFB2BF", font: { size: 11 } },
      grid: { color: "rgba(255,255,255,0.05)" },
    },
    y: {
      ticks: { color: "#AFB2BF", font: { size: 11 } },
      grid: { color: "rgba(255,255,255,0.05)" },
      beginAtZero: true,
    },
  },
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 glass-card p-6 shadow-xl transition-transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
      <div className={`rounded-xl p-4 shadow-inner ${color}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-richblack-300">{label}</p>
        <p className="text-3xl font-bold font-outfit text-white">{value}</p>
        {sub && <p className="text-xs text-richblack-400 mt-1">{sub}</p>}
      </div>
    </div>
  )
}

export default function AdminAnalytics() {
  const { token } = useSelector((state) => state.auth)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeChart, setActiveChart] = useState("revenue")
  const [liveStats, setLiveStats] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await apiConnector(
          "GET",
          adminEndpoints.ADMIN_ANALYTICS_API,
          null,
          { Authorization: `Bearer ${token}` }
        )
        if (res?.data?.success) setData(res.data.data)
      } catch (err) {
        console.error("Analytics fetch error:", err)
      }
      setLoading(false)
    })()
  }, [token])

  // Fetch live stats and auto-refresh every 30 seconds
  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await apiConnector(
          "GET",
          analyticsEndpoints.GET_LIVE_STATS_API,
          null,
          { Authorization: `Bearer ${token}` }
        )
        if (res?.data?.success) setLiveStats(res.data.data)
      } catch (err) {
        console.error("Live stats fetch error:", err)
      }
    }
    fetchLive()
    const interval = setInterval(fetchLive, 30 * 1000)
    return () => clearInterval(interval)
  }, [token])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="spinner" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-2 text-center">
        <p className="text-xl font-bold text-richblack-5">No analytics data yet</p>
        <p className="text-sm text-richblack-400">Enrollments will appear here once students sign up for courses.</p>
      </div>
    )
  }

  const { overview, monthlyData, topCoursesByRevenue, topCoursesByEnrollment } = data

  // ── Bar chart datasets ─────────────────────────────────────────────────────
  const labels = monthlyData.map((m) => m.label)

  const revenueBarData = {
    labels,
    datasets: [{
      label: "Revenue (₹)",
      data: monthlyData.map((m) => m.revenue),
      backgroundColor: "rgba(255, 214, 10, 0.7)",
      borderColor: "rgba(255, 214, 10, 1)",
      borderWidth: 1,
      borderRadius: 4,
    }],
  }

  const enrollmentBarData = {
    labels,
    datasets: [{
      label: "Enrollments",
      data: monthlyData.map((m) => m.enrollments),
      backgroundColor: "rgba(6, 214, 160, 0.7)",
      borderColor: "rgba(6, 214, 160, 1)",
      borderWidth: 1,
      borderRadius: 4,
    }],
  }

  // ── Top courses pie ─────────────────────────────────────────────────────────
  const revenuePieData = {
    labels: topCoursesByRevenue.map((c) => c.courseName || "Unknown"),
    datasets: [{
      data: topCoursesByRevenue.map((c) => c.revenue),
      backgroundColor: BRAND_COLORS,
      borderColor: "#161D29",
      borderWidth: 2,
    }],
  }

  const enrollmentPieData = {
    labels: topCoursesByEnrollment.map((c) => c.courseName || "Unknown"),
    datasets: [{
      data: topCoursesByEnrollment.map((c) => c.enrollments),
      backgroundColor: BRAND_COLORS,
      borderColor: "#161D29",
      borderWidth: 2,
    }],
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#AFB2BF", padding: 12, boxWidth: 12, font: { size: 11 } },
      },
    },
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold font-outfit text-white">Platform Analytics</h1>
        <p className="mt-1 text-sm text-richblack-400">
          Revenue, enrollments and course performance across the entire platform
        </p>
      </div>

      {/* Live stats — refreshes every 30 seconds */}
      <div className="rounded-3xl border border-white/10 glass-card p-8 shadow-xl animate-revealUp">
        <div className="mb-4 flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-caribbeangreen-300 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-caribbeangreen-400"></span>
          </span>
          <h2 className="text-sm font-semibold text-richblack-100">Live Right Now</h2>
          <span className="ml-auto text-xs text-richblack-500">auto-refreshes every 30s</span>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            icon={<HiOutlineUsers className="text-2xl text-caribbeangreen-200" />}
            label="Online Now"
            value={liveStats ? liveStats.totalOnline : "—"}
            sub={liveStats ? `${liveStats.loggedInOnline} logged in · ${liveStats.guestOnline} guests` : "loading..."}
            color="bg-caribbeangreen-900"
          />
          <StatCard
            icon={<HiOutlineEye className="text-2xl text-blue-200" />}
            label="Today's Views"
            value={liveStats ? liveStats.todayViews.toLocaleString() : "—"}
            sub="page visits today"
            color="bg-blue-900"
          />
          <StatCard
            icon={<HiOutlineGlobe className="text-2xl text-yellow-50" />}
            label="All-Time Views"
            value={liveStats ? liveStats.allTimeViews.toLocaleString() : "—"}
            sub="total page visits"
            color="bg-yellow-900"
          />
          {/* Top page visited today */}
          <div className="flex items-center gap-4 rounded-xl border border-richblack-700 bg-richblack-700 p-5">
            <div className="rounded-xl bg-pink-900 p-3">
              <HiOutlineTrendingUp className="text-2xl text-pink-200" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-richblack-400">Top Page Today</p>
              <p className="truncate text-sm font-bold text-richblack-5">
                {liveStats?.topPages?.[0]?.page || "—"}
              </p>
              <p className="text-xs text-richblack-500 mt-0.5">
                {liveStats?.topPages?.[0] ? `${liveStats.topPages[0].visits} visits` : "no data yet"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<HiOutlineCurrencyRupee className="text-2xl text-yellow-50" />}
          label="Total Revenue"
          value={`₹${overview.totalRevenue.toLocaleString("en-IN")}`}
          sub="All time"
          color="bg-yellow-900"
        />
        <StatCard
          icon={<HiOutlineTrendingUp className="text-2xl text-caribbeangreen-200" />}
          label="Total Enrollments"
          value={overview.totalEnrollments.toLocaleString()}
          sub="All courses"
          color="bg-caribbeangreen-900"
        />
        <StatCard
          icon={<HiOutlineUsers className="text-2xl text-blue-200" />}
          label="Total Students"
          value={overview.totalStudents.toLocaleString()}
          sub={`${overview.totalInstructors} instructors`}
          color="bg-blue-900"
        />
        <StatCard
          icon={<HiOutlineAcademicCap className="text-2xl text-pink-200" />}
          label="Published Courses"
          value={overview.totalCourses.toLocaleString()}
          sub="Live on platform"
          color="bg-pink-900"
        />
      </div>

      {/* Monthly trend chart */}
      <div className="rounded-3xl border border-white/10 glass-card p-8 shadow-xl animate-revealUp" style={{animationDelay: '0.1s'}}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-richblack-5">Monthly Trends (Last 12 Months)</h2>
          <div className="flex rounded-lg border border-richblack-600 overflow-hidden">
            <button
              onClick={() => setActiveChart("revenue")}
              className={`px-4 py-1.5 text-sm font-semibold transition-all ${
                activeChart === "revenue"
                  ? "bg-yellow-50 text-richblack-900"
                  : "text-richblack-300 hover:text-richblack-50"
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setActiveChart("enrollments")}
              className={`px-4 py-1.5 text-sm font-semibold transition-all ${
                activeChart === "enrollments"
                  ? "bg-caribbeangreen-200 text-richblack-900"
                  : "text-richblack-300 hover:text-richblack-50"
              }`}
            >
              Enrollments
            </button>
          </div>
        </div>
        <div className="h-64">
          <Bar
            data={activeChart === "revenue" ? revenueBarData : enrollmentBarData}
            options={CHART_DEFAULTS}
          />
        </div>
      </div>

      {/* Top courses — pie charts + tables side by side */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Top by Revenue */}
        <div className="rounded-3xl border border-white/10 glass-card p-8 shadow-xl animate-revealUp" style={{animationDelay: '0.2s'}}>
          <h2 className="mb-4 text-lg font-bold text-richblack-5">Top 5 by Revenue</h2>
          {topCoursesByRevenue.length === 0 ? (
            <p className="text-sm text-richblack-500 text-center py-8">No data yet</p>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="h-48">
                <Pie data={revenuePieData} options={pieOptions} />
              </div>
              <div className="space-y-2">
                {topCoursesByRevenue.map((course, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-richblack-700 px-3 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-3 w-3 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: BRAND_COLORS[i]?.replace("0.85", "1") }}
                      />
                      <span className="truncate text-sm text-richblack-100">
                        {course.courseName || "Unknown"}
                      </span>
                    </div>
                    <span className="ml-3 flex-shrink-0 text-sm font-semibold text-yellow-50">
                      ₹{(course.revenue || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top by Enrollment */}
        <div className="rounded-3xl border border-white/10 glass-card p-8 shadow-xl animate-revealUp" style={{animationDelay: '0.3s'}}>
          <h2 className="mb-4 text-lg font-bold text-richblack-5">Top 5 by Enrollments</h2>
          {topCoursesByEnrollment.length === 0 ? (
            <p className="text-sm text-richblack-500 text-center py-8">No data yet</p>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="h-48">
                <Pie data={enrollmentPieData} options={pieOptions} />
              </div>
              <div className="space-y-2">
                {topCoursesByEnrollment.map((course, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-richblack-700 px-3 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-3 w-3 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: BRAND_COLORS[i]?.replace("0.85", "1") }}
                      />
                      <span className="truncate text-sm text-richblack-100">
                        {course.courseName || "Unknown"}
                      </span>
                    </div>
                    <span className="ml-3 flex-shrink-0 text-sm font-semibold text-caribbeangreen-200">
                      {(course.enrollments || 0).toLocaleString()} students
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
