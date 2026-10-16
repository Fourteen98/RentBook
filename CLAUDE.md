# CLAUDE.md

Guidance for Claude when working in this repository. Read `PRODUCT_BRIEF.md` for the full problem statement and feature scope.

## Project summary

RentBook (working name) is a mobile-first, installable web app for Ghanaian landlords to manage properties, units, tenants, leases, payments, receipts and tenancy agreements. It replaces the common practice of recording payments and terms as WhatsApp messages. Mobile is the primary target; desktop must be fully usable.

## Tech stack (defaults — change here if we decide otherwise)

- **Framework:** Next.js (App Router) + TypeScript (strict)
- **UI:** Tailwind CSS + shadcn/ui; mobile-first layouts
- **PWA:** installable, offline-tolerant reads, background retry for writes
- **Database:** PostgreSQL via Supabase
- **ORM:** Drizzle (or Prisma — pick one and stay consistent)
- **Auth:** phone number + SMS OTP (+233 numbers)
- **Validation:** Zod, shared between client and server
- **PDF:** server-side generation for receipts and agreements
- **SMS/WhatsApp:** provider behind an interface (e.g. Hubtel, Arkesel, WhatsApp Cloud API)
- **Payments (later):** Paystack or Hubtel, behind an interface
- **Testing:** Vitest for units, Playwright for key flows (mobile viewport first)

## Domain model

```
Organization (landlord account)
 ├─ Member (owner | manager | caretaker)  — role-based access
 ├─ Property (name, location, GhanaPost GPS address?)
 │   └─ Unit (label e.g. "Room 7", type e.g. "Chamber & Hall", status)
 ├─ Tenant (name, phone, ghana_card?, emergency contact)
 ├─ Lease (unit, tenant, start_date, end_date, rent_amount, rent_period,
 │         advance_months, deposit, terms JSON: water, electricity, service charge…)
 │   ├─ Payment (amount, method, paid_at, reference, recorded_by)
 │   │   └─ Receipt (sequential number per org, PDF, public share token)
 │   └─ Agreement (template version, rendered PDF, status: draft|sent|accepted)
 ├─ Reminder (lease expiry, overdue charge)
 └─ AuditLog (who did what, when)
```

## Rules and conventions

- **Money:** store as integer pesewas (`bigint`), never floats. Display as `GH₵ 19,500.00`.
- **Dates:** store UTC; display in `Africa/Accra`. Lease end dates are inclusive.
- **Phone numbers:** normalize to E.164 (`+233XXXXXXXXX`); accept `05XXXXXXXX` input.
- **Receipts are immutable.** Corrections create a reversal + new payment, never edits. Receipt numbers are sequential per organization with no gaps.
- **Multi-tenancy:** every query is scoped by `organization_id`; enforce with Postgres row-level security as well as app code.
- **Audit:** every create/update/delete on leases, payments and agreements writes an `AuditLog` row with the acting member.
- **Roles:** caretakers can record payments and view their assigned properties; only owners/managers edit leases, amounts or delete anything.
- **Sharing:** receipts and agreements get an unguessable public link and a "Share to WhatsApp" action (`https://wa.me/?text=...`).
- **Rent advances:** support multi-month and multi-year advances; don't assume monthly billing.
- **Performance:** target mid-range Android on 3G — keep JS bundles small, prefer server components, paginate lists.
- **Accessibility:** tap targets ≥44px, readable at default font sizes, works one-handed.
- **Copy:** plain English, short sentences; amounts and dates always unambiguous.

## Folder structure (intended)

```
src/
  app/            # routes (App Router); (auth), (dashboard), r/[token] public receipts
  components/     # UI components; ui/ for shadcn primitives
  features/       # properties, units, tenants, leases, payments, agreements, reminders
  lib/            # db, auth, money, dates, phone, pdf, notifications
  server/         # server actions and services
  db/             # schema + migrations
tests/
```

## MVP build order

1. Auth (phone OTP), organization + members
2. Properties and units
3. Tenants
4. Leases with terms
5. Payments + receipt PDF + share link
6. Dashboard (occupancy, collected vs expected, expiries)
7. Tenancy agreement templates + generation
8. Reminders (in-app first, then SMS/WhatsApp)
9. Caretaker roles + audit log view

## Commands

Fill these in once the project is scaffolded:

```
pnpm dev        # run locally
pnpm build
pnpm test
pnpm test:e2e
pnpm db:migrate
```

## Working agreements for Claude

- Check `PRODUCT_BRIEF.md` before adding features; flag anything out of MVP scope.
- Write migrations for every schema change; never edit applied migrations.
- Add tests for money, date and receipt-numbering logic.
- Design every screen at 375px width first, then scale up.
- Don't hard-code a payment or SMS provider; go through the interface in `lib/`.
- Agreement templates are legal text — don't rewrite their wording without being asked.
