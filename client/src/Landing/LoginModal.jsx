import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { X, Mail, Lock, LogIn } from 'lucide-react'
import * as THREE from 'three'

const G     = '#16a34a'
const GDARK = '#14532d'
const GLIGHT= '#dcfce7'
const GMID  = '#86efac'
const GMUTE = '#4b7c5e'

/* ── Three.js: floating particle field ─────────────────────── */
function Particles({ count = 120 }) {
  const mesh = useRef()

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors    = new Float32Array(count * 3)
    const green1 = new THREE.Color('#16a34a')
    const green2 = new THREE.Color('#86efac')
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 14
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6
      const c = Math.random() > 0.5 ? green1 : green2
      colors[i * 3]     = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    return { positions, colors }
  }, [count])

  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.y = clock.getElapsedTime() * 0.04
      mesh.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.02) * 0.1
    }
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]}    />
      </bufferGeometry>
      <pointsMaterial size={0.07} vertexColors transparent opacity={0.85} sizeAttenuation />
    </points>
  )
}

/* ── Three.js: rotating torus knot ─────────────────────────── */
function FloatingShape() {
  const mesh = useRef()
  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.x = clock.getElapsedTime() * 0.3
      mesh.current.rotation.y = clock.getElapsedTime() * 0.2
    }
  })
  return (
    <mesh ref={mesh} position={[3.5, 0, -2]}>
      <torusKnotGeometry args={[1, 0.28, 128, 16]} />
      <meshStandardMaterial
        color="#16a34a"
        wireframe
        transparent
        opacity={0.18}
      />
    </mesh>
  )
}

/* ── Three.js: orbiting ring ────────────────────────────────── */
function Ring() {
  const mesh = useRef()
  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.x = clock.getElapsedTime() * 0.15
      mesh.current.rotation.z = clock.getElapsedTime() * 0.1
    }
  })
  return (
    <mesh ref={mesh} position={[-3.5, 1, -1]}>
      <torusGeometry args={[1.2, 0.04, 16, 80]} />
      <meshStandardMaterial color="#86efac" transparent opacity={0.3} />
    </mesh>
  )
}

/* ── Scene ──────────────────────────────────────────────────── */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#16a34a" />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#86efac" />
      <Particles />
      <FloatingShape />
      <Ring />
    </>
  )
}

/* ── Login Modal ────────────────────────────────────────────── */
export default function LoginModal({ onClose }) {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const role = e.target.role.value
    onClose()
    navigate(role === 'admin' ? '/admin' : '/user')
  }
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {/* Three.js fullscreen background */}
        <div style={{ position: 'absolute', inset: 0, background: '#071a0f' }}>
          <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
            <Scene />
          </Canvas>
        </div>

        {/* dark overlay tint */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(7,26,15,0.7) 0%, rgba(7,26,15,0.5) 100%)',
        }} />

        {/* close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 24, right: 28, zIndex: 10,
            background: 'rgba(255,255,255,0.08)', border: `1px solid ${GMID}40`,
            borderRadius: '50%', width: 40, height: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: GMID,
          }}>
          <X size={18} />
        </button>

        {/* login card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            position: 'relative', zIndex: 10,
            width: '100%', maxWidth: 420,
            margin: '0 24px',
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(24px)',
            border: `1px solid ${GMID}30`,
            borderRadius: 24,
            padding: '40px 36px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
          }}
        >
          {/* logo */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.5px' }}>
              <span style={{ color: GMID }}>Bill</span>
              <span style={{ color: G }}>4</span>
              <span style={{ color: '#fff' }}>Food</span>
            </div>
            <p style={{ color: GMID, fontSize: 13, marginTop: 6, opacity: 0.8 }}>
              Admin Portal — Sri Eshwar College
            </p>
          </div>

          {/* divider */}
          <div style={{ height: 1, background: `${GMID}25`, marginBottom: 28 }} />

          {/* form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* email */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: GMID, display: 'block', marginBottom: 6, textAlign: 'left' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: GMUTE }} />
                <input
                  type="email"
                  placeholder="admin@sece.ac.in"
                  style={{
                    width: '100%', padding: '12px 14px 12px 40px',
                    borderRadius: 12, fontSize: 14,
                    background: 'rgba(255,255,255,0.07)',
                    border: `1px solid ${GMID}30`,
                    color: '#fff', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = G}
                  onBlur={e  => e.target.style.borderColor = `${GMID}30`}
                />
              </div>
            </div>

            {/* password */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: GMID, display: 'block', marginBottom: 6, textAlign: 'left' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: GMUTE }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '12px 14px 12px 40px',
                    borderRadius: 12, fontSize: 14,
                    background: 'rgba(255,255,255,0.07)',
                    border: `1px solid ${GMID}30`,
                    color: '#fff', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = G}
                  onBlur={e  => e.target.style.borderColor = `${GMID}30`}
                />
              </div>
            </div>

            {/* role selector */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: GMID, display: 'block', marginBottom: 6, textAlign: 'left' }}>
                Role
              </label>
              <select
                name="role"
                style={{
                  width: '100%', padding: '12px 14px',
                  borderRadius: 12, fontSize: 14,
                  background: 'rgba(20,40,28,0.9)',
                  border: `1px solid ${GMID}30`,
                  color: '#fff', outline: 'none',
                  boxSizing: 'border-box', cursor: 'pointer',
                }}
                onFocus={e => e.target.style.borderColor = G}
                onBlur={e  => e.target.style.borderColor = `${GMID}30`}
              >
                <option value="admin">Admin (Canteen Manager)</option>
                <option value="staff">Counter Staff</option>
              </select>
            </div>

            {/* submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                marginTop: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '13px', borderRadius: 12, fontWeight: 700, fontSize: 15,
                background: `linear-gradient(135deg, ${G}, #15803d)`,
                color: '#fff', border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 20px #16a34a40',
              }}
            >
              <LogIn size={17} /> Sign In
            </motion.button>
          </form>

          {/* footer note */}
          <p style={{ textAlign: 'center', fontSize: 12, color: GMUTE, marginTop: 20, opacity: 0.7 }}>
            Student ordering doesn't require login
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
