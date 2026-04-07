import { MenuItem, Settings } from './db.js'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80'

export async function seedIfEmpty() {
  const n = await MenuItem.countDocuments()
  if (n > 0) return

  await MenuItem.insertMany([
    { slot: 'breakfast', name: 'Full Meals', price: 60, qty: 60, active: true, img: PLACEHOLDER },
    { slot: 'breakfast', name: 'Chapati', price: 25, qty: 50, active: true, img: PLACEHOLDER },
    { slot: 'lunch', name: 'Chicken Biryani', price: 90, qty: 30, active: true, img: PLACEHOLDER },
    { slot: 'lunch', name: 'Full Meals', price: 60, qty: 50, active: true, img: PLACEHOLDER },
    { slot: 'dinner', name: 'Parotta', price: 40, qty: 60, active: true, img: PLACEHOLDER },
  ])

  await Settings.findOneAndUpdate(
    { _id: 'global' },
    {
      $setOnInsert: {
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        slotOpen: { breakfast: true, lunch: true, dinner: true },
      },
    },
    { upsert: true }
  )
}
