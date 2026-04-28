import { FcGoogle } from "react-icons/fc"
import { useSelector } from "react-redux"
// assets/Images/frame.png
import frameImg from "../../../assets/Images/frame.png"

import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"

function Template({ title, description1, description2, image, formType }) {
  const { loading } = useSelector((state) => state.auth)

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col-reverse justify-between gap-y-12 py-12 md:flex-row md:gap-y-0 md:gap-x-12 relative">
          {/* Background Blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[100px] -z-10 animate-pulseGlow pointer-events-none hidden md:block"></div>
          
          <div className="mx-auto w-11/12 max-w-[450px] md:mx-0 glass-card p-8 rounded-2xl z-10 animate-revealUp">
            <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
              {title}
            </h1>
            <p className="mt-4 text-[1.125rem] leading-[1.625rem] mb-6">
              <span className="text-richblack-100">{description1}</span>{" "}
              <span className="font-edu-sa font-bold italic text-blue-100">
                {description2}
              </span>
            </p>
            {formType === "signup" ? <SignupForm /> : <LoginForm />}
          </div>
          <div className="relative mx-auto w-11/12 max-w-[450px] md:mx-0 animate-revealDown z-10">
            {/* Glow behind image */}
            <div className="absolute -top-4 right-4 w-full h-full bg-gradient-to-br from-blue-500/30 to-yellow-500/30 blur-2xl z-0 rounded-full"></div>
            <img
              src={frameImg}
              alt="Pattern"
              width={558}
              height={504}
              loading="lazy"
              className="relative z-10 drop-shadow-2xl opacity-70"
            />
            <img
              src={image}
              alt="Students"
              width={558}
              height={504}
              loading="lazy"
              className="absolute -top-4 right-4 z-20 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Template
