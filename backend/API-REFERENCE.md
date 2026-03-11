# RentAstra Backend API Reference

**Base URL:** `http://localhost:5000`  
*(Port may vary if `PORT` is set in `.env`; default is 5000.)*

**Auth:** Most routes (except auth register/login) require:
- Header: `Authorization: Bearer <token>` (get token from `POST /api/auth/login`)
- Many routes also use: `X-Property-Id: <propertyId>` or query `?propertyId=<id>`

---

## 1. Auth — `/api/auth`

| Method | Full URL | Description |
|--------|----------|-------------|
| POST | http://localhost:5000/api/auth/register | Register new user (body: fullName, email, phone, password, propertyName, propertyAddress) |
| POST | http://localhost:5000/api/auth/login | Login (body: email, password) → returns token |
| GET | http://localhost:5000/api/auth/me | Get current user profile **(auth)** |
| PUT | http://localhost:5000/api/auth/me | Update profile **(auth)** (body: fullName, phone, propertyName, propertyAddress, propertyId?) |

---

## 2. Properties — `/api/properties`

| Method | Full URL | Description |
|--------|----------|-------------|
| GET | http://localhost:5000/api/properties | List my properties **(auth)** |
| POST | http://localhost:5000/api/properties | Create property **(auth)** (body: name, address?) |
| GET | http://localhost:5000/api/properties/:id | Get one property **(auth)** |
| PUT | http://localhost:5000/api/properties/:id | Update property **(auth)** (body: name, address?) |
| POST | http://localhost:5000/api/properties/:id/delete | Delete property **(auth)** |
| DELETE | http://localhost:5000/api/properties/:id | Delete property **(auth)** |

**Example (browser):**  
http://localhost:5000/api/properties  
*(Needs `Authorization: Bearer <token>`; use a REST client or browser extension for headers.)*

---

## 3. Guests — `/api/guests`

| Method | Full URL | Description |
|--------|----------|-------------|
| GET | http://localhost:5000/api/guests | List guests **(auth + property)** |
| GET | http://localhost:5000/api/guests/with-balance | List guests with balance **(auth + property)** |
| GET | http://localhost:5000/api/guests/vacated | List vacated guests **(auth + property)** |
| GET | http://localhost:5000/api/guests/:id | Get guest by ID **(auth + property)** |
| POST | http://localhost:5000/api/guests | Add guest **(auth + property)** (body: name, phone, roomId) |
| PUT | http://localhost:5000/api/guests/:id | Update guest **(auth + property)** (body: name, phone?) |
| DELETE | http://localhost:5000/api/guests/:id | Delete guest **(auth + property)** |
| PUT | http://localhost:5000/api/guests/:id/change-room | Change guest room **(auth + property)** (body: roomId) |
| PUT | http://localhost:5000/api/guests/:id/police-status | Update guest police status **(auth + property)** (body: status) |
| POST | http://localhost:5000/api/guests/:id/vacate | Vacate guest **(auth + property)** (body: exitDate, reason?, finalPayment) |
| PUT | http://localhost:5000/api/guests/:id/undo-vacate | Undo vacate **(auth + property)** |

**Example (browser):**  
http://localhost:5000/api/guests  
http://localhost:5000/api/guests/with-balance  
http://localhost:5000/api/guests/vacated  
*(Send `Authorization` and `X-Property-Id` via extension or REST client.)*

---

## 4. Payments — `/api/payments`

| Method | Full URL | Description |
|--------|----------|-------------|
| GET | http://localhost:5000/api/payments | List payments **(auth + property)** (query: `?month=YYYY-MM`) |
| GET | http://localhost:5000/api/payments/guest/:guestId | Payments for one guest **(auth + property)** |
| GET | http://localhost:5000/api/payments/pending | Pending payments **(auth + property)** |
| PUT | http://localhost:5000/api/payments/:paymentId/pay | Apply payment **(auth + property)** (body: amountPaid, paymentMode) |
| DELETE | http://localhost:5000/api/payments/:paymentId | Delete payment **(auth + property)** |

**Example (browser):**  
http://localhost:5000/api/payments  
http://localhost:5000/api/payments?month=2025-03  
http://localhost:5000/api/payments/pending  
http://localhost:5000/api/payments/guest/<guestId>  

---

## 5. Rooms — `/api/rooms`

| Method | Full URL | Description |
|--------|----------|-------------|
| GET | http://localhost:5000/api/rooms | List rooms **(auth + property)** |
| POST | http://localhost:5000/api/rooms | Add room **(auth + property)** (body: roomNumber, floor, rent) |
| PUT | http://localhost:5000/api/rooms/:id | Update room **(auth + property)** (body: roomNumber?, floor?, rent?) |
| DELETE | http://localhost:5000/api/rooms/:id | Delete room **(auth + property)** |

**Example (browser):**  
http://localhost:5000/api/rooms  

---

## 6. Dashboard — `/api/dashboard`

| Method | Full URL | Description |
|--------|----------|-------------|
| GET | http://localhost:5000/api/dashboard/summary | Dashboard summary **(auth + property)** (query: `?month=YYYY-MM`) |
| GET | http://localhost:5000/api/dashboard/late-summary | Late payments summary **(auth + property)** |

**Example (browser):**  
http://localhost:5000/api/dashboard/summary  
http://localhost:5000/api/dashboard/summary?month=2025-03  
http://localhost:5000/api/dashboard/late-summary  

---

## 7. Documents (guest) — `/api/documents`

| Method | Full URL | Description |
|--------|----------|-------------|
| GET | http://localhost:5000/api/documents/:guestId | Get guest documents **(auth + property)** |
| POST | http://localhost:5000/api/documents/:guestId | Upload document **(auth + property)** (form-data: document, name?) |
| DELETE | http://localhost:5000/api/documents/:guestId | Delete document **(auth + property)** (body: url) |

**Example (browser):**  
http://localhost:5000/api/documents/<guestId>  

---

## 8. Family — `/api/family`

| Method | Full URL | Description |
|--------|----------|-------------|
| GET | http://localhost:5000/api/family/:guestId | List family members **(auth + property)** |
| POST | http://localhost:5000/api/family/:guestId | Add family member **(auth + property)** (body: name, relation, age?) |
| PUT | http://localhost:5000/api/family/member/:id | Update family member **(auth + property)** (body: name?, relation?, age?) |
| PUT | http://localhost:5000/api/family/member/:id/police-status | Update police status **(auth + property)** (body: status) |
| DELETE | http://localhost:5000/api/family/member/:id | Delete family member **(auth + property)** |

**Example (browser):**  
http://localhost:5000/api/family/<guestId>  

---

## 9. Family documents — `/api/family-documents`

| Method | Full URL | Description |
|--------|----------|-------------|
| GET | http://localhost:5000/api/family-documents/:memberId | Get documents for family member **(auth + property)** |
| POST | http://localhost:5000/api/family-documents/:memberId | Upload document **(auth + property)** (form-data: document, documentType, documentNumber?) |
| DELETE | http://localhost:5000/api/family-documents/:id | Delete family document **(auth + property)** |

**Example (browser):**  
http://localhost:5000/api/family-documents/<memberId>  

---

## 10. Receipts — `/api/receipts`

| Method | Full URL | Description |
|--------|----------|-------------|
| GET | http://localhost:5000/api/receipts/final/:guestId | Generate/download final settlement receipt **(auth + property)** |

**Example (browser):**  
http://localhost:5000/api/receipts/final/<guestId>  
*(Returns PDF; browser may download.)*

---

## Root

| Method | Full URL | Description |
|--------|----------|-------------|
| GET | http://localhost:5000/ | API health message (no auth) |

**Example (browser):**  
http://localhost:5000/  

---

## How to test in the browser

1. **No auth:** Only these work by pasting in the address bar:
   - http://localhost:5000/
   - http://localhost:5000/api/auth/login (POST only; use DevTools or Postman to send body)

2. **With auth:** Use a REST client (Postman, Insomnia, Thunder Client) or a browser extension that lets you set headers:
   - Get token: `POST http://localhost:5000/api/auth/login` with body `{"email":"your@email.com","password":"yourpassword"}`.
   - Then call any GET URL above with header: `Authorization: Bearer <token>` and, where needed, `X-Property-Id: <propertyId>` (get property ID from `GET http://localhost:5000/api/properties`).

3. **Query params:** For GET endpoints that support `month` or `propertyId`, add them in the URL, e.g.:  
   http://localhost:5000/api/payments?month=2025-03  
   http://localhost:5000/api/dashboard/summary?month=2025-03  

Replace `:id`, `:guestId`, `:paymentId`, `:memberId` with real IDs from your data.
