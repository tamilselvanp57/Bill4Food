import { Router } from 'express'
import mongoose from 'mongoose'
import { Order, MenuItem, Counter, Settings } from '../db.js'
import { isWorkingDayNow } from '../utils/slots.js'

const router = Router()

function formatOrderTime(d) {
  return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

function toClientOrder(doc) {
  const o = doc.toObject ? doc.toObject() : doc
  return {
    token: o.token,
    slot: o.slot,
    items: o.items,
    total: o.total,
    status: o.status,
    time: formatOrderTime(o.createdAt),
    createdAt: o.createdAt,
  }
}

router.get('/', async (req, res, next) => {
  try {
    const { slot, status } = req.query
    const filter = {}
    if (slot && slot !== 'all') filter.slot = slot
    if (status) filter.status = status
    const list = await Order.find(filter).sort({ createdAt: -1 })
    res.json(list.map((d) => toClientOrder(d)))
  } catch (e) {
    next(e)
  }
})

router.post('/', async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { slot, items: lines } = req.body
    if (!slot || !['breakfast', 'lunch', 'dinner'].includes(slot)) {
      await session.abortTransaction()
      return res.status(400).json({ error: 'Invalid or missing slot' })
    }
    if (!Array.isArray(lines) || lines.length === 0) {
      await session.abortTransaction()
      return res.status(400).json({ error: 'items array is required' })
    }

    const settings = await Settings.findOneAndUpdate(
      { _id: 'global' },
      {
        $setOnInsert: {
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          slotOpen: { breakfast: true, lunch: true, dinner: true },
        },
      },
      { upsert: true, new: true, session }
    )
    if (!isWorkingDayNow(settings.workingDays)) {
      await session.abortTransaction()
      return res.status(403).json({ error: 'Canteen is closed today' })
    }
    if (!settings.slotOpen?.[slot]) {
      await session.abortTransaction()
      return res.status(403).json({ error: `Meal slot "${slot}" is not accepting orders` })
    }

    const orderLines = []
    let itemsSummary = []
    let total = 0

    for (const line of lines) {
      const { itemId, qty } = line
      if (!itemId || !mongoose.isValidObjectId(itemId) || !qty || qty < 1) {
        await session.abortTransaction()
        return res.status(400).json({ error: 'Each item needs valid itemId and positive qty' })
      }
      const menuDoc = await MenuItem.findById(itemId).session(session)
      if (!menuDoc || menuDoc.slot !== slot) {
        await session.abortTransaction()
        return res.status(400).json({ error: `Invalid menu item for this slot: ${itemId}` })
      }
      if (!menuDoc.active) {
        await session.abortTransaction()
        return res.status(400).json({ error: `${menuDoc.name} is not available` })
      }
      if (menuDoc.qty < qty) {
        await session.abortTransaction()
        return res.status(400).json({ error: `Not enough stock for ${menuDoc.name}` })
      }
      const lineTotal = menuDoc.price * qty
      total += lineTotal
      orderLines.push({
        itemId: menuDoc._id,
        name: menuDoc.name,
        qty,
        unitPrice: menuDoc.price,
        lineTotal,
      })
      itemsSummary.push(`${menuDoc.name} x${qty}`)
    }

    const counter = await Counter.findOneAndUpdate({ _id: 'global' }, { $inc: { seq: 1 } }, { new: true, upsert: true, session })
    const token = `T${String(counter.seq).padStart(3, '0')}`

    const orderDoc = await Order.create(
      [
        {
          token,
          slot,
          items: itemsSummary.join(', '),
          lines: orderLines,
          total,
          status: 'Pending',
        },
      ],
      { session }
    )

    for (const ol of orderLines) {
      await MenuItem.updateOne({ _id: ol.itemId }, { $inc: { qty: -ol.qty } }).session(session)
    }

    await session.commitTransaction()
    res.status(201).json(toClientOrder(orderDoc[0]))
  } catch (e) {
    await session.abortTransaction()
    next(e)
  } finally {
    session.endSession()
  }
})

router.patch('/:token', async (req, res, next) => {
  try {
    const { token } = req.params
    const { status } = req.body
    if (status !== 'Served') {
      return res.status(400).json({ error: 'Only status "Served" is supported' })
    }
    const doc = await Order.findOneAndUpdate({ token }, { status: 'Served' }, { new: true })
    if (!doc) return res.status(404).json({ error: 'Order not found' })
    res.json(toClientOrder(doc))
  } catch (e) {
    next(e)
  }
})

export default router
