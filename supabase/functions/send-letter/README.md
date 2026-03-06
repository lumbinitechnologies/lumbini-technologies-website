## `send-letter` Edge Function

This function lets an **admin** generate and deliver:
- **Offer Letter**
- **Internship Agreement**

Flow:
1. Admin clicks a button in the Admin Dashboard
2. Frontend calls the Edge Function with the admin’s JWT
3. Function verifies the requester is in `admins` table
4. Function generates a PDF, uploads to Storage (`letters` bucket)
5. Function creates a **7-day signed URL**
6. Function **emails the intern** the signed URL (optional, if configured)

### 1) Create Storage bucket

Create a bucket named **`letters`** in Supabase Storage.

Recommended:
- Bucket visibility: **Private**

### 2) Set Edge Function env vars

In Supabase project settings (Edge Functions → Environment variables):

Required:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional (email via Resend):
- `RESEND_API_KEY`
- `FROM_EMAIL` (example: `Lumbini HR <hr@yourdomain.com>`)

If `RESEND_API_KEY` or `FROM_EMAIL` is missing, the function still works, but returns a signed URL and `emailSent: false`.

### 3) Deploy the function

Using Supabase CLI:

```bash
supabase functions deploy send-letter
```

### 4) Frontend wiring

Admin Dashboard calls:
- `supabase.functions.invoke("send-letter", { body: { applicationId, type } })`

Implemented in:
- `src/services/letters.js`
- `src/Components/Admin/AdminDashboard.jsx`

### 5) Security notes (industry-standard expectations)

- The function uses the caller’s JWT and checks `admins` table.
- All DB & Storage operations use the **Service Role key** inside the function (never exposed to the browser).
- The intern receives a **time-limited signed URL** (7 days).

