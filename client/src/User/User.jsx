import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Plus, Minus, CheckCircle2, X, ArrowLeft, Sparkles } from 'lucide-react'

const G      = '#16a34a'
const GDARK  = '#14532d'
const GLIGHT = '#dcfce7'
const GMID   = '#86efac'
const GMUTE  = '#4b7c5e'
const YELLOW = '#fef08a'
const ORANGE = '#fed7aa'

const fadeUp  = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

const MENU = [
  {
    id: 1, name: 'Veg Meals', price: 60, tag: '⭐ Best Seller',
    tagColor: '#fbbf24', tagBg: '#fef9c3',
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
    desc: 'Rice, sambar, rasam, 3 curries & papad',
  },
  {
    id: 2, name: 'Chicken Biryani', price: 90, tag: '🌶️ Spicy',
    tagColor: '#dc2626', tagBg: '#fee2e2',
    img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80',
    desc: 'Fragrant basmati with tender chicken',
  },
  {
    id: 3, name: 'Chapati (2)', price: 25, tag: null,
    tagColor: '', tagBg: '',
    img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80',
    desc: 'Soft wheat chapatis with curry',
  },
  {
    id: 4, name: 'Egg Rice', price: 50, tag: '🍳 Fresh',
    tagColor: '#d97706', tagBg: '#fef3c7',
    img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80',
    desc: 'Wok-tossed egg fried rice',
  },
  {
    id: 5, name: 'Parotta + Salna', price: 40, tag: '🔥 Popular',
    tagColor: '#ea580c', tagBg: '#ffedd5',
    img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80',
    desc: 'Flaky parotta with spicy salna',
  },
  {
    id: 6, name: 'Cold Coffee', price: 30, tag: '❄️ Chilled',
    tagColor: '#0284c7', tagBg: '#e0f2fe',
    img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80',
    desc: 'Creamy blended cold coffee',
  },
]

/* ── Token Screen ────────────────────────────────────────────── */
function TokenScreen({ token, onBack }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
      padding: 24, textAlign: 'center', fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      {/* confetti blobs */}
      {['#fbbf24','#34d399','#60a5fa','#f472b6','#a78bfa'].map((c, i) => (
        <motion.div key={i}
          animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
          transition={{ repeat: Infinity, duration: 2 + i * 0.4, delay: i * 0.2 }}
          style={{
            position: 'absolute', width: 14, height: 14, borderRadius: 4,
            background: c, opacity: 0.7,
            left: `${10 + i * 18}%`, top: `${15 + (i % 3) * 12}%`,
          }} />
      ))}

      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
        <div style={{ fontSize: 80 }}>🎉</div>
      </motion.div>

      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ fontSize: 32, fontWeight: 900, color: GDARK, marginTop: 12, marginBottom: 4 }}>
        Order Placed!
      </motion.h2>
      <p style={{ color: GMUTE, fontSize: 15, marginBottom: 32 }}>
        Show this token at the counter 🍽️
      </p>

      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, type: 'spring' }}
        style={{
          background: '#fff', borderRadius: 28,
          border: `3px dashed ${G}`,
          padding: '32px 56px',
          boxShadow: '0 12px 40px #16a34a25',
          position: 'relative',
        }}>
        {/* ticket notches */}
        <div style={{ position: 'absolute', left: -14, top: '50%', transform: 'translateY(-50%)', width: 28, height: 28, borderRadius: '50%', background: '#f0fdf4', border: `3px dashed ${G}` }} />
        <div style={{ position: 'absolute', right: -14, top: '50%', transform: 'translateY(-50%)', width: 28, height: 28, borderRadius: '50%', background: '#f0fdf4', border: `3px dashed ${G}` }} />
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 4, color: GMUTE, textTransform: 'uppercase', marginBottom: 6 }}>
          🎟️ Your Token
        </div>
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ fontSize: 64, fontWeight: 900, color: G, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
          {token}
        </motion.div>
        <div style={{ fontSize: 12, color: GMUTE, marginTop: 8 }}>SECE Canteen</div>
      </motion.div>

      <p style={{ color: GMUTE, fontSize: 13, marginTop: 24, maxWidth: 260 }}>
        🔔 Listen for your token number to be called!
      </p>

      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={onBack}
        style={{
          marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '13px 28px', borderRadius: 50, border: 'none',
          background: G, color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer',
          boxShadow: '0 6px 20px #16a34a40',
        }}>
        <ArrowLeft size={16} /> Order Again
      </motion.button>
    </div>
  )
}

/* ── Cart Drawer ─────────────────────────────────────────────── */
function CartDrawer({ cart, menu, onUpdate, onClose, onCheckout }) {
  const items = Object.entries(cart).filter(([, qty]) => qty > 0)
  const total = items.reduce((sum, [id, qty]) => sum + menu.find(m => m.id === +id).price * qty, 0)

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 360, zIndex: 50,
        background: '#fff', boxShadow: '-8px 0 40px #16a34a18',
        display: 'flex', flexDirection: 'column',
        borderLeft: `3px solid ${GMID}`,
        borderTopLeftRadius: 24, borderBottomLeftRadius: 24,
        overflow: 'hidden',
      }}>

      {/* header */}
      <div style={{ background: `linear-gradient(135deg, ${GDARK}, ${G})`, padding: '20px 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24 }}>🛒</span>
            <h3 style={{ fontWeight: 900, fontSize: 20, color: '#fff', margin: 0 }}>Your Cart</h3>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} />
          </button>
        </div>
        {items.length > 0 && (
          <div style={{ fontSize: 12, color: GMID, marginTop: 4 }}>{items.length} item{items.length > 1 ? 's' : ''} in cart</div>
        )}
      </div>

      {items.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <div style={{ fontSize: 64 }}>🍽️</div>
          <p style={{ fontSize: 15, color: GMUTE, fontWeight: 600 }}>Your cart is empty!</p>
          <p style={{ fontSize: 13, color: '#9ca3af' }}>Add some yummy food 😋</p>
        </div>
      ) : (
        <>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map(([id, qty]) => {
              const item = menu.find(m => m.id === +id)
              return (
                <div key={id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 16,
                  background: GLIGHT, border: `1.5px solid ${GMID}`,
                }}>
                  <img src={item.img} alt={item.name}
                    style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: GDARK }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: G, fontWeight: 700 }}>₹{item.price} × {qty} = ₹{item.price * qty}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button onClick={() => onUpdate(+id, -1)} style={{ width: 26, height: 26, borderRadius: '50%', border: `1.5px solid ${GMID}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Minus size={11} color={G} />
                    </button>
                    <span style={{ fontWeight: 800, fontSize: 14, color: GDARK, minWidth: 18, textAlign: 'center' }}>{qty}</span>
                    <button onClick={() => onUpdate(+id, 1)} style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: G, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus size={11} color="#fff" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ padding: '16px', borderTop: `2px dashed ${GMID}`, marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontWeight: 700, color: GDARK, fontSize: 15 }}>Total 🧾</span>
              <span style={{ fontWeight: 900, fontSize: 22, color: G }}>₹{total}</span>
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
              onClick={onCheckout}
              style={{
                width: '100%', padding: '14px', borderRadius: 16, border: 'none',
                background: `linear-gradient(135deg, ${G}, #15803d)`,
                color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer',
                boxShadow: '0 6px 20px #16a34a35',
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

/* ── Root ────────────────────────────────────────────────────── */
export default function User() {
  const [cart, setCart]         = useState({})
  const [cartOpen, setCartOpen] = useState(false)
  const [token, setToken]       = useState(null)

  const update = (id, delta) =>
    setCart(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }))

  const totalItems = Object.values(cart).reduce((s, q) => s + q, 0)

  const checkout = () => {
    setToken(`T${Math.floor(Math.random() * 900) + 100}`)
    setCartOpen(false)
    setCart({})
  }

  if (token) return <TokenScreen token={token} onBack={() => setToken(null)} />

  return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── Header ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(12px)',
        borderBottom: `2px solid ${GMID}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 32 }}>🍽️</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 20, color: GDARK, lineHeight: 1 }}>
              Bill<span style={{ color: G }}>4</span>Food
            </div>
            <div style={{ fontSize: 11, color: GMUTE, fontWeight: 600 }}>SECE Canteen · Today's Menu 🌟</div>
          </div>
        </div>

        <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
          onClick={() => setCartOpen(true)}
          style={{
            position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 50, border: 'none',
            background: `linear-gradient(135deg, ${G}, #15803d)`,
            color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer',
            boxShadow: '0 4px 16px #16a34a30',
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
                border: '2px solid #fff',
              }}>{totalItems}</motion.span>
          )}
        </motion.button>
      </header>

      {/* ── Hero Banner ── */}
      <div style={{
        background: `linear-gradient(135deg, ${GDARK} 0%, ${G} 100%)`,
        padding: '28px 24px', textAlign: 'center',
      }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: GMID, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>
            🌟 Sri Eshwarites' Favourite
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 900, color: '#fff', margin: 0 }}>
            What's Cooking Today? 🍳
          </h1>
          <p style={{ color: GMID, fontSize: 14, marginTop: 6 }}>
            Fresh · Hot · Ready in minutes
          </p>
        </motion.div>
      </div>

      {/* ── Menu Grid ── */}
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 20px' }}>
        <motion.div variants={stagger} initial="hidden" animate="show"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 22 }}>
          {MENU.map(item => {
            const qty = cart[item.id] || 0
            return (
              <motion.div key={item.id} variants={fadeUp}
                whileHover={{ y: -6, boxShadow: '0 16px 40px #16a34a22' }}
                style={{
                  background: '#fff',
                  borderRadius: 24,
                  border: `2.5px solid ${qty > 0 ? G : GMID}`,
                  boxShadow: qty > 0 ? '0 8px 28px #16a34a22' : '0 2px 12px #16a34a0a',
                  overflow: 'hidden',
                  transition: 'border 0.2s',
                  cursor: 'default',
                }}>

                {/* food image */}
                <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                  <img src={item.img} alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  {/* gradient overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)' }} />
                  {/* tag badge */}
                  {item.tag && (
                    <span style={{
                      position: 'absolute', top: 10, left: 10,
                      fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 50,
                      background: item.tagBg, color: item.tagColor,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}>{item.tag}</span>
                  )}
                  {/* price badge */}
                  <span style={{
                    position: 'absolute', bottom: 10, right: 10,
                    fontSize: 15, fontWeight: 900, padding: '4px 12px', borderRadius: 50,
                    background: '#fff', color: G,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}>₹{item.price}</span>
                </div>

                {/* card body */}
                <div style={{ padding: '14px 16px 16px' }}>
                  <h3 style={{ fontWeight: 800, fontSize: 16, color: GDARK, margin: '0 0 4px' }}>{item.name}</h3>
                  <p style={{ fontSize: 12, color: GMUTE, margin: '0 0 14px', lineHeight: 1.5 }}>{item.desc}</p>

                  {qty === 0 ? (
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                      onClick={() => update(item.id, 1)}
                      style={{
                        width: '100%', padding: '10px', borderRadius: 50, border: 'none',
                        background: GLIGHT, color: G, fontWeight: 800, fontSize: 14,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        transition: 'background 0.2s',
                      }}>
                      <Plus size={15} /> Add to Cart
                    </motion.button>
                  ) : (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: GLIGHT, borderRadius: 50, padding: '6px 8px',
                      border: `1.5px solid ${GMID}`,
                    }}>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => update(item.id, -1)}
                        style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px #0001' }}>
                        <Minus size={14} color={G} />
                      </motion.button>
                      <span style={{ fontWeight: 900, fontSize: 16, color: GDARK }}>{qty}</span>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => update(item.id, 1)}
                        style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: G, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={14} color="#fff" />
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </main>

      {/* ── Cart Drawer ── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 40, backdropFilter: 'blur(2px)' }} />
            <CartDrawer cart={cart} menu={MENU} onUpdate={update} onClose={() => setCartOpen(false)} onCheckout={checkout} />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
