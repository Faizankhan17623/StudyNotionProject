import React, { useState } from "react"
import { Link } from "react-router-dom"
import { FaChevronDown, FaEnvelope, FaComments, FaBook } from "react-icons/fa"

import Footer from "../components/Common/Footer"

const categories = [
  {
    title: "Getting Started",
    icon: FaBook,
    faqs: [
      {
        q: "How do I create an account?",
        a: 'Click "Sign Up" in the top navigation, fill in your name, email, and password, then verify your email with the OTP we send you.',
      },
      {
        q: "How do I enroll in a course?",
        a: 'Open any course page and click "Buy Now" or "Enroll for Free". Paid courses go through a secure Razorpay checkout; free courses enroll you instantly.',
      },
      {
        q: "Can I access courses on mobile?",
        a: "Yes, StudyNotion is fully responsive and works in any modern mobile browser. A dedicated app isn't available yet.",
      },
    ],
  },
  {
    title: "Billing & Plans",
    icon: FaEnvelope,
    faqs: [
      {
        q: "What's the difference between Free, Pro, and Pro Max?",
        a: "Free gives you access to free courses and one active enrollment. Pro unlocks unlimited courses, downloadable resources, and priority support. Pro Max adds 1-on-1 mentorship sessions on top of everything in Pro. See the full comparison on our Pricing page.",
      },
      {
        q: "Can I change or cancel my plan anytime?",
        a: "Yes. Go to Pricing and choose a new plan, or downgrade to Free at any time — changes apply immediately.",
      },
      {
        q: "Do you offer refunds on course purchases?",
        a: "Reach out to our support team within 7 days of purchase with your order details and we'll review your request.",
      },
    ],
  },
  {
    title: "Account & Technical",
    icon: FaComments,
    faqs: [
      {
        q: "I forgot my password. What do I do?",
        a: 'Click "Forgot Password" on the login page and follow the reset link sent to your email.',
      },
      {
        q: "How do I become an instructor?",
        a: "Sign up with the Instructor account type, or contact support to have an existing Student account upgraded.",
      },
      {
        q: "A video isn't loading. How do I fix it?",
        a: "Try refreshing the page or switching browsers. If the problem persists, let us know which course and lecture so we can investigate.",
      },
    ],
  },
]

const AccordionItem = ({ faq, isOpen, onClick }) => {
  return (
    <div className="border-b border-richblack-700 last:border-b-0">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-richblack-5 font-medium">{faq.q}</span>
        <FaChevronDown
          className={`flex-shrink-0 text-richblack-300 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-richblack-300 leading-6">{faq.a}</p>
        </div>
      </div>
    </div>
  )
}

const HelpCenter = () => {
  const [activeCategory, setActiveCategory] = useState(0)
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div>
      <section className="relative overflow-hidden py-24">
        <div className="ambient-orb ambient-orb-1 top-0 left-[15%] w-[500px] h-[500px]"></div>

        <div className="relative z-10 mx-auto w-11/12 max-w-maxContent">
          <div className="text-center mb-14">
            <h1 className="text-4xl sm:text-5xl font-bold text-richblack-5 font-outfit">
              How can we <span className="text-gradient">help</span>?
            </h1>
            <p className="mt-4 text-richblack-300 text-lg max-w-2xl mx-auto">
              Search our most common questions below, or reach out to our team
              directly.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Category tabs */}
            <div className="lg:w-[28%] flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {categories.map((cat, i) => {
                const Icon = cat.icon
                return (
                  <button
                    key={cat.title}
                    onClick={() => {
                      setActiveCategory(i)
                      setOpenIndex(0)
                    }}
                    className={`flex items-center gap-3 whitespace-nowrap px-5 py-4 rounded-xl text-left transition-all duration-200 ${
                      activeCategory === i
                        ? "bg-richblack-800 border border-blue-500/50 text-richblack-5 shadow-[0_0_15px_rgba(31,162,255,0.15)]"
                        : "text-richblack-300 hover:bg-richblack-800/50"
                    }`}
                  >
                    <Icon />
                    <span className="font-medium">{cat.title}</span>
                  </button>
                )
              })}

              <div className="glass-card rounded-xl p-6 mt-2 hidden lg:block">
                <h3 className="text-richblack-5 font-semibold mb-2">
                  Still stuck?
                </h3>
                <p className="text-richblack-300 text-sm mb-4">
                  Our support team usually replies within a few hours.
                </p>
                <Link
                  to="/contact"
                  className="inline-block text-sm font-semibold text-yellow-50 hover:underline"
                >
                  Contact Support →
                </Link>
              </div>
            </div>

            {/* FAQ list */}
            <div className="lg:w-[72%] glass-card rounded-3xl p-8">
              <h2 className="text-xl font-semibold text-richblack-5 mb-2">
                {categories[activeCategory].title}
              </h2>
              <div className="mt-4">
                {categories[activeCategory].faqs.map((faq, i) => (
                  <AccordionItem
                    key={faq.q}
                    faq={faq}
                    isOpen={openIndex === i}
                    onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Support contact strip */}
          <div className="mt-16 glass-card rounded-3xl p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-semibold text-richblack-5">
                Didn't find your answer?
              </h3>
              <p className="text-richblack-300 mt-2">
                Email us at{" "}
                <a
                  href="mailto:info@studynotion.com"
                  className="text-caribbeangreen-100 font-medium hover:underline"
                >
                  info@studynotion.com
                </a>{" "}
                or send a message through our contact form.
              </p>
            </div>
            <Link
              to="/contact"
              className="whitespace-nowrap px-6 py-3 rounded-md font-bold bg-yellow-50 text-richblack-900 shadow-[0_0_15px_rgba(255,214,10,0.5)] hover:scale-105 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HelpCenter
