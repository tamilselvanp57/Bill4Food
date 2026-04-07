/* ── Theme ───────────────────────────────────────────────────── */
export const G      = '#16a34a'
export const GDARK  = '#14532d'
export const GLIGHT = '#dcfce7'
export const GMID   = '#86efac'
export const GMUTE  = '#4b7c5e'

/* ── Framer variants ─────────────────────────────────────────── */
export const fadeUp  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }
export const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

/* ── Meal slots ──────────────────────────────────────────────── */
export const MEAL_SLOTS = [
  { id: 'breakfast', label: 'Breakfast', start: '07:00', end: '10:00', color: GDARK, bg: GLIGHT, border: GMID },
  { id: 'lunch',     label: 'Lunch',     start: '11:00', end: '14:30', color: GDARK, bg: GLIGHT, border: GMID },
  { id: 'dinner',    label: 'Dinner',    start: '17:00', end: '20:00', color: GDARK, bg: GLIGHT, border: GMID },
]

/* ── Working days ────────────────────────────────────────────── */
export const ALL_DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

/* ── Default menu per slot ───────────────────────────────────── */
export const DEFAULT_MENU = {
  breakfast: [
    { id: 'b1', name: 'Idli (3)',        price: 20, qty: 60, active: true,  img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&q=80' },
    { id: 'b2', name: 'Dosa + Chutney', price: 25, qty: 50, active: true,  img: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=200&q=80' },
    { id: 'b3', name: 'Pongal',         price: 20, qty: 40, active: false, img: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=200&q=80' },
    { id: 'b4', name: 'Upma',           price: 15, qty: 30, active: true,  img: 'https://images.unsplash.com/photo-1645177628172-a94c1f96diag?w=200&q=80' },
  ],
  lunch: [
    { id: 'l1', name: 'Veg Meals',       price: 60, qty: 50, active: true,  img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80' },
    { id: 'l2', name: 'Chicken Biryani', price: 90, qty: 30, active: true,  img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&q=80' },
    { id: 'l3', name: 'Chapati (2)',     price: 25, qty: 80, active: true,  img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&q=80' },
    { id: 'l4', name: 'Egg Rice',        price: 50, qty: 20, active: true,  img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200&q=80' },
  ],
  dinner: [
    { id: 'd1', name: 'Parotta + Salna', price: 40, qty: 60, active: true,  img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&q=80' },
    { id: 'd2', name: 'Fried Rice',      price: 55, qty: 40, active: true,  img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200&q=80' },
    { id: 'd3', name: 'Chapati + Curry', price: 35, qty: 50, active: true,  img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&q=80' },
  ],
}

/* ── Sample orders ───────────────────────────────────────────── */
export const SAMPLE_ORDERS = [
  { token: 'T001', slot: 'breakfast', items: 'Idli x2',              total: 40,  status: 'Served',  time: '08:10 AM' },
  { token: 'T002', slot: 'lunch',     items: 'Veg Meals x1',         total: 60,  status: 'Pending', time: '12:07 PM' },
  { token: 'T003', slot: 'lunch',     items: 'Chicken Biryani x1',   total: 90,  status: 'Pending', time: '12:09 PM' },
  { token: 'T004', slot: 'dinner',    items: 'Parotta + Salna x1',   total: 40,  status: 'Served',  time: '06:30 PM' },
  { token: 'T005', slot: 'lunch',     items: 'Chapati x2, Egg Rice', total: 100, status: 'Pending', time: '12:14 PM' },
]

/* ── Helpers ─────────────────────────────────────────────────── */
export function getNow() {
  return new Date()
}

export function formatDate(d) {
  return d.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatTime(d) {
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

/* Returns true if current time is within slot window */
export function isSlotActive(slot) {
  const now   = new Date()
  const [sh, sm] = slot.start.split(':').map(Number)
  const [eh, em] = slot.end.split(':').map(Number)
  const start = new Date(); start.setHours(sh, sm, 0)
  const end   = new Date(); end.setHours(eh, em, 0)
  return now >= start && now <= end
}
