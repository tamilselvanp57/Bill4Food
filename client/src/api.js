const base = import.meta.env.VITE_API_URL ?? ''

async function req(path, opts = {}) {
  const url = path.startsWith('http') ? path : `${base}${path}`
  const headers = { ...opts.headers }
  if (opts.body && typeof opts.body === 'string' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }
  const r = await fetch(url, { ...opts, headers })
  if (r.status === 204) return null
  const text = await r.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { raw: text }
  }
  if (!r.ok) {
    const msg = typeof data === 'object' && data && data.error ? data.error : text || r.statusText
    throw new Error(msg)
  }
  return data
}

export const api = {
  getMenu: () => req('/api/menu'),
  getShopMenu: (slot = 'auto') => {
    const s = slot == null ? 'auto' : slot
    return req(`/api/menu/shop?slot=${encodeURIComponent(s)}`)
  },
  createMenuItem: (body) => req('/api/menu', { method: 'POST', body: JSON.stringify(body) }),
  updateMenuItem: (id, body) => req(`/api/menu/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteMenuItem: (id) => req(`/api/menu/${id}`, { method: 'DELETE' }),
  getSettings: () => req('/api/settings'),
  patchSettings: (body) => req('/api/settings', { method: 'PATCH', body: JSON.stringify(body) }),
  getOrders: () => req('/api/orders'),
  patchOrder: (token, body) => req(`/api/orders/${encodeURIComponent(token)}`, { method: 'PATCH', body: JSON.stringify(body) }),
  createOrder: (body) => req('/api/orders', { method: 'POST', body: JSON.stringify(body) }),
}
