# Ashvita Community - Project Audit

## Executive Summary
The project has a highly developed, functional UI with excellent styling, routing, and a comprehensive Prisma database schema. However, **all data visible on the dashboard and pages is currently hardcoded mock data**. There is no backend integration, no API routes/Server Actions, and no authentication mechanism implemented yet.

## 1. Global Infrastructure

### Database & Prisma
- **Current status**: Fully designed schema with relationships, plus comprehensive seed script.
- **Functional**: Yes, but only at the DB layer.
- **Missing**: Backend controllers, Server Actions, or API routes to fetch/mutate data.
- **Files involved**: `prisma/schema.prisma`, `prisma/seed.ts`, `lib/db.ts`

### Authentication & Role-based Access
- **Current status**: Not implemented.
- **Functional**: No. Users cannot log in; roles (Admin/Resident/Security) are simulated by visiting their specific routes.
- **Missing**: NextAuth/Auth.js or custom JWT authentication, session handling, middleware for route protection.
- **Files involved**: N/A (Missing `middleware.ts`, `app/api/auth/[...nextauth]/route.ts`)

---

## 2. Resident Dashboard Audit

### Resident Dashboard (Overview)
- **Current status**: UI is fully implemented with beautiful responsive design.
- **Database connected**: ❌ No.
- **Functional**: ⚠️ Partially (UI rendering only).
- **Missing**: Fetching actual resident profile, KPI data (bills, open complaints), notices from Prisma.
- **Files involved**: `app/resident/dashboard/page.tsx`

### Payments
- **Current status**: Complete UI with mock billing history, status badges, and payment modal.
- **Database connected**: ❌ No.
- **Functional**: ⚠️ UI level only (clicking "Pay Now" simulates a success toast).
- **Missing**: Fetching `MaintenanceBill` and `Payment` records from DB, actual payment gateway integration.
- **Files involved**: `app/resident/payments/page.tsx`

### Complaints
- **Current status**: Complete UI, timeline visualization, and "Raise Complaint" modal.
- **Database connected**: ❌ No.
- **Functional**: ⚠️ UI level only (adding new complaint just shows a success toast).
- **Missing**: Fetching `Complaint` records, creating complaints in Prisma.
- **Files involved**: `app/resident/complaints/page.tsx`

### Visitors
- **Current status**: UI implemented.
- **Database connected**: ❌ No.
- **Functional**: ⚠️ UI only.
- **Missing**: DB queries to `VisitorPass` and `VisitorLog`.
- **Files involved**: `app/resident/visitors/page.tsx`

### Amenities
- **Current status**: UI implemented.
- **Database connected**: ❌ No.
- **Functional**: ⚠️ UI only.
- **Missing**: DB queries to `Amenity`, `AmenitySlot`, and `AmenityBooking`.
- **Files involved**: `app/resident/amenities/page.tsx`

### Navigation / Sidebar / Logout
- **Current status**: Responsive sidebar works flawlessly in UI (mobile menu toggle works).
- **Database connected**: ❌ No.
- **Functional**: ⚠️ UI only (Logout button is just a visual link to `/`).
- **Missing**: Real session user data in the sidebar, actual sign-out logic.
- **Files involved**: `app/resident/layout.tsx`

---

## 3. Recommended Development Order

To bring this project to life without disrupting the beautiful existing UI, I recommend the following step-by-step approach:

1. **Authentication & Authorization (`middleware.ts` & Auth logic)**: Implement login functionality so that we know *which* resident/admin/security guard is logged in.
2. **Server Actions (Backend API)**: Create server actions in `app/actions/` or API routes in `app/api/` to wrap Prisma queries for fetching data safely.
3. **Connect Resident Dashboard**: Replace hardcoded `ResidentDashboard` data with real data for the logged-in user.
4. **Connect Payments & Complaints Modules**: Implement data fetching and mutating (creating a complaint, processing a payment) to replace the mock arrays.
5. **Connect Visitors & Amenities Modules**: Enable residents to book amenities and invite guests using DB relationships.
6. **Connect Admin & Security Dashboards**: Replicate the backend connection steps for the Admin and Security roles.
