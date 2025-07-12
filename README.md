# 🎟️ Cinema Ticket Booking

## Overview
This project implements a **Cinema Ticket Booking System** in **Node.js**, following **clean architecture principles** to ensure **scalability, testability, and maintainability**.

---

## 💡 Thought Process & Approach

### 1️⃣ Separation of Concerns
- **Business Logic in `TicketService.js`** → Handles ticket validation, pricing, and seat allocation.
- **Third-Party Services (`TicketPaymentService.js`, `SeatReservationService.js`)** → Simulate external payment and seat reservation systems.
- **Immutable Data Models (`TicketTypeRequest.js`)** → Ensures data integrity by preventing modifications after creation.

### 2️⃣ Dependency Injection for Testability
- Instead of **instantiating services inside `TicketService.js`**, dependencies (payment & seat services) are **injected via the constructor**.
- This allows **mocking external services** during testing, making unit tests more **isolated and reliable**.

### 3️⃣ Custom Exception Handling
- **`InvalidPurchaseException.js`** → A custom error class ensures **clear, specific error handling** for invalid ticket purchases.

### 4️⃣ Strong Input Validation
- **Ensures valid account IDs** (positive integers).
- **Enforces business rules**, like **requiring at least one adult ticket per purchase** and **limiting ticket purchases to 25 per transaction**.

### 5️⃣ `.gitignore` to Prevent Unnecessary Files
- Excludes `node_modules/`, logs, and test reports to **keep the repo clean**.

---

## ✅ Running the Tests
1. **Install dependencies**:  
   ```bash
   npm install
   ```

2. **Run the Tests**:  
   ```bash
   npm test
   ```

3. **Expected behavior:**
- The tests will validate the correct implementation of ticket purchases.  
- Mock services ensure no real payments or seat reservations are made.  

