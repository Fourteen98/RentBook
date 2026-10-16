# CLAUDE.md

Guidance for Claude when working in this repository. Read `PRODUCT_BRIEF.md` for the problem statement and feature scope. The detailed build plan and decision log lives in the RentBook project doc `claude/rentbook-plan.md`.

This is a learning project: plan before building, explain the why as well as the what, and go step by step.

## Project summary

RentBook (working name) is a mobile-first, installable web app for Ghanaian landlords to manage properties, units, tenants, leases, payments, receipts and tenancy agreements. It replaces the common practice of recording payments and terms as WhatsApp messages. Mobile is the primary target; desktop must be fully usable.

## Tech stack

- **Backend:** Ruby on Rails 8.1 (Ruby 3.3.6), PostgreSQL 15
- **Frontend:** Inertia.js + React 19 + TypeScript (strict), built by Vite (`vite_rails`)
- **Styling:** Tailwind CSS v4; design tokens in `app/frontend/entrypoints/application.css` (`@theme`)
- **UI helpers:** `class-variance-authority` for variants, `cn()` (clsx + tailwind-merge) in `app/frontend/lib/cn.ts`
- **Authorization:** Pundit policies on top of database-defined roles and permissions
- **Background jobs:** Solid Queue (no Redis)
- **Files:** Active Storage (local disk in development, S3-compatible bucket in production)
- **Auth:** phone number + SMS OTP (+233 numbers); adapt the Rails 8 authentication generator
- **PDF:** server-side generation for receipts and agreements
- **SMS/WhatsApp and payments:** providers behind interfaces in `app/services/` (Hubtel, Arkesel, WhatsApp Cloud API, Paystack…), never hard-coded
- **Testing:** Rails tests (Minitest) for models and services; Vitest for frontend logic; system tests at mobile width for key flows

## How a request flows

```
config/routes.rb → Controller (authorize with Pundit) → render inertia: { props }
                 → app/frontend/pages/<controller>/<action>.tsx receives typed props
```

Rails owns data, validation and permissions. React only renders. There is no separate JSON API. Props are snake_case end to end.

## Domain model

```
Organization (landlord account)
 ├─ Role (name, is_system) ── RolePermission (permission_key, grant: allowed | needs_approval)
 ├─ Member (user, role) ── MemberPropertyScope (which properties they can see)
 ├─ Property (name, location, GhanaPost GPS address?)
 │   ├─ UnitType ("Chamber & Hall") — default RentPlans, photos, short video
 │   └─ Unit ("Room 7", status) — may override RentPlans and media
 ├─ RentPlan (unit_type OR unit, period_months, monthly_rate_pesewas)
 ├─ Tenant (name, phone, ghana_card?, emergency contact)
 ├─ Lease (unit, tenant, start/end, period_months, monthly_rate_pesewas — copied from plan,
 │         discount_pesewas + reason, total_pesewas, terms: water, electricity, service charge…)
 │   ├─ Payment (amount, method, paid_at, reference, recorded_by)
 │   │   └─ Receipt (sequential number per org, PDF, public share token)
 │   └─ Agreement (template version, status) ── AgreementSignature (landlord first, then tenant)
 ├─ ApprovalRequest (permission_key, payload, status, requested_by, decided_by)
 ├─ Reminder (lease expiry, overdue charge)
 └─ AuditLog (who did what, when)
User ── UserSignature (saved landlord signatures)
```

## Rules and conventions

- **Money:** integer pesewas (`bigint`), never floats. Display as `GH₵ 19,500.00`. Rent plans are monthly rate × months.
- **Snapshots:** a lease copies its plan's rate and months at creation. Changing a plan never changes existing leases. Discounts are stored separately with a reason, never by editing the rate.
- **Dates:** store UTC; display in `Africa/Accra`. Lease end dates are inclusive.
- **Phone numbers:** normalize to E.164 (`+233XXXXXXXXX`); accept `05XXXXXXXX` input.
- **Receipts are immutable.** Corrections create a reversal + new payment. Receipt numbers are sequential per organization with no gaps; only applied (approved) payments get a number.
- **Multi-tenancy:** every query is scoped by `organization_id` through `current_organization`. Row-level security is a later hardening step.
- **Permissions, not roles:** code checks permissions (`payments.record`), never role names. Owner / Manager / Caretaker are seeded, editable roles.
- **Approvals:** a permission can be granted `needs_approval`; the action is saved as an `ApprovalRequest` and applied by the same service object once approved. Approving is its own permission (`<action>.approve`). Nobody can approve their own request.
- **Audit:** every create/update/delete on leases, payments, agreements and approvals writes an `AuditLog` row with the acting member.
- **Signing:** landlord signs first (saved signature + OTP/PIN re-check), tenant signs last via a single-use public link + SMS OTP. Store the document's SHA-256 with each signature; executed agreements are immutable.
- **Sharing:** receipts and agreements get an unguessable public link and a "Share to WhatsApp" action (`https://wa.me/?text=...`).
- **Performance:** target mid-range Android on 3G. Small bundles, small image variants, videos load only on tap, paginate lists.
- **Accessibility:** tap targets ≥44px, readable at default font sizes, works one-handed.
- **Design:** use only token names (`bg-brand-600`, `text-ink`, `border-line`), never raw hex. One primary button per screen. Gold (`accent-500`) is for fills and badges, never text on white.
- **Copy:** plain English, short sentences; amounts and dates always unambiguous.

## Folder structure

```
app/
  controllers/        # InertiaController is the base for page controllers
  models/
  policies/           # Pundit policies
  services/           # domain actions (RecordPayment, ApproveRequest…) and provider interfaces
  frontend/
    entrypoints/      # application.css (tokens), inertia.tsx
    pages/            # one folder per controller, one file per action
    components/ui/    # Button, Card, Field, Input, StatusBadge, Money…
    components/signature/
    lib/              # cn, money, dates, phone (frontend helpers)
    types/
db/migrate/           # every schema change is a migration
test/
```

## Commands

```
bin/dev               # Rails (:3000) + Vite together
bin/rails db:create
bin/rails db:migrate
bin/rails test
pnpm check            # TypeScript type check
```

Development-only component preview: http://localhost:3000/styleguide

## Working agreements for Claude

- Check `PRODUCT_BRIEF.md` and the plan doc before adding features; flag anything out of MVP scope.
- Every schema change is a new migration; never edit an applied migration.
- Add tests for money, dates, phone normalization, receipt numbering and permission/approval logic.
- Design every screen at 375px width first, then scale up.
- Don't hard-code a payment or SMS provider; go through the interface.
- Agreement templates are legal text; don't rewrite their wording without being asked. Templates need review by a Ghanaian lawyer (Rent Act 1963, Act 220; Electronic Transactions Act 2008, Act 772).
