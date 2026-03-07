# ITCLUB 2.0 - Retro Console Website

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full retro console / terminal aesthetic website for a school IT Club's 2nd anniversary
- Boot sequence animation on first load (simulating OS startup)
- Directory-style navigation sidebar with: HOME, ABOUT US, PROJECTS, UPCOMING PROJECTS, RESTRICTED AREA
- Scanline overlay, CRT flicker effects, monospace typography, green-on-black or amber-on-black color palette
- Blinking cursor, typing animation effects throughout
- **Home page**: ITCLUB 1.0 → 2.0 transition animation, club tagline, "version changelog" style display
- **About Us page**: Team members listed as "system processes" or "registered users", roles shown as access levels
- **Projects page**: Completed works displayed as "executed programs" with status codes
- **Upcoming Projects page**: Future work shown as "scheduled tasks" or "queued processes" with progress bars
- **Restricted Area / Secret Project page**:
  - Simulated encryption lock UI with hex/binary scrambled text
  - Wishlist button ("ADD TO DECRYPTION QUEUE") that increments a global counter stored in backend
  - Progress bar showing X/200 supporters needed to decrypt
  - When 200 wishlists reached, reveals "PRAGATI 2.0" project details with a dramatic "DECRYPTION COMPLETE" animation
  - Each user can only wishlist once (tracked by session/principal)
- ASCII art logo for ITCLUB
- Fake system stats in footer: uptime, memory, active users, version
- Random "system log" messages that scroll in the background or corner
- Keyboard navigation hints (press keys to navigate)

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

### Backend (Motoko)
1. `addWishlist(userId: Text) -> async Result<Bool, Text>` - records a wishlist entry, prevents duplicates per principal
2. `getWishlistCount() -> async Nat` - returns total wishlist count
3. `isWishlisted(userId: Text) -> async Bool` - checks if current principal has wishlisted
4. `isProjectRevealed() -> async Bool` - returns true if count >= 200
5. Store wishlist entries as a Set of principal IDs in stable storage

### Frontend
1. Boot sequence loader (ASCII art, fake init messages)
2. Retro terminal layout with directory sidebar navigation
3. CRT scanline + flicker CSS effects
4. Home: version transition (1.0 -> 2.0) with typing animation
5. About Us: team members as system processes
6. Projects: completed works as executed programs
7. Upcoming: scheduled tasks queue view
8. Restricted Area: encrypted UI, wishlist counter, reveal logic with backend integration
9. Footer with fake system stats
10. Ambient scrolling log messages
