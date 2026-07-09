# VMB Dev Test Routes

Canonical repo path: `C:\dev\vmb-canonical`

Local Vite server: `http://localhost:5173`

## Public salon invite URLs

- `http://localhost:5173/salon/preview-salon`
- `http://localhost:5173/salon/jennys-salon`

The public invite experience currently uses `/salon/:slug`. It does not yet use SentInvite token routing.

## Mock salons

- `preview-salon`
- `jennys-salon`

Mock salon data lives in `src/data/mockSalonLanding.js`.

## Salon/admin invite URLs

- Salon owner invites: `http://localhost:5173/salon-invites`
- Admin invites: `http://localhost:5173/salon-invites`
- Salon owner dashboard: `http://localhost:5173/salon-owner/dashboard`
- Admin credential assist queue: `http://localhost:5173/admin/credential-assist`
- Admin network lab: `http://localhost:5173/admin/lab`

Role-gated routes depend on the authenticated user role. Public salon URLs above should remain reachable without login.
