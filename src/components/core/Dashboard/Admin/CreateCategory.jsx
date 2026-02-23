import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { MdOutlineCategory } from "react-icons/md"
import { VscAdd } from "react-icons/vsc"
import { useSelector } from "react-redux"

import {
  createCategory,
  fetchCourseCategories,
} from "../../../../services/operations/courseAPI"

export default function CreateCategory() {
  const { token } = useSelector((state) => state.auth)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const loadCategories = async () => {
    setFetching(true)
    const result = await fetchCourseCategories()
    if (result) setCategories(result)
    setFetching(false)
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    const success = await createCategory(data, token)
    if (success) {
      reset()
      await loadCategories()
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-8">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-richblack-5">
            Manage Categories
          </h1>
          <p className="mt-1 text-sm text-richblack-300">
            Create and manage course categories visible to all users
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-yellow-50/10 px-4 py-2 text-yellow-50">
          <MdOutlineCategory className="text-xl" />
          <span className="text-sm font-semibold">
            {categories.length} Categories
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

        {/* ── Create Form ── */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-50/10">
                <VscAdd className="text-lg text-yellow-50" />
              </div>
              <h2 className="text-lg font-semibold text-richblack-5">
                Create New Category
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

              {/* Category Name */}
              <div className="flex flex-col gap-2">
                <label className="lable-style" htmlFor="name">
                  Category Name <sup className="text-pink-200">*</sup>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Web Development"
                  className="form-style"
                  {...register("name", {
                    required: "Category name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                />
                {errors.name && (
                  <p className="text-xs text-pink-200">{errors.name.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label className="lable-style" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Brief description of this category..."
                  className="form-style resize-none"
                  {...register("description")}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`mt-2 flex items-center justify-center gap-2 rounded-lg bg-yellow-50 px-5 py-3 text-sm font-bold text-richblack-900 transition-all duration-200
                  ${loading
                    ? "cursor-not-allowed opacity-60"
                    : "hover:scale-95 hover:shadow-none"
                  }`}
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-richblack-900 border-t-transparent" />
                ) : (
                  <VscAdd className="text-base" />
                )}
                {loading ? "Creating..." : "Create Category"}
              </button>
            </form>
          </div>
        </div>

        {/* ── Existing Categories ── */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-6">
            <h2 className="mb-6 text-lg font-semibold text-richblack-5">
              Existing Categories
            </h2>

            {fetching ? (
              <div className="flex items-center justify-center py-12">
                <div className="spinner" />
              </div>
            ) : categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-richblack-400">
                <MdOutlineCategory className="text-5xl opacity-30" />
                <p className="text-sm">No categories created yet.</p>
                <p className="text-xs text-richblack-500">
                  Use the form to create your first category.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {categories.map((cat, index) => (
                  <div
                    key={cat._id}
                    className="flex items-start gap-4 rounded-lg border border-richblack-700 bg-richblack-900 p-4 transition-all duration-200 hover:border-richblack-600"
                  >
                    {/* Index badge */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-50/10 text-xs font-bold text-yellow-50">
                      {index + 1}
                    </div>

                    {/* Category info */}
                    <div className="flex flex-col gap-1 overflow-hidden">
                      <p className="truncate text-sm font-semibold text-richblack-5">
                        {cat.name}
                      </p>
                      {cat.description ? (
                        <p className="text-xs text-richblack-400 line-clamp-2">
                          {cat.description}
                        </p>
                      ) : (
                        <p className="text-xs italic text-richblack-600">
                          No description provided
                        </p>
                      )}
                    </div>

                    {/* Course count badge */}
                    <div className="ml-auto shrink-0 rounded-full bg-richblack-700 px-3 py-1 text-xs font-medium text-richblack-300">
                      {cat.courses?.length ?? 0}{" "}
                      {cat.courses?.length === 1 ? "course" : "courses"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
