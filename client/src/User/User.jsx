import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Plus, Minus, X, ArrowLeft, Sparkles, Zap } from 'lucide-react'
import ClickSpark from './ClickSpark'
import { api } from '../api'
import { MEAL_SLOTS } from '../Admin/adminData'

/* ── theme ───────────────────────────────────────────────────── */
const G     = '#16a34a'
const GMID  = '#86efac'
const GLIGHT= '#dcfce7'
const GDARK = '#14532d'
const GMUTE = '#4b7c5e'

const fadeUp  = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

function slotLabel(id) {
  return MEAL_SLOTS.find((s) => s.id === id)?.label ?? id
}

/* ── Token Screen ────────────────────────────────────────────── */
function TokenScreen({ token, total, onBack }) {
  return (
    <ClickSpark sparkColor={GMID} sparkSize={12} sparkRadius={22} sparkCount={10} duration={500}>
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #071a0f 0%, #0f2d1a 50%, #071a0f 100%)',
        padding: 24, textAlign: 'center', fontFamily: "'Segoe UI', system-ui, sans-serif",
        position: 'relative', overflow: 'hidden',
      }}>
        {/* bg glow */}
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #16a34a18 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div key={i}
            animate={{ y: [0, -30, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.5 + i * 0.4, delay: i * 0.3 }}
            style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: GMID, left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 15}%` }} />
        ))}

        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          style={{ fontSize: 72, marginBottom: 8 }}>🎉</motion.div>

        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontSize: 36, fontWeight: 900, marginBottom: 6,
            background: `linear-gradient(135deg, #fff 0%, ${GMID} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Order Confirmed!
        </motion.h2>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ color: GMID, fontSize: 15, marginBottom: 36, opacity: 0.8 }}>
          Scan the QR code below to complete your payment
        </motion.p>

        {/* QR code placeholder */}
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 180 }}
          style={{
            background: '#fff',
            borderRadius: 24,
            padding: 28,
            boxShadow: `0 0 60px ${G}30, 0 20px 60px rgba(0,0,0,0.4)`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          }}>

          {/* QR frame */}
          <div style={{
            width: 200, height: 200,
            borderRadius: 16,
            background: '#f9fafb',
            border: `3px solid ${G}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
            gap: 8,
          }}>
            {/* corner markers */}
            {[['0%','0%','right','bottom'],['100%','0%','left','bottom'],['0%','100%','right','top'],['100%','100%','left','top']].map(([l, t, br, bb], i) => (
              <div key={i} style={{
                position: 'absolute', left: l, top: t,
                width: 28, height: 28,
                borderTop: i < 2 ? `4px solid ${G}` : 'none',
                borderBottom: i >= 2 ? `4px solid ${G}` : 'none',
                borderLeft: i % 2 === 0 ? `4px solid ${G}` : 'none',
                borderRight: i % 2 === 1 ? `4px solid ${G}` : 'none',
                borderRadius: i === 0 ? '8px 0 0 0' : i === 1 ? '0 8px 0 0' : i === 2 ? '0 0 0 8px' : '0 0 8px 0',
              }} />
            ))}

            {/* scan line animation */}
            <motion.div
              animate={{ y: [-80, 80, -80] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              style={{
                position: 'absolute', left: 8, right: 8, height: 2,
                background: `linear-gradient(90deg, transparent, ${G}, transparent)`,
                boxShadow: `0 0 8px ${G}`,
              }} />

            {/* placeholder grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, padding: 16, opacity: 0.15 }}>
              {Array.from({ length: 49 }, (_, i) => (
                <div key={i} style={{ width: 16, height: 16, borderRadius: 2, background: Math.random() > 0.5 ? GDARK : 'transparent' }} />
              ))}
            </div>

            <div style={{ position: 'absolute', bottom: 10, fontSize: 10, fontWeight: 700, color: GMUTE, letterSpacing: 2 }}>SCAN TO PAY</div>
          </div>

          {/* order summary */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: GMUTE, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Your token</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: GDARK }}>{token}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: GDARK, marginTop: 8 }}>₹{total}</div>
            <div style={{ fontSize: 11, color: GMUTE, marginTop: 4 }}>SECE Canteen · Powered by Bill4Food</div>
          </div>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ color: GMID, fontSize: 12, marginTop: 20, opacity: 0.5, maxWidth: 280 }}>
          QR payment integration coming soon. Your order is confirmed.
        </motion.p>

        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={onBack}
          style={{
            marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 32px', borderRadius: 50, border: `1px solid ${GMID}40`,
            background: 'rgba(22,163,74,0.15)', color: GMID,
            fontWeight: 800, fontSize: 15, cursor: 'pointer',
          }}>
          <ArrowLeft size={16} /> Order Again
        </motion.button>
      </div>
    </ClickSpark>
  )
}

/* ── Cart Drawer ─────────────────────────────────────────────── */
function CartDrawer({ cart, menu, onUpdate, onClose, onCheckout }) {
  const items = Object.entries(cart).filter(([, qty]) => qty > 0)
  const total = items.reduce((s, [id, qty]) => {
    const row = menu.find((m) => String(m.id) === String(id))
    return s + (row ? row.price * qty : 0)
  }, 0)

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 360, zIndex: 200,
        background: '#0d1f14', borderLeft: `1px solid ${GMID}20`,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: `-8px 0 60px rgba(0,0,0,0.6)`,
      }}>

      {/* header */}
      <div style={{ padding: '20px', borderBottom: `1px solid ${GMID}15`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShoppingCart size={20} color={GMID} />
          <span style={{ fontWeight: 900, fontSize: 18, color: '#fff' }}>Your Cart</span>
          {items.length > 0 && <span style={{ fontSize: 12, color: GMID, background: `${G}30`, padding: '2px 8px', borderRadius: 99 }}>{items.length} items</span>}
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={15} />
        </button>
      </div>

      {items.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <ShoppingCart size={48} color={`${GMID}30`} />
          <p style={{ fontSize: 15, color: GMID, fontWeight: 600, opacity: 0.5 }}>Cart is empty</p>
          <p style={{ fontSize: 13, color: '#ffffff30' }}>Add something delicious</p>
        </div>
      ) : (
        <>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map(([id, qty]) => {
              const item = menu.find((m) => String(m.id) === String(id))
              if (!item) return null
              return (
                <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: `1px solid ${GMID}15` }}>
                  <img src={item.img} alt={item.name} style={{ width: 50, height: 50, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: GMID, fontWeight: 700, marginTop: 2 }}>₹{item.price} × {qty} = ₹{item.price * qty}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button onClick={() => onUpdate(id, -1)} style={{ width: 26, height: 26, borderRadius: '50%', border: `1px solid ${GMID}30`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Minus size={11} color={GMID} />
                    </button>
                    <span style={{ fontWeight: 800, fontSize: 14, color: '#fff', minWidth: 18, textAlign: 'center' }}>{qty}</span>
                    <button onClick={() => onUpdate(id, 1)} style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: G, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus size={11} color="#fff" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ padding: '16px', borderTop: `1px solid ${GMID}15` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontWeight: 700, color: '#ffffff80', fontSize: 14 }}>Total</span>
              <span style={{ fontWeight: 900, fontSize: 24, color: '#fff' }}>₹{total}</span>
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
              onClick={onCheckout}
              style={{
                width: '100%', padding: '14px', borderRadius: 14, border: 'none',
                background: `linear-gradient(135deg, ${G}, #15803d)`,
                color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer',
                boxShadow: `0 8px 32px ${G}50`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
              <Sparkles size={17} /> Pay ₹{total} & Get Token
            </motion.button>
          </div>
        </>
      )}
    </motion.div>
  )
}

/* ── Menu Card ───────────────────────────────────────────────── */
function MenuCard({ item, qty, onUpdate }) {
  return (
    <motion.div variants={fadeUp}
      whileHover={{ y: -8, rotateX: 3, rotateY: -3, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        borderRadius: 24,
        border: `1px solid ${qty > 0 ? GMID + '60' : GMID + '18'}`,
        overflow: 'hidden',
        boxShadow: qty > 0 ? `0 0 30px ${G}25, 0 8px 32px rgba(0,0,0,0.4)` : '0 4px 24px rgba(0,0,0,0.3)',
        transformStyle: 'preserve-3d',
        transition: 'border 0.3s, box-shadow 0.3s',
        cursor: 'default',
      }}>

      {/* image */}
      <div style={{ position: 'relative', height: 170, overflow: 'hidden' }}>
        <motion.img src={item.img} alt={item.name}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)' }} />

        {item.tag && (
          <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            style={{
              position: 'absolute', top: 12, left: 12,
              fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 50,
              background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
              color: item.tagColor || GMID, border: `1px solid ${(item.tagColor || GMID)}40`,
              letterSpacing: 0.5,
            }}>{item.tag}</motion.span>
        )}

        {/* 3D price badge */}
        <div style={{
          position: 'absolute', bottom: 12, right: 12,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
          border: `1px solid ${GMID}40`, borderRadius: 50,
          padding: '5px 14px',
          boxShadow: `0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)`,
        }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>₹{item.price}</span>
        </div>
      </div>

      {/* body */}
      <div style={{ padding: '16px 18px 18px' }}>
        <h3 style={{
          fontWeight: 900, fontSize: 17, margin: '0 0 4px',
          background: `linear-gradient(135deg, #fff 0%, ${GMID} 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>{item.name}</h3>
        <p style={{ fontSize: 12, color: '#ffffff50', margin: '0 0 16px', lineHeight: 1.5 }}>{item.desc || 'Fresh from the canteen'}</p>

        {qty === 0 ? (
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }}
            onClick={() => onUpdate(item.id, 1)}
            style={{
              width: '100%', padding: '11px', borderRadius: 50, border: `1px solid ${GMID}30`,
              background: `linear-gradient(135deg, ${G}20, ${G}10)`,
              color: GMID, fontWeight: 800, fontSize: 14,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              boxShadow: `0 4px 16px ${G}20`,
            }}>
            <Plus size={15} /> Add to Cart
          </motion.button>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: `${G}15`, borderRadius: 50, padding: '6px 8px',
            border: `1px solid ${GMID}30`,
          }}>
            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
              onClick={() => onUpdate(item.id, -1)}
              style={{ width: 34, height: 34, borderRadius: '50%', border: `1px solid ${GMID}30`, background: 'rgba(255,255,255,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Minus size={14} color={GMID} />
            </motion.button>
            <span style={{ fontWeight: 900, fontSize: 17, color: '#fff' }}>{qty}</span>
            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
              onClick={() => onUpdate(item.id, 1)}
              style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: G, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 12px ${G}60` }}>
              <Plus size={14} color="#fff" />
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ── Root ────────────────────────────────────────────────────── */
export default function User() {
  const [cart, setCart] = useState({})
  const [cartOpen, setCartOpen] = useState(false)
  const [orderToken, setOrderToken] = useState(null)
  const [orderTotal, setOrderTotal] = useState(0)
  const [shop, setShop] = useState({ slot: null, items: [], message: '' })
  const [shopLoading, setShopLoading] = useState(true)
  const [shopError, setShopError] = useState(null)

  const loadShop = async (slot) => {
    setShopLoading(true)
    setShopError(null)
    try {
      let r = await api.getShopMenu(slot ?? 'auto')
      if ((!r.slot || !r.items?.length) && slot == null) {
        r = await api.getShopMenu('lunch')
      }
      setShop(r)
    } catch (e) {
      setShopError(e.message || 'Could not load menu')
      setShop({ slot: null, items: [], message: '' })
    } finally {
      setShopLoading(false)
    }
  }

  useEffect(() => {
    loadShop(null)
  }, [])

  const menu = shop.items || []

  const update = (id, delta) => {
    const key = String(id)
    setCart((prev) => ({ ...prev, [key]: Math.max(0, (prev[key] || 0) + delta) }))
  }

  const totalItems = Object.values(cart).reduce((s, q) => s + q, 0)

  const checkout = async () => {
    const slot = shop.slot || 'lunch'
    const lines = Object.entries(cart)
      .filter(([, q]) => q > 0)
      .map(([id, qty]) => ({ itemId: id, qty }))
    if (lines.length === 0) return
    try {
      const order = await api.createOrder({ slot, items: lines })
      setOrderToken(order.token)
      setOrderTotal(order.total)
      setCartOpen(false)
      setCart({})
    } catch (e) {
      window.alert(e.message || 'Order failed')
    }
  }

  if (orderToken) {
    return (
      <TokenScreen
        token={orderToken}
        total={orderTotal}
        onBack={() => {
          setOrderToken(null)
          setOrderTotal(0)
        }}
      />
    )
  }

  return (
    <ClickSpark sparkColor={GMID} sparkSize={10} sparkRadius={20} sparkCount={8} duration={500}>
      <div style={{ minHeight: '100vh', background: '#071a0f', fontFamily: "'Segoe UI', system-ui, sans-serif", color: '#fff', overflowX: 'hidden' }}>

        {/* ── bg mesh ── */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '10%', left: '20%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #16a34a0a 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, #16a34a08 0%, transparent 70%)', filter: 'blur(40px)' }} />
        </div>

        {/* ── Header ── */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'rgba(7,26,15,0.85)', backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${GMID}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${G}20`, border: `1px solid ${GMID}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color={GMID} />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 20, lineHeight: 1,
                background: `linear-gradient(135deg, #fff 0%, ${GMID} 100%)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Bill4Food
              </div>
              <div style={{ fontSize: 10, color: GMID, fontWeight: 600, opacity: 0.6, letterSpacing: 1 }}>SECE CANTEEN</div>
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
            onClick={() => setCartOpen(true)}
            style={{
              position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 22px', borderRadius: 50, border: `1px solid ${GMID}30`,
              background: `${G}20`, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer',
              boxShadow: `0 4px 20px ${G}20`,
            }}>
            <ShoppingCart size={17} /> Cart
            {totalItems > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
                style={{
                  position: 'absolute', top: -7, right: -7,
                  width: 22, height: 22, borderRadius: '50%',
                  background: '#ef4444', color: '#fff',
                  fontSize: 11, fontWeight: 900,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid #071a0f',
                }}>{totalItems}</motion.span>
            )}
          </motion.button>
        </header>

        {/* ── Hero ── */}
        <div style={{ padding: '52px 28px 40px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 5, color: GMID, textTransform: 'uppercase', marginBottom: 14, opacity: 0.7 }}>
              Bill4Food - SECE CANTEEN
            </div>

            {/* welcome text */}
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              style={{ marginBottom: 10 }}>
              <span style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', fontWeight: 800,
                background: `linear-gradient(90deg, ${GMID}, #fff, ${GMID})`,
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                animation: 'shimmer 3s linear infinite',
                letterSpacing: 1,
              }}>
              </span>
            </motion.div>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900,
              lineHeight: 1.1, letterSpacing: '-1px', margin: '0 0 16px',
              background: `linear-gradient(135deg, #ffffff 0%, ${GMID} 50%, ${G} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Welcome Sri Eshwarites
            </h1>
            <p style={{ fontSize: 15, color: GMID, opacity: 0.6, letterSpacing: 2 }}>
              Fresh · Hot · Ready in minutes
            </p>
            {shop.slot && (
              <p style={{ fontSize: 13, color: GMID, marginTop: 10, fontWeight: 700 }}>
                Now serving: {slotLabel(shop.slot)}
              </p>
            )}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 14, flexWrap: 'wrap' }}>
              {MEAL_SLOTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => loadShop(s.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 50,
                    border: `1px solid ${GMID}40`,
                    background: shop.slot === s.id ? `${G}35` : 'transparent',
                    color: GMID,
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* floating pills */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
            {['Zero Queue', 'Instant Token', 'Pay & Go'].map((t, i) => (
              <motion.span key={t} whileHover={{ scale: 1.05 }}
                animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.4 }}
                style={{
                  fontSize: 12, fontWeight: 700, padding: '6px 16px', borderRadius: 50,
                  background: 'rgba(22,163,74,0.1)', border: `1px solid ${GMID}25`,
                  color: GMID,
                }}>{t}</motion.span>
            ))}
          </motion.div>
        </div>

        {/* ── Menu Grid ── */}
        <main style={{ maxWidth: 1060, margin: '0 auto', padding: '0 24px 60px', position: 'relative', zIndex: 1 }}>
          {shopLoading && (
            <p style={{ textAlign: 'center', color: GMID }}>Loading menu…</p>
          )}
          {shopError && (
            <p style={{ textAlign: 'center', color: '#f87171' }}>{shopError}</p>
          )}
          {!shopLoading && !shopError && !menu.length && (
            <p style={{ textAlign: 'center', color: GMID }}>{shop.message || 'No items available for this slot. Pick another meal time above.'}</p>
          )}
          <motion.div variants={stagger} initial="hidden" animate="show"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24, perspective: 1000 }}>
            {menu.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                qty={cart[String(item.id)] || 0}
                onUpdate={update}
              />
            ))}
          </motion.div>
        </main>

        {/* ── Cart Drawer ── */}
        <AnimatePresence>
          {cartOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setCartOpen(false)}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150, backdropFilter: 'blur(4px)' }} />
              <CartDrawer cart={cart} menu={menu} onUpdate={update} onClose={() => setCartOpen(false)} onCheckout={checkout} />
            </>
          )}
        </AnimatePresence>
      </div>
    </ClickSpark>
  )
}
