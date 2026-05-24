# Inventory Reservation System

## Tech Stack

- Next.js
- Prisma ORM
- PostgreSQL (Supabase)
- TypeScript

---

## Features

- Product inventory management
- Warehouse stock tracking
- Product reservation system
- Reservation confirmation
- Reservation release
- Automatic reservation expiry handling
- Live stock updates

---

## Run Locally

### 1. Clone repository

git clone https://github.com/Dharani-123-wq/inventory-reservation-system

### 2. Install dependencies

npm install

### 3. Add environment variable

Create `.env`

DIRECT_URL=your_postgresql_connection_url

### 4. Run migrations

npx prisma migrate dev

### 5. Seed database

npx ts-node prisma/seed.ts

### 6. Run app

npm run dev

---

## Expiry Mechanism

Reservations are created with an expiry timestamp.

Whenever reservations are fetched:

- expired PENDING reservations are automatically released
- reserved stock is decremented
- reservation status becomes RELEASED

This simulates automatic inventory recovery.

---

## Trade-offs / Improvements

With more time I would add:

- Redis queue for scalable expiry handling
- Better authentication and user roles
- Real-time updates using websockets
- Better dashboard analytics
- Improved responsive UI