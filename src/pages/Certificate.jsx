import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { apiConnector } from "../services/apiConnector"
import { profileEndpoints } from "../services/apis"

function Certificate() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [certData, setCertData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCert = async () => {
      try {
        const res = await apiConnector(
          "GET",
          `${profileEndpoints.GET_CERTIFICATE_API}/${courseId}`,
          null,
          { Authorization: `Bearer ${token}` }
        )
        if (res?.data?.success) {
          setCertData(res.data.data)
        } else {
          setError(res?.data?.message || "Could not generate certificate")
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Could not generate certificate")
      }
      setLoading(false)
    }
    fetchCert()
  }, [courseId, token])

  const handlePrint = () => window.print()

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-richblack-900">
        <div className="spinner" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-richblack-900 px-4 text-center">
        <div className="text-5xl">🔒</div>
        <h2 className="text-2xl font-bold text-richblack-5">Certificate Unavailable</h2>
        <p className="max-w-md text-richblack-300">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-2 rounded-lg bg-yellow-50 px-6 py-2.5 text-sm font-semibold text-richblack-900"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Print button — hidden when printing */}
      <div className="no-print flex items-center justify-between bg-richblack-800 px-8 py-4">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-richblack-300 hover:text-richblack-100"
        >
          ← Back
        </button>
        <button
          onClick={handlePrint}
          className="rounded-lg bg-yellow-50 px-6 py-2.5 text-sm font-bold text-richblack-900 hover:opacity-90"
        >
          Download PDF
        </button>
      </div>

      {/* Certificate — this is what gets printed */}
      <div className="no-print flex min-h-[calc(100vh-64px)] items-center justify-center bg-richblack-900 p-8">
        <CertificateCard data={certData} />
      </div>

      {/* Print-only: the certificate fills the entire page */}
      <div className="print-only">
        <CertificateCard data={certData} />
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-only, .print-only * { visibility: visible; }
          .print-only { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; }
          .no-print { display: none !important; }
        }
        @media screen {
          .print-only { display: none; }
        }
      `}</style>
    </>
  )
}

function CertificateCard({ data }) {
  return (
    <div
      style={{
        width: "900px",
        minHeight: "636px",
        background: "linear-gradient(135deg, #0f0f0f 0%, #1c1f2e 50%, #0f0f0f 100%)",
        border: "2px solid #FFD60A",
        borderRadius: "12px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Georgia, 'Times New Roman', serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 80px",
        boxSizing: "border-box",
      }}
    >
      {/* Corner decorations */}
      {["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "48px",
            height: "48px",
            borderColor: "#FFD60A",
            borderStyle: "solid",
            borderWidth: 0,
            ...(i === 0 ? { top: 16, left: 16, borderTopWidth: 3, borderLeftWidth: 3 } : {}),
            ...(i === 1 ? { top: 16, right: 16, borderTopWidth: 3, borderRightWidth: 3 } : {}),
            ...(i === 2 ? { bottom: 16, left: 16, borderBottomWidth: 3, borderLeftWidth: 3 } : {}),
            ...(i === 3 ? { bottom: 16, right: 16, borderBottomWidth: 3, borderRightWidth: 3 } : {}),
          }}
        />
      ))}

      {/* Watermark */}
      <div
        style={{
          position: "absolute",
          fontSize: "120px",
          fontWeight: "900",
          color: "rgba(255, 214, 10, 0.04)",
          letterSpacing: "4px",
          userSelect: "none",
          pointerEvents: "none",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          whiteSpace: "nowrap",
        }}
      >
        StudyNotion
      </div>

      {/* Brand */}
      <div style={{ textAlign: "center", marginBottom: "8px" }}>
        <span
          style={{
            fontSize: "22px",
            fontWeight: "800",
            color: "#FFD60A",
            letterSpacing: "4px",
            fontFamily: "Arial, sans-serif",
            textTransform: "uppercase",
          }}
        >
          StudyNotion
        </span>
      </div>

      {/* Decorative line */}
      <div
        style={{
          width: "100%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, #FFD60A, transparent)",
          marginBottom: "28px",
        }}
      />

      {/* Certificate title */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <p style={{ fontSize: "13px", letterSpacing: "6px", color: "#ABB8C4", textTransform: "uppercase", margin: 0 }}>
          Certificate of Completion
        </p>
      </div>

      {/* Body text */}
      <p style={{ fontSize: "15px", color: "#ABB8C4", textAlign: "center", marginBottom: "6px" }}>
        This is to certify that
      </p>

      {/* Student name */}
      <h1
        style={{
          fontSize: "44px",
          fontWeight: "700",
          color: "#F1F2FF",
          textAlign: "center",
          fontStyle: "italic",
          margin: "0 0 12px",
          letterSpacing: "1px",
        }}
      >
        {data.studentName}
      </h1>

      <p style={{ fontSize: "15px", color: "#ABB8C4", textAlign: "center", margin: "0 0 8px" }}>
        has successfully completed the course
      </p>

      {/* Course name */}
      <div
        style={{
          background: "rgba(255, 214, 10, 0.08)",
          border: "1px solid rgba(255, 214, 10, 0.3)",
          borderRadius: "8px",
          padding: "12px 32px",
          marginBottom: "28px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "#FFD60A",
            margin: 0,
          }}
        >
          {data.courseName}
        </h2>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          gap: "48px",
          marginBottom: "32px",
          justifyContent: "center",
        }}
      >
        {[
          { label: "Completed On", value: data.completionDate },
          { label: "Total Lectures", value: `${data.totalLectures} Lessons` },
          { label: "Instructor", value: data.instructorName },
        ].map(({ label, value }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "11px", color: "#6B7280", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>
              {label}
            </div>
            <div style={{ fontSize: "14px", color: "#F1F2FF", fontWeight: "600" }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div
        style={{
          width: "100%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, #2C333F, transparent)",
          marginBottom: "16px",
        }}
      />

      {/* Certificate ID */}
      <p style={{ fontSize: "11px", color: "#3D3D3D", letterSpacing: "2px", textAlign: "center", margin: 0 }}>
        CERTIFICATE ID: {data.certificateId}
      </p>
    </div>
  )
}

export default Certificate
