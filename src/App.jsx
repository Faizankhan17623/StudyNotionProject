import { useEffect, useState } from "react"
import "./App.css"
// Redux
import { useDispatch, useSelector } from "react-redux"
// React Router
import { Route, Routes, useNavigate } from "react-router-dom"
// Components
import Navbar from "./components/Common/Navbar"
import AdminRoute from "./components/core/Auth/AdminRoute"
import OpenRoute from "./components/core/Auth/OpenRoute"
import PrivateRoute from "./components/core/Auth/PrivateRoute"
import AddCourse from "./components/core/Dashboard/AddCourse"
import Cart from "./components/core/Dashboard/Cart"
import EditCourse from "./components/core/Dashboard/EditCourse"
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses"
import Instructor from "./components/core/Dashboard/Instructor"
import MyCourses from "./components/core/Dashboard/MyCourses"
import MyProfile from "./components/core/Dashboard/MyProfile"
import CreateCategory from "./components/core/Dashboard/Admin/CreateCategory"
import ReviewModeration from "./components/core/Dashboard/Admin/ReviewModeration"
import MaintenanceMode from "./components/core/Dashboard/Admin/MaintenanceMode"
import AdminAnalytics from "./components/core/Dashboard/Admin/AdminAnalytics"
import MaintenanceBanner from "./components/Common/MaintenanceBanner"
import AnnouncementTicker from "./components/Common/AnnouncementTicker"
import Settings from "./components/core/Dashboard/Settings"
import Wishlist from "./pages/Wishlist"
import VideoDetails from "./components/core/ViewCourse/VideoDetails"
import About from "./pages/About"
import Catalog from "./pages/Catalog"
import Contact from "./pages/Contact"
import CourseDetails from "./pages/CourseDetails"
import Dashboard from "./pages/Dashboard"
import Error from "./pages/Error"
import ForgotPassword from "./pages/ForgotPassword"
// Pages
import Home from "./pages/Home"
import Login from "./pages/Login"
import MaintenancePage from "./pages/MaintenancePage"
import SearchResults from "./pages/SearchResults"
import Signup from "./pages/Signup"
import UpdatePassword from "./pages/UpdatePassword"
import VerifyEmail from "./pages/VerifyEmail"
import ViewCourse from "./pages/ViewCourse"
import Certificate from "./pages/Certificate"
import InstructorProfile from "./pages/InstructorProfile"
import { getUserDetails } from "./services/operations/profileAPI"
import { logout } from "./services/operations/authAPI"
import { apiConnector } from "./services/apiConnector"
import { maintenanceEndpoints } from "./services/apis"
import { ACCOUNT_TYPE } from "./utils/constants"
import useTracker from "./hooks/useTracker"

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, loading: profileLoading } = useSelector((state) => state.profile)

  // Track page views and heartbeats silently in the background
  useTracker()

  const [maintenanceData, setMaintenanceData] = useState(null)

  // Load user details on mount if token exists
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = JSON.parse(localStorage.getItem("token"))
      dispatch(getUserDetails(token, navigate))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Poll maintenance status every 5 minutes
  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const res = await apiConnector(
          "GET",
          maintenanceEndpoints.GET_MAINTENANCE_STATUS_API
        )
        if (res?.data?.success) {
          setMaintenanceData(res.data.data)
        }
      } catch {
        // silently ignore — never crash the app over a maintenance check
      }
    }
    checkMaintenance()
    const interval = setInterval(checkMaintenance, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // When maintenance becomes active, log out any non-admin user who is currently logged in
  useEffect(() => {
    if (
      maintenanceData?.isActive &&
      user &&
      user.accountType !== ACCOUNT_TYPE.ADMIN
    ) {
      dispatch(logout(navigate))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maintenanceData?.isActive, user?.accountType])

  // --- Maintenance gate ---
  // Wait for profile to finish loading before applying the gate —
  // so an admin whose token is being verified doesn't get flashed the maintenance page.
  const tokenExists = Boolean(localStorage.getItem("token"))
  const profileReady = !tokenExists || !profileLoading

  if (maintenanceData?.isActive && profileReady && user?.accountType !== ACCOUNT_TYPE.ADMIN) {
    return <MaintenancePage data={maintenanceData} />
  }

  return (
    <div className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter">
      {/* Announcement ticker — visible on every route */}
      {/* <AnnouncementTicker /> */}
      {/* Admin-only maintenance banner — reminds admin that maintenance is still active */}
      {maintenanceData?.isActive && user?.accountType === ACCOUNT_TYPE.ADMIN && (
        <MaintenanceBanner data={maintenanceData} />
      )}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />
        <Route path="catalog/:catalogName" element={<Catalog />} />
        {/* FEATURE-10: Public instructor profile */}
        <Route path="instructor/:instructorId" element={<InstructorProfile />} />
        {/* Open Route - for Only Non Logged in User */}
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
        {/* Private Route - for Only Logged in User */}
        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          {/* Route for all users */}
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/settings" element={<Settings />} />
          {/* Instructor routes */}
          <Route path="dashboard/instructor" element={<Instructor />} />
          <Route path="dashboard/my-courses" element={<MyCourses />} />
          <Route path="dashboard/add-course" element={<AddCourse />} />
          <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
          {/* Student routes */}
          <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
          <Route path="dashboard/cart" element={<Cart />} />
          <Route path="dashboard/wishlist" element={<Wishlist />} />
          {/* Admin routes */}
          <Route
            path="dashboard/create-category"
            element={
              <AdminRoute>
                <CreateCategory />
              </AdminRoute>
            }
          />
          <Route
            path="dashboard/review-moderation"
            element={
              <AdminRoute>
                <ReviewModeration />
              </AdminRoute>
            }
          />
          <Route
            path="dashboard/maintenance"
            element={
              <AdminRoute>
                <MaintenanceMode />
              </AdminRoute>
            }
          />
          <Route
            path="dashboard/admin-analytics"
            element={
              <AdminRoute>
                <AdminAnalytics />
              </AdminRoute>
            }
          />
        </Route>

        {/* For the watching course lectures */}
        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          <Route
            path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
            element={<VideoDetails />}
          />
        </Route>

        {/* FEATURE-2: Course completion certificate */}
        <Route
          path="certificate/:courseId"
          element={
            <PrivateRoute>
              <Certificate />
            </PrivateRoute>
          }
        />

        {/* 404 Page */}
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  )
}

export default App
