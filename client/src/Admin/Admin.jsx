import { useState } from 'react'
import { motion } from 'framer-motion'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import Sidebar         from './Sidebar'
import DashboardTab    from './DashboardTab'
import MenuTab         from './MenuTab'
import OrdersTab       from './OrdersTab'
import WorkingDayPanel from './WorkingDayPanel'
import { DEFAULT_MENU, SAMPLE_ORDERS, MEAL_SLOTS, getNow, G, GDARK, GMID } from './adminData'

function defaultSlotStatus() {
  const status = {}
  MEAL_SLOTS.forEach(s => { status[s.id] = true })
  return status
}

const DEFAULT_WORKING = ['Monday','Tuesday','Wednesday','Thursday','Friday']

export default function Admin() {
  const [tab,          setTab]          = useState('dashboard')
  const [menu,         setMenu]         = useState(DEFAULT_MENU)
  const [slotStatus,   setSlotStatus]   = useState(defaultSlotStatus)
  const [orders,       setOrders]       = useState(SAMPLE_ORDERS)
  const [workingDays,  setWorkingDays]  = useState(DEFAULT_WORKING)
  const [sidebarOpen,  setSidebarOpen]  = useState(true)

  const today        = getNow().toLocaleDateString('en-IN', { weekday: 'long' })
  const isWorkingDay = workingDays.includes(today)

  const renderTab = () => {
    switch (tab) {
      case 'dashboard': return <DashboardTab orders={orders} menu={menu} />
      case 'menu':      return (
        <>
          <WorkingDayPanel workingDays={workingDays} setWorkingDays={setWorkingDays} />
          <MenuTab menu={menu} setMenu={setMenu} slotStatus={slotStatus} setSlotStatus={setSlotStatus} />
        </>
      )
      case 'orders':    return <OrdersTab orders={orders} setOrders={setOrders} />
      default:          return null
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0fdf4', fontFamily: "'Segoe UI', system-ui, sans-serif", overflowX: 'hidden' }}>

      {/* sidebar */}
      <Sidebar
        active={tab}
        setActive={setTab}
        onLogout={() => window.location.href = '/'}
        isWorkingDay={isWorkingDay}
        open={sidebarOpen}
      />

      {/* main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* top bar with toggle */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 28px',
          background: '#fff',
          borderBottom: `1px solid ${GMID}`,
          position: 'sticky', top: 0, zIndex: 30,
        }}>
          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
            onClick={() => setSidebarOpen(p => !p)}
            style={{
              width: 38, height: 38, borderRadius: 10, border: `1.5px solid ${GMID}`,
              background: sidebarOpen ? GDARK : '#fff',
              color: sidebarOpen ? '#fff' : GDARK,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
              transition: 'background 0.2s, color 0.2s',
            }}>
            {sidebarOpen
              ? <PanelLeftClose size={18} />
              : <PanelLeftOpen  size={18} />}
          </motion.button>

          <span style={{ fontWeight: 800, fontSize: 16, color: GDARK, textTransform: 'capitalize' }}>
            {tab}
          </span>
        </div>

        <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>
          {renderTab()}
        </main>
      </div>
    </div>
  )
}
