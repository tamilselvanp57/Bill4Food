import mongoose from 'mongoose'

const menuItemSchema = new mongoose.Schema(
  {
    slot: { type: String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    qty: { type: Number, required: true, min: 0, default: 0 },
    active: { type: Boolean, default: true },
    img: { type: String, default: '' },
    tag: { type: String, default: null },
    tagColor: { type: String, default: '' },
    desc: { type: String, default: '' },
  },
  { timestamps: true }
)

const orderLineSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  name: String,
  qty: Number,
  unitPrice: Number,
  lineTotal: Number,
})

const orderSchema = new mongoose.Schema(
  {
    token: { type: String, unique: true, required: true },
    slot: { type: String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
    items: { type: String, required: true },
    lines: [orderLineSchema],
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['Pending', 'Served'], default: 'Pending' },
  },
  { timestamps: true }
)

const counterSchema = new mongoose.Schema({
  _id: { type: String, default: 'global' },
  seq: { type: Number, default: 0 },
})

const settingsSchema = new mongoose.Schema({
  _id: { type: String, default: 'global' },
  workingDays: { type: [String], default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
  slotOpen: {
    breakfast: { type: Boolean, default: true },
    lunch: { type: Boolean, default: true },
    dinner: { type: Boolean, default: true },
  },
})

export const MenuItem = mongoose.model('MenuItem', menuItemSchema)
export const Order = mongoose.model('Order', orderSchema)
export const Counter = mongoose.model('Counter', counterSchema)
export const Settings = mongoose.model('Settings', settingsSchema)

export async function connectDB(uri) {
  mongoose.set('strictQuery', true)
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
    family: 4,
  })
}
