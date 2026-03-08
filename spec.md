# ITCLUB 2.0

## Current State
- Full retro CRT terminal website with 5 sections: Home, About, Projects, Upcoming, Restricted
- AboutSection shows team members (ROOT/ADMIN/DEV_LEAD/USER) in a process table
- ProjectsSection shows completed projects as executed programs with static descriptions
- RestrictedSection has PRAGATI 2.0 encrypted block with a 200-node wishlist decrypt mechanic
- No admin authentication exists anywhere
- App.tsx manages section routing via a `Section` type union

## Requested Changes (Diff)

### Add
- `AdminAuthPage` component: retro terminal login screen with username/password fields
  - Credentials: username `itbvbkdlr`, password `Itbvb@02`
  - On success: store `adminAuthenticated = true` in React context + localStorage
  - On failure: show retro "ACCESS DENIED" error with flashing red text
  - Accessible only when clicking ROOT, ADMIN, or DEV_LEAD badge/row in AboutSection
- `AdminContext` (React context): holds `isAdmin` boolean, `login(u, p)`, `logout()` functions
- Admin edit mode in `ProjectsSection`:
  - When `isAdmin` is true, each project's `name` and `description` fields become inline-editable (contenteditable or input fields)
  - A save button per project (or auto-save on blur) persists edits to localStorage
  - Visual indicator: green `[EDIT MODE ACTIVE]` badge in header when admin
- Admin encrypt/decrypt toggle in `RestrictedSection`:
  - When `isAdmin` is true, show a single `[ ENCRYPT / DECRYPT ]` toggle button
  - Clicking it manually toggles the revealed state (overrides the 200-node threshold)
  - The button shows current state: `[ FORCE DECRYPT ]` or `[ RE-ENCRYPT ]`
  - This is purely frontend state — it does not call the backend wishlist counter

### Modify
- `AboutSection`: make ROOT, ADMIN, DEV_LEAD access badges clickable (cursor-pointer, subtle glow on hover); clicking navigates to admin auth page
- `App.tsx`: add `"admin-auth"` to the `Section` union type; pass `onNavigate` down so `AboutSection` can trigger navigation
- `TerminalLayout.tsx`: render `AdminAuthPage` when `activeSection === "admin-auth"`
- `RestrictedSection`: when `isAdmin`, show the force toggle button alongside the existing UI
- `ProjectsSection`: when `isAdmin`, render edit controls on each project card

### Remove
- Nothing removed

## Implementation Plan
1. Create `AdminContext.tsx` with `isAdmin` state, `login()`, `logout()`, persisted to localStorage
2. Create `AdminAuthPage.tsx` — terminal-styled auth form, retro boot-style, with error state
3. Modify `App.tsx` to wrap app in `AdminProvider`, add `"admin-auth"` to Section union
4. Modify `TerminalLayout.tsx` to render `AdminAuthPage` and pass `onNavigate` to `AboutSection`
5. Modify `AboutSection.tsx` to accept `onNavigate` prop and attach click handlers to ROOT/ADMIN/DEV_LEAD rows
6. Modify `ProjectsSection.tsx` to consume `AdminContext`, render inline edit fields and save-to-localStorage when admin
7. Modify `RestrictedSection.tsx` to consume `AdminContext`, show force encrypt/decrypt button when admin
