import { useEffect, useState, useCallback } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { AiOutlineSearch } from "react-icons/ai"
import { BiFilter, BiX } from "react-icons/bi"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { MdOutlineSchool } from "react-icons/md"

import { searchCourses, getFilterOptions } from "../services/operations/courseAPI"
import Course_Card from "../components/core/Catalog/Course_Card"
import Footer from "../components/Common/Footer"

// ─── Constants ────────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { label: "Most Relevant",    value: "relevance"  },
  { label: "Newest",           value: "newest"     },
  { label: "Top Rated",        value: "top-rated"  },
  { label: "Most Popular",     value: "popular"    },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc"},
]

const RATING_OPTIONS = [
  { label: "Any Rating",  value: ""  },
  { label: "4★ & above", value: "4" },
  { label: "3★ & above", value: "3" },
  { label: "2★ & above", value: "2" },
]

const PRICE_OPTIONS = [
  { label: "All Prices", value: ""     },
  { label: "Free",       value: "free" },
  { label: "Paid",       value: "paid" },
]

const DURATION_OPTIONS = [
  { label: "Any Duration", value: ""     },
  { label: "0 – 2 hours",  value: "0-2"  },
  { label: "2 – 5 hours",  value: "2-5"  },
  { label: "5 – 10 hours", value: "5-10" },
  { label: "10+ hours",    value: "10+"  },
]

const LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced"]

const LEVEL_COLORS = {
  Beginner:     "bg-caribbeangreen-900 text-caribbeangreen-100",
  Intermediate: "bg-blue-900 text-blue-200",
  Advanced:     "bg-pink-900 text-pink-200",
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(seconds) {
  if (!seconds) return null
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m > 0 ? m + "m" : ""}`.trim()
  return `${m}m`
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "")
  const [courses, setCourses]         = useState([])
  const [pagination, setPagination]   = useState(null)
  const [filterOptions, setFilterOptions] = useState({ categories: [], languages: [], levels: [] })
  const [loading, setLoading]         = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // ── Read every filter from URL ─────────────────────────────────────────────
  const q          = searchParams.get("q")          || ""
  const category   = searchParams.get("category")   || ""
  const priceType  = searchParams.get("priceType")  || ""
  const minRating  = searchParams.get("minRating")  || ""
  const level      = searchParams.get("level")      || ""   // comma-separated
  const language   = searchParams.get("language")   || ""   // comma-separated
  const duration   = searchParams.get("duration")   || ""
  const sortBy     = searchParams.get("sortBy")     || "relevance"
  const page       = parseInt(searchParams.get("page") || "1")

  // ── Update URL helper ──────────────────────────────────────────────────────
  const setParam = useCallback(
    (key, value) => {
      const next = new URLSearchParams(searchParams)
      if (value) next.set(key, value)
      else next.delete(key)
      next.set("page", "1") // always reset to page 1 on filter change
      setSearchParams(next, { replace: true })
    },
    [searchParams, setSearchParams]
  )

  const setPage = (p) => {
    const next = new URLSearchParams(searchParams)
    next.set("page", String(p))
    setSearchParams(next, { replace: true })
  }

  // ── Multi-select toggle (level / language) ─────────────────────────────────
  const toggleMulti = (key, value, current) => {
    const set = new Set(current ? current.split(",") : [])
    set.has(value) ? set.delete(value) : set.add(value)
    setParam(key, [...set].join(","))
  }

  // ── Fetch filter options once ──────────────────────────────────────────────
  useEffect(() => {
    getFilterOptions().then((opts) => setFilterOptions(opts || { categories: [], languages: [], levels: [] }))
  }, [])

  // ── Fetch courses whenever URL params change ───────────────────────────────
  useEffect(() => {
    const params = { page, limit: 12 }
    if (q)         params.q         = q
    if (category)  params.category  = category
    if (priceType) params.priceType = priceType
    if (minRating) params.minRating = minRating
    if (level)     params.level     = level
    if (language)  params.language  = language
    if (duration)  params.duration  = duration
    if (sortBy && sortBy !== "relevance") params.sortBy = sortBy

    setLoading(true)
    searchCourses(params).then(({ data, pagination: pg }) => {
      setCourses(data || [])
      setPagination(pg || null)
      setLoading(false)
    })

    // Sync the search bar text with URL
    setSearchInput(q)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()])

  // ── Search bar submit ──────────────────────────────────────────────────────
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`)
    }
  }

  // ── Clear all filters (keep q) ─────────────────────────────────────────────
  const clearFilters = () => {
    const next = new URLSearchParams()
    if (q) next.set("q", q)
    next.set("page", "1")
    setSearchParams(next, { replace: true })
  }

  const hasActiveFilters =
    category || priceType || minRating || level || language || duration || sortBy !== "relevance"

  const selectedLevels    = level    ? level.split(",")    : []
  const selectedLanguages = language ? language.split(",") : []

  // ── Active filter chips ────────────────────────────────────────────────────
  const activeChips = [
    category  && { key: "category",  label: filterOptions.categories.find((c) => c._id === category)?.name || "Category" },
    priceType && { key: "priceType", label: PRICE_OPTIONS.find((o) => o.value === priceType)?.label },
    minRating && { key: "minRating", label: `${minRating}★ & above` },
    duration  && { key: "duration",  label: DURATION_OPTIONS.find((o) => o.value === duration)?.label },
    ...selectedLevels.map((l)    => ({ key: `level-${l}`,    label: l,  remove: () => toggleMulti("level", l, level) })),
    ...selectedLanguages.map((l) => ({ key: `lang-${l}`,     label: l,  remove: () => toggleMulti("language", l, language) })),
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-richblack-900">
      {/* ── Hero / Search bar ─────────────────────────────────────────────── */}
      <div className="bg-richblack-800 border-b border-richblack-700">
        <div className="mx-auto max-w-maxContent px-4 py-10">
          <p className="mb-3 text-sm text-richblack-300">
            <Link to="/" className="hover:text-yellow-25">Home</Link>
            {" / "}
            <span className="text-yellow-25">Search</span>
          </p>
          <h1 className="mb-6 text-3xl font-bold text-richblack-5">
            {q ? (
              <>Results for <span className="text-yellow-25">"{q}"</span></>
            ) : (
              "Search Courses"
            )}
          </h1>

          <form onSubmit={handleSearchSubmit} className="flex w-full max-w-2xl items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-richblack-600 bg-richblack-700 px-4 py-3">
              <AiOutlineSearch className="text-xl text-richblack-400 flex-shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for any course, topic, or keyword..."
                className="flex-1 bg-transparent text-richblack-5 placeholder-richblack-400 outline-none"
              />
              {searchInput && (
                <button type="button" onClick={() => setSearchInput("")}>
                  <BiX className="text-lg text-richblack-400 hover:text-richblack-100" />
                </button>
              )}
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

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-maxContent px-4 py-8">

        {/* ── Top bar: count + mobile filter toggle + sort ─────────────── */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <p className="text-richblack-200">
              {loading ? (
                "Searching..."
              ) : (
                <>
                  <span className="font-semibold text-richblack-5">
                    {pagination?.totalCount ?? courses.length}
                  </span>{" "}
                  {(pagination?.totalCount ?? courses.length) === 1 ? "result" : "results"}
                  {q && <> for <span className="text-yellow-25">"{q}"</span></>}
                </>
              )}
            </p>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="flex items-center gap-1 rounded-lg border border-richblack-600 px-3 py-2 text-sm text-richblack-100 hover:border-richblack-400 md:hidden"
            >
              <BiFilter className="text-lg" />
              Filters
              {hasActiveFilters && <span className="ml-1 h-2 w-2 rounded-full bg-yellow-50" />}
            </button>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-richblack-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setParam("sortBy", e.target.value)}
              className="rounded-lg border border-richblack-600 bg-richblack-800 px-3 py-2 text-sm text-richblack-100 outline-none focus:border-yellow-50"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Active filter chips ───────────────────────────────────────── */}
        {activeChips.length > 0 && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {activeChips.map((chip) => (
              <span
                key={chip.key}
                className="flex items-center gap-1 rounded-full border border-richblack-600 bg-richblack-800 px-3 py-1 text-xs text-richblack-100"
              >
                {chip.label}
                <button
                  onClick={chip.remove ?? (() => setParam(chip.key, ""))}
                  className="ml-1 text-richblack-400 hover:text-richblack-100"
                >
                  <BiX />
                </button>
              </span>
            ))}
            <button
              onClick={clearFilters}
              className="text-xs text-yellow-50 hover:text-yellow-25 underline"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* ── Filter Sidebar ────────────────────────────────────────── */}
          <aside className={`w-64 flex-shrink-0 ${showFilters ? "block" : "hidden"} md:block`}>
            <div className="sticky top-4 rounded-xl border border-richblack-700 bg-richblack-800 p-5 space-y-5">

              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-richblack-5">Filters</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-yellow-50 hover:text-yellow-25">
                    Clear all
                  </button>
                )}
              </div>

              {/* Category */}
              <div className="border-b border-richblack-700 pb-5">
                <p className="mb-3 text-sm font-medium text-richblack-100">Category</p>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio" name="category" value=""
                      checked={category === ""}
                      onChange={() => setParam("category", "")}
                      className="accent-yellow-50"
                    />
                    <span className="text-sm text-richblack-200">All Categories</span>
                  </label>
                  {filterOptions.categories.map((cat) => (
                    <label key={cat._id} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio" name="category" value={cat._id}
                        checked={category === cat._id}
                        onChange={() => setParam("category", cat._id)}
                        className="accent-yellow-50"
                      />
                      <span className="text-sm text-richblack-200">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="border-b border-richblack-700 pb-5">
                <p className="mb-3 text-sm font-medium text-richblack-100">Price</p>
                <div className="flex flex-col gap-2">
                  {PRICE_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio" name="priceType" value={opt.value}
                        checked={priceType === opt.value}
                        onChange={() => setParam("priceType", opt.value)}
                        className="accent-yellow-50"
                      />
                      <span className="text-sm text-richblack-200">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="border-b border-richblack-700 pb-5">
                <p className="mb-3 text-sm font-medium text-richblack-100">Minimum Rating</p>
                <div className="flex flex-col gap-2">
                  {RATING_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio" name="minRating" value={opt.value}
                        checked={minRating === opt.value}
                        onChange={() => setParam("minRating", opt.value)}
                        className="accent-yellow-50"
                      />
                      <span className="text-sm text-richblack-200">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div className="border-b border-richblack-700 pb-5">
                <p className="mb-3 text-sm font-medium text-richblack-100">Level</p>
                <div className="flex flex-col gap-2">
                  {LEVEL_OPTIONS.map((lvl) => (
                    <label key={lvl} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedLevels.includes(lvl)}
                        onChange={() => toggleMulti("level", lvl, level)}
                        className="accent-yellow-50 h-4 w-4"
                      />
                      <span className="text-sm text-richblack-200">{lvl}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="border-b border-richblack-700 pb-5">
                <p className="mb-3 text-sm font-medium text-richblack-100">Duration</p>
                <div className="flex flex-col gap-2">
                  {DURATION_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio" name="duration" value={opt.value}
                        checked={duration === opt.value}
                        onChange={() => setParam("duration", opt.value)}
                        className="accent-yellow-50"
                      />
                      <span className="text-sm text-richblack-200">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Language */}
              {filterOptions.languages.length > 0 && (
                <div>
                  <p className="mb-3 text-sm font-medium text-richblack-100">Language</p>
                  <div className="flex flex-col gap-2">
                    {filterOptions.languages.map((lang) => (
                      <label key={lang} className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedLanguages.includes(lang)}
                          onChange={() => toggleMulti("language", lang, language)}
                          className="accent-yellow-50 h-4 w-4"
                        />
                        <span className="text-sm text-richblack-200">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* ── Course Results ────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-xl bg-richblack-800">
                    <div className="h-[180px] w-full rounded-xl bg-richblack-700" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-richblack-700" />
                      <div className="h-3 w-1/2 rounded bg-richblack-700" />
                      <div className="h-4 w-1/3 rounded bg-richblack-700" />
                    </div>
                  </div>
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <MdOutlineSchool className="mb-4 text-6xl text-richblack-600" />
                <h3 className="mb-2 text-xl font-semibold text-richblack-100">No courses found</h3>
                <p className="text-richblack-400 max-w-sm">
                  {q
                    ? `We couldn't find any courses matching "${q}". Try a different keyword or remove some filters.`
                    : "Start searching or adjust your filters."}
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
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course) => (
                    <div key={course._id} className="relative">
                      <Course_Card course={course} Height="h-[180px]" />
                      {/* Level + Duration badges */}
                      <div className="absolute left-2 top-2 flex gap-1 pointer-events-none">
                        {course.level && (
                          <span className={`rounded px-2 py-0.5 text-xs font-semibold ${LEVEL_COLORS[course.level] || "bg-richblack-700 text-richblack-100"}`}>
                            {course.level}
                          </span>
                        )}
                        {course.totalDuration > 0 && (
                          <span className="rounded bg-richblack-900 bg-opacity-80 px-2 py-0.5 text-xs text-richblack-100">
                            {formatDuration(course.totalDuration)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── Pagination ───────────────────────────────────────── */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                      className="flex items-center gap-1 rounded-lg border border-richblack-600 px-3 py-2 text-sm text-richblack-200 hover:border-richblack-400 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <FiChevronLeft /> Prev
                    </button>

                    {Array.from({ length: pagination.totalPages }).map((_, i) => {
                      const p = i + 1
                      // Show first, last, current, and neighbours
                      const show = p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1
                      if (!show) {
                        // Show ellipsis only once per gap
                        if (p === 2 || p === pagination.totalPages - 1) {
                          return <span key={p} className="text-richblack-500 px-1">…</span>
                        }
                        return null
                      }
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                            p === page
                              ? "bg-yellow-50 text-richblack-900"
                              : "border border-richblack-600 text-richblack-200 hover:border-richblack-400"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    })}

                    <button
                      disabled={page >= pagination.totalPages}
                      onClick={() => setPage(page + 1)}
                      className="flex items-center gap-1 rounded-lg border border-richblack-600 px-3 py-2 text-sm text-richblack-200 hover:border-richblack-400 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next <FiChevronRight />
                    </button>
                  </div>
                )}

                {/* Results count info */}
                {pagination && (
                  <p className="mt-4 text-center text-xs text-richblack-500">
                    Showing {(page - 1) * 12 + 1}–{Math.min(page * 12, pagination.totalCount)} of{" "}
                    {pagination.totalCount} results
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
