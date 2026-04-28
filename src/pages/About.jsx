import React from "react"

import FoundingStory from "../assets/Images/FoundingStory.png"
import BannerImage1 from "../assets/Images/aboutus1.webp"
import BannerImage2 from "../assets/Images/aboutus2.webp"
import BannerImage3 from "../assets/Images/aboutus3.webp"
import Footer from "../components/Common/Footer"
import ReviewSlider from "../components/Common/ReviewSlider"
import ContactFormSection from "../components/core/AboutPage/ContactFormSection"
import LearningGrid from "../components/core/AboutPage/LearningGrid"
import Quote from "../components/core/AboutPage/Quote"
import StatsComponenet from "../components/core/AboutPage/Stats"
import HighlightText from "../components/core/HomePage/HighlightText"

const About = () => {
  return (
    <div>
      <section className="relative overflow-hidden py-32">
        {/* Ambient Glows */}
        <div className="ambient-orb ambient-orb-1 top-0 left-[10%] w-[500px] h-[500px]"></div>
        <div className="ambient-orb ambient-orb-2 top-[20%] right-[10%] w-[600px] h-[600px]" style={{animationDelay: '-3s'}}></div>

        <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-center text-white z-10">
          <header className="mx-auto py-10 text-5xl md:text-7xl font-bold font-outfit lg:w-[80%] animate-revealDown leading-tight">
            Driving Innovation in Online Education for a <br/>
            <span className="text-gradient-yellow">Brighter Future</span>
            <p className="mx-auto mt-3 text-center text-base font-medium text-richblack-300 lg:w-[95%]">
              Studynotion is at the forefront of driving innovation in online
              education. We're passionate about creating a brighter future by
              offering cutting-edge courses, leveraging emerging technologies,
              and nurturing a vibrant learning community.
            </p>
          </header>
          <div className="sm:h-[70px] lg:h-[200px]"></div>
          <div className="absolute bottom-0 left-[50%] grid w-[100%] translate-x-[-50%] translate-y-[30%] grid-cols-3 gap-5 lg:gap-8 z-20">
            <img src={BannerImage1} alt="" className="rounded-2xl shadow-[0_20px_50px_rgba(31,162,255,0.4)] transition-transform duration-500 hover:scale-105 hover:-translate-y-2" />
            <img src={BannerImage2} alt="" className="rounded-2xl shadow-[0_20px_50px_rgba(255,214,10,0.4)] transition-transform duration-500 hover:scale-105 hover:-translate-y-2" />
            <img src={BannerImage3} alt="" className="rounded-2xl shadow-[0_20px_50px_rgba(166,255,203,0.4)] transition-transform duration-500 hover:scale-105 hover:-translate-y-2" />
          </div>
        </div>
      </section>

      <section className="border-b border-richblack-700">
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
          <div className="h-[100px] "></div>
          <Quote />
        </div>
      </section>

      <section>
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
          <div className="flex flex-col items-center gap-10 lg:flex-row justify-between relative">
            <div className="ambient-orb ambient-orb-1 top-1/2 left-0 w-[400px] h-[400px]"></div>
            <div className="my-24 flex lg:w-[50%] flex-col gap-10 z-10 glass-card p-10 rounded-3xl">
              <h1 className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-5xl font-bold font-outfit text-transparent lg:w-[70%]">
                Our Founding Story
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                Our e-learning platform was born out of a shared vision and
                passion for transforming education. It all began with a group of
                educators, technologists, and lifelong learners who recognized
                the need for accessible, flexible, and high-quality learning
                opportunities in a rapidly evolving digital world.
              </p>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                As experienced educators ourselves, we witnessed firsthand the
                limitations and challenges of traditional education systems. We
                believed that education should not be confined to the walls of a
                classroom or restricted by geographical boundaries. We
                envisioned a platform that could bridge these gaps and empower
                individuals from all walks of life to unlock their full
                potential.
              </p>
            </div>

            <div className="relative z-10 animate-revealUp">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FC6767] to-[#833AB4] blur-[60px] opacity-40 z-[-1]"></div>
              <img
                src={FoundingStory}
                alt=""
                className="rounded-2xl shadow-[0_20px_50px_rgba(252,103,103,0.5)] border border-white/10"
              />
            </div>
          </div>
          <div className="flex flex-col items-center lg:gap-10 lg:flex-row justify-between">
            <div className="my-24 flex lg:w-[40%] flex-col gap-10 glass-card p-8 rounded-3xl z-10">
              <h1 className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-bold font-outfit text-transparent lg:w-[70%]">
                Our Vision
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                With this vision in mind, we set out on a journey to create an
                e-learning platform that would revolutionize the way people
                learn. Our team of dedicated experts worked tirelessly to
                develop a robust and intuitive platform that combines
                cutting-edge technology with engaging content, fostering a
                dynamic and interactive learning experience.
              </p>
            </div>
            <div className="my-24 flex lg:w-[40%] flex-col gap-10 glass-card p-8 rounded-3xl z-10">
              <h1 className="text-gradient text-4xl font-bold font-outfit lg:w-[70%]">
              Our Mission
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
              Our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <StatsComponenet />
      <section className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white">
        <LearningGrid />
        <ContactFormSection />
      </section>

      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        {/* Reviws from Other Learner */}
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        <ReviewSlider />
      </div>
      <Footer />
    </div>
  )
}

export default About
