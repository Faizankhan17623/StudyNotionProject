import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { RxCross2 } from "react-icons/rx"
import { FiFileText, FiTrash2, FiPlusCircle } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"

import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseAPI"
import { setCourse } from "../../../../../slices/courseSlice"
import IconBtn from "../../../../Common/IconBtn"
import Upload from "../Upload"

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm()

  // console.log("view", view)
  // console.log("edit", edit)
  // console.log("add", add)

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)

  // FEATURE-15: Resource management state
  const [existingResources, setExistingResources] = useState(
    (view || edit) ? (modalData?.resources || []) : []
  )
  const [resourceTitle, setResourceTitle] = useState("")
  const [resourceFile, setResourceFile] = useState(null)
  const [removingResource, setRemovingResource] = useState(null)
  const resourceFileRef = useRef(null)

  useEffect(() => {
    if (view || edit) {
      // console.log("modalData", modalData)
      setValue("lectureTitle", modalData.title)
      setValue("lectureDesc", modalData.description)
      setValue("lectureVideo", modalData.videoUrl)
    }
  }, [])

  // detect whether form is updated or not
  const isFormUpdated = () => {
    const currentValues = getValues()
    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl ||
      (resourceFile && resourceTitle.trim())
    ) {
      return true
    }
    return false
  }

  // handle the editing of subsection
  const handleEditSubsection = async () => {
    const currentValues = getValues()
    // console.log("changes after editing form values:", currentValues)
    const formData = new FormData()
    // console.log("Values After Editing form values:", currentValues)
    formData.append("sectionId", modalData.sectionId)
    formData.append("subSectionId", modalData._id)
    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle)
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc)
    }
    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formData.append("video", currentValues.lectureVideo)
    }
    if (resourceFile && resourceTitle.trim()) {
      formData.append("resourceFile", resourceFile)
      formData.append("resourceTitle", resourceTitle.trim())
    }
    setLoading(true)
    const result = await updateSubSection(formData, token)
    if (result) {
      // console.log("result", result)
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setModalData(null)
    setLoading(false)
  }

  // FEATURE-15: Remove a resource directly (separate API call)
  const handleRemoveResource = async (index) => {
    setRemovingResource(index)
    const formData = new FormData()
    formData.append("sectionId", modalData.sectionId)
    formData.append("subSectionId", modalData._id)
    formData.append("removeResourceIndex", index)
    const result = await updateSubSection(formData, token)
    if (result) {
      setExistingResources((prev) => prev.filter((_, i) => i !== index))
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      )
      dispatch(setCourse({ ...course, courseContent: updatedCourseContent }))
    }
    setRemovingResource(null)
  }

  const onSubmit = async (data) => {
    // console.log(data)
    if (view) return

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form")
      } else {
        handleEditSubsection()
      }
      return
    }

    const formData = new FormData()
    formData.append("sectionId", modalData)
    formData.append("title", data.lectureTitle)
    formData.append("description", data.lectureDesc)
    formData.append("video", data.lectureVideo)
    setLoading(true)
    const result = await createSubSection(formData, token)
    if (result) {
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setModalData(null)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        {/* Modal Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-8 py-10"
        >
          {/* Lecture Video Upload */}
          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />
          {/* Lecture Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
              Lecture Title {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="form-style w-full"
            />
            {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture title is required
              </span>
            )}
          </div>
          {/* Lecture Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
              Lecture Description{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture Description is required
              </span>
            )}
          </div>
          {/* FEATURE-15: Resources section (visible in view/edit mode) */}
          {(view || edit) && (
            <div className="flex flex-col space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-richblack-5">
                <FiFileText className="text-yellow-50" />
                Lecture Resources
              </h3>

              {/* Existing resources list */}
              {existingResources.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {existingResources.map((res, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border border-richblack-600 bg-richblack-900 px-4 py-2.5"
                    >
                      <a
                        href={res.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-richblack-200 hover:text-yellow-50"
                      >
                        <FiFileText className="shrink-0" />
                        {res.title}
                      </a>
                      {edit && (
                        <button
                          type="button"
                          disabled={removingResource !== null || loading}
                          onClick={() => handleRemoveResource(idx)}
                          className="ml-4 text-pink-300 hover:text-pink-200 disabled:opacity-50"
                        >
                          {removingResource === idx ? (
                            <span className="text-xs">Removing…</span>
                          ) : (
                            <FiTrash2 />
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-richblack-400">No resources attached yet.</p>
              )}

              {/* Add resource (edit mode only) */}
              {edit && (
                <div className="mt-2 flex flex-col gap-2 rounded-lg border border-richblack-600 bg-richblack-900 p-4">
                  <p className="flex items-center gap-1 text-xs font-medium text-richblack-300">
                    <FiPlusCircle />
                    Attach a new resource (PDF, slides, etc.)
                  </p>
                  <input
                    type="text"
                    placeholder="Resource title (e.g. Lecture Slides)"
                    value={resourceTitle}
                    onChange={(e) => setResourceTitle(e.target.value)}
                    disabled={loading}
                    className="form-style w-full text-sm"
                  />
                  <input
                    ref={resourceFileRef}
                    type="file"
                    accept=".pdf,.ppt,.pptx,.doc,.docx,.zip,.txt"
                    disabled={loading}
                    onChange={(e) => setResourceFile(e.target.files[0] || null)}
                    className="text-sm text-richblack-300 file:mr-3 file:rounded file:border-0 file:bg-richblack-700 file:px-3 file:py-1 file:text-xs file:text-richblack-100"
                  />
                  {resourceFile && !resourceTitle.trim() && (
                    <p className="text-xs text-pink-300">Please add a title for this resource.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {!view && (
            <div className="flex justify-end">
              <IconBtn
                disabled={loading}
                text={loading ? "Loading.." : edit ? "Save Changes" : "Save"}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
