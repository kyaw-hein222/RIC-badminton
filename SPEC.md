# Badminton Match Queue Website - SPEC

## Concept & Vision
A clean, functional match queue board for badminton courts. Shows all matches at a glance with ongoing matches highlighted at the top and upcoming matches queued below. Simple public view for everyone; admin panel for managing entries.

## Design Language
- **Aesthetic**: Minimal, sporty, clean — inspired by scoreboard displays
- **Colors**: 
  - Primary: #1a1a2e (dark navy)
  - Accent: #e94560 (energetic red)
  - Surface: #f5f5f5 (light gray)
  - Text: #1a1a2e (dark) / #ffffff (white)
  - Ongoing highlight: #fff3cd (warm yellow bg)
- **Typography**: Inter (Google Font), fallback sans-serif
- **Spacing**: 8px base unit

## Layout & Structure
- Header with title and admin link
- Two sections: **Ongoing Matches** (top, highlighted) and **Upcoming Queue** (below, ordered)
- Each match card shows: Court name, Player 1 vs Player 2, Status badge
- Admin page: simple form + list with edit/delete controls

## Features
- **Public View (index.html)**:
  - Auto-loads match data from localStorage
  - Ongoing matches displayed first (if any)
  - Upcoming matches below in queue order
  - Manual refresh only to minimize AWS API calls and reduce cost

- **Admin Panel (admin.html)**:
  - Add new match: Player 1, Player 2, Court, Status (Ongoing/Upcoming), Queue Order
  - Edit existing match
  - Delete match
  - Toggle match status (Ongoing ↔ Upcoming)

## Data Model
Match object:
```
{
  id: string (uuid),
  player1: string,
  player2: string,
  court: string,
  status: "ongoing" | "upcoming",
  order: number
}
```

## Technical Approach
- Single-page vanilla HTML/CSS/JS
- localStorage for data persistence
- No build step required — runs directly in browser
