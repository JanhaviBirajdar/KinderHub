## 🌟 Key Highlights & Modules

### 1. 🛡️ Role-Based Access Control (RBAC)
Dedicated portals and navigation bars tailored to each stakeholder:
* **Super Admin & School Admin**: Full management of admissions, enrollments, billing, staff, classroom capacities, and regulatory reports.
* **Lead Teacher / Educator**: Classroom management, daily attendance rosters, learning activity logs, 5-domain milestone portfolios, and parent messages.
* **Parent / Guardian**: Secure window for linked children, real-time attendance, tuition invoices, instant payments, printable vouchers, and absence requests.

### 2. 👶 Child & Health Directory
* Unique Student IDs (e.g., `KH-2026-001`).
* Emergency contact information and authorized pickup contacts.
* Restrictive allergy & medical safety indicators.
* Comprehensive student history tabs: Personal details, Health alerts, Attendance history, and Fee records.

### 3. 📋 Admissions Pipeline
* Online admission inquiry form for prospective parents.
* Four-stage workflow pipeline: `Pending` ➔ `Under Review` ➔ `Approved` ➔ `Rejected`.
* One-click **"Convert to Enrolled Student"** action for approved applicants.

### 4. 🏫 Classrooms, Ratios & Capacity
* Preschool groups: **Playgroup**, **Nursery**, **Junior KG**, and **Senior KG**.
* Student-to-teacher ratio tracking and capacity limit progress bars.
* Enrolled student rosters and classroom schedule assignments.

### 5. 📅 Daily Attendance Management
* Daily class-wise roster with `Present`, `Late`, `Absent`, and `Leave` statuses.
* **"Mark All Present"** bulk recording for fast morning drop-offs.
* Audit trail tracking who marked or updated attendance and at what time.
* Prevention of accidental duplicate entries.

### 6. 💳 Tuition & Fee Reconciliation
* Term tuition structures configured by class level.
* Automated invoice generation with discount & concession handling.
* Payment recording across Cash, UPI / QR, Direct Bank Wire, Debit/Credit Card, and Verified Online Demo.
* Partial payment tracking with automatic balance updates.
* **Official Printable Receipts** with watermark, school stamp, and print/PDF formatting.

### 7. 🎨 5-Domain Early Childhood Milestones
Non-competitive developmental progress evaluations across the five preschool pillars:
1. **Language & Communication**
2. **Motor Skills Coordination (Fine & Gross)**
3. **Creativity & Artistic Expression**
4. **Social & Emotional Agility**
5. **Cognitive & Pre-Math Problem Solving**

### 8. 📣 Communications, Notices & Leave Requests
* Campus broadcast bulletins targeted to `All`, `Parents`, or `Teachers`.
* Direct messaging between parents and class teachers.
* Absence and leave request review workflow.

### 9. 📊 Searchable Audits & CSV Reports
* Real-time reporting for Attendance, Financial Collections, and Classroom Capacities.
* One-click CSV export and clean print stylesheets.

---

## 💻 Technology Stack

* **Frontend**: React 19, Vite 8, Tailwind CSS, Lucide React, Recharts.
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB with Mongoose (with automated in-memory datastore fallback for zero-dependency instant startup).
* **Security & Auth**: JWT (JSON Web Tokens), Bcryptjs password hashing, role guard middleware.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
* **Node.js** v18+ (tested on Node v24)
* **npm** v9+

### 2. Installation

Clone or open the repository root:
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Running the Application

You can launch both the backend and frontend concurrently:

```bash
# From the project root:
# Terminal 1: Start Backend API (Port 5000)
cd server
npm run dev

# Terminal 2: Start Vite Frontend (Port 5173)
cd client
npm run dev
```

Open your browser at:
👉 **`http://localhost:5173/`**

---

## 🧪 Automated End-to-End Test Suite

KinderHub includes a comprehensive 36-test integration suite covering authentication, RBAC route guards, student enrollment CRUD, admissions conversion pipeline, daily attendance logging, fee recalculation (subtotal - discounts, partial payments, remainder settlement, receipt generation), parent portal access, compliance reports, and deletion safeguards.

To execute the test suite:
```bash
# From project root:
npm run test:e2e

# Or from server directory:
cd server
npm run test:e2e
```

**Expected Result:**
```
🏁 Total E2E Tests: 36
✅ Passed: 36
❌ Failed: 0
```

---

## 🔑 Demo Login Accounts

KinderHub supports both standard school and simplified `.com` test accounts:

| Role | Primary Email | Simplified Login | Password | Access Details |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@kinderhub.edu` | `admin@kinderhub.com` | `admin123` / `Admin@123` | Full administrative control & reporting |
| **School Admin** | `principal@kinderhub.edu` | `admin@kinderhub.edu` | `Admin@123` | Preschool operations & admissions |
| **Lead Teacher** | `clara.teacher@kinderhub.edu` | `clara@kinderhub.com` | `teacher123` / `Teacher@123` | Playgroup head educator |
| **Lead Teacher** | `sophia.teacher@kinderhub.edu` | - | `Teacher@123` | Nursery lead educator |
| **Parent** | `sarah.parent@kinderhub.edu` | `sarah@kinderhub.com` | `parent123` / `Parent@123` | Parent of Mia & Leo Johnson |
| **Parent** | `david.parent@kinderhub.edu` | - | `Parent@123` | Parent of Oliver Smith |

> **Tip**: You can also use the **Role** switcher pill in the top navigation bar or the 1-click preset buttons on the login screen!

---

## ⚙️ Environment Variables

Configure `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/kinderhub
JWT_SECRET=kinderhub-super-secret-jwt-key-2026
NODE_ENV=development
```

*If no local MongoDB service is detected, KinderHub automatically boots its integrated in-memory preschool datastore so you can explore all features without manual database setup.*

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT |
| `GET` | `/api/auth/me` | Current authenticated user profile |
| `GET` | `/api/dashboard/summary` | Live operational statistics & charts |
| `GET` | `/api/children` | List students with search & filter |
| `POST` | `/api/children` | Enroll new student |
| `GET` | `/api/admissions` | Admission pipeline inquiries |
| `POST` | `/api/admissions/:id/convert` | Convert approved applicant to enrolled student |
| `GET` | `/api/attendance` | Fetch class attendance for specific date |
| `POST` | `/api/attendance` | Save / update attendance sheet |
| `GET` | `/api/fees/invoices` | List tuition invoices & balances |
| `POST` | `/api/fees/payments` | Record tuition installment & issue receipt |
| `GET` | `/api/activities` | Preschool sensory & learning activities |
| `POST` | `/api/activities/progress` | Record 5-domain developmental milestone |
| `GET` | `/api/schedule/timetable` | Weekly class timetable |
| `GET` | `/api/communication/announcements`| Campus bulletins & notices |
| `GET` | `/api/reports?type=attendance` | Searchable audit tables for export |

---

## 🧸 Design Aesthetic
* **Palette**: Soft pastel lavender (`#F3E8FF`), sky blue (`#E0F2FE`), mint green (`#DCFCE7`), warm peach (`#FFEDD5`), and sunny yellow (`#FEF9C3`).
* **Typography**: Outfit for headings and Plus Jakarta Sans for clean body text.
* **Components**: Rounded pill cards, status badges, and print-ready receipt layouts.
