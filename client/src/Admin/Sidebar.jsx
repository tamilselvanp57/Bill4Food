import { motion } from 'framer-motion'
import { LayoutDashboard, UtensilsCrossed, ClipboardList, LogOut, ChefHat, Wifi, WifiOff } from 'lucide-react'
import { G, GDARK, GMID, GMUTE, formatDate, formatTime, getNow } from './adminData'
import { useState, useEffect } from 'react'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'menu',      label: 'Menu',       icon: UtensilsCrossed },
  { id: 'orders',    label: 'Orders',     icon: ClipboardList   },
]

export default function Sidebar({ active, setActive, onLogout, isWorkingDay }) {
  const [time, setTime] = useState(formatTime(getNow()))

  useEffect(() => {
    const t = setInterval(() => setTime(formatTime(getNow())), 30000)
    return () => clearInterval(t)
  }, [])

  const now = getNow()

  return (
    <aside style={{
      width: 230, flexShrink: 0,
      background: `linear-gradient(180deg, ${GDARK} 0%, #0f3320 100%)`,
      display: 'flex', flexDirection: 'column',
      padding: '24px 14px', minHeight: '100vh',
      boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
    }}>
      {/* logo */}
      <div style={{ textAlign: 'center', marginBottom: 24, padding: '14px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <ChefHat size={34} color={GMID} />
        </div>
        <div style={{ fontWeight: 900, fontSize: 20, color: '#fff' }}>
          Bill<span style={{ color: GMID }}>4</span>Food
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: GMID, letterSpacing: 2, marginTop: 2 }}>
          ADMIN PORTAL
        </div>
      </div>

      {/* live clock */}
      <div style={{ textAlign: 'center', marginBottom: 20, padding: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: 12 }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: 1 }}>{time}</div>
        <div style={{ fontSize: 11, color: GMID, marginTop: 2 }}>
          {now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
        </div>
      </div>

      {/* nav */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {NAV.map(({ id, label, icon: Icon }) => (
          <motion.button key={id} onClick={() => setActive(id)}
            whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 14px', borderRadius: 14, border: 'none',
              cursor: 'pointer', fontSize: 14, fontWeight: 700, textAlign: 'left',
              background: active === id ? G : 'rgba(255,255,255,0.06)',
              color: active === id ? '#fff' : GMID,
              transition: 'background 0.2s',
              boxShadow: active === id ? '0 4px 14px #16a34a40' : 'none',
            }}>
            <Icon size={17} /> {label}
          </motion.button>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* canteen status */}
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: '12px 14px', marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: GMID, fontWeight: 700, marginBottom: 6 }}>CANTEEN STATUS</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isWorkingDay
            ? <Wifi size={13} color="#4ade80" />
            : <WifiOff size={13} color="#f87171" />}
          <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>
            {isWorkingDay ? 'Open · Serving Now' : 'Closed Today'}
          </span>
        </div>
      </div>

      <motion.button onClick={onLogout} whileHover={{ x: 4 }}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '11px 14px', borderRadius: 14, border: 'none',
          cursor: 'pointer', fontSize: 14, fontWeight: 700,
          background: 'rgba(239,68,68,0.12)', color: '#fca5a5',
        }}>
        <LogOut size={16} /> Logout
      </motion.button>
    </aside>
  )
}
