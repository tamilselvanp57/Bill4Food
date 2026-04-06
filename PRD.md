# 📄 PRODUCT REQUIREMENTS DOCUMENT (PRD)
## 🍽️ Bill4Food — Built for Sri Eshwarites
## Sri Eshwar College of Engineering

**Target:** Sri Eshwar College of Engineering

---

## 1️⃣ 📌 PRODUCT OVERVIEW

### 🧠 Summary

Bill4Food is a digital billing system designed to eliminate queues in college canteens by enabling students to place orders and generate bills through multiple parallel digital interfaces (mobile/kiosks), reducing dependency on a single receptionist.

### 🎯 Objective
- Reduce waiting time during peak hours
- Eliminate billing bottlenecks
- Improve operational efficiency without changing kitchen workflow

### 🧩 Problem Statement

In the current system:
- A single receptionist handles all billing
- Students form long queues
- Order-taking becomes the bottleneck

👉 **Result:** Delays, poor user experience, inefficient resource utilization

### 💡 Solution

Bill4Food introduces:
- Self-service ordering system
- Parallel billing points (QR/web/kiosk)
- Token-based order management
- Admin-controlled inventory limits

---

## 2️⃣ 👥 USER ROLES

### 👨‍🎓 Student (Primary User)
- Quickly order food
- Avoid queue
- Get bill/token

### 🧑‍💼 Admin (Canteen Manager)
- Manage daily menu
- Control food availability
- Monitor orders

### 👨‍🍳 Counter Staff
- Verify token
- Serve food efficiently

---

## 3️⃣ ⚙️ CORE FEATURES

### 3.1 🧾 Menu Management (Admin)
- Create daily menu
- Set: Food name, Price, Quantity limit
- Activate/deactivate items

### 3.2 🛒 Ordering System (Student)
- View today's menu
- Add items to cart
- Proceed to payment

### 3.3 💳 Payment System
- Simulated payment (for MVP)
- Mark order as "Paid"

### 3.4 🎟️ Token Generation
- Unique token per order
- FIFO-based

### 3.5 📺 Order Display *(Optional)*
- Show current tokens being served

### 3.6 🍳 Counter Verification
- Enter/scan token
- Mark order as served

### 3.7 📊 Admin Monitoring
- View total orders
- Track item-wise sales
- Stop items anytime

---

## 4️⃣ 📱 USER FLOW

### 🧍 Student Flow
```
Scan QR / Open App
        ↓
View Menu
        ↓
Select Items
        ↓
Proceed to Pay
        ↓
Receive Token
        ↓
Show Token at Counter
        ↓
Get Food
```

### 🧑‍💼 Admin Flow
```
Login
  ↓
Create Menu
  ↓
Set Limits
  ↓
Publish Menu
  ↓
Monitor Orders
```

### 👨‍🍳 Counter Flow
```
Enter Token
   ↓
Verify Order
   ↓
Mark as Served
```

---

## 5️⃣ 🧩 FUNCTIONAL REQUIREMENTS

### 🧾 Menu
- System shall display only active menu items
- Admin shall be able to create/update/delete items

### 🛒 Orders
- System shall allow users to place orders
- System shall generate unique token per order

### ⚠️ Inventory Control
- System shall restrict orders beyond set limit
- System shall reject orders when item is sold out

### 💳 Payment
- System shall simulate successful payment

### 🎟️ Token
- Token shall be incremental and unique

### 🍳 Counter
- Staff shall mark order as served using token

---

## 6️⃣ 🚫 NON-FUNCTIONAL REQUIREMENTS

### ⚡ Performance
- Page load < 2 seconds
- Order processing < 1 second

### 🔒 Security
- Admin routes protected (future enhancement)

### 📱 Usability
- Mobile-friendly UI
- Large buttons (kiosk usage)

### 📈 Scalability
- Support multiple concurrent users
- Support multiple kiosks

---

## 7️⃣ 🧠 SYSTEM DESIGN PRINCIPLES

| Principle | Description |
|---|---|
| 🔁 Parallel Processing | Multiple users can order simultaneously |
| 🧮 Controlled Inventory | Orders limited by backend constraints |
| 🔄 Stateless Backend | Each request handled independently |
| 📦 Modular Architecture | Menu, Order, Token handled separately |

---

## 8️⃣ 📡 API OVERVIEW

### Menu APIs
```
GET    /api/menu         → fetch menu
POST   /api/menu         → create item
PATCH  /api/menu/:id     → update item
```

### Order APIs
```
POST   /api/orders          → create order
PATCH  /api/orders/:token   → mark served
```

---

## 9️⃣ 🧱 TECH STACK

| Layer | Technology |
|---|---|
| Frontend | Next.js, Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB |
| Optional | Socket.io (real-time updates) |

---

## 🔟 SUCCESS METRICS

### 🎯 Primary Metrics
- Reduction in queue time
- Number of orders processed per minute

### 📊 Secondary Metrics
- User adoption rate
- Order completion rate

---

## 1️⃣1️⃣ FUTURE ENHANCEMENTS
- Real payment integration (UPI)
- QR-based token scanning
- Real-time display board
- Analytics dashboard
- Multi-canteen support

---

## 1️⃣2️⃣ RISKS & MITIGATION

| Risk | Mitigation |
|---|---|
| ⚠️ Over-ordering | Limit-based backend validation |
| ⚠️ User confusion | Simple UI (no stock display) |
| ⚠️ Network issues | Lightweight frontend |

---

## 🏁 FINAL STATEMENT

Bill4Food transforms canteen operations by decentralizing billing through parallel digital interfaces, eliminating queue bottlenecks while preserving existing kitchen workflows.
