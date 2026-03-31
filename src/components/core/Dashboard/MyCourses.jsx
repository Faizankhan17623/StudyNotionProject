import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { fetchInstructorCourses } from "../../../services/operations/courseAPI"
import IconBtn from "../../Common/IconBtn"
import CoursesTable from "./InstructorCourses/CoursesTable"

const COURSES_PER_PAGE = 10

export default function MyCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await fetchInstructorCourses(token, currentPage, COURSES_PER_PAGE)
      if (result) {
        setCourses(result.data)
        setPagination(result.pagination)
      }
    }
    fetchCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  return (
    <div>
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
        <IconBtn
          text="Add Course"
          onclick={() => navigate("/dashboard/add-course")}
        >
          <VscAdd />
        </IconBtn>
      </div>

      {courses && (
        <CoursesTable
          courses={courses}
          setCourses={setCourses}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-md border border-richblack-600 px-4 py-2 text-sm text-richblack-100 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-richblack-700"
          >
            Previous
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded-md px-4 py-2 text-sm ${
                  page === currentPage
                    ? "bg-yellow-50 font-semibold text-richblack-900"
                    : "border border-richblack-600 text-richblack-100 hover:bg-richblack-700"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, pagination.totalPages))
            }
            disabled={currentPage === pagination.totalPages}
            className="rounded-md border border-richblack-600 px-4 py-2 text-sm text-richblack-100 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-richblack-700"
          >
            Next
          </button>

          <span className="ml-2 text-sm text-richblack-400">
            Page {currentPage} of {pagination.totalPages} (
            {pagination.totalCourses} courses)
          </span>
        </div>
      )}
    </div>
  )
}
