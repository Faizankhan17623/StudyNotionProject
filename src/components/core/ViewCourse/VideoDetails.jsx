import React, { useEffect, useRef, useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { FiDownload, FiFileText, FiMessageSquare, FiBookOpen, FiEdit3 } from "react-icons/fi"
import QandA from "./QandA"
import Notes from "./Notes"

import "video-react/dist/video-react.css"
import { useLocation } from "react-router-dom"
import { BigPlayButton, Player } from "video-react"

import { markLectureAsComplete } from "../../../services/operations/courseAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import { apiConnector } from "../../../services/apiConnector"
import { courseEndpoints } from "../../../services/apis"
import IconBtn from "../../Common/IconBtn"

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const playerRef = useRef(null)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState(null)
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [capturedTimestamp, setCapturedTimestamp] = useState(0)

  // FEATURE-9: Video Resume
  const timestampSaveTimer = useRef(null)
  const lastSavedTimestamp = useRef(0)

  useEffect(() => {
    ;(async () => {
      if (!courseSectionData.length) return
      if (!courseId && !sectionId && !subSectionId) {
        navigate(`/dashboard/enrolled-courses`)
      } else {
        const filteredData = courseSectionData.filter(
          (course) => course._id === sectionId
        )
        const filteredVideoData = filteredData?.[0]?.subSection.filter(
          (data) => data._id === subSectionId
        )
        setVideoData(filteredVideoData[0])
        setPreviewSource(courseEntireData.thumbnail)
        setVideoEnded(false)
        setActiveTab("overview")
        setCapturedTimestamp(0)
        lastSavedTimestamp.current = 0
      }
    })()
  }, [courseSectionData, courseEntireData, location.pathname])

  // FEATURE-9: Fetch saved timestamp and seek to it on load
  useEffect(() => {
    if (!subSectionId || !courseId || !token) return
    const loadTimestamp = async () => {
      try {
        const res = await apiConnector(
          "GET",
          `${courseEndpoints.GET_VIDEO_TIMESTAMP_API}?courseId=${courseId}&subsectionId=${subSectionId}`,
          null,
          { Authorization: `Bearer ${token}` }
        )
        if (res?.data?.success && res.data.timestamp > 5) {
          setTimeout(() => {
            playerRef.current?.seek(res.data.timestamp)
          }, 800)
        }
      } catch {
        // silently ignore
      }
    }
    loadTimestamp()
  }, [subSectionId, courseId])

  // FEATURE-9: Save timestamp (debounced)
  const saveTimestamp = useCallback(
    async (currentTime) => {
      if (Math.abs(currentTime - lastSavedTimestamp.current) < 5) return
      lastSavedTimestamp.current = currentTime
      try {
        await apiConnector(
          "POST",
          courseEndpoints.UPDATE_VIDEO_TIMESTAMP_API,
          { courseId, subsectionId: subSectionId, timestamp: currentTime },
          { Authorization: `Bearer ${token}` }
        )
      } catch {
        // silently ignore
      }
    },
    [courseId, subSectionId, token]
  )

  // FEATURE-9: Subscribe to player state — save on pause
  useEffect(() => {
    if (!playerRef.current) return
    const unsubscribe = playerRef.current.subscribeToStateChange((state) => {
      if (state.paused && state.currentTime > 5 && !state.ended) {
        clearTimeout(timestampSaveTimer.current)
        timestampSaveTimer.current = setTimeout(() => {
          saveTimestamp(state.currentTime)
        }, 500)
      }
    })
    return () => {
      clearTimeout(timestampSaveTimer.current)
      if (typeof unsubscribe === "function") unsubscribe()
    }
  }, [subSectionId, saveTimestamp])

  // Handle tab switch — auto-pause video and capture timestamp when Notes tab opens
  const handleTabChange = (tab) => {
    if (tab === "notes" && activeTab !== "notes") {
      // Capture current video position then pause
      const state = playerRef.current?.getState?.()?.player
      const currentTime = state?.currentTime ?? 0
      setCapturedTimestamp(currentTime)
      if (!state?.paused) {
        playerRef.current?.pause?.()
      }
    }
    setActiveTab(tab)
  }

  // Seek video to a saved timestamp and switch to overview so player is visible
  const handleSeekTo = (seconds) => {
    playerRef.current?.seek?.(seconds)
    setActiveTab("overview")
  }

  const isFirstVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)
    return currentSectionIndx === 0 && currentSubSectionIndx === 0
  }

  const goToNextVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx + 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      )
    } else {
      const nextSectionId = courseSectionData[currentSectionIndx + 1]._id
      const nextSubSectionId =
        courseSectionData[currentSectionIndx + 1].subSection[0]._id
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      )
    }
  }

  const isLastVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)
    return (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    )
  }

  const goToPrevVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      )
    } else {
      const prevSectionId = courseSectionData[currentSectionIndx - 1]._id
      const prevSubSectionLength =
        courseSectionData[currentSectionIndx - 1].subSection.length
      const prevSubSectionId =
        courseSectionData[currentSectionIndx - 1].subSection[
          prevSubSectionLength - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      )
    }
  }

  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    )
    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-5 text-white">
      {!videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : (
        <Player
          ref={playerRef}
          aspectRatio="16:9"
          playsInline
          onEnded={() => setVideoEnded(true)}
          src={videoData?.videoUrl}
        >
          <BigPlayButton position="center" />
          {videoEnded && (
            <div
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
              }}
              className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
            >
              {!completedLectures.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onclick={() => handleLectureCompletion()}
                  text={!loading ? "Mark As Completed" : "Loading..."}
                  customClasses="text-xl max-w-max px-4 mx-auto"
                />
              )}
              <IconBtn
                disabled={loading}
                onclick={() => {
                  if (playerRef?.current) {
                    playerRef?.current?.seek(0)
                    setVideoEnded(false)
                  }
                }}
                text="Rewatch"
                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
              />
              <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                {!isFirstVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToPrevVideo}
                    className="blackButton"
                  >
                    Prev
                  </button>
                )}
                {!isLastVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className="blackButton"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </Player>
      )}

      {/* Lecture title */}
      <h1 className="mt-4 text-2xl font-semibold text-richblack-5">{videoData?.title}</h1>

      {/* Tab bar */}
      <div className="mt-4 flex border-b border-richblack-700">
        <button
          onClick={() => handleTabChange("overview")}
          className={`flex items-center gap-2 px-4 pb-3 text-sm font-semibold transition-colors ${
            activeTab === "overview"
              ? "border-b-2 border-yellow-50 text-yellow-50"
              : "text-richblack-400 hover:text-richblack-200"
          }`}
        >
          <FiBookOpen />
          Overview
        </button>
        <button
          onClick={() => handleTabChange("notes")}
          className={`flex items-center gap-2 px-4 pb-3 text-sm font-semibold transition-colors ${
            activeTab === "notes"
              ? "border-b-2 border-yellow-50 text-yellow-50"
              : "text-richblack-400 hover:text-richblack-200"
          }`}
        >
          <FiEdit3 />
          Notes
        </button>
        <button
          onClick={() => handleTabChange("qna")}
          className={`flex items-center gap-2 px-4 pb-3 text-sm font-semibold transition-colors ${
            activeTab === "qna"
              ? "border-b-2 border-yellow-50 text-yellow-50"
              : "text-richblack-400 hover:text-richblack-200"
          }`}
        >
          <FiMessageSquare />
          Q&amp;A
        </button>
      </div>

      {/* Tab panels */}
      {activeTab === "overview" && (
        <div className="py-4">
          <p className="text-sm leading-relaxed text-richblack-200">{videoData?.description}</p>

          {/* FEATURE-15: Downloadable Resources */}
          {videoData?.resources?.length > 0 && (
            <div className="mt-5 rounded-xl border border-richblack-700 bg-richblack-800 p-5">
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-richblack-5">
                <FiFileText className="text-yellow-50" />
                Lecture Resources
              </h3>
              <div className="flex flex-col gap-2">
                {videoData.resources.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg border border-richblack-600 bg-richblack-900 px-4 py-3 text-sm text-richblack-200 transition-colors hover:border-yellow-50 hover:text-yellow-50"
                  >
                    <span className="flex items-center gap-2">
                      <FiFileText className="text-base" />
                      {resource.title}
                    </span>
                    <FiDownload className="shrink-0 text-base" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "notes" && (
        <div className="py-4">
          <Notes
            courseId={courseId}
            sectionId={sectionId}
            subSectionId={subSectionId}
            capturedTimestamp={capturedTimestamp}
            onSeekTo={handleSeekTo}
          />
        </div>
      )}

      {activeTab === "qna" && (
        <div className="py-4">
          <QandA courseId={courseId} subSectionId={subSectionId} />
        </div>
      )}
    </div>
  )
}

export default VideoDetails
