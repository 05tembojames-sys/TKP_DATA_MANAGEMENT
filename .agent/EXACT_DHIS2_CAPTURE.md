# EXACT DHIS2 Capture App Replica

## Official DHIS2 Capture Interface Structure

The DHIS2 Capture app (stable-2-42-3-1) has this exact structure:

```
┌────────────────────────────────────────────────────────────┐
│  DHIS2 Top Bar (Logo | Apps | Search | Profile)          │
├────────────────────────────────────────────────────────────┤
│  Capture                                                   │  ← Page Title
├──────────────┬─────────────────────────────────────────────┤
│              │  Working List                              │  ← Tab Navigation
│              ├─────────────────────────────────────────────┤
│  Org Unit    │  🔎 Search...          [+ Register event] │  ← Action Bar
│  Tree        ├─────────────────────────────────────────────┤
│              │                                             │
│  ▼ Country   │  [Event List Table]                        │  ← Main Content
│    ▶ Region  │                                             │
│    ▼ District│  - Columns: Name, Date, Status, etc.       │
│      Center  │  - Sortable headers                        │
│              │  - Row actions (Edit, View)                │
│              │                                             │
│              │  Showing X-Y of Z entries                  │  ← Pagination
│              │  « ‹ 1 2 3 › »                             │
└──────────────┴─────────────────────────────────────────────┘
```

## Key DHIS2 Design Elements

### Colors
- **Primary Blue**: `#147cd7` (DHIS2 Brand)
- **Hover Blue**: `#1169ba`
- **Light Blue**: `#e8f3fa`
- **Text Dark**: `#212934`
- **Text Gray**: `#494949`
- **Border**: `#d5dde5`
- **Background**: `#f4f6f8`
- **White**: `#ffffff`

### Typography
- Font: Roboto, sans-serif
- Title: 20px, weight 400
- Body: 14px, weight 400
- Labels: 12px, weight 500, uppercase

### Spacing
- Page padding: 24px
- Card padding: 16px
- Element gap: 12px
- Section gap: 24px

---

## Implementation

I'll now create the exact DHIS2 Capture interface for your app!
