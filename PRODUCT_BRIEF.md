# RentBook (working name) — Product Brief

## Problem statement

Most landlords in Ghana run their rental business through WhatsApp chats, phone calls, paper notebooks and memory. A typical tenancy looks like this:

1. Tenant sends their name and phone number on WhatsApp.
2. Landlord (or caretaker) types "An amount of 19,500ghc has been received…" as a chat message. That message *is* the receipt.
3. Key terms (water, service charges) are "being discussed" with no record of what was agreed.
4. The tenancy agreement is promised "once we are done" and often never arrives, or arrives as a forwarded text.
5. The lease period ("1st October 2026 – 30th September 2027") and the unit ("Room 7, Chamber and Hall") live only inside a chat thread.

This breaks down quickly for a landlord with several properties and dozens of tenants:

- **No single source of truth.** Who lives where, what they paid, and when their rent expires is scattered across chats, caretakers' phones and notebooks.
- **Weak proof of payment.** A chat message is not a numbered, verifiable receipt. Disputes become one person's word against another's.
- **Missed renewals and lost income.** Ghana's advance-rent culture (1–2 years upfront) means expiries are rare and easy to forget. Units sit empty or tenants overstay without renewing.
- **Undocumented terms.** Utility, service-charge and maintenance responsibilities are agreed verbally and remembered differently later.
- **No visibility over caretakers.** Owners — often abroad or in another city — can't see what caretakers collected or promised.
- **Tenants are exposed too.** They lack proper receipts, a signed agreement, and a clear channel for maintenance requests — all of which matter if they ever need to approach the Rent Control Department.

## Solution

A mobile-first web app (installable PWA, works fully on desktop) that gives landlords one place to manage properties, units, tenants, leases and payments — and gives every tenant a proper receipt and agreement automatically.

### Core idea
Replace "chat as record" with "record, then share to chat." The landlord still uses WhatsApp/SMS to talk to tenants, but every payment, lease and agreement is created in the app first and shared as a link or PDF.

### MVP features

| Area | What it does |
|---|---|
| Portfolio | Properties → units (e.g. "Weija Mile 11 › Room 7 › Chamber & Hall"), with status: occupied, vacant, reserved, under repair |
| Tenants | Profile: name, phone, Ghana Card number (optional), emergency contact, notes |
| Leases | Unit + tenant + start/end date + rent amount + advance period + agreed terms (water, electricity/prepaid meter, service charge, deposit) |
| Payments | Record payment (cash, MoMo, bank transfer), auto-generate numbered receipt (PDF + shareable link), running balance per lease |
| Agreements | Generate a tenancy agreement from a template using lease data; share for acceptance; store the accepted copy |
| Reminders | Expiry alerts at 90/60/30 days; overdue service-charge reminders; optional SMS/WhatsApp to tenant |
| Dashboard | Occupancy, rent collected vs expected, upcoming expiries, vacant units |
| Team | Owner invites caretakers with limited roles; every action logged with who did it |

### Later phases
- Tenant portal: view receipts and agreement, raise maintenance requests with photos
- Online payment via MoMo / card (Paystack or Hubtel)
- Utility and service-charge splitting across a compound
- Expenses and simple profit/loss per property
- Exportable records for tax and Rent Control matters
- Listing vacant units

### Who it's for
- **Primary:** Small-to-mid landlords (1–10 properties, 5–100 units), often managing through a caretaker
- **Secondary:** Caretakers and property agents
- **Tertiary:** Tenants (receive receipts/agreements; later, a portal)

### Ghana-specific design choices
- Currency GHS, formatted "GH₵ 19,500.00"
- Phone number (+233) as primary identity; OTP login, not email/password
- Payment methods: cash, MTN MoMo, Telecel Cash, AT Money, bank transfer
- Support rent advances spanning many months/years, not only monthly rent
- Optional GhanaPost GPS digital address for properties
- Light on data and works on mid-range Android phones and patchy connections
- Sharing via WhatsApp is a first-class action, not an afterthought

### Success metrics (first 6 months)
- Landlords record ≥90% of payments in-app rather than in chat
- Every active lease has a stored agreement
- Zero "missed" expiries for active users (all surfaced ≥30 days ahead)
- Weekly active use by the owner, not only the caretaker

### Out of scope for MVP
Native apps, accounting/tax filing, tenant credit scoring, marketplace listings.

> Legal note: tenancy agreement templates should be reviewed by a Ghanaian lawyer, and the app should reflect the Rent Act, 1963 (Act 220) and current Rent Control guidance — including its rules on rent advances — rather than assume common practice is compliant.
