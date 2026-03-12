# X-Style Store

## Current State
- Fashion e-commerce storefront with 12 sample products
- Backend has product queries, cart, wishlist, user profiles
- Backend has seedProducts (admin only) but NO add/edit/delete product APIs
- No social links storage in backend
- No admin panel in frontend
- Footer has copyright text but no social links

## Requested Changes (Diff)

### Add
- Backend: `addProduct`, `updateProduct`, `deleteProduct` admin-only functions
- Backend: `getSocialLinks` (public), `saveSocialLinks` (admin-only) for Email/WhatsApp/Instagram
- Frontend: Admin panel at `/#/admin` protected by password `admin123`
  - Products tab: list all products, add new, edit existing, delete
  - Social Links tab: edit email, WhatsApp number, Instagram handle
- Footer: Social links icons (Email, WhatsApp, Instagram) pulled from backend

### Modify
- Footer: Remove copyright text, show social link icons instead
- App.tsx: Add routing so `/#/admin` loads admin panel

### Remove
- Copyright notice from footer

## Implementation Plan
1. Update Motoko backend to add product CRUD admin functions and social links storage
2. Re-generate backend.d.ts with new types
3. Build Admin panel component with password gate, Products tab, Social Links tab
4. Update App.tsx with hash-based routing for `/#/admin`
5. Update footer to show social link icons from backend data
