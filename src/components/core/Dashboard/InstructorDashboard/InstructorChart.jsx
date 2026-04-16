import { useState } from "react"
import { Chart, registerables } from "chart.js"
import { Pie } from "react-chartjs-2"

Chart.register(...registerables)

const BRAND_COLORS = [
  "rgba(255, 214, 10, 0.85)",
  "rgba(6, 214, 160, 0.85)",
  "rgba(239, 71, 111, 0.85)",
  "rgba(17, 138, 178, 0.85)",
  "rgba(255, 159, 28, 0.85)",
  "rgba(131, 56, 236, 0.85)",
]

export default function InstructorChart({ courses }) {
  const [currChart, setCurrChart] = useState("students")

  const chartDataStudents = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalStudentsEnrolled),
        backgroundColor: BRAND_COLORS.slice(0, courses.length),
        borderColor: "#161D29",
        borderWidth: 3,
      },
    ],
  }

  const chartIncomeData = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalAmountGenerated),
        backgroundColor: BRAND_COLORS.slice(0, courses.length),
        borderColor: "#161D29",
        borderWidth: 3,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#AFB2BF",
          padding: 16,
          boxWidth: 12,
          font: { size: 12 },
        },
      },
    },
  }

  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-xl border border-richblack-700 bg-richblack-800 p-6">
      {/* Header + Toggle */}
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-richblack-5">Analytics</p>
        <div className="flex rounded-lg border border-richblack-600 overflow-hidden">
          <button
            onClick={() => setCurrChart("students")}
            className={`px-4 py-1.5 text-sm font-semibold transition-all duration-200 ${
              currChart === "students"
                ? "bg-yellow-50 text-richblack-900"
                : "text-richblack-300 hover:text-richblack-50"
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setCurrChart("income")}
            className={`px-4 py-1.5 text-sm font-semibold transition-all duration-200 ${
              currChart === "income"
                ? "bg-yellow-50 text-richblack-900"
                : "text-richblack-300 hover:text-richblack-50"
            }`}
          >
            Income
          </button>
        </div>
      </div>

      {/* Chart — fixed size container so the pie stays in bounds */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-[260px] h-[260px]">
          <Pie
            data={currChart === "students" ? chartDataStudents : chartIncomeData}
            options={options}
          />
        </div>
      </div>
    </div>
  )
}
