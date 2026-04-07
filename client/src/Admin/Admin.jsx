import { useState } from 'react'
import Sidebar        from './Sidebar'
import DashboardTab   from './DashboardTab'
import MenuTab        from './MenuTab'
import OrdersTab      from './OrdersTab'
import WorkingDayPanel from './WorkingDayPanel'
import { DEFAULT_MENU, SAMPLE_ORDERS, MEAL_SLOTS, getNow, ALL_DAYS } from './adminData'

/* default slot status — open if current time is within window, else closed */
function defaultSlotStatus() {
  const status = {}
  MEAL_SLOTS.forEach(s => { status[s.id] = true })
  return status
}

/* default working days — Mon–Fri */
const DEFAULT_WORKING = ['Monday','Tuesday','Wednesday','Thursday','Friday']

export default function Admin() {
  const [tab,         setTab]         = useState('dashboard')
  const [menu,        setMenu]        = useState(DEFAULT_MENU)
  const [slotStatus,  setSlotStatus]  = useState(defaultSlotStatus)
  const [orders,      setOrders]      = useState(SAMPLE_ORDERS)
  const [workingDays, setWorkingDays] = useState(DEFAULT_WORKING)

  const today      = getNow().toLocaleDateString('en-IN', { weekday: 'long' })
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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0fdf4', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <Sidebar
        active={tab}
        setActive={setTab}
        onLogout={() => window.location.href = '/'}
        isWorkingDay={isWorkingDay}
      />
      <main style={{ flex: 1, padding: '36px', overflowY: 'auto', maxHeight: '100vh' }}>
        {renderTab()}
      </main>
    </div>
  )
}
