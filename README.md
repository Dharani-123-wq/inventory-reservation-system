# Inventory Reservation System

## Live Application

https://inventory-reservation-system-xw7s.vercel.app

## GitHub Repository

https://github.com/Dharani-123-wq/inventory-reservation-system

# Overview

This project is a full-stack Inventory Reservation System built using Next.js, Prisma ORM, and PostgreSQL (Supabase).

The application allows users to:

- View products and warehouse inventory
- Reserve inventory stock
- Confirm reservations
- Release reservations
- Automatically expire reservations
- Dynamically manage available stock

The system demonstrates backend API development, database integration, inventory consistency, and frontend interaction.

# Tech Stack

- Next.js 16
- TypeScript
- Prisma ORM
- PostgreSQL (Supabase)
- Vercel Deployment

# Features
## Product & Inventory Management

- Product inventory tracking
- Warehouse-wise stock management
- Available stock calculation

## Reservation System

- Create reservations
- Confirm reservations
- Release reservations
- Automatic reservation expiry

## Inventory Safety

- Prevent negative stock
- Prevent overbooking
- Prevent double release
- Prevent multiple confirmations

## Frontend

- Multi-page web application
- Products page
- Reservations page
- Dynamic API integration


# Running the App Locally

## 1. Clone Repository

```bash
git clone https://github.com/Dharani-123-wq/inventory-reservation-system

2. Install Dependencies

npm install


3. Add Environment Variables

Create a .env file in the project root.

DIRECT_URL=your_postgresql_connection_url

Example:

DIRECT_URL=postgresql://username:password@host:5432/postgres


4. Run Prisma Migrations

npx prisma migrate dev


5. Seed Database
npx ts-node prisma/seed.ts

This inserts sample:

Products
Warehouses
Inventory records

6. Start Development Server

npm run dev

Open:

http://localhost:3000
Expiry Mechanism

Reservations are created with an expiry timestamp.

Whenever the reservations API is called:
Expired PENDING reservations are identified.
Reserved stock is safely released.
Reservation status is updated to RELEASED.
This simulates automatic inventory recovery.

The implementation also prevents:

Double release
Negative reserved stock
Invalid stock decrements
Reservation Flow
Reserve Product
Reservation created
Reserved stock increases
Available stock decreases
Confirm Reservation

Reservation status changes:
PENDING → CONFIRMED
Stock remains reserved
Release Reservation

Reservation status changes:
CONFIRMED/PENDING → RELEASED
Reserved stock decreases
Available stock increases
Concurrency & Correctness

The project includes safeguards to maintain inventory consistency:

Preventing negative reserved stock
Preventing overbooking
Preventing multiple confirmation actions
Preventing double release actions

These checks reduce race-condition-related inconsistencies during concurrent requests.

With more time, I would improve concurrency handling further using:

Database transactions
Row-level locking
Redis-based distributed locks
Trade-offs / Improvements

Due to time constraints, I prioritized:

Functional reservation flow
Inventory correctness
Expiry handling
Clear API structure
End-to-end working deployment

With more time, I would additionally implement:

Idempotency-Key support
Redis queue workers for expiry handling
Authentication & user roles
Real-time updates using WebSockets
Better responsive UI
Automated tests
Dashboard analytics
