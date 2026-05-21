# Flare Revamp Plan — Rise to Rice Announcements

## Overview

This plan covers three areas of change:
1. **Flare options** — replacing the current 13 with a tighter, more meaningful set of 10
2. **Storage & management** — moving from a purely hardcoded list to a hybrid approach
3. **Filter UI** — improving how flares appear and behave on both the public feed and admin dashboard

---

## 1. Flare Options — What Changes and Why

### Problems with the current set
- Too granular in some spots (`Water`, `Plastic` are materials, not announcement categories)
- `Rice Impact` is vague and internally-focused — users won't immediately understand it
- `Milestone` and `Community` are rarely useful as filters
- No catch-all `General` flare, so admins are forced into a bad fit
- Missing operationally important flares: `Maintenance`, `Redemption`, `Policy`

### Old → New Mapping

| Old Flare | Action | Becomes |
|---|---|---|
| Rice Impact | ❌ Remove | _(absorbed into General or Sustainability)_ |
| Water | ❌ Remove | _(too granular — material, not announcement type)_ |
| Plastic | ❌ Remove | _(too granular — material, not announcement type)_ |
| Campaign | ♻️ Rename | **Sustainability** |
| Event | ✅ Keep | **Event** |
| Milestone | ❌ Remove | _(absorbed into General)_ |
| Tips | ♻️ Rename | **Sustainability** (merge with Campaign) |
| Rewards | ✅ Keep | **Rewards** |
| Urgent | ✅ Keep | **Urgent** |
| Community | ❌ Remove | _(absorbed into General or Partners)_ |
| Schedule | ✅ Keep | **Scheduling** |
| Update | ♻️ Split | **Maintenance** + **Policy** |
| Partnership | ♻️ Rename | **Partners** |
| _(missing)_ | ➕ Add | **Materials** |
| _(missing)_ | ➕ Add | **Redemption** |
| _(missing)_ | ➕ Add | **General** _(default)_ |

### New Flare Set (10 total)

Grouped for admin UX when selecting — shown as flat list in filters.

**Operational**
| Flare | Icon | Color | Purpose |
|---|---|---|---|
| 📅 Scheduling | `CalendarDays` | Orange | Collection schedules, drop-off dates |
| 🛠️ Maintenance | `Wrench` | Slate | Downtime, system or facility updates |
| 📋 Policy | `ClipboardList` | Cyan | Rule or program changes |

**Program-Specific**
| Flare | Icon | Color | Purpose |
|---|---|---|---|
| ♻️ Materials | `Recycle` | Rose | Accepted/rejected recyclable updates |
| 🎁 Rewards | `Gift` | Pink | New rewards, availability changes |
| 🌾 Redemption | `Wheat` | Amber | Redemption windows, reminders |
| 🤝 Partners | `Handshake` | Lime | Partner announcements, collaborations |

**Community & Engagement**
| Flare | Icon | Color | Purpose |
|---|---|---|---|
| 🌱 Sustainability | `Leaf` | Emerald | Eco tips, recycling education |
| 📢 General | `Megaphone` | Indigo | Catch-all; **default selection** |
| 🔴 Urgent | `AlertTriangle` | Red | Time-sensitive notices |

---

## 2. Storage & Management

### Current approach
Hardcoded `FLARE_OPTIONS` array and `FLARES` config object in the frontend. No backend record. No admin control over the list itself.

### Recommended: Keep hardcoded, but structure it better

Full DB storage (letting admins create/delete custom flares) is overkill for this app. Admins at Rise to Rice are a small, trusted group, and flare definitions are tied to icons and color configs that are frontend-specific anyway.

**The right middle ground:**

- Keep flares hardcoded in the frontend (your existing pattern is fine)
- The backend stores the selected flare as a **plain string** on each announcement record
- Add a `default` flag in the config so the system knows what to pre-select
- Make flare **required** on post creation (no null values in the DB)

### Updated config structure

```ts
type FlareConfig = {
  icon: LucideIcon;
  label: { en: string; tl: string };   // ← add i18n labels
  group: "operational" | "program" | "community";  // ← for grouped admin picker
  default?: boolean;                   // ← marks General as pre-selected
  active: string;
  filterInactive: string;
  formInactive: string;
  badge: string;
};
```

The `label` field feeds your `en`/`tl` i18n without touching your `announcements` namespace JSON manually — the config is the source of truth, and you extract translations from it at build time or pass them directly to `t()`.

### Backend change

Ensure the announcements table/model has:
- `flare` as a **non-nullable string** with a check constraint or enum matching the 10 values
- Default value of `"General"` at the DB level as a safety net

---

## 3. Filter UI — What Changes

### Public `/announcements` page

**Current problem (assumed):** Filters likely show all flares as a flat horizontal pill list, which gets crowded.

**Changes:**
- Show flares as a **scrollable horizontal pill row** on mobile, **wrapped pill group** on desktop
- Add an **"All"** pill at the start (selected by default, shows everything)
- Active filter pill uses the flare's `active` color class (same as today)
- Inactive pills use `filterInactive` (same as today)
- When a flare filter is active, show a subtle **result count** next to the heading: `"Showing 4 Scheduling announcements"`

### Admin dashboard announcements

**Changes:**
- Group flares in the **post form** by their `group` field using a visual section divider — admins see "Operational / Program-Specific / Community & Engagement" when choosing
- In the **announcement list table**, flare badge renders using the `badge` class (same as today)
- Add flare as a **column filter** in the admin list, consistent with your other dashboard filter patterns (`searchFor` style)

### Search behavior with flare filter active

Since flare is now required (no unflared posts), this is clean:
- `?flare=Scheduling` returns only Scheduling posts
- `?flare=` or no param returns all posts (same as "All" pill selected)
- Text search and flare filter can be **combined** — filter by flare first, then search within results

---

## Implementation Order

1. **Update `flares.ts`** — replace the 13-flare config with the 10-flare config, add `group`, `label`, and `default` fields
2. **Update backend** — make `flare` non-nullable, set default to `"General"`, add the new valid values
3. **Migrate existing data** — map old flare values to new ones using the table above (one-time script)
4. **Update the post form** — grouped flare picker, `General` pre-selected
5. **Update the public filter UI** — add "All" pill, result count label
6. **Update admin list filter** — add flare dropdown/filter consistent with other dashboard views
7. **Add i18n labels** — add `en`/`tl` flare label strings to the `announcements` namespace