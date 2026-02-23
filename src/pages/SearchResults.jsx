import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { AiOutlineSearch } from "react-icons/ai"
import { BiFilter } from "react-icons/bi"

import { searchCourses, fetchCourseCategories } from "../services/operations/courseAPI"
import Course_Card from "../components/core/Catalog/Course_Card"
import Footer from "../components/Common/Footer"

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
]

const RATING_OPTIONS = [
  { label: "Any Rating", value: "" },
  { label: "4★ & above", value: "4" },
  { label: "3★ & above", value: "3" },
]

const PRICE_OPTIONS = [
  { label: "All Prices", value: "" },
  { label: "Free", value: "free" },
  { label: "Paid", value: "paid" },
]

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const initialQuery = searchParams.get("q") || ""

  const [searchInput, setSearchInput] = useState(initialQuery)
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    category: "",
    priceType: "",
    minRating: "",
    sortBy: "relevance",
  })

  // Fetch categories for filter panel
  useEffect(() => {
    fetchCourseCategories().then((data) => setCategories(data || []))
  }, [])

  // Fetch courses whenever query or filters change
  useEffect(() => {
    const q = searchParams.get("q") || ""
    setSearchInput(q)
    fetchResults(q, filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const fetchResults = async (q, activeFilters) => {
    setLoading(true)
    const params = { q }
    if (activeFilters.category) params.category = activeFilters.category
    if (activeFilters.priceType) params.priceType = activeFilters.priceType
    if (activeFilters.minRating) params.minRating = activeFilters.minRating
    if (activeFilters.sortBy && activeFilters.sortBy !== "relevance")
      params.sortBy = activeFilters.sortBy

    const data = await searchCourses(params)
    setCourses(data || [])
    setLoading(false)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`)
    }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    const q = searchParams.get("q") || ""
    fetchResults(q, newFilters)
  }

  const clearFilters = () => {
    const reset = { category: "", priceType: "", minRating: "", sortBy: "relevance" }
    setFilters(reset)
    fetchResults(searchParams.get("q") || "", reset)
  }

  const hasActiveFilters =
    filters.category || filters.priceType || filters.minRating || filters.sortBy !== "relevance"

  const query = searchParams.get("q") || ""

  return (
    <div className="min-h-screen bg-richblack-900">
      {/* Hero / Search bar */}
      <div className="bg-richblack-800 border-b border-richblack-700">
        <div className="mx-auto max-w-maxContent px-4 py-10">
          <p className="mb-3 text-sm text-richblack-300">
            Home / <span className="text-yellow-25">Search</span>
          </p>
          <h1 className="mb-6 text-3xl font-bold text-richblack-5">
            {query ? (
              <>
                Results for{" "}
                <span className="text-yellow-25">"{query}"</span>
              </>
            ) : (
              "Search Courses"
            )}
          </h1>
          <form onSubmit={handleSearchSubmit} className="flex w-full max-w-2xl items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-richblack-600 bg-richblack-700 px-4 py-3">
              <AiOutlineSearch className="text-xl text-richblack-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for any course, topic, or keyword..."
                className="flex-1 bg-transparent text-richblack-5 placeholder-richblack-400 outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-yellow-50 px-6 py-3 font-semibold text-richblack-900 hover:bg-yellow-25 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-maxContent px-4 py-8">
        {/* Results header row */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-richblack-200">
            {loading ? (
              "Searching..."
            ) : (
              <>
                <span className="font-semibold text-richblack-5">{courses.length}</span>{" "}
                {courses.length === 1 ? "result" : "results"}
                {query && (
                  <>
                    {" "}for{" "}
                    <span className="text-yellow-25">"{query}"</span>
                  </>
                )}
              </>
            )}
          </p>
          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="flex items-center gap-1 rounded-lg border border-richblack-600 px-3 py-2 text-sm text-richblack-100 hover:border-richblack-400 md:hidden"
            >
              <BiFilter className="text-lg" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 h-2 w-2 rounded-full bg-yellow-50" />
              )}
            </button>
            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-richblack-400">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="rounded-lg border border-richblack-600 bg-richblack-800 px-3 py-2 text-sm text-richblack-100 outline-none focus:border-yellow-50"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <aside
            className={`w-64 flex-shrink-0 ${
              showFilters ? "block" : "hidden"
            } md:block`}
          >
            <div className="sticky top-4 rounded-xl border border-richblack-700 bg-richblack-800 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-richblack-5">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-yellow-50 hover:text-yellow-25"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-5 border-b border-richblack-700 pb-5">
                <p className="mb-3 text-sm font-medium text-richblack-100">Category</p>
                <div className="flex flex-col gap-2">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={filters.category === ""}
                      onChange={() => handleFilterChange("category", "")}
                      className="accent-yellow-50"
                    />
                    <span className="text-sm text-richblack-200">All Categories</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat._id} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="category"
                        value={cat._id}
                        checked={filters.category === cat._id}
                        onChange={() => handleFilterChange("category", cat._id)}
                        className="accent-yellow-50"
                      />
                      <span className="text-sm text-richblack-200">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-5 border-b border-richblack-700 pb-5">
                <p className="mb-3 text-sm font-medium text-richblack-100">Price</p>
                <div className="flex flex-col gap-2">
                  {PRICE_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="priceType"
                        value={opt.value}
                        checked={filters.priceType === opt.value}
                        onChange={() => handleFilterChange("priceType", opt.value)}
                        className="accent-yellow-50"
                      />
                      <span className="text-sm text-richblack-200">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <p className="mb-3 text-sm font-medium text-richblack-100">Minimum Rating</p>
                <div className="flex flex-col gap-2">
                  {RATING_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="minRating"
                        value={opt.value}
                        checked={filters.minRating === opt.value}
                        onChange={() => handleFilterChange("minRating", opt.value)}
                        className="accent-yellow-50"
                      />
                      <span className="text-sm text-richblack-200">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Course Results Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="spinner" />
              </div>
            ) : courses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <AiOutlineSearch className="mb-4 text-6xl text-richblack-600" />
                <h3 className="mb-2 text-xl font-semibold text-richblack-100">
                  No courses found
                </h3>
                <p className="text-richblack-400">
                  {query
                    ? `We couldn't find any courses matching "${query}". Try a different search or remove some filters.`
                    : "Start searching for courses above."}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 rounded-lg bg-yellow-50 px-5 py-2 text-sm font-semibold text-richblack-900 hover:bg-yellow-25"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <Course_Card key={course._id} course={course} Height="h-[180px]" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
