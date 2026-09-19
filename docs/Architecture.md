# Architecture

## Lead

`Lead` owns the public quote-request and feedback use cases. Its aggregate validates and normalizes request values, starts as a new lead, and records `LeadSubmitted`. The Domain layer is framework-independent and may not depend on Application, Infrastructure, Presentation, Laravel/Eloquent, or Filament.

The `leads` table is owned by Lead and contains: ULID `id`, unique `idempotency_key`, `type` (`quote` or `feedback`), `name`, normalized `phone`, optional `email`, optional `message`, optional `cargo`, optional `route`, optional `cargo_parameters`, public read status (`new` or `read`), `read_at`, `submitted_at`, and timestamps.

## Public application contract

`POST /api/v1/leads/quote-requests` accepts `name`, `phone`, `cargo`, `route`, optional `cargo_parameters`, optional `email`, and an `Idempotency-Key` request header. `POST /api/v1/leads/feedback` accepts `name`, `phone`, optional `email`, optional `message`, and the same header. The current SLA guard is 10 requests per minute per IP; it deliberately does not log personal data.

The command contracts are `SubmitQuoteRequest` and `SubmitFeedbackRequest`. A successful request returns `201` and `{ "data": { "id": "…", "status": "new" } }`. Repeating a key with an equivalent normalized payload returns the stored result. A different payload with the same key returns `409`.

## Events and delivery

Submitting a lead records `App\Domain\Lead\Events\LeadSubmitted`. The handler persists the aggregate in one database transaction and hands its events to the publisher only after that transaction commits. The listener creates idempotent email and Telegram delivery records, and Horizon jobs perform the external sends with retries.

## Identity and audit

`Identity` owns server-side administrative access. `users` is the Laravel infrastructure authentication model; roles and permissions are normalized in `identity_roles`, `identity_permissions` and their pivot tables. A user may have multiple roles. `super-admin` has all current permissions, `content-manager` only enters the panel, and `lead-manager` may view leads. `admin.manage` controls notification settings. `admin.access` is always required for `/admin`.

The public application contracts are `AccessChecker` and `AuditLogger`. Opening a lead marks it as read in the Filament view page. `audit_logs` deliberately stores no passwords, tokens, or lead personal data.

## Media

`Media` owns file persistence and the public-image lifecycle. `media_assets` stores only a ULID, disk name and relative path; public images are decoded server-side, EXIF-oriented, metadata-stripped and re-encoded as WebP under a new ULID path. The API representation returns a same-origin `/storage/<path>` URL and never depends on an environment-specific storage path or hostname.

Replacing or deleting an asset changes the database inside a transaction and schedules physical cleanup only after commit. A failed transaction removes the newly written public object and retains the old one. Public storage is read-only to Nginx, while `private` storage is outside the Nginx alias and is downloadable only through the authenticated `media.private.download` endpoint (currently granted to `super-admin`).
