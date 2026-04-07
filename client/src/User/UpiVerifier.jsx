import { useState, useRef, useEffect } from 'react'
import { createWorker } from 'tesseract.js'
import { Camera, Upload, CheckCircle2, XCircle, Loader2, X, ScanLine } from 'lucide-react'

const G    = '#16a34a'
const GMID = '#86efac'

/* ── helpers ─────────────────────────────────────────────────── */
function extractUpiData(text) {
  const clean = text.replace(/\s+/g, ' ').toLowerCase()
  const amtMatch = clean.match(/(?:₹|rs\.?|inr|paid|amount)[^\d]*(\d[\d,]*(?:\.\d{1,2})?)/)
  const amount   = amtMatch ? parseFloat(amtMatch[1].replace(/,/g, '')) : null
  const txnMatch = clean.match(/(?:upi\s*ref|txn|transaction|ref\s*no|reference)[^\d]*(\d{10,})/i)
               || clean.match(/\b(\d{12,})\b/)
  const txnRef   = txnMatch ? txnMatch[1] : null
  const success  = /paid|success|complete|approved|debited/.test(clean)
  const upiMatch = clean.match(/([a-z0-9.\-_]+@[a-z]+)/)
  const payeeUpi = upiMatch ? upiMatch[1] : null
  return { amount, txnRef, success, payeeUpi }
}

function validate(data, expectedAmount, merchantUpi) {
  const errors = []
  if (!data.success)
    errors.push('No payment success confirmation found in screenshot')
  if (!data.amount)
    errors.push('Could not read payment amount')
  else if (Math.abs(data.amount - expectedAmount) > 1)
    errors.push(`Amount mismatch — expected ₹${expectedAmount}, found ₹${data.amount}`)
  if (data.payeeUpi && merchantUpi && !data.payeeUpi.includes(merchantUpi.split('@')[0]))
    errors.push(`Payee UPI mismatch — expected ${merchantUpi}`)
  return errors
}

/* ── CameraView ──────────────────────────────────────────────── */
function CameraView({ onCapture, onClose }) {
  const videoRef  = useRef()
  const streamRef = useRef()
  const [ready, setReady] = useState(false)
  const [err,   setErr]   = useState(null)

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then(stream => {
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
          setReady(true)
        }
      })
      .catch(() => setErr('Camera permission denied. Please use Upload instead.'))
    return () => streamRef.current?.getTracks().forEach(t => t.stop())
  }, [])

  const capture = () => {
    const video  = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width  = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    canvas.toBlob(blob => {
      streamRef.current?.getTracks().forEach(t => t.stop())
      onCapture(blob)
    }, 'image/jpeg', 0.92)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: '#000', display: 'flex', flexDirection: 'column' }}>
      {err ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
          <XCircle size={40} color="#f87171" />
          <p style={{ color: '#fca5a5', textAlign: 'center', fontSize: 14 }}>{err}</p>
          <button onClick={onClose} style={{ padding: '10px 24px', borderRadius: 50, background: G, border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
            Go Back
          </button>
        </div>
      ) : (
        <>
          <video ref={videoRef} playsInline muted style={{ flex: 1, width: '100%', objectFit: 'cover' }} />

          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -60%)', width: '80%', height: '45%', border: `2px dashed ${GMID}80`, borderRadius: 16, pointerEvents: 'none' }} />
          <p style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, calc(-60% - 28px))', color: GMID, fontSize: 11, fontWeight: 700, background: 'rgba(0,0,0,0.5)', padding: '3px 10px', borderRadius: 99, pointerEvents: 'none' }}>
            Align UPI screenshot inside
          </p>

          <div style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.7)' }}>
            <button onClick={onClose} style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={20} color="#fff" />
            </button>
            <button onClick={capture} disabled={!ready} style={{ width: 68, height: 68, borderRadius: '50%', background: ready ? '#fff' : '#555', border: `4px solid ${GMID}`, cursor: ready ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 24px ${GMID}60` }}>
              <ScanLine size={28} color={G} />
            </button>
            <div style={{ width: 44 }} />
          </div>
        </>
      )}
    </div>
  )
}

/* ── main component ──────────────────────────────────────────── */
export default function UpiVerifier({ total, merchantUpi, token, onVerified, onCancel }) {
  const [stage,  setStage]  = useState('idle')
  const [imgSrc, setImgSrc] = useState(null)
  const [errors, setErrors] = useState([])
  const fileRef = useRef()

  const runOcr = async (blob) => {
    setStage('scanning')
    setErrors([])
    setImgSrc(URL.createObjectURL(blob))
    try {
      const worker = await createWorker('eng')
      const { data: { text } } = await worker.recognize(blob)
      await worker.terminate()
      const extracted = extractUpiData(text)
      const errs      = validate(extracted, total, merchantUpi)
      if (errs.length === 0) {
        setStage('done')
        onVerified({ txnRef: extracted.txnRef || '', payerUpiId: extracted.payeeUpi || '' })
      } else {
        setErrors(errs)
        setStage('error')
      }
    } catch {
      setErrors(['OCR failed — please try again'])
      setStage('error')
    }
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (file) runOcr(file)
    e.target.value = ''
  }

  const reset = () => { setStage('idle'); setImgSrc(null); setErrors([]) }

  if (stage === 'camera') {
    return <CameraView onCapture={(blob) => { setStage('idle'); runOcr(blob) }} onClose={() => setStage('idle')} />
  }

  return (
    <div style={{ background: '#0d1f14', border: `1px solid ${GMID}20`, borderRadius: 20, padding: 24, maxWidth: 360, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 900, fontSize: 16, color: '#fff' }}>Verify Payment</div>
        <div style={{ fontSize: 12, color: GMID, opacity: 0.7, marginTop: 4 }}>
          Capture or upload your UPI success screenshot to confirm ₹{total}
        </div>
      </div>

      {imgSrc && (
        <img src={imgSrc} alt="screenshot" style={{ width: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 12, border: `1px solid ${GMID}30` }} />
      )}

      {stage === 'scanning' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: GMID, fontSize: 14 }}>
          <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
          Reading screenshot…
        </div>
      )}

      {stage === 'done' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: G, fontSize: 14, fontWeight: 700 }}>
          <CheckCircle2 size={18} /> Payment verified!
        </div>
      )}

      {stage === 'error' && (
        <div style={{ width: '100%', background: '#450a0a', borderRadius: 12, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {errors.map((e, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 12, color: '#fca5a5' }}>
              <XCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} /> {e}
            </div>
          ))}
        </div>
      )}

      {stage !== 'done' && stage !== 'scanning' && (
        <div style={{ display: 'flex', gap: 10, width: '100%' }}>
          <button onClick={() => setStage('camera')} style={{ flex: 1, padding: '11px', borderRadius: 12, border: `1px solid ${GMID}30`, background: `${G}15`, color: GMID, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Camera size={15} /> Camera
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          <button onClick={() => fileRef.current.click()} style={{ flex: 1, padding: '11px', borderRadius: 12, border: `1px solid ${GMID}30`, background: `${G}15`, color: GMID, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Upload size={15} /> Upload
          </button>
        </div>
      )}

      {stage === 'error' && (
        <button onClick={reset} style={{ fontSize: 13, color: GMID, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
          Try again with a clearer screenshot
        </button>
      )}

      <button onClick={onCancel} style={{ fontSize: 12, color: '#ffffff40', background: 'none', border: 'none', cursor: 'pointer' }}>
        Cancel
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
