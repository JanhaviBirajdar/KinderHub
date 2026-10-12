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

## 🌟 Innovative Upgraded Modules

KinderHub has been enhanced with six state-of-the-art early childhood modules designed to empower educators and delight families:

### 1. 🌱 KinderGrowth AI (Child Learning Journey & Portfolios)
* **5-Domain Continuous Portfolios**: Language, Motor Skills, Creativity, Social-Emotional, and Cognitive development.
* **Child Self-Comparison**: Compares each child with their *own* previous observation baseline rather than peer rankings.
* **Milestone Timeline**: Observation cards linked to activities, photos, and context (classroom vs. home).
* **AI Age-Appropriate Activity Suggestions**: Pedagogical activity recommendations with explicit rationales and **educator review/approval workflow**.
* **Monthly Developmental Summaries**: Synthesis reports published directly to parents with strengths and nurturing goals.

### 2. 🌍 KinderConnect (Multilingual Home-School Bridge)
* **Trilingual Native Support**: Instant language switching between **English (EN)**, **मराठी (MR - Marathi)**, and **हिन्दी (HI - Hindi)**.
* **Structured Routine Updates**: Meals, hydration, sleep quality/duration, activities, and photos.
* **Bilingual Parent Digests**: Automatically generates warm, conversational narrative digests in Marathi and Hindi while preserving original teacher text.
* **Home Activity Extensions**: Screen-free, play-based evening prompts for families.
* **Parent Feedback Feed**: Interactive reactions (`❤️`, `⭐`, `👏`) and thank-you notes.
* **Parental Privacy Controls**: Granular consent settings for photo sharing and portfolio retention.

### 3. 🛡️ KinderSafe (Child Safety & Authorized Pickup Protocol)
* **Authorized Guardian Directory**: Registered guardians with photos, relationships, and emergency contact details.
* **Time-Limited QR Pickup Passes & 6-Digit OTPs**: Expire automatically after 2, 4, or 8 hours with secure signature validation.
* **Staff Pickup Verification Terminal**: Fast validation screen with side-by-side guardian identity checklist, emergency contacts, and allergy alerts.
* **Anti-Replay Safeguard**: Permanent invalidation after completed handover; prevents duplicate pass redemptions.
* **Zero Face-Only Verification Policy**: Facial recognition is strictly forbidden as the sole identity verification mechanism.
* **Live Emergency Reunification Roster**: Live headcount of on-campus children from attendance sheets for evacuation drills.
* **Safety & First Aid Incident Tracking**: Detailed log of minor falls, first aid, and parental notification timestamps.

### 4. 🗺️ KinderQuest (Play-Based Wonder Garden Quests)
* **Wonder Garden Learning Theme**: Peaceful, gamified learning chapters (Sprout Sanctuary, Butterfly Valley, Whispering Woods).
* **Interactive Mini-Activities**: Leaf color matching, shape sorting, caterpillar counting, and storytelling prompts.
* **Chapter Unlock Controls**: Teachers unlock chapters based on developmental readiness.
* **Non-Competitive Badges**: Celebrate individual milestones without leaderboards, peer rankings, or countdown pressure.
* **Offline Home Quests**: Screen-free activities for parents to play at home.

### 5. ⚡ KinderOffline (Teacher Workflow Resilience)
* **Client-Side Persistence Queue**: Caches attendance, observations, and daily logs locally in browser storage when disconnected.
* **Live Sync Status Indicator**: Persistent visual badge in the Navbar (`Online - Synced`, `Offline - X Queued`, `Syncing...`).
* **Auto-Reconnect Synchronization**: Listens for network reconnects and syncs queued drafts idempotently.
* **Conflict Resolution**: Safely merges offline edits with server records without discarding unsynchronized data.

### 6. ⚡ KinderPredict (Rule-Based School Action Dashboard)
* **Deterministic Operational Rules**:
  1. *Repeated Absences*: Flags students with 2+ absences with exact date stamps and recommends compassionate parent check-in.
  2. *Overdue Tuition*: Identifies invoices past due with outstanding balance and days late.
  3. *Class Capacity*: Identifies classrooms approaching ≥80% capacity with student-to-teacher ratio limits.
  4. *Admissions Pipeline*: Flags applications stalled in 'Pending' or 'Under Review' for > 3 days.
* **Transparent Rule Explanations**: Discloses exact rule logic for every flag and recommends actionable steps.
* **Staff Review & Resolution**: Authorized staff can mark flags as reviewed or resolved with recorded action notes.
* **Ethical Governance**: Strict policy against unvalidated predictions of child intelligence, behavior, or future academics.

---

## 💻 Technology Stack

* **Frontend**: React 19, Vite 8, Tailwind CSS, Lucide React, Recharts.
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB with Mongoose (with automated in-memory datastore fallback for zero-dependency instant startup).
* **Security & Auth**: JWT (JSON Web Tokens), Bcryptjs password hashing, role guard middleware.

---

## 🧪 Comprehensive Automated Test Suite (69 Tests)

KinderHub includes a comprehensive 69-test automated integration suite covering both core operations and all six innovation modules.

To execute the test suite:
```bash
# Run all 69 integration tests (Core + Innovation modules):
npm run test:all

# Or run innovation tests specifically:
npm run test:innovations

# Or run core e2e tests:
npm run test:e2e
```

**Expected Result:**
```
==========================================
🏁 Total Tests: 69 (36 Core + 33 Innovations)
✅ Passed: 69
❌ Failed: 0
==========================================
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
| `GET` | `/api/kindergrowth/profile/:id` | KinderGrowth 5-domain profile & self-comparison |
| `POST` | `/api/kindergrowth/observations` | Record educator or parent home observation |
| `POST` | `/api/kindergrowth/ai-suggestions` | Generate AI age-appropriate activity suggestions |
| `PATCH`| `/api/kindergrowth/ai-suggestions/:id/review` | Educator reviews and approves suggestion |
| `GET` | `/api/kinderconnect/timeline/:id` | Daily timeline (meals, naps, activities, photos) |
| `POST` | `/api/kinderconnect/translate` | Trilingual translation engine (EN, MR, HI) |
| `POST` | `/api/kindersafe/passes/generate` | Generate time-limited QR pickup pass & 6-digit OTP |
| `POST` | `/api/kindersafe/passes/verify` | Staff pickup verification terminal |
| `GET` | `/api/kindersafe/emergency-accountability` | Live emergency reunification headcount roster |
| `GET` | `/api/kinderquest/journey/:id` | Play-based Wonder Garden learning journey |
| `POST` | `/api/kinderoffline/sync` | Idempotent batch sync for offline-queued records |
| `GET` | `/api/kinderpredict/alerts` | Rule-based school action alerts (absences, fees, capacity) |

---

## 🧸 Design Aesthetic
* **Palette**: Soft pastel lavender (`#F3E8FF`), sky blue (`#E0F2FE`), mint green (`#DCFCE7`), warm peach (`#FFEDD5`), and sunny yellow (`#FEF9C3`).
* **Typography**: Outfit for headings and Plus Jakarta Sans for clean body text.
* **Components**: Rounded pill cards, status badges, and print-ready receipt layouts.
